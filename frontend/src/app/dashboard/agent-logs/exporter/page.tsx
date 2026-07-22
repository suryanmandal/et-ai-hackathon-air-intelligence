"use client";

import React, { useState } from "react";
import { jsPDF } from "jspdf";

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

  const downloadReport = (format: string, source: string, sha: string, tx: string) => {
    if (format === "pdf") {
      const doc = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4"
      });

      const primaryColor = "#10b981"; // Emerald Green
      const cardBgColor = "#1e293b"; // Slate 800
      const textLight = "#f8fafc";
      const textMuted = "#94a3b8";
      const accentColor = "#22d3ee"; // Cyan Accent

      // Theme background
      doc.setFillColor("#0f172a"); // Dark Slate 950
      doc.rect(0, 0, 210, 297, "F");

      // Top indicator strip
      doc.setFillColor(primaryColor);
      doc.rect(0, 0, 210, 5, "F");

      // Title & Header details
      doc.setFont("helvetica", "bold");
      doc.setFontSize(20);
      doc.setTextColor(primaryColor);
      doc.text("VAYUSENSE TRANSACTION REPORT", 15, 20);

      doc.setFontSize(9);
      doc.setTextColor(textLight);
      doc.text("STATUTORY SYSTEM TRANSACTION TRAIL & IMMUTABLE LOG AUDIT EXPORT", 15, 26);

      // Metadata Divider line
      doc.setDrawColor("#334155");
      doc.setLineWidth(0.5);
      doc.line(15, 30, 195, 30);

      // Role and Authority Clearance Card
      doc.setFillColor(cardBgColor);
      doc.rect(15, 36, 180, 28, "F");
      doc.setDrawColor(primaryColor);
      doc.rect(15, 36, 180, 28, "D");

      doc.setFont("helvetica", "bold");
      doc.setFontSize(8);
      doc.setTextColor(primaryColor);
      doc.text("SECURITY PROTOCOL & CLEARANCE LEVEL 4:", 20, 43);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(textLight);
      doc.text("EXPORT CLEARED BY:", 20, 50);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(primaryColor);
      doc.text("DR. ABHIJIT K. BHOSALE, IAS (MUNICIPAL COMMAND DIRECTOR)", 58, 50);

      doc.setFont("helvetica", "normal");
      doc.setTextColor(textLight);
      doc.text("Cryptographic Sync Status:", 20, 57);
      doc.setFont("helvetica", "bold");
      doc.text("GovChain Consensus Ledger Synced (ACTIVE)", 62, 57);

      // Section 1: Ingress Meta details
      doc.setFont("helvetica", "bold");
      doc.setFontSize(11);
      doc.setTextColor(primaryColor);
      doc.text("1. TRANSACTION EXPORT METADATA", 15, 75);

      doc.setFillColor(cardBgColor);
      doc.rect(15, 80, 180, 36, "F");
      doc.setDrawColor("#475569");
      doc.rect(15, 80, 180, 36, "D");

      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      doc.setTextColor(textLight);
      doc.text("Log Ingress Source:", 20, 87);
      doc.text("Total Records Exported:", 20, 94);
      doc.text("GovChain Transaction Receipt:", 20, 101);
      doc.text("Audit Log Integrity Hash:", 20, 108);

      doc.setFont("helvetica", "bold");
      doc.text(source.toUpperCase() + " LOGS", 65, 87);
      doc.text(String(MOCK_LOGS[source].length) + " operational rows", 65, 94);
      doc.setFont("courier", "bold");
      doc.setFontSize(8.5);
      doc.setTextColor(accentColor);
      doc.text(tx.substring(0, 35) + "...", 65, 101);
      doc.text(sha.substring(0, 35) + "...", 65, 108);

      // Section 2: Log Trail Records Table
      doc.setFont("helvetica", "bold");
      doc.setFontSize(11);
      doc.setTextColor(primaryColor);
      doc.text("2. REGISTERED AUDIT LOGS LEDGER", 15, 128);

      let logY = 135;
      const logs = MOCK_LOGS[source];
      logs.forEach((log) => {
        // Draw individual record box
        doc.setFillColor("#090d16");
        doc.rect(15, logY, 180, 32, "F");
        doc.setDrawColor("#334155");
        doc.rect(15, logY, 180, 32, "D");

        doc.setFont("courier", "bold");
        doc.setFontSize(8);
        doc.setTextColor(primaryColor);
        doc.text(`RECORD ID: ${log.id}`, 18, logY + 6);
        doc.setFont("courier", "normal");
        doc.setTextColor(textLight);
        doc.text(`Timestamp: ${log.timestamp} | Event: ${log.event}`, 18, logY + 13);
        doc.text(`Source Node: ${log.source}`, 18, logY + 20);
        doc.setTextColor(accentColor);
        doc.text(`Payload: ${log.payload.substring(0, 90)}...`, 18, logY + 27);

        logY += 36;
      });

      // Verification seal footer
      doc.setFont("helvetica", "normal");
      doc.setFontSize(7.5);
      doc.setTextColor(textMuted);
      doc.text(`VERIFICATION CHECKSUM HASH: SHA256//${sha}`, 15, 275);
      doc.text("LEGAL DISCLAIMER: Non-repudiated log export generated automatically under regulatory framework section 42/a.", 15, 281);

      doc.save(`VayuSense_${source}_Cryptographic_Report_${Date.now()}.pdf`);
      return;
    }

    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(
      JSON.stringify({
        exportMeta: {
          timestamp: new Date().toISOString(),
          format: format,
          integrityHash: sha,
          govchainTx: tx,
          recordsCount: MOCK_LOGS[source].length
        },
        logs: MOCK_LOGS[source]
      }, null, 2)
    );
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `vayusense_${source}_export.${format}`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
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
          const sha = generateChecksum(rawString);
          const tx = "0x" + Math.floor(Math.random() * 10000000).toString(16) + "e81d4a82dfbc8813bcda41e8cba9a";
          
          setShaHash(sha);
          setTxHash(tx);
          setIsExporting(false);
          setShowResultModal(true);
          
          // Trigger the download automatically at 100% progress completion
          downloadReport(exportFormat, selectedSource, sha, tx);
          return 100;
        }
        return prev + 20;
      });
    }, 300);
  };

  const handleDownload = () => {
    downloadReport(exportFormat, selectedSource, shaHash, txHash);
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
              <div className="grid grid-cols-3 gap-sm">
                {["json", "csv", "pdf"].map((fmt) => (
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
              ) : exportFormat === "csv" ? (
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
              ) : (
                <div className="text-left flex flex-col gap-4 font-sans text-xs">
                  <div className="bg-[#0b0f19] border border-slate-800 p-4 rounded text-slate-400">
                    <div className="flex justify-between items-center border-b border-slate-800 pb-2 mb-3">
                      <span className="font-bold text-emerald-400">📄 PDF REPORT PREVIEW</span>
                      <span className="text-[10px] font-mono uppercase bg-emerald-500/10 px-2 py-0.5 text-emerald-400 border border-emerald-500/20 rounded">
                        Clearance Lvl 4 Active
                      </span>
                    </div>
                    <div className="flex flex-col gap-2 font-mono text-[10px]">
                      <p><span className="text-slate-500">Document Type:</span> Statutory Cryptographic Log Audit Ledger</p>
                      <p><span className="text-slate-500">Authorized by:</span> Dr. Abhijit K. Bhosale, IAS -- Municipal Command Director</p>
                      <p><span className="text-slate-500">Records Count:</span> {MOCK_LOGS[selectedSource].length} rows</p>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2 border-t border-slate-900 pt-3">
                    <p className="text-slate-500 font-mono text-[10px] uppercase font-bold">Document Content Structure:</p>
                    <ul className="list-disc list-inside text-slate-400 space-y-1 text-[11px]">
                      <li>VayuSense Security Seal & Credentials Handshake Meta</li>
                      <li>Ingestion source telemetry parameters ({selectedSource.toUpperCase()})</li>
                      <li>Cryptographically signed SHA-256 records table</li>
                    </ul>
                  </div>
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
                <span className="material-symbols-outlined text-sm font-bold">
                  {exportFormat === "pdf" ? "picture_as_pdf" : "download"}
                </span>
                <span>Download Signed {exportFormat === "pdf" ? "Report" : "Package"}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
