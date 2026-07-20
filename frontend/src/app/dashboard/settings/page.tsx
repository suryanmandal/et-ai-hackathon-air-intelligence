"use client";

import React, { useState } from "react";

interface AdminOfficer {
  name: string;
  department: string;
  jurisdiction: string;
  token: string;
}

const ADMIN_OFFICERS: AdminOfficer[] = [
  {
    name: "Dr. Abhijit K. Bhosale, IAS",
    department: "Environment & Disaster Management Cell, BMC",
    jurisdiction: "Mumbai Metropolitan Region (MMR)",
    token: "0x8f7d6s5a4q3w2e1r0t9y8u7i6o5p4l3k2j1h-VAYU"
  }
];

export default function SettingsPage() {
  // Threshold States
  const [aqiThreshold, setAqiThreshold] = useState<number>(200);
  const [pmThreshold, setPmThreshold] = useState<number>(150);
  const [driftTolerance, setDriftTolerance] = useState<number>(12);

  // Toggle Policies
  const [facialConsistency, setFacialConsistency] = useState<boolean>(true);
  const [autoFiling, setAutoFiling] = useState<boolean>(true);
  const [bypassCache, setBypassCache] = useState<boolean>(false);

  // ESA and MPCB key states
  const [esaToken, setEsaToken] = useState<string>("8f7d6s5a4q3w2e1r0t9y8u7i6o5p4l3k2j1h");
  const [mpcbSecret, setMpcbSecret] = useState<string>("m1p2c3b4s5e6c7r8e9t0k1e2y3v4a5l6u7e8");
  const [showEsa, setShowEsa] = useState<boolean>(false);
  const [showMpcb, setShowMpcb] = useState<boolean>(false);

  // Committing State
  const [isCommitting, setIsCommitting] = useState<boolean>(false);
  const [commitMessage, setCommitMessage] = useState<string>("");

  const handleCommit = () => {
    setIsCommitting(true);
    setCommitMessage("Authorizing configuration changes...");
    
    setTimeout(() => {
      setCommitMessage("Generating SHA-256 state signature...");
      setTimeout(() => {
        setCommitMessage("Syncing parameters to GovChain Ledger...");
        setTimeout(() => {
          setIsCommitting(false);
          setCommitMessage("");
          alert("Settings committed successfully and recorded in GovChain Ledger.");
        }, 800);
      }, 800);
    }, 800);
  };

  const handleReset = () => {
    setAqiThreshold(200);
    setPmThreshold(150);
    setDriftTolerance(12);
    setFacialConsistency(true);
    setAutoFiling(true);
    setBypassCache(false);
  };

  return (
    <div className="flex-grow bg-slate-950 p-lg flex flex-col gap-lg overflow-y-auto custom-scrollbar text-left h-full">
      
      {/* Header */}
      <header className="border-b border-slate-800 pb-4">
        <h1 className="text-xl font-bold text-white uppercase tracking-wider">Command Configuration Panel</h1>
        <p className="text-xs text-slate-400 mt-1">Municipal Security Clearance: Level 4 (Directorate Oversight)</p>
      </header>

      {/* Main Grid Stack */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl w-full flex-1">
        
        {/* Panel 1: Active Administrative Officer Profile */}
        <section className="bg-slate-900/40 backdrop-blur-md border border-slate-800 rounded-xl p-6 flex flex-col gap-4">
          <span className="text-[10px] font-mono font-bold text-primary uppercase tracking-widest border-b border-slate-800/60 pb-2">
            Active Administrative Officer Profile
          </span>
          {ADMIN_OFFICERS.map((officer, index) => (
            <div key={index} className="flex gap-4 items-start pt-2">
              <div className="relative shrink-0">
                <div className="w-20 h-20 bg-slate-950 rounded border border-slate-800 overflow-hidden flex items-center justify-center">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img 
                    className="w-full h-full object-cover grayscale opacity-80" 
                    alt="Dr. Abhijit K. Bhosale" 
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuDoVaJBowY7LIraqEsrlsFAXPMKC_HGYEjpsC1MyV1DLvVJMSgRdeqkCpMqvMn-m2J50AcIcdmgikS4AfhNSs4j9wdfd7WhjDlvZ-QT7WfT6jyu3Rf0Q0MIMS7LOvXqpSVdb05SZ7iXWhVn2F_ILztRM8HrawKK3-tWkxrgApUHyTUiIDZBLcs1BTLvIFqFatfo42rlPysrIpXMs2-Hn39RBU6I3T2bflHlCa3r3tSAMy52TNJJJt32b2g8p_sWjQ6rLhhXKEScBT4"
                  />
                </div>
                <div className="absolute inset-0 border border-primary/20 pointer-events-none"></div>
              </div>
              <div className="flex flex-col gap-3 font-mono tracking-tight text-xs text-slate-300">
                <div className="flex flex-col">
                  <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">OFFICER NAME</span>
                  <span className="text-primary font-bold text-sm">{officer.name}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">DEPARTMENT</span>
                  <span className="text-white">{officer.department}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">JURISDICTION</span>
                  <span className="text-white">{officer.jurisdiction}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">SIGNATURE SECURE KEY</span>
                  <span className="text-[#00e5ff] font-semibold break-all text-[10px]">{officer.token}</span>
                </div>
              </div>
            </div>
          ))}
        </section>

        {/* Panel 2: Sensor Ingestion Calibration Thresholds */}
        <section className="bg-slate-900/40 backdrop-blur-md border border-slate-800 rounded-xl p-6 flex flex-col gap-4">
          <span className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-widest border-b border-slate-800/60 pb-2">
            Municipal Statutory Trigger Matrix
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-md flex-grow pt-2">
            
            {/* Critical AQI Breach */}
            <div className="flex flex-col gap-2 p-3 bg-slate-950/80 border border-slate-800 rounded">
              <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Critical AQI Breach</label>
              <div className="flex items-center justify-between mt-auto">
                <span className="font-mono text-xl font-bold text-primary">{aqiThreshold}</span>
                <div className="flex flex-col gap-0.5">
                  <button 
                    onClick={() => setAqiThreshold(prev => prev + 5)}
                    className="material-symbols-outlined text-xs text-slate-500 hover:text-primary leading-none"
                  >
                    expand_less
                  </button>
                  <button 
                    onClick={() => setAqiThreshold(prev => Math.max(0, prev - 5))}
                    className="material-symbols-outlined text-xs text-slate-500 hover:text-primary leading-none"
                  >
                    expand_more
                  </button>
                </div>
              </div>
            </div>

            {/* High-Freq PM2.5 Ceiling */}
            <div className="flex flex-col gap-2 p-3 bg-slate-950/80 border border-slate-800 rounded">
              <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">PM2.5 Ceiling (μg/m³)</label>
              <div className="flex items-center justify-between mt-auto">
                <span className="font-mono text-xl font-bold text-primary">{pmThreshold}</span>
                <div className="flex flex-col gap-0.5">
                  <button 
                    onClick={() => setPmThreshold(prev => prev + 5)}
                    className="material-symbols-outlined text-xs text-slate-500 hover:text-primary leading-none"
                  >
                    expand_less
                  </button>
                  <button 
                    onClick={() => setPmThreshold(prev => Math.max(0, prev - 5))}
                    className="material-symbols-outlined text-xs text-slate-500 hover:text-primary leading-none"
                  >
                    expand_more
                  </button>
                </div>
              </div>
            </div>

            {/* Sensor Drift Tolerance */}
            <div className="flex flex-col gap-2 p-3 bg-slate-950/80 border border-slate-800 rounded">
              <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Drift Tolerance</label>
              <div className="flex items-center justify-between mt-auto">
                <span className="font-mono text-xl font-bold text-primary">±{driftTolerance}%</span>
                <div className="flex flex-col gap-0.5">
                  <button 
                    onClick={() => setDriftTolerance(prev => prev + 1)}
                    className="material-symbols-outlined text-xs text-slate-500 hover:text-primary leading-none"
                  >
                    expand_less
                  </button>
                  <button 
                    onClick={() => setDriftTolerance(prev => Math.max(0, prev - 1))}
                    className="material-symbols-outlined text-xs text-slate-500 hover:text-primary leading-none"
                  >
                    expand_more
                  </button>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* Panel 3: Cryptographic Access Key Management */}
        <section className="bg-slate-900/40 backdrop-blur-md border border-slate-800 rounded-xl p-6 flex flex-col gap-4">
          <span className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-widest border-b border-slate-800/60 pb-2">
            Secure Infrastructure Integrations
          </span>
          <div className="flex flex-col gap-4 pt-2">
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">ESA Copernicus Hub Access Token</label>
              <div className="flex items-center border border-slate-800 bg-slate-950 rounded px-3 py-1.5 focus-within:border-primary transition-colors">
                <input 
                  className="w-full bg-transparent border-none focus:outline-none focus:ring-0 font-mono text-xs text-primary/80" 
                  type={showEsa ? "text" : "password"} 
                  value={esaToken}
                  onChange={(e) => setEsaToken(e.target.value)}
                />
                <button 
                  onClick={() => setShowEsa(!showEsa)}
                  className="material-symbols-outlined text-slate-500 hover:text-primary text-sm flex items-center justify-center"
                >
                  {showEsa ? "visibility_off" : "visibility"}
                </button>
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">State Pollution Control Board (MPCB) Secret Key</label>
              <div className="flex items-center border border-slate-800 bg-slate-950 rounded px-3 py-1.5 focus-within:border-primary transition-colors">
                <input 
                  className="w-full bg-transparent border-none focus:outline-none focus:ring-0 font-mono text-xs text-primary/80" 
                  type={showMpcb ? "text" : "password"} 
                  value={mpcbSecret}
                  onChange={(e) => setMpcbSecret(e.target.value)}
                />
                <button 
                  onClick={() => setShowMpcb(!showMpcb)}
                  className="material-symbols-outlined text-slate-500 hover:text-primary text-sm flex items-center justify-center"
                >
                  {showMpcb ? "visibility_off" : "visibility"}
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Panel 4: System Safeguards & Protocols */}
        <section className="bg-slate-900/40 backdrop-blur-md border border-slate-800 rounded-xl p-6 flex flex-col gap-4">
          <span className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-widest border-b border-slate-800/60 pb-2">
            Automated Enforcement Policies
          </span>
          <div className="flex flex-col gap-3 pt-2">
            
            {/* Strict Facial Consistency */}
            <div className="flex items-center justify-between p-3 bg-slate-950/80 border border-slate-850 rounded">
              <div className="flex flex-col gap-0.5">
                <span className="text-xs font-semibold text-white">Strict Facial Consistency Mode</span>
                <span className="text-[10px] text-slate-500 font-mono">(AR Field Subsystems)</span>
              </div>
              <button 
                onClick={() => setFacialConsistency(!facialConsistency)}
                className={`w-11 h-6 rounded-full transition-colors relative flex items-center shrink-0 ${facialConsistency ? 'bg-primary' : 'bg-slate-800'}`}
              >
                <span className={`w-4 h-4 rounded-full bg-white shadow absolute transition-all duration-300 ${facialConsistency ? 'left-6' : 'left-1'}`} />
              </button>
            </div>

            {/* Enforce Immediate Compliance Filing */}
            <div className="flex items-center justify-between p-3 bg-slate-950/80 border border-slate-850 rounded">
              <div className="flex flex-col gap-0.5">
                <span className="text-xs font-semibold text-white">Enforce Immediate Compliance Filing</span>
                <span className="text-[10px] text-slate-500 font-mono">(Multi-Agent Sync Protocols)</span>
              </div>
              <button 
                onClick={() => setAutoFiling(!autoFiling)}
                className={`w-11 h-6 rounded-full transition-colors relative flex items-center shrink-0 ${autoFiling ? 'bg-primary' : 'bg-slate-800'}`}
              >
                <span className={`w-4 h-4 rounded-full bg-white shadow absolute transition-all duration-300 ${autoFiling ? 'left-6' : 'left-1'}`} />
              </button>
            </div>

            {/* Bypass Regional Language caching */}
            <div className="flex items-center justify-between p-3 bg-slate-950/80 border border-slate-850 rounded">
              <div className="flex flex-col gap-0.5">
                <span className="text-xs font-semibold text-white">Bypass Language Translation Cache</span>
                <span className="text-[10px] text-slate-500 font-mono">(Regional Translation Engine)</span>
              </div>
              <button 
                onClick={() => setBypassCache(!bypassCache)}
                className={`w-11 h-6 rounded-full transition-colors relative flex items-center shrink-0 ${bypassCache ? 'bg-primary' : 'bg-slate-800'}`}
              >
                <span className={`w-4 h-4 rounded-full bg-white shadow absolute transition-all duration-300 ${bypassCache ? 'left-6' : 'left-1'}`} />
              </button>
            </div>

          </div>
        </section>

      </div>

      {/* Footer Actions */}
      <div className="mt-xl flex flex-col sm:flex-row justify-between items-center gap-md border-t border-slate-800 pt-6">
        <div>
          {isCommitting && (
            <div className="flex items-center gap-2 text-primary font-mono text-xs font-semibold animate-pulse">
              <span className="material-symbols-outlined text-sm animate-spin">sync</span>
              <span>{commitMessage}</span>
            </div>
          )}
        </div>
        <div className="flex items-center gap-6">
          <button 
            onClick={handleReset}
            disabled={isCommitting}
            className="text-slate-500 hover:text-white font-mono text-[10px] font-bold uppercase tracking-wider transition-colors disabled:opacity-50"
          >
            RESET TO MUNICIPAL BASELINES
          </button>
          <button 
            onClick={handleCommit}
            disabled={isCommitting}
            className="bg-primary hover:bg-[#4edea3] text-slate-950 font-mono text-[10px] font-bold px-lg py-3 uppercase tracking-wider transition-colors active:scale-95 disabled:opacity-50"
          >
            COMMIT CHANGES & SECURE LOG
          </button>
        </div>
      </div>

    </div>
  );
}
