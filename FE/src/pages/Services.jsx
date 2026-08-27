import React, { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { FileText, Bus, Building2, Compass, ShieldCheck, ExternalLink } from "lucide-react";
import SiteNavbar from "../components/layout/SiteNavbar";
import Footer from "../components/layout/Footer";
import { useApi } from "../hooks/useApi";
import AsyncState from "../components/common/AsyncState";
import { getAllServices } from "../api/servicesApi";

const CATEGORY_TABS = [
  { label: "All", value: undefined, icon: Compass },
  { label: "Visa", value: "visa", icon: FileText },
  { label: "Transportation", value: "transport", icon: Bus },
  { label: "Accommodation", value: "accommodation", icon: Building2 },
  { label: "Activities", value: "activities", icon: Compass },
];

export default function Services() {
  const [searchParams] = useSearchParams();
  const [category, setCategory] = useState(() => searchParams.get("category") || undefined);

  const { data: services, loading, error, refetch } = useApi(
    () => getAllServices({ category }),
    [category]
  );

  return (
    <div className="min-h-screen bg-cream font-body">
      <SiteNavbar />

      <main className="mx-auto max-w-6xl px-6 pb-20 pt-8 sm:px-10">
        <h1 className="font-display text-2xl font-semibold text-ink">Services & Cultural Guide</h1>
        <p className="mt-1 text-sm text-ink/55">
          Official, verified links for visas, transportation, accommodation, and activities in Egypt.
        </p>

        <div className="mt-6 flex flex-wrap gap-2">
          {CATEGORY_TABS.map((tab) => (
            <button
              key={tab.label}
              type="button"
              onClick={() => setCategory(tab.value)}
              className={[
                "flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors",
                category === tab.value
                  ? "bg-gold text-cream"
                  : "border border-line bg-sandbox text-ink/65 hover:border-gold/50",
              ].join(" ")}
            >
              <tab.icon className="h-3.5 w-3.5" />
              {tab.label}
            </button>
          ))}
        </div>

        <div className="mt-8">
          <AsyncState
            loading={loading}
            error={error}
            data={services}
            onRetry={refetch}
            emptyMessage="No services listed in this category yet."
            loadingLabel="Loading services…"
          >
            {(serviceList) => (
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {serviceList.map((service) => (
                  <div key={service._id} className="flex flex-col rounded-2xl border border-line bg-sandbox p-5">
                    <div className="flex items-start justify-between">
                      <span className="rounded-full bg-cream px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-ink/55">
                        {service.category}
                      </span>
                      {service.isVerified && (
                        <span className="flex items-center gap-1 text-[11px] font-semibold text-gold-dark">
                          <ShieldCheck className="h-3.5 w-3.5" />
                          Verified
                        </span>
                      )}
                    </div>

                    <h3 className="mt-3 font-display text-base font-semibold text-ink">{service.name}</h3>
                    <p className="mt-1.5 flex-1 text-xs leading-relaxed text-ink/55">{service.description}</p>

                    <a
                      href={service.officialLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-4 flex items-center justify-center gap-2 rounded-full bg-gold px-4 py-2 text-xs font-semibold text-cream transition-colors hover:bg-gold-light"
                    >
                      Visit Official Site
                      <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  </div>
                ))}
              </div>
            )}
          </AsyncState>
        </div>
      </main>

      <Footer />
    </div>
  );
}
