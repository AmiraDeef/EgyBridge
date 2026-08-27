import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

/**
 * Exports a trip plan / offline pack to a beautifully formatted,
 * branded PDF document ready for printing or offline travel reference.
 *
 * @param {Object} pack - The trip plan / offline pack object
 * @param {string} [pack.title] - Trip title
 * @param {number} [pack.duration] - Duration in days
 * @param {number} [pack.budget] - Budget amount in USD
 * @param {string[]} [pack.destinations] - List of destinations (e.g. Cairo, Luxor)
 * @param {Array} [pack.itinerary] - Array of days with activities and places
 * @param {string} [pack.generatedAt] - ISO date string
 * @param {Object} [user] - Optional logged-in user details
 */
export async function exportTripToPdf(pack, user = null) {
  if (!pack) {
    throw new Error("No trip data provided for PDF generation.");
  }

  // Initialize PDF (A4 Portrait, millimeters)
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 16;
  const contentWidth = pageWidth - margin * 2;

  // Brand Palette
  const GOLD = [164, 130, 56];      // #A48238
  const GOLD_DARK = [131, 84, 0];   // #835400
  const INK = [33, 29, 24];         // #211D18
  const SAND = [236, 231, 220];     // #ECE7DC
  const CREAM = [253, 251, 247];    // #FDFBF7
  const MUTED = [120, 115, 105];    // Muted slate

  // -------------------------------------------------------------
  // 1. Header & Brand Banner
  // -------------------------------------------------------------
  // Top gold accent bar
  doc.setFillColor(...GOLD);
  doc.rect(0, 0, pageWidth, 5, "F");

  // Logo insignia / decorative sun emblem
  doc.setFillColor(...GOLD);
  doc.circle(margin + 5, 18, 4, "F");
  doc.setDrawColor(...GOLD_DARK);
  doc.setLineWidth(0.6);
  doc.circle(margin + 5, 18, 6, "S");

  // Brand Wordmark
  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.setTextColor(...INK);
  doc.text("EGI RISES", margin + 14, 18);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  doc.setTextColor(...MUTED);
  doc.text("OFFICIAL TRAVEL ITINERARY & EXPEDITION GUIDE", margin + 14, 23);

  // Right-aligned Document Meta
  const generatedDate = pack.generatedAt
    ? new Date(pack.generatedAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : new Date().toLocaleDateString("en-US");

  doc.setFontSize(8);
  doc.setTextColor(...MUTED);
  doc.text(`Reference: ${pack.tripId ? String(pack.tripId).slice(-8).toUpperCase() : "EGI-" + Date.now().toString().slice(-6)}`, pageWidth - margin, 16, { align: "right" });
  doc.text(`Issued: ${generatedDate}`, pageWidth - margin, 21, { align: "right" });
  if (user?.fullName) {
    doc.text(`Traveler: ${user.fullName}`, pageWidth - margin, 26, { align: "right" });
  }

  // Thin separator
  doc.setDrawColor(...SAND);
  doc.setLineWidth(0.5);
  doc.line(margin, 29, pageWidth - margin, 29);

  // -------------------------------------------------------------
  // 2. Trip Overview Card
  // -------------------------------------------------------------
  const cardY = 33;
  const cardHeight = 32;

  // Background Box
  doc.setFillColor(...CREAM);
  doc.setDrawColor(...GOLD);
  doc.setLineWidth(0.4);
  doc.roundedRect(margin, cardY, contentWidth, cardHeight, 3, 3, "FD");

  // Trip Title
  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);
  doc.setTextColor(...GOLD_DARK);
  const tripTitle = pack.title || "Custom Egypt Itinerary";
  doc.text(tripTitle, margin + 5, cardY + 8);

  // Summary Metrics Grid (Destinations, Duration, Budget, Status)
  const destinationsText = Array.isArray(pack.destinations) && pack.destinations.length > 0
    ? pack.destinations.join(", ")
    : "Egypt Highlights";
  const durationText = `${pack.duration || (pack.itinerary ? pack.itinerary.length : 1)} Days`;
  const budgetText = pack.budget ? `$${pack.budget} USD` : "Flexible";

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  doc.setTextColor(...MUTED);

  // Column 1: Destinations
  doc.text("DESTINATIONS", margin + 5, cardY + 16);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...INK);
  doc.text(destinationsText, margin + 5, cardY + 22, { maxWidth: 65 });

  // Column 2: Duration
  doc.setFont("helvetica", "normal");
  doc.setTextColor(...MUTED);
  doc.text("DURATION", margin + 75, cardY + 16);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...INK);
  doc.text(durationText, margin + 75, cardY + 22);

  // Column 3: Budget
  doc.setFont("helvetica", "normal");
  doc.setTextColor(...MUTED);
  doc.text("ESTIMATED BUDGET", margin + 115, cardY + 16);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...INK);
  doc.text(budgetText, margin + 115, cardY + 22);

  // Column 4: Status
  doc.setFont("helvetica", "normal");
  doc.setTextColor(...MUTED);
  doc.text("STATUS", margin + 155, cardY + 16);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...GOLD);
  doc.text("CONFIRMED", margin + 155, cardY + 22);

  // -------------------------------------------------------------
  // 3. Itinerary Table Generation
  // -------------------------------------------------------------
  const tableRows = [];

  if (Array.isArray(pack.itinerary) && pack.itinerary.length > 0) {
    pack.itinerary.forEach((dayPlan) => {
      const dayNum = `Day ${dayPlan.day}`;
      
      if (Array.isArray(dayPlan.activities) && dayPlan.activities.length > 0) {
        dayPlan.activities.forEach((act, actIdx) => {
          const placeName = act.place?.name || act.title || "Scheduled Exploration";
          const location = act.place?.location ? ` (${act.place.location})` : "";
          const category = act.place?.category ? act.place.category.toUpperCase() : "ACTIVITY";
          const notes = act.notes || act.place?.practicalInfo || "No special notes recorded.";

          tableRows.push([
            actIdx === 0 ? dayNum : "",
            `${placeName}${location}\n[${category}]`,
            notes,
          ]);
        });
      } else {
        tableRows.push([
          dayNum,
          "Explore Regional Highlights",
          "Custom exploration and leisure time.",
        ]);
      }
    });
  } else {
    tableRows.push(["Day 1", "Sightseeing & Arrival", "Initial itinerary setup."]);
  }

  autoTable(doc, {
    startY: cardY + cardHeight + 6,
    head: [["Schedule", "Location & Activity", "Practical Notes & Highlights"]],
    body: tableRows,
    theme: "grid",
    headStyles: {
      fillColor: GOLD,
      textColor: [255, 255, 255],
      fontSize: 9,
      fontStyle: "bold",
      halign: "left",
      cellPadding: 3.5,
    },
    bodyStyles: {
      textColor: INK,
      fontSize: 8.5,
      cellPadding: 3.5,
      valign: "top",
      lineColor: SAND,
      lineWidth: 0.2,
    },
    alternateRowStyles: {
      fillColor: CREAM,
    },
    columnStyles: {
      0: { cellWidth: 24, fontStyle: "bold", textColor: GOLD_DARK },
      1: { cellWidth: 64 },
      2: { cellWidth: "auto" },
    },
    margin: { left: margin, right: margin, bottom: 26 },
    didDrawPage: (data) => {
      // -------------------------------------------------------------
      // 4. Header / Footer for every page
      // -------------------------------------------------------------
      const pageNum = doc.internal.getNumberOfPages();

      // Top running mini-header on page 2+
      if (pageNum > 1) {
        doc.setFontSize(7.5);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(...MUTED);
        doc.text(`EGI RISES — ${tripTitle}`, margin, 10);
        doc.setDrawColor(...SAND);
        doc.setLineWidth(0.3);
        doc.line(margin, 12, pageWidth - margin, 12);
      }

      // Bottom Footer Bar
      doc.setDrawColor(...SAND);
      doc.setLineWidth(0.4);
      doc.line(margin, pageHeight - 16, pageWidth - margin, pageHeight - 16);

      doc.setFontSize(7.5);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(...MUTED);
      doc.text(
        "Emergency: Tourist Police 126 | Ambulance 123 | Police 122 — Powered by Egi Rises Travel Guide",
        margin,
        pageHeight - 11
      );

      // Page numbers: "Page X of Y"
      doc.text(
        `Page ${data.pageNumber}`,
        pageWidth - margin,
        pageHeight - 11,
        { align: "right" }
      );
    },
  });

  // -------------------------------------------------------------
  // 5. Final Emergency / Important Travel Advice Box (if fits)
  // -------------------------------------------------------------
  const finalY = doc.lastAutoTable.finalY + 6;
  if (finalY + 22 < pageHeight - 20) {
    doc.setFillColor(254, 250, 240); // very soft warm highlight
    doc.setDrawColor(...GOLD);
    doc.setLineWidth(0.3);
    doc.roundedRect(margin, finalY, contentWidth, 18, 2, 2, "FD");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.setTextColor(...GOLD_DARK);
    doc.text("ESSENTIAL TRAVEL ADVISORY", margin + 4, finalY + 5);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(7.5);
    doc.setTextColor(...INK);
    doc.text(
      "Keep this document saved offline or printed. Carry valid photo identification at historical venues and monuments.\nFor instant travel assistance and eSIM recharge, visit your Egi Rises dashboard or reach the 24/7 tourist helpline.",
      margin + 4,
      finalY + 10,
      { maxWidth: contentWidth - 8 }
    );
  }

  // -------------------------------------------------------------
  // 6. Save PDF
  // -------------------------------------------------------------
  const sanitizedFilename = (pack.title || "egi-rises-trip-package")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  doc.save(`${sanitizedFilename}.pdf`);
  return true;
}
