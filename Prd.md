# VayuSense - Product Requirements Document (PRD)

VayuSense is an enterprise-grade GovTech platform designed for the Brihanmumbai Municipal Corporation (BMC) as a Municipal Environmental Monitoring & Automated Regulatory Command Engine. It combines spatial analytics, machine learning forecasts, multi-agent pipelines, and compliance ledger logging into a unified command room interface.

---

## 1. Product Scope

VayuSense provides environmental telemetry supervision, automated source attribution, ML-driven scenario simulations, compliance auditing, and secure administration settings for municipal environmental officers in the Mumbai Metropolitan Region (MMR).

---

## 2. Implemented Route Architecture & Modules

The platform is structured into five core administrative modules, accessed through the unified master layout shell:

### A. Primary Overview Context (`/dashboard/home`)
- **South Mumbai GIS Map Canvas**: A monochrome, vector-traced spatial base map with Uber H3 resolution-8 honeycomb hexagon cells. High-intensity sensor warning clusters (e.g., `MUM_042`) trigger pulsing neon alerts and detailed tooltips.
- **Dynamic Telemetry Layer Selection**: Controls to toggle IoT Sensors, Satellite NO2 gas plumes, and active construction locations.
- **Diagnostic Matrix Panel**:
  - Live pollutant source attribution charts (Industrial vs. Construction vs. Diesel Fleet).
  - 72-Hour Forecast (PM2.5) spline graph featuring red dashed EPA/Statutory air safety limit boundaries.
  - Multi-Agent Reasoning Feed displaying scrolling execution logs of SensorAgent, SourceAttributionAgent, and ComplianceAgent.
- **Dispatch Inspector CTA**: Generates a cryptographically sealed PDF evidence package containing telemetry indices, agent logs, and ledger status.

### B. Geospatial Controls (`/dashboard/geospatial`)
- **Dynamic Vector Layer Engine (`/dashboard/geospatial/vector`)**:
  - Exposes PostgreSQL/PostGIS database spatial query engine logs (e.g., query execution speed, bounding boxes).
  - Configures layer filters for CAAQS sensors, traffic grids, and factory perimeters.
- **Satellite Ingestion Pipeline Sync (`/dashboard/geospatial/satellite`)**:
  - Visualizes Sentinel-5P gas concentration raster heatmaps with active scanning overlays.
  - Controls to manually trigger Sentinel Ingestion pipelines with asynchronous log ticks.

### C. MLOps Center (`/dashboard/ml-ops`)
- **Model Validation Analytics Terminal (`/dashboard/ml-ops/validation`)**:
  - Monospace KPI cards for Predictive Precision (RMSE), R-Squared Accuracy, and Mean Absolute Error (MAE).
  - Interactive XGBoost Ensemble training convergence chart with epoch-based cursor tooltips.
- **Hyperlocal Scenario Sandbox (`/dashboard/ml-ops/sandbox`)**:
  - Real-time simulation inputs for Traffic Gridlock Density, Industrial Emissions, and Wind Velocity.
  - Dynamic mathematical formula models recalculating a 7-node projection curve to preview PM2.5 delta spikes.

### D. Agentic Operations (`/dashboard/agent-logs`)
- **Multi-Agent Network Topology Map (`/dashboard/agent-logs/topology`)**:
  - Renders the node topology flow tracing execution handshakes between the SensorAgent, SourceAttributionAgent, and ComplianceAgent.
  - Tracks live execution terminal status feeds.
- **Regional Language Translation Hub (`/dashboard/agent-logs/translation`)**:
  - Parallel translation engine converting statutory warning logs, notices, and warnings between English, Hindi, and Marathi.
- **Immutable API System Log Exporter (`/dashboard/agent-logs/exporter`)**:
  - Previews IoT telemetry streams and MLOps records.
  - Packages and exports encrypted bundles using SHA-256 signatures and AES payload encryption.

### E. System Settings (`/dashboard/settings`)
- **Command Configuration Panel (`/dashboard/settings`)**:
  - Calibration controls adjusting Critical AQI Breach triggers (Default: 200), PM2.5 ceilings (Default: 150 µg/m³), and sensor drift tolerances.
  - Cryptographic visibility toggles for ESA Copernicus tokens and MPCB secret keys.
  - Automated enforcement policy toggles: Strict Facial Consistency Mode (for AR Field Subsystems), Multi-Agent Compliance Filing, and Translation Cache Bypasses.
- **Administrative Profile (`/dashboard/settings/profile`)**:
  - Displays environment cell officer credentials, clearance ranks, and UID-882-BMC-IAS-2026 tokens.
  - Workspace display selectors setting default operational viewports, data stream refresh frequencies, and glassmorphic overlay opacities.
- **Statutory Compliance Guardrails Override (`/dashboard/agent-logs/override`)**:
  - Secure panel enabling guardrail bypass operations (warning broadcasts, capping restrictions) using administrative code validation (`VAYU-2026`) and blockchain ledger syncs.
