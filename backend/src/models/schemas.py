from pydantic import BaseModel
from typing import Optional

class TelemetryData(BaseModel):
    station_id: str
    pm25: float
    pm10: float
    no2: float
    so2: float
    o3: float    # NEW: Ozone (µg/m³)
    co: float    # NEW: Carbon Monoxide (mg/m³)
    nh3: float   # NEW: Ammonia (µg/m³)
    pb: Optional[float] = None  # Static / Manual Lab Ingestion
    timestamp: str
