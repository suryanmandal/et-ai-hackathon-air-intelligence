from fastapi import APIRouter, Request, HTTPException
from pydantic import BaseModel, Field
import pandas as pd

router = APIRouter()

class ScenarioSimulationRequest(BaseModel):
    h3_index: str = Field(..., description="Uber H3 Resolution 8 hexagon index string", json_schema_extra={"example": "8838a1262dfffff"})
    traffic_density_scalar: float = Field(..., description="Multiplier for traffic volume (e.g., 1.45 for +45%)", json_schema_extra={"example": 1.45})
    industrial_output_scalar: float = Field(..., description="Multiplier for industrial emissions (e.g., 0.80 for -20%)", json_schema_extra={"example": 0.80})
    wind_speed_ms: float = Field(..., description="Wind speed in meters per second", json_schema_extra={"example": 3.5})
    base_pm25: float = Field(..., description="Baseline PM2.5 measurement in ug/m3", json_schema_extra={"example": 45.0})


@router.post("/predict/scenario")
async def predict_scenario(request: Request, body: ScenarioSimulationRequest):
    """
    Executes a 12-hour hyperlocal air quality projection under custom environmental
    and socio-economic scenarios. Returns a timeseries trajectory suited for frontend rendering.
    """
    # Retrieve ensemble models from application state
    ml_models = getattr(request.app.state, "ml_models", None)
    if not ml_models or "rf" not in ml_models or "xgb" not in ml_models:
        raise HTTPException(
            status_code=503,
            detail="Machine learning ensemble models not loaded on backend server."
        )

    rf_model = ml_models["rf"]
    xgb_model = ml_models["xgb"]

    current_pm25 = body.base_pm25
    trajectory_12h = []

    # Features column layout matching model requirements
    feature_cols = [
        "pm25_lag_1h", "pm25_lag_24h", "wind_speed", "wind_direction_deg",
        "temp_c", "humidity_pct", "traffic_density_scalar", "industrial_emissions_scalar",
        "is_winter_inversion"
    ]

    try:
        # Autoregressively simulate 12 hours forward
        for hour in range(1, 13):
            # Construct feature vector for current timestep
            features = [
                current_pm25,                       # pm25_lag_1h
                body.base_pm25,                     # pm25_lag_24h (approximate baseline)
                body.wind_speed_ms,                 # wind_speed
                180.0,                              # wind_direction_deg (default)
                28.0,                               # temp_c (default)
                75.0,                               # humidity_pct (default)
                body.traffic_density_scalar,         # traffic_density_scalar
                body.industrial_output_scalar,      # industrial_emissions_scalar
                0                                   # is_winter_inversion (default)
            ]

            # Represent as pandas DataFrame for inference pipeline
            X = pd.DataFrame([features], columns=feature_cols)

            # Get model outputs
            rf_val = float(rf_model.predict(X)[0])
            xgb_val = float(xgb_model.predict(X)[0])

            # Apply ensemble weights: 0.4 RF, 0.6 XGB
            predicted_pm25 = (0.4 * rf_val) + (0.6 * xgb_val)
            
            # Lower bound to 0
            predicted_pm25 = max(0.0, predicted_pm25)

            trajectory_12h.append(predicted_pm25)
            # Use current prediction as lag_1h for next timestep
            current_pm25 = predicted_pm25

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Inference execution failed during forecasting loop: {str(e)}"
        )

    # Compute projected peak PM2.5 over the simulated trajectory
    projected_peak_pm25 = max(trajectory_12h)

    return {
        "h3_index": body.h3_index,
        "model_rmse": 11.42,
        "projected_peak_pm25": float(projected_peak_pm25),
        "trajectory_12h": [float(val) for val in trajectory_12h]
    }


from fastapi.concurrency import run_in_threadpool

class AgentAnalysisRequest(BaseModel):
    h3_index: str = Field(..., description="Target H3 resolution 8 hexagon index", json_schema_extra={"example": "8838a1262dfffff"})
    base_pm25: float = Field(..., description="Baseline PM2.5 concentration in ug/m3", json_schema_extra={"example": 45.0})


@router.post("/agents/analyze")
async def analyze_with_agents(body: AgentAnalysisRequest):
    """
    Triggers a CrewAI multi-agent workflow (Spatial Analyst, Compliance Auditor, Policy Planner)
    to audit emissions around a specific hexagon and generate an action plan.
    """
    # Import inside to prevent circular import issues
    from ..agents.crew import run_vayu_crew
    
    try:
        # Execute the CrewAI logic in a separate thread to keep FastAPI non-blocking
        report = await run_in_threadpool(run_vayu_crew, body.h3_index, body.base_pm25)
        return {
            "h3_index": body.h3_index,
            "agent_report": report
        }
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Multi-agent simulation run failed: {str(e)}"
        )
