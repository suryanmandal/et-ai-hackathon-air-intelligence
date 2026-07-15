"use client";

import React, { useState, useRef } from "react";

interface RunItem {
  id: string;
  status: "Active" | "Archived";
  message: string;
  maxDepth?: number;
  learningRate?: number;
  type: "success" | "warning" | "stable";
}

export default function ModelValidationTerminal() {
  // Re-run CTA button states
  const [isTuning, setIsTuning] = useState(false);
  const [tuningStatus, setTuningStatus] = useState<"idle" | "running" | "queued">("idle");

  // Chart Tooltip Hover State
  const [hoverEpoch, setHoverEpoch] = useState<number | null>(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });
  const [hoverData, setHoverData] = useState({ loss: 0, rmse: 0 });
  
  const chartRef = useRef<SVGSVGElement>(null);

  // Training runs state
  const [runs] = useState<RunItem[]>([
    { id: "#142", status: "Active", message: "Status: Stable Convergence", maxDepth: 12, learningRate: 0.05, type: "stable" },
    { id: "#141", status: "Archived", message: "Status: Overfitted", type: "warning" },
    { id: "#140", status: "Archived", message: "Status: Success", type: "success" }
  ]);

  // Handle Hyperparameter run simulation
  const triggerTuning = () => {
    if (isTuning) return;
    setIsTuning(true);
    setTuningStatus("running");

    setTimeout(() => {
      setTuningStatus("queued");
      setTimeout(() => {
        setTuningStatus("idle");
        setIsTuning(false);
      }, 2000);
    }, 1500);
  };

  // Hover Tooltip tracking calculations
  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement, MouseEvent>) => {
    if (!chartRef.current) return;
    
    const rect = chartRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left; // relative x position (0 to rect.width)
    const percentX = x / rect.width;
    
    // 0 to 200 Epochs
    const epoch = Math.round(percentX * 200);
    if (epoch < 0 || epoch > 200) {
      setHoverEpoch(null);
      return;
    }

    const lossVal = Math.max(50, 450 - (450 - 55) * (epoch / 200) + Math.cos(epoch * 0.05) * 5);
    const rmseVal = lossVal * 1.15 + (Math.sin(epoch * 0.5) * 8);

    setHoverEpoch(epoch);
    setTooltipPos({ x: x, y: e.clientY - rect.top });
    setHoverData({ loss: Math.round(lossVal), rmse: Math.round(rmseVal) });
  };

  const handleMouseLeave = () => {
    setHoverEpoch(null);
  };

  return (
    <div className="flex-grow flex flex-col lg:flex-row overflow-hidden w-full h-full relative">
      
      {/* Left Column - Validation Dashboard (70% width) */}
      <section className="flex-1 h-full flex flex-col p-lg gap-lg overflow-y-auto custom-scrollbar bg-slate-950 text-left">
        
        {/* Validation KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-md">
          
          <div className="glass-panel p-md rounded-lg flex flex-col justify-between border border-slate-800 bg-slate-900/60 backdrop-blur-md">
            <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider mb-xs">Predictive Precision (RMSE)</span>
            <div className="flex items-end justify-between">
              <span className="font-mono text-xl font-bold text-[#4edea3] tracking-tight">11.42 PM2.5</span>
              <span className="text-[9px] text-slate-500 font-mono">+/- 0.15%</span>
            </div>
          </div>

          <div className="glass-panel p-md rounded-lg flex flex-col justify-between border border-slate-800 bg-slate-900/60 backdrop-blur-md">
            <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider mb-xs">R-Squared Accuracy (R²)</span>
            <div className="flex items-end justify-between">
              <span className="font-mono text-xl font-bold text-white tracking-tight">0.9481</span>
              <span className="material-symbols-outlined text-xs text-primary">trending_up</span>
            </div>
          </div>

          <div className="glass-panel p-md rounded-lg flex flex-col justify-between border border-slate-800 bg-slate-900/60 backdrop-blur-md">
            <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider mb-xs">Mean Absolute Error (MAE)</span>
            <div className="flex items-end justify-between">
              <span className="font-mono text-xl font-bold text-white tracking-tight">8.918 μg/m³</span>
              <span className="text-[9px] text-slate-500 font-mono">10m interval</span>
            </div>
          </div>

        </div>

        {/* Real-time Validation Convergence Graph */}
        <div className="glass-panel rounded-lg flex flex-col border border-slate-800 bg-slate-900/60 backdrop-blur-md relative p-md">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">Real-Time Validation Benchmarks</h3>
              <p className="text-[11px] text-slate-400 mt-1">Convergence history across 200 XGBoost training epochs</p>
            </div>
            <div className="flex items-center gap-md font-mono text-[10px] bg-slate-950 px-3 py-1.5 rounded border border-slate-850">
              <div className="flex items-center gap-1">
                <span className="w-2.5 h-1.5 bg-[#4edea3] inline-block rounded-sm"></span>
                <span>TRAINING LOSS</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="w-2.5 h-1.5 bg-amber-500 inline-block rounded-sm"></span>
                <span>VALIDATION RMSE</span>
              </div>
            </div>
          </div>

          {/* SVG Line Graph Container with Tooltip Interaction */}
          <div className="relative w-full h-[320px] bg-slate-950 rounded border border-slate-850 overflow-hidden">
            <svg 
              ref={chartRef}
              className="w-full h-full cursor-crosshair"
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
            >
              {/* Grid Lines */}
              <line x1="5%" y1="20%" x2="95%" y2="20%" stroke="#1e293b" strokeDasharray="4 4" />
              <line x1="5%" y1="50%" x2="95%" y2="50%" stroke="#1e293b" strokeDasharray="4 4" />
              <line x1="5%" y1="80%" x2="95%" y2="80%" stroke="#1e293b" strokeDasharray="4 4" />
              
              {/* Training Loss Path (Cyan Curve) */}
              <path 
                d="M 30,280 C 150,260 250,110 380,85 T 570,55" 
                fill="none" 
                stroke="#4edea3" 
                strokeWidth="2.5" 
              />
              
              {/* Validation Loss Path (Amber Curve) */}
              <path 
                d="M 30,290 C 150,270 250,130 380,105 T 570,72" 
                fill="none" 
                stroke="#f59e0b" 
                strokeWidth="2" 
                strokeDasharray="4 2"
              />

              {/* Tooltip vertical line & intersection dots */}
              {hoverEpoch !== null && (
                <>
                  <line 
                    x1={tooltipPos.x} 
                    y1="5%" 
                    x2={tooltipPos.x} 
                    y2="95%" 
                    stroke="rgba(255,255,255,0.25)" 
                    strokeWidth="1" 
                  />
                  <circle cx={tooltipPos.x} cy={tooltipPos.y} r="5" fill="#4edea3" stroke="white" strokeWidth="1.5" />
                </>
              )}
            </svg>

            {/* Hover Tooltip display box */}
            {hoverEpoch !== null && (
              <div 
                className="absolute bg-slate-900 border border-slate-700 p-2.5 rounded shadow-2xl font-mono text-[10px] w-48 text-left z-30 pointer-events-none"
                style={{ 
                  left: `${Math.min(tooltipPos.x + 15, chartRef.current ? chartRef.current.clientWidth - 205 : 100)}px`, 
                  top: `${Math.min(tooltipPos.y + 15, 200)}px` 
                }}
              >
                <p className="text-white font-bold mb-1">EPOCH: {hoverEpoch}</p>
                <div className="flex justify-between border-t border-slate-800 pt-1 text-slate-400">
                  <span>TRAIN LOSS:</span>
                  <span className="text-[#4edea3] font-bold">{hoverData.loss}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>VAL RMSE:</span>
                  <span className="text-amber-500 font-bold">{hoverData.rmse}</span>
                </div>
              </div>
            )}
          </div>
        </div>

      </section>

      {/* Right Column - Model Parameters & Optimization (30% width) */}
      <aside className="w-full lg:w-[350px] h-full bg-slate-900/60 border-l border-[#3c4a42]/30 flex flex-col overflow-hidden shrink-0 text-left">
        <div className="p-lg flex flex-col gap-lg h-full overflow-y-auto custom-scrollbar">
          
          <div className="flex flex-col gap-xs">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">Model Architecture</h3>
            <p className="text-[11px] text-slate-400 leading-relaxed">XGBoost Ensemble hyperparameter optimization pipeline settings</p>
          </div>

          {/* Active Model parameters */}
          <div className="space-y-4">
            <div className="bg-slate-950 p-md rounded border border-slate-850 flex justify-between items-center">
              <span className="text-xs text-slate-400 font-mono">Max Depth</span>
              <span className="font-mono text-white font-semibold">12</span>
            </div>
            
            <div className="bg-slate-950 p-md rounded border border-slate-850 flex justify-between items-center">
              <span className="text-xs text-slate-400 font-mono">Learning Rate</span>
              <span className="font-mono text-white font-semibold">0.05</span>
            </div>

            <div className="bg-slate-950 p-md rounded border border-slate-850 flex justify-between items-center">
              <span className="text-xs text-slate-400 font-mono">Estimators</span>
              <span className="font-mono text-white font-semibold">450</span>
            </div>
          </div>

          {/* Recent Runs list */}
          <div className="flex flex-col flex-grow">
            <span className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-widest border-b border-slate-800 pb-2 mb-3">
              Archived Training Runs
            </span>
            <div className="space-y-sm">
              {runs.map((run) => (
                <div key={run.id} className="p-3 bg-slate-950/60 border border-slate-850 rounded flex justify-between items-center">
                  <div className="flex flex-col gap-0.5">
                    <span className="font-mono text-xs font-bold text-white">RUN {run.id}</span>
                    <span className="text-[10px] text-slate-500">{run.message}</span>
                  </div>
                  <span className={`text-[8px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                    run.type === "success" ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : run.type === "warning" ? "bg-amber-500/10 text-amber-500 border border-amber-500/20" : "bg-slate-800 text-slate-400"
                  }`}>
                    {run.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Re-run CTA widget */}
          <div className="pt-md border-t border-slate-850 mt-auto">
            {isTuning ? (
              <div className="flex flex-col gap-2">
                <div className="flex justify-between text-[10px] font-mono text-primary font-bold">
                  <span>{tuningStatus === "running" ? "TUNING HYPERPARAMETERS..." : "MODEL COMPILING IN QUEUE..."}</span>
                  <span className="animate-pulse">●</span>
                </div>
                <div className="w-full h-1 bg-slate-950 rounded-full overflow-hidden border border-slate-850">
                  <div className="h-full bg-primary animate-ping w-full" />
                </div>
              </div>
            ) : (
              <button 
                onClick={triggerTuning}
                className="w-full py-3 bg-[#4f46e5] hover:bg-[#6366f1] text-white font-bold text-xs uppercase tracking-widest rounded shadow-[0_0_12px_rgba(79,70,229,0.3)] transition-colors"
              >
                Optimize Hyperparameters
              </button>
            )}
          </div>

        </div>
      </aside>

    </div>
  );
}
