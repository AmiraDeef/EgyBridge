import React from "react";
import { X, Download, Route as ItineraryIcon, Bookmark, Info, CheckCircle2, RefreshCw } from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export default function OfflinePackModal({ isOpen, onClose, itinerary }) {
  if (!isOpen) return null;

  const handleDownloadPDF = () => {
    const doc = new jsPDF();

    // العنوان
    doc.setFontSize(18);
    doc.setTextColor(61, 48, 17);
    doc.text(`EGI RISES - ${itinerary?.title || "Trip Plan"}`, 14, 20);

    doc.setFontSize(10);
    doc.setTextColor(120);
    doc.text(`Duration: ${itinerary?.duration || 7} Days | Budget: $${itinerary?.budget || 0}`, 14, 28);
    doc.text(`Destinations: ${(itinerary?.destinations || []).join(", ")}`, 14, 34);

    // استخراج مصفوفة الأيام من الـ DB
    const daysList = itinerary?.itinerary || itinerary?.days || [];

    const tableRows = [];

    daysList.forEach((day, index) => {
      const dayName = `Day ${day.dayNumber || day.day || index + 1}`;
      const cityName = day.city || day.destination || "Egypt";
      const activitiesList = day.activities || day.items || [];

      if (activitiesList.length > 0) {
        activitiesList.forEach((act) => {
          tableRows.push([
            dayName,
            cityName,
            act.time || "Scheduled",
            act.title || act.name || act.activity || "Explore Place",
            act.description || act.details || ""
          ]);
        });
      } else {
        tableRows.push([dayName, cityName, "-", "Explore City", "Free itinerary day"]);
      }
    });

    // رسم الجدول
    autoTable(doc, {
      startY: 40,
      head: [["Day", "City", "Time", "Activity", "Details"]],
      body: tableRows,
      headStyles: { fillColor: [181, 142, 42], textColor: 255, fontStyle: "bold" },
      styles: { fontSize: 8, cellPadding: 4 },
      columnStyles: {
        0: { cellWidth: 20 },
        1: { cellWidth: 25 },
        2: { cellWidth: 25 },
        3: { cellWidth: 45 },
        4: { cellWidth: "auto" }
      },
      alternateRowStyles: { fillColor: [250, 246, 238] }
    });

    doc.save(`${itinerary?.title || "Egypt-Trip"}-Itinerary.pdf`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-md rounded-3xl bg-[#FDFCF8] border border-[#EAE2CE] p-6 shadow-2xl text-[#4A3B18]">
        
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full p-1.5 text-[#8C753D] hover:bg-[#F5F0E1]"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="text-center mb-6">
          <div className="w-12 h-12 bg-[#B58E2A] text-white rounded-2xl mx-auto flex items-center justify-center mb-3 shadow-md">
            <Download className="h-6 w-6" />
          </div>
          <h2 className="text-xl font-extrabold text-[#3D3011] tracking-wide uppercase">
            Offline Pack
          </h2>
          <p className="text-xs font-medium text-[#8C753D]">
            Download your full travel plan as PDF
          </p>
        </div>

        <div className="space-y-3 mb-6">
          <div className="flex items-center justify-between bg-[#FAF6EE] p-3 rounded-xl border border-[#EAE2CE]">
            <div className="flex items-center gap-3">
              <ItineraryIcon className="h-4 w-4 text-[#B58E2A]" />
              <span className="text-xs font-bold text-[#3D3011]">Daily Itinerary</span>
            </div>
            <CheckCircle2 className="h-4 w-4 text-[#B58E2A]" />
          </div>

          <div className="flex items-center justify-between bg-[#FAF6EE] p-3 rounded-xl border border-[#EAE2CE]">
            <div className="flex items-center gap-3">
              <Bookmark className="h-4 w-4 text-[#B58E2A]" />
              <span className="text-xs font-bold text-[#3D3011]">Destinations List</span>
            </div>
            <CheckCircle2 className="h-4 w-4 text-[#B58E2A]" />
          </div>
        </div>

        <button
          onClick={handleDownloadPDF}
          className="w-full bg-[#B58E2A] hover:bg-[#9B771E] text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 shadow-md transition uppercase text-xs tracking-wider cursor-pointer"
        >
          <RefreshCw className="h-4 w-4" />
          <span>Download PDF Now</span>
        </button>

      </div>
    </div>
  );
}