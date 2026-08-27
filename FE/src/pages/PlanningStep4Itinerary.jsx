import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight, Wallet, Clock, MapPin, Save, Download } from "lucide-react";
import SiteNavbar from "../components/layout/SiteNavbar";
import WizardStepper from "../components/layout/WizardStepper";
import { useApi } from "../hooks/useApi";
import { usePlanningDraft } from "../hooks/usePlanningDraft";
import AsyncState from "../components/common/AsyncState";
import { generateTripPlan, updateItinerary } from "../api/tripPlanApi";

export default function PlanningStep4Itinerary() {
  const navigate = useNavigate();
  const { draft, updateDraft } = usePlanningDraft();

  const { data, loading, error, refetch } = useApi(
    () =>
      generateTripPlan({
        title: draft.destinations.length ? `Trip to ${draft.destinations.join(" & ")}` : undefined,
        budget: draft.budget,
        duration: draft.duration,
        interests: draft.interests,
        destinations: draft.destinations,
      }),
    // Deliberately empty deps — this should fire exactly once per visit to
    // this step, using whatever was in the draft at that moment. Refiring
    // on every draft change would regenerate the plan on every keystroke.
    []
  );

  return (
    <div className="min-h-screen bg-cream font-body">
      <SiteNavbar />
      <div className="pt-6">
        <WizardStepper current="itinerary" />
      </div>

      <main className="mx-auto max-w-4xl px-6 pb-20 pt-8 sm:px-10">
        <h1 className="font-display text-2xl font-semibold text-ink">Your Trip Plan</h1>

        <AsyncState
          loading={loading}
          error={error}
          data={data}
          onRetry={refetch}
          isEmpty={(d) => !d?.tripPlan}
          emptyMessage="We couldn't generate a plan — go back and check your destinations."
          loadingLabel="Building your itinerary…"
        >
          {({ tripPlan }) => (
            <TripPlanView
              tripPlan={tripPlan}
              onSaved={() => {
                updateDraft({ tripPlanId: tripPlan._id });
                navigate("/plan/offline");
              }}
              onBack={() => navigate("/plan/places")}
            />
          )}
        </AsyncState>
      </main>
    </div>
  );
}

function TripPlanView({ tripPlan, onSaved, onBack }) {
  const [itinerary, setItinerary] = useState(tripPlan.itinerary);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState(null);

  const updateDayNotes = (dayIndex, value) => {
    setItinerary((prev) =>
      prev.map((day, i) =>
        i === dayIndex
          ? { ...day, activities: [{ ...(day.activities[0] || { title: `Day ${day.day}` }), notes: value }] }
          : day
      )
    );
  };

  const handleSaveAndContinue = async () => {
    setSaving(true);
    setSaveError(null);
    const { error } = await updateItinerary(tripPlan._id, itinerary);
    setSaving(false);
    if (error) {
      setSaveError(error);
      return;
    }
    onSaved();
  };

  return (
    <div className="mt-8">
      {/* Trip Summary */}
      <h2 className="mb-4 font-display text-lg font-semibold text-gold-dark">Trip Summary</h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <SummaryCard icon={Wallet} label="Budget" value={`$${tripPlan.budget}`} />
        <SummaryCard icon={Clock} label="Duration" value={`${tripPlan.duration} days`} />
        <SummaryCard icon={MapPin} label="Destinations" value={tripPlan.destinations.join(", ")} />
      </div>

      {/* Itinerary Preview */}
      <h2 className="mb-4 mt-10 font-display text-lg font-semibold text-gold-dark">Itinerary Preview</h2>
      <div className="relative pl-8">
        <div className="absolute bottom-4 left-[11px] top-2 w-px bg-line" />
        {itinerary.map((day, i) => (
          <div key={day.day} className="relative mb-6 last:mb-0">
            <span className="absolute -left-8 top-0.5 flex h-6 w-6 items-center justify-center rounded-full border-2 border-gold bg-cream">
              <span className="h-2 w-2 rounded-full bg-gold" />
            </span>
            <p className="mb-2 font-display text-base font-semibold text-ink">Day {day.day}</p>
            <textarea
              value={day.activities?.[0]?.notes || day.activities?.[0]?.title || ""}
              onChange={(e) => updateDayNotes(i, e.target.value)}
              rows={2}
              className="w-full resize-none rounded-xl border border-line bg-sandbox px-4 py-3 text-sm text-ink/80 outline-none transition-colors focus:border-gold"
            />
          </div>
        ))}
      </div>

      {saveError && (
        <p className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-600">{saveError}</p>
      )}

      <div className="mt-10 flex items-center justify-between">
        <button type="button" onClick={onBack} className="flex items-center gap-2 text-sm font-medium text-ink/60 hover:text-ink">
          <ArrowLeft className="h-4 w-4" />
          Back
        </button>

        <div className="flex gap-3">
          <button
            type="button"
            onClick={handleSaveAndContinue}
            disabled={saving}
            className="flex items-center gap-2 rounded-full bg-gold px-6 py-3 text-sm font-semibold text-cream shadow-sm transition-colors hover:bg-gold-light disabled:opacity-50"
          >
            <Save className="h-4 w-4" />
            {saving ? "Saving…" : "Save Trip"}
          </button>
          <button
            type="button"
            onClick={onSaved}
            className="flex items-center gap-2 rounded-full border-2 border-gold px-6 py-3 text-sm font-semibold text-gold-dark transition-colors hover:bg-gold/10"
          >
            <Download className="h-4 w-4" />
            Download for Offline
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}

function SummaryCard({ icon: Icon, label, value }) {
  return (
    <div className="rounded-2xl border border-line bg-cream p-4">
      <Icon className="h-4 w-4 text-gold" />
      <p className="mt-2 text-[10px] font-semibold uppercase tracking-wide text-ink/45">{label}</p>
      <p className="mt-0.5 font-display text-base font-semibold text-ink">{value}</p>
    </div>
  );
}
