# Project Memory Log & Active Development Focus

## 1. System Constants & Established Assets
*   **Active Platform Profile Mock Input:** Dr. Abhijit K. Bhosale, IAS, Director at Brihanmumbai Municipal Corporation (BMC), Environment & Disaster Management Cell.
*   **Calibrated Operational Parameters:** Default Critical AQI Breach Threshold: `200`; Max Allowed PM2.5 Ceiling Value: `150 μg/m³`; AR Field Subsystems Target: `Strict Facial Consistency Mode: ON`.
*   **Pan-India Municipal Coverage:** 277 Municipal Corporations fully configured across all 28 Indian States & Delhi UT in `frontend/src/lib/municipalData.ts`.
*   **3 Major Emission Factors:**
    1. Industrial Emissions & Power (~50%): Yellow ▲ Triangle Zone ($\text{SO}_2, \text{NO}_x, \text{PM}_{2.5}, \text{Pb}$)
    2. Transportation & Vehicular Exhaust (~30%): Cyan ● Circle Corridor ($\text{NO}_2$, Black Carbon)
    3. Construction & Dust (~20%): Purple ■ Square Grid ($\text{PM}_{10}$)
*   **Pollutant Ingestion Feasibility Matrix:**
    - PM2.5, PM10, SO2, NO2, O3, CO, NH3: Fully connected and ingesting live telemetry streams from Open-Meteo & OpenAQ APIs using API key.
    - Pb (Lead): Handled via 24-hr manual lab filter analysis (non-real-time).

## 2. Recent Architectural Achievements
*   Completed collapsible hamburger accordion menu for floating map control panel in `frontend/src/app/dashboard/home/page.tsx`.
*   Synchronized `geospatial/satellite/page.tsx` with `useMunicipal()` for real-time organic city boundary glow outlines.
*   Built dynamic statutory Municipal Corporation Registry PDF generator for all 28 states and Delhi UT.
*   Built visual Municipal Environmental Dispatch Evidence PDF generator with chemical formula callouts and shape markers.
*   Implemented **PDF Default Target format** for all cryptographic log dispatches to download on progress completion.
*   Overhauled the **Translation Console** with regional Indian dialects (Awadhi, Bhojpuri, Maithili, Odia, Rajasthani, Assamese, Manipuri) and state-focused default auto-selectors.
*   Added interactive header control mechanisms, including a clickable VayuSense logo, active **Notification Bell Popover**, and **User Profile Badge**.
*   Refactored agent topology pages to prevent overlaps and integrate spinning radar grids.
*   Verified production build stability with `npm run build` passing 25 routes with **0 errors** and pushed directly to main branch.
