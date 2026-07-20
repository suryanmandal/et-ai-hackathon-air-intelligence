import os
import asyncio
import joblib
import h3
import pandas as pd
import numpy as np
from typing import List, Dict, Any
from sqlalchemy import select
from geoalchemy2.functions import ST_Distance, ST_GeomFromText
from crewai.tools import tool

from ..database import AsyncSessionLocal
from ..models.spatial import Facility
from .raster_engine import get_hex_neighbors

async def _get_facilities_near_hex_async(h3_index: str, max_distance_meters: float) -> List[Dict[str, Any]]:
    """
    Internal asynchronous function to query facilities near an H3 hex centroid.
    """
    lat, lon = h3.h3_to_geo(h3_index)
    
    async with AsyncSessionLocal() as session:
        # Create a WKT Point geometry for the H3 cell centroid
        point_wkt = f"POINT({lon} {lat})"
        
        # Select all facilities within the threshold distance, ordered by proximity
        stmt = (
            select(Facility)
            .filter(
                ST_Distance(
                    Facility.geom, 
                    ST_GeomFromText(point_wkt, 4326)
                ) <= max_distance_meters
            )
            .order_by(
                ST_Distance(
                    Facility.geom, 
                    ST_GeomFromText(point_wkt, 4326)
                )
            )
        )
        result = await session.execute(stmt)
        facilities = result.scalars().all()
        
        return [
            {
                "id": str(f.id),
                "facility_id": f.facility_id,
                "name": f.name,
                "category": f.category,
                "compliance_status": f.compliance_status
            }
            for f in facilities
        ]


@tool("Hexagon Neighbor Inspector")
def inspect_hexagon_neighbors(h3_index: str, ring_distance: int = 1) -> List[str]:
    """
    Returns H3 indexes of all hexagons adjacent to the target hexagon within a given distance.
    Useful for tracking pollution plumes or identifying spreading wind directions.
    """
    return get_hex_neighbors(h3_index, ring_distance)


@tool("Air Quality Scenario Forecaster")
def forecast_air_quality_scenario(
    h3_index: str,
    traffic_density_scalar: float,
    industrial_output_scalar: float,
    wind_speed_ms: float,
    base_pm25: float
) -> Dict[str, Any]:
    """
    Runs a 12-hour simulation using the Random Forest/XGBoost ensemble model to predict
    how local PM2.5 levels will change given specific changes in traffic, industrial emission, and wind.
    """
    # Resolve the models path
    script_dir = os.path.dirname(os.path.abspath(__file__))
    backend_root = os.path.abspath(os.path.join(script_dir, "..", ".."))
    models_dir = os.path.join(backend_root, "models")
    
    rf_path = os.path.join(models_dir, "rf_model.pkl")
    xgb_path = os.path.join(models_dir, "xgb_model.json")
    
    if not os.path.exists(rf_path) or not os.path.exists(xgb_path):
        return {"error": "Model binaries not found. Start the FastAPI server first to auto-train models."}

    # Load model artifacts
    rf = joblib.load(rf_path)
    xgb_model = joblib.load(xgb_path)

    current_pm25 = base_pm25
    trajectory = []
    
    feature_cols = [
        "pm25_lag_1h", "pm25_lag_24h", "wind_speed", "wind_direction_deg",
        "temp_c", "humidity_pct", "traffic_density_scalar", "industrial_emissions_scalar",
        "is_winter_inversion"
    ]

    for _ in range(12):
        features = [
            current_pm25,                  # pm25_lag_1h
            base_pm25,                     # pm25_lag_24h (approximate baseline)
            wind_speed_ms,                 # wind_speed
            180.0,                         # wind_direction_deg
            28.0,                          # temp_c
            75.0,                          # humidity_pct
            traffic_density_scalar,        # traffic_density_scalar
            industrial_output_scalar,     # industrial_emissions_scalar
            0                              # is_winter_inversion
        ]
        
        X = pd.DataFrame([features], columns=feature_cols)
        rf_val = float(rf.predict(X)[0])
        xgb_val = float(xgb_model.predict(X)[0])
        
        predicted_pm25 = max(0.0, 0.4 * rf_val + 0.6 * xgb_val)
        trajectory.append(predicted_pm25)
        current_pm25 = predicted_pm25

    return {
        "h3_index": h3_index,
        "projected_peak_pm25": float(max(trajectory)),
        "trajectory_12h": [float(val) for val in trajectory]
    }


@tool("Facility Location Searcher")
def find_facilities_near_hexagon(h3_index: str, max_distance_meters: float = 5000.0) -> List[Dict[str, Any]]:
    """
    Queries the PostGIS database to find active facilities (e.g. factories, construction sites)
    within a certain radius (meters) of a specific H3 hexagon centroid. Useful for identifying
    emitters responsible for high PM2.5 readings.
    """
    try:
        # Run the async DB query within a new event loop synchronously for CrewAI
        loop = asyncio.new_event_loop()
        asyncio.set_event_loop(loop)
        try:
            results = loop.run_until_complete(_get_facilities_near_hex_async(h3_index, max_distance_meters))
        finally:
            loop.close()
        return results
    except Exception as e:
        return [{"error": f"Database spatial query failed: {str(e)}"}]
