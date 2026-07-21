def generate_evalscript(layer_type: str) -> str:
    """
    Generate Sentinel Hub Evalscript for specific pollutant layers.
    Supported types: L2__O3____, L2__CO____, L2__NO2___, L2__SO2___
    """
    base_evalscript = """
    // VERSION=3
    function setup() {{
      return {{
        input: ["{layer}", "dataMask"],
        output: {{ bands: 4 }}
      }};
    }}

    function evaluatePixel(sample) {{
      if (sample.dataMask === 0) return [0, 0, 0, 0];
      let val = sample.{layer};
      return [val * 10, val * 5, 0, 1]; // Basic RGBA visualizer
    }}
    """
    
    if layer_type in ["L2__O3____", "L2__CO____", "L2__NO2___", "L2__SO2___"]:
        return base_evalscript.format(layer=layer_type)
    else:
        raise ValueError(f"Unsupported layer type: {layer_type}")
