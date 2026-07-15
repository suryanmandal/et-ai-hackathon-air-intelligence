"use client";

import React, { useState, useEffect, useRef } from "react";

interface LogMessage {
  time: string;
  sender: "SensorAgent" | "SourceAttributionAgent" | "ComplianceAgent" | "System";
  content: string;
}

export default function MainControlRoom() {
  // Map Style State
  const [activeStyle, setActiveStyle] = useState<"monochrome" | "satellite" | "hybrid">("monochrome");

  // Telemetry Layer States
  const [layers, setLayers] = useState({
    iotSensors: true,
    satellitePlume: true,
    activeConstruction: false,
  });

  // Timeline playback state
  const [isPlaying, setIsPlaying] = useState(true);
  const [timelineVal, setTimelineVal] = useState(85);

  // Multi-Agent Reasoning Feed state
  const [terminalLogs, setTerminalLogs] = useState<LogMessage[]>([
    { time: "10:14:22", sender: "SensorAgent", content: "flagged PM2.5 threshold breach. Confidence: 98.4%" },
    { time: "10:14:23", sender: "SourceAttributionAgent", content: "executed satellite plume spatial clipping. Correlating with industrial zone polygon IND_88." },
    { time: "10:14:25", sender: "ComplianceAgent", content: "generated optimized inspector enforcement route. Awaiting dispatcher authorization." },
  ]);

  // Terminal scroll reference
  const terminalEndRef = useRef<HTMLDivElement>(null);

  // Dispatch Inspector state
  const [isDispatching, setIsDispatching] = useState(false);
  const [showEvidence, setShowEvidence] = useState(false);

  // Auto-scrolling the terminal
  useEffect(() => {
    if (terminalEndRef.current) {
      terminalEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [terminalLogs]);

  // Timeline Auto-play effect
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isPlaying) {
      timer = setInterval(() => {
        setTimelineVal((prev) => (prev >= 100 ? 0 : prev + 1));
      }, 800);
    }
    return () => clearInterval(timer);
  }, [isPlaying]);

  // Feed Simulation Effect: Adds new agent notes periodically
  useEffect(() => {
    const feedTemplates = [
      { sender: "SensorAgent" as const, content: "Recalibrated ground station sensors in cell MUM_042. Temperature delta +1.2C." },
      { sender: "SourceAttributionAgent" as const, content: "Identified shift in stack emission dispersion. Plume heading North-Northwest towards Worli Naka." },
      { sender: "ComplianceAgent" as const, content: "Cross-referenced factory operating permits. Stack IND_88 flagged for offline scrubber maintenance cycle." },
      { sender: "SensorAgent" as const, content: "Secondary verification complete. PM10 particulate ratio aligns with heavy petcoke combustion signature." },
      { sender: "ComplianceAgent" as const, content: "Emailed warning alert payload to BMC central municipal dispatch desk. Priority Level: RED." },
    ];

    let tIndex = 0;
    const interval = setInterval(() => {
      const now = new Date();
      const timeStr = now.toTimeString().split(" ")[0];
      const template = feedTemplates[tIndex % feedTemplates.length];
      
      setTerminalLogs((prev) => [
        ...prev,
        { time: timeStr, sender: template.sender, content: template.content }
      ]);
      tIndex++;
    }, 6000);

    return () => clearInterval(interval);
  }, []);

  const handleLayerToggle = (layer: keyof typeof layers) => {
    setLayers((prev) => ({ ...prev, [layer]: !prev[layer] }));
  };

  const handleDispatch = () => {
    setIsDispatching(true);
    
    // Simulate Dispatch flow
    setTimeout(() => {
      const now = new Date();
      const timeStr = now.toTimeString().split(" ")[0];
      
      setTerminalLogs((prev) => [
        ...prev,
        { time: timeStr, sender: "System", content: "DISPATCH DISK: Route authorized. Dispatching units VAYU-MOBILE-1 and VAYU-MOBILE-3. Tracking active." }
      ]);
      
      setIsDispatching(false);
      setShowEvidence(true);
    }, 1500);
  };

  const downloadSimulatedReport = () => {
    const reportContent = `VAYUSENSE GOVERNMENT ENFORCEMENT PACKAGE
-----------------------------------------
Timestamp: ${new Date().toISOString()}
Target Grid: CELL MUM_042 (Worli Naka Region)
AQI Index: 412 (Hazardous)
Attributed Sources:
  - Industrial Stack Emissions: 62%
  - Construction Fugitive Dust: 20%
  - Heavy Diesel Fleet Traffic: 18%

LOG DETAILS:
${terminalLogs.map(l => `[${l.time}] ${l.sender}: ${l.content}`).join("\n")}
-----------------------------------------
STATUS: DISPATCH COMPLETED. ENFORCEMENT OFFICERS ROUTED.
`;
    const blob = new Blob([reportContent], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `VayuSense_Evidence_MUM_042_${Date.now()}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex-1 flex flex-col md:flex-row overflow-hidden w-full h-full relative">
      
      {/* Left Column: Geospatial Map (70% on large viewports) */}
      <section className="flex-1 relative bg-obsidian border-r border-[#3c4a42]/30 flex flex-col h-full overflow-hidden">
        
        {/* Map Container */}
        <div className="flex-1 relative overflow-hidden bg-[#0a0f1c]">
          {/* Detailed Vector Geographic Basemap of South Mumbai */}
          <div
            className="absolute inset-0 bg-center opacity-85 mix-blend-screen transition-all duration-700"
            style={{
              backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuC10XqL_8rL0_y7I_6f6t4W5pYt8m7n2b8s9f0r1-m2v3p4q5r6s7t8u9v0w1x2y3z4a5b6c7d8e9f0g1h2i3j4k5l6m7n8o9p0q1r2s3t4u5v6w7x8y9z0')`,
              backgroundSize: "cover",
              filter: activeStyle === "satellite" 
                ? "brightness(0.9) contrast(1.1) saturate(1.2)" 
                : activeStyle === "hybrid"
                ? "brightness(0.8) contrast(1.1)"
                : "brightness(0.6) contrast(1.2) grayscale(100%)",
            }}
          >
            {/* Simulated Vector SVG Overlay for Roads and Coastline */}
            <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="xMidYMid slice" viewBox="0 0 1000 1000" xmlns="http://www.w3.org/2000/svg">
              <path d="M100,0 Q150,200 120,400 T180,700 T250,1000" fill="none" opacity="0.4" stroke={activeStyle === "satellite" ? "#10b981" : "#94a3b8"} strokeWidth="2"></path>
              <path d="M400,0 L420,200 Q450,450 380,600 T300,1000" fill="none" opacity="0.4" stroke={activeStyle === "satellite" ? "#10b981" : "#94a3b8"} strokeWidth="2"></path>
              <path d="M150,500 C160,600 200,650 250,680" fill="none" opacity="0.6" stroke={activeStyle === "satellite" ? "#ffdad7" : "#e2e8f0"} strokeWidth="3"></path>
              <path d="M450,100 L470,400 L500,800" fill="none" opacity="0.5" stroke={activeStyle === "satellite" ? "#ffdad7" : "#e2e8f0"} strokeWidth="4"></path>
              <path d="M200,0 L210,1000" fill="none" opacity="0.3" stroke="#94a3b8" strokeWidth="1.5"></path>
              <path d="M0,450 L1000,470" fill="none" opacity="0.3" stroke="#94a3b8" strokeWidth="1.5"></path>
              <path d="M0,200 L1000,230" fill="none" opacity="0.2" stroke="#94a3b8" strokeWidth="1"></path>
            </svg>
          </div>

          {/* H3 Honeycomb Hexagon Grid Overlay */}
          <div className={`absolute inset-0 pointer-events-none p-4 transition-opacity duration-300 ${layers.iotSensors ? 'opacity-40' : 'opacity-0'}`}>
            <div className="hexagon-container">
              <div className="hex"></div>
              <div className="hex hex-active-low"></div>
              <div className="hex"></div>
              <div className="hex"></div>
              <div className="hex hex-active-med"></div>
              <div className="hex"></div>
              <div className="hex"></div>
              <div className="hex"></div>
              
              <div className="hex"></div>
              <div className="hex"></div>
              <div className="hex hex-active-low"></div>
              <div className="hex"></div>
              <div className="hex"></div>
              <div className="hex hex-active-low"></div>
              <div className="hex"></div>
              <div className="hex"></div>
              
              <div className="hex"></div>
              <div className="hex"></div>
              <div className="hex pointer-events-auto cursor-crosshair group hex-critical">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
                  <span className="material-symbols-outlined text-red-500 text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                    warning
                  </span>
                  <span className="text-[8px] font-mono text-white font-bold bg-red-500 px-1 rounded-sm">
                    MUM_042
                  </span>
                </div>
                {/* Tooltip */}
                <div className="absolute left-full top-0 ml-4 glass-panel border-red-500 p-3 w-52 z-50 hidden group-hover:block shadow-2xl rounded text-left">
                  <div className="text-red-400 font-bold text-xs mb-1 flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px]">emergency</span> CRITICAL LIMIT
                  </div>
                  <div className="text-sm mb-2 text-white font-semibold">AQI: 412 (Hazardous)</div>
                  <div className="text-xs text-slate-400 mb-1">Grid Area: South Mumbai</div>
                  <div className="text-xs text-slate-400 font-mono">Location: Worli-Naka Intersection</div>
                </div>
              </div>
              <div className="hex"></div>
              <div className="hex hex-active-med"></div>
              <div className="hex"></div>
              <div className="hex"></div>
              <div className="hex"></div>
              
              <div className="hex hex-active-low"></div>
              <div className="hex"></div>
              <div className="hex"></div>
              <div className="hex hex-active-low"></div>
              <div className="hex"></div>
              <div className="hex"></div>
              <div className="hex"></div>
              <div className="hex"></div>
            </div>
          </div>

          {/* Plume Overlay Simulator */}
          <div 
            className={`absolute inset-0 pointer-events-none transition-opacity duration-500 mix-blend-color-dodge ${layers.satellitePlume ? 'opacity-50' : 'opacity-0'}`}
            style={{
              background: "radial-gradient(circle at 35% 55%, rgba(245, 158, 11, 0.45) 0%, rgba(245, 158, 11, 0.05) 50%, transparent 70%)"
            }}
          />

          {/* Construction Dust Simulation Overlay */}
          <div 
            className={`absolute inset-0 pointer-events-none transition-opacity duration-500 ${layers.activeConstruction ? 'opacity-30' : 'opacity-0'}`}
            style={{
              background: "radial-gradient(circle at 45% 40%, rgba(148, 163, 184, 0.5) 0%, rgba(148, 163, 184, 0.1) 40%, transparent 60%)"
            }}
          />

          <div className="absolute inset-0 scanline pointer-events-none opacity-10"></div>
          
          {/* Map Coordinates Bottom Left */}
          <div className="absolute bottom-4 left-4 font-mono text-slate-400 text-[10px] bg-slate-950/85 px-2 py-1 border border-slate-800 backdrop-blur-sm z-20">
            LAT 18.9220 N | LON 72.8347 E | H3_RES 8 | ZOOM L15 | STACK: IoT + Sentinel5P
          </div>

          {/* Floating Map Controls */}
          <div className="absolute top-4 left-4 w-72 bg-slate-900/90 backdrop-blur-md border border-slate-800 rounded shadow-xl overflow-hidden z-30 text-left">
            <div className="px-3 py-2 border-b border-slate-800 flex justify-between items-center bg-slate-950/50">
              <span className="text-xs font-bold text-white uppercase tracking-wider">Telemetry Layers</span>
              <span className="material-symbols-outlined text-slate-500 text-[16px]">layers</span>
            </div>
            <div className="p-3 flex flex-col gap-3">
              <label className="flex items-center justify-between cursor-pointer group">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#4edea3]"></span>
                  <span className="text-xs font-semibold text-slate-300 group-hover:text-white transition-colors">IoT Sensors</span>
                </div>
                <div className="relative" onClick={() => handleLayerToggle("iotSensors")}>
                  <div className={`block w-8 h-4 rounded-full transition-colors ${layers.iotSensors ? 'bg-[#4edea3]' : 'bg-slate-800 border border-slate-700'}`}></div>
                  <div className={`dot absolute top-0.5 bg-white w-3 h-3 rounded-full transition-transform ${layers.iotSensors ? 'translate-x-4' : 'translate-x-0.5'}`}></div>
                </div>
              </label>

              <label className="flex items-center justify-between cursor-pointer group">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                  <span className="text-xs font-semibold text-slate-300 group-hover:text-white transition-colors">Sentinel-5P NO2 Plume</span>
                </div>
                <div className="relative" onClick={() => handleLayerToggle("satellitePlume")}>
                  <div className={`block w-8 h-4 rounded-full transition-colors ${layers.satellitePlume ? 'bg-amber-500' : 'bg-slate-800 border border-slate-700'}`}></div>
                  <div className={`dot absolute top-0.5 bg-white w-3 h-3 rounded-full transition-transform ${layers.satellitePlume ? 'translate-x-4' : 'translate-x-0.5'}`}></div>
                </div>
              </label>

              <label className="flex items-center justify-between cursor-pointer group">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-slate-400"></span>
                  <span className="text-xs font-semibold text-slate-400 group-hover:text-white transition-colors">Active Construction</span>
                </div>
                <div className="relative" onClick={() => handleLayerToggle("activeConstruction")}>
                  <div className={`block w-8 h-4 rounded-full transition-colors ${layers.activeConstruction ? 'bg-slate-400' : 'bg-slate-800 border border-slate-700'}`}></div>
                  <div className={`dot absolute top-0.5 bg-white w-3 h-3 rounded-full transition-transform ${layers.activeConstruction ? 'translate-x-4' : 'translate-x-0.5'}`}></div>
                </div>
              </label>
            </div>
          </div>

          {/* Floating Map Style Selector */}
          <div className="absolute bottom-16 right-4 glass-panel p-1.5 rounded-lg flex flex-col gap-1 border border-slate-800 z-30">
            <button
              onClick={() => setActiveStyle("monochrome")}
              className={`flex items-center gap-2 px-3 py-1.5 rounded text-xs font-semibold transition-all ${
                activeStyle === "monochrome"
                  ? "bg-primary-container/20 text-primary border border-primary/40"
                  : "hover:bg-white/10 text-slate-400 hover:text-white"
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">map</span>
              <span>Monochrome Vector</span>
            </button>
            <button
              onClick={() => setActiveStyle("satellite")}
              className={`flex items-center gap-2 px-3 py-1.5 rounded text-xs font-semibold transition-all ${
                activeStyle === "satellite"
                  ? "bg-primary-container/20 text-primary border border-primary/40"
                  : "hover:bg-white/10 text-slate-400 hover:text-white"
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">satellite_alt</span>
              <span>Spectral Satellite</span>
            </button>
            <button
              onClick={() => setActiveStyle("hybrid")}
              className={`flex items-center gap-2 px-3 py-1.5 rounded text-xs font-semibold transition-all ${
                activeStyle === "hybrid"
                  ? "bg-primary-container/20 text-primary border border-primary/40"
                  : "hover:bg-white/10 text-slate-400 hover:text-white"
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">query_stats</span>
              <span>Hybrid Analytics</span>
            </button>
          </div>
        </div>

        {/* Bottom Playback Timeline */}
        <div className="h-12 bg-slate-900 border-t border-[#3c4a42]/30 flex items-center px-4 gap-4 shrink-0 z-20">
          <button 
            onClick={() => setIsPlaying(!isPlaying)}
            className="text-slate-400 hover:text-white transition-colors"
          >
            <span className="material-symbols-outlined text-[24px]">
              {isPlaying ? "pause" : "play_arrow"}
            </span>
          </button>
          <div className="flex-1 relative flex items-center">
            <input
              type="range"
              min="0"
              max="100"
              value={timelineVal}
              onChange={(e) => {
                setTimelineVal(Number(e.target.value));
                setIsPlaying(false);
              }}
              className="w-full accent-primary cursor-pointer bg-slate-800 h-1 rounded outline-none appearance-none"
            />
          </div>
          <span className="text-mono text-slate-400 text-xs uppercase tracking-widest min-w-[120px] text-right font-bold">
            {isPlaying ? "Live Feed active" : `Frame T-${100 - timelineVal}m`}
          </span>
        </div>
      </section>

      {/* Right Column: Diagnostics & Actions (30% on large viewports) */}
      <aside className="w-full md:w-[30%] lg:w-[400px] bg-slate-950 flex flex-col h-full overflow-y-auto overflow-x-hidden border-l border-[#3c4a42]/30 custom-scrollbar shrink-0">
        <div className="p-4 flex flex-col gap-4 flex-1">
          <div className="mb-2 text-left">
            <h2 className="text-base font-bold text-white mb-1">Diagnostic Matrix</h2>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 bg-red-500/10 text-red-500 border border-red-500/20 text-[9px] font-bold uppercase tracking-wider rounded-sm">
                Cell: MUM_042
              </span>
              <span className="text-xs text-slate-400 font-semibold">Focus Area Isolation</span>
            </div>
          </div>

          {/* Source Attribution Card */}
          <div className="bg-slate-900 border border-[#3c4a42]/20 rounded flex flex-col">
            <div className="px-4 py-3 border-b border-[#3c4a42]/20 flex justify-between items-center bg-slate-950/40 text-left">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">Source Attribution</h3>
              <span className="material-symbols-outlined text-slate-500 text-[16px]">pie_chart</span>
            </div>
            <div className="p-4 flex flex-col gap-4 text-left">
              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span className="text-slate-300">Industrial Stack Emissions</span>
                  <span className="font-mono text-amber-500">62%</span>
                </div>
                <div className="w-full h-1.5 bg-slate-950 rounded-full overflow-hidden">
                  <div className="h-full bg-amber-500 w-[62%] rounded-full"></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span className="text-slate-300">Construction Fugitive Dust</span>
                  <span className="font-mono text-slate-400">20%</span>
                </div>
                <div className="w-full h-1.5 bg-slate-950 rounded-full overflow-hidden">
                  <div className="h-full bg-slate-400 w-[20%] rounded-full"></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span className="text-slate-300">Heavy Diesel Fleet Traffic</span>
                  <span className="font-mono text-slate-500">18%</span>
                </div>
                <div className="w-full h-1.5 bg-slate-950 rounded-full overflow-hidden">
                  <div className="h-full bg-slate-600 w-[18%] rounded-full"></div>
                </div>
              </div>
            </div>
          </div>

          {/* 72-Hour Forecast (PM2.5) */}
          <div className="bg-slate-900 border border-[#3c4a42]/20 rounded flex flex-col">
            <div className="px-4 py-3 border-b border-[#3c4a42]/20 flex justify-between items-center bg-slate-950/40 text-left">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">72-Hour Forecast (PM2.5)</h3>
              <span className="material-symbols-outlined text-slate-500 text-[16px]">show_chart</span>
            </div>
            <div className="p-4 relative h-40">
              <div className="absolute inset-0 m-4 border-l border-b border-[#3c4a42]/30">
                <div className="absolute -left-6 top-0 text-[9px] text-slate-500 font-mono font-bold">500</div>
                <div className="absolute -left-6 top-1/2 -translate-y-1/2 text-[9px] text-slate-500 font-mono font-bold">250</div>
                <div className="absolute -left-6 bottom-0 text-[9px] text-slate-500 font-mono font-bold">0</div>
                
                {/* EPA Limit line */}
                <div className="absolute left-0 top-1/4 w-full border-t border-dashed border-red-500/50 z-0">
                  <span className="absolute right-0 -top-4 text-[8px] text-red-500 font-mono font-bold">EPA LIMIT (150)</span>
                </div>

                {/* Spline charts background styling */}
                <div className="absolute inset-0 spline-chart z-10"></div>
                <div className="absolute inset-0 spline-chart-secondary z-10"></div>
                
                {/* Active timeline vertical indicator */}
                <div className="absolute left-[30%] top-0 h-full border-l border-white/20 z-20">
                  <div className="absolute -top-1 -left-1.5 w-3 h-3 bg-slate-950 border-2 border-white rounded-full"></div>
                </div>
              </div>
              <div className="absolute bottom-2 right-4 text-[9px] font-mono text-slate-500 bg-slate-950/80 px-1.5 py-0.5 rounded border border-slate-800">
                Model RMSE: 11.42
              </div>
            </div>
          </div>

          {/* Multi-Agent Reasoning Feed Terminal */}
          <div className="bg-[#090e17] border border-[#3c4a42]/20 rounded flex flex-col flex-grow min-h-[200px]">
            <div className="px-3 py-2 border-b border-[#3c4a42]/20 bg-slate-900 flex justify-between items-center text-left">
              <h3 className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest">
                Multi-Agent Reasoning Feed
              </h3>
              <div className="flex gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-slate-700"></div>
                <div className="w-1.5 h-1.5 rounded-full bg-slate-700"></div>
                <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></div>
              </div>
            </div>
            <div className="p-3 font-mono text-[11px] leading-relaxed text-slate-400 overflow-y-auto terminal-scroll max-h-[220px] flex-1 text-left">
              <div className="mb-2"><span className="text-slate-600"># INIT PROTOCOL VAYUSENSE_8.4.2</span></div>
              
              {terminalLogs.map((log, idx) => (
                <div key={idx} className="mb-2 text-white">
                  <span className="text-slate-500">[{log.time}]</span> -{" "}
                  <span
                    className={
                      log.sender === "SensorAgent"
                        ? "text-amber-500 font-bold"
                        : log.sender === "SourceAttributionAgent"
                        ? "text-cyan-400 font-bold"
                        : log.sender === "ComplianceAgent"
                        ? "text-purple-400 font-bold"
                        : "text-red-500 font-bold"
                    }
                  >
                    {log.sender}
                  </span>{" "}
                  <span className="text-slate-300">{log.content}</span>
                </div>
              ))}
              
              <div ref={terminalEndRef} />
              <div className="mt-4 text-[#4edea3] flex items-center">
                &gt; _<span className="animate-pulse w-1 h-3.5 bg-[#4edea3] inline-block"></span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Trigger CTA */}
        <div className="p-4 border-t border-[#3c4a42]/30 bg-slate-900 mt-auto shrink-0 text-left">
          <button
            onClick={handleDispatch}
            disabled={isDispatching}
            className="w-full bg-[#4edea3] hover:bg-emerald-400 transition-all duration-300 text-slate-950 font-bold text-xs py-3.5 rounded shadow-[0_0_15px_rgba(78,222,163,0.3)] flex items-center justify-center gap-2 group relative overflow-hidden uppercase tracking-wider"
          >
            {isDispatching ? (
              <>
                <span className="material-symbols-outlined animate-spin text-[18px]">sync</span>
                <span>Compiling evidence package...</span>
              </>
            ) : (
              <>
                <span className="material-symbols-outlined text-[18px] group-hover:translate-x-1 transition-transform">send</span>
                <span>Dispatch route & export evidence</span>
              </>
            )}
          </button>
        </div>
      </aside>

      {/* Glassmorphism Evidence Modal Overlay */}
      {showEvidence && (
        <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="glass-panel border-[#4edea3]/30 bg-slate-900/95 w-full max-w-xl rounded-lg overflow-hidden shadow-2xl text-left">
            <div className="px-6 py-4 border-b border-slate-800 bg-slate-950/60 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>
                  verified_user
                </span>
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                  Evidence Package Exported
                </h3>
              </div>
              <button 
                onClick={() => setShowEvidence(false)}
                className="text-slate-400 hover:text-white transition-colors"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>
            
            <div className="p-6 flex flex-col gap-4 font-mono text-xs text-slate-400">
              <div className="p-3 bg-slate-950 border border-slate-850 rounded">
                <p className="text-primary mb-2 font-bold uppercase tracking-wider"># SYSTEM AUTONOMOUS LOGISTICS AUTHORIZED</p>
                <div className="grid grid-cols-2 gap-2 leading-relaxed text-[11px]">
                  <div>Target Grid Cell:</div>
                  <div className="text-white font-bold">MUM_042 (Worli Naka)</div>
                  <div>Attributed Core Source:</div>
                  <div className="text-amber-500 font-semibold">Industrial Stack IND_88 (62%)</div>
                  <div>Reported Severity Level:</div>
                  <div className="text-red-500 font-bold">CRITICAL HAZARD (412 AQI)</div>
                  <div>Inspector Unit Routed:</div>
                  <div className="text-white font-semibold">VAYU-MOBILE-1 / VAYU-MOBILE-3</div>
                </div>
              </div>

              <div>
                <p className="text-white font-bold mb-2">INTEGRATED SECURE DIGITAL SIGNATURES</p>
                <div className="border border-slate-800 p-2.5 bg-slate-950 rounded text-[10px] space-y-1">
                  <div>[SensorAgent]: <span className="text-[#4edea3]">SHA256::e3b0c442...</span> VERIFIED</div>
                  <div>[SourceAttributionAgent]: <span className="text-[#4edea3]">SHA256::8f9a2b3c...</span> VERIFIED</div>
                  <div>[ComplianceAgent]: <span className="text-[#4edea3]">SHA256::0d1c8e7a...</span> VERIFIED</div>
                </div>
              </div>

              <div className="mt-4 flex gap-4">
                <button
                  onClick={downloadSimulatedReport}
                  className="flex-1 bg-primary text-slate-950 font-bold py-2 px-4 rounded text-center hover:bg-emerald-400 transition-colors flex items-center justify-center gap-2 text-xs uppercase tracking-wider"
                >
                  <span className="material-symbols-outlined text-[16px]">download</span>
                  <span>Download Report</span>
                </button>
                <button
                  onClick={() => setShowEvidence(false)}
                  className="flex-1 border border-slate-800 text-white font-bold py-2 px-4 rounded text-center hover:bg-white/10 transition-colors text-xs uppercase tracking-wider"
                >
                  Dismiss
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
