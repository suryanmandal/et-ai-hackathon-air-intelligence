"use client";

import React, { useState } from "react";

interface CodeSnippetProps {
  title: string;
  curlCode: string;
  pythonCode: string;
}

function CodeSnippetBlock({ title, curlCode, pythonCode }: CodeSnippetProps) {
  const [activeLanguage, setActiveLanguage] = useState<"python" | "curl">("python");
  const [copied, setCopied] = useState(false);

  const currentCode = activeLanguage === "python" ? pythonCode : curlCode;

  const handleCopy = () => {
    navigator.clipboard.writeText(currentCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-[#090d16] border border-slate-800 rounded-xl overflow-hidden shadow-xl my-4">
      <div className="flex items-center justify-between px-4 py-2 bg-slate-900/90 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-red-500/80"></span>
          <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80"></span>
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80"></span>
          <span className="text-xs font-mono font-semibold text-slate-400 ml-2">{title}</span>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex bg-slate-950 p-0.5 rounded border border-slate-800 text-[11px] font-mono">
            <button
              onClick={() => setActiveLanguage("python")}
              className={`px-2.5 py-0.5 rounded transition-colors ${
                activeLanguage === "python" ? "bg-blue-600 text-white font-bold" : "text-slate-400 hover:text-white"
              }`}
            >
              Python
            </button>
            <button
              onClick={() => setActiveLanguage("curl")}
              className={`px-2.5 py-0.5 rounded transition-colors ${
                activeLanguage === "curl" ? "bg-blue-600 text-white font-bold" : "text-slate-400 hover:text-white"
              }`}
            >
              cURL
            </button>
          </div>

          <button
            onClick={handleCopy}
            className="flex items-center gap-1 px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono rounded border border-slate-700 transition-all active:scale-95"
          >
            <span className="material-symbols-outlined text-[13px]">
              {copied ? "check" : "content_copy"}
            </span>
            <span>{copied ? "COPIED" : "COPY"}</span>
          </button>
        </div>
      </div>

      <pre className="p-4 text-xs font-mono text-cyan-300 overflow-x-auto leading-relaxed bg-[#090d16]">
        <code>{currentCode}</code>
      </pre>
    </div>
  );
}

interface TocItem {
  id: string;
  label: string;
}

export default function SnapStyleDocsPortalPage() {
  const backendBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "https://vayusense-backend.onrender.com";
  const [activeTab, setActiveTab] = useState<string>("all");
  const [activeSection, setActiveSection] = useState<string>("overview");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [copyFeedback, setCopyFeedback] = useState<boolean>(false);

  // Sandbox Test State
  const [trafficDelta, setTrafficDelta] = useState<number>(-0.20);
  const [industrialDelta, setIndustrialDelta] = useState<number>(-0.15);
  const [windSpeed, setWindSpeed] = useState<number>(4.5);
  const [apiResponse, setApiResponse] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const runSandboxApi = () => {
    setLoading(true);
    setTimeout(() => {
      const baseline = 284.5;
      const trafficImpact = trafficDelta * 45.0;
      const industrialImpact = industrialDelta * 75.0;
      const windImpact = (windSpeed - 2.0) * -8.0;
      const predicted = Math.max(45.0, Math.round((baseline + trafficImpact + industrialImpact + windImpact) * 10) / 10);
      
      setApiResponse({
        status: "SUCCESS",
        corporation_id: "MH-BMC-01",
        corporation_name: "Brihanmumbai Municipal Corporation",
        baseline_aqi: baseline,
        predicted_aqi: predicted,
        aqi_reduction: Math.round((baseline - predicted) * 10) / 10,
        attribution_breakdown: {
          industrial_percentage: 50.0,
          vehicular_percentage: 30.0,
          construction_percentage: 20.0
        },
        sha256_checksum: "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
        timestamp: new Date().toISOString()
      });
      setLoading(false);
    }, 500);
  };

  const handleCopyPage = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopyFeedback(true);
    setTimeout(() => setCopyFeedback(false), 2000);
  };

  // Sidebar Group Structure matching Snap Developer Docs
  const sidebarGroups = [
    {
      groupTitle: "GET STARTED",
      categoryKey: "getting-started",
      items: [
        { id: "overview", label: "Introduction & Overview", hasChevron: false },
        { id: "architecture", label: "System Architecture & Tech Stack", hasChevron: true },
        { id: "quickstart", label: "API Authentication & Quickstart", hasChevron: false },
        { id: "github-link", label: "GitHub Repository ↗", isExternal: true, url: "https://github.com/suryanmandal/et-ai-hackathon-air-intelligence" }
      ]
    },
    {
      groupTitle: "SPATIAL & TELEMETRY ENGINE",
      categoryKey: "spatial",
      items: [
        { id: "dynamic-vector-layer", label: "Dynamic Vector Layer", hasChevron: true },
        { id: "satellite-pipeline", label: "Sentinel-5P Satellite Pipeline", hasChevron: true },
        { id: "h3-mapping", label: "Uber H3 Res-8 Grid Mapping", hasChevron: true },
        { id: "sensor-drift", label: "Sensor Drift Calibration", hasChevron: false }
      ]
    },
    {
      groupTitle: "AGENTIC ORCHESTRATION & ML OPS",
      categoryKey: "mlops",
      items: [
        { id: "crewai-topology", label: "CrewAI Multi-Agent Topology", hasChevron: true },
        { id: "model-validation", label: "Model Validation (XGBoost)", hasChevron: false },
        { id: "model-validation-analytical", label: "Model Validation Analytical", hasChevron: false },
        { id: "scenario-sandbox", label: "Hyperlocal Scenario Sandbox", hasChevron: true }
      ]
    },
    {
      groupTitle: "GOVERNANCE & COMPLIANCE",
      categoryKey: "governance",
      items: [
        { id: "sha256-exporter", label: "Cryptographic SHA-256 Audit", hasChevron: false },
        { id: "notice-generator", label: "Automated Legal Show-Cause", hasChevron: true },
        { id: "translation-overrides", label: "Regional Translation & Overrides", hasChevron: false },
        { id: "command-settings", label: "Command Settings & Controls", hasChevron: false },
        { id: "administrative-profile", label: "Administrative Profile", hasChevron: false }
      ]
    },
    {
      groupTitle: "API REFERENCE",
      categoryKey: "api",
      items: [
        { id: "api-reference", label: "OpenAPI Endpoints Reference", hasChevron: false },
        { id: "swagger-link", label: "FastAPI Swagger Docs ↗", isExternal: true, url: `${backendBaseUrl}/docs` }
      ]
    }
  ];

  // Right Sidebar "On this page" TOC Table of Contents per section
  const pageTocMap: Record<string, TocItem[]> = {
    overview: [
      { id: "transforming-telemetry", label: "Transforming Passive Telemetry" },
      { id: "pan-india-scale", label: "Pan-India Municipal Scale" },
      { id: "user-profiles", label: "Target User Profiles" },
      { id: "regulatory-metrics", label: "Core Regulatory Metrics" }
    ],
    architecture: [
      { id: "system-arch", label: "High-Level System Architecture" },
      { id: "tech-stack-breakdown", label: "Technology Stack Breakdown" },
      { id: "performance-benchmarks", label: "Execution Pipeline Benchmarks" }
    ],
    quickstart: [
      { id: "auth-overview", label: "Authentication Overview" },
      { id: "clearance-levels", label: "Clearance Level Requirements" },
      { id: "quickstart-examples", label: "Quickstart Request Examples" }
    ],
    "dynamic-vector-layer": [
      { id: "vector-overview", label: "Overview & Metadata" },
      { id: "geospatial-commands", label: "Core Geospatial Commands" },
      { id: "sidebar-widgets", label: "Sidebar Panels & Widgets" },
      { id: "visual-controls", label: "Geospatial Matrix Filter" },
      { id: "map-styles", label: "Monochrome, Satellite & Hybrid" }
    ],
    "satellite-pipeline": [
      { id: "satellite-overview", label: "Sentinel-5P TROPOMI Overview" },
      { id: "cloud-masking", label: "QA Cloud-Masking Algorithm" },
      { id: "spatial-reprojection", label: "Spatial Reprojection & Layering" }
    ],
    "h3-mapping": [
      { id: "h3-overview", label: "Hexagonal Spatial Indexing" },
      { id: "vector-factors", label: "3 Geometric Emission Factors" },
      { id: "h3-code-lookup", label: "H3 Index Lookup Code" }
    ],
    "sensor-drift": [
      { id: "cross-station", label: "Cross-Station Calibration" },
      { id: "kohler-formula", label: "Kohler Humidity Correction" },
      { id: "drift-matrix", label: "Zero-Point & Span Matrix" }
    ],
    "crewai-topology": [
      { id: "multi-agent-flow", label: "Autonomous Agent Flow" },
      { id: "agent-specs", label: "Autonomous Agent Specs" },
      { id: "execution-sla", label: "Execution Target Benchmark" }
    ],
    "model-validation": [
      { id: "model-performance", label: "Model Performance Metrics" },
      { id: "target-accuracy", label: "Target Accuracy Table" },
      { id: "xgboost-importance", label: "Feature Importance Matrix" }
    ],
    "model-validation-analytical": [
      { id: "validation-overview", label: "MLOps Control Engine" },
      { id: "validation-settings", label: "XGBoost Hyperparameter Settings" },
      { id: "validation-runs", label: "Archived Training Runs" },
      { id: "validation-metrics", label: "Validation Performance Metrics" },
      { id: "validation-benchmarks", label: "Real-Time Validation Benchmarks" },
      { id: "validation-convergence", label: "Convergence Epoch History" }
    ],
    "scenario-sandbox": [
      { id: "mlops-control", label: "MLOps Control Engine" },
      { id: "recent-training", label: "Recent Training Runs" },
      { id: "predictive-policy", label: "Hyperlocal Scenario Sandbox" },
      { id: "sandbox-params", label: "Simulation Parameter Matrix" },
      { id: "aqi-delta-trajectory", label: "Simulated AQI Delta Trajectory" }
    ],
    "sha256-exporter": [
      { id: "immutable-audit", label: "Immutable Audit Trail" },
      { id: "hashing-protocol", label: "Cryptographic Hashing Protocol" },
      { id: "export-endpoint", label: "Export Audit Logs API" }
    ],
    "notice-generator": [
      { id: "statutory-dispatch", label: "Statutory Notice Engine" },
      { id: "legal-templates", label: "Statutory Legal Templates" },
      { id: "pdf-dispatch", label: "Automated PDF Dispatch Engine" }
    ],
    "translation-overrides": [
      { id: "regional-language", label: "Regional Language Engine" },
      { id: "supported-locales", label: "Supported Language Locales" },
      { id: "guardrail-overrides", label: "Statutory Guardrail Overrides" }
    ],
    "command-settings": [
      { id: "command-settings-ui", label: "Command Configuration Panel" },
      { id: "officer-profile", label: "Officer Profile" },
      { id: "statutory-trigger-matrix", label: "Statutory Trigger Matrix" },
      { id: "secure-integrations", label: "Secure Infrastructure Integrations" },
      { id: "enforcement-policies", label: "Automated Enforcement Policies" },
      { id: "system-action-controls", label: "System Action Controls" }
    ],
    "administrative-profile": [
      { id: "administrative-profile-ui", label: "Administrative Profile Console" },
      { id: "officer-id-card", label: "Officer ID Card" },
      { id: "display-parameters", label: "Display & Operational Parameters" },
      { id: "workspace-preferences", label: "Workspace Preferences Trigger" }
    ],
    "api-reference": [
      { id: "predict-endpoint", label: "POST /predict/scenario" },
      { id: "agents-endpoint", label: "POST /agents/analyze" },
      { id: "export-endpoint", label: "GET /export/audit-logs" }
    ]
  };

  const currentToc = pageTocMap[activeSection] || [];

  return (
    <div className="flex flex-col h-full w-full bg-[#0B0F17] text-slate-200 font-sans overflow-hidden">
      
      {/* 1. TOP NAVBAR (Snapchat Developer Portal Style) */}
      <header className="h-14 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 flex items-center justify-between px-6 shrink-0 z-20">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-md bg-blue-600 flex items-center justify-center font-bold text-white text-xs">V</span>
            <span className="font-bold text-white text-sm tracking-tight font-display">VayuSense <span className="text-slate-400 font-normal">for Developers</span></span>
          </div>

          {/* Top Category Tabs */}
          <nav className="hidden lg:flex items-center gap-1 text-xs font-mono">
            <button
              onClick={() => { setActiveTab("all"); setActiveSection("overview"); }}
              className={`px-3 py-1.5 rounded-md transition-colors ${activeTab === "all" ? "bg-slate-800 text-white font-bold" : "text-slate-400 hover:text-white"}`}
            >
              Overview
            </button>
            <button
              onClick={() => { setActiveTab("spatial"); setActiveSection("satellite-pipeline"); }}
              className={`px-3 py-1.5 rounded-md transition-colors ${activeTab === "spatial" ? "bg-slate-800 text-white font-bold" : "text-slate-400 hover:text-white"}`}
            >
              Spatial Engine
            </button>
            <button
              onClick={() => { setActiveTab("mlops"); setActiveSection("crewai-topology"); }}
              className={`px-3 py-1.5 rounded-md transition-colors ${activeTab === "mlops" ? "bg-slate-800 text-white font-bold" : "text-slate-400 hover:text-white"}`}
            >
              Agentic & MLOps
            </button>
            <button
              onClick={() => { setActiveTab("governance"); setActiveSection("sha256-exporter"); }}
              className={`px-3 py-1.5 rounded-md transition-colors ${activeTab === "governance" ? "bg-slate-800 text-white font-bold" : "text-slate-400 hover:text-white"}`}
            >
              Governance
            </button>
            <button
              onClick={() => { setActiveTab("api"); setActiveSection("api-reference"); }}
              className={`px-3 py-1.5 rounded-md transition-colors ${activeTab === "api" ? "bg-slate-800 text-white font-bold" : "text-slate-400 hover:text-white"}`}
            >
              API Reference
            </button>
          </nav>
        </div>

        {/* Top Navbar Right Utilities */}
        <div className="flex items-center gap-3">
          <div className="relative hidden md:block">
            <span className="material-symbols-outlined absolute left-2.5 top-1.5 text-slate-500 text-sm">search</span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search docs (⌘K)..."
              className="bg-[#090d16] border border-slate-800 rounded-lg pl-8 pr-3 py-1 text-xs font-mono text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500 w-48"
            />
          </div>

          <a
            href={`${backendBaseUrl}/docs`}
            target="_blank"
            rel="noreferrer"
            className="px-3 py-1 bg-blue-600 hover:bg-blue-500 text-white font-mono text-xs font-bold rounded-lg transition-all flex items-center gap-1 shrink-0"
          >
            <span>My API Key</span>
            <span className="material-symbols-outlined text-[13px]">key</span>
          </a>
        </div>
      </header>

      {/* 2. MAIN 3-PANE LAYOUT */}
      <div className="flex flex-1 overflow-hidden relative">

        {/* PANE 1: LEFT SIDEBAR NAVIGATION */}
        <aside className="w-72 bg-[#0d121d] border-r border-slate-800 flex flex-col shrink-0 overflow-y-auto custom-scrollbar p-4 space-y-6 text-xs">
          
          <div className="px-2 py-1 bg-slate-900/80 border border-slate-800 rounded-lg flex items-center justify-between">
            <span className="font-mono text-[11px] text-slate-400">Documentation Version</span>
            <span className="font-mono font-bold text-blue-400 text-[10px] bg-blue-500/10 px-1.5 py-0.5 rounded border border-blue-500/20">v2026.1</span>
          </div>

          {sidebarGroups.map((group) => (
            <div key={group.groupTitle} className="space-y-1">
              <span className="text-[10px] font-bold font-mono text-slate-500 uppercase tracking-wider block px-2 mb-1.5">
                {group.groupTitle}
              </span>

              {group.items.map((item) => {
                const isSelected = activeSection === item.id;
                const matchesSearch = !searchQuery || item.label.toLowerCase().includes(searchQuery.toLowerCase());
                if (!matchesSearch) return null;

                if (item.isExternal) {
                  return (
                    <a
                      key={item.id}
                      href={item.url}
                      target="_blank"
                      rel="noreferrer"
                      className="w-full text-left px-3 py-1.5 rounded-md text-slate-400 hover:text-white hover:bg-slate-800/60 transition-colors flex items-center justify-between font-medium text-xs group"
                    >
                      <span className="truncate">{item.label}</span>
                      <span className="material-symbols-outlined text-slate-600 group-hover:text-blue-400 text-[14px]">open_in_new</span>
                    </a>
                  );
                }

                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveSection(item.id)}
                    className={`w-full text-left px-3 py-1.5 rounded-md transition-all flex items-center justify-between text-xs ${
                      isSelected
                        ? "bg-blue-600/15 text-blue-400 font-bold border-l-2 border-blue-500 pl-2.5"
                        : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
                    }`}
                  >
                    <span className="truncate">{item.label}</span>
                    {item.hasChevron && (
                      <span className={`material-symbols-outlined text-[14px] transition-transform ${isSelected ? "text-blue-400 rotate-90" : "text-slate-600"}`}>
                        chevron_right
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          ))}
        </aside>

        {/* PANE 2: CENTER MAIN CONTENT AREA */}
        <main className="flex-1 overflow-y-auto custom-scrollbar p-8 bg-[#0B0F17] space-y-8">
          <div className="max-w-3xl mx-auto space-y-8">

            {/* Content Header Bar with Breadcrumb & Copy Page Button */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 text-xs font-mono text-slate-400">
              <div className="flex items-center gap-2">
                <span>Docs</span>
                <span>/</span>
                <span className="text-blue-400 font-semibold capitalize">{activeSection.replace("-", " ")}</span>
              </div>

              <button
                onClick={handleCopyPage}
                className="flex items-center gap-1.5 text-slate-400 hover:text-white transition-colors"
              >
                <span className="material-symbols-outlined text-[14px]">link</span>
                <span>{copyFeedback ? "URL Copied!" : "Copy page"}</span>
              </button>
            </div>

            {/* SECTION 1: OVERVIEW & MAIN CONTROL ROOM */}
            {activeSection === "overview" && (
              <section className="space-y-6">
                <div>
                  <div className="flex items-center gap-2 text-xs font-mono text-blue-400 mb-1">
                    <span>SECTION 1</span> • <span>GETTING STARTED & CONTROL ROOM</span>
                  </div>
                  <h1 className="text-3xl font-bold text-white tracking-tight font-display mb-2">
                    Main Control Room (`/dashboard/home`) & Overview
                  </h1>
                  <p className="text-sm text-slate-300 leading-relaxed">
                    Serves as the central mission control dashboard. Features real-time Mapbox GL JS map visualization, live CAAQMS sensor nodes, Server-Sent Events (SSE) telemetry data streaming (`/api/telemetry/stream`), time-series playback controls, source attribution cards, and a multi-agent reasoning feed.
                  </p>
                </div>

                {/* REAL DASHBOARD REFERENCE SCREENSHOT */}
                <div className="space-y-2 bg-[#090d16] border border-slate-800 p-4 rounded-xl">
                  <div className="flex items-center justify-between text-xs font-mono text-cyan-400">
                    <span className="font-bold flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-sm">photo_camera</span>
                      FIGURE 1.0: VAYUSENSE MAIN CONTROL ROOM REFERENCE UI (/dashboard/home)
                    </span>
                    <span className="text-[10px] text-slate-500">REAL SYSTEM SCREENSHOT</span>
                  </div>
                  <div className="relative w-full rounded-lg overflow-hidden border border-slate-800 shadow-2xl">
                    <img
                      src="/docs/dashboard-home-reference.jpg"
                      alt="VayuSense Main Control Room Dashboard Reference UI"
                      className="w-full h-auto object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                </div>

                {/* 1. GIS Telemetry Status Badge (Top Box) */}
                <div id="transforming-telemetry" className="bg-[#090d16] border border-slate-800 p-5 rounded-xl space-y-3 font-mono">
                  <div className="flex items-center justify-between text-xs text-slate-400 border-b border-slate-800 pb-2">
                    <span className="font-bold text-blue-400 flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-sm">location_on</span>
                      📍 1. GIS TELEMETRY STATUS BADGE (TOP BOX)
                    </span>
                    <span className="text-[10px] bg-blue-500/10 text-blue-400 px-2 py-0.5 rounded border border-blue-500/20">LIVE METRICS</span>
                  </div>
                  
                  <div className="rounded-lg overflow-hidden border border-slate-800 bg-slate-950 p-2">
                    <img
                      src="/docs/doc-image-1.png"
                      alt="GIS Telemetry Status Badge"
                      className="w-full h-auto object-contain"
                    />
                  </div>

                  <div className="p-3 bg-slate-900/90 border border-slate-800 rounded-lg text-xs font-bold text-cyan-300">
                    LAT 18.9220 N | LON 72.8347 E | H3_RES 8 | ZOOM L15 | STACK: IoT + Sentinel5P
                  </div>
                  <ul className="text-xs text-slate-300 space-y-1 list-disc pl-4 leading-relaxed font-sans">
                    <li><strong>LAT / LON:</strong> Shows exact geographic latitude and longitude coordinates of the map&apos;s focal center (currently centered on active Municipal Corporation).</li>
                    <li><strong>H3_RES 8:</strong> Indicates Uber&apos;s H3 Hexagonal Spatial Indexing Resolution Level 8 used to partition urban land parcels into discrete monitoring cells (~0.737 km² per cell).</li>
                    <li><strong>ZOOM L15:</strong> Displays Mapbox GIS map zoom level (Level 15 high-definition urban view).</li>
                    <li><strong>STACK: IoT + Sentinel5P:</strong> Confirms active data fusion combining ground IoT sensor streams with Sentinel-5P satellite gas column rasters.</li>
                  </ul>
                </div>

                {/* 2. Live Telemetry Playback & Time-Travel Controller */}
                <div id="pan-india-scale" className="bg-slate-900/80 border border-slate-800 p-5 rounded-xl space-y-3">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2 font-mono">
                    <span className="material-symbols-outlined text-emerald-400 text-base">schedule</span>
                    ⏱️ 2. Live Telemetry Playback & Time-Travel Controller (Bottom Bar)
                  </h3>

                  <div className="rounded-lg overflow-hidden border border-slate-800 bg-slate-950 p-2">
                    <img
                      src="/docs/doc-image-2.png"
                      alt="Live Telemetry Playback Controller"
                      className="w-full h-auto object-contain"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                    <div className="bg-[#090d16] p-3 rounded border border-slate-800 space-y-1">
                      <strong className="text-white block font-mono">Pause/Play Button</strong>
                      <span className="text-slate-400">Allows command directors to freeze a critical breach frame for inspection or resume live monitoring.</span>
                    </div>
                    <div className="bg-[#090d16] p-3 rounded border border-slate-800 space-y-1">
                      <strong className="text-white block font-mono">Timeline Scrubber</strong>
                      <span className="text-slate-400">Time-Travel Analysis enabling operators to scrub backwards to review past pollution plume dispersion trajectories.</span>
                    </div>
                    <div className="bg-[#090d16] p-3 rounded border border-slate-800 space-y-1">
                      <strong className="text-white block font-mono">LIVE FEED ACTIVE</strong>
                      <span className="text-slate-400">Confirms real-time Server-Sent Events (SSE) streaming live updates to dashboard every 2.5 seconds.</span>
                    </div>
                  </div>
                </div>

                {/* 3. Source Attribution & 72-Hour Forecast */}
                <div id="user-profiles" className="space-y-4">
                  <h2 className="text-lg font-semibold text-white">Source Attribution & Diagnostic Matrix</h2>
                  
                  <div className="rounded-lg overflow-hidden border border-slate-800 bg-slate-950 p-3">
                    <img
                      src="/docs/doc-image-3.png"
                      alt="Source Attribution & Diagnostic Matrix"
                      className="w-full h-auto object-contain"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Source Attribution Box */}
                    <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-xl space-y-2">
                      <div className="flex items-center justify-between font-mono text-xs text-yellow-400 font-bold border-b border-slate-800 pb-2">
                        <span>🎯 SOURCE ATTRIBUTION</span>
                        <span>SECTOR BREAKDOWN</span>
                      </div>
                      <p className="text-sm font-mono font-bold text-white">
                        62% Industrial Stacks | 20% Construction Dust | 18% Diesel Traffic
                      </p>
                      <p className="text-xs text-slate-300 leading-relaxed">
                        <strong>Role & Purpose:</strong> Pinpoints exact percentage contribution of each factor. Municipalities cannot shut down an entire city during a pollution spike; source attribution identifies the specific offender (e.g., issue stack shutdown orders for the 62% industrial contributor instead of halting city traffic).
                      </p>
                    </div>

                    {/* 72-Hour Forecast Box */}
                    <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-xl space-y-2">
                      <div className="flex items-center justify-between font-mono text-xs text-cyan-400 font-bold border-b border-slate-800 pb-2">
                        <span>📈 72-HOUR FORECAST (PM2.5)</span>
                        <span>MODEL RMSE: 11.42</span>
                      </div>
                      <p className="text-sm font-mono font-bold text-white">
                        Predictive 3-Day Trendline vs Safety Limits (EPA: 150 μg/m³)
                      </p>
                      <p className="text-xs text-slate-300 leading-relaxed">
                        <strong>Role & Purpose:</strong> Uses machine learning models to forecast whether PM2.5 will cross hazardous limits over the next 3 days. Moves city governance from reactive to proactive (issuing preventive restrictions 24–48 hours in advance).
                      </p>
                    </div>
                  </div>
                </div>

                {/* 4. Multi-Agent Reasoning Feed & Map Controls */}
                <div id="regulatory-metrics" className="space-y-4">
                  <h2 className="text-lg font-semibold text-white">Map Layer Legend & Statutory Controls</h2>
                  
                  {/* Emission Factor Legend Image */}
                  <div className="rounded-lg overflow-hidden border border-slate-800 bg-slate-950 p-3">
                    <img
                      src="/docs/doc-image-6.png"
                      alt="Map Layer Legend & Emission Factors"
                      className="w-full h-auto object-contain"
                    />
                  </div>

                  {/* Map Layer Legend Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 font-mono text-xs">
                    <div className="bg-slate-900/90 border border-yellow-500/30 p-3 rounded-lg space-y-1">
                      <span className="text-yellow-400 font-bold block">Yellow ▲ Triangle (50% Impact)</span>
                      <span className="text-slate-300 text-[11px]">Industrial & Power Generation (SO₂, NOₓ, PM₂.₅, Lead).</span>
                    </div>
                    <div className="bg-slate-900/90 border border-cyan-500/30 p-3 rounded-lg space-y-1">
                      <span className="text-cyan-400 font-bold block">Cyan ● Circle (30% Impact)</span>
                      <span className="text-slate-300 text-[11px]">High-Density Commercial Traffic Corridors (NO₂, Black Carbon).</span>
                    </div>
                    <div className="bg-slate-900/90 border border-purple-500/30 p-3 rounded-lg space-y-1">
                      <span className="text-purple-400 font-bold block">Purple ■ Square (20% Impact)</span>
                      <span className="text-slate-300 text-[11px]">Construction & Demolition Dust Sites (PM₁₀ Silt).</span>
                    </div>
                  </div>

                  {/* Pan-India Municipal Selector & PDF Export */}
                  <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-xl space-y-4 font-mono text-xs">
                    <h3 className="text-white font-bold flex items-center gap-2">
                      <span className="material-symbols-outlined text-amber-400 text-base">picture_as_pdf</span>
                      🏛️ Pan-India Municipal State Selector & Statutory PDF Directory Export
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div className="bg-slate-950 p-3 rounded border border-slate-800">
                        <span className="text-[11px] text-slate-400 block mb-2 font-bold">1. State & Corporation Selectors</span>
                        <img
                          src="/docs/doc-image-4.png"
                          alt="State & Municipal Corporation Selectors"
                          className="w-full h-auto object-contain rounded"
                        />
                      </div>
                      <div className="bg-slate-950 p-3 rounded border border-slate-800">
                        <span className="text-[11px] text-slate-400 block mb-2 font-bold">2. Statutory Directory PDF Export</span>
                        <img
                          src="/docs/doc-image-5.png"
                          alt="Statutory Directory PDF Export Button"
                          className="w-full h-auto object-contain rounded"
                        />
                      </div>
                    </div>

                    <ul className="text-slate-300 space-y-2 list-disc pl-4 font-sans text-xs leading-relaxed">
                      <li><strong>Dropdown Selectors:</strong> Switch monitoring context across all 28 Indian States & Delhi UT (277 Municipal Corporations) with manual selection or <code>⚡ AUTO-HIGHEST AQI</code> auto-locking mode.</li>
                      <li><strong><code>[29 CORP REGISTRY PDF]</code> Export Button:</strong> Dynamically compiles an official statutory PDF directory of all municipal corporations for the selected state with Corp IDs, names, districts, class grades, population, and live AQI values.</li>
                    </ul>
                  </div>

                </div>
              </section>
            )}

            {/* SECTION 1: ARCHITECTURE */}
            {activeSection === "architecture" && (
              <section className="space-y-6">
                <div>
                  <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 mb-1">
                    <span>SECTION 1</span> • <span>ARCHITECTURE & TECH STACK</span>
                  </div>
                  <h1 className="text-3xl font-bold text-white tracking-tight font-display mb-2">
                    System Architecture & Tech Stack Breakdown
                  </h1>
                  <p className="text-sm text-slate-300">
                    High-throughput microservices architecture combining spatial indexing, satellite remote sensing, multi-agent AI orchestration, and glassmorphic dashboards.
                  </p>
                </div>

                {/* REAL SYSTEM DASHBOARD SCREENSHOT CARD */}
                <div className="space-y-2 bg-[#090d16] border border-slate-800 p-4 rounded-xl">
                  <div className="flex items-center justify-between text-xs font-mono text-cyan-400">
                    <span className="font-bold flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-sm">photo_camera</span>
                      SYSTEM ARCHITECTURE REFERENCE UI (/dashboard/home)
                    </span>
                    <span className="text-[10px] text-slate-500 font-bold">PRODUCTION SYSTEM SCREENSHOT</span>
                  </div>
                  <div className="relative w-full rounded-lg overflow-hidden border border-slate-800 shadow-2xl">
                    <img
                      src="/docs/dashboard-home-reference.jpg"
                      alt="VayuSense Main Control Room Dashboard Reference UI"
                      className="w-full h-auto object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                </div>

                {/* High Level Topology Card */}
                <div id="system-arch" className="space-y-3">
                  <h2 className="text-lg font-semibold text-white border-b border-slate-800 pb-2">
                    1. High-Level Distributed Architecture Topology
                  </h2>
                  <div className="p-4 bg-[#090d16] border border-slate-800 rounded-xl text-xs font-mono text-emerald-400 leading-relaxed overflow-x-auto">
                    <pre>{`┌─────────────────────────────────────────────────────────────────────────────────┐
│                           TELEMETRY INGESTION LAYER                             │
│  ┌─────────────────────────────┐           ┌─────────────────────────────────┐  │
│  │ 500 CAAQMS / 900 NAMP IoT   │           │ Copernicus Sentinel-5P TROPOMI  │  │
│  │ Ground Sensors (2.5s SSE)   │           │ Satellite NetCDF4 Rasters       │  │
│  └──────────────┬──────────────┘           └────────────────┬────────────────┘  │
└─────────────────┼───────────────────────────────────────────┼───────────────────┘
                  │                                           │
                  ▼                                           ▼
┌─────────────────────────────────────────────────────────────────────────────────┐
│                         SPATIAL ENGINE & POSTGIS LAYER                          │
│  ┌───────────────────────────────────────────────────────────────────────────┐  │
│  │ Uber H3 Hexagonal Indexing (Res-8: ~0.737 km² per cell)                   │  │
│  │ Data Fusion Engine: Ground IoT + Satellite Column Densities (EPSG:4326)   │  │
│  └──────────────────────────────────────┬────────────────────────────────────┘  │
└─────────────────────────────────────────┼───────────────────────────────────────┘
                                          │
                                          ▼
┌─────────────────────────────────────────────────────────────────────────────────┐
│                    CREWAI MULTI-AGENT & MLOPS PIPELINE                          │
│  ┌─────────────────┐     ┌────────────────────────┐     ┌────────────────────┐  │
│  │   SensorAgent   │ ──► │ SourceAttributionAgent │ ──► │  ComplianceAgent   │  │
│  │ (AQI > 200 Spike)│     │(62% Ind/18% Veh/20% Con)│     │(Draft Legal Notice)│  │
│  └─────────────────┘     └────────────────────────┘     └────────────────────┘  │
│  ┌───────────────────────────────────────────────────────────────────────────┐  │
│  │ 72-Hour PM2.5 Predictive Ensemble (XGBoost + Random Forest, R² = 0.9481)  │  │
│  └──────────────────────────────────────┬────────────────────────────────────┘  │
└─────────────────────────────────────────┼───────────────────────────────────────┘
                                          │
                                          ▼
┌─────────────────────────────────────────────────────────────────────────────────┐
│                      GOVERNANCE, SECURITY & DASHBOARD                           │
│  ┌─────────────────────────────────┐     ┌──────────────────────────────────┐  │
│  │ SHA-256 Audit Ledger Exporter   │     │ Section 31A Air Act Legal Engine │  │
│  └────────────────┬────────────────┘     └────────────────┬─────────────────┘  │
│                   │                                       │                     │
│                   └───────────────────┬───────────────────┘                     │
│                                       ▼                                         │
│  ┌───────────────────────────────────────────────────────────────────────────┐  │
│  │ Next.js 14 Glassmorphic UI Dashboard (277 Municipal Corporations)         │  │
│  └───────────────────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────────────────┘`}</pre>
                  </div>
                </div>

                {/* Tech Stack Breakdown Cards */}
                <div id="tech-stack-breakdown" className="space-y-4">
                  <h2 className="text-lg font-semibold text-white">2. Layer-by-Layer Comprehensive Tech Stack Breakdown</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-xs">
                    
                    {/* Layer A: Frontend */}
                    <div className="bg-slate-900/90 border border-blue-500/30 p-4 rounded-xl space-y-2">
                      <span className="text-blue-400 font-bold block border-b border-slate-800 pb-1">
                        💻 LAYER A: FRONTEND COMMAND DASHBOARD
                      </span>
                      <ul className="text-slate-300 space-y-1 font-sans text-xs">
                        <li>• <strong>Framework:</strong> Next.js 14 App Router (React 18, TypeScript 5.x)</li>
                        <li>• <strong>Styling:</strong> Vanilla CSS & Tailwind CSS Glassmorphism (`#0B0F17` base)</li>
                        <li>• <strong>GIS Engine:</strong> Mapbox GL JS with 3-emission factor overlays</li>
                        <li>• <strong>State Manager:</strong> `MunicipalContext` (277 Corporations)</li>
                      </ul>
                    </div>

                    {/* Layer B: Backend API */}
                    <div className="bg-slate-900/90 border border-emerald-500/30 p-4 rounded-xl space-y-2">
                      <span className="text-emerald-400 font-bold block border-b border-slate-800 pb-1">
                        ⚙️ LAYER B: BACKEND MICROSERVICES & SPATIAL ENGINE
                      </span>
                      <ul className="text-slate-300 space-y-1 font-sans text-xs">
                        <li>• <strong>API Engine:</strong> FastAPI (Python 3.11) + Uvicorn ASGI</li>
                        <li>• <strong>Streaming:</strong> Server-Sent Events (SSE) 2.5s pulse updates</li>
                        <li>• <strong>Database:</strong> PostgreSQL + PostGIS extension</li>
                        <li>• <strong>Spatial Index:</strong> Uber H3 Res-8 (~0.737 km² per cell)</li>
                      </ul>
                    </div>

                    {/* Layer C: Satellite Pipeline */}
                    <div className="bg-slate-900/90 border border-cyan-500/30 p-4 rounded-xl space-y-2">
                      <span className="text-cyan-400 font-bold block border-b border-slate-800 pb-1">
                        🛰️ LAYER C: SATELLITE REMOTE SENSING PIPELINE
                      </span>
                      <ul className="text-slate-300 space-y-1 font-sans text-xs">
                        <li>• <strong>Satellite:</strong> ESA Copernicus Sentinel-5P TROPOMI</li>
                        <li>• <strong>Parser:</strong> Google Earth Engine API + Python NetCDF4</li>
                        <li>• <strong>Quality Control:</strong> QA threshold &gt; 0.50, EPSG:4326 WGS84</li>
                      </ul>
                    </div>

                    {/* Layer D: AI & ML Ops */}
                    <div className="bg-slate-900/90 border border-purple-500/30 p-4 rounded-xl space-y-2">
                      <span className="text-purple-400 font-bold block border-b border-slate-800 pb-1">
                        🤖 LAYER D: AGENTIC AI & MLOPS INFRASTRUCTURE
                      </span>
                      <ul className="text-slate-300 space-y-1 font-sans text-xs">
                        <li>• <strong>Multi-Agent:</strong> CrewAI (`SensorAgent`, `ComplianceAgent`)</li>
                        <li>• <strong>Forecast:</strong> XGBoost + Random Forest ensemble (72-Hour)</li>
                        <li>• <strong>Metrics:</strong> R² = 0.9481, RMSE = 11.42 μg/m³ PM₂.₅</li>
                      </ul>
                    </div>

                    {/* Layer E: Security & Governance */}
                    <div className="bg-slate-900/90 border border-amber-500/30 p-4 rounded-xl space-y-2 md:col-span-2">
                      <span className="text-amber-400 font-bold block border-b border-slate-800 pb-1">
                        🛡️ LAYER E: SECURITY, GOVERNANCE & AUDIT EXPORTERS
                      </span>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-slate-300 font-sans text-xs">
                        <div>
                          <li>• <strong>Cryptographic Ledger:</strong> SHA-256 HMAC digest generator for auditability.</li>
                          <li>• <strong>Legal Engine:</strong> Section 31A Air (Prevention & Control) Act notice generator.</li>
                        </div>
                        <div>
                          <li>• <strong>Emergency Override:</strong> Passcode guardrail override (`VAYU-2026`).</li>
                          <li>• <strong>Localization:</strong> IndicTrans2 / Google Translate API for Hindi & Marathi.</li>
                        </div>
                      </div>
                    </div>

                  </div>

                  {/* SLA Metrics Table */}
                  <div id="performance-benchmarks" className="bg-slate-900/90 border border-slate-800 p-4 rounded-xl space-y-3 font-mono text-xs">
                    <h3 className="text-white font-bold flex items-center gap-2">
                      <span className="material-symbols-outlined text-amber-400 text-base">speed</span>
                      ⚡ 3. Latency & Execution Performance SLA Benchmarks
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-2 text-center">
                      <div className="bg-[#090d16] p-2.5 rounded border border-slate-800">
                        <span className="text-[10px] text-slate-500 block">Telemetry Ingestion</span>
                        <span className="text-emerald-400 font-bold text-sm">&lt; 200 ms</span>
                      </div>
                      <div className="bg-[#090d16] p-2.5 rounded border border-slate-800">
                        <span className="text-[10px] text-slate-500 block">Uber H3 Cell Lookup</span>
                        <span className="text-cyan-400 font-bold text-sm">&lt; 50 ms</span>
                      </div>
                      <div className="bg-[#090d16] p-2.5 rounded border border-slate-800">
                        <span className="text-[10px] text-slate-500 block">CrewAI Execution</span>
                        <span className="text-purple-400 font-bold text-sm">&lt; 4.8 s</span>
                      </div>
                      <div className="bg-[#090d16] p-2.5 rounded border border-slate-800">
                        <span className="text-[10px] text-slate-500 block">SHA-256 Signing</span>
                        <span className="text-amber-400 font-bold text-sm">&lt; 1.2 s</span>
                      </div>
                    </div>
                  </div>

                </div>
              </section>
            )}

            {/* SECTION 1: QUICKSTART */}
            {activeSection === "quickstart" && (
              <section className="space-y-6">
                <div>
                  <h1 className="text-3xl font-bold text-white tracking-tight font-display mb-2">
                    API Authentication & Quickstart Guide
                  </h1>
                </div>

                <div id="auth-overview" className="bg-blue-950/30 border border-blue-800/50 p-4 rounded-xl space-y-2">
                  <span className="text-xs font-mono font-bold text-blue-300 uppercase block">Bearer Token Header Requirement</span>
                  <p className="text-xs font-mono text-cyan-300 bg-[#090d16] p-2.5 rounded border border-slate-800">
                    Authorization: Bearer VAYU-2026-COMMAND-TOKEN
                  </p>
                </div>

                <CodeSnippetBlock
                  title="Hyperlocal Scenario Sandbox Request"
                  curlCode={`curl -X POST "${backendBaseUrl}/api/v1/predict/scenario" \\
  -H "Authorization: Bearer VAYU-2026-COMMAND-TOKEN" \\
  -H "Content-Type: application/json" \\
  -d '{
    "traffic_density_delta": -0.20,
    "industrial_output_delta": -0.15,
    "wind_speed_mps": 4.5
  }'`}
                  pythonCode={`import requests

url = "${backendBaseUrl}/api/v1/predict/scenario"
headers = {
    "Authorization": "Bearer VAYU-2026-COMMAND-TOKEN",
    "Content-Type": "application/json"
}
payload = {
    "traffic_density_delta": -0.20,      # -20% vehicular reduction
    "industrial_output_delta": -0.15,    # -15% industrial reduction
    "wind_speed_mps": 4.5                # 4.5 m/s wind velocity
}

response = requests.post(url, json=payload, headers=headers)
print(response.json())`}
                />
              </section>
            )}

            {/* DYNAMIC VECTOR LAYER SECTION */}
            {activeSection === "dynamic-vector-layer" && (
              <section className="space-y-6">
                <div>
                  <div className="flex items-center gap-2 text-xs font-mono text-blue-400 mb-1">
                    <span>SECTION 2</span> • <span>SPATIAL & TELEMETRY ENGINE</span>
                  </div>
                  <h1 className="text-3xl font-bold text-white tracking-tight font-display mb-2">
                    Dynamic Vector Layer Engine (`/dashboard/geospatial/vector`)
                  </h1>
                  <p className="text-sm text-slate-300 leading-relaxed font-sans">
                    The Dynamic Vector Layer Engine is the primary administrative GIS command interface for VayuSense, providing comprehensive spatial intelligence data mapping, telemetry logs, and query monitors.
                  </p>
                </div>

                {/* DASHBOARD REFERENCE SCREENSHOT */}
                <div className="space-y-2 bg-[#090d16] border border-slate-800 p-4 rounded-xl">
                  <div className="flex items-center justify-between text-xs font-mono text-cyan-400">
                    <span className="font-bold flex items-center gap-1.5 font-sans">
                      <span className="material-symbols-outlined text-sm">photo_camera</span>
                      FIGURE 2.0: DYNAMIC VECTOR LAYER DASHBOARD REFERENCE UI
                    </span>
                    <span className="text-[10px] text-slate-500">PRODUCTION SYSTEM SCREENSHOT</span>
                  </div>
                  <div className="relative w-full rounded-lg overflow-hidden border border-slate-800 shadow-2xl">
                    <img
                      src="/docs/dynamic-vector-layer.png"
                      alt="VayuSense Dynamic Vector Layer Dashboard Reference UI"
                      className="w-full h-auto object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                </div>

                {/* 1. Spatial Intelligence Metadata */}
                <div id="vector-overview" className="bg-[#090d16] border border-slate-800 p-5 rounded-xl space-y-3 font-sans">
                  <div className="flex items-center justify-between text-xs text-slate-400 border-b border-slate-800 pb-2 font-mono">
                    <span className="font-bold text-blue-400 flex items-center gap-1.5 font-sans">
                      <span className="material-symbols-outlined text-sm">info</span>
                      📍 1. Spatial Intelligence Metadata
                    </span>
                    <span className="text-[10px] bg-blue-500/10 text-blue-400 px-2 py-0.5 rounded border border-blue-500/20 font-mono font-bold">GIS DATA FUSION</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed font-sans">
                    In VayuSense, <strong>Spatial Intelligence Metadata</strong> refers to the geospatial coordinate systems, satellite telemetry metadata, and PostGIS vector properties displayed and ingested in the application&apos;s right-hand sidebar panels. It bridges space-borne atmospheric rasters (from Copernicus Sentinel-5P) with ground-level IoT sensor networks (CAAQMS) and municipal administrative boundaries using Uber H3 hexagonal grid indexing (Resolution 8).
                  </p>
                </div>

                {/* 2. Core Geospatial Commands */}
                <div id="geospatial-commands" className="bg-slate-900/80 border border-slate-800 p-5 rounded-xl space-y-4">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2 font-mono">
                    <span className="material-symbols-outlined text-indigo-400 text-base font-sans">map</span>
                    🎛️ 2. Core Geospatial Command Rooms
                  </h3>
                  
                  <div className="space-y-4 text-xs font-sans text-slate-300">
                    <div className="p-4 bg-slate-950 border border-slate-800 rounded-lg space-y-2">
                      <span className="text-white font-mono font-bold text-sm block">
                        Geospatial Vector Analysis Room (`/dashboard/geospatial/vector`)
                      </span>
                      <p className="leading-relaxed">
                        <strong>What It Does:</strong> Renders the main administrative and vector layer map. Features Mapbox GL JS integration with dotted/dashed boundary overlays for all 277 Municipal Corporations, active layer controls (IoT Sensors, logistics corridors, industrial perimeters), and a scrolling PostGIS query log showing live spatial operations (e.g., buffer calculations, intersections, centroid calculations).
                      </p>
                      <p className="leading-relaxed">
                        <strong>Why It Is Needed:</strong> Provides Municipal Command Directors with localized vector overlap capabilities to identify how industrial zones and logistics corridors contribute to PM2.5 or PM10 ground-level pollution spikes within municipal limits.
                      </p>
                      <div className="pt-2 border-t border-slate-850 space-y-1 text-[11px] font-mono text-cyan-400">
                        <div>• <code>activeStyle</code>: Map style selector (monochrome, satellite, hybrid).</div>
                        <div>• <code>layers</code>: Toggle states for vector datasets (caaQmsNodes, trafficGrids, factoryPerimeters, sentinelPlume).</div>
                        <div>• <code>activeCorp</code>: Viewport flyTo boundary transitions aligned to safety hazard status.</div>
                        <div>• <code>postGisQueries</code>: Rotating live SQL query console showing execution queries and performance benchmarks.</div>
                        <div>• <code>datasetExport</code>: Client-side JSON payload exporter.</div>
                      </div>
                    </div>

                    <div className="p-4 bg-slate-950 border border-slate-800 rounded-lg space-y-2">
                      <span className="text-white font-mono font-bold text-sm block">
                        Satellite Remote Sensing Ingestion Engine (`/dashboard/geospatial/satellite`)
                      </span>
                      <p className="leading-relaxed font-sans">
                        <strong>What It Does:</strong> Serves as the primary control interface for ESA Copernicus Sentinel-5P TROPOMI satellite data integration. Incorporates a dynamic cloud-masking processing overlay, OIDC authentication, STAC search, and displays metadata (scene ID, acquisition datetime, cloud cover percentage) alongside an Electric Indigo atmospheric plume overlay.
                      </p>
                      <p className="leading-relaxed font-sans">
                        <strong>Why It Is Needed:</strong> Allows municipal engineers to pull space-based atmospheric observations of trace gases (NO₂, SO₂, CO) to cross-verify and calibrate drift on ground-level telemetry sensors.
                      </p>
                      <div className="pt-2 border-t border-slate-850 space-y-1 text-[11px] font-mono text-cyan-400">
                        <div>• <code>isProcessingPipeline</code>: Visual de-clouding scanner animation trigger.</div>
                        <div>• <code>qaFilter</code>: Enforces QA cloud-mask conditions &gt; 0.50.</div>
                        <div>• <code>satelliteMetadata</code>: CDSE metadata display (scene ID, cloud cover, acquisition datetime).</div>
                        <div>• <code>plumeRaster</code>: Mapped Electric Indigo (#6366f1) raster overlay bounds.</div>
                        <div>• <code>pipelineLogs</code>: Step-by-step query log.</div>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-lg overflow-hidden border border-slate-800 bg-slate-950 p-2 my-2">
                    <img
                      src="/docs/doc-image-7.png"
                      alt="Sentinel Ingestion Plume Overlay Map"
                      className="w-full h-auto object-contain rounded"
                    />
                  </div>
                </div>

                {/* 3. Sidebar Panels & Widgets */}
                <div id="sidebar-widgets" className="bg-[#090d16] border border-slate-800 p-5 rounded-xl space-y-4 font-mono text-xs">
                  <div className="flex items-center justify-between text-slate-400 border-b border-slate-800 pb-2">
                    <span className="font-bold text-blue-400 flex items-center gap-1.5 font-sans">
                      <span className="material-symbols-outlined text-sm">widgets</span>
                      📊 3. Interactive Sidebar Panels & Widgets
                    </span>
                    <span className="text-[10px] bg-blue-500/10 text-blue-400 px-2 py-0.5 rounded border border-blue-500/20 font-mono font-bold">METADATA WIDGETS</span>
                  </div>

                  <div className="space-y-4 font-sans text-slate-300">
                    <div className="space-y-1">
                      <strong className="text-white block font-mono">1. Active Zone Telemetry (`activeZoneTelemetry`)</strong>
                      <p className="text-[11px] text-slate-400 leading-relaxed font-sans">Renders real-time capacity usage and telemetry limits (e.g., 88% CAP) to prevent monitoring clusters from operating near concurrency bottlenecks.</p>
                      <div className="rounded-lg overflow-hidden border border-slate-800 bg-slate-950 p-2 my-2">
                        <img
                          src="/docs/doc-image-8.png"
                          alt="Active Zone Telemetry Widget"
                          className="max-w-md h-auto object-contain rounded"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <strong className="text-white block font-mono">2. Sentinel Ingestion Pipeline Sync (`sentinelIngestionSync`)</strong>
                      <p className="text-[11px] text-slate-400 leading-relaxed font-sans">Asynchronously fetches fresh satellite observations from CDSE (`/api/geospatial/satellite/sync`), displaying OIDC and cloud cover parameters.</p>
                      <div className="rounded-lg overflow-hidden border border-slate-800 bg-slate-950 p-2 my-2">
                        <img
                          src="/docs/doc-image-9.png"
                          alt="Sentinel Ingestion Pipeline Sync Controls"
                          className="max-w-md h-auto object-contain rounded"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <strong className="text-white block font-mono">3. PostGIS Query Log (`postGisQueryLog`)</strong>
                      <p className="text-[11px] text-slate-400 leading-relaxed font-sans">Rotates through SQL query strings every 5 seconds, displaying precise ST_Geometry operations and database execution speeds.</p>
                      <div className="rounded-lg overflow-hidden border border-slate-800 bg-slate-950 p-2 my-2">
                        <img
                          src="/docs/doc-image-10.png"
                          alt="PostGIS Live Query Log Console"
                          className="max-w-md h-auto object-contain rounded"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <strong className="text-white block font-mono">4. System Alerts (`systemAlerts`)</strong>
                      <p className="text-[11px] text-slate-400 leading-relaxed font-sans">Pushes warning cards indicating localized air quality anomalies (e.g., 300% PM2.5 delta increase) or sensor failures in particular grids.</p>
                      <div className="rounded-lg overflow-hidden border border-slate-800 bg-slate-950 p-2 my-2">
                        <img
                          src="/docs/doc-image-11.png"
                          alt="System Alerts Notification Panel"
                          className="max-w-md h-auto object-contain rounded"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <strong className="text-white block font-mono">5. Export Dataset (`exportDataset`)</strong>
                      <p className="text-[11px] text-slate-400 leading-relaxed font-sans">Compiles state coordinate parameters, styles, query logs, and layer states into a downloadable local JSON payload.</p>
                      <div className="rounded-lg overflow-hidden border border-slate-800 bg-slate-950 p-2 my-2">
                        <img
                          src="/docs/doc-image-12.png"
                          alt="Export Dataset Download Action"
                          className="max-w-md h-auto object-contain rounded"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* 4. Visual Controls & Layers */}
                <div id="visual-controls" className="bg-slate-900/80 border border-slate-800 p-5 rounded-xl space-y-4 font-sans">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2 font-mono">
                    <span className="material-symbols-outlined text-emerald-400 text-base font-sans">layers</span>
                    🗺️ 4. Geospatial Matrix Filter & Layers
                  </h3>
                  <p className="text-xs text-slate-300 leading-relaxed font-sans">
                    Located in the collapsible control panel, the **Geospatial Matrix Filter** provides interactive toggles to customise the Mapbox view:
                  </p>
                  <ul className="text-xs text-slate-300 space-y-1.5 list-disc pl-4 font-mono">
                    <li><strong className="text-white font-sans">caaQmsNodes:</strong> Toggles IoT ground monitoring markers.</li>
                    <li><strong className="text-white font-sans">trafficGrids:</strong> Shows heavy logistics traffic highway road segments (#f59e0b).</li>
                    <li><strong className="text-white font-sans">factoryPerimeters:</strong> Highlights factory and industrial boundaries (#fc7c78).</li>
                    <li><strong className="text-white font-sans">sentinelPlume:</strong> Visualizes Copernicus tropospheric columns.</li>
                  </ul>

                  <div className="pt-2 border-t border-slate-800 space-y-2">
                    <strong className="text-xs text-white font-mono block">AQI Hazard Status Legend (`aqiHazardStatusLegend`)</strong>
                    <div className="text-xs text-slate-300 space-y-2 font-sans">
                      <p className="leading-relaxed">
                        <strong>What It Does:</strong> Renders a color-coded safety key explaining the safety hazard levels across municipal limits. Displays green (<code>#10b981</code>) for Nominal conditions, amber (<code>#f59e0b</code>) for Warning conditions, and pulsing red (<code>#ef4444</code>) for Critical conditions.
                      </p>
                      <p className="leading-relaxed">
                        <strong>Why It Is Needed:</strong> Provides administrative users with a clear and standardized visual benchmark to instantly interpret color-coded vector grids and boundaries without needing to manually inspect numeric data.
                      </p>
                      <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg space-y-1 font-mono text-[11px] text-cyan-400">
                        <div>• <code>aqiLegend</code>: Array of range bounds, safety status text, and corresponding Hex colors.</div>
                        <div>• <code>hazardScale</code>: Range thresholds mapping AQI readings to styling classes (e.g. pulsing animation for critical breaches).</div>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-lg overflow-hidden border border-slate-800 bg-slate-950 p-2 my-2">
                    <img
                      src="/docs/doc-image-13.png"
                      alt="Geospatial Layer Matrix Control Box"
                      className="max-w-md h-auto object-contain rounded"
                    />
                  </div>
                </div>

                {/* 5. Map Styles */}
                <div id="map-styles" className="bg-[#090d16] border border-slate-800 p-5 rounded-xl space-y-3 font-sans">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2 font-mono">
                    <span className="material-symbols-outlined text-cyan-400 text-base font-sans">palette</span>
                    🎨 5. Base Map Analytics Styles
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs font-mono mb-4">
                    <div className="bg-slate-950 p-3 rounded border border-slate-800 space-y-1">
                      <strong className="text-white block font-sans">Monochrome Vector</strong>
                      <span className="text-slate-400 font-sans">Sets Mapbox style to `dark-v11` for a clean layout highlighting custom vector layers.</span>
                    </div>
                    <div className="bg-slate-950 p-3 rounded border border-slate-850 space-y-1">
                      <strong className="text-white block font-sans">Spectral Satellite</strong>
                      <span className="text-slate-400 font-sans">Loads high-resolution imagery (`satellite-v9`) for direct surface and land coverage inspection.</span>
                    </div>
                    <div className="bg-slate-950 p-3 rounded border border-slate-850 space-y-1">
                      <strong className="text-white block font-sans">Hybrid Analytics</strong>
                      <span className="text-slate-400 font-sans">Combines satellite imagery with street vectors (`satellite-streets-v12`) to identify roads.</span>
                    </div>
                  </div>

                  <div className="rounded-lg overflow-hidden border border-slate-800 bg-slate-950 p-2 my-2">
                    <img
                      src="/docs/doc-image-14.png"
                      alt="Map Style Layer Selector Widget"
                      className="max-w-sm h-auto object-contain rounded"
                    />
                  </div>
                </div>
              </section>
            )}

            {/* SATELLITE INGESTION PIPELINES SECTION */}
            {activeSection === "satellite-pipeline" && (
              <section className="space-y-6">
                <div>
                  <div className="flex items-center gap-2 text-xs font-mono text-blue-400 mb-1">
                    <span>SECTION 2</span> • <span>SPATIAL & TELEMETRY ENGINE</span>
                  </div>
                  <h1 className="text-3xl font-bold text-white tracking-tight font-display mb-2">
                    Satellite Ingestion Pipelines (`/dashboard/geospatial/satellite`)
                  </h1>
                  <p className="text-sm text-slate-300 leading-relaxed font-sans font-sans">
                    The Satellite Ingestion Pipelines dashboard manages and visualizes Copernicus Sentinel-5P TROPOMI satellite data overlays to calibrate ground-level environmental sensors.
                  </p>
                </div>

                {/* DASHBOARD REFERENCE SCREENSHOT */}
                <div className="space-y-2 bg-[#090d16] border border-slate-800 p-4 rounded-xl">
                  <div className="flex items-center justify-between text-xs font-mono text-cyan-400">
                    <span className="font-bold flex items-center gap-1.5 font-sans">
                      <span className="material-symbols-outlined text-sm">photo_camera</span>
                      FIGURE 3.0: SATELLITE INGESTION PIPELINES DASHBOARD REFERENCE UI
                    </span>
                    <span className="text-[10px] text-slate-500">PRODUCTION SYSTEM SCREENSHOT</span>
                  </div>
                  <div className="relative w-full rounded-lg overflow-hidden border border-slate-800 shadow-2xl">
                    <img
                      src="/docs/satellite-pipeline-1.png"
                      alt="VayuSense Satellite Ingestion Pipelines Reference UI"
                      className="w-full h-auto object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                </div>

                {/* 1. Spatial Intelligence Control Panels */}
                <div id="satellite-controls" className="bg-slate-900/80 border border-slate-800 p-5 rounded-xl space-y-4">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2 font-mono">
                    <span className="material-symbols-outlined text-indigo-400 text-base font-sans">widgets</span>
                    🎛️ 2. Core Control Panel & Sidebar Widgets
                  </h3>
                  
                  <div className="space-y-4 text-xs font-sans text-slate-300">
                    <div className="space-y-1">
                      <strong className="text-white block font-mono">1. Spatial Intelligence Metadata (`spatialIntelligenceMetadata`)</strong>
                      <p className="text-[11px] text-slate-400 leading-relaxed font-sans">Renders the active coordinate focus (Latitude & Longitude) and database sync status of the selected map viewport.</p>
                    </div>

                    <div className="space-y-1">
                      <strong className="text-white block font-mono">2. Active Zone Telemetry (`activeZoneTelemetry`)</strong>
                      <p className="text-[11px] text-slate-400 leading-relaxed font-sans">Monitors and displays the real-time telemetry processing capacity for the active monitoring sector (e.g. Central Hub 88% CAP).</p>
                    </div>

                    <div className="space-y-1">
                      <strong className="text-white block font-mono">3. Sentinel Ingestion Pipeline Sync (`sentinelIngestionSync`)</strong>
                      <p className="text-[11px] text-slate-400 leading-relaxed font-sans">Executes direct API queries to Copernicus Data Space Ecosystem (CDSE) servers via a TRIGGER PIPELINE SYNC CTA and streams logs inside a terminal console.</p>
                    </div>

                    <div className="space-y-1">
                      <strong className="text-white block font-mono">4. PostGIS Query Log (`postGisQueryLog`)</strong>
                      <p className="text-[11px] text-slate-400 leading-relaxed font-sans">Streams the exact spatial SQL queries executed on the backend database with speed benchmarks.</p>
                    </div>

                    <div className="space-y-1">
                      <strong className="text-white block font-mono">5. Export Dataset (`exportDataset`)</strong>
                      <p className="text-[11px] text-slate-400 leading-relaxed font-sans">Renders a CTA at the bottom of the sidebar to download the active geospatial dataset as a local JSON payload.</p>
                    </div>
                  </div>
                </div>

                {/* 2. AQI Hazard Status Legend */}
                <div id="satellite-legend" className="bg-[#090d16] border border-slate-800 p-5 rounded-xl space-y-4 font-sans">
                  <div className="flex items-center justify-between text-slate-400 border-b border-slate-800 pb-2">
                    <span className="font-bold text-blue-400 flex items-center gap-1.5 font-sans">
                      <span className="material-symbols-outlined text-sm">info</span>
                      🎨 3. AQI Hazard Status Legend (`aqiHazardStatusLegend`)
                    </span>
                    <span className="text-[10px] bg-blue-500/10 text-blue-400 px-2 py-0.5 rounded border border-blue-500/20 font-mono font-bold">SAFETY BENCHMARKS</span>
                  </div>

                  <div className="text-xs text-slate-300 space-y-3 font-sans">
                    <p className="leading-relaxed font-sans">
                      <strong>What It Does:</strong> Renders a color-coded safety key explaining the safety hazard levels across municipal limits. Displays green (<code>#10b981</code>) for Nominal conditions (AQI &le; 150), amber (<code>#f59e0b</code>) for Warning Alert conditions (150 &lt; AQI &le; 200), and pulsing red (<code>#ef4444</code>) for Critical Limit conditions (AQI &gt; 200).
                    </p>
                    <p className="leading-relaxed font-sans font-sans">
                      <strong>Why It Is Needed:</strong> Provides administrative users with a clear and standardized visual benchmark to instantly interpret color-coded vector grids and boundaries without needing to manually inspect numeric data.
                    </p>
                    <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg space-y-1 font-mono text-[11px] text-cyan-400">
                      <div>• <code>aqiLegend</code>: Array of objects containing range bounds, safety status text, and corresponding Hex color strings.</div>
                      <div>• <code>hazardScale</code>: Mathematical range thresholds mapping AQI readings to distinct CSS styling classes (e.g. <code>animate-pulse</code> for critical breaches).</div>
                    </div>
                  </div>

                  <div className="rounded-lg overflow-hidden border border-slate-800 bg-slate-950 p-2 my-2">
                    <img
                      src="/docs/satellite-pipeline-2.png"
                      alt="AQI Hazard Status Legend Card"
                      className="max-w-md h-auto object-contain rounded"
                    />
                  </div>
                </div>

                {/* 3. Cloud Masking & Specs */}
                <div id="satellite-specs" className="bg-slate-900/80 border border-slate-800 p-5 rounded-xl space-y-3 font-sans font-sans">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2 font-mono">
                    <span className="material-symbols-outlined text-emerald-400 text-base font-sans">science</span>
                    🔬 4. Quality Assurance (QA) Cloud-Masking Algorithm
                  </h3>
                  <p className="text-xs text-slate-300 leading-relaxed font-sans">
                    Raw satellite observations are filtered using a strict Quality Assurance condition: <code>QA Value &gt; 0.50</code>. Pixels with heavy cloud cover &gt; 20% or solar zenith angles &gt; 75° are automatically masked to eliminate telemetry artifacts.
                  </p>
                  <pre className="p-4 bg-[#090d16] border border-slate-800 rounded-lg text-xs font-mono text-emerald-400 overflow-x-auto">
                    <code>{`def mask_cloud_pixels(raster_band, qa_band):
    """
    Applies Sentinel-5P TROPOMI QA cloud-masking threshold.
    Only pixels with QA > 0.50 are retained.
    """
    valid_mask = qa_band > 0.50
    cleaned_raster = numpy.where(valid_mask, raster_band, numpy.nan)
    return cleaned_raster`}</code>
                  </pre>
                </div>
              </section>
            )}

            {/* MODEL VALIDATION SECTION */}
            {/* CREWAI TOPOLOGY SECTION */}
            {activeSection === "crewai-topology" && (
              <section className="space-y-6">
                <div>
                  <div className="flex items-center gap-2 text-xs font-mono text-blue-400 mb-1">
                    <span>SECTION 3</span> • <span>AGENTIC ORCHESTRATION & ML OPS</span>
                  </div>
                  <h1 className="text-3xl font-bold text-white tracking-tight font-display mb-2">
                    CrewAI Multi-Agent Topology Map (`/dashboard/agent-logs/topology`)
                  </h1>
                  <p className="text-sm text-slate-300 leading-relaxed font-sans font-sans">
                    The CrewAI Multi-Agent Topology page visualizes the real-time orchestrations and data pipelines of the autonomous environmental agents (Sensor monitoring, source attribution, compliance dispatches) with logs and manual pulse controls.
                  </p>
                </div>

                {/* DASHBOARD REFERENCE SCREENSHOT */}
                <div className="space-y-2 bg-[#090d16] border border-slate-800 p-4 rounded-xl">
                  <div className="flex items-center justify-between text-xs font-mono text-cyan-400">
                    <span className="font-bold flex items-center gap-1.5 font-sans">
                      <span className="material-symbols-outlined text-sm font-sans">photo_camera</span>
                      FIGURE 5.0: MULTI-AGENT NETWORK TOPOLOGY MAP UI
                    </span>
                    <span className="text-[10px] text-slate-500">PRODUCTION SYSTEM SCREENSHOT</span>
                  </div>
                  <div className="relative w-full rounded-lg overflow-hidden border border-slate-800 shadow-2xl">
                    <img
                      src="/docs/crewai-topology.png"
                      alt="VayuSense CrewAI Multi-Agent Topology Reference UI"
                      className="w-full h-auto object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                </div>

                {/* 1. Autonomous Agent Nodes */}
                <div id="multi-agent-flow" className="bg-slate-900/80 border border-slate-800 p-5 rounded-xl space-y-4">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2 font-mono">
                    <span className="material-symbols-outlined text-indigo-400 text-base font-sans">hub</span>
                    🤖 1. Autonomous Agent Nodes & Specifications
                  </h3>
                  
                  <div className="space-y-4 text-xs font-sans text-slate-300 font-sans">
                    <div id="agent-specs" className="space-y-1 font-sans">
                      <strong className="text-white block font-mono">1. Sensor Monitoring Agent (ID: AG-SENSOR-01)</strong>
                      <p className="text-[11px] text-slate-400 leading-relaxed font-sans">
                        <strong>What It Does:</strong> Continuously scans telemetry feeds from ground-level CAAQMS/NAMP sensors to detect real-time spikes in particulate matter (PM2.5/PM10) or anomalous telemetry drift.
                      </p>
                      <p className="text-[11px] text-slate-400 leading-relaxed font-sans font-sans">
                        <strong>Why It Is Needed:</strong> Provides the initial trigger condition for the automated compliance pipeline when localized AQI levels exceed nominal compliance thresholds.
                      </p>
                      <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg space-y-1 font-mono text-[11px] text-cyan-400">
                        <div>• <code>flowStep</code>: Renders active pulse node states (e.g. green border and overlay shadows).</div>
                        <div>• <code>nodeID</code>: String constant registered as <code>ID: AG-SENSOR-01</code>.</div>
                        <div>• <code>telemetryAlerts</code>: Automated alert packets triggered when threshold values breach limit.</div>
                      </div>
                    </div>

                    <div className="space-y-1 pt-4 border-t border-slate-800/80 font-sans">
                      <strong className="text-white block font-mono">2. Source Attribution Agent (ID: AG-ATTRIB-04)</strong>
                      <p className="text-[11px] text-slate-400 leading-relaxed font-sans">
                        <strong>What It Does:</strong> Analyzes atmospheric dispersion vectors and industrial stack coordinates inside the Uber H3 Res-8 spatial index grid to determine pollutant sources.
                      </p>
                      <p className="text-[11px] text-slate-400 leading-relaxed font-sans">
                        <strong>Why It Is Needed:</strong> Backs environmental enforcement actions with mathematically and scientifically verified emission source ratios (e.g. isolating polluting industrial units).
                      </p>
                      <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg space-y-1 font-mono text-[11px] text-cyan-400">
                        <div>• <code>plumeModelling</code>: Renders the processing state (cyan pulsing border and overlay shadows).</div>
                        <div>• <code>nodeID</code>: String constant registered as <code>ID: AG-ATTRIB-04</code>.</div>
                        <div>• <code>attributionOutput</code>: Streams isolated source markers.</div>
                      </div>
                    </div>

                    <div className="space-y-1 pt-4 border-t border-slate-800/80 font-sans animate-fade">
                      <strong className="text-white block font-mono">3. Compliance Enforcement Agent (ID: AG-COMP-09)</strong>
                      <p className="text-[11px] text-slate-400 leading-relaxed font-sans">
                        <strong>What It Does:</strong> Drafts official municipal legal dispatches (show-cause notices) under regulatory acts and registers immutable audit trail signatures on the blockchain.
                      </p>
                      <p className="text-[11px] text-slate-400 leading-relaxed font-sans font-sans">
                        <strong>Why It Is Needed:</strong> Automates the administrative legal enforcement process, ensuring rapid compliance responses within the target SLA limit.
                      </p>
                      <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg space-y-1 font-mono text-[11px] text-cyan-400">
                        <div>• <code>enforceState</code>: Renders active enforcement state (purple pulsing border and overlay shadows).</div>
                        <div>• <code>nodeID</code>: String constant registered as <code>ID: AG-COMP-09</code>.</div>
                        <div>• <code>pdfNoticeGeneration</code>: Compilation of legal dispatches and cryptographic SHA-256 signing routines.</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 2. Control Console & Execution benchmarks */}
                <div id="execution-sla" className="bg-[#090d16] border border-slate-800 p-5 rounded-xl space-y-4 font-sans">
                  <div className="flex items-center justify-between text-slate-400 border-b border-slate-800 pb-2">
                    <span className="font-bold text-blue-400 flex items-center gap-1.5 font-sans">
                      <span className="material-symbols-outlined text-sm">terminal</span>
                      💻 2. Agent Activity & Control Console
                    </span>
                    <span className="text-[10px] bg-blue-500/10 text-blue-400 px-2 py-0.5 rounded border border-blue-500/20 font-mono font-bold">TERMINAL CONSOLE</span>
                  </div>

                  <div className="space-y-4 text-xs font-sans text-slate-300">
                    <div className="space-y-1">
                      <strong className="text-white block font-mono font-mono">1. Agent Activity Stream — Live</strong>
                      <p className="text-[11px] text-slate-400 leading-relaxed font-sans">
                        <strong>What It Does:</strong> Renders a terminal console window streaming live, color-coded console logs detailing running tasks, server handshakes, and response outputs.
                      </p>
                      <p className="text-[11px] text-slate-400 leading-relaxed font-sans">
                        <strong>Why It Is Needed:</strong> Enables engineers to verify execution workflows, monitor pipeline latency, and identify failing dependencies.
                      </p>
                      <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg space-y-1 font-mono text-[11px] text-cyan-400">
                        <div>• <code>logsArray</code>: Auto-updating list tracking timestamps, executing agent names, and message payloads.</div>
                        <div>• <code>terminalScrollRef</code>: Automated DOM scroll element focusing on the latest streamed console line.</div>
                      </div>
                    </div>

                    <div className="space-y-1 pt-4 border-t border-slate-800/80">
                      <strong className="text-white block font-mono">2. Pulse Topology (`sync`)</strong>
                      <p className="text-[11px] text-slate-400 leading-relaxed font-sans">
                        <strong>What It Does:</strong> Triggers a manual pipeline sync operation that queries the CrewAI analysis endpoint (<code>/api/v1/agents/analyze</code>) with a mock H3 index and streams the output report.
                      </p>
                      <p className="text-[11px] text-slate-400 leading-relaxed font-sans">
                        <strong>Why It Is Needed:</strong> Allows administrators to test the end-to-end agentic workflow, trace response latency, and execute inspections on demand.
                      </p>
                    </div>

                    <div className="space-y-1 pt-4 border-t border-slate-800/80">
                      <strong className="text-white block font-mono">3. Download (`download`)</strong>
                      <p className="text-[11px] text-slate-400 leading-relaxed font-sans">
                        <strong>What It Does:</strong> Provides a CTA button to save the current terminal activity stream logs as a local physical file.
                      </p>
                      <p className="text-[11px] text-slate-400 leading-relaxed font-sans font-sans">
                        <strong>Why It Is Needed:</strong> Facilitates offline audits and incident reporting for municipal clearance directors.
                      </p>
                    </div>
                  </div>
                </div>
              </section>
            )}

            {activeSection === "model-validation" && (
              <section className="space-y-6">
                <div>
                  <div className="flex items-center gap-2 text-xs font-mono text-blue-400 mb-1">
                    <span>SECTION 3</span> • <span>AGENTIC ORCHESTRATION & ML OPS</span>
                  </div>
                  <h1 className="text-3xl font-bold text-white tracking-tight font-display mb-2">
                    Model Validation Analytics (XGBoost / Random Forest)
                  </h1>
                  <p className="text-sm text-slate-300 leading-relaxed font-sans font-sans">
                    The Model Validation Analytics dashboard monitors model convergence logs, error metrics, and hyperparameter tuning configurations for the production ensemble models.
                  </p>
                </div>

                {/* DASHBOARD REFERENCE SCREENSHOT */}
                <div className="space-y-2 bg-[#090d16] border border-slate-800 p-4 rounded-xl">
                  <div className="flex items-center justify-between text-xs font-mono text-cyan-400">
                    <span className="font-bold flex items-center gap-1.5 font-sans">
                      <span className="material-symbols-outlined text-sm">photo_camera</span>
                      FIGURE 4.0: MODEL VALIDATION ANALYTICS Terminal REFERENCE UI
                    </span>
                    <span className="text-[10px] text-slate-500">PRODUCTION SYSTEM SCREENSHOT</span>
                  </div>
                  <div className="relative w-full rounded-lg overflow-hidden border border-slate-800 shadow-2xl">
                    <img
                      src="/docs/model-validation.png"
                      alt="VayuSense Model Validation Analytics Reference UI"
                      className="w-full h-auto object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                </div>

                {/* 1. MLOps Control Engine */}
                <div id="mlops-control-engine" className="bg-slate-900/80 border border-slate-800 p-5 rounded-xl space-y-4">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2 font-mono">
                    <span className="material-symbols-outlined text-indigo-400 text-base font-sans">settings_input_component</span>
                    🤖 1. Core MLOps Control Engine
                  </h3>
                  
                  <div className="space-y-4 text-xs font-sans text-slate-300 font-sans">
                    <div className="space-y-1">
                      <strong className="text-white block font-mono">1. Model Architecture</strong>
                      <p className="text-[11px] text-slate-400 leading-relaxed font-sans">Renders the active layout of the production machine learning model, which is an ensemble combination of Random Forest Regressor and XGBoost Regressor models.</p>
                      <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg space-y-1 font-mono text-[11px] text-cyan-400">
                        <div>• <code>activeArchitecture</code>: Random Forest Regressor + XGBoost Ensemble</div>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <strong className="text-white block font-mono">2. XGBoost Ensemble Hyperparameter Optimization Pipeline Settings</strong>
                      <p className="text-[11px] text-slate-400 leading-relaxed font-sans">Renders hyperparameter settings used for model training (such as maximum tree depth and learning rate) and provides a RE-RUN HYPERPARAMETER OPTIMIZATION TUNING button.</p>
                      <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg space-y-1 font-mono text-[11px] text-cyan-400">
                        <div>• <code>max_depth</code>: 12</div>
                        <div>• <code>learning_rate</code>: 0.05</div>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <strong className="text-white block font-mono">3. Archived Training Runs (`archivedTrainingRuns`)</strong>
                      <p className="text-[11px] text-slate-400 leading-relaxed font-sans">Renders a list card of recent model training runs containing their active/archived statuses and convergence descriptions.</p>
                      <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg space-y-1 font-mono text-[11px] text-cyan-400">
                        <div>• <code>runNumber</code>: Run #142 (Active), Run #141 (Overfitted), Run #140 (Success)</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 2. Validation Metrics & Convergence */}
                <div id="validation-metrics" className="bg-[#090d16] border border-slate-800 p-5 rounded-xl space-y-4 font-sans">
                  <div className="flex items-center justify-between text-slate-400 border-b border-slate-800 pb-2">
                    <span className="font-bold text-blue-400 flex items-center gap-1.5 font-sans">
                      <span className="material-symbols-outlined text-sm">bar_chart</span>
                      📊 2. Validation Metrics & Convergence
                    </span>
                    <span className="text-[10px] bg-blue-500/10 text-blue-400 px-2 py-0.5 rounded border border-blue-500/20 font-mono font-bold">PERFORMANCE SLA</span>
                  </div>

                  <div className="space-y-4 text-xs font-sans text-slate-300">
                    <div className="space-y-1">
                      <strong className="text-white block font-mono">4. Predictive Precision (RMSE)</strong>
                      <p className="text-[11px] text-slate-400 leading-relaxed font-sans">Displays the validation dataset Root Mean Square Error (RMSE) value alongside a change delta comparison arrow.</p>
                      <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg space-y-1 font-mono text-[11px] text-cyan-400">
                        <div>• <code>rmseValue</code>: 11.42 μg/m³</div>
                        <div>• <code>rmseDelta</code>: -1.4% (Stable decrease)</div>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <strong className="text-white block font-mono">5. R-Squared Accuracy (R²)</strong>
                      <p className="text-[11px] text-slate-400 leading-relaxed font-sans">Renders the Coefficient of Determination (R²) metric indicating the percentage of variance explained by model inputs.</p>
                      <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg space-y-1 font-mono text-[11px] text-cyan-400">
                        <div>• <code>rSquaredValue</code>: 0.894 (Stable fit)</div>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <strong className="text-white block font-mono">6. Mean Absolute Error (MAE)</strong>
                      <p className="text-[11px] text-slate-400 leading-relaxed font-sans">Renders the Mean Absolute Error (MAE) value computed on validation observations.</p>
                      <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg space-y-1 font-mono text-[11px] text-cyan-400">
                        <div>• <code>maeValue</code>: 8.19 μg/m³</div>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <strong className="text-white block font-mono">7. Real-Time Validation Benchmarks</strong>
                      <p className="text-[11px] text-slate-400 leading-relaxed font-sans">Renders real-time accuracy scoring benchmarks and status indicators against strict regulatory target thresholds.</p>
                      <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg space-y-1 font-mono text-[11px] text-cyan-400">
                        <div>• <code>validationMetricsTable</code>: Structure displaying each validation target alongside its actual run result.</div>
                        <div>• <code>validationStatusBadge</code>: High-contrast badge showing success or warning states (e.g. PASS or FAIL).</div>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <strong className="text-white block font-mono">8. Convergence History Across 200 XGBoost Training Epochs</strong>
                      <p className="text-[11px] text-slate-400 leading-relaxed font-sans">Plots a dual-line chart showing the training loss and validation RMSE values across 200 epochs of training.</p>
                      <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg space-y-1 font-mono text-[11px] text-cyan-400">
                        <div>• <code>trainingLossCurve</code>: Dataset values tracking training set error reduction per epoch.</div>
                        <div>• <code>validationRmseCurve</code>: Dataset values tracking validation set error trends per epoch.</div>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            )}

            {/* MODEL VALIDATION ANALYTICAL SECTION */}
            {activeSection === "model-validation-analytical" && (
              <section className="space-y-6">
                <div>
                  <div className="flex items-center gap-2 text-xs font-mono text-blue-400 mb-1">
                    <span>SECTION 3</span> • <span>AGENTIC ORCHESTRATION & ML OPS</span>
                  </div>
                  <h1 className="text-3xl font-bold text-white tracking-tight font-display mb-2">
                    Model Validation Analytical (`/dashboard/ml-ops/validation`)
                  </h1>
                  <p className="text-sm text-slate-300 leading-relaxed font-sans">
                    The Model Validation Analytical dashboard monitors model convergence logs, error metrics, and hyperparameter tuning configurations for the production ensemble models.
                  </p>
                </div>

                {/* DASHBOARD REFERENCE SCREENSHOT */}
                <div id="validation-overview" className="space-y-2 bg-[#090d16] border border-slate-800 p-4 rounded-xl font-sans">
                  <div className="flex items-center justify-between text-xs font-mono text-cyan-400">
                    <span className="font-bold flex items-center gap-1.5 font-sans">
                      <span className="material-symbols-outlined text-sm">photo_camera</span>
                      FIGURE 4.0: MODEL VALIDATION ANALYTICAL REFERENCE UI
                    </span>
                    <span className="text-[10px] text-slate-500">PRODUCTION SYSTEM SCREENSHOT</span>
                  </div>
                  <div className="relative w-full rounded-lg overflow-hidden border border-slate-800 shadow-2xl">
                    <img
                      src="/docs/validation-image-1.png"
                      alt="VayuSense Model Validation Analytics Reference UI"
                      className="w-full h-auto object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                </div>

                {/* 1. MLOps Control Engine */}
                <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-xl space-y-4">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2 font-mono">
                    <span className="material-symbols-outlined text-indigo-400 text-base font-sans">settings_input_component</span>
                    🤖 1. Core MLOps Control Engine
                  </h3>
                  
                  <div className="space-y-6 text-xs font-sans text-slate-300">
                    {/* Model Architecture */}
                    <div className="space-y-2">
                      <strong className="text-white block font-mono text-xs">1. Model Architecture</strong>
                      <p className="text-[11px] text-slate-400 leading-relaxed font-sans">Renders the active layout of the production machine learning model, which is an ensemble combination of Random Forest Regressor and XGBoost Regressor models.</p>
                      <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg space-y-1 font-mono text-[11px] text-cyan-400">
                        <div>• <code>activeArchitecture</code>: Random Forest Regressor + XGBoost Ensemble</div>
                      </div>
                    </div>

                    {/* XGBoost Settings */}
                    <div id="validation-settings" className="space-y-2 pt-4 border-t border-slate-800/80">
                      <strong className="text-white block font-mono text-xs">2. XGBoost Ensemble Hyperparameter Optimization Pipeline Settings</strong>
                      <p className="text-[11px] text-slate-400 leading-relaxed font-sans">Renders hyperparameter settings used for model training (such as maximum tree depth and learning rate) and provides a RE-RUN HYPERPARAMETER OPTIMIZATION TUNING button.</p>
                      <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg space-y-1 font-mono text-[11px] text-cyan-400">
                        <div>• <code>max_depth</code>: 12</div>
                        <div>• <code>learning_rate</code>: 0.05</div>
                        <div>• <code>estimators</code>: 450</div>
                      </div>
                      <div className="rounded-lg overflow-hidden border border-slate-800 bg-slate-950 p-2 my-2 max-w-sm">
                        <img
                          src="/docs/validation-image-2.png"
                          alt="Model Architecture settings"
                          className="w-full h-auto object-contain rounded"
                        />
                      </div>
                    </div>

                    {/* Archived Training Runs */}
                    <div id="validation-runs" className="space-y-2 pt-4 border-t border-slate-800/80 font-sans">
                      <strong className="text-white block font-mono text-xs">3. Archived Training Runs</strong>
                      <p className="text-[11px] text-slate-400 leading-relaxed font-sans font-sans">Renders a list card of recent model training runs containing their active/archived statuses and convergence descriptions.</p>
                      <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg space-y-1 font-mono text-[11px] text-cyan-400">
                        <div>• <code>runNumber</code>: Run #142 (Active), Run #141 (Overfitted), Run #140 (Success)</div>
                      </div>
                      <div className="rounded-lg overflow-hidden border border-slate-800 bg-slate-950 p-2 my-2 max-w-sm">
                        <img
                          src="/docs/validation-image-3.png"
                          alt="Archived Training Runs Panel"
                          className="w-full h-auto object-contain rounded"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* 2. Validation Metrics & Convergence */}
                <div className="bg-[#090d16] border border-slate-800 p-5 rounded-xl space-y-4 font-sans">
                  <div className="flex items-center justify-between text-slate-400 border-b border-slate-800 pb-2">
                    <span className="font-bold text-blue-400 flex items-center gap-1.5 font-sans font-sans">
                      <span className="material-symbols-outlined text-sm font-sans">bar_chart</span>
                      📊 2. Validation Metrics & Convergence
                    </span>
                    <span className="text-[10px] bg-blue-500/10 text-blue-400 px-2 py-0.5 rounded border border-blue-500/20 font-mono font-bold">PERFORMANCE SLA</span>
                  </div>

                  <div className="space-y-6 text-xs font-sans text-slate-300">
                    {/* Predictive Precision */}
                    <div id="validation-metrics" className="space-y-2">
                      <strong className="text-white block font-mono text-xs">4. Predictive Precision (RMSE)</strong>
                      <p className="text-[11px] text-slate-400 leading-relaxed font-sans">Displays the validation dataset Root Mean Square Error (RMSE) value alongside a change delta comparison arrow.</p>
                      <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg space-y-1 font-mono text-[11px] text-cyan-400 font-sans">
                        <div>• <code>rmseValue</code>: 11.42 PM2.5</div>
                        <div>• <code>rmseDelta</code>: +/- 0.15%</div>
                      </div>
                      <div className="rounded-lg overflow-hidden border border-slate-800 bg-slate-950 p-2 my-2 max-w-sm">
                        <img
                          src="/docs/validation-image-4.png"
                          alt="Predictive Precision Card"
                          className="w-full h-auto object-contain rounded"
                        />
                      </div>
                    </div>

                    {/* R-Squared */}
                    <div className="space-y-2 pt-4 border-t border-slate-800/80 font-sans">
                      <strong className="text-white block font-mono text-xs font-sans">5. R-Squared Accuracy (R²)</strong>
                      <p className="text-[11px] text-slate-400 leading-relaxed font-sans">Renders the Coefficient of Determination (R²) metric indicating the percentage of variance explained by model inputs.</p>
                      <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg space-y-1 font-mono text-[11px] text-cyan-400">
                        <div>• <code>rSquaredValue</code>: 0.9481 (Stable fit)</div>
                      </div>
                      <div className="rounded-lg overflow-hidden border border-slate-800 bg-slate-950 p-2 my-2 max-w-sm">
                        <img
                          src="/docs/validation-image-5.png"
                          alt="R-Squared Accuracy Card"
                          className="w-full h-auto object-contain rounded"
                        />
                      </div>
                    </div>

                    {/* MAE */}
                    <div className="space-y-2 pt-4 border-t border-slate-800/80 font-sans">
                      <strong className="text-white block font-mono text-xs">6. Mean Absolute Error (MAE)</strong>
                      <p className="text-[11px] text-slate-400 leading-relaxed font-sans font-sans">Renders the Mean Absolute Error (MAE) value computed on validation observations.</p>
                      <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg space-y-1 font-mono text-[11px] text-cyan-400">
                        <div>• <code>maeValue</code>: 8.918 μg/m³</div>
                      </div>
                      <div className="rounded-lg overflow-hidden border border-slate-800 bg-slate-950 p-2 my-2 max-w-sm">
                        <img
                          src="/docs/validation-image-6.png"
                          alt="Mean Absolute Error Card"
                          className="w-full h-auto object-contain rounded"
                        />
                      </div>
                    </div>

                    {/* Validation Benchmarks */}
                    <div id="validation-benchmarks" className="space-y-2 pt-4 border-t border-slate-800/80">
                      <strong className="text-white block font-mono text-xs">7. Real-Time Validation Benchmarks</strong>
                      <p className="text-[11px] text-slate-400 leading-relaxed font-sans">Renders real-time accuracy scoring benchmarks and status indicators against strict regulatory target thresholds.</p>
                      <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg space-y-1 font-mono text-[11px] text-cyan-400">
                        <div>• <code>validationMetricsTable</code>: Structure displaying each validation target alongside its actual run result.</div>
                        <div>• <code>validationStatusBadge</code>: High-contrast badge showing success or warning states (e.g. PASS or FAIL).</div>
                      </div>
                    </div>

                    {/* Convergence Epoch History */}
                    <div id="validation-convergence" className="space-y-2 pt-4 border-t border-slate-800/80 font-sans">
                      <strong className="text-white block font-mono text-xs">8. Convergence History Across 200 XGBoost Training Epochs</strong>
                      <p className="text-[11px] text-slate-400 leading-relaxed font-sans font-sans font-sans">Plots a dual-line chart showing the training loss and validation RMSE values across 200 epochs of training.</p>
                      <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg space-y-1 font-mono text-[11px] text-cyan-400">
                        <div>• <code>trainingLossCurve</code>: Dataset values tracking training set error reduction per epoch.</div>
                        <div>• <code>validationRmseCurve</code>: Dataset values tracking validation set error trends per epoch.</div>
                      </div>
                      <div className="rounded-lg overflow-hidden border border-slate-800 bg-slate-950 p-2 my-2">
                        <img
                          src="/docs/validation-image-7.png"
                          alt="Validation Convergence Chart"
                          className="w-full h-auto object-contain rounded"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            )}

            {/* REGIONAL TRANSLATION & OVERRIDES SECTION */}
            {activeSection === "translation-overrides" && (
              <section className="space-y-6">
                <div>
                  <div className="flex items-center gap-2 text-xs font-mono text-blue-400 mb-1">
                    <span>SECTION 4</span> • <span>GOVERNANCE & COMPLIANCE</span>
                  </div>
                  <h1 className="text-3xl font-bold text-white tracking-tight font-display mb-2">
                    Regional Translation & Overrides
                  </h1>
                  <p className="text-sm text-slate-300 leading-relaxed font-sans">
                    VayuSense incorporates a high-performance regional language translation engine to localized advisories for field operators, alongside statutory override features.
                  </p>
                </div>

                {/* TRANSLATION REF SCREENSHOT */}
                <div id="regional-language" className="space-y-2 bg-[#090d16] border border-slate-800 p-4 rounded-xl">
                  <div className="flex items-center justify-between text-xs font-mono text-cyan-400">
                    <span className="font-bold flex items-center gap-1.5 font-sans font-sans">
                      <span className="material-symbols-outlined text-sm font-sans">photo_camera</span>
                      FIGURE 6.0: REGIONAL LANGUAGE TRANATION HUB UI
                    </span>
                    <span className="text-[10px] text-slate-500 font-sans">PRODUCTION SYSTEM SCREENSHOT</span>
                  </div>
                  <div className="relative w-full rounded-lg overflow-hidden border border-slate-800 shadow-2xl">
                    <img
                      src="/docs/translation-hub.png"
                      alt="Regional Language Translation Hub"
                      className="w-full h-auto object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                </div>

                {/* 1. Regional Translation Console */}
                <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-xl space-y-4">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2 font-mono">
                    <span className="material-symbols-outlined text-indigo-400 text-base font-sans">translate</span>
                    🎛️ 1. Regional Translation Console
                  </h3>
                  
                  <div className="space-y-4 text-xs font-sans text-slate-300">
                    <div className="space-y-1">
                      <strong className="text-white block font-mono">1. Regional Language Translation Hub</strong>
                      <p className="text-[11px] text-slate-400 leading-relaxed font-sans">
                        <strong>What It Does:</strong> Translates English environmental warning alerts, anomaly descriptions, recommended actions, and compliance notices into regional Indian languages (Hindi and Marathi).
                      </p>
                      <p className="text-[11px] text-slate-400 leading-relaxed font-sans">
                        <strong>Why It Is Needed:</strong> Ensures that field enforcement officers, local municipal councils, and regional operators who are more comfortable with local languages can immediately interpret complex legal notice drafts and technical warnings.
                      </p>
                      <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg space-y-1 font-mono text-[11px] text-cyan-400">
                        <div>• <code>languageSelector</code>: Toggle buttons switching between Hindi (<code>hi</code>) and Marathi (<code>mr</code>).</div>
                        <div>• <code>sourcePanel</code>: English advisory description.</div>
                        <div>• <code>targetPanel</code>: Translated advisory details.</div>
                      </div>
                    </div>

                    <div id="regional-languages-table" className="space-y-1 pt-4 border-t border-slate-800/80">
                      <strong className="text-white block font-mono">2. Translation System Activity Logs</strong>
                      <p className="text-[11px] text-slate-400 leading-relaxed font-sans">
                        <strong>What It Does:</strong> Streams real-time processing logs from the localization engine (e.g. cache hits, NMT translation triggers, and text alignment checks).
                      </p>
                      <p className="text-[11px] text-slate-400 leading-relaxed font-sans font-sans">
                        <strong>Why It Is Needed:</strong> Allows engineers to audit the translation workflow performance, trace Redis LRU cache hit latency, and verify that IndicTrans2 translation runs are executing correctly.
                      </p>
                      <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg space-y-1 font-mono text-[11px] text-cyan-400">
                        <div>• <code>logsList</code>: Array of timestamps and messages detailing translation tasks.</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 2. Statutory overrides */}
                <div id="guardrail-overrides" className="bg-[#090d16] border border-slate-800 p-5 rounded-xl space-y-4 font-sans">
                  <div className="flex items-center justify-between text-slate-400 border-b border-slate-800 pb-2">
                    <span className="font-bold text-blue-400 flex items-center gap-1.5 font-sans">
                      <span className="material-symbols-outlined text-sm">security</span>
                      🔒 2. Statutory Guardrail Overrides
                    </span>
                    <span className="text-[10px] bg-red-500/10 text-red-400 px-2 py-0.5 rounded border border-red-500/20 font-mono font-bold">LEVEL 4 CLEARANCE</span>
                  </div>

                  <div className="space-y-4 text-xs font-sans text-slate-300">
                    <div className="space-y-1">
                      <strong className="text-white block font-mono">1. Statutory Compliance Guardrails Override</strong>
                      <p className="text-[11px] text-slate-400 leading-relaxed font-sans">
                        <strong>What It Does:</strong> Renders the control switch matrix enabling operators to manually disable or restore automated system responses (Warning Broadcasts, Emissions Capping, Traffic Diverters).
                      </p>
                      <p className="text-[11px] text-slate-400 leading-relaxed font-sans">
                        <strong>Why It Is Needed:</strong> Provides emergency flexibility for administrative command staff to pause automated capping constraints during severe operational overrides or weather anomalies.
                      </p>
                      <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg space-y-1 font-mono text-[11px] text-cyan-400">
                        <div>• <code>warningBroadcast</code> / <code>emissionCapping</code> / <code>trafficDiverters</code>: State variables representing the active status of each guardrail.</div>
                      </div>
                    </div>

                    <div className="space-y-1 pt-4 border-t border-slate-800/80">
                      <strong className="text-white block font-mono">2. Temporarily bypass automated environmental safety algorithms</strong>
                      <p className="text-[11px] text-slate-400 leading-relaxed font-sans">
                        <strong>What It Does:</strong> Opens a high-priority confirmation modal prompting the operator for a security validation passcode (e.g. <code>VAYU-2026</code>) when attempting to disable a guardrail.
                      </p>
                      <p className="text-[11px] text-slate-400 leading-relaxed font-sans">
                        <strong>Why It Is Needed:</strong> Prevents unauthorized or accidental disabling of safety parameters, ensuring only authorized personnel can bypass guardrails.
                      </p>
                      <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg space-y-1 font-mono text-[11px] text-cyan-400">
                        <div>• Mandatory passcode verification: <code>VAYU-2026</code></div>
                        <div>• Clearance level requirement: Level 4 Command Director</div>
                      </div>
                    </div>

                    <div className="space-y-1 pt-4 border-t border-slate-800/80">
                      <strong className="text-white block font-mono">3. Audit Ledger Engine & Override Audit Logs</strong>
                      <p className="text-[11px] text-slate-400 leading-relaxed font-sans">
                        <strong>Audit Ledger Engine:</strong> Establishes a synchronized socket connection with external GovChain blockchain consensus nodes (e.g., node `#MUM-NODE-12`) to register override events.
                      </p>
                      <p className="text-[11px] text-slate-400 leading-relaxed font-sans">
                        <strong>Override Audit Logs:</strong> Streams a scrollable list of system security logs tracking timestamps, officer names, specific compliance action summaries, and state statuses (active/bypassed/restored).
                      </p>
                      <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg space-y-1 font-mono text-[11px] text-cyan-400">
                        <div>• <code>blockNode</code>: String identify of the destination blockchain validator node.</div>
                        <div>• <code>logsList</code>: List tracking timestamps and override actions.</div>
                      </div>
                    </div>

                    <div className="space-y-1 pt-4 border-t border-slate-800/80">
                      <strong className="text-white block font-mono">4. Air Safety Diagnostic Indicators</strong>
                      <p className="text-[11px] text-slate-400 leading-relaxed font-sans">
                        <strong>Active Air Safety Limits:</strong> Displays regulatory baseline concentration threshold limits (e.g. <code>35 μg/m³ PM2.5</code> under standard EPA 24h rules).
                      </p>
                      <p className="text-[11px] text-slate-400 leading-relaxed font-sans">
                        <strong>Statutory Mode Status:</strong> Renders a safety mode indicator switching between <code>STRICT</code> (all guardrails active) and <code>PARTIAL BYPASS</code> (one or more guardrails disengaged).
                      </p>
                      <p className="text-[11px] text-slate-400 leading-relaxed font-sans">
                        <strong>System Authority Tokens:</strong> Displays current session clearance levels (e.g. <code>VAYU-2026</code> root authority).
                      </p>
                    </div>
                  </div>

                  <div className="rounded-lg overflow-hidden border border-slate-800 bg-slate-950 p-2 my-2 animate-fade">
                    <img
                      src="/docs/guardrail-override.png"
                      alt="Statutory Compliance Guardrails Override"
                      className="w-full h-auto object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                </div>
              </section>
            )}

            {/* SHA-256 AUDIT EXPORTER SECTION */}
            {activeSection === "sha256-exporter" && (
              <section className="space-y-6">
                <div>
                  <div className="flex items-center gap-2 text-xs font-mono text-blue-400 mb-1">
                    <span>SECTION 4</span> • <span>GOVERNANCE & COMPLIANCE</span>
                  </div>
                  <h1 className="text-3xl font-bold text-white tracking-tight font-display mb-2">
                    Immutable API System Log Exporter (`/dashboard/agent-logs/exporter`)
                  </h1>
                  <p className="text-sm text-slate-300 leading-relaxed font-sans font-sans">
                    The SHA-256 Audit Exporter provides an interface to compile, sign, and download tamper-proof logs registered on the GovChain blockchain consensus layer.
                  </p>
                </div>

                {/* EXPORTER REF SCREENSHOT */}
                <div id="immutable-audit" className="space-y-2 bg-[#090d16] border border-slate-800 p-4 rounded-xl font-sans">
                  <div className="flex items-center justify-between text-xs font-mono text-cyan-400">
                    <span className="font-bold flex items-center gap-1.5 font-sans">
                      <span className="material-symbols-outlined text-sm font-sans">photo_camera</span>
                      FIGURE 7.0: IMMUTABLE API SYSTEM LOG EXPORTER UI
                    </span>
                    <span className="text-[10px] text-slate-500">PRODUCTION SYSTEM SCREENSHOT</span>
                  </div>
                  <div className="relative w-full rounded-lg overflow-hidden border border-slate-800 shadow-2xl">
                    <img
                      src="/docs/sha256-exporter.png"
                      alt="Immutable API System Log Exporter Reference UI"
                      className="w-full h-auto object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                </div>

                {/* 1. Exporter Dashboard Console */}
                <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-xl space-y-4 font-sans">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2 font-mono">
                    <span className="material-symbols-outlined text-indigo-400 text-base font-sans">archive</span>
                    🎛️ 1. Exporter Dashboard Console
                  </h3>
                  
                  <div className="space-y-6 text-xs font-sans text-slate-300 font-sans">
                    {/* Log Exporter */}
                    <div className="space-y-2 font-sans">
                      <strong className="text-white block font-mono text-xs">1. Immutable API System Log Exporter</strong>
                      <p className="text-[11px] text-slate-400 leading-relaxed font-sans">
                        <strong>What It Does:</strong> Renders the central governance dashboard interface for compiling, cryptographically signing, and downloading structured system logs.
                      </p>
                      <p className="text-[11px] text-slate-400 leading-relaxed font-sans">
                        <strong>Why It Is Needed:</strong> Provides municipal environmental officers and green tribunal regulators with legally binding, audit-ready data packages that meet strict evidential compliance standards.
                      </p>
                      <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg space-y-1 font-mono text-[11px] text-cyan-400">
                        <div>• <code>securityLayer</code>: Visual header indicator confirming AES-256 active payload protection.</div>
                        <div>• <code>exportResultModal</code>: Popup window containing generated cryptographic check signatures and transaction hashes.</div>
                      </div>
                    </div>

                    {/* Exporter Parameters */}
                    <div id="hashing-protocol" className="space-y-2 pt-4 border-t border-slate-800/80 font-sans">
                      <strong className="text-white block font-mono text-xs">2. Exporter Parameters</strong>
                      <p className="text-[11px] text-slate-400 leading-relaxed font-sans">
                        <strong>What It Does:</strong> Renders the controls to configure output filters, including the log category source (IoT telemetry, ML models, administrative overrides, agent topologies), output format (JSON/CSV), and switches for SHA-256 hashes or AES payload encryption.
                      </p>
                      <p className="text-[11px] text-slate-400 leading-relaxed font-sans font-sans font-sans">
                        <strong>Why It Is Needed:</strong> Allows users to narrow down data scopes and enforce cryptographic signing rules prior to running exports.
                      </p>
                      <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg space-y-1 font-mono text-[11px] text-cyan-400">
                        <div>• <code>selectedSource</code>: Dropdown selector mapping target database tables.</div>
                        <div>• <code>exportFormat</code>: Configures formatting options between JSON or CSV representations.</div>
                        <div>• <code>includeHashes</code> / <code>encryptPayloads</code>: Toggles for SHA-256 checksums and AES encryption layers.</div>
                      </div>
                    </div>

                    {/* Telemetry Stream Preview */}
                    <div id="export-endpoint" className="space-y-2 pt-4 border-t border-slate-800/80 font-sans font-sans">
                      <strong className="text-white block font-mono text-xs">3. Telemetry Stream Preview</strong>
                      <p className="text-[11px] text-slate-400 leading-relaxed font-sans">
                        <strong>What It Does:</strong> Renders a scrollable JSON/CSV code editor showing a live preview of the target records before finalizing the cryptographic export.
                      </p>
                      <p className="text-[11px] text-slate-400 leading-relaxed font-sans">
                        <strong>Why It Is Needed:</strong> Enables operators to inspect the raw payloads, timestamps, events, and IDs to confirm target log contents.
                      </p>
                      <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg space-y-1 font-mono text-[11px] text-cyan-400">
                        <div>• <code>recordsCount</code>: Renders the number of loaded database rows.</div>
                        <div>• <code>formatToggle</code>: Switches preview formatting layout based on JSON/CSV selections.</div>
                      </div>
                    </div>

                    {/* GovChain Ledger Interface */}
                    <div className="space-y-2 pt-4 border-t border-slate-800/80 font-sans">
                      <strong className="text-white block font-mono text-xs font-sans">4. GovChain Ledger Interface</strong>
                      <p className="text-[11px] text-slate-400 leading-relaxed font-sans">
                        <strong>What It Does:</strong> Displays the state of the public regulatory ledger nodes, indicating the block authority validating transactions (e.g. MUM-NODE-12).
                      </p>
                      <p className="text-[11px] text-slate-400 leading-relaxed font-sans">
                        <strong>Why It Is Needed:</strong> Confirms that transaction hashes are being published to a decentralized audit trail, preventing retroactive tampering.
                      </p>
                      <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg space-y-1 font-mono text-[11px] text-cyan-400">
                        <div>• <code>blockAuthority</code>: String identify of the validating ledger consensus node.</div>
                        <div>• <code>ledgerSyncStatus</code>: Ping indicator showing live network status.</div>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            )}

            {/* COMMAND CONFIGURATION & SETTINGS SECTION */}
            {activeSection === "command-settings" && (
              <section className="space-y-6">
                <div>
                  <div className="flex items-center gap-2 text-xs font-mono text-blue-400 mb-1">
                    <span>SECTION 4</span> • <span>GOVERNANCE & COMPLIANCE</span>
                  </div>
                  <h1 className="text-3xl font-bold text-white tracking-tight font-display mb-2">
                    Command Settings & Configurations (`/dashboard/settings`)
                  </h1>
                  <p className="text-sm text-slate-300 leading-relaxed font-sans">
                    The Command Settings console allows Level 4 Municipal Command Directors to modify critical AQI limits, configure third-party access keys, and toggle enforcement policies with GovChain ledger sync audits.
                  </p>
                </div>

                {/* SETTINGS REF SCREENSHOT */}
                <div id="command-settings-ui" className="space-y-2 bg-[#090d16] border border-slate-800 p-4 rounded-xl font-sans font-sans">
                  <div className="flex items-center justify-between text-xs font-mono text-cyan-400">
                    <span className="font-bold flex items-center gap-1.5 font-sans">
                      <span className="material-symbols-outlined text-sm font-sans font-sans">photo_camera</span>
                      FIGURE 8.0: COMMAND CONFIGURATION PANEL UI
                    </span>
                    <span className="text-[10px] text-slate-500 font-sans">PRODUCTION SYSTEM SCREENSHOT</span>
                  </div>
                  <div className="relative w-full rounded-lg overflow-hidden border border-slate-800 shadow-2xl">
                    <img
                      src="/docs/command-settings.png"
                      alt="Command Configuration Panel Reference UI"
                      className="w-full h-auto object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                </div>

                {/* 1. Administrative Profiles & Calibrations */}
                <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-xl space-y-4 font-sans">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2 font-mono">
                    <span className="material-symbols-outlined text-indigo-400 text-base font-sans">settings_suggest</span>
                    🎛️ 1. Administrative Profiles & Thresholds
                  </h3>
                  
                  <div className="space-y-6 text-xs font-sans text-slate-300">
                    {/* Active Profile */}
                    <div id="officer-profile" className="space-y-2">
                      <strong className="text-white block font-mono text-xs">1. Active Administrative Officer Profile</strong>
                      <p className="text-[11px] text-slate-400 leading-relaxed font-sans">
                        <strong>What It Does:</strong> Displays the identity, department, jurisdiction, and unique signature secure key token of the logged-in administrative authority (e.g. Dr. Abhijit K. Bhosale, IAS).
                      </p>
                      <p className="text-[11px] text-slate-400 leading-relaxed font-sans">
                        <strong>Why It Is Needed:</strong> Establishes accountability and validates administrative clearance level signatures required for committing config changes.
                      </p>
                      <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg space-y-1 font-mono text-[11px] text-cyan-400">
                        <div>• <code>officerName</code> / <code>department</code> / <code>jurisdiction</code>: Verification fields indicating authorized users.</div>
                        <div>• <code>signatureSecureKey</code>: Unique cryptographic token used to verify authorization.</div>
                      </div>
                    </div>

                    {/* Trigger Matrix */}
                    <div id="statutory-trigger-matrix" className="space-y-2 pt-4 border-t border-slate-800/80 font-sans">
                      <strong className="text-white block font-mono text-xs">2. Municipal Statutory Trigger Matrix</strong>
                      <p className="text-[11px] text-slate-400 leading-relaxed font-sans font-sans">
                        <strong>What It Does:</strong> Configures numerical trigger bounds, including the Critical AQI Breach limit, High-Frequency PM2.5 ceiling, and sensor drift tolerance levels.
                      </p>
                      <p className="text-[11px] text-slate-400 leading-relaxed font-sans">
                        <strong>Why It Is Needed:</strong> Customizes the sensitivity of the automated alert pipelines to match local municipal mandates and geographic needs.
                      </p>
                      <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg space-y-1 font-mono text-[11px] text-cyan-400">
                        <div>• <code>aqiThreshold</code> / <code>pmThreshold</code>: Adjustable thresholds that command agents evaluate to detect spike breaches.</div>
                        <div>• <code>driftTolerance</code>: Configures percentage levels to filter out telemetry sensor noise.</div>
                      </div>
                    </div>

                    {/* Infrastructure Integrations */}
                    <div id="secure-integrations" className="space-y-2 pt-4 border-t border-slate-800/80 font-sans">
                      <strong className="text-white block font-mono text-xs">3. Secure Infrastructure Integrations</strong>
                      <p className="text-[11px] text-slate-400 leading-relaxed font-sans">
                        <strong>What It Does:</strong> Manages secret keys and access tokens linking the system to external services (e.g., European Space Agency Copernicus Hub and State Pollution Control Board/MPCB).
                      </p>
                      <p className="text-[11px] text-slate-400 leading-relaxed font-sans">
                        <strong>Why It Is Needed:</strong> Secures connections to geospatial satellites and national pollution databanks, preventing data intercept risks.
                      </p>
                      <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg space-y-1 font-mono text-[11px] text-cyan-400">
                        <div>• <code>esaToken</code> / <code>mpcbSecret</code>: Secured password input fields with toggle visibility buttons.</div>
                      </div>
                    </div>

                    {/* Enforcement Policies */}
                    <div id="enforcement-policies" className="space-y-2 pt-4 border-t border-slate-800/80 font-sans">
                      <strong className="text-white block font-mono text-xs">4. Automated Enforcement Policies</strong>
                      <p className="text-[11px] text-slate-400 leading-relaxed font-sans">
                        <strong>What It Does:</strong> Toggles administrative rules including Strict Facial Consistency Mode for AR field devices, Immediate Compliance Filing for multi-agent syncs, and regional cache bypasses.
                      </p>
                      <p className="text-[11px] text-slate-400 leading-relaxed font-sans">
                        <strong>Why It Is Needed:</strong> Enables directors to quickly alter guardrails during emergency overrides or diagnostic checks.
                      </p>
                      <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg space-y-1 font-mono text-[11px] text-cyan-400">
                        <div>• <code>facialConsistency</code> / <code>autoFiling</code> / <code>bypassCache</code>: Toggle buttons indicating state changes.</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 2. System Action Controls */}
                <div id="system-action-controls" className="bg-[#090d16] border border-slate-800 p-5 rounded-xl space-y-4 font-sans">
                  <div className="flex items-center justify-between text-slate-400 border-b border-slate-800 pb-2">
                    <span className="font-bold text-blue-400 flex items-center gap-1.5 font-sans">
                      <span className="material-symbols-outlined text-sm">task_alt</span>
                      🔒 2. System Action Controls
                    </span>
                    <span className="text-[10px] bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded border border-emerald-500/20 font-mono font-bold">STATE ACTIONS</span>
                  </div>

                  <div className="space-y-4 text-xs font-sans text-slate-300">
                    <div className="space-y-1">
                      <strong className="text-white block font-mono">1. RESET TO MUNICIPAL BASELINES</strong>
                      <p className="text-[11px] text-slate-400 leading-relaxed font-sans">
                        <strong>What It Does:</strong> Restores all threshold levels and enforcement policy switches to their default factory values (AQI 200, PM2.5 150, Drift 12%, etc.).
                      </p>
                      <p className="text-[11px] text-slate-400 leading-relaxed font-sans">
                        <strong>Why It Is Needed:</strong> Allows users to quickly cancel any customized deviations and restore a safe, approved operational state.
                      </p>
                    </div>

                    <div className="space-y-1 pt-4 border-t border-slate-800/80">
                      <strong className="text-white block font-mono font-mono">2. COMMIT CHANGES & SECURE LOG</strong>
                      <p className="text-[11px] text-slate-400 leading-relaxed font-sans">
                        <strong>What It Does:</strong> Validates change authorizations, generates a cryptographic SHA-256 signature, and syncs updated parameters to the GovChain consensus ledger.
                      </p>
                      <p className="text-[11px] text-slate-400 leading-relaxed font-sans">
                        <strong>Why It Is Needed:</strong> Immutably records configuration updates on the blockchain to prevent unauthorized backdoor tampering.
                      </p>
                      <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg space-y-1 font-mono text-[11px] text-cyan-400">
                        <div>• <code>isCommitting</code>: Spin loader and status messages describing execution steps (handshakes, signature compilation, blockchain synchronization).</div>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            )}

            {/* ADMINISTRATIVE PROFILE SECTION */}
            {activeSection === "administrative-profile" && (
              <section className="space-y-6">
                <div>
                  <div className="flex items-center gap-2 text-xs font-mono text-blue-400 mb-1">
                    <span>SECTION 4</span> • <span>GOVERNANCE & COMPLIANCE</span>
                  </div>
                  <h1 className="text-3xl font-bold text-white tracking-tight font-display mb-2">
                    Administrative Profile & Workspace Preferences (`/dashboard/settings/profile`)
                  </h1>
                  <p className="text-sm text-slate-300 leading-relaxed font-sans font-sans">
                    The Administrative Profile settings panel outlines environmental supervisor credentials, display modes, and terminal stream refresh parameters.
                  </p>
                </div>

                {/* PROFILE REF SCREENSHOT */}
                <div id="administrative-profile-ui" className="space-y-2 bg-[#090d16] border border-slate-800 p-4 rounded-xl font-sans font-sans font-sans font-sans">
                  <div className="flex items-center justify-between text-xs font-mono text-cyan-400">
                    <span className="font-bold flex items-center gap-1.5 font-sans">
                      <span className="material-symbols-outlined text-sm font-sans font-sans">photo_camera</span>
                      FIGURE 9.0: ADMINISTRATIVE PROFILE PANEL UI
                    </span>
                    <span className="text-[10px] text-slate-500 font-sans">PRODUCTION SYSTEM SCREENSHOT</span>
                  </div>
                  <div className="relative w-full rounded-lg overflow-hidden border border-slate-800 shadow-2xl">
                    <img
                      src="/docs/admin-profile.png"
                      alt="Administrative Profile Reference UI"
                      className="w-full h-auto object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                </div>

                {/* 1. Administrative ID & Viewport Parameters */}
                <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-xl space-y-4 font-sans font-sans">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2 font-mono">
                    <span className="material-symbols-outlined text-indigo-400 text-base font-sans">badge</span>
                    🎛️ 1. Officer ID Card & Display Settings
                  </h3>
                  
                  <div className="space-y-6 text-xs font-sans text-slate-300">
                    {/* ID Card */}
                    <div id="officer-id-card" className="space-y-2">
                      <strong className="text-white block font-mono text-xs font-mono">1. Officer Identification Card</strong>
                      <p className="text-[11px] text-slate-400 leading-relaxed font-sans">
                        <strong>What It Does:</strong> Renders a digital identity badge displaying officer name, avatar, jurisdiction node, clearance level, and assigned identity token code (e.g. <code>UID-882-BMC-IAS-2026</code>).
                      </p>
                      <p className="text-[11px] text-slate-400 leading-relaxed font-sans">
                        <strong>Why It Is Needed:</strong> Provides immediate visual proof of administrative authority and system access rights.
                      </p>
                      <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg space-y-1 font-mono text-[11px] text-cyan-400">
                        <div>• <code>avatar</code>: Biometric circular image frame with glowing active shadow.</div>
                        <div>• <code>clearanceLevel</code>: Displays authorized rank limits (e.g., Level 4 Clearance).</div>
                        <div>• <code>identityToken</code>: Text block displaying the unique identification string.</div>
                      </div>
                    </div>

                    {/* Display & Operational Parameters */}
                    <div id="display-parameters" className="space-y-2 pt-4 border-t border-slate-800/80 font-sans">
                      <strong className="text-white block font-mono text-xs">2. Display & Operational Parameters</strong>
                      <p className="text-[11px] text-slate-400 leading-relaxed font-sans">
                        <strong>What It Does:</strong> Configures display variables including the default operational viewport (hybrid satellite GIS map, vector topographic map, thermal heatmap), stream log refresh frequency, and glassmorphism canvas toggles.
                      </p>
                      <p className="text-[11px] text-slate-400 leading-relaxed font-sans">
                        <strong>Why It Is Needed:</strong> Optimizes screen rendering speeds and interface layouts to fit varying workspace setups and system network conditions.
                      </p>
                      <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg space-y-1 font-mono text-[11px] text-cyan-400 font-mono">
                        <div>• <code>viewportMode</code>: Configures viewport dropdown choices (hybrid-gis, vector-topo, thermal).</div>
                        <div>• <code>refreshRate</code>: Sets log terminals stream update speeds (500ms, 2000ms, 5000ms).</div>
                        <div>• <code>glassmorphismEnabled</code>: Switches dark mode canvas transparent shadow overlays.</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 2. System Action Controls */}
                <div id="workspace-preferences" className="bg-[#090d16] border border-slate-800 p-5 rounded-xl space-y-4 font-sans">
                  <div className="flex items-center justify-between text-slate-400 border-b border-slate-800 pb-2">
                    <span className="font-bold text-blue-400 flex items-center gap-1.5 font-sans">
                      <span className="material-symbols-outlined text-sm">settings_input_component</span>
                      🔒 2. Preference Execution Actions
                    </span>
                    <span className="text-[10px] bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded border border-emerald-500/20 font-mono font-bold">PREFERENCE ACTIONS</span>
                  </div>

                  <div className="space-y-4 text-xs font-sans text-slate-300">
                    <div className="space-y-1">
                      <strong className="text-white block font-mono">1. APPLY WORKSPACE PREFERENCES</strong>
                      <p className="text-[11px] text-slate-400 leading-relaxed font-sans">
                        <strong>What It Does:</strong> Saves current layout calibrations and triggers the localized interface styling updates.
                      </p>
                      <p className="text-[11px] text-slate-400 leading-relaxed font-sans">
                        <strong>Why It Is Needed:</strong> Commits and applies selected preferences to the active session workspace parameters.
                      </p>
                    </div>
                  </div>
                </div>
              </section>
            )}







            {/* SECTION 3: SCENARIO SANDBOX INTERACTIVE SIMULATOR */}
            {(activeSection === "scenario-sandbox" || activeSection === "api-reference") && (
              <section className="space-y-6">
                <div>
                  <h1 className="text-3xl font-bold text-white tracking-tight font-display mb-2">
                    Hyperlocal Scenario Sandbox (What-If API)
                  </h1>
                </div>
                <div id="live-simulator" className="bg-slate-900/90 border border-slate-800 p-6 rounded-xl space-y-5">
                  <h3 className="text-xs font-mono font-bold text-white uppercase tracking-wider flex items-center gap-2">
                    <span className="material-symbols-outlined text-blue-400 text-base">science</span>
                    Live Interactive API Simulator
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    <div className="space-y-2">
                      <label className="text-xs font-mono text-slate-300 flex justify-between">
                        <span>Traffic Density</span>
                        <span className="text-cyan-400 font-bold">{Math.round(trafficDelta * 100)}%</span>
                      </label>
                      <input
                        type="range"
                        min="-1.0"
                        max="1.0"
                        step="0.05"
                        value={trafficDelta}
                        onChange={(e) => setTrafficDelta(parseFloat(e.target.value))}
                        className="w-full accent-blue-500 cursor-pointer"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-mono text-slate-300 flex justify-between">
                        <span>Industrial Output</span>
                        <span className="text-yellow-400 font-bold">{Math.round(industrialDelta * 100)}%</span>
                      </label>
                      <input
                        type="range"
                        min="-1.0"
                        max="1.0"
                        step="0.05"
                        value={industrialDelta}
                        onChange={(e) => setIndustrialDelta(parseFloat(e.target.value))}
                        className="w-full accent-blue-500 cursor-pointer"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-mono text-slate-300 flex justify-between">
                        <span>Wind Speed</span>
                        <span className="text-emerald-400 font-bold">{windSpeed} m/s</span>
                      </label>
                      <input
                        type="range"
                        min="0.5"
                        max="15.0"
                        step="0.5"
                        value={windSpeed}
                        onChange={(e) => setWindSpeed(parseFloat(e.target.value))}
                        className="w-full accent-blue-500 cursor-pointer"
                      />
                    </div>
                  </div>

                  <button
                    onClick={runSandboxApi}
                    disabled={loading}
                    className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white font-mono text-xs font-bold rounded-lg transition-all flex items-center gap-2 active:scale-95 disabled:opacity-50"
                  >
                    <span className="material-symbols-outlined text-base">{loading ? "hourglass_empty" : "play_arrow"}</span>
                    <span>{loading ? "SIMULATING..." : "EXECUTE POST /api/v1/predict/scenario"}</span>
                  </button>

                  {apiResponse && (
                    <div className="space-y-2 pt-3 border-t border-slate-800">
                      <div className="flex items-center justify-between text-xs font-mono text-slate-400">
                        <span>HTTP 200 OK • Response Payload</span>
                        <span className="text-emerald-400 font-bold">SHA-256 VERIFIED</span>
                      </div>
                      <pre className="p-4 bg-[#090d16] border border-slate-800 rounded-lg text-xs font-mono text-emerald-400 overflow-x-auto">
                        <code>{JSON.stringify(apiResponse, null, 2)}</code>
                      </pre>
                    </div>
                  )}
                </div>

                {/* SANDBOX EXPLANATIONS */}
                <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-xl space-y-6">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2 font-mono">
                    <span className="material-symbols-outlined text-cyan-400 text-base font-sans">tune</span>
                    🎛️ Sandbox Specifications
                  </h3>

                  <div className="space-y-6 text-xs text-slate-300 font-sans">
                    {/* 1. MLOps Control Engine */}
                    <div id="mlops-control" className="space-y-2">
                      <strong className="text-white block font-mono text-xs">1. MLOps Control Engine</strong>
                      <p className="text-[11px] text-slate-400 leading-relaxed font-sans">
                        <strong>What It Does:</strong> Serves as the coordination panel in the model validation dashboard sidebar, showing active model architecture configurations and providing a pipeline execution trigger.
                      </p>
                      <p className="text-[11px] text-slate-400 leading-relaxed font-sans">
                        <strong>Why It Is Needed:</strong> Coordinates training schedules, model types, and hyperparameter optimization sweeps from a single unified view.
                      </p>
                      <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg space-y-1 font-mono text-[11px] text-cyan-400 font-mono">
                        <div>• <code>modelArchitectureSelector</code>: Drops down active ML frameworks (e.g. Random Forest Regressor + XGBoost Ensemble).</div>
                        <div>• <code>optimizeTriggerButton</code>: Interactive CTA initiating hyperparameter search runs.</div>
                      </div>
                      <div className="rounded-lg overflow-hidden border border-slate-800 bg-slate-950 p-2 my-2">
                        <img
                          src="/docs/sandbox-image-2.png"
                          alt="MLOps Control Engine UI"
                          className="max-w-[400px] h-auto object-contain rounded"
                        />
                      </div>
                    </div>

                    {/* 2. Recent Training Runs */}
                    <div id="recent-training" className="space-y-2 pt-4 border-t border-slate-800/80">
                      <strong className="text-white block font-mono text-xs font-mono font-mono">2. Recent Training Runs</strong>
                      <p className="text-[11px] text-slate-400 leading-relaxed font-sans">
                        <strong>What It Does:</strong> Renders a list card of recent model training runs containing their active/archived statuses and convergence descriptions.
                      </p>
                      <p className="text-[11px] text-slate-400 leading-relaxed font-sans">
                        <strong>Why It Is Needed:</strong> Tracks historical training performance to detect overfitting trends or convergence failures and allows rollovers to previous stable runs.
                      </p>
                      <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg space-y-1 font-mono text-[11px] text-cyan-400">
                        <div>• <code>runNumber</code>: Unique sequential run ID (e.g. Run #142).</div>
                        <div>• <code>runStatus</code>: Status badge mapping execution state (ACTIVE, ARCHIVED).</div>
                        <div>• <code>convergenceStatus</code>: Convergence evaluation text (Stable Convergence, Overfitted, Success).</div>
                      </div>
                      <div className="rounded-lg overflow-hidden border border-slate-800 bg-slate-950 p-2 my-2">
                        <img
                          src="/docs/sandbox-image-3.png"
                          alt="Recent Training Runs UI"
                          className="max-w-[400px] h-auto object-contain rounded"
                        />
                      </div>
                    </div>

                    {/* 3. Hyperlocal Scenario Sandbox */}
                    <div id="predictive-policy" className="space-y-2 pt-4 border-t border-slate-800/80">
                      <strong className="text-white block font-mono text-xs">3. Hyperlocal Scenario Sandbox</strong>
                      <p className="text-[11px] text-slate-400 leading-relaxed font-sans">
                        <strong>What It Does:</strong> Renders the central policy simulation dashboard, combining vector controls (traffic density delta sliders, industrial output delta sliders) and a live interactive executor card to query the VayuSense What-If API.
                      </p>
                      <p className="text-[11px] text-slate-400 leading-relaxed font-sans">
                        <strong>Why It Is Needed:</strong> Empowers administrators to preview public health impacts of targeted citywide restrictions (e.g., a 30% traffic reduction) before enacting them.
                      </p>
                      <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg space-y-1 font-mono text-[11px] text-cyan-400">
                        <div>• <code>simulationTrigger</code>: Button that executes the HTTP POST request to <code>/api/v1/predict/scenario</code>.</div>
                        <div>• <code>apiResponseViewer</code>: Live JSON render component displaying predicted AQI, improvements, and compliance grades.</div>
                      </div>
                    </div>

                    {/* 4. Simulation Parameter Matrix */}
                    <div id="sandbox-params" className="space-y-2 pt-4 border-t border-slate-800/80">
                      <strong className="text-white block font-mono text-xs">4. Simulation Parameter Matrix</strong>
                      <p className="text-[11px] text-slate-400 leading-relaxed font-sans">
                        <strong>What It Does:</strong> Formats the input variables for sandbox simulation, such as traffic density delta, industrial stack emissions, and meteorological wind speed.
                      </p>
                      <p className="text-[11px] text-slate-400 leading-relaxed font-sans font-sans">
                        <strong>Why It Is Needed:</strong> Provides structure and bounds for variables to keep policy simulations within realistic scientific limits.
                      </p>
                      <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg space-y-1 font-mono text-[11px] text-cyan-400">
                        <div>• <code>traffic_density_delta</code>: Permitted float range of <code>-1.00</code> to <code>+1.00</code> (-100% to +100%).</div>
                        <div>• <code>industrial_output_delta</code>: Permitted float range of <code>-1.00</code> to <code>+1.00</code> (-100% to +100%).</div>
                        <div>• <code>wind_speed_mps</code>: Permitted float range of <code>0.5</code> to <code>15.0</code> m/s.</div>
                      </div>
                      <div className="rounded-lg overflow-hidden border border-slate-800 bg-slate-950 p-2 my-2">
                        <img
                          src="/docs/sandbox-image-4.png"
                          alt="Simulation Parameter Matrix UI"
                          className="w-full h-auto object-contain rounded"
                        />
                      </div>
                    </div>

                    {/* 5. Simulated AQI Delta Trajectory */}
                    <div id="aqi-delta-trajectory" className="space-y-2 pt-4 border-t border-slate-800/80">
                      <strong className="text-white block font-mono text-xs font-mono">5. Simulated AQI Delta Trajectory</strong>
                      <p className="text-[11px] text-slate-400 leading-relaxed font-sans">
                        <strong>What It Does:</strong> Renders a time-series line chart displaying the predicted AQI pathway under the selected simulation scenario compared to the baseline trajectory.
                      </p>
                      <p className="text-[11px] text-slate-400 leading-relaxed font-sans font-sans">
                        <strong>Why It Is Needed:</strong> Helps decision-makers visualize the timing and duration of improvement trends (e.g., when the municipal zone will return to nominal AQI limits).
                      </p>
                      <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg space-y-1 font-mono text-[11px] text-cyan-400 font-mono font-mono">
                        <div>• <code>baselineTrajectory</code>: Computed timeline plotting forecasted AQI if no policy actions are taken.</div>
                        <div>• <code>simulatedTrajectory</code>: Forecast line showing predicted AQI drop over hours/days under the intervention delta.</div>
                      </div>
                      <div className="rounded-lg overflow-hidden border border-slate-800 bg-slate-950 p-2 my-2">
                        <img
                          src="/docs/sandbox-image-5.png"
                          alt="Simulated AQI Delta Trajectory UI"
                          className="w-full h-auto object-contain rounded"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            )}

            {/* FALLBACK FOR ALL OTHER SECTIONS */}
            {activeSection !== "overview" && activeSection !== "architecture" && activeSection !== "quickstart" && activeSection !== "scenario-sandbox" && activeSection !== "api-reference" && activeSection !== "dynamic-vector-layer" && activeSection !== "satellite-pipeline" && activeSection !== "model-validation" && activeSection !== "model-validation-analytical" && activeSection !== "crewai-topology" && activeSection !== "translation-overrides" && activeSection !== "sha256-exporter" && activeSection !== "command-settings" && activeSection !== "administrative-profile" && (
              <section className="space-y-6">
                <div>
                  <h1 className="text-3xl font-bold text-white tracking-tight font-display mb-2 capitalize">
                    {activeSection.replace("-", " ")}
                  </h1>
                  <p className="text-xs text-slate-400 font-mono">
                    Official Technical Specifications & Developer Guide
                  </p>
                </div>

                <div className="bg-slate-900/60 border border-slate-800 p-6 rounded-xl space-y-4 text-xs font-mono text-slate-300">
                  <p>
                    This documentation page details specifications for <strong>{activeSection}</strong>.
                  </p>
                  <div className="p-4 bg-[#090d16] border border-slate-800 rounded-lg text-cyan-300">
                    <span>Repository File Path:</span><br />
                    <code className="text-emerald-400 font-bold">/documentation/{activeSection}.md</code>
                  </div>
                </div>
              </section>
            )}

          </div>
        </main>

        {/* PANE 3: RIGHT SIDEBAR ("On this page" TOC - Snap Developer Portal Style) */}
        <aside className="w-56 bg-[#0d121d] border-l border-slate-800 hidden xl:flex flex-col shrink-0 p-5 space-y-4 text-xs font-mono">
          <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
            On this page
          </div>

          <nav className="space-y-2 border-l border-slate-800 pl-3">
            {currentToc.map((tocItem) => (
              <a
                key={tocItem.id}
                href={`#${tocItem.id}`}
                className="block text-slate-400 hover:text-white hover:border-l-2 hover:border-blue-400 -ml-3.5 pl-3 py-0.5 transition-all truncate text-[11px]"
              >
                {tocItem.label}
              </a>
            ))}
          </nav>

          <div className="pt-6 border-t border-slate-800/80 space-y-2 text-[10px] text-slate-500">
            <span className="block font-bold text-slate-400">Need Help?</span>
            <a href="https://github.com/suryanmandal/et-ai-hackathon-air-intelligence/issues" target="_blank" rel="noreferrer" className="block hover:text-blue-400 transition-colors">
              Report an Issue ↗
            </a>
            <a href="mailto:support@vayusense.gov.in" className="block hover:text-blue-400 transition-colors">
              Contact Developer Support
            </a>
          </div>
        </aside>

      </div>
    </div>
  );
}
