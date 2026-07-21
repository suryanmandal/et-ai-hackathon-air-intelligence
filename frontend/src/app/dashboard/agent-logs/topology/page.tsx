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

  // Live Terminal Log Stream state
  const [logs, setLogs] = useState<LogLine[]>([
    { timestamp: "2026-07-14 11:32:22.918", agentName: "ComplianceAgent", color: "text-purple-400", message: "Security handshake: Agent credentials verified." },
    { timestamp: "2026-07-14 11:32:25.418", agentName: "ComplianceAgent", color: "text-purple-400", message: "Buffer sync completed: 42ms latency." },
    { timestamp: "2026-07-14 11:32:27.918", agentName: "System", color: "text-slate-400", message: "Security handshake: Agent credentials verified." },
    { timestamp: "2026-07-14 11:32:30.418", agentName: "ComplianceAgent", color: "text-purple-400", message: "Refining mesh resolution for sub-sector A-9." },
    { timestamp: "2026-07-14 11:32:32.918", agentName: "AttributionAgent", color: "text-cyan-400", message: "Updating local database cache via H3 hex-cluster." },
  ]);

  const terminalEndRef = useRef<HTMLDivElement>(null);

  // Simulate data flow pipeline transitions
  useEffect(() => {
    const interval = setInterval(() => {
      setFlowStep((prev) => (prev + 1) % 5);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Simulate real-time log activity appending logs periodically
  useEffect(() => {
    const agents = [
      { name: "SensorAgent", color: "text-primary" },
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
      "Security handshake: Agent credentials verified."
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
    }, 2500);

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
      { timestamp: timeStr, agentName: "System", color: "text-primary", message: "MANUAL PIPELINE SYNC INITIATED: Pulsing topology & invoking CrewAI Agents..." }
    ]);
    setFlowStep(0);

    try {
      const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:8000";
      const res = await fetch(`${API_BASE}/api/v1/agents/analyze", {
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
      // Graceful fallback if backend is offline
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden relative">
      
      {/* TOP SECTION: NETWORK TOPOLOGY CANVAS (70%) */}
      <section className="h-[70%] w-full relative bg-slate-950 grid-pattern flex items-center justify-center overflow-hidden border-b border-[#3c4a42]/30">
        <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_100px_rgba(0,0,0,0.85)] z-0"></div>

        {/* SVG Connectivity Layer */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none z-10" xmlns="http://www.w3.org/2000/svg">
          <path 
            className={`connection-line transition-all duration-300 ${
              flowStep === 1 ? "stroke-primary" : "stroke-slate-800"
            }`}
            d="M 20% 50% L 50% 50%" 
            fill="none" 
            strokeWidth="2"
          />
          <path 
            className={`connection-line transition-all duration-300 ${
              flowStep === 3 ? "stroke-purple-550" : "stroke-slate-800"
            }`}
            d="M 50% 50% L 80% 50%" 
            fill="none" 
            strokeWidth="2"
          />
        </svg>

        {/* Topology Nodes */}
        <div className="relative w-full max-w-5xl flex justify-between items-center px-lg z-20 text-left">
          
          {/* Node 1: Sensor Monitoring Agent */}
          <div className="flex flex-col items-center gap-md z-10">
            <div 
              className={`w-24 h-24 rounded-xl bg-slate-900 border-2 flex items-center justify-center transition-all duration-300 hover:scale-105 ${
                flowStep === 0 
                  ? "border-primary text-primary node-pulse shadow-[0_0_20px_rgba(78,222,163,0.3)]" 
                  : "border-slate-800 text-slate-500"
              }`}
            >
              <span className="material-symbols-outlined text-[48px]">router</span>
            </div>
            <div className="text-center mt-2">
              <div className={`text-[10px] font-mono uppercase tracking-widest mb-xs transition-colors duration-300 ${flowStep === 0 ? 'text-primary font-bold' : 'text-slate-500'}`}>
                {flowStep === 0 ? "Active" : "Idle"}
              </div>
              <div className="text-sm font-bold text-white">Sensor Monitoring</div>
              <div className="text-[10px] text-slate-500 font-mono mt-xs">ID: AG-SENSOR-01</div>
            </div>
          </div>

          {/* Floating Data Pill A */}
          <div 
            className={`absolute left-[34%] top-1/2 -translate-y-[150%] bg-slate-900/95 border text-primary px-3 py-1.5 rounded flex items-center gap-xs shadow-2xl transition-all duration-500 ${
              flowStep === 1 
                ? "border-primary opacity-100 scale-100 shadow-[0_0_15px_rgba(78,222,163,0.2)] animate-pulse" 
                : "border-slate-800 opacity-30 scale-95"
            }`}
          >
            <span className="material-symbols-outlined text-xs text-primary animate-bounce">warning</span>
            <span className="text-[10px] font-mono font-bold whitespace-nowrap">
              EMISSION_SPIKE_DETECTED [PM2.5: 184 μg/m³]
            </span>
          </div>

          {/* Node 2: Source Attribution Agent */}
          <div className="flex flex-col items-center gap-md z-10">
            <div 
              className={`w-32 h-32 rounded-xl bg-slate-900 border-2 flex items-center justify-center transition-all duration-300 hover:scale-105 ${
                flowStep === 2 
                  ? "border-cyan-400 text-cyan-400 node-pulse shadow-[0_0_25px_rgba(34,211,238,0.3)]" 
                  : "border-slate-800 text-slate-500"
              }`}
            >
              <span className="material-symbols-outlined text-[64px]">factory</span>
            </div>
            <div className="text-center mt-2">
              <div className={`text-[10px] font-mono uppercase tracking-widest mb-xs transition-colors duration-300 ${flowStep === 2 ? 'text-cyan-400 font-bold' : 'text-slate-500'}`}>
                {flowStep === 2 ? "Processing" : "Idle"}
              </div>
              <div className="text-base font-bold text-white">Source Attribution</div>
              <div className="text-[10px] text-slate-500 font-mono mt-xs">ID: AG-ATTRIB-04</div>
            </div>
          </div>

          {/* Floating Data Pill B */}
          <div 
            className={`absolute left-[56%] top-1/2 -translate-y-[150%] bg-slate-900/95 border text-purple-400 px-3 py-1.5 rounded flex items-center gap-xs shadow-2xl transition-all duration-500 ${
              flowStep === 3 
                ? "border-purple-500 opacity-100 scale-100 shadow-[0_0_15px_rgba(168,85,247,0.2)] animate-pulse" 
                : "border-slate-800 opacity-30 scale-95"
            }`}
          >
            <span className="material-symbols-outlined text-xs text-purple-400 animate-bounce">search</span>
            <span className="text-[10px] font-mono font-bold whitespace-nowrap">
              SOURCE_ISOLATED [ID: IN-MUM-882]
            </span>
          </div>

          {/* Node 3: Compliance Enforcement Agent */}
          <div className="flex flex-col items-center gap-md z-10">
            <div 
              className={`w-24 h-24 rounded-xl bg-slate-900 border-2 flex items-center justify-center transition-all duration-300 hover:scale-105 ${
                flowStep === 4 
                  ? "border-purple-500 text-purple-500 node-pulse shadow-[0_0_20px_rgba(168,85,247,0.3)]" 
                  : "border-slate-800 text-slate-500"
              }`}
            >
              <span className="material-symbols-outlined text-[48px]">gavel</span>
            </div>
            <div className="text-center mt-2">
              <div className={`text-[10px] font-mono uppercase tracking-widest mb-xs transition-colors duration-300 ${flowStep === 4 ? 'text-purple-500 font-bold' : 'text-slate-500'}`}>
                {flowStep === 4 ? "Enforcing" : "Idle"}
              </div>
              <div className="text-sm font-bold text-white">Compliance Enforcement</div>
              <div className="text-[10px] text-slate-500 font-mono mt-xs">ID: AG-COMP-09</div>
            </div>
          </div>

        </div>
      </section>

      {/* BOTTOM SECTION: TOOL UTILIZATION LOG (30%) */}
      <section className="h-[30%] bg-slate-900 border-t border-[#3c4a42]/30 flex flex-col overflow-hidden text-left">
        <div className="flex items-center justify-between px-md py-sm border-b border-slate-850 bg-slate-950/50">
          <div className="flex items-center gap-sm">
            <span className="w-2.5 h-2.5 rounded-full bg-primary animate-pulse"></span>
            <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider">
              Agent Activity Stream — Live
            </span>
          </div>
          <div className="flex gap-md items-center">
            <button 
              onClick={handleTriggerSync}
              className="text-xs text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 px-3 py-1 rounded flex items-center gap-1 transition-colors uppercase font-bold"
            >
              <span className="material-symbols-outlined text-xs">sync</span>
              <span>Pulse Topology</span>
            </button>
            <button className="text-slate-400 hover:text-primary transition-colors flex items-center justify-center p-1">
              <span className="material-symbols-outlined text-sm">download</span>
            </button>
          </div>
        </div>

        <div className="flex-grow p-md font-mono text-[11px] terminal-scroll overflow-y-auto bg-slate-950/40">
          <div className="flex flex-col gap-1">
            {logs.map((log, idx) => (
              <p key={idx} className="leading-relaxed">
                <span className="text-slate-500 mr-2">[{log.timestamp}]</span>
                <span className={`${log.color} font-bold mr-2`}>{log.agentName}</span>
                <span className="text-slate-300">{log.message}</span>
              </p>
            ))}
            <div ref={terminalEndRef} />
          </div>
        </div>
      </section>

    </div>
  );
}
