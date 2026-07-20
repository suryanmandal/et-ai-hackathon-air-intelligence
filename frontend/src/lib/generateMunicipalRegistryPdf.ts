import { getMunicipalCorpsForState, STATES_LIST } from "./municipalData";

export async function generateMunicipalRegistryPdf(stateCode: string = "MH") {
  const jsPDFModule = await import("jspdf");
  const jsPDF = jsPDFModule.default;

  const stateObj = STATES_LIST.find((s) => s.code === stateCode) || STATES_LIST[0];
  const corps = getMunicipalCorpsForState(stateCode);

  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4"
  });

  // Header Banner
  doc.setFillColor(15, 23, 42); // Dark slate
  doc.rect(0, 0, 210, 36, "F");

  doc.setFillColor(16, 185, 129); // Emerald accent
  doc.rect(0, 36, 210, 2.5, "F");

  doc.setTextColor(78, 222, 163);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.text(`${stateObj.name.toUpperCase()} MUNICIPAL CORPORATIONS DIRECTORY`, 14, 15);

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(9);
  doc.text(`STATUTORY REGISTRY OF ALL ${corps.length} MUNICIPAL CORPORATIONS WITH UNIQUE IDENTIFIERS`, 14, 22);

  doc.setFontSize(7.5);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(148, 163, 184);
  doc.text(`ISSUED: ${new Date().toLocaleString()} | TOTAL CORPORATIONS: ${corps.length} | STATE OF ${stateObj.name.toUpperCase()}`, 14, 29);

  // Table Headers
  let y = 46;

  doc.setFillColor(241, 245, 249);
  doc.rect(14, y, 182, 7, "F");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(7.5);
  doc.setTextColor(15, 23, 42);
  doc.text("ID", 16, y + 5);
  doc.text("MUNICIPAL CORPORATION", 34, y + 5);
  doc.text("DISTRICT", 100, y + 5);
  doc.text("GRADE", 132, y + 5);
  doc.text("POPULATION", 152, y + 5);
  doc.text("AQI", 182, y + 5);

  y += 7;

  // Render Rows (Page 1 fits ~25 items, overflow to Page 2)
  doc.setFont("helvetica", "normal");

  corps.forEach((corp, index) => {
    if (y > 270) {
      doc.addPage();
      
      // Page 2 Header
      doc.setFillColor(15, 23, 42);
      doc.rect(0, 0, 210, 15, "F");
      doc.setTextColor(78, 222, 163);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);
      doc.text(`${stateObj.name.toUpperCase()} MUNICIPAL CORPORATIONS DIRECTORY (CONTINUED)`, 14, 10);

      y = 22;

      // Table Header on Page 2
      doc.setFillColor(241, 245, 249);
      doc.rect(14, y, 182, 7, "F");
      doc.setFont("helvetica", "bold");
      doc.setFontSize(7.5);
      doc.setTextColor(15, 23, 42);
      doc.text("ID", 16, y + 5);
      doc.text("MUNICIPAL CORPORATION", 34, y + 5);
      doc.text("DISTRICT", 100, y + 5);
      doc.text("GRADE", 132, y + 5);
      doc.text("POPULATION", 152, y + 5);
      doc.text("AQI", 182, y + 5);

      y += 7;
    }

    // Alternating Row Colors
    if (index % 2 === 1) {
      doc.setFillColor(248, 250, 252);
      doc.rect(14, y, 182, 7.5, "F");
    }

    doc.setFont("courier", "bold");
    doc.setFontSize(7);
    doc.setTextColor(30, 41, 59);
    doc.text(corp.id, 16, y + 5);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(7.5);
    const corpName = corp.shortName.length > 32 ? corp.shortName.substring(0, 30) + "..." : corp.shortName;
    doc.text(corpName, 34, y + 5);

    doc.setFont("helvetica", "normal");
    doc.setTextColor(71, 85, 105);
    doc.text(corp.district, 100, y + 5);

    doc.setFont("helvetica", "bold");
    doc.text(`Class ${corp.classGrade}`, 132, y + 5);

    doc.setFont("helvetica", "normal");
    doc.text(corp.population, 152, y + 5);

    // AQI Status Color Text
    doc.setFont("helvetica", "bold");
    if (corp.aqi > 200) {
      doc.setTextColor(220, 38, 38); // Red
    } else if (corp.aqi > 150) {
      doc.setTextColor(217, 119, 6); // Amber
    } else {
      doc.setTextColor(16, 185, 129); // Green
    }
    doc.text(`${corp.aqi}`, 182, y + 5);

    y += 7.5;
  });

  // Document Footer
  y += 5;
  if (y > 270) {
    doc.addPage();
    y = 20;
  }

  doc.setDrawColor(16, 185, 129);
  doc.setLineWidth(0.6);
  doc.line(14, y, 196, y);

  y += 5;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(15, 23, 42);
  doc.text("AUTHORIZATION SEAL & STATUTORY CERTIFICATION", 14, y);
  
  y += 5;
  doc.setFont("helvetica", "italic");
  doc.setFontSize(7.5);
  doc.setTextColor(100, 116, 139);
  doc.text(`Official Municipal Corporation Registry compiled under state municipal acts for ${stateObj.name}.`, 14, y);

  doc.save(`${stateObj.name.replace(/\\s+/g, "_")}_${corps.length}_Municipal_Corporations_Registry_${Date.now()}.pdf`);
}
