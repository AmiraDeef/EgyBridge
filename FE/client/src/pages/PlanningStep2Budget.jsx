import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, ArrowRight, Check } from "lucide-react";
import SiteNavbar from "../components/layout/SiteNavbar";
import { usePlanningDraft } from "../context/PlanningContext";

const BUDGET_INCLUSIONS = [
  { key: "accommodation", label: "Accommodation" },
  { key: "transportation", label: "Transportation" },
  { key: "activities", label: "Activities & Entertainments" },
  { key: "food_drinks", label: "Food & Drinks" },
  { key: "shopping", label: "Shopping" },
];

export default function PlanningStep2Budget() {
  const navigate = useNavigate();
  const { draft, updateDraft } = usePlanningDraft();

  // استرجاع الميزانية والخيارات الحقيقية المخزنة سابقاً
  const [budget, setBudget] = useState(draft?.budget || 800);
  const [inclusions, setInclusions] = useState(
    draft?.inclusions || [
      "accommodation",
      "transportation",
      "activities",
      "food_drinks",
    ],
  );

  const toggleInclusion = (key) => {
    setInclusions((prev) =>
      prev.includes(key) ? prev.filter((item) => item !== key) : [...prev, key],
    );
  };

  // ✅ حفظ البيانات الحقيقية والانتقال للخطوة الثالثة
  const handleContinue = () => {
    updateDraft("budget", budget);
    updateDraft("inclusions", inclusions);

    // الانتقال لخطوة الوجهات والأماكن
    navigate("/plan/places");
  };

  return (
    <div className="min-h-dvh bg-[#FAF6ED] pb-20 font-sans text-[#2D261E]">
      <SiteNavbar />

      <main className="mx-auto max-w-3xl px-6 py-12 font-sans">
        {/* Navigation Bar */}
        <div className="mb-10 flex items-center justify-between border-b border-[#EADFCB] pb-4 text-sm font-medium text-[#8C7A5E]">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="flex items-center gap-1.5 transition hover:text-[#4A3E2C]"
          >
            <ChevronLeft className="h-5 w-5" /> Back
          </button>
          <span className="font-semibold">Step 2 of 5</span>
        </div>

        {/* Header Title */}
        <div className="mb-12 text-center">
          <h2 className="mb-3 font-sans text-3xl font-bold text-[#3B3021]">
            What's your budget?
          </h2>
          <p className="text-base text-[#73634C]">
            Use the slider to estimate your total spend.
          </p>
        </div>

        {/* Budget Card Container */}
        <div className="mb-10 rounded-3xl border border-[#E8DFC8] bg-[#F7F3EB] p-8 shadow-sm sm:p-12">
          {/* Budget Display Value */}
          <div className="mb-8 text-center">
            <span className="font-serif text-5xl font-bold text-[#3B3021]">
              ${budget.toLocaleString()}
            </span>
          </div>

          {/* Budget Slider Custom Styling */}
          <div className="mb-12 px-4">
            <input
              type="range"
              min={100}
              max={10000}
              step={50}
              value={budget}
              onChange={(e) => setBudget(Number(e.target.value))}
              className="h-3 w-full appearance-none rounded-lg bg-[#E2D8C3] accent-[#7A5B27] cursor-pointer"
            />
            <div className="mt-3 flex items-center justify-between text-sm font-bold text-[#8C7A5E]">
              <span>$100</span>
              <span>$10,000+</span>
            </div>
          </div>

          {/* Budget Inclusions Checklist */}
          <div className="border-t border-[#E8DFC8] pt-6">
            <h4 className="mb-6 text-lg font-bold text-[#3B3021]">
              What does your budget include?
            </h4>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {BUDGET_INCLUSIONS.map(({ key, label }) => {
                const active = inclusions.includes(key);
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => toggleInclusion(key)}
                    className={`flex items-center justify-between rounded-2xl border px-5 py-3.5 transition ${
                      active
                        ? "border-[#B89332] bg-[#FFFDF9] shadow-sm ring-1 ring-[#B89332]"
                        : "border-[#E5DEC9] bg-white hover:border-[#C8B896]"
                    }`}
                  >
                    <span className="text-sm font-bold text-[#3B3021]">
                      {label}
                    </span>
                    <div
                      className={`flex h-5 w-5 items-center justify-center rounded-md border transition ${
                        active
                          ? "border-[#3B3021] bg-[#3B3021] text-white"
                          : "border-[#C8B896]"
                      }`}
                    >
                      {active && (
                        <Check className="h-3.5 w-3.5" strokeWidth={3} />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Continue Button */}
        <div className="flex justify-center">
          <button
            type="button"
            onClick={handleContinue}
            className="flex w-full items-center justify-center gap-3 rounded-2xl bg-[#B89332] py-4 text-sm font-bold uppercase tracking-wider text-white shadow-lg transition hover:bg-[#9E7A26] active:scale-98"
          >
            <span>Continue</span>
            <ArrowRight className="h-5 w-5" />
          </button>
        </div>
      </main>
    </div>
  );
}
