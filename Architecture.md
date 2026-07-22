# System Architecture & Technical Specifications

## 1. Core Tech Stack
*   **Frontend Framework:** Next.js 14 App Router (React.js) using glassmorphic dark-theme UI.
*   **Data Models & State Context:** `MunicipalContext` handling state switching across all 28 Indian States (276 Municipal Corporations) + Delhi UT (MCD) with multi-vertex organic boundary generation.
*   **GIS Graphic Engines:** Mapbox GL JS for interactive map tile rendering, GeoJSON polygon overlays for emission factor source attribution, and dotted/dashed coastline boundary outlines.
*   **AI Orchestration Framework:** Multi-agent autonomous workflow engine tracking sensor calibration, stack emission dispersion, and compliance dispatch triggers.
*   **API & PDF Services:** Dynamic `jsPDF` vector coordinate layout compiler generating official signed Municipal Environmental Dispatch Reports, Satellite Plume Ingestion Records, and Cryptographic Log Exports.
*   **Production Hosting Infrastructure:** 
    - **Frontend:** Vercel serverless deployment (`https://vayusense-nu.vercel.app`)
    - **Backend:** FastAPI + CrewAI hosted on Render (`https://vayusense-backend.onrender.com`)
    - **Database:** PostgreSQL 15+ with PostGIS extension enabled (Render DB / Supabase)

## 2. App Flow Pipeline
1. State/Corp Selection ➔ 2. `MunicipalContext` Provider Dispatch ➔ 3. Mapbox Viewport & Dotted Boundary Sync ➔ 4. Live SSE Telemetry Ingestion.
5. 3 Major Emission Factors Overlays (Yellow ▲ Industrial, Cyan ● Vehicular, Purple ■ Construction) ➔ 6. Critical Breach Trigger ➔ 7. Cryptographic Logging Middleware (SHA-256) ➔ 8. Statutory PDF Dispatch Generation & Ingress Auto-downloads.

## 3. Core Folder & File Structure
```text
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── api/
│   │   │   │   ├── telemetry/stream/
│   │   │   │   └── audit/export/
│   │   │   ├── dashboard/
│   │   │   │   ├── home/           # Primary Command Overview & Collapsible Hamburger Map
│   │   │   │   ├── docs/           # Developer & API Hub Portal
│   │   │   │   ├── geospatial/     # Satellite & Vector PostGIS Layers with PDF Exporters
│   │   │   │   ├── ml-ops/         # ML Convergence & Sandbox
│   │   │   │   ├── agent-logs/     # Multi-Agent Topology & Log Exporter (PDF default)
│   │   │   │   └── settings/       # Profile Deck & Administrative Configuration
│   │   │   └── layout.tsx          # Global Master Shell Header, clickable logo, popovers
│   │   ├── context/
│   │   │   └── MunicipalContext.tsx # Pan-India Municipal State Management
│   │   ├── lib/
│   │   │   ├── municipalData.ts    # Complete 277 Corporations Dataset (28 States + Delhi)
│   │   │   └── generateMunicipalRegistryPdf.ts # Statutory PDF Registry Generator
│   │   └── components/             # Reusable UI Glassmorphic Cards & Widgets
├── backend/                        # FastAPI & CrewAI Python Microservices
```
