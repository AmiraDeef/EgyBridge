import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  ChevronLeft, 
  ArrowRight, 
  Scale, 
  Armchair, 
  Footprints, 
  Car, 
  Bus, 
  CarFront, 
  Hotel, 
  Home 
} from "lucide-react";
import SiteNavbar from "../components/layout/SiteNavbar";
import { usePlanningDraft } from "../context/PlanningContext";

export default function PlanningStep4Preferences() {
  const navigate = useNavigate();
  const { draft, updateDraft } = usePlanningDraft();

  const [pace, setPace] = useState(draft?.pace || "relaxed");
  const [transport, setTransport] = useState(draft?.transport || "taxi");
  const [accommodation, setAccommodation] = useState(draft?.accommodation || "hotel");

  // ✅ حفظ التفضيلات بشكل صحيح والانتقال لصفحة المراجعة الأخيرة
  const handleContinue = () => {
    updateDraft("pace", pace);
    updateDraft("transport", transport);
    updateDraft("accommodation", accommodation);

    navigate("/plan/review");
  };

  return (
    <div className="min-h-screen bg-[#FAF6ED] font-sans text-[#524312] pb-20">
      <SiteNavbar />

      <main className="mx-auto max-w-3xl px-6 py-6">
        {/* Navigation Bar Top */}
        <div className="mb-8 flex items-center justify-between border-b border-gray-100 pb-4 text-xs font-medium text-[#524312]">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="flex items-center gap-1.5 transition hover:text-[#B89332]"
          >
            <ChevronLeft className="h-4 w-4" /> Back
          </button>
          <span>Step 4 of 5</span>
        </div>

        {/* Title & Subtitle */}
        <div className="mb-10 text-center">
          <h2 className="mb-1.5 text-3xl font-extrabold text-[#1A1A1A]">
            Any preferences?
          </h2>
          <p className="text-xs text-gray-500">
            Help us tailor your trip to your exact needs.
          </p>
        </div>

        <div className="mx-auto max-w-xl space-y-8">
          {/* Section 1: Travel Pace */}
          <div>
            <h3 className="mb-3 border-b border-gray-100 pb-2 text-sm font-bold text-[#1A1A1A]">
              Travel pace
            </h3>
            <div className="grid grid-cols-3 gap-4">
              {[
                { id: "balanced", label: "Balanced", icon: Scale },
                { id: "relaxed", label: "Relaxed", icon: Armchair },
                { id: "active", label: "Active", icon: Footprints },
              ].map((item) => {
                const Icon = item.icon;
                const isSelected = pace === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setPace(item.id)}
                    className={`flex flex-col items-center justify-center rounded-2xl border px-3 py-5 text-xs font-semibold transition-all ${
                      isSelected
                        ? "border-[#524312] bg-[#524312] text-white shadow-md"
                        : "border-gray-300 bg-white text-[#524312] hover:border-[#524312]"
                    }`}
                  >
                    <Icon className={`mb-2 h-5 w-5 ${isSelected ? "text-white" : "text-[#524312]"}`} />
                    <span className={isSelected ? "text-white" : "text-[#524312]"}>{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section 2: Transportation */}
          <div>
            <h3 className="mb-3 border-b border-gray-100 pb-2 text-sm font-bold text-[#1A1A1A]">
              Transportation
            </h3>
            <div className="grid grid-cols-3 gap-4">
              {[
                { id: "taxi", label: "Taxi", icon: Car },
                { id: "public", label: "Public", icon: Bus },
                { id: "private", label: "Private", icon: CarFront },
              ].map((item) => {
                const Icon = item.icon;
                const isSelected = transport === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setTransport(item.id)}
                    className={`flex flex-col items-center justify-center rounded-2xl border px-3 py-5 text-xs font-semibold transition-all ${
                      isSelected
                        ? "border-[#524312] bg-[#524312] text-white shadow-md"
                        : "border-gray-300 bg-white text-[#524312] hover:border-[#524312]"
                    }`}
                  >
                    <Icon className={`mb-2 h-5 w-5 ${isSelected ? "text-white" : "text-[#524312]"}`} />
                    <span className={isSelected ? "text-white" : "text-[#524312]"}>{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section 3: Accommodation */}
          <div>
            <h3 className="mb-3 border-b border-gray-100 pb-2 text-sm font-bold text-[#1A1A1A]">
              Accommodation
            </h3>
            <div className="grid max-w-md grid-cols-2 gap-4">
              {[
                { id: "hotel", label: "Hotel", icon: Hotel },
                { id: "home", label: "Home", icon: Home },
              ].map((item) => {
                const Icon = item.icon;
                const isSelected = accommodation === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setAccommodation(item.id)}
                    className={`flex flex-col items-center justify-center rounded-2xl border px-3 py-5 text-xs font-semibold transition-all ${
                      isSelected
                        ? "border-[#524312] bg-[#524312] text-white shadow-md"
                        : "border-gray-300 bg-white text-[#524312] hover:border-[#524312]"
                    }`}
                  >
                    <Icon className={`mb-2 h-5 w-5 ${isSelected ? "text-white" : "text-[#524312]"}`} />
                    <span className={isSelected ? "text-white" : "text-[#524312]"}>{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Continue Button */}
        <div className="mx-auto mt-14 flex max-w-md justify-center">
          <button
            type="button"
            onClick={handleContinue}
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#B89332] py-3.5 text-xs font-bold uppercase tracking-wider text-white shadow-lg transition hover:bg-[#9E7A26]"
          >
            <span>continue</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </main>
    </div>
  );
}