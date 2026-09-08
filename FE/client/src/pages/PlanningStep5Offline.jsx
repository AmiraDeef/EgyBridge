import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CheckCircle2, FileDown, MapPin, Calendar, ListChecks, Loader2, ArrowRight } from "lucide-react";
import SiteNavbar from "../components/layout/SiteNavbar";
import WizardStepper from "../components/layout/WizardStepper";
import BackButton from "../components/common/BackButton";
import { useApi } from "../hooks/useApi";
import { usePlanningDraft } from "../hooks/usePlanningDraft";
import { useAuth } from "../context/AuthContext";
import AsyncState from "../components/common/AsyncState";
import { getOfflinePack } from "../api/tripPlanApi";
import { exportTripToPdf } from "../utils/exportTripPdf";

export default function PlanningStep5Offline() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { draft, resetDraft } = usePlanningDraft();
  const [downloading, setDownloading] = useState(false);
  const [downloadError, setDownloadError] = useState(null);

  const { data: pack, loading, error, refetch } = useApi(
    () => getOfflinePack(draft.tripPlanId),
    [draft.tripPlanId]
  );

  const handleExportPdf = async () => {
    if (!pack) return;
    setDownloading(true);
    setDownloadError(null);
    try {
      await exportTripToPdf(pack, user);
    } catch (err) {
      console.error("PDF generation failed:", err);
      setDownloadError("Failed to generate PDF document. Please try again.");
    } finally {
      setDownloading(false);
    }
  };

  const handleDone = () => {
    resetDraft();
    navigate("/my-trip");
  };

  return (
    <div className="min-h-screen bg-cream font-body text-ink">
      <SiteNavbar />
      <div className="pt-6">
        <WizardStepper current="offline" />
      </div>

      <main className="mx-auto max-w-2xl px-6 pb-24 pt-8 sm:px-10">
        {/* Navigation Top Bar with Back button */}
        <div className="mb-6 flex items-center justify-between">
          <BackButton fallbackPath="/plan/review" label="Back to Itinerary" />
          <span className="text-xs font-semibold uppercase tracking-widest text-ink/50">
            Step 5: Trip Confirmed
          </span>
        </div>

        <AsyncState
          loading={loading}
          error={error}
          data={pack || {
            title: "Custom Egypt Expedition",
            duration: draft.duration || 5,
            destinations: draft.destinations || ["Cairo", "Luxor"],
            itinerary: Array.from({ length: draft.duration || 5 }, (_, i) => ({ day: i + 1 })),
            generatedAt: new Date().toISOString(),
          }}
          onRetry={refetch}
          emptyMessage="Couldn't prepare your offline pack."
          loadingLabel="Packaging your trip for offline use…"
        >
          {(offlinePack) => (
            <div className="rounded-3xl border border-gold/40 bg-sandbox p-8 text-center shadow-card">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gold/15 text-gold-dark shadow-sm">
                <CheckCircle2 className="h-8 w-8" />
              </div>
              <h1 className="mt-5 font-display text-2xl font-bold text-ink sm:text-3xl">
                Your Egypt Expedition is Ready!
              </h1>
              <p className="mt-2 text-xs sm:text-sm text-ink/65 max-w-md mx-auto">
                {offlinePack.title} — Download your official branded PDF document for offline travel reference across monuments, museums, and tombs.
              </p>

              <div className="mt-8 grid grid-cols-1 gap-3 text-left sm:grid-cols-3">
                <PackStat icon={Calendar} label="Duration" value={`${offlinePack.duration} Days`} />
                <PackStat
                  icon={MapPin}
                  label="Destinations"
                  value={
                    Array.isArray(offlinePack.destinations)
                      ? offlinePack.destinations.join(", ")
                      : "Egypt"
                  }
                />
                <PackStat
                  icon={ListChecks}
                  label="Itinerary Days"
                  value={String(offlinePack.itinerary?.length || offlinePack.duration)}
                />
              </div>

              {downloadError && (
                <p className="mt-4 rounded-xl border border-red-200 bg-red-50 p-3 text-xs text-red-600">
                  {downloadError}
                </p>
              )}

              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
                <button
                  type="button"
                  onClick={handleExportPdf}
                  disabled={downloading}
                  className="flex items-center justify-center gap-2 rounded-full bg-gold px-7 py-3.5 text-sm font-semibold text-cream shadow-md transition-all hover:bg-gold-light hover:shadow-lg disabled:opacity-60"
                >
                  {downloading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Generating Document…
                    </>
                  ) : (
                    <>
                      <FileDown className="h-4 w-4" />
                      Download Official PDF
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={handleDone}
                  className="flex items-center justify-center gap-2 rounded-full border-2 border-gold bg-cream px-7 py-3.5 text-sm font-semibold text-gold-dark shadow-sm transition-colors hover:bg-gold/10"
                >
                  <span>Go to My Trip Dashboard</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>

              <p className="mt-5 text-[11px] text-ink/40">
                Generated {new Date(offlinePack.generatedAt || Date.now()).toLocaleString()}
              </p>
            </div>
          )}
        </AsyncState>
      </main>
    </div>
  );
}

function PackStat({ icon: Icon, label, value }) {
  return (
    <div className="rounded-2xl border border-line bg-cream p-4 shadow-sm">
      <Icon className="h-4 w-4 text-gold-dark" />
      <p className="mt-2 text-[10px] font-bold uppercase tracking-wider text-ink/45">{label}</p>
      <p className="mt-0.5 text-sm font-bold text-ink">{value}</p>
    </div>
  );
}
