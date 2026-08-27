import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Heart, ArrowLeft, ArrowRight, MapPin } from "lucide-react";
import SiteNavbar from "../components/layout/SiteNavbar";
import WizardStepper from "../components/layout/WizardStepper";
import { useApi } from "../hooks/useApi";
import { usePlanningDraft } from "../hooks/usePlanningDraft";
import AsyncState from "../components/common/AsyncState";
import { getAllPlaces } from "../api/placesApi";
import { getAllTrips } from "../api/tripsApi";

// Figma's tab labels are "Attractions / Restaurants / Hotels / Rentals" —
// the actual Place category enum in the backend is
// attraction/restaurant/cafe/accommodation/hidden_gem/activity, with no
// "rentals" concept. Mapped to the closest real categories rather than
// inventing a tab with nothing behind it.
const CATEGORY_TABS = [
  { label: "All", value: null },
  { label: "Attractions", value: "attraction" },
  { label: "Restaurants & Cafés", value: "restaurant" },
  { label: "Accommodation", value: "accommodation" },
  { label: "Activities", value: "activity" },
];

export default function PlanningStep3Places() {
  const navigate = useNavigate();
  const { draft, updateDraft } = usePlanningDraft();

  const [activeCategory, setActiveCategory] = useState(null);
  const [destinations, setDestinations] = useState(draft.destinations);
  const [budget, setBudget] = useState(draft.budget);
  const [selectedPlaceIds, setSelectedPlaceIds] = useState(draft.selectedPlaceIds);

  const {
    data: trips,
    loading: tripsLoading,
    error: tripsError,
    refetch: refetchTrips,
  } = useApi(getAllTrips);

  const {
    data: places,
    loading: placesLoading,
    error: placesError,
    refetch: refetchPlaces,
  } = useApi(() => getAllPlaces(activeCategory), [activeCategory]);

  const destinationOptions = useMemo(() => {
    if (!trips) return [];
    return [...new Set(trips.map((t) => t.location.split(",")[0].trim()))];
  }, [trips]);

  const toggleDestination = (city) => {
    setDestinations((prev) => (prev.includes(city) ? prev.filter((c) => c !== city) : [...prev, city]));
  };

  const togglePlace = (id) => {
    setSelectedPlaceIds((prev) => (prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]));
  };

  const handleContinue = () => {
    updateDraft({ destinations, budget, selectedPlaceIds });
    navigate("/plan/review");
  };

  return (
    <div className="min-h-screen bg-cream font-body">
      <SiteNavbar />
      <div className="pt-6">
        <WizardStepper current="places" />
      </div>

      <main className="mx-auto max-w-6xl px-6 pb-20 pt-8 sm:px-10">
        <h1 className="font-display text-2xl font-semibold text-ink">Choose your destinations</h1>
        <p className="mt-1 text-sm text-ink/55">Pick the cities you want to visit, set a budget, then browse places.</p>

        {/* Destinations */}
        <section className="mt-6">
          <AsyncState
            loading={tripsLoading}
            error={tripsError}
            data={destinationOptions}
            onRetry={refetchTrips}
            emptyMessage="No destinations available."
          >
            {(cities) => (
              <div className="flex flex-wrap gap-3">
                {cities.map((city) => {
                  const active = destinations.includes(city);
                  return (
                    <button
                      key={city}
                      type="button"
                      onClick={() => toggleDestination(city)}
                      className={[
                        "rounded-full border-2 px-5 py-2 text-sm font-semibold transition-colors",
                        active ? "border-gold bg-gold text-cream" : "border-line bg-sandbox text-ink/70 hover:border-gold/50",
                      ].join(" ")}
                    >
                      {city}
                    </button>
                  );
                })}
              </div>
            )}
          </AsyncState>
        </section>

        {/* Budget */}
        <section className="mt-8 max-w-md rounded-2xl border border-line bg-sandbox p-5">
          <div className="flex items-center justify-between">
            <label htmlFor="budget" className="text-sm font-semibold text-ink">
              Set your budget
            </label>
            <span className="font-display text-lg font-bold text-gold-dark">${budget}</span>
          </div>
          <input
            id="budget"
            type="range"
            min={100}
            max={5000}
            step={50}
            value={budget}
            onChange={(e) => setBudget(Number(e.target.value))}
            className="mt-3 w-full accent-gold"
          />
          <p className="mt-1 text-xs text-ink/50">This helps us create a trip that fits your spending plan.</p>
        </section>

        {/* Places grid + map */}
        <section className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-[1fr_320px]">
          <div>
            <div className="mb-5 flex flex-wrap gap-2">
              {CATEGORY_TABS.map((tab) => (
                <button
                  key={tab.label}
                  type="button"
                  onClick={() => setActiveCategory(tab.value)}
                  className={[
                    "rounded-full px-4 py-2 text-sm font-medium transition-colors",
                    activeCategory === tab.value
                      ? "bg-gold text-cream"
                      : "border border-line bg-cream text-ink/65 hover:border-gold/50",
                  ].join(" ")}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <AsyncState
              loading={placesLoading}
              error={placesError}
              data={places}
              onRetry={refetchPlaces}
              emptyMessage="No places found in this category yet."
              loadingLabel="Loading places…"
            >
              {(placeList) => (
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  {placeList.map((place) => {
                    const selected = selectedPlaceIds.includes(place._id);
                    return (
                      <div key={place._id} className="overflow-hidden rounded-2xl border border-line bg-cream">
                        <div className="relative h-40 w-full bg-sandbox">
                          {place.images?.[0] ? (
                            <img src={place.images[0]} alt={place.name} className="h-full w-full object-cover" />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center text-ink/25">
                              <MapPin className="h-6 w-6" />
                            </div>
                          )}
                          <button
                            type="button"
                            onClick={() => togglePlace(place._id)}
                            aria-label={selected ? "Remove from trip" : "Add to trip"}
                            className={[
                              "absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full transition-colors",
                              selected ? "bg-gold text-cream" : "bg-cream/90 text-ink/60 hover:text-gold",
                            ].join(" ")}
                          >
                            <Heart className={`h-4 w-4 ${selected ? "fill-current" : ""}`} />
                          </button>
                        </div>
                        <div className="p-4">
                          <h3 className="font-display text-base font-semibold text-ink">{place.name}</h3>
                          <p className="mt-0.5 text-xs uppercase tracking-wide text-ink/45">
                            {place.category.replace("_", " ")} • {place.location?.address || "Egypt"}
                          </p>
                          {place.priceContext?.range && (
                            <p className="mt-2 text-xs text-ink/55">{place.priceContext.range}</p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </AsyncState>
          </div>

          <DecorativeMap places={places} />
        </section>

        {/* Nav buttons */}
        <div className="mt-14 flex items-center justify-between">
          <button
            type="button"
            onClick={() => navigate("/plan")}
            className="flex items-center gap-2 text-sm font-medium text-ink/60 hover:text-ink"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </button>
          <button
            type="button"
            onClick={handleContinue}
            disabled={destinations.length === 0}
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

/**
 * A real interactive map needs a maps API key this project doesn't have
 * configured. The Figma mockup itself uses a stylized illustrated map, not
 * a live one — so a decorative SVG in the same spirit is actually closer
 * to the source design than embedding a real map would be.
 */
function DecorativeMap({ places }) {
  const pins = (places || []).slice(0, 3);

  return (
    <aside className="h-fit rounded-2xl border border-line bg-sandbox p-5">
      <h3 className="font-display text-base font-semibold text-ink">Nearby Places</h3>

      <svg viewBox="0 0 300 180" className="mt-4 w-full rounded-xl border border-gold/30 bg-cream-soft">
        <path d="M40 20 Q120 60 100 160" stroke="#D6C8A5" strokeWidth="10" fill="none" opacity="0.5" />
        {pins.map((place, i) => (
          <circle key={place._id} cx={70 + i * 70} cy={50 + i * 30} r="6" fill="#A48238" />
        ))}
        <text x="150" y="170" textAnchor="middle" fontSize="9" fill="#211D18" opacity="0.4">
          Illustrative map — not to scale
        </text>
      </svg>

      <ul className="mt-4 space-y-3">
        {pins.length === 0 && <li className="text-xs text-ink/45">Select a category to see places here.</li>}
        {pins.map((place) => (
          <li key={place._id} className="flex items-center justify-between text-sm">
            <span className="flex items-center gap-2 text-ink/75">
              <MapPin className="h-3.5 w-3.5 text-gold" />
              {place.name}
            </span>
          </li>
        ))}
      </ul>
    </aside>
  );
}
