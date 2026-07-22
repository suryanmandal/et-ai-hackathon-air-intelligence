# Visual Interface Design Specifications

## 1. Primary Colors & UI Theme (Glassmorphic Dark Variant)
*   **Application Base Background:** Slate-950 (`#0f172a`)
*   **Component Panel Containers:** Slate-900 with alpha opacity blur values (`bg-slate-900/90 backdrop-blur-md`)
*   **Utility Outlines & Structural Dividers:** Sharp Slate-800 borders (`border-slate-800`)
*   **Active Telemetry Metric Accents:** Neon Emerald Green (`#10b981`)
*   **Cryptographic & Trace Code Accents:** Deep Cyan Monospace Monochromatic variables (`#22d3ee`)

## 2. Emission Factor Color & Shape System
*   **Industrial & Power Generation (~50%):** Bright Yellow (`#eab308` / `bg-yellow-400` / `text-yellow-400`) ▲ Triangle Polygon.
*   **Transportation & Vehicular Exhaust (~30%):** Cyan (`#06b6d4` / `bg-cyan-400` / `text-cyan-400`) ● Circle Line Corridor.
*   **Construction Dust (~20%):** Purple (`#a855f7` / `bg-purple-400` / `text-purple-400`) ■ Square Grid Polygon.
*   **Sentinel-5P Satellite Plume:** Electric Indigo (`#6366f1` / `bg-indigo-500` / `text-indigo-400`) with `📡` pulsing badge.

## 3. Map Control & Accordion Components
*   **Header Bar:** Dark Slate-950 (`bg-slate-950/70`) with hover feedback, material symbols `menu` / `menu_open`, and accordion expansion arrows.
*   **Boundary Outlines:** Dotted outer glow with dashed stroke matching AQI hazard status (Red `#ef4444`, Amber `#f59e0b`, Green `#10b981`).

## 4. Topology Visual & Interactive Radar Animations
*   **Breathing Node Indicators:** SVG circles showing agents are active (`animate-pulse shadow-glow`).
*   **Radar Sweep Effects:** Rotating vector graphics centering on active agents, mimicking high-tech command sweeps.
*   **Dotted Flow Connection Lines:** Animated SVG path flows connecting topology maps to demonstrate active token handoffs.

## 5. Header Dropdown & Glassmorphic Popovers
*   **Unread Notification Badging:** Pulsing red circle (`w-2 h-2 bg-red-500 rounded-full border border-slate-950 animate-pulse`).
*   **Popover Menus:** Dark high-contrast panels with custom shadows (`shadow-2xl border-slate-850 rounded-xl bg-slate-900/95`).

## 6. Typography & Fonts
*   **Interface Header Elements:** Clean, highly readable sans-serif layout titles with tight tracking (`tracking-tight font-bold text-slate-100`).
*   **Data Ledger Matrix Tables & Transaction Logs:** Strict monospace structural formatting (`font-mono text-xs tracking-wider`).
*   **Developer Sandbox Layout:** Left-to-right split screen featuring a slider control panel on the left and an execution response inspector card on the right.
