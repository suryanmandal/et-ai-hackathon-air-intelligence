"use client";

import React, { useState, useEffect, useRef } from "react";

interface LogLine {
  timestamp: string;
  agentName: string;
  color: string;
  message: string;
}

export default function MultiAgentTopology() {
  // Active state step for tracing data flow pipeline
  const [flowStep, setFlowStep] = useState(0);
  const [activeTab, setActiveTab] = useState<"sensor" | "attribution" | "compliance">("sensor");

  // Live Terminal Log Stream state
  const [logs, setLogs] = useState<LogLine[]>([
    { timestamp: "2026-07-14 11:32:22.918", agentName: "ComplianceAgent", color: "text-purple-400", message: "Security handshake: Agent credentials verified." },
    { timestamp: "2026-07-14 11:32:25.418", agentName: "ComplianceAgent", color: "text-purple-400", message: "Buffer sync completed: 42ms latency." },
    { timestamp: "2026-07-14 11:32:27.918", agentName: "System", color: "text-emerald-400", message: "Security handshake: Agent credentials verified." },
    { timestamp: "2026-07-14 11:32:30.418", agentName: "ComplianceAgent", color: "text-purple-400", message: "Refining mesh resolution for sub-sector A-9." },
    { timestamp: "2026-07-14 11:32:32.918", agentName: "AttributionAgent", color: "text-cyan-400", message: "Updating local database cache via H3 hex-cluster." },
  ]);

  const terminalEndRef = useRef<HTMLDivElement>(null);

  // Sync activeTab with flowStep automatically to highlight current agent
  useEffect(() => {
    if (flowStep === 0 || flowStep === 1) {
      setActiveTab("sensor");
    } else if (flowStep === 2 || flowStep === 3) {
      setActiveTab("attribution");
    } else if (flowStep === 4) {
      setActiveTab("compliance");
    }
  }, [flowStep]);

  // Simulate data flow pipeline transitions
  useEffect(() => {
    const interval = setInterval(() => {
      setFlowStep((prev) => (prev + 1) % 5);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  // Simulate real-time log activity appending logs periodically
  useEffect(() => {
    const agents = [
      { name: "SensorAgent", color: "text-emerald-400" },
      { name: "AttributionAgent", color: "text-cyan-400" },
      { name: "ComplianceAgent", color: "text-purple-400" },
      { name: "System", color: "text-slate-400" }
    ];
    const messages = [
      "Refining mesh resolution for sub-sector A-9.",
      "Validating telemetry packet from station MH-442.",
      "Updating local database cache via H3 hex-cluster.",
      "Executing recursive anomaly detection on NOx channels.",
      "Buffer sync completed: 42ms latency.",
      "Security handshake: Agent credentials verified.",
      "Calibrating sensor drift (+1.2C temperature delta correction).",
      "Running XGBoost scenario forecast on PM10 streams.",
      "Generating statutory show-cause evidence PDF notice."
    ];

    const logInterval = setInterval(() => {
      const agent = agents[Math.floor(Math.random() * agents.length)];
      const msg = messages[Math.floor(Math.random() * messages.length)];
      const now = new Date();
      const timeStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}.${String(now.getMilliseconds()).padStart(3, '0')}`;

      setLogs((prev) => {
        const updated = [...prev, { timestamp: timeStr, agentName: agent.name, color: agent.color, message: msg }];
        if (updated.length > 50) {
          updated.shift();
        }
        return updated;
      });
    }, 3000);

    return () => clearInterval(logInterval);
  }, []);

  // Auto scroll terminal logs
  useEffect(() => {
    if (terminalEndRef.current) {
      terminalEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [logs]);

  // Trigger manual packet sync simulation and CrewAI agent analysis
  const handleTriggerSync = async () => {
    const now = new Date();
    const timeStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}.${String(now.getMilliseconds()).padStart(3, '0')}`;
    
    setLogs((prev) => [
      ...prev,
      { timestamp: timeStr, agentName: "System", color: "text-emerald-400", message: "MANUAL PIPELINE SYNC INITIATED: Pulsing topology & invoking CrewAI Agents..." }
    ]);
    setFlowStep(0);

    try {
      const backendUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "https://vayusense-backend.onrender.com";
      const res = await fetch(`${backendUrl}/api/v1/agents/analyze`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          h3_index: "8838a1262dfffff",
          base_pm25: 45.0
        })
      });
      if (res.ok) {
        const data = await res.json();
        const doneTime = new Date().toISOString();
        setLogs((prev) => [
          ...prev,
          { timestamp: doneTime, agentName: "CrewAI", color: "text-purple-400", message: `Agent Audit Report Generated: ${data.agent_report ? data.agent_report.substring(0, 120) + "..." : "Success"}` }
        ]);
      }
    } catch (err) {
      // Fallback log
    }
  };

  return (
    <div className="flex-grow flex flex-col overflow-hidden w-full h-full relative bg-[#090d16]">
      {/* Custom Keyframe Styles */}
      <style jsx>{`
        @keyframes radarSweep {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes flowingDots {
          from { stroke-dashoffset: 40; }
          to { stroke-dashoffset: 0; }
        }
        @keyframes pulseGlow {
          0%, 100% { transform: scale(1); filter: drop-shadow(0 0 5px currentColor); }
          50% { transform: scale(1.03); filter: drop-shadow(0 0 18px currentColor); }
        }
        .radar-line {
          animation: radarSweep 8s linear infinite;
          transform-origin: center;
        }
        .animate-flow {
          stroke-dasharray: 8, 4;
          animation: flowingDots 1.5s linear infinite;
        }
        .node-glow {
          animation: pulseGlow 2s ease-in-out infinite;
        }
        .cyber-grid {
          background-image: radial-gradient(rgba(16, 185, 129, 0.05) 1px, transparent 1px),
                            linear-gradient(to right, rgba(255, 255, 255, 0.01) 1px, transparent 1px),
                            linear-gradient(to bottom, rgba(255, 255, 255, 0.01) 1px, transparent 1px);
          background-size: 24px 24px, 48px 48px, 48px 48px;
        }
      `}</style>

      {/* TOP SECTION: GEOMETRIC CANVAS (60%) */}
      <section className="relative h-[60%] w-full flex flex-col items-center justify-center border-b border-slate-800 cyber-grid overflow-hidden">
        {/* Background Radial Glow */}
        <div className="absolute w-[500px] h-[500px] rounded-full bg-emerald-500/5 blur-[120px] pointer-events-none z-0"></div>
        <div className="absolute w-[400px] h-[400px] rounded-full bg-cyan-500/5 blur-[100px] pointer-events-none z-0 right-10 bottom-10"></div>

        {/* Status Hub Bar */}
        <div className="absolute top-4 left-6 right-6 flex items-center justify-between z-30">
          <div className="flex items-center gap-3">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-widest bg-emerald-500/10 px-2 py-0.5 border border-emerald-500/20 rounded">
              CrewAI Network: Online
            </span>
          </div>
          <div className="text-[10px] font-mono text-slate-400">
            Pipeline Active Step: <span className="text-emerald-400 font-bold">0{flowStep + 1}/05</span>
          </div>
        </div>

        {/* Main Grid Nodes Container */}
        <div className="relative w-full max-w-6xl px-12 flex flex-col md:flex-row items-center justify-between gap-12 z-20 mt-6">
          
          {/* Node 1: SensorAgent */}
          <div 
            onClick={() => setActiveTab("sensor")}
            className={`flex flex-col items-center cursor-pointer group transition-all duration-300 ${
              activeTab === "sensor" ? "scale-105" : "hover:scale-102"
            }`}
          >
            <div 
              style={{ color: "#10b981" }}
              className={`w-28 h-28 rounded-2xl bg-slate-900/90 border-2 flex flex-col items-center justify-center relative transition-all duration-500 ${
                flowStep === 0 
                  ? "border-emerald-500 text-emerald-400 node-glow shadow-[0_0_30px_rgba(16,185,129,0.3)]" 
                  : "border-slate-800 text-slate-500"
              }`}
            >
              {/* Rotating radar graphic when active */}
              {flowStep === 0 && (
                <div className="absolute inset-2 border border-emerald-500/10 rounded-full overflow-hidden pointer-events-none">
                  <div className="w-full h-full border-t border-emerald-500/40 rounded-full radar-line"></div>
                </div>
              )}
              <span className="material-symbols-outlined text-[42px] mb-1">thermostat</span>
              <span className="text-[9px] font-mono tracking-wider font-bold">SENSOR_AGENT</span>
              <div className="absolute -bottom-2 bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 font-mono text-[8px] px-2 py-0.5 rounded">
                AG-01-CALIBRATE
              </div>
            </div>
            <div className="text-center mt-4">
              <span className="text-xs font-bold text-slate-200 block group-hover:text-emerald-400 transition-colors">Sensor Validation</span>
              <span className="text-[9px] font-mono text-slate-500">Status: {flowStep === 0 ? "CALIBRATING" : "STANDBY"}</span>
            </div>
          </div>

          {/* Connection Path 1 */}
          <div className="hidden md:flex flex-col flex-1 items-center justify-center relative h-10 w-full">
            {/* Status Flow Indicator */}
            {flowStep === 1 && (
              <div className="absolute -top-6 bg-[#090d16] border border-emerald-500/30 text-emerald-400 px-3 py-1 rounded-full text-[9px] font-mono shadow-lg animate-bounce">
                EMISSION_SPIKE [PM2.5: 184]
              </div>
            )}
            <svg width="100%" height="24" className="overflow-visible">
              <line x1="0%" y1="12" x2="100%" y2="12" stroke="#1e293b" strokeWidth="2" />
              <line 
                x1="0%" 
                y1="12" 
                x2="100%" 
                y2="12" 
                stroke={flowStep === 1 ? "#10b981" : "#1e293b"} 
                strokeWidth="2" 
                className={flowStep === 1 ? "animate-flow" : ""} 
              />
            </svg>
          </div>

          {/* Node 2: SourceAttributionAgent */}
          <div 
            onClick={() => setActiveTab("attribution")}
            className={`flex flex-col items-center cursor-pointer group transition-all duration-300 ${
              activeTab === "attribution" ? "scale-105" : "hover:scale-102"
            }`}
          >
            <div 
              style={{ color: "#22d3ee" }}
              className={`w-32 h-32 rounded-2xl bg-slate-900/90 border-2 flex flex-col items-center justify-center relative transition-all duration-500 ${
                flowStep === 2 
                  ? "border-cyan-400 text-cyan-400 node-glow shadow-[0_0_35px_rgba(34,211,238,0.3)]" 
                  : "border-slate-800 text-slate-500"
              }`}
            >
              {/* Rotating radar graphic when active */}
              {flowStep === 2 && (
                <div className="absolute inset-2 border border-cyan-500/10 rounded-full overflow-hidden pointer-events-none">
                  <div className="w-full h-full border-t border-cyan-500/40 rounded-full radar-line"></div>
                </div>
              )}
              <span className="material-symbols-outlined text-[48px] mb-1">satellite_alt</span>
              <span className="text-[9px] font-mono tracking-wider font-bold">ATTRIBUTION_AGENT</span>
              <div className="absolute -bottom-2 bg-cyan-500/20 border border-cyan-500/30 text-cyan-400 font-mono text-[8px] px-2 py-0.5 rounded">
                AG-04-GEOSPATIAL
              </div>
            </div>
            <div className="text-center mt-4">
              <span className="text-xs font-bold text-slate-200 block group-hover:text-cyan-400 transition-colors">Plume & Wind Vector</span>
              <span className="text-[9px] font-mono text-slate-500">Status: {flowStep === 2 ? "INTERSECTING" : "IDLE"}</span>
            </div>
          </div>

          {/* Connection Path 2 */}
          <div className="hidden md:flex flex-col flex-1 items-center justify-center relative h-10 w-full">
            {/* Status Flow Indicator */}
            {flowStep === 3 && (
              <div className="absolute -top-6 bg-[#090d16] border border-purple-500/30 text-purple-400 px-3 py-1 rounded-full text-[9px] font-mono shadow-lg animate-bounce">
                SOURCE_FOUND [ID: IN-MUM-882]
              </div>
            )}
            <svg width="100%" height="24" className="overflow-visible">
              <line x1="0%" y1="12" x2="100%" y2="12" stroke="#1e293b" strokeWidth="2" />
              <line 
                x1="0%" 
                y1="12" 
                x2="100%" 
                y2="12" 
                stroke={flowStep === 3 ? "#a855f7" : "#1e293b"} 
                strokeWidth="2" 
                className={flowStep === 3 ? "animate-flow" : ""} 
              />
            </svg>
          </div>

          {/* Node 3: ComplianceAgent */}
          <div 
            onClick={() => setActiveTab("compliance")}
            className={`flex flex-col items-center cursor-pointer group transition-all duration-300 ${
              activeTab === "compliance" ? "scale-105" : "hover:scale-102"
            }`}
          >
            <div 
              style={{ color: "#a855f7" }}
              className={`w-28 h-28 rounded-2xl bg-slate-900/90 border-2 flex flex-col items-center justify-center relative transition-all duration-500 ${
                flowStep === 4 
                  ? "border-purple-500 text-purple-400 node-glow shadow-[0_0_30px_rgba(168,85,247,0.3)]" 
                  : "border-slate-800 text-slate-500"
              }`}
            >
              {/* Rotating radar graphic when active */}
              {flowStep === 4 && (
                <div className="absolute inset-2 border border-purple-500/10 rounded-full overflow-hidden pointer-events-none">
                  <div className="w-full h-full border-t border-purple-500/40 rounded-full radar-line"></div>
                </div>
              )}
              <span className="material-symbols-outlined text-[42px] mb-1">gavel</span>
              <span className="text-[9px] font-mono tracking-wider font-bold">COMPLIANCE_AGENT</span>
              <div className="absolute -bottom-2 bg-purple-500/20 border border-purple-500/30 text-purple-400 font-mono text-[8px] px-2 py-0.5 rounded">
                AG-09-STATUTORY
              </div>
            </div>
            <div className="text-center mt-4">
              <span className="text-xs font-bold text-slate-200 block group-hover:text-purple-400 transition-colors">Statutory Notice Dispatch</span>
              <span className="text-[9px] font-mono text-slate-500">Status: {flowStep === 4 ? "ENFORCING" : "STANDBY"}</span>
            </div>
          </div>

        </div>
      </section>

      {/* BOTTOM SECTION: DETAILED ANALYTICS CARD & LOG FEED (40%) */}
      <section className="h-[40%] bg-slate-900 border-t border-slate-800 flex flex-col md:flex-row overflow-hidden text-left">
        
        {/* Left Side: Agent Reasoning Card */}
        <div className="w-full md:w-[350px] border-r border-slate-800 p-5 bg-[#0b0f19] flex flex-col justify-between shrink-0">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="material-symbols-outlined text-sm text-emerald-400">psychology</span>
              <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest">
                Agent Reasoning Desk
              </span>
            </div>
            
            {activeTab === "sensor" && (
              <div className="flex flex-col gap-2">
                <span className="text-xs font-bold text-emerald-400">Sensor Calibration Agent (AG-01)</span>
                <p className="text-[11px] text-slate-400 leading-relaxed font-mono">
                  - Evaluates ground CAAQMS gas channels.<br/>
                  - Calibrates drift offsets based on humidity/temp values.<br/>
                  - Confirms breach parameters validity.
                </p>
              </div>
            )}
            {activeTab === "attribution" && (
              <div className="flex flex-col gap-2">
                <span className="text-xs font-bold text-cyan-400">Source Attribution Agent (AG-04)</span>
                <p className="text-[11px] text-slate-400 leading-relaxed font-mono">
                  - Fuses meteorological wind vectors with spatial layers.<br/>
                  - Searches trophospheric Sentinel-5P STAC scenes.<br/>
                  - Computes blameworthiness percentages dynamically.
                </p>
              </div>
            )}
            {activeTab === "compliance" && (
              <div className="flex flex-col gap-2">
                <span className="text-xs font-bold text-purple-400">Compliance Enforcement Agent (AG-09)</span>
                <p className="text-[11px] text-slate-400 leading-relaxed font-mono">
                  - Verifies statutory regional permit databases.<br/>
                  - Formats localized show-cause notice reports.<br/>
                  - Generates legal dispatch and SHA-256 code.
                </p>
              </div>
            )}
          </div>

          <div className="flex gap-3 mt-4">
            <button 
              onClick={handleTriggerSync}
              className="flex-1 py-2 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold text-[10px] uppercase tracking-widest active:scale-[0.98] transition-all flex items-center justify-center gap-1.5 rounded shadow-[0_0_12px_rgba(16,185,129,0.2)]"
            >
              <span className="material-symbols-outlined text-xs">sync</span>
              <span>Pulse Topology</span>
            </button>
          </div>
        </div>

        {/* Right Side: Live Logs Terminal */}
        <div className="flex-1 flex flex-col overflow-hidden bg-slate-950/40">
          <div className="flex items-center justify-between px-5 py-3 border-b border-slate-850 bg-slate-950/50">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-[9px] font-mono font-bold text-slate-400 uppercase tracking-widest">
                IMMUTABLE TRANSACTION TRAIL
              </span>
            </div>
            <div className="text-[9px] font-mono text-slate-500">
              SHA256 STAMP ACTIVE
            </div>
          </div>

          <div className="flex-grow p-5 font-mono text-[10.5px] overflow-y-auto terminal-scroll leading-relaxed">
            <div className="flex flex-col gap-1.5">
              {logs.map((log, idx) => (
                <p key={idx} className="hover:bg-slate-900/50 px-2 py-0.5 rounded transition-all">
                  <span className="text-slate-600 mr-2">[{log.timestamp}]</span>
                  <span className={`${log.color} font-bold mr-2`}>{log.agentName}:</span>
                  <span className="text-slate-300">{log.message}</span>
                </p>
              ))}
              <div ref={terminalEndRef} />
            </div>
          </div>
        </div>

      </section>
    </div>
  );
}
