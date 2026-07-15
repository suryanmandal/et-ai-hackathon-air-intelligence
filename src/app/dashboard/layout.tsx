"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface SubOption {
  name: string;
  route: string;
  icon: string;
}

const SUB_OPTIONS: Record<string, SubOption[]> = {
  overview: [
    { name: "Main Control Room", route: "/dashboard/home", icon: "space_dashboard" }
  ],
  geospatial: [
    { name: "Dynamic Vector Layer Engine", route: "/dashboard/geospatial/vector", icon: "layers" },
    { name: "Satellite Ingestion Pipeline Sync", route: "/dashboard/geospatial/satellite", icon: "satellite" }
  ],
  mlops: [
    { name: "Model Validation Analytics Terminal", route: "/dashboard/ml-ops/validation", icon: "analytics" },
    { name: "Hyperlocal Scenario Sandbox", route: "/dashboard/ml-ops/sandbox", icon: "science" }
  ],
  "agent-logs": [
    { name: "Multi-Agent Network Topology Map", route: "/dashboard/agent-logs/topology", icon: "hub" },
    { name: "Regional Language Translation Hub", route: "/dashboard/agent-logs/translation", icon: "translate" },
    { name: "Immutable API System Log Exporter", route: "/dashboard/agent-logs/exporter", icon: "verified_user" }
  ],
  settings: [
    { name: "Command Configuration Panel", route: "/dashboard/settings", icon: "settings_applications" },
    { name: "Administrative Profile", route: "/dashboard/settings/profile", icon: "account_box" },
    { name: "Statutory Compliance Guardrails Override", route: "/dashboard/agent-logs/override", icon: "gavel" }
  ]
};

const CATEGORY_NAMES: Record<string, string> = {
  overview: "Primary Overview",
  geospatial: "Geospatial Controls",
  mlops: "MLOps Center",
  "agent-logs": "Agentic Operations",
  settings: "System Settings"
};

export default function DashboardLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeModule, setActiveModule] = useState<string>("overview");

  // Sync activeModule based on route pathname
  useEffect(() => {
    if (pathname.includes("/dashboard/geospatial")) {
      setActiveModule("geospatial");
    } else if (pathname.includes("/dashboard/ml-ops")) {
      setActiveModule("mlops");
    } else if (pathname.includes("/dashboard/settings")) {
      setActiveModule("settings");
    } else if (pathname.includes("/dashboard/agent-logs/override")) {
      setActiveModule("settings");
    } else if (pathname.includes("/dashboard/agent-logs")) {
      setActiveModule("agent-logs");
    } else {
      setActiveModule("overview");
    }
  }, [pathname]);


  return (
    <div className="bg-[#0f172a] h-screen w-screen flex flex-col overflow-hidden text-on-surface font-body-md relative">
      
      {/* TopNavBar */}
      <header className="fixed top-0 w-full z-50 h-16 bg-slate-900 border-b border-[#3c4a42]/30 flex justify-between items-center px-md shrink-0">
        <div className="flex items-center gap-6">
          <span className="font-display-lg text-lg font-bold text-primary tracking-tight">VayuSense</span>
          <nav className="hidden md:flex items-center gap-md">
            <Link 
              className={`font-body-md text-xs px-3 py-1 rounded transition-colors uppercase tracking-wider ${
                pathname === "/dashboard/home" ? "text-primary border-b-2 border-primary pb-0.5 font-semibold" : "text-on-surface-variant hover:text-primary"
              }`} 
              href="/dashboard/home"
            >
              Dashboard
            </Link>
            <Link 
              className={`font-body-md text-xs px-3 py-1 rounded transition-colors uppercase tracking-wider ${
                pathname.startsWith("/dashboard/geospatial") ? "text-primary border-b-2 border-primary pb-0.5 font-semibold" : "text-on-surface-variant hover:text-primary"
              }`} 
              href="/dashboard/geospatial/vector"
            >
              Analytics
            </Link>
            <Link 
              className={`font-body-md text-xs px-3 py-1 rounded transition-colors uppercase tracking-wider ${
                pathname === "/dashboard/agent-logs/override" ? "text-primary border-b-2 border-primary pb-0.5 font-semibold" : "text-on-surface-variant hover:text-primary"
              }`} 
              href="/dashboard/agent-logs/override"
            >
              Emergency
            </Link>
            <Link 
              className={`font-body-md text-xs px-3 py-1 rounded transition-colors uppercase tracking-wider ${
                pathname === "/dashboard/agent-logs/exporter" ? "text-primary border-b-2 border-primary pb-0.5 font-semibold" : "text-on-surface-variant hover:text-primary"
              }`} 
              href="/dashboard/agent-logs/exporter"
            >
              Archive
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-md">
          <div className="hidden sm:flex items-center bg-[#0e1511] px-sm py-1 border border-[#3c4a42]/30 rounded-lg">
            <span className="material-symbols-outlined text-slate-500 text-sm mr-1">search</span>
            <input 
              className="bg-transparent border-none focus:outline-none focus:ring-0 text-xs text-on-surface w-40 placeholder-slate-600" 
              placeholder="Search system..." 
              type="text" 
            />
          </div>
          <div className="px-3 py-1 bg-emerald-500/10 border border-primary/30 rounded-full flex items-center gap-1.5 shrink-0">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
            <span className="text-[9px] font-bold text-primary tracking-widest uppercase">SYSTEM ACTIVE</span>
          </div>
          <button className="text-on-surface-variant hover:text-primary transition-colors p-1 flex items-center justify-center">
            <span className="material-symbols-outlined text-[20px]">notifications</span>
          </button>
          <button className="text-on-surface-variant hover:text-primary transition-colors p-1 flex items-center justify-center">
            <span className="material-symbols-outlined text-[20px]">account_circle</span>
          </button>
        </div>
      </header>

      {/* Main Split Layout container */}
      <div className="flex flex-1 pt-16 overflow-hidden relative">
        
        {/* SideNavBar - 64px rail */}
        <aside className="fixed left-0 top-16 h-full w-16 bg-[#0e1511] border-r border-[#3c4a42]/30 flex flex-col items-center py-md space-y-lg z-40 shrink-0">
          <button 
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className={`w-10 h-10 flex items-center justify-center rounded-lg hover:bg-slate-800 transition-all active:scale-90 ${sidebarOpen ? 'text-primary' : 'text-on-surface-variant'}`}
            title="Toggle Menu"
          >
            <span className="material-symbols-outlined text-[22px]">
              {sidebarOpen ? "menu_open" : "menu"}
            </span>
          </button>

          <nav className="flex flex-col gap-sm w-full items-center">
            
            {/* Overview Module link */}
            <button 
              onClick={() => {
                setActiveModule("overview");
                setSidebarOpen(true);
              }}
              className={`w-full flex justify-center py-2.5 transition-all active:scale-90 ${
                activeModule === "overview" 
                  ? "text-primary border-l-4 border-primary bg-emerald-500/10 font-bold" 
                  : "text-on-surface-variant hover:bg-slate-800"
              }`}
              title="Overview"
            >
              <span className="material-symbols-outlined text-[22px]" style={{ fontVariationSettings: activeModule === "overview" ? "'FILL' 1" : "'FILL' 0" }}>
                home
              </span>
            </button>

            {/* Geospatial Module link */}
            <button 
              onClick={() => {
                setActiveModule("geospatial");
                setSidebarOpen(true);
              }}
              className={`w-full flex justify-center py-2.5 transition-all active:scale-90 ${
                activeModule === "geospatial" 
                  ? "text-primary border-l-4 border-primary bg-emerald-500/10 font-bold" 
                  : "text-on-surface-variant hover:bg-slate-800"
              }`}
              title="Geospatial"
            >
              <span className="material-symbols-outlined text-[22px]" style={{ fontVariationSettings: activeModule === "geospatial" ? "'FILL' 1" : "'FILL' 0" }}>
                satellite_alt
              </span>
            </button>

            {/* MLOps Module link */}
            <button 
              onClick={() => {
                setActiveModule("mlops");
                setSidebarOpen(true);
              }}
              className={`w-full flex justify-center py-2.5 transition-all active:scale-90 ${
                activeModule === "mlops" 
                  ? "text-primary border-l-4 border-primary bg-emerald-500/10 font-bold" 
                  : "text-on-surface-variant hover:bg-slate-800"
              }`}
              title="MLOps"
            >
              <span className="material-symbols-outlined text-[22px]" style={{ fontVariationSettings: activeModule === "mlops" ? "'FILL' 1" : "'FILL' 0" }}>
                psychology
              </span>
            </button>

            {/* Agentic Operations Module link */}
            <button 
              onClick={() => {
                setActiveModule("agent-logs");
                setSidebarOpen(true);
              }}
              className={`w-full flex justify-center py-2.5 transition-all active:scale-90 ${
                activeModule === "agent-logs" 
                  ? "text-primary border-l-4 border-primary bg-emerald-500/10 font-bold" 
                  : "text-on-surface-variant hover:bg-slate-800"
              }`}
              title="Agentic Operations"
            >
              <span className="material-symbols-outlined text-[22px]" style={{ fontVariationSettings: activeModule === "agent-logs" ? "'FILL' 1" : "'FILL' 0" }}>
                local_police
              </span>
            </button>
          </nav>

          <div className="mt-auto pb-20 w-full flex justify-center">
            <button 
              onClick={() => {
                setActiveModule("settings");
                setSidebarOpen(true);
              }}
              className={`w-full flex justify-center py-2.5 transition-all active:scale-90 ${
                activeModule === "settings" 
                  ? "text-primary border-l-4 border-primary bg-emerald-500/10 font-bold" 
                  : "text-on-surface-variant hover:bg-slate-800"
              }`}
              title="Settings"
            >
              <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: activeModule === "settings" ? "'FILL' 1" : "'FILL' 0" }}>
                settings
              </span>
            </button>
          </div>
        </aside>

        {/* Dynamic Flyout Sub-navigation Drawer (240px) */}
        <div 
          className={`fixed left-16 top-16 h-full bg-[#111827]/95 border-r border-[#1f2937] z-30 flex flex-col p-md transition-all duration-300 overflow-hidden ${
            sidebarOpen ? "w-[240px] opacity-100" : "w-0 opacity-0 pointer-events-none"
          }`}
        >
          <div className="mb-lg select-none shrink-0">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
              {CATEGORY_NAMES[activeModule] || "Controls"}
            </span>
          </div>

          <nav className="flex flex-col gap-xs flex-1 overflow-y-auto custom-scrollbar">
            {SUB_OPTIONS[activeModule]?.map((option) => {
              const isActive = pathname === option.route;
              return (
                <Link
                  key={option.route}
                  href={option.route}
                  className={`flex items-center gap-2 p-2 rounded-lg transition-all text-left group ${
                    isActive 
                      ? "bg-emerald-500/10 border-l-2 border-primary text-primary" 
                      : "text-slate-400 hover:bg-slate-800 hover:text-emerald-400"
                  }`}
                >
                  <span className={`material-symbols-outlined text-sm shrink-0 ${isActive ? 'text-primary' : 'text-slate-500 group-hover:text-primary'}`}>
                    {option.icon}
                  </span>
                  <span className="text-xs font-semibold leading-relaxed truncate">
                    {option.name}
                  </span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Main Content Area Workspace wrapper slot */}
        <main 
          className={`flex-1 bg-[#0f172a] h-full relative overflow-hidden transition-all duration-300 flex flex-col ${
            sidebarOpen ? "ml-[304px]" : "ml-16"
          }`}
        >
          {children}
        </main>
      </div>

    </div>
  );
}
