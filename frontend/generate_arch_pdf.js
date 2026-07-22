const { jsPDF } = require("jspdf");
const fs = require("fs");
const path = require("path");

const doc = new jsPDF({
  orientation: "portrait",
  unit: "mm",
  format: "a4"
});

// Theme Colors (Glassmorphic Midnight Palette)
const BG_DARK = "#0f172a";      // Slate 950
const CARD_BG = "#1e293b";      // Slate 800
const PRIMARY = "#10b981";      // Neon Emerald Green
const TEXT_LIGHT = "#f1f5f9";   // Light Slate
const TEXT_MUTED = "#94a3b8";   // Muted Slate
const ACCENT = "#06b6d4";       // Deep Cyan
const PURPLE = "#a855f7";       // Electric Purple

// Helper: Set background color for the page
function setPageBackground(doc, hexColor) {
  doc.setFillColor(hexColor);
  doc.rect(0, 0, 210, 297, "F");
}

// ----------------------------------------------------
// PAGE 1: TITLE & COVER PAGE
// ----------------------------------------------------
setPageBackground(doc, BG_DARK);

// Neon Accent Top Line
doc.setFillColor(PRIMARY);
doc.rect(0, 0, 210, 6, "F");

// Header Title
doc.setFont("helvetica", "bold");
doc.setFontSize(28);
doc.setTextColor(PRIMARY);
doc.text("VAYUSENSE", 20, 50);

doc.setFontSize(14);
doc.setTextColor(TEXT_LIGHT);
doc.text("Autonomous Environmental Command Infrastructure", 20, 60);

// Divider Line
doc.setDrawColor("#334155");
doc.setLineWidth(0.5);
doc.line(20, 70, 190, 70);

// Meta details box
doc.setFillColor(CARD_BG);
doc.rect(20, 85, 170, 65, "F");
doc.setDrawColor("#475569");
doc.rect(20, 85, 170, 65, "D");

doc.setFont("helvetica", "bold");
doc.setFontSize(10);
doc.setTextColor(PRIMARY);
doc.text("SYSTEM METADATA:", 26, 95);

doc.setFont("helvetica", "normal");
doc.setTextColor(TEXT_LIGHT);
doc.text("Project Title:", 26, 105);
doc.text("Architecture Version:", 26, 113);
doc.text("Target Municipalities:", 26, 121);
doc.text("Ingestion Feasibility:", 26, 129);
doc.text("Release Date:", 26, 137);

doc.setFont("helvetica", "bold");
doc.text("VayuSense (Command Tier 4 Platform)", 75, 105);
doc.text("v1.2.0 (Stable Production Build)", 75, 113);
doc.text("277 Corporations across all 28 States + Delhi UT", 75, 121);
doc.text("Real-time Ingestion (PM2.5, PM10, SO2, NO2, O3, CO, NH3)", 75, 129);
doc.text(new Date().toLocaleDateString(), 75, 137);

// Content Description
doc.setFont("helvetica", "normal");
doc.setFontSize(11);
doc.setTextColor(TEXT_MUTED);
doc.text("VayuSense utilizes a multi-cloud production architecture incorporating", 20, 175);
doc.text("Server-Sent Events (SSE) telemetry data, ESA satellite plumes,", 20, 182);
doc.text("and autonomous CrewAI agentic command workflows to dynamically identify", 20, 189);
doc.text("and issue statutory compliance enforcement orders across dense Indian cities.", 20, 196);

// Signature area
doc.setFillColor(CARD_BG);
doc.rect(20, 220, 170, 35, "F");
doc.setDrawColor(PRIMARY);
doc.rect(20, 220, 170, 35, "D");

doc.setFont("helvetica", "bold");
doc.setFontSize(9);
doc.setTextColor(PRIMARY);
doc.text("AUTHORIZATION SYSTEM SEAL:", 26, 230);
doc.setFont("helvetica", "italic");
doc.setTextColor(TEXT_LIGHT);
doc.text("Dr. Abhijit K. Bhosale, IAS -- Municipal Command Director", 26, 240);
doc.setFontSize(8);
doc.setTextColor(TEXT_MUTED);
doc.text("Digitally verified with SHA-256 statutory log audit system.", 26, 247);

// ----------------------------------------------------
// PAGE 2: GRAPHICAL BLUEPRINT DIAGRAM
// ----------------------------------------------------
doc.addPage();
setPageBackground(doc, BG_DARK);

// Neon Accent Top Line
doc.setFillColor(PRIMARY);
doc.rect(0, 0, 210, 6, "F");

doc.setFont("helvetica", "bold");
doc.setFontSize(16);
doc.setTextColor(PRIMARY);
doc.text("SYSTEM ARCHITECTURE BLUEPRINT", 20, 22);

// Draw Blueprint Flow Boxes
// --- Block 1: Client Side
doc.setFillColor(CARD_BG);
doc.setDrawColor(ACCENT);
doc.rect(15, 40, 75, 60, "F");
doc.rect(15, 40, 75, 60, "D");
doc.setFont("helvetica", "bold");
doc.setFontSize(10);
doc.setTextColor(ACCENT);
doc.text("1. CLIENT VIEWPORT (Vercel)", 20, 48);
doc.setFont("helvetica", "normal");
doc.setTextColor(TEXT_LIGHT);
doc.setFontSize(8);
doc.text("- Next.js 14 App Router UI", 20, 56);
doc.text("- Mapbox GL JS Vector Engine", 20, 64);
doc.text("- jsPDF Exporter (Statutory PDF)", 20, 72);
doc.text("- Developer Docs & Sandbox", 20, 80);

// --- Block 2: Ingestion Sources
doc.setFillColor(CARD_BG);
doc.setDrawColor("#eab308"); // Yellow
doc.rect(115, 40, 75, 60, "F");
doc.rect(115, 40, 75, 60, "D");
doc.setFont("helvetica", "bold");
doc.setTextColor("#eab308");
doc.text("2. INGESTION DATA SOURCES", 120, 48);
doc.setFont("helvetica", "normal");
doc.setTextColor(TEXT_LIGHT);
doc.setFontSize(8);
doc.text("- OpenAQ (CAAQMS Stations)", 120, 56);
doc.text("- Open-Meteo Air Quality API", 120, 64);
doc.text("- Copernicus CDSE Sentinel-5P", 120, 72);
doc.text("- Live SSE Telemetry Streams", 120, 80);

// --- Block 3: API Backend
doc.setFillColor(CARD_BG);
doc.setDrawColor(PURPLE);
doc.rect(15, 130, 75, 60, "F");
doc.rect(15, 130, 75, 60, "D");
doc.setFont("helvetica", "bold");
doc.setTextColor(PURPLE);
doc.text("3. ORCHESTRATION BACKEND (Render)", 18, 138);
doc.setFont("helvetica", "normal");
doc.setTextColor(TEXT_LIGHT);
doc.setFontSize(8);
doc.text("- FastAPI Web Service (Python)", 20, 146);
doc.text("- CrewAI Multi-Agent Topology", 20, 154);
doc.text("- XGBoost + Random Forest models", 20, 162);
doc.text("- Scenario Predictive Inference", 20, 170);

// --- Block 4: Database Layer
doc.setFillColor(CARD_BG);
doc.setDrawColor(PRIMARY);
doc.rect(115, 130, 75, 60, "F");
doc.rect(115, 130, 75, 60, "D");
doc.setFont("helvetica", "bold");
doc.setTextColor(PRIMARY);
doc.text("4. SPATIAL DATABASE TIER", 120, 138);
doc.setFont("helvetica", "normal");
doc.setTextColor(TEXT_LIGHT);
doc.setFontSize(8);
doc.text("- PostgreSQL 15 Engine", 120, 146);
doc.text("- PostGIS Spatial Extensions", 120, 154);
doc.text("- H3 Spatial Resolution 8 Indexes", 120, 162);
doc.text("- Cryptographic Log Audit Tables", 120, 170);

// Draw Connection Lines and Arrows
doc.setDrawColor("#475569");
doc.setLineWidth(1);

// Line 1: Ingestion Sources to Client UI
doc.line(115, 70, 90, 70); 
doc.line(90, 70, 90, 68); // arrow indicator

// Line 2: Client UI to Backend
doc.line(52, 100, 52, 130);

// Line 3: Backend to Database
doc.line(90, 160, 115, 160);

// Title under blueprint
doc.setFont("helvetica", "bold");
doc.setFontSize(11);
doc.setTextColor(TEXT_LIGHT);
doc.text("FIGURE 2.0: VAYUSENSE INTER-LAYER COMMUNICATION TOPOLOGY", 20, 220);

doc.setFont("helvetica", "normal");
doc.setFontSize(9);
doc.setTextColor(TEXT_MUTED);
doc.text("• The client triggers scenario projections via REST POST payloads to the Render endpoint.", 20, 232);
doc.text("• CrewAI agents query PostGIS database indexes to cross-reference coordinates and emit blameworthiness.", 20, 239);
doc.text("• Live telemetry streams continuously bypass the database via Server-Sent Events (SSE) loops.", 20, 246);

// ----------------------------------------------------
// PAGE 3: TECHNICAL SPECIFICATION MATRIX
// ----------------------------------------------------
doc.addPage();
setPageBackground(doc, BG_DARK);

// Neon Accent Top Line
doc.setFillColor(PRIMARY);
doc.rect(0, 0, 210, 6, "F");

doc.setFont("helvetica", "bold");
doc.setFontSize(16);
doc.setTextColor(PRIMARY);
doc.text("COMPONENT CONFIGURATION MATRIX", 20, 22);

// Table Header
doc.setFillColor(CARD_BG);
doc.rect(20, 35, 170, 8, "F");
doc.setFont("helvetica", "bold");
doc.setFontSize(9);
doc.setTextColor(PRIMARY);
doc.text("SERVICE LAYER", 24, 40);
doc.text("DEPLOYMENT HOST / ENGINE", 75, 40);
doc.text("URL DIRECTORY REFERENCE", 130, 40);

// Divider
doc.setDrawColor("#334155");
doc.line(20, 43, 190, 43);

// Table Body Rows
doc.setFont("helvetica", "normal");
doc.setTextColor(TEXT_LIGHT);

// Row 1
doc.text("Frontend App", 24, 52);
doc.text("Vercel Serverless Hosting", 75, 52);
doc.setFont("courier", "bold");
doc.setTextColor(ACCENT);
doc.text("vayusense-nu.vercel.app", 130, 52);

// Row 2
doc.setFont("helvetica", "normal");
doc.setTextColor(TEXT_LIGHT);
doc.text("AI Inference Server", 24, 62);
doc.text("Render Python Web Service", 75, 62);
doc.setFont("courier", "bold");
doc.setTextColor(ACCENT);
doc.text("vayusense-backend.onrender.com", 130, 62);

// Row 3
doc.setFont("helvetica", "normal");
doc.setTextColor(TEXT_LIGHT);
doc.text("Interactive Docs", 24, 72);
doc.text("FastAPI OpenAPI Autogen", 75, 72);
doc.setFont("courier", "bold");
doc.setTextColor(ACCENT);
doc.text("...backend.onrender.com/docs", 130, 72);

// Row 4
doc.setFont("helvetica", "normal");
doc.setTextColor(TEXT_LIGHT);
doc.text("Database Engine", 24, 82);
doc.text("Supabase / Neon Cloud Postgres", 75, 82);
doc.setFont("courier", "bold");
doc.setTextColor(ACCENT);
doc.text("db.supabase.co:5432", 130, 82);

// Row 5
doc.setFont("helvetica", "normal");
doc.setTextColor(TEXT_LIGHT);
doc.text("Developer Portal", 24, 92);
doc.text("Next.js Static Component", 75, 92);
doc.setFont("courier", "bold");
doc.setTextColor(ACCENT);
doc.text("...nu.vercel.app/dashboard/docs", 130, 92);

// Dynamic Parameters
doc.setFont("helvetica", "bold");
doc.setFontSize(11);
doc.setTextColor(PRIMARY);
doc.text("ACTIVE EMISSION FACTOR MATRIX SPECIFICATIONS:", 20, 120);

// Card 1
doc.setFillColor(CARD_BG);
doc.rect(20, 130, 170, 38, "F");
doc.setDrawColor("#475569");
doc.rect(20, 130, 170, 38, "D");

doc.setFont("helvetica", "bold");
doc.setFontSize(9);
doc.setTextColor("#eab308"); // Yellow
doc.text("▲ INDUSTRIAL & POWER GENERATION (50% WEIGHT)", 25, 139);
doc.setFont("helvetica", "normal");
doc.setTextColor(TEXT_LIGHT);
doc.setFontSize(8);
doc.text("• Target Pollutants: Sulphur Dioxide (SO2), Nitrogen Oxides (NOx), Fine Particulates (PM2.5), Lead (Pb).", 25, 147);
doc.text("• Visual Accent: Yellow solid triangles mapped over designated municipal factory grid cells.", 25, 155);
doc.text("• Compliance Trigger: Automatic show-cause PDF notice dispatch to plant inspector desk on AQI > 200.", 25, 163);

// Card 2
doc.setFillColor(CARD_BG);
doc.rect(20, 178, 170, 38, "F");
doc.rect(20, 178, 170, 38, "D");

doc.setFont("helvetica", "bold");
doc.setTextColor(ACCENT);
doc.text("● VEHICULAR & TRANSPORTATION EXHAUST (30% WEIGHT)", 25, 187);
doc.setFont("helvetica", "normal");
doc.setTextColor(TEXT_LIGHT);
doc.setFontSize(8);
doc.text("• Target Pollutants: Nitrogen Dioxide (NO2), Black Carbon carbon particulates.", 25, 195);
doc.text("• Visual Accent: Cyan circle-line corridors highlighting high-density highway and street grid patterns.", 25, 203);
doc.text("• Compliance Trigger: Direct recommendations to reroute logistics diesel fleets via automated dispatches.", 25, 211);

// Card 3
doc.setFillColor(CARD_BG);
doc.rect(20, 226, 170, 38, "F");
doc.rect(20, 226, 170, 38, "D");

doc.setFont("helvetica", "bold");
doc.setTextColor(PURPLE);
doc.text("■ CONSTRUCTION & DEPOSITION DUST (20% WEIGHT)", 25, 235);
doc.setFont("helvetica", "normal");
doc.setTextColor(TEXT_LIGHT);
doc.setFontSize(8);
doc.text("• Target Pollutants: Particulate Matter 10 (PM10 Silt Dust).", 25, 243);
doc.text("• Visual Accent: Purple square boundaries isolated around active demolition and development zones.", 25, 251);
doc.text("• Compliance Trigger: Mandatory deployment of water-fogging tankers and dry silt sweeping trucks.", 25, 259);

// Output the PDF to a file
const pdfPath = path.join(__dirname, "public", "VayuSense_Architecture_Blueprint.pdf");
fs.writeFileSync(pdfPath, Buffer.from(doc.output("arraybuffer")));
console.log("PDF created successfully at:", pdfPath);
