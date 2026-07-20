import numpy as np
import rasterio
from rasterio.warp import transform as warp_transform
import h3

class SentinelRasterProcessor:
    """
    Processor for Sentinel-5P TROPOMI raster files to extract particulate and gas concentrations
    and map them to Uber H3 hexagonal cells.
    """

    @staticmethod
    def process_tropomi_raster(file_path: str, qa_threshold: float = 0.50) -> list[dict]:
        """
        Reads a multi-band TROPOMI raster file, filters out low quality pixels,
        projects to EPSG:4326, maps them to H3 cells, and returns an aggregated dataset.

        Args:
            file_path: Path to the GeoTIFF or NetCDF raster file.
            qa_threshold: Minimum Quality Assurance value (0.0 to 1.0) to retain pixels.

        Returns:
            A list of dicts with keys: h3_index, no2_column_density, centroid_lat, centroid_lon.
        """
        with rasterio.open(file_path) as dataset:
            # Band 1: Particulate/Gas Concentration (e.g. NO2)
            concentration_band = dataset.read(1)
            # Band 2: Quality Assurance Mask (QA values range 0.0 - 1.0)
            qa_band = dataset.read(2)

            # Apply masking based on QA threshold
            valid_mask = qa_band >= qa_threshold
            
            # Find row and col indices of all pixels matching the QA threshold
            rows, cols = np.where(valid_mask)
            
            if len(rows) == 0:
                return []

            # Extract the raw concentrations for valid pixels
            concentrations = concentration_band[valid_mask]

            # Convert row/col indices into coordinate system of the raster (x, y)
            xs, ys = rasterio.transform.xy(dataset.transform, rows, cols)

            # Ensure coordinates are in WGS 84 (EPSG:4326) for H3 indexing
            # If raster CRS is already EPSG:4326, we can map directly. Otherwise, reproject.
            if dataset.crs and dataset.crs.to_string() != "EPSG:4326":
                # Convert coords from raster's local CRS to EPSG:4326 (longitude, latitude)
                lons, lats = warp_transform(dataset.crs, "EPSG:4326", xs, ys)
            else:
                lons, lats = xs, ys

            # Aggregate pixel values by H3 cell at Resolution 8
            h3_aggregation = {}
            for lat, lon, val in zip(lats, lons, concentrations):
                # Filter out standard NaN values from the raster data
                if np.isnan(val):
                    continue
                
                # Convert geographic coordinate to H3 Resolution 8 index
                h3_index = h3.geo_to_h3(lat, lon, 8)
                
                if h3_index not in h3_aggregation:
                    h3_aggregation[h3_index] = []
                h3_aggregation[h3_index].append(val)

            # Format the aggregated list
            results = []
            for h3_index, values in h3_aggregation.items():
                avg_concentration = float(np.mean(values))
                # Retrieve the exact centroid lat/lon of the H3 cell
                centroid_lat, centroid_lon = h3.h3_to_geo(h3_index)
                
                results.append({
                    "h3_index": h3_index,
                    "no2_column_density": avg_concentration,
                    "centroid_lat": float(centroid_lat),
                    "centroid_lon": float(centroid_lon)
                })

            return results


def get_hex_neighbors(h3_index: str, ring_distance: int = 1) -> list[str]:
    """
    Returns the H3 index list of all neighboring hexagons within the specified
    ring distance (k-ring), including the origin hexagon.

    Args:
        h3_index: Origin Uber H3 hex index string.
        ring_distance: Distance of neighbor ring (k).

    Returns:
        List of neighboring H3 cell index strings.
    """
    # h3.k_ring returns a set in python h3-py v3
    return list(h3.k_ring(h3_index, ring_distance))
