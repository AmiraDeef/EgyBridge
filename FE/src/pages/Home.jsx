import React from "react";
import { Link } from "react-router-dom";
import {
  Briefcase,
  Compass,
  PhoneCall,
  Plane,
  CreditCard,
  Map as MapIcon,
  Landmark,
  UtensilsCrossed,
  FileText,
  Building2,
  Bus,
  ArrowUpRight,
} from "lucide-react";
import SiteNavbar from "../components/layout/SiteNavbar";
import Footer from "../components/layout/Footer";
import { useApi } from "../hooks/useApi";
import AsyncState from "../components/common/AsyncState";
import { getAllTrips } from "../api/tripsApi";
import pyramidsHero from "../assets/the-pyramids-of-giza1.jpg";

const QUICK_ACTIONS = [
  { label: "Plan a Trip", icon: Briefcase, to: "/plan", iconClass: "text-[#2A4B6B]" },
  { label: "Explore", icon: Compass, to: "/explore", iconClass: "text-gold" },
  { label: "Emergency", icon: PhoneCall, to: "/emergency", iconClass: "text-red-500" },
  { label: "Travel services", icon: Plane, to: "/services", iconClass: "text-[#2A4B6B]" },
  { label: "SIM", icon: CreditCard, to: "/sim", iconClass: "text-gold" },
  { label: "Offline Maps", icon: MapIcon, to: "/offline-maps", iconClass: "text-gold" },
];

const INFO_CARDS = [
  {
    title: "Cultural Attractions",
    description: "Explore museums, historic sites, and cultural events",
    icon: Landmark,
    to: "/explore?category=attraction",
  },
  {
    title: "Restaurants & Cafés",
    description: "Find places to eat and enjoy local experiences",
    icon: UtensilsCrossed,
    to: "/explore?category=restaurant",
  },
  {
    title: "Visa",
    description: "Get visa information and requirements",
    icon: FileText,
    to: "/services?category=visa",
  },
  {
    title: "Accommodation",
    description: "Discover places to stay that fit your trip",
    icon: Building2,
    to: "/services?category=accommodation",
  },
  {
    title: "Transportation",
    description: "Find the best ways to move around Egypt",
    icon: Bus,
    to: "/services?category=transport",
  },
];

export default function Home() {
  const { data: trips, loading, error, refetch } = useApi(getAllTrips);

  return (
    <div className="min-h-screen bg-cream font-body">
      <SiteNavbar />

      <main className="mx-auto max-w-6xl px-6 pt-6 sm:px-10">
        {/* Hero */}
        <section className="relative overflow-hidden rounded-3xl">
          <img src={pyramidsHero} alt="Pyramids of Giza at sunset" className="h-[420px] w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-ink-soft/70 via-ink-soft/25 to-transparent" />

          <div className="absolute inset-0 flex flex-col justify-center px-8 sm:px-12">
            <h1 className="max-w-md font-display text-3xl font-semibold leading-tight text-cream sm:text-4xl">
              Plan your journey through Egypt
            </h1>
            <p className="mt-3 max-w-sm text-sm text-cream/80 sm:text-base">
              Smart planning, local insights for a smooth trip and offline support
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                to="/plan"
                className="flex items-center gap-2 rounded-full bg-gold px-5 py-2.5 text-sm font-semibold text-cream shadow-sm transition-colors hover:bg-gold-light"
              >
                Start planning
                <ArrowUpRight className="h-4 w-4" />
              </Link>
              <Link
                to="/explore"
                className="flex items-center gap-2 rounded-full bg-cream/15 px-5 py-2.5 text-sm font-semibold text-cream backdrop-blur-sm transition-colors hover:bg-cream/25"
              >
                Explore Egypt
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>

        {/* What do you want to do? */}
        <section className="mt-14">
          <h2 className="mb-6 font-display text-xl font-semibold text-ink">What do you want to do?</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {QUICK_ACTIONS.map(({ label, icon: Icon, to, iconClass }) => (
              <Link
                key={label}
                to={to}
                className="flex flex-col items-center gap-3 rounded-2xl border border-line bg-sandbox px-6 py-8 text-center transition-shadow hover:shadow-card"
              >
                <Icon className={`h-6 w-6 ${iconClass}`} />
                <span className="font-semibold text-ink">{label}</span>
              </Link>
            ))}
          </div>
        </section>

        {/* Info cards row */}
        <section className="mt-14">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
            {INFO_CARDS.map(({ title, description, icon: Icon, to }) => (
              <div
                key={title}
                className="flex flex-col rounded-2xl border border-line bg-sandbox p-5"
              >
                <Icon className="h-5 w-5 text-ink/70" />
                <h3 className="mt-3 font-display text-base font-semibold leading-snug text-ink">{title}</h3>
                <p className="mt-1.5 flex-1 text-xs leading-relaxed text-ink/55">{description}</p>
                <Link
                  to={to}
                  aria-label={title}
                  className="mt-4 flex h-8 w-8 items-center justify-center rounded-full bg-gold/70 text-cream transition-colors hover:bg-gold"
                >
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            ))}
          </div>
        </section>

        {/* Destinations — real data from the backend */}
        <section className="mt-16 pb-16">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-[220px_1fr]">
            <CharacterIllustration />

            <div>
              <AsyncState
                loading={loading}
                error={error}
                data={trips}
                onRetry={refetch}
                emptyMessage="No destinations available right now — check back soon."
                loadingLabel="Loading destinations…"
              >
                {(tripList) => (
                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                    {tripList.slice(0, 4).map((trip) => (
                      <Link
                        key={trip._id}
                        to={`/explore/${trip._id}`}
                        className="group relative overflow-hidden rounded-2xl border border-line"
                      >
                        <img
                          src={trip.image}
                          alt={trip.title}
                          className="h-64 w-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-ink-soft/90 via-ink-soft/10 to-transparent" />
                        <div className="absolute inset-x-0 bottom-0 p-4 text-cream">
                          <p className="font-display text-lg font-semibold">{trip.location.split(",")[0]}</p>
                          <p className="mt-0.5 text-xs text-cream/75 line-clamp-2">{trip.title}</p>
                          <span className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-gold-light">
                            continue
                            <ArrowUpRight className="h-3 w-3" />
                          </span>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </AsyncState>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

/**
 * The Figma mockup uses a custom 3D-illustrated traveler character here.
 * That's a bespoke asset I don't have a source file for. Drop the export
 * at FE/public/character.png (not src/assets — files referenced by a
 * runtime URL string like this must live in public/, since Vite only
 * bundles src/assets files that are statically imported, and a missing
 * static import would fail the build). Renders nothing until the image
 * actually loads, so a missing file degrades to blank space rather than a
 * broken-image icon.
 */
function CharacterIllustration() {
  const [loaded, setLoaded] = React.useState(false);

  return (
    <img
      src="/character.png"
      alt="EGI RISE traveler guide illustration"
      onLoad={() => setLoaded(true)}
      onError={() => setLoaded(false)}
      className={`hidden h-auto w-full max-w-[220px] lg:block ${loaded ? "" : "opacity-0"}`}
    />
  );
}
