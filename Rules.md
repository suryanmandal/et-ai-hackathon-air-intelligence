# System Constraints, Coding Rules & Guardrails

## 1. Platform Boundaries & Standards
*   **Geospatial Standards:** All GIS polygons, boundary outlines, and emission factor corridors must adhere strictly to WGS84 GeoJSON specifications (`[longitude, latitude]`).
*   **Municipal Data Integrity:** Every state and municipal corporation must maintain unique identifiers (e.g., `MH-MC-01` to `MH-MC-29`, `UP-MC-01` to `UP-MC-17`), complete center coordinates, district mapping, class grades, population estimates, and HQ addresses.
*   **Color & Shape Consistency Standard:**
    - **Industrial & Power Generation (50%):** Vibrant Bright Yellow (`#eab308` / `bg-yellow-400`) ▲ Triangle Polygon.
    - **Transportation & Vehicular Exhaust (30%):** Cyan (`#06b6d4` / `bg-cyan-400`) ● Circle Line Corridor.
    - **Construction Dust (20%):** Purple (`#a855f7` / `bg-purple-400`) ■ Square Grid Polygon.
    - **Sentinel-5P Satellite Plume:** Electric Indigo (`#6366f1` / `bg-indigo-500`) with pulsing `📡` badge.
*   **Security Protocol:** All administrative overrides, statutory compliance dispatches, and audit trail outputs must compute SHA-256 hashes prior to storage or export.

## 2. Developer & AI Coding Rules
*   **Build Integrity:** Every modification must pass full `npm run build` static type-checking and route compilation with 0 errors.
*   **Collapsible UI Rule:** Floating map control panels must remain collapsible via hamburger accordion toggles to ensure unhindered GIS viewing on large displays.
*   **Environment Variable Protocol:** All private API keys and dynamic backend host URLs must be loaded through environment variables. **Never hardcode raw secrets or local API URLs (e.g. localhost/127.0.0.1) in production source files.**
*   **Interactive Modal Dismissals:** All dropdowns, popover selectors, and navigation nodes must implement reference-based close listeners on click events occurring outside the boundaries (`mousedown` / `handleClickOutside`).
*   **PDF Priority Directive**: All system export formats must default to beautiful, high-fidelity PDF documents generated via coordinate vector rendering, including dynamic IAS officer clearance signatures.
*   **State Language Mappings**: Secondary translation panels must default to local regional state dialects (e.g., Bihar $\rightarrow$ Bhojpuri, UP $\rightarrow$ Awadhi, Bengal $\rightarrow$ Bengali) with optional dropdown overrides.
