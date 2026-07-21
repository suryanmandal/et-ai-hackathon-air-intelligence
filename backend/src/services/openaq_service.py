import requests
import os

def fetch_live_pollutants(location_id: int):
    """
    Query OpenAQ v3 API for specific station telemetry.
    """
    url = f"https://api.openaq.org/v3/locations/{location_id}/latest"
    api_key = os.environ.get("OPENAQ_API_KEY", "YOUR_OPENAQ_API_KEY")
    headers = {"X-API-Key": api_key}
    
    try:
        response = requests.get(url, headers=headers)
        response.raise_for_status()
        data = response.json()
        
        # Map sensors: o3, co, nh3, pm25, pm10, no2, so2
        return data.get("results", [])
    except Exception as e:
        print(f"Error fetching from OpenAQ: {e}")
        return []
