import React from "react";
import { Check } from "lucide-react";

const STEPS = [
  { key: "preferences", label: "Preferences", to: "/plan" },
  { key: "places", label: "Places", to: "/plan/places" },
  { key: "itinerary", label: "Itinerary", to: "/plan/review" },
  { key: "offline", label: "Offline", to: "/plan/offline" },
];

/**
 * WizardStepper
 * A simplified version of the Figma stepper (which names five steps:
 * Preferences/Budget/Destinations/Services/Review). Budget, Destinations,
 * and Services selection are combined into one "Places" step here — see
 * PlanningStep3Places.jsx — so this stepper has four nodes, not five,
 * reflecting what's actually built rather than a step count that doesn't
 * match the real flow.
 */
export default function WizardStepper({ current }) {
  const currentIndex = STEPS.findIndex((s) => s.key === current);

  return (
    <div className="mx-auto flex max-w-md items-center justify-between px-6 sm:px-10">
      {STEPS.map((step, i) => {
        const isComplete = i < currentIndex;
        const isCurrent = i === currentIndex;
        return (
          <React.Fragment key={step.key}>
            <div className="flex flex-col items-center gap-1.5">
              <div
                className={[
                  "flex h-7 w-7 items-center justify-center rounded-full border-2 text-xs font-semibold",
                  isComplete
                    ? "border-gold bg-gold text-cream"
                    : isCurrent
                    ? "border-gold text-gold-dark"
                    : "border-line text-ink/30",
                ].join(" ")}
              >
                {isComplete ? <Check className="h-3.5 w-3.5" /> : i + 1}
              </div>
              <span
                className={[
                  "text-[10px] font-medium uppercase tracking-wide",
                  isCurrent ? "text-ink" : "text-ink/40",
                ].join(" ")}
              >
                {step.label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div className={`mx-1 h-px flex-1 ${i < currentIndex ? "bg-gold" : "bg-line"}`} />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}
