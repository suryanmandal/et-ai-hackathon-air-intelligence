"use client";

import React, { useState, useEffect } from "react";

export default function GeospatialDataControls() {
  // View Mode: 'monochrome' (standard vector base map) or 'satellite' (active satellite plume map)
  const [viewMode, setViewMode] = useState<"monochrome" | "satellite">("monochrome");

  // Ingestion Processing Animation state
  const [isProcessingPipeline, setIsProcessingPipeline] = useState(false);

  // Layer states
  const [caaQmsNodes, setCaaQmsNodes] = useState(true);
  const [trafficGrids, setTrafficGrids] = useState(false);
  const [factoryPerimeters, setFactoryPerimeters] = useState(true);
  const [sentinelPlume, setSentinelPlume] = useState(false);

  // Active Map style
  const [activeStyle, setActiveStyle] = useState<"monochrome" | "satellite" | "hybrid">("monochrome");

  // PostGIS simulated live query stream
  const [queryIndex, setQueryIndex] = useState(0);
  const queries = [
    {
      sql: "SELECT ST_AsGeoJSON(geom)\nFROM caaqms_nodes\nWHERE spatial_status = 'ACTIVE';",
      streamId: "9X-214",
      result: "// Result: 247 geometries returned in 12ms"
    },
    {
      sql: "SELECT ST_Centroid(geom)\nFROM factory_perimeters\nWHERE compliance_level = 'CRITICAL';",
      streamId: "5Y-884",
      result: "// Result: 18 factory centroids computed in 8ms"
    },
    {
      sql: "SELECT ST_Intersection(roads.geom, grids.geom)\nFROM heavy_logistics_grids grids\nJOIN roads ON ST_Intersects(roads.geom, grids.geom);",
      streamId: "2A-352",
      result: "// Result: 142 intersected line segments in 34ms"
    },
    {
      sql: "UPDATE active_zones\nSET aqi = 412, last_audited = NOW()\nWHERE zone_id = 'MUM_042';",
      streamId: "7D-109",
      result: "// Result: 1 row updated in 4ms"
    },
    {
      sql: "SELECT ST_Buffer(geom, 1000)\nFROM factory_perimeters\nWHERE emissions > 300;",
      streamId: "4C-501",
      result: "// Result: 5 buffers calculated in 15ms"
    }
  ];

  // Pipeline Ingestion Logs state
  const [pipelineLogs, setPipelineLogs] = useState<string[]>([
    "ESA Copernicus Hub Sync Ready. Connection [IDLE]",
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      setQueryIndex((prev) => (prev + 1) % queries.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Style change handler (binds viewMode to monochrome or satellite)
  const handleStyleChange = (style: "monochrome" | "satellite" | "hybrid") => {
    setActiveStyle(style);
    if (style === "monochrome") {
      setViewMode("monochrome");
    } else {
      setViewMode("satellite");
    }
  };

  // Pipeline Sync handler
  const handlePipelineSync = () => {
    if (isProcessingPipeline) return;
    setIsProcessingPipeline(true);
    setViewMode("satellite");
    setActiveStyle("satellite");
    setPipelineLogs([]);

    // Log Stream Sequence
    setTimeout(() => {
      setPipelineLogs((prev) => [
        ...prev,
        "ESA Copernicus Data Hub Connection Established... [OK]"
      ]);
    }, 100);

    setTimeout(() => {
      setPipelineLogs((prev) => [
        ...prev,
        "Dataset Stream: Sentinel-5P TROPOMI Level-3 (NO2/SO2) Gas Concentration..."
      ]);
    }, 1000);

    setTimeout(() => {
      setPipelineLogs((prev) => [
        ...prev,
        "Raster Matrix: Processing 44km footprint tiles over region centroid..."
      ]);
    }, 2000);

    setTimeout(() => {
      setPipelineLogs((prev) => [
        ...prev,
        "Distortion Filter: Executing cloud-masking algorithms (QA value > 0.50)... [ACTIVE]"
      ]);
    }, 3000);

    setTimeout(() => {
      setPipelineLogs((prev) => [
        ...prev,
        "Raster Realignment: Mapping 2D thermal plumes to Uber H3 coordinates... [DONE]"
      ]);
      setIsProcessingPipeline(false);
    }, 4000);
  };

  // Export Dataset Handler
  const handleExport = () => {
    const data = {
      timestamp: new Date().toISOString(),
      activeLayers: { caaQmsNodes, trafficGrids, factoryPerimeters, sentinelPlume },
      mapStyle: activeStyle,
      viewMode,
      pipelineSyncedLogs: pipelineLogs,
      focusCoordinates: { lat: 19.0760, lon: 72.8777 },
      activeQueryStream: queries[queryIndex]
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `VayuSense_Satellite_Export_${Date.now()}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex-grow flex flex-col md:flex-row overflow-hidden w-full h-full relative">
      
      {/* Main Map Viewport */}
      <section id="mapbox-vector-engine" className="relative flex-1 h-full bg-[#05080a] overflow-hidden border-r border-[#3c4a42]/30">
        <div className="absolute inset-0 z-0">
          <div
            className={`w-full h-full bg-center bg-cover transition-all duration-700 ${
              viewMode === "monochrome" 
                ? "grayscale opacity-45" 
                : "opacity-60 grayscale brightness-[0.4]"
            }`}
            style={{
              backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuDNIjSLpTxpVaORRZboAUHr2gLDn5zfLFC-FuxMnUHkzbDNOp3AVR7DalSBUwil0UqpeeFnC08bKbtTD16ABB9nVqRzP-hghK8MJgzHS7RjWVJnnWebcx98M74wHhUq3u5FYv9XCc-F_eW_A85-QpiC9ynPQI-fM-je4B1G7iFN7HqYrdZklCghNiyqwlQVR2-eOEZKYke_q5R46jiCi1GSDyMrWCCFxL64HPMxuP5PMcNJtLm56rKaCjyP6IyEfv7STT-1oGXOSrA')`,
              filter: viewMode === "monochrome"
                ? (activeStyle === "satellite" 
                  ? "brightness(0.9) contrast(1.1) saturate(1.2) grayscale(0%)" 
                  : activeStyle === "hybrid"
                  ? "brightness(0.8) contrast(1.1) grayscale(30%)"
                  : "brightness(0.6) contrast(1.2) grayscale(100%)")
                : undefined
            }}
          />
          <div className="map-grid-overlay absolute inset-0"></div>

          {(viewMode === "satellite" || sentinelPlume) && (
            <div className="absolute inset-0 z-10 pointer-events-none">
              <div className="w-full h-full opacity-70">
                <div className="w-full h-full" style={{ background: "radial-gradient(circle at 45% 45%, rgba(0,0,0,0) 0%, rgba(0,0,0,0.8) 100%)" }}></div>
                <div className="absolute inset-0 overflow-hidden">
                  <div className="absolute top-1/4 left-1/4 w-[60%] h-[60%] blur-[60px] bg-gradient-to-br from-purple-900/40 via-red-800/50 to-orange-600/30 animate-pulse"></div>
                </div>
              </div>
            </div>
          )}

          {viewMode === "monochrome" && caaQmsNodes && (
            <div className="absolute inset-0 pointer-events-none p-24">
              <div className="grid grid-cols-12 gap-12 opacity-80">
                <div className="h3-hexagon w-16 h-16 bg-primary/20 border border-primary/60 flex items-center justify-center animate-pulse">
                  <span className="text-[8px] text-primary font-mono font-bold">AQI 42</span>
                </div>
                <div className="h3-hexagon w-16 h-16 bg-primary/30 border border-primary/80 col-start-4 row-start-2 animate-pulse" style={{ animationDelay: "1s" }}></div>
                <div className="h3-hexagon w-16 h-16 bg-primary/20 border border-primary/60 col-start-2 row-start-5"></div>
                <div className="h3-hexagon w-16 h-16 bg-primary/40 border border-primary col-start-7 row-start-3 animate-pulse" style={{ animationDelay: "0.5s" }}></div>
                <div className="h3-hexagon w-16 h-16 bg-primary/20 border border-primary/60 col-start-5 row-start-6"></div>
              </div>
            </div>
          )}

          {trafficGrids && (
            <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 1000 1000">
              <path d="M150 150 L350 200 L550 180 L800 240" fill="none" stroke="#f59e0b" strokeWidth="4" opacity="0.6" strokeDasharray="8 4"></path>
              <path d="M220 400 L400 380 L600 420 L750 390" fill="none" stroke="#f59e0b" strokeWidth="4" opacity="0.6" strokeDasharray="8 4"></path>
              <path d="M100 800 L450 780 L600 850 L900 800" fill="none" stroke="#f59e0b" strokeWidth="3" opacity="0.4" strokeDasharray="6 3"></path>
            </svg>
          )}

          {factoryPerimeters && (
            <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 1000 1000">
              <path d="M700 300 L850 350 L820 500 L680 480 Z" fill="rgba(252, 124, 120, 0.05)" stroke="#fc7c78" strokeDasharray="4 2" strokeWidth="1.5"></path>
              <path d="M400 600 L550 620 L530 750 L380 730 Z" fill="rgba(252, 124, 120, 0.05)" stroke="#fc7c78" strokeDasharray="4 2" strokeWidth="1.5"></path>
            </svg>
          )}
        </div>

        {isProcessingPipeline && (
          <div className="absolute top-[20%] left-[20%] w-[50%] h-[50%] border border-cyan-500/40 z-20 pointer-events-none">
            <div className="absolute -top-1 -left-1 w-4 h-4 border-t-2 border-l-2 border-cyan-400"></div>
            <div className="absolute -top-1 -right-1 w-4 h-4 border-t-2 border-r-2 border-cyan-400"></div>
            <div className="absolute -bottom-1 -left-1 w-4 h-4 border-b-2 border-l-2 border-cyan-400"></div>
            <div className="absolute -bottom-1 -right-1 w-4 h-4 border-b-2 border-r-2 border-cyan-400"></div>
            <div className="scanning-line"></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-3">
              <div className="bg-black/60 backdrop-blur-md border border-cyan-500/50 px-4 py-2 rounded shadow-2xl flex items-center gap-3">
                <span className="material-symbols-outlined text-cyan-400 text-sm animate-spin">refresh</span>
                <span className="text-[10px] font-mono text-cyan-400 tracking-widest uppercase font-bold">
                  PROCESSING: CLOUD MASK REMOVAL FILTER (QA &gt; 0.50)
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Floating PostGIS Control Card */}
        <div className="absolute top-6 left-6 w-[320px] bg-slate-900/90 backdrop-blur-md border border-slate-800 shadow-2xl z-30 text-left">
          <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/40">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-sm">layers</span>
              <h2 className="text-xs font-bold uppercase tracking-wider text-white">Geospatial Matrix Filter</h2>
            </div>
            <button className="material-symbols-outlined text-slate-500 text-xs hover:text-white">more_vert</button>
          </div>
          <div className="p-2 flex flex-col gap-1">
            <div 
              onClick={() => setCaaQmsNodes(!caaQmsNodes)}
              className={`flex items-center justify-between p-2 hover:bg-slate-800 transition-colors group cursor-pointer ${!caaQmsNodes ? 'opacity-40' : ''}`}
            >
              <span className="text-xs font-semibold text-slate-300">IoT Ground Sensors (CAAQMS)</span>
              <div className={`w-8 h-4 border rounded-full relative transition-colors ${caaQmsNodes ? 'bg-primary/30 border-primary' : 'bg-slate-950 border-slate-700'}`}>
                <div className={`absolute top-0.5 w-2.5 h-2.5 rounded-full transition-all ${caaQmsNodes ? 'right-0.5 bg-primary' : 'left-0.5 bg-slate-500'}`}></div>
              </div>
            </div>

            <div 
              onClick={() => setTrafficGrids(!trafficGrids)}
              className={`flex items-center justify-between p-2 hover:bg-slate-800 transition-colors group cursor-pointer ${!trafficGrids ? 'opacity-45' : ''}`}
            >
              <span className="text-xs font-semibold text-slate-300">Heavy Logistics Traffic Grids</span>
              <div className={`w-8 h-4 border rounded-full relative transition-colors ${trafficGrids ? 'bg-primary/30 border-primary' : 'bg-slate-950 border-slate-700'}`}>
                <div className={`absolute top-0.5 w-2.5 h-2.5 rounded-full transition-all ${trafficGrids ? 'right-0.5 bg-primary' : 'left-0.5 bg-slate-500'}`}></div>
              </div>
            </div>

            <div 
              onClick={() => setFactoryPerimeters(!factoryPerimeters)}
              className={`flex items-center justify-between p-2 hover:bg-slate-800 transition-colors group cursor-pointer ${!factoryPerimeters ? 'opacity-45' : ''}`}
            >
              <span className="text-xs font-semibold text-slate-300">Industrial & Factory Perimeters</span>
              <div className={`w-8 h-4 border rounded-full relative transition-colors ${factoryPerimeters ? 'bg-primary/30 border-primary' : 'bg-slate-950 border-slate-700'}`}>
                <div className={`absolute top-0.5 w-2.5 h-2.5 rounded-full transition-all ${factoryPerimeters ? 'right-0.5 bg-primary' : 'left-0.5 bg-slate-500'}`}></div>
              </div>
            </div>

            <div 
              onClick={() => setSentinelPlume(!sentinelPlume)}
              className={`flex items-center justify-between p-2 hover:bg-slate-800 transition-colors group cursor-pointer ${!sentinelPlume ? 'opacity-45' : ''}`}
            >
              <span className="text-xs font-semibold text-slate-300">Sentinel-5P Tropospheric Column</span>
              <div className={`w-8 h-4 border rounded-full relative transition-colors ${sentinelPlume ? 'bg-primary/30 border-primary' : 'bg-slate-950 border-slate-700'}`}>
                <div className={`absolute top-0.5 w-2.5 h-2.5 rounded-full transition-all ${sentinelPlume ? 'right-0.5 bg-primary' : 'left-0.5 bg-slate-500'}`}></div>
              </div>
            </div>
          </div>
        </div>

        {/* Floating Style selectors */}
        <div className="absolute bottom-6 right-6 flex flex-col gap-1 z-30 text-left">
          <div className="bg-slate-900/90 backdrop-blur-md border border-slate-800 p-1.5 flex flex-col min-w-[180px] rounded-lg shadow-xl">
            <button
              onClick={() => handleStyleChange("monochrome")}
              className={`text-left px-3 py-2 text-xs font-semibold rounded ${
                activeStyle === "monochrome"
                  ? "bg-slate-800 text-primary border-l-2 border-primary"
                  : "text-slate-400 hover:bg-slate-800 transition-all hover:text-white"
              }`}
            >
              Monochrome Vector
            </button>
            <button
              onClick={() => handleStyleChange("satellite")}
              className={`text-left px-3 py-2 text-xs font-semibold rounded ${
                activeStyle === "satellite"
                  ? "bg-slate-800 text-primary border-l-2 border-primary"
                  : "text-slate-400 hover:bg-slate-800 transition-all hover:text-white"
              }`}
            >
              Spectral Satellite
            </button>
            <button
              onClick={() => handleStyleChange("hybrid")}
              className={`text-left px-3 py-2 text-xs font-semibold rounded ${
                activeStyle === "hybrid"
                  ? "bg-slate-800 text-primary border-l-2 border-primary"
                  : "text-slate-400 hover:bg-slate-800 transition-all hover:text-white"
              }`}
            >
              Hybrid Analytics
            </button>
          </div>
        </div>

        {/* Zoom controls */}
        <div className="absolute bottom-6 left-6 flex flex-col gap-2 z-30">
          <div className="flex flex-col bg-slate-900 border border-slate-800 rounded shadow-md overflow-hidden">
            <button className="p-2 border-b border-slate-850 hover:bg-slate-800 text-white material-symbols-outlined text-[20px]">
              add
            </button>
            <button className="p-2 hover:bg-slate-800 text-white material-symbols-outlined text-[20px]">
              remove
            </button>
          </div>
          <button className="p-2 bg-slate-900 border border-slate-800 hover:bg-slate-800 text-white material-symbols-outlined text-[20px] rounded shadow-md">
            my_location
          </button>
        </div>
      </section>

      {/* Right Sidebar */}
      <aside className="w-1/4 h-full bg-slate-900/60 backdrop-blur-sm border-l border-[#3c4a42]/30 flex flex-col overflow-y-auto custom-scrollbar shrink-0 text-left">
        <div className="p-6 border-b border-slate-800/80 bg-slate-900/40">
          <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500 mb-4">
            Spatial Intelligence Metadata
          </h2>
          <div className="bg-slate-950 border border-slate-850 p-4 flex flex-col gap-1 rounded">
            <span className="text-[10px] font-bold text-primary uppercase tracking-tighter opacity-70">
              Focus Coordinates
            </span>
            <div className="flex items-center justify-between">
              <span className="font-mono text-white text-base font-semibold">LAT 19.0760° N</span>
              <span className="font-mono text-white text-base font-semibold">LON 72.8777° E</span>
            </div>
          </div>
        </div>

        <div className="flex-grow p-6 space-y-6">
          <div>
            <h3 className="text-xs font-bold text-white mb-3 flex items-center gap-2 tracking-wider">
              <span className="material-symbols-outlined text-[18px] text-primary">analytics</span>
              ACTIVE ZONE TELEMETRY
            </h3>
            <div className="space-y-4">
              <div className="p-3 border-l-2 border-primary bg-slate-950/40 rounded-r border border-y-slate-850 border-r-slate-850">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs text-slate-400">Central Hub</span>
                  <span className="text-primary font-mono text-xs font-semibold">88% CAP</span>
                </div>
                <div className="w-full h-1 bg-slate-950 rounded-full overflow-hidden">
                  <div className="h-full bg-primary" style={{ width: "88%" }}></div>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-xs font-bold text-white mb-3 flex items-center gap-2 tracking-wider">
              <span className="material-symbols-outlined text-[18px] text-indigo-400">satellite_alt</span>
              SENTINEL INGESTION PIPELINE SYNC
            </h3>
            <div className="bg-slate-950 border border-primary/40 shadow-[0_0_15px_rgba(78,222,163,0.1)] p-4 rounded space-y-4">
              <button
                onClick={handlePipelineSync}
                disabled={isProcessingPipeline}
                className={`w-full py-2.5 text-white font-bold text-[11px] uppercase tracking-widest active:scale-[0.98] transition-all flex items-center justify-center gap-2 rounded-sm ${
                  isProcessingPipeline 
                    ? "animate-pulse-indigo cursor-not-allowed bg-indigo-900" 
                    : "bg-[#4f46e5] hover:bg-[#6366f1] shadow-[0_0_10px_rgba(79,70,229,0.3)]"
                }`}
              >
                <span className={`material-symbols-outlined text-sm ${isProcessingPipeline ? 'animate-spin' : ''}`}>
                  sync
                </span>
                <span>
                  {isProcessingPipeline ? "INGESTING & DE-CLOUDING DATA..." : "TRIGGER PIPELINE SYNC"}
                </span>
              </button>

              <div className="bg-black/40 border border-slate-850 p-3 font-mono text-[10px] leading-relaxed text-slate-400 rounded min-h-[100px] flex flex-col justify-start gap-1 max-h-[140px] overflow-y-auto custom-scrollbar">
                {pipelineLogs.map((log, idx) => (
                  <div key={idx} className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse shrink-0 mt-1"></span>
                    <span className="leading-snug">{log}</span>
                  </div>
                ))}
                {isProcessingPipeline && (
                  <div className="text-cyan-400 font-bold animate-pulse text-[9px] mt-1">
                    [PIPELINE INGESTION PIPELINE RUNNING...]
                  </div>
                )}
              </div>

              <div className="flex justify-between items-center text-[10px] font-mono text-slate-500 uppercase tracking-tighter">
                <span>Last Sync: {isProcessingPipeline ? "Syncing..." : "0m ago"}</span>
                <span>Pipeline Latency: 0.8s</span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-xs font-bold text-white mb-3 flex items-center gap-2 tracking-wider">
              <span className="material-symbols-outlined text-[18px] text-primary">terminal</span>
              POSTGIS QUERY LOG
            </h3>
            <div className="bg-slate-950 border border-slate-850 p-4 font-mono text-xs leading-relaxed text-primary/80 overflow-x-auto rounded">
              <div className="flex items-center gap-2 mb-2 text-slate-400 opacity-60">
                <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
                <span className="font-semibold">QUERY_STREAM_ID: {queries[queryIndex].streamId}</span>
              </div>
              <code className="block whitespace-pre text-left">
                {queries[queryIndex].sql}
              </code>
              <div className="text-slate-500 opacity-50 mt-3 pt-2 border-t border-slate-800/40 text-[10px] whitespace-pre">
                {queries[queryIndex].result}
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-xs font-bold text-white mb-3 tracking-wider">
              SYSTEM ALERTS
            </h3>
            <div className="flex items-start gap-3 p-3 bg-red-950/20 border border-red-500/30 rounded">
              <span className="material-symbols-outlined text-red-500 text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>
                warning
              </span>
              <div className="flex-1">
                <p className="text-xs text-red-400 font-bold">Anomalous Particle Peak</p>
                <p className="text-[11px] text-slate-400 leading-snug mt-1">
                  Zone 4 (Vashi Industrial) showing 300% PM2.5 delta increase over T-minus 10m.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-slate-850 bg-slate-900/40 shrink-0 mt-auto">
          <button 
            onClick={handleExport}
            className="w-full py-3 bg-primary text-slate-950 font-bold text-xs uppercase tracking-widest hover:opacity-90 active:scale-[0.98] transition-all flex items-center justify-center gap-2 rounded shadow-[0_0_12px_rgba(16,185,129,0.2)]"
          >
            <span className="material-symbols-outlined text-sm font-bold">download</span>
            <span>Export Dataset</span>
          </button>
        </div>
      </aside>

    </div>
  );
}
