import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CreditCard, ArrowRight } from "lucide-react";
import { FlowTopBar, StepHeader } from "../components/layout/FlowTopBar";

/**
 * SIM plan data is static/hardcoded for now — there's no SIM-plan model or
 * endpoint in the backend yet (the schema review earlier covered Trips,
 * Places, Bookings, Reviews, TripPlan, EmergencyIncident, ExternalService —
 * SIM/eSIM plans were never part of that scope). Wiring this to a real API
 * is a follow-up once that model exists; the UI below is built so swapping
 * this array for `useApi(getSimPlans)` later is a one-line change.
 */
const SIM_PLANS = [
  { id: "1gb", data: "1 GB", validityDays: 7, price: 7 },
  { id: "2gb", data: "2 GB", validityDays: 15, price: 11 },
  { id: "3gb", data: "3 GB", validityDays: 30, price: 17 },
  { id: "5gb", data: "5 GB", validityDays: 30, price: 25 },
];

export default function SimPlans() {
  const navigate = useNavigate();
  const [selectedPlan, setSelectedPlan] = useState(null);

  return (
    <div className="min-h-screen bg-cream font-body">
      <FlowTopBar badge="SIM" />
      <StepHeader step={2} total={5} backTo="/plan" />

      <main className="mx-auto max-w-6xl px-6 pb-20 pt-16 sm:px-10">
        <div className="flex flex-col items-end gap-0 lg:flex-row lg:items-end">
          {/* Character illustration — see Home.jsx for the same caveat:
              bespoke asset, drop it at FE/public/character.png */}
          <img
            src="/character.png"
            alt=""
            aria-hidden="true"
            onError={(e) => (e.currentTarget.style.display = "none")}
            className="hidden w-56 flex-shrink-0 lg:-mr-6 lg:block"
          />

          <div className="grid w-full grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {SIM_PLANS.map((plan) => {
              const isSelected = selectedPlan === plan.id;
              return (
                <button
                  key={plan.id}
                  type="button"
                  onClick={() => setSelectedPlan(plan.id)}
                  className={[
                    "flex flex-col rounded-3xl border-2 bg-cream p-5 text-left transition-all",
                    isSelected ? "border-gold shadow-card" : "border-line hover:border-gold/60",
                  ].join(" ")}
                >
                  <div className="flex items-center justify-between rounded-xl bg-sandbox px-3 py-2.5">
                    <div>
                      <p className="text-[10px] font-semibold uppercase tracking-wide text-ink/50">Coverage</p>
                      <p className="font-display text-sm font-bold uppercase text-ink">Egypt</p>
                    </div>
                    <CreditCard className="h-5 w-5 text-gold" />
                  </div>

                  <div className="mt-6 text-center">
                    <p className="text-xs font-semibold uppercase tracking-wide text-ink/50">Data</p>
                    <p className="font-display text-4xl font-bold text-gold-dark">{plan.data}</p>
                  </div>

                  <div className="mt-6 flex items-center justify-between">
                    <div>
                      <p className="text-[10px] font-semibold uppercase tracking-wide text-ink/50">Validity</p>
                      <p className="text-sm font-semibold text-ink">{plan.validityDays} Days</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] font-semibold uppercase tracking-wide text-ink/50">Price</p>
                      <p className="text-sm font-semibold text-ink">
                        ${plan.price.toFixed(2)} <span className="text-[10px] font-normal text-ink/40">USD</span>
                      </p>
                    </div>
                  </div>

                  <div
                    className={[
                      "mt-5 rounded-full border py-2.5 text-center text-xs font-semibold uppercase tracking-wide transition-colors",
                      isSelected
                        ? "border-gold bg-gold text-cream"
                        : "border-ink/20 text-ink/70",
                    ].join(" ")}
                  >
                    Buy Now
                    <span className="mt-0.5 block text-[10px] font-normal normal-case tracking-normal opacity-70">
                      or Select Plan
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-14 flex justify-end">
          <button
            type="button"
            disabled={!selectedPlan}
            onClick={() => navigate("/plan/budget")}
            className="flex items-center gap-2 rounded-full bg-gold px-6 py-3 text-sm font-semibold text-cream shadow-sm transition-colors hover:bg-gold-light disabled:cursor-not-allowed disabled:opacity-40"
          >
            Continue
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </main>
    </div>
  );
}
