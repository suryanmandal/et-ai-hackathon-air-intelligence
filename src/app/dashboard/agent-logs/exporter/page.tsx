"use client";

import React, { useState } from "react";

interface MockLog {
  id: string;
  timestamp: string;
  source: string;
  event: string;
  payload: string;
}

const MOCK_LOGS: Record<string, MockLog[]> = {
  telemetry: [
    { id: "LOG-TEL-001", timestamp: "2026-07-14 21:05:10", source: "SENSOR_MUM_042", event: "PM2.5_READING", payload: '{"pm25": 184, "unit": "μg/m\u00b3", "status": "critical"}' },
    { id: "LOG-TEL-002", timestamp: "2026-07-14 21:07:32", source: "SENSOR_MUM_042", event: "NO2_READING", payload: '{"no2": 95, "unit": "ppb", "status": "elevated"}' },
    { id: "LOG-TEL-003", timestamp: "2026-07-14 21:10:00", source: "WEATHER_MUM_042", event: "WIND_VECTOR", payload: '{"speed": 3.5, "direction": "NW", "humidity": 78}' },
    { id: "LOG-TEL-004", timestamp: "2026-07-14 21:12:44", source: "SENSOR_MUM_088", event: "PM10_READING", payload: '{"pm10": 110, "unit": "μg/m\u00b3", "status": "nominal"}' }
  ],
  ml_ops: [
    { id: "LOG-ML-801", timestamp: "2026-07-14 18:30:15", source: "XGBOOST_TRAINER", event: "EPOCH_CONVERGENCE", payload: '{"epoch": 120, "train_loss": 0.045, "val_rmse": 0.082}' },
    { id: "LOG-ML-802", timestamp: "2026-07-14 18:31:02", source: "XGBOOST_TRAINER", event: "OPTIMIZATION_TUNE", payload: '{"learning_rate": 0.05, "max_depth": 7, "n_estimators": 450}' },
    { id: "LOG-ML-803", timestamp: "2026-07-14 19:02:11", source: "SCENARIO_SANDBOX", event: "PREDICTIVE_TRAJECTORY", payload: '{"traffic_density": 45, "industrial_output": 22, "peak_aqi": 184}' }
  ],
  overrides: [
    { id: "LOG-OVR-901", timestamp: "2026-07-14 14:10:05", source: "SYSTEM_DAEMON", event: "GUARDRAIL_STATE_SYNC", payload: '{"warning_broadcasts": true, "emission_capping": true}' },
    { id: "LOG-OVR-902", timestamp: "2026-07-14 15:02:44", source: "ADMIN_SYS", event: "GUARDRAIL_BYPASS_ATTEMPT", payload: '{"target": "industrial_emissions_capping", "passcode": "VAYU-2026", "status": "authorized"}' },
    { id: "LOG-OVR-903", timestamp: "2026-07-14 15:02:48", source: "ADMIN_SYS", event: "GUARDRAIL_OVERRIDE_ACTIVE", payload: '{"guardrail": "Industrial Emissions Capping", "action": "SUSPENDED"}' }
  ],
  agentic: [
    { id: "LOG-AGT-401", timestamp: "2026-07-14 11:32:22", source: "ComplianceAgent", event: "HANDSHAKE_INIT", payload: '{"credentials": "valid", "latency": "42ms"}' },
    { id: "LOG-AGT-402", timestamp: "2026-07-14 11:32:25", source: "SensorAgent", event: "SPIKE_WARN_BROADCAST", payload: '{"target": "SourceAttributionAgent", "cluster": "MUM_042"}' },
    { id: "LOG-AGT-403", timestamp: "2026-07-14 11:32:30", source: "SourceAttributionAgent", event: "SOURCE_ISOLATION_MATCH", payload: '{"sector": "IN-MUM-882", "confidence": 0.94}' }
  ]
};

export default function LogExporter() {
  // Exporter Filter Configs
  const [selectedSource, setSelectedSource] = useState<string>("telemetry");
  const [exportFormat, setExportFormat] = useState<string>("json");
  const [includeHashes, setIncludeHashes] = useState<boolean>(true);
  const [encryptPayloads, setEncryptPayloads] = useState<boolean>(false);

  // Execution states
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [exportProgress, setExportProgress] = useState<number>(0);
  const [shaHash, setShaHash] = useState<string>("");
  const [txHash, setTxHash] = useState<string>("");
  const [showResultModal, setShowResultModal] = useState<boolean>(false);

  // Generate SHA-256 checksum mockup helper
  const generateChecksum = (data: string) => {
    let hash = 0;
    for (let i = 0; i < data.length; i++) {
      hash = (hash << 5) - hash + data.charCodeAt(i);
      hash = hash & hash;
    }
    return "0x" + Math.abs(hash).toString(16).padStart(8, '0') + "ea195be893bc43ddaa728bf80f682d3345ce2810a9cf" + Math.floor(Math.random() * 9000 + 1000);
  };

  const handleExport = () => {
    setIsExporting(true);
    setExportProgress(0);
    
    // Simulate compilation pipeline
    const interval = setInterval(() => {
      setExportProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          const rawString = JSON.stringify(MOCK_LOGS[selectedSource]);
          setShaHash(generateChecksum(rawString));
          setTxHash("0x" + Math.floor(Math.random() * 10000000).toString(16) + "e81d4a82dfbc8813bcda41e8cba9a");
          setIsExporting(false);
          setShowResultModal(true);
          return 100;
        }
        return prev + 20;
      });
    }, 300);
  };

  const handleDownload = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(
      JSON.stringify({
        exportMeta: {
          timestamp: new Date().toISOString(),
          format: exportFormat,
          integrityHash: shaHash,
          govchainTx: txHash,
          recordsCount: MOCK_LOGS[selectedSource].length
        },
        logs: MOCK_LOGS[selectedSource]
      }, null, 2)
    );
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `vayusense_${selectedSource}_export.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    setShowResultModal(false);
  };

  return (
    <div className="flex-grow bg-slate-950 p-lg flex flex-col gap-lg overflow-y-auto custom-scrollbar text-left h-full">
      <div className="flex justify-between items-center border-b border-slate-800 pb-4">
        <div>
          <h2 className="text-sm font-bold text-white uppercase tracking-wider">Immutable API System Log Exporter</h2>
          <p className="text-xs text-slate-400 mt-1">Export mathematically signed, audited air quality operational logs</p>
        </div>
        <div className="flex items-center gap-xs px-sm py-1 bg-red-500/10 border border-red-500/20 rounded">
          <span className="material-symbols-outlined text-sm text-red-500">lock</span>
          <span className="text-[10px] font-mono text-red-500 tracking-wider uppercase font-bold">SECURITY LAYER: AES-256</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-lg flex-1">
        
        {/* Left Controls Column (40% / 5 cols) */}
        <div className="lg:col-span-5 flex flex-col gap-md">
          
          {/* Configuration panel */}
          <div className="glass-panel p-lg rounded-lg border border-slate-800 bg-slate-900/60 backdrop-blur-md flex flex-col gap-5">
            <span className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-widest border-b border-slate-800 pb-2">
              Exporter Parameters
            </span>

            {/* Log Category Selector */}
            <div className="flex flex-col gap-2">
              <label className="text-xs text-slate-300 font-semibold">Log Category Source</label>
              <select 
                value={selectedSource}
                onChange={(e) => setSelectedSource(e.target.value)}
                className="bg-slate-950 border border-slate-800 text-white text-xs p-sm rounded focus:outline-none focus:border-primary font-mono cursor-pointer"
              >
                <option value="telemetry">IoT Telemetry & Warnings (MUM_042)</option>
                <option value="ml_ops">Model Convergence History & Sandbox</option>
                <option value="overrides">Statutory Overrides & Ledger Audits</option>
                <option value="agentic">Multi-Agent Network topology Logs</option>
              </select>
            </div>

            {/* Export Format Selector */}
            <div className="flex flex-col gap-2">
              <label className="text-xs text-slate-300 font-semibold">Output Export Format</label>
              <div className="grid grid-cols-2 gap-sm">
                {["json", "csv"].map((fmt) => (
                  <button
                    key={fmt}
                    onClick={() => setExportFormat(fmt)}
                    className={`py-2 text-xs font-mono font-bold rounded border uppercase tracking-wider transition-colors ${
                      exportFormat === fmt 
                        ? "bg-primary border-primary text-slate-950" 
                        : "bg-slate-950 border-slate-800 text-slate-400 hover:text-white"
                    }`}
                  >
                    {fmt}
                  </button>
                ))}
              </div>
            </div>

            {/* Immutability Switches */}
            <div className="flex flex-col gap-3 pt-2">
              <div className="flex justify-between items-center">
                <div className="flex flex-col">
                  <span className="text-xs font-semibold text-white">Generate Cryptographic Hash</span>
                  <span className="text-[10px] text-slate-450 leading-normal">Signs bundle check with SHA-256</span>
                </div>
                <button 
                  onClick={() => setIncludeHashes(!includeHashes)}
                  className={`w-12 h-6 rounded-full transition-colors relative flex items-center ${includeHashes ? 'bg-primary' : 'bg-slate-800'}`}
                >
                  <span className={`w-4 h-4 rounded-full bg-white shadow absolute transition-all duration-300 ${includeHashes ? 'left-7' : 'left-1'}`} />
                </button>
              </div>

              <div className="flex justify-between items-center">
                <div className="flex flex-col">
                  <span className="text-xs font-semibold text-white">AES Payload Encryption</span>
                  <span className="text-[10px] text-slate-455 leading-normal">Encrypts payloads for regulatory review</span>
                </div>
                <button 
                  onClick={() => setEncryptPayloads(!encryptPayloads)}
                  className={`w-12 h-6 rounded-full transition-colors relative flex items-center ${encryptPayloads ? 'bg-primary' : 'bg-slate-800'}`}
                >
                  <span className={`w-4 h-4 rounded-full bg-white shadow absolute transition-all duration-300 ${encryptPayloads ? 'left-7' : 'left-1'}`} />
                </button>
              </div>
            </div>

            {/* Exporter Execution */}
            <div className="pt-4 border-t border-slate-800 flex flex-col gap-3">
              {isExporting ? (
                <div className="flex flex-col gap-2">
                  <div className="flex justify-between text-[10px] font-mono text-primary font-bold">
                    <span>COMPILING EVIDENCE PACKAGE...</span>
                    <span>{exportProgress}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                    <div 
                      className="h-full bg-primary transition-all duration-300"
                      style={{ width: `${exportProgress}%` }}
                    />
                  </div>
                </div>
              ) : (
                <button
                  onClick={handleExport}
                  className="w-full py-3 bg-primary hover:bg-[#4edea3] text-slate-950 font-bold text-xs uppercase tracking-wider rounded transition-colors flex items-center justify-center gap-2"
                >
                  <span className="material-symbols-outlined text-sm font-bold">verified_user</span>
                  <span>Execute Cryptographic Export</span>
                </button>
              )}
            </div>
          </div>

          {/* Ledger Interface sync details */}
          <div className="glass-panel p-md rounded-lg border border-slate-800 bg-slate-900/60 backdrop-blur-md font-mono text-[11px] leading-relaxed text-slate-450">
            <div className="flex items-center gap-2 text-primary font-bold mb-2">
              <span className="w-2 h-2 rounded-full bg-primary animate-ping"></span>
              <span>GovChain Ledger Interface</span>
            </div>
            <p>
              Every compiled log export contains a unique, non-repudiated hash registered automatically on the public regulatory ledger.
            </p>
            <div className="mt-2 bg-slate-950 p-2 border border-slate-850 rounded text-white font-bold">
              BLOCK AUTHORITY: MUM-NODE-12
            </div>
          </div>
        </div>

        {/* Right Output Viewer Column (60% / 7 cols) */}
        <div className="lg:col-span-7 flex flex-col gap-md">
          <div className="glass-panel flex-grow rounded-lg border border-slate-800 bg-slate-900/60 backdrop-blur-md p-lg flex flex-col overflow-hidden relative min-h-[400px]">
            
            <div className="flex justify-between items-center border-b border-slate-800 pb-3 mb-md">
              <span className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-widest">
                Telemetry Stream Preview
              </span>
              <span className="text-[10px] font-mono text-primary font-semibold uppercase tracking-wider bg-slate-950 px-2 py-0.5 rounded border border-slate-850">
                {MOCK_LOGS[selectedSource].length} Items Loaded
              </span>
            </div>

            <div className="flex-grow bg-slate-950 p-md rounded border border-slate-850 overflow-y-auto font-mono text-[11px] leading-relaxed text-slate-300">
              {exportFormat === "json" ? (
                <pre className="text-left text-white/90">
                  {JSON.stringify(MOCK_LOGS[selectedSource], null, 2)}
                </pre>
              ) : (
                <div className="text-left text-white/90">
                  <p className="text-slate-500 font-bold border-b border-slate-900 pb-1 mb-2">
                    id,timestamp,source,event,payload
                  </p>
                  {MOCK_LOGS[selectedSource].map((log) => (
                    <p key={log.id} className="hover:bg-slate-900 py-1 transition-colors">
                      {log.id},{log.timestamp},{log.source},{log.event},"{log.payload.replace(/"/g, '""')}"
                    </p>
                  ))}
                </div>
              )}
            </div>

          </div>
        </div>

      </div>

      {/* Export Result Modal */}
      {showResultModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-md">
          <div className="bg-slate-900 border border-slate-800 rounded-lg max-w-lg w-full p-lg flex flex-col gap-md shadow-2xl relative">
            <h3 className="text-white font-bold text-sm flex items-center gap-2 border-b border-slate-800 pb-3 uppercase tracking-wider">
              <span className="material-symbols-outlined text-primary">verified_user</span>
              <span>Evidence Bundle Signed Successfully</span>
            </h3>
            
            <p className="text-slate-400 text-xs leading-relaxed">
              VayuSense has signed the log export bundle with SHA-256 and synchronized the transaction registry receipt with the GovChain regulatory consensus layer.
            </p>

            <div className="flex flex-col gap-3 bg-slate-950 p-md rounded border border-slate-850 font-mono text-[11px]">
              <div className="flex flex-col gap-1">
                <span className="text-slate-500 uppercase font-bold tracking-widest text-[9px]">INTEGRITY SIGNATURE</span>
                <span className="text-primary break-all font-semibold select-all">{shaHash}</span>
              </div>

              <div className="flex flex-col gap-1 border-t border-slate-900 pt-2">
                <span className="text-slate-500 uppercase font-bold tracking-widest text-[9px]">GOVCHAIN TRANSACTION RECEIPT</span>
                <span className="text-white break-all font-semibold select-all">{txHash}</span>
              </div>

              <div className="flex justify-between border-t border-slate-900 pt-2 text-[10px]">
                <span className="text-slate-500">RECORDS SIGNED:</span>
                <span className="text-white font-bold">{MOCK_LOGS[selectedSource].length}</span>
              </div>
            </div>

            <div className="flex justify-end gap-md mt-sm">
              <button 
                onClick={() => setShowResultModal(false)}
                className="px-4 py-2 text-slate-400 hover:text-white text-xs uppercase font-bold"
              >
                Close
              </button>
              <button 
                onClick={handleDownload}
                className="px-4 py-2 bg-primary hover:bg-[#4edea3] text-slate-950 rounded text-xs uppercase font-bold flex items-center gap-1.5"
              >
                <span className="material-symbols-outlined text-sm font-bold">download</span>
                <span>Download Signed Package</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
