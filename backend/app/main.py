from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os

app = FastAPI(
    title="VayuSense AI Orchestration & Inference API",
    description="Enterprise-grade Municipal Environmental Monitoring & Automated Regulatory Command Engine",
    version="0.1.0"
)

# Configure CORS for Next.js frontend communication
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Restrict this in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {
        "status": "online",
        "service": "VayuSense AI Engine",
        "version": "0.1.0"
    }

@app.get("/health")
def health_check():
    return {"status": "healthy"}
