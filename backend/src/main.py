import os
import joblib
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .database import init_db
from .api.routes import router as api_router
from .ml.train_ensemble import load_and_prep_data, train_models, evaluate_and_save

ml_models = {}

@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    FastAPI app lifespan context manager. Handles startup database migration,
    model auto-training/verification, and memory loading.
    """
    # Initialize the database schema and extensions (PostGIS)
    print("[Lifespan] Initializing database extension and schemas...")
    await init_db()

    # Resolve paths relative to this script directory
    src_dir = os.path.dirname(os.path.abspath(__file__))
    backend_root = os.path.abspath(os.path.join(src_dir, ".."))
    models_dir = os.path.join(backend_root, "models")
    
    rf_path = os.path.join(models_dir, "rf_model.pkl")
    xgb_path = os.path.join(models_dir, "xgb_model.json")

    # Self-healing mechanism: Automatically run MLOps pipeline if files are missing
    if not os.path.exists(rf_path) or not os.path.exists(xgb_path):
        print("[Lifespan] ML model artifacts not found on disk. Initiating training pipeline...")
        X_train, X_val, y_train, y_val = load_and_prep_data()
        rf_model, xgb_model = train_models(X_train, y_train)
        evaluate_and_save(rf_model, xgb_model, X_val, y_val, models_dir)

    # Load model binaries into global registry
    print(f"[Lifespan] Loading Random Forest model: {rf_path}")
    ml_models["rf"] = joblib.load(rf_path)
    
    print(f"[Lifespan] Loading XGBoost model: {xgb_path}")
    ml_models["xgb"] = joblib.load(xgb_path)

    # Mount models to application state
    app.state.ml_models = ml_models
    
    yield
    
    # Teardown / memory release on shutdown
    ml_models.clear()
    print("[Lifespan] Cleaned up model registry on shutdown.")


app = FastAPI(
    title="VayuSense API",
    description="Hyperlocal Air Quality Forecasting and Spatial Analysis Backend",
    version="1.0.0",
    lifespan=lifespan
)

# Enable CORS for frontend integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routes under /api/v1 prefix
app.include_router(api_router, prefix="/api/v1")


@app.get("/health")
async def health_check():
    """
    Health check endpoint for container/orchestrator probing.
    """
    return {
        "status": "healthy",
        "models_loaded": "rf" in ml_models and "xgb" in ml_models
    }
