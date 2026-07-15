"use client";

import React, { useState, useEffect, useRef } from "react";

interface AuditLog {
  timestamp: string;
  author: string;
  action: string;
  status: "active" | "bypassed" | "restored";
}

export default function ComplianceOverride() {
  // Guardrail Toggles State
  const [warningBroadcast, setWarningBroadcast] = useState(true); // default active
  const [emissionCapping, setEmissionCapping] = useState(true); // default active
  const [trafficDiverters, setTrafficDiverters] = useState(true); // default active

  // Modal State for Confirming Override
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [pendingGuardrail, setPendingGuardrail] = useState<"warning" | "emission" | "traffic" | null>(null);
  const [adminToken, setAdminToken] = useState("");
  const [modalError, setModalError] = useState("");

  // Audit Logs State
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([
    { timestamp: "2026-07-14 14:10:05", author: "SYSTEM_DAEMON", action: "Automatic warning system synchronized.", status: "active" },
    { timestamp: "2026-07-14 14:32:19", author: "ADMIN_MALAY", action: "Restored Industrial Emissions Capping on sector IN-MUM-882.", status: "restored" },
    { timestamp: "2026-07-14 15:02:44", author: "SYSTEM_DAEMON", action: "H3 Hexagon compliance check passed.", status: "active" }
  ]);

  const terminalEndRef = useRef<HTMLDivElement>(null);

  // Auto scroll audit logs
  useEffect(() => {
    if (terminalEndRef.current) {
      terminalEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [auditLogs]);

  // Handle Toggle Switch Clicks
  const handleToggleClick = (guardrail: "warning" | "emission" | "traffic", currentValue: boolean) => {
    if (currentValue === true) {
      // Trying to deactivate/override a guardrail -> Require Admin Confirmation
      setPendingGuardrail(guardrail);
      setAdminToken("");
      setModalError("");
      setShowConfirmModal(true);
    } else {
      // Restoring a guardrail -> No passcode required
      const now = new Date();
      const timeStr = now.toISOString().replace('T', ' ').substring(0, 19);
      
      if (guardrail === "warning") setWarningBroadcast(true);
      if (guardrail === "emission") setEmissionCapping(true);
      if (guardrail === "traffic") setTrafficDiverters(true);

      setAuditLogs((prev) => [
        ...prev,
        {
          timestamp: timeStr,
          author: "ADMIN_SYS",
          action: `Restored compliance guardrail: ${
            guardrail === "warning" ? "Automatic Warning Broadcasts" : guardrail === "emission" ? "Industrial Emissions Capping" : "Traffic Flow Diverters"
          }`,
          status: "restored"
        }
      ]);
    }
  };

  // Confirm Override Action
  const handleConfirmOverride = () => {
    if (adminToken.trim() !== "VAYU-2026") {
      setModalError("INVALID ADMINISTRATIVE TOKEN");
      return;
    }

    const now = new Date();
    const timeStr = now.toISOString().replace('T', ' ').substring(0, 19);
    
    if (pendingGuardrail === "warning") setWarningBroadcast(false);
    if (pendingGuardrail === "emission") setEmissionCapping(false);
    if (pendingGuardrail === "traffic") setTrafficDiverters(false);

    setAuditLogs((prev) => [
      ...prev,
      {
        timestamp: timeStr,
        author: "ADMIN_SYS",
        action: `SUSPENDED compliance guardrail: ${
          pendingGuardrail === "warning" ? "Automatic Warning Broadcasts" : pendingGuardrail === "emission" ? "Industrial Emissions Capping" : "Traffic Flow Diverters"
        }`,
        status: "bypassed"
      }
    ]);

    setShowConfirmModal(false);
    setPendingGuardrail(null);
  };

  return (
    <div className="flex-grow flex flex-col lg:flex-row overflow-hidden w-full h-full relative">
      
      {/* Left Column - Override Panel (70% width) */}
      <section className="w-[70%] h-full flex flex-col p-lg gap-lg overflow-y-auto custom-scrollbar bg-slate-950 flex-1 text-left">
        
        {/* Diagnostic KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-md">
          <div className="glass-panel p-md rounded-lg flex flex-col justify-between border border-slate-800 bg-slate-900/60 backdrop-blur-md">
            <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest mb-xs">Active Air Safety Limits</span>
            <div className="flex items-end justify-between">
              <span className="font-mono text-xl font-bold text-white tracking-tight">35 μg/m³ PM2.5</span>
              <span className="text-[9px] text-slate-500 font-mono font-bold">EPA/AQI 24h</span>
            </div>
          </div>

          <div className="glass-panel p-md rounded-lg flex flex-col justify-between border border-slate-800 bg-slate-900/60 backdrop-blur-md">
            <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest mb-xs">Statutory Mode Status</span>
            <div className="flex items-end justify-between">
              <span className={`font-mono text-xl font-bold tracking-tight ${
                (warningBroadcast && emissionCapping && trafficDiverters) ? "text-[#4edea3]" : "text-amber-500"
              }`}>
                {(warningBroadcast && emissionCapping && trafficDiverters) ? "STRICT" : "PARTIAL BYPASS"}
              </span>
              <span className="material-symbols-outlined text-sm text-slate-500">lock</span>
            </div>
          </div>

          <div className="glass-panel p-md rounded-lg flex flex-col justify-between border border-slate-800 bg-slate-900/60 backdrop-blur-md">
            <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest mb-xs">System Authority Tokens</span>
            <div className="flex items-end justify-between">
              <span className="font-mono text-xl font-bold text-white tracking-tight">VAYU-2026</span>
              <span className="text-[9px] text-slate-500 font-mono font-bold">ROOT AUTH</span>
            </div>
          </div>
        </div>

        {/* Core Override Matrix */}
        <div className="glass-panel rounded-lg flex flex-col flex-1 border border-slate-800 bg-slate-900/60 backdrop-blur-md relative p-md gap-lg">
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">Statutory Compliance Guardrails Override</h3>
            <p className="text-xs text-slate-400 mt-1">Temporarily bypass automated environmental safety algorithms (Requires administrative confirmation token)</p>
          </div>

          <div className="flex flex-col gap-md">
            
            {/* Guardrail Item 1 */}
            <div className="p-lg bg-slate-950/60 border border-slate-850 rounded-lg flex justify-between items-center transition-all duration-300 hover:border-slate-700">
              <div className="flex items-start gap-4">
                <div className={`p-3 rounded-lg border ${warningBroadcast ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-red-500/10 border-red-500/20 text-red-400'}`}>
                  <span className="material-symbols-outlined text-[32px]">{warningBroadcast ? 'notifications_active' : 'notifications_off'}</span>
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white uppercase tracking-wider">Automatic Warning Broadcasts</h4>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed max-w-xl">
                    Pushes automated warnings and emergency advisories to municipalities and municipal displays when local sector levels cross 150 AQI.
                  </p>
                </div>
              </div>
              <div className="flex flex-col items-end gap-sm">
                <span className={`text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                  warningBroadcast ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-red-500/10 text-red-500 border border-red-500/20'
                }`}>
                  {warningBroadcast ? 'System Enforcing' : 'OVERRIDDEN / MUTED'}
                </span>
                <button 
                  onClick={() => handleToggleClick("warning", warningBroadcast)}
                  className={`w-14 h-7 rounded-full transition-colors relative flex items-center ${warningBroadcast ? 'bg-[#4edea3]' : 'bg-slate-800'}`}
                >
                  <span className={`w-5 h-5 rounded-full bg-white shadow absolute transition-all duration-300 ${warningBroadcast ? 'left-8' : 'left-1'}`} />
                </button>
              </div>
            </div>

            {/* Guardrail Item 2 */}
            <div className="p-lg bg-slate-950/60 border border-slate-850 rounded-lg flex justify-between items-center transition-all duration-300 hover:border-slate-700">
              <div className="flex items-start gap-4">
                <div className={`p-3 rounded-lg border ${emissionCapping ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-red-500/10 border-red-500/20 text-red-400'}`}>
                  <span className="material-symbols-outlined text-[32px]">factory</span>
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white uppercase tracking-wider">Industrial Emissions Capping</h4>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed max-w-xl">
                    Forces localized production shut-downs or output caps of heavy manufacturing sites (e.g. IN-MUM-882) when atmospheric stagnant index hits thresholds.
                  </p>
                </div>
              </div>
              <div className="flex flex-col items-end gap-sm">
                <span className={`text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                  emissionCapping ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-red-500/10 text-red-500 border border-red-500/20'
                }`}>
                  {emissionCapping ? 'System Enforcing' : 'OVERRIDDEN / DISENGAGED'}
                </span>
                <button 
                  onClick={() => handleToggleClick("emission", emissionCapping)}
                  className={`w-14 h-7 rounded-full transition-colors relative flex items-center ${emissionCapping ? 'bg-[#4edea3]' : 'bg-slate-800'}`}
                >
                  <span className={`w-5 h-5 rounded-full bg-white shadow absolute transition-all duration-300 ${emissionCapping ? 'left-8' : 'left-1'}`} />
                </button>
              </div>
            </div>

            {/* Guardrail Item 3 */}
            <div className="p-lg bg-slate-950/60 border border-slate-850 rounded-lg flex justify-between items-center transition-all duration-300 hover:border-slate-700">
              <div className="flex items-start gap-4">
                <div className={`p-3 rounded-lg border ${trafficDiverters ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-red-500/10 border-red-500/20 text-red-400'}`}>
                  <span className="material-symbols-outlined text-[32px]">directions_car</span>
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white uppercase tracking-wider">Traffic Flow Diverters</h4>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed max-w-xl">
                    Automatically reroutes heavy vehicles and commercial trucks around central municipal zones when ground sensor arrays detect microclimate stagnation.
                  </p>
                </div>
              </div>
              <div className="flex flex-col items-end gap-sm">
                <span className={`text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                  trafficDiverters ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-red-500/10 text-red-500 border border-red-500/20'
                }`}>
                  {trafficDiverters ? 'System Enforcing' : 'OVERRIDDEN / DISABLED'}
                </span>
                <button 
                  onClick={() => handleToggleClick("traffic", trafficDiverters)}
                  className={`w-14 h-7 rounded-full transition-colors relative flex items-center ${trafficDiverters ? 'bg-[#4edea3]' : 'bg-slate-800'}`}
                >
                  <span className={`w-5 h-5 rounded-full bg-white shadow absolute transition-all duration-300 ${trafficDiverters ? 'left-8' : 'left-1'}`} />
                </button>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Right Panel - Audit Trails */}
      <aside className="w-full lg:w-[350px] h-full bg-slate-900/60 border-l border-[#3c4a42]/30 flex flex-col overflow-hidden shrink-0 text-left">
        <div className="p-lg flex flex-col gap-lg h-full">
          
          <div className="flex flex-col gap-xs">
            <h2 className="text-xs font-bold text-white uppercase tracking-wider">Audit Ledger Engine</h2>
            <p className="text-[11px] text-slate-400 leading-relaxed">Immutable Ledger Feed</p>
            <div className="p-2.5 bg-slate-950 rounded border border-slate-850 mt-xs">
              <p className="font-mono text-white text-[10px] leading-relaxed">
                SYNCED WITH GOVCHAIN BLOCKCHAIN LEDGER NODE #MUM-NODE-12
              </p>
            </div>
          </div>

          <div className="flex flex-col flex-grow overflow-hidden">
            <div className="flex items-center justify-between mb-md">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                Override Audit Logs
              </h3>
              <span className="material-symbols-outlined text-slate-500 text-sm">history</span>
            </div>

            <div className="flex-1 p-md font-mono text-[11px] overflow-y-auto bg-slate-950 rounded border border-slate-850 custom-scrollbar flex flex-col gap-3">
              {auditLogs.map((log, idx) => (
                <div key={idx} className="border-b border-slate-900 pb-2">
                  <div className="flex justify-between text-slate-500 text-[9px] mb-1">
                    <span>{log.timestamp}</span>
                    <span className="text-[#4edea3] font-bold">{log.author}</span>
                  </div>
                  <p className="text-white text-xs leading-relaxed">{log.action}</p>
                  <div className="mt-1 flex justify-start">
                    <span className={`text-[8px] uppercase tracking-wider font-bold ${
                      log.status === "active" ? "text-[#4edea3]" : log.status === "bypassed" ? "text-red-500 animate-pulse" : "text-blue-400"
                    }`}>
                      Status: {log.status}
                    </span>
                  </div>
                </div>
              ))}
              <div ref={terminalEndRef} />
            </div>
          </div>
        </div>
      </aside>

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-md">
          <div className="bg-slate-900 border border-slate-800 rounded-lg max-w-md w-full p-lg flex flex-col gap-md shadow-2xl relative text-left">
            <h3 className="text-white font-bold text-sm flex items-center gap-2 uppercase tracking-wider">
              <span className="material-symbols-outlined text-red-500">warning</span>
              <span>Confirm Statutory Override</span>
            </h3>
            
            <p className="text-slate-400 text-xs leading-relaxed">
              WARNING: Suspending statutory compliance limits may violate environmental safety regulations. Please type the Administrator Security Token to authorize bypass.
            </p>

            <div className="flex flex-col gap-xs font-mono text-xs">
              <label className="text-slate-400">ADMIN TOKEN (Hint: VAYU-2026)</label>
              <input
                type="text"
                placeholder="Enter Token"
                value={adminToken}
                onChange={(e) => setAdminToken(e.target.value)}
                className="w-full bg-slate-950 border border-slate-850 text-white p-sm rounded focus:outline-none focus:border-red-500 text-xs"
              />
              {modalError && <p className="text-red-500 text-[10px] mt-1 font-bold">{modalError}</p>}
            </div>

            <div className="flex justify-end gap-md mt-sm">
              <button 
                onClick={() => setShowConfirmModal(false)}
                className="px-4 py-2 text-slate-400 hover:text-white text-xs uppercase font-bold"
              >
                Cancel
              </button>
              <button 
                onClick={handleConfirmOverride}
                className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded text-xs uppercase font-bold"
              >
                Authorize Override
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
