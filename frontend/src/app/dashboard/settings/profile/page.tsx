"use client";

import React, { useState } from "react";

export default function ProfilePage() {
  // Customizable UI parameters state
  const [viewportMode, setViewportMode] = useState<string>("hybrid-gis");
  const [refreshRate, setRefreshRate] = useState<string>("500ms");
  const [glassmorphismEnabled, setGlassmorphismEnabled] = useState<boolean>(true);

  const handleApplyPreferences = () => {
    alert("Workspace preferences applied successfully.");
  };

  return (
    <div className="flex-grow bg-slate-950 p-lg flex flex-col gap-lg overflow-y-auto custom-scrollbar text-left h-full">
      
      {/* Header */}
      <header className="border-b border-slate-800 pb-4">
        <h1 className="text-xl font-bold text-white uppercase tracking-wider">Administrative Profile</h1>
        <p className="text-xs text-slate-400 mt-1">Manage environmental supervisor credentials and workspace preferences</p>
      </header>

      {/* Main Grid Stack */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 w-full flex-1">
        
        {/* LEFT PANEL: Profile Card */}
        <section className="bg-slate-900/40 backdrop-blur border border-slate-800 rounded-xl p-6 flex flex-col items-center text-center gap-5">
          <span className="text-[10px] font-mono font-bold text-primary uppercase tracking-widest border-b border-slate-800/60 pb-2 w-full text-left">
            Officer Identification Card
          </span>
          
          <div className="relative my-2">
            <div className="w-28 h-28 rounded-full border-2 border-primary p-1 shadow-[0_0_15px_rgba(78,222,163,0.3)] overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img 
                alt="Biometric ID Avatar" 
                className="w-full h-full object-cover rounded-full grayscale opacity-90"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDoVaJBowY7LIraqEsrlsFAXPMKC_HGYEjpsC1MyV1DLvVJMSgRdeqkCpMqvMn-m2J50AcIcdmgikS4AfhNSs4j9wdfd7WhjDlvZ-QT7WfT6jyu3Rf0Q0MIMS7LOvXqpSVdb05SZ7iXWhVn2F_ILztRM8HrawKK3-tWkxrgApUHyTUiIDZBLcs1BTLvIFqFatfo42rlPysrIpXMs2-Hn39RBU6I3T2bflHlCa3r3tSAMy52TNJJJt32b2g8p_sWjQ6rLhhXKEScBT4"
              />
            </div>
            <div className="absolute bottom-1 right-1 w-4 h-4 bg-primary rounded-full border-2 border-slate-950 shadow-[0_0_8px_#10b981]" />
          </div>

          <div className="flex flex-col gap-1">
            <h2 className="text-lg font-bold text-white tracking-wide">Dr. Abhijit K. Bhosale, IAS</h2>
            <p className="text-xs text-primary font-mono font-semibold">Director, Environment & Disaster Management Cell</p>
          </div>

          <div className="w-full space-y-3 text-left border-t border-slate-800/60 pt-4 font-mono text-xs text-slate-300">
            <div className="flex flex-col border-b border-slate-900 pb-2">
              <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Municipal Node</span>
              <span className="text-white mt-0.5">BMC Headquarters, Fort, Mumbai</span>
            </div>
            <div className="flex flex-col border-b border-slate-900 pb-2">
              <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Authorization Rank</span>
              <span className="text-white mt-0.5">Clearance Level 4 (Executive Directorate)</span>
            </div>
            <div className="flex flex-col border-b border-slate-900 pb-2">
              <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Assigned Identity Token</span>
              <span className="text-[#00e5ff] font-semibold mt-0.5">UID-882-BMC-IAS-2026</span>
            </div>
            <div className="flex flex-col">
              <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">System Login Anchor</span>
              <span className="text-slate-450 italic text-[11px] mt-0.5">Session Verified via Secure Cryptographic Protocol</span>
            </div>
          </div>
        </section>

        {/* RIGHT PANEL: Operational Parameters */}
        <section className="bg-slate-900/40 backdrop-blur border border-slate-800 rounded-xl p-6 flex flex-col gap-5">
          <span className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-widest border-b border-slate-800/60 pb-2">
            Display & Operational Parameters
          </span>

          <div className="flex flex-col gap-4 flex-1 pt-2">
            {/* Viewport Select */}
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Default Operational Viewport</label>
              <select 
                value={viewportMode}
                onChange={(e) => setViewportMode(e.target.value)}
                className="bg-slate-950 border border-slate-800 text-white text-xs p-sm rounded focus:outline-none focus:border-primary font-mono cursor-pointer"
              >
                <option value="hybrid-gis">Widescreen Hybrid Satellite GIS Map</option>
                <option value="vector-topo">Standard Vector Topographic</option>
                <option value="thermal">Thermal Heatmap Overlay</option>
              </select>
            </div>

            {/* Refresh Stream Rate */}
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Log Terminal Stream Refresh Rate</label>
              <select 
                value={refreshRate}
                onChange={(e) => setRefreshRate(e.target.value)}
                className="bg-slate-950 border border-slate-800 text-white text-xs p-sm rounded focus:outline-none focus:border-primary font-mono cursor-pointer"
              >
                <option value="500ms">High-Frequency (500ms Stream Cache)</option>
                <option value="2000ms">Standard (2000ms)</option>
                <option value="5000ms">Low-Bandwidth (5000ms)</option>
              </select>
            </div>

            {/* Glassmorphism toggle */}
            <div className="flex items-center justify-between p-3 bg-slate-950/80 border border-slate-850 rounded mt-2">
              <div className="flex flex-col">
                <span className="text-xs font-semibold text-white">Enable Dark Mode Glassmorphism Canvas Overlay</span>
                <span className="text-[10px] text-slate-500 font-mono">Enhances transparency and blur rendering</span>
              </div>
              <button 
                onClick={() => setGlassmorphismEnabled(!glassmorphismEnabled)}
                className={`w-11 h-6 rounded-full transition-colors relative flex items-center shrink-0 ${glassmorphismEnabled ? 'bg-primary' : 'bg-slate-800'}`}
              >
                <span className={`w-4 h-4 rounded-full bg-white shadow absolute transition-all duration-300 ${glassmorphismEnabled ? 'left-6' : 'left-1'}`} />
              </button>
            </div>
          </div>

          <div className="mt-auto pt-6 border-t border-slate-800/65 flex justify-end">
            <button 
              onClick={handleApplyPreferences}
              className="px-6 py-3 border border-primary/45 hover:bg-primary/10 text-primary font-mono text-[10px] font-bold uppercase tracking-wider transition-colors active:scale-95"
            >
              APPLY WORKSPACE PREFERENCES
            </button>
          </div>
        </section>

      </div>

    </div>
  );
}
