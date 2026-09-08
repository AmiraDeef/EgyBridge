import React from "react";
import { Link } from "react-router-dom";
import { Check } from "lucide-react";

const STEPS = [
  { key: "preferences", label: "Preferences", to: "/plan" },
  { key: "dates", label: "Dates", to: "/plan/dates" },
  { key: "places", label: "Places", to: "/plan/places" },
  { key: "itinerary", label: "Itinerary", to: "/plan/review" },
  { key: "offline", label: "Confirmed", to: "/plan/offline" },
];

/**
 * WizardStepper
 * Visual progress stepper for the 5-step trip planning flow matching Figma design.
 */
export default function WizardStepper({ current = "preferences" }) {
  const currentIndex = STEPS.findIndex((s) => s.key === current);
  const activeIdx = currentIndex >= 0 ? currentIndex : 0;

  return (
    <div className="mx-auto flex max-w-lg items-center justify-between px-6 sm:px-10 font-body">
      {STEPS.map((step, i) => {
        const isComplete = i < activeIdx;
        const isCurrent = i === activeIdx;
        return (
          <React.Fragment key={step.key}>
            <div className="flex flex-col items-center gap-1.5">
              <div
                className={[
                  "flex h-7 w-7 items-center justify-center rounded-full border-2 text-xs font-bold transition-all",
                  isComplete
                    ? "border-gold bg-gold text-cream shadow-sm"
                    : isCurrent
                    ? "border-gold bg-gold/15 text-gold-dark font-extrabold scale-110 shadow-sm"
                    : "border-line text-ink/30 bg-cream",
                ].join(" ")}
              >
                {isComplete ? <Check className="h-3.5 w-3.5 stroke-[3]" /> : i + 1}
              </div>
              <span
                className={[
                  "text-[10px] font-bold uppercase tracking-wider",
                  isCurrent ? "text-gold-dark font-extrabold" : isComplete ? "text-ink/75" : "text-ink/40",
                ].join(" ")}
              >
                {step.label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div
                className={`mx-1.5 h-0.5 flex-1 rounded transition-colors ${
                  i < activeIdx ? "bg-gold" : "bg-line/60"
                }`}
              />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}
