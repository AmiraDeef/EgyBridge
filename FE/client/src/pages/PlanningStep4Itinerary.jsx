import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Wallet, Clock, MapPin, Save, Download, Sparkles, CheckCircle2, Calendar } from "lucide-react";
import SiteNavbar from "../components/layout/SiteNavbar";
import WizardStepper from "../components/layout/WizardStepper";
import BackButton from "../components/common/BackButton";
import { useApi } from "../hooks/useApi";
import { usePlanningDraft } from "../hooks/usePlanningDraft";
import AsyncState from "../components/common/AsyncState";
import { generateTripPlan, updateItinerary } from "../api/tripPlanApi";
import { exportTripToPdf } from "../utils/exportTripPdf";
import { useAuth } from "../context/AuthContext";

export default function PlanningStep4Itinerary() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { draft, updateDraft } = usePlanningDraft();

  const effectiveDuration = draft.duration || 5;
  const effectiveDestinations = draft.destinations?.length > 0 ? draft.destinations : ["Cairo", "Luxor"];

  const { data, loading, error, refetch } = useApi(
    () =>
      generateTripPlan({
        title: `Trip to ${effectiveDestinations.join(" & ")}`,
        budget: draft.budget || 1200,
        duration: effectiveDuration,
        interests: draft.interests || [],
        destinations: effectiveDestinations,
      }),
    []
  );

  return (
    <div className="min-h-screen bg-cream font-body text-ink">
      <SiteNavbar />
      <div className="pt-6">
        <WizardStepper current="itinerary" />
      </div>

      <main className="mx-auto max-w-4xl px-6 pb-24 pt-8 sm:px-10">
        {/* Navigation Top Bar */}
        <div className="mb-6 flex items-center justify-between">
          <BackButton fallbackPath="/plan/places" label="Back to Places" />
          <span className="text-xs font-semibold uppercase tracking-widest text-ink/50">
            Step 4 of 4: Review Itinerary
          </span>
        </div>

        <div className="rounded-3xl border border-line bg-sandbox p-6 sm:p-8">
          <div className="inline-flex items-center gap-2 rounded-full bg-gold/15 px-3 py-1 text-xs font-bold uppercase tracking-wider text-gold-dark">
            <Sparkles className="h-3.5 w-3.5 text-gold" />
            Generated Expedition
          </div>
          <h1 className="mt-3 font-display text-2xl font-bold text-ink sm:text-3xl">
            Your {effectiveDuration}-Day Egypt Itinerary Plan
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-ink/65">
            Review and personalize each day of your journey before confirming.
          </p>
        </div>

        <div className="mt-8">
          <AsyncState
            loading={loading}
            error={error}
            data={data}
            onRetry={refetch}
            isEmpty={(d) => !d?.tripPlan}
            emptyMessage="We couldn't generate a plan — go back and check your destinations."
            loadingLabel="Building your custom scaled itinerary…"
          >
            {({ tripPlan }) => (
              <TripPlanView
                tripPlan={tripPlan}
                user={user}
                onSaved={() => {
                  updateDraft({ tripPlanId: tripPlan._id });
                  navigate("/plan/offline");
                }}
                onBack={() => navigate("/plan/places")}
              />
            )}
          </AsyncState>
        </div>
      </main>
    </div>
  );
}

function TripPlanView({ tripPlan, user, onSaved, onBack }) {
  const [itinerary, setItinerary] = useState(tripPlan.itinerary || []);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState(null);
  const [downloading, setDownloading] = useState(false);

  const updateDayNotes = (dayIndex, value) => {
    setItinerary((prev) =>
      prev.map((day, i) =>
        i === dayIndex
          ? {
              ...day,
              activities: [
                {
                  ...(day.activities?.[0] || { title: `Day ${day.day} Exploration` }),
                  notes: value,
                },
              ],
            }
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

  const handleExportPdf = async () => {
    setDownloading(true);
    try {
      await exportTripToPdf({ ...tripPlan, itinerary }, user);
    } catch (err) {
      console.error("PDF generation failed:", err);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="mt-6 space-y-8">
      {/* Trip Summary Metric Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <SummaryCard icon={Wallet} label="Total Budget" value={`$${tripPlan.budget} USD`} />
        <SummaryCard icon={Clock} label="Trip Duration" value={`${tripPlan.duration} Days (${tripPlan.duration - 1} Nights)`} />
        <SummaryCard
          icon={MapPin}
          label="Destinations"
          value={Array.isArray(tripPlan.destinations) ? tripPlan.destinations.join(", ") : "Egypt"}
        />
      </div>

      {/* Itinerary Preview & Notes Editor */}
      <div>
        <div className="flex items-center justify-between border-b border-line pb-3">
          <h2 className="font-display text-lg font-bold text-ink">
            Day-by-Day Schedule ({itinerary.length} Days)
          </h2>
          <button
            type="button"
            onClick={handleExportPdf}
            disabled={downloading}
            className="flex items-center gap-1.5 text-xs font-bold text-gold-dark hover:underline"
          >
            <Download className="h-3.5 w-3.5" />
            {downloading ? "Preparing PDF..." : "Export as PDF"}
          </button>
        </div>

        <div className="relative mt-6 pl-6 sm:pl-8">
          <div className="absolute bottom-6 left-[13px] sm:left-[17px] top-4 w-0.5 bg-line" />

          {itinerary.map((day, i) => (
            <div key={day.day} className="relative mb-6 last:mb-0">
              <span className="absolute -left-6 sm:-left-8 top-1 flex h-7 w-7 items-center justify-center rounded-full border-2 border-gold bg-cream text-xs font-bold text-gold-dark shadow-sm">
                {day.day}
              </span>

              <div className="rounded-3xl border border-line bg-cream p-5 shadow-sm">
                <div className="flex items-center justify-between">
                  <p className="font-display text-base font-bold text-ink">
                    Day {day.day}: {day.activities?.[0]?.title || `Day ${day.day} Discovery`}
                  </p>
                  <span className="text-[11px] font-bold text-gold-dark bg-gold/10 px-2.5 py-0.5 rounded-full">
                    {tripPlan.destinations?.[(day.day - 1) % (tripPlan.destinations?.length || 1)] || "Egypt"}
                  </span>
                </div>

                <div className="mt-3">
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-ink/50 mb-1">
                    Activity Notes & Guidance:
                  </label>
                  <textarea
                    value={day.activities?.[0]?.notes || ""}
                    onChange={(e) => updateDayNotes(i, e.target.value)}
                    rows={2}
                    placeholder="Add personal notes, meeting times, or restaurant reservations..."
                    className="w-full resize-none rounded-2xl border border-line bg-sandbox px-4 py-2.5 text-xs sm:text-sm text-ink outline-none transition-colors focus:border-gold focus:bg-cream"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {saveError && (
        <p className="rounded-2xl border border-red-200 bg-red-50 p-4 text-xs font-semibold text-red-600">
          {saveError}
        </p>
      )}

      {/* Navigation and Action Buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-t border-line/60 pt-6">
        <BackButton fallbackPath="/plan/places" label="Back to Places" onClick={onBack} />

        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={handleSaveAndContinue}
            disabled={saving}
            className="flex items-center gap-2 rounded-full bg-gold px-7 py-3 text-sm font-semibold text-cream shadow-md transition-all hover:bg-gold-light hover:shadow-lg disabled:opacity-50"
          >
            <Save className="h-4 w-4" />
            {saving ? "Saving Trip Plan..." : "Save Trip & Continue"}
          </button>

          <button
            type="button"
            onClick={handleExportPdf}
            className="flex items-center gap-2 rounded-full border-2 border-gold bg-cream px-6 py-3 text-sm font-semibold text-gold-dark shadow-sm transition-colors hover:bg-gold/10"
          >
            <Download className="h-4 w-4" />
            Download Offline PDF
          </button>
        </div>
      </div>
    </div>
  );
}

function SummaryCard({ icon: Icon, label, value }) {
  return (
    <div className="rounded-3xl border border-line bg-cream p-5 shadow-sm">
      <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-gold/15 text-gold-dark">
        <Icon className="h-4 w-4" />
      </div>
      <p className="mt-3 text-[10px] font-bold uppercase tracking-wider text-ink/45">{label}</p>
      <p className="mt-0.5 font-display text-base font-bold text-ink">{value}</p>
    </div>
  );
}
