import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ChevronLeft,
  ArrowRight,
  User,
  Calendar,
  MapPin,
  DollarSign,
  Heart,
  Check,
  Target,
  Armchair,
  Car,
  Loader2,
} from "lucide-react";
import SiteNavbar from "../components/layout/SiteNavbar";
import { usePlanningDraft } from "../context/PlanningContext";
import axiosInstance from "../api/axiosInstance";

export default function PlanningStep5Review() {
  const navigate = useNavigate();
  const { draft } = usePlanningDraft();
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // 📥 جلب البيانات الحقيقية من الـ Context
  const travelerType =
    draft?.travelerType || draft?.traveler || "Solo Traveler";

  const startDate = draft?.dates?.start || draft?.startDate || "10 Sep";
  const endDate = draft?.dates?.end || draft?.endDate || "13 Sep";
  const formattedDates = `${startDate} — ${endDate}`;

  const selectedDestinations =
    draft?.selectedDestinations || draft?.destinations || [];
  const destinationsDisplay = selectedDestinations.length
    ? selectedDestinations
        .map((d) =>
          typeof d === "string" ? d.charAt(0).toUpperCase() + d.slice(1) : d,
        )
        .join(" — ")
    : "Cairo";

  const budget = draft?.budget ? `$${draft.budget.toLocaleString()}` : "$800";
  const interests = draft?.interests ||
    draft?.selectedInterests || ["History", "Culture"];

  const pace = draft?.pace
    ? draft.pace.charAt(0).toUpperCase() + draft.pace.slice(1)
    : "Relaxed";
  const transport = draft?.transport
    ? draft.transport.charAt(0).toUpperCase() + draft.transport.slice(1)
    : "Taxi";
  const accommodation = draft?.accommodation
    ? draft.accommodation.charAt(0).toUpperCase() + draft.accommodation.slice(1)
    : "Hotel";

  const handleCreateItinerary = async () => {
    setLoading(true);
    setErrorMsg("");

    // 1. حساب عدد الأيام (duration)
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end - start);
    const durationDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 3;

    // 2. تجهيز الـ Payload حسب الشروط الدقيقة للـ Backend Validation
    const payload = {
      travelerType,
      dates: { start: startDate, end: endDate },
      duration: durationDays, // 👈 متطلب أساسي للـ Backend
      destinations: selectedDestinations, // 👈 الاسم المطلوب بالـ Backend
      budget: draft?.budget || 800,
      inclusions: draft?.inclusions || [],
      interests,
      pace: draft?.pace || "relaxed",
      transport: draft?.transport || "taxi",
      accommodation: draft?.accommodation || "hotel",
    };

    console.log("Sending Validated Payload:", payload);

    try {
      await axiosInstance.post("trip-plans/generate", payload);
      navigate("/plan/itinerary");
    } catch (error) {
      console.error("Error generating trip plan:", error);
      setErrorMsg("Failed to generate itinerary. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    { name: "Traveler", completed: true },
    { name: "Budget", completed: true },
    { name: "Destinations", completed: true },
    { name: "Preferences", completed: true },
    { name: "Review", current: true },
  ];

  return (
    <div className="min-h-screen bg-[#FAF6ED] font-sans text-[#4A3B18] pb-24">
      <SiteNavbar />

      <main className="mx-auto max-w-4xl px-6 pt-4">
        {/* Navigation Bar */}
        <div className="mb-8 flex items-center justify-between border-b border-[#EAE3D2] pb-3 text-xs font-semibold text-[#A38234]">
          <button
            type="button"
            onClick={() => navigate(-1)}
            disabled={loading}
            className="flex items-center gap-1 transition hover:text-[#524312] disabled:opacity-50"
          >
            <ChevronLeft className="h-4 w-4" /> Back
          </button>
          <span>Step 5 of 5</span>
        </div>

        {/* Stepper Progress Icons */}
        <div className="relative mx-auto mb-10 flex max-w-xl items-center justify-between">
          <div className="absolute top-5 left-6 right-6 -z-0 h-[1px] bg-[#E5DCB9]" />
          {steps.map((step, idx) => (
            <div key={idx} className="z-10 flex flex-col items-center gap-2">
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-full border-2 transition ${
                  step.completed
                    ? "border-[#B28B32] bg-[#FBF8EF] text-[#B28B32]"
                    : step.current
                      ? "border-[#B28B32] bg-white text-[#B28B32]"
                      : "border-gray-200 bg-white text-gray-300"
                }`}
              >
                {step.completed && <Check className="h-4 w-4 stroke-[2.5]" />}
                {step.current && <Target className="h-4 w-4 stroke-[2]" />}
              </div>
              <span className="text-[11px] font-medium text-[#735D2B]">
                {step.name}
              </span>
            </div>
          ))}
        </div>

        {/* Title */}
        <div className="mb-8 text-center">
          <h1 className="mb-2 text-3xl font-black tracking-wide uppercase text-[#3D3011]">
            REVIEW YOUR TRIP
          </h1>
          <p className="text-xs text-[#8C753D]">
            Make sure everything looks right before we create your itinerary.
          </p>
        </div>

        {/* Review Summary Card */}
        <div className="mx-auto mb-8 max-w-xl overflow-hidden rounded-2xl border border-[#EAE2CE] bg-[#FDFCF8] shadow-sm">
          <div className="flex items-center justify-between border-b border-[#EAE2CE] px-5 py-3.5">
            <div className="flex items-center gap-3">
              <User className="h-4 w-4 text-[#A38234]" />
              <span className="text-[11px] font-bold tracking-wider uppercase text-[#665223]">
                TRAVELER
              </span>
            </div>
            <span className="text-sm font-semibold text-[#3D3011]">
              {travelerType}
            </span>
          </div>

          <div className="flex items-center justify-between border-b border-[#EAE2CE] px-5 py-3.5">
            <div className="flex items-center gap-3">
              <Calendar className="h-4 w-4 text-[#A38234]" />
              <span className="text-[11px] font-bold tracking-wider uppercase text-[#665223]">
                DATES
              </span>
            </div>
            <span className="text-sm font-semibold text-[#3D3011]">
              {formattedDates}
            </span>
          </div>

          <div className="flex items-center justify-between border-b border-[#EAE2CE] px-5 py-3.5">
            <div className="flex items-center gap-3">
              <MapPin className="h-4 w-4 text-[#A38234]" />
              <span className="text-[11px] font-bold tracking-wider uppercase text-[#665223]">
                DESTINATIONS
              </span>
            </div>
            <span className="text-sm font-semibold text-[#3D3011]">
              {destinationsDisplay}
            </span>
          </div>

          <div className="flex items-center justify-between border-b border-[#EAE2CE] px-5 py-3.5">
            <div className="flex items-center gap-3">
              <DollarSign className="h-4 w-4 text-[#A38234]" />
              <span className="text-[11px] font-bold tracking-wider uppercase text-[#665223]">
                BUDGET
              </span>
            </div>
            <span className="text-sm font-semibold text-[#3D3011]">
              {budget}
            </span>
          </div>

          <div className="flex items-center justify-between border-b border-[#EAE2CE] px-5 py-3.5">
            <div className="flex items-center gap-3">
              <Armchair className="h-4 w-4 text-[#A38234]" />
              <span className="text-[11px] font-bold tracking-wider uppercase text-[#665223]">
                PACE
              </span>
            </div>
            <span className="text-sm font-semibold text-[#3D3011]">{pace}</span>
          </div>

          <div className="flex items-center justify-between border-b border-[#EAE2CE] px-5 py-3.5">
            <div className="flex items-center gap-3">
              <Car className="h-4 w-4 text-[#A38234]" />
              <span className="text-[11px] font-bold tracking-wider uppercase text-[#665223]">
                TRANSPORT & STAY
              </span>
            </div>
            <span className="text-sm font-semibold text-[#3D3011]">
              {transport} • {accommodation}
            </span>
          </div>

          <div className="flex items-center justify-between px-5 py-3.5">
            <div className="flex items-center gap-3">
              <Heart className="h-4 w-4 text-[#A38234]" />
              <span className="text-[11px] font-bold tracking-wider uppercase text-[#665223]">
                INTERESTS
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-1.5">
              {interests.map((tag, idx) => (
                <span
                  key={idx}
                  className="rounded-md border border-[#E2D6B5] bg-[#F7F2E4] px-2.5 py-1 text-[10px] font-semibold text-[#524312]"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        {errorMsg && (
          <div className="mx-auto mb-4 max-w-md rounded-xl bg-red-50 p-3 text-center text-xs font-semibold text-red-600 border border-red-200">
            {errorMsg}
          </div>
        )}

        {/* Submit Button */}
        <div className="mx-auto max-w-md">
          <button
            type="button"
            onClick={handleCreateItinerary}
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#B58E2A] py-3.5 px-6 text-xs font-bold uppercase tracking-widest text-white shadow-md transition hover:bg-[#9B771E] disabled:opacity-60"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Generating Itinerary (~15s)...</span>
              </>
            ) : (
              <>
                <span>CREATE MY ITINERARY</span>
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>
        </div>
      </main>
    </div>
  );
}
