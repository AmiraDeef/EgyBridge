import React from "react";
import { LogOut, MapPin, Wallet } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useApi } from "../hooks/useApi";
import AsyncState from "../components/common/AsyncState";
import { getMyTrip } from "../api/tripPlanApi";
import { getAllTrips } from "../api/tripsApi";

/**
 * Dashboard
 * The first real authenticated page — exists mainly to prove the whole
 * chain works end to end against the seeded database:
 *   AuthContext (session) -> axiosInstance (attaches JWT) -> api/*.js
 *   -> useApi (loading/error/data) -> AsyncState (renders the right UI)
 *
 * Treat this as a template for the real Home/My Trip/Explore pages from
 * the design — same pattern, different content.
 */
export default function Dashboard() {
  const { user, logout } = useAuth();

  const { data: myTrip, loading: tripLoading, error: tripError, refetch: refetchTrip } = useApi(getMyTrip);
  const { data: trips, loading: tripsLoading, error: tripsError, refetch: refetchTrips } = useApi(getAllTrips);

  return (
    <div className="min-h-screen bg-sand font-body">
      <header className="flex items-center justify-between border-b border-sand-line bg-white px-6 py-4 sm:px-10">
        <div>
          <p className="font-display text-lg font-semibold text-charcoal">EGI RISE</p>
          <p className="text-sm text-charcoal/50">Welcome back, {user?.fullName?.split(" ")[0] || "traveler"}</p>
        </div>
        <button
          type="button"
          onClick={logout}
          className="flex items-center gap-2 rounded-lg border border-sand-line px-3 py-2 text-sm font-medium text-charcoal/70 transition-colors hover:bg-sand"
        >
          <LogOut className="h-4 w-4" />
          Sign out
        </button>
      </header>

      <main className="mx-auto max-w-5xl space-y-10 px-6 py-10 sm:px-10">
        {/* My Trip — auth-required endpoint, demonstrates the Empty state
            for a user who hasn't generated a plan yet (e.g. a fresh
            registration rather than the seeded "sara" account). */}
        <section>
          <h2 className="mb-4 font-display text-xl font-semibold text-charcoal">My Trip</h2>
          <AsyncState
            loading={tripLoading}
            error={tripError}
            data={myTrip}
            onRetry={refetchTrip}
            isEmpty={(d) => !d}
            emptyMessage="You haven't planned a trip yet. Start planning to see it here."
            loadingLabel="Loading your trip…"
          >
            {(trip) => (
              <div className="rounded-2xl border border-sand-line bg-white p-6 shadow-sm">
                <div className="flex items-center justify-between">
                  <h3 className="font-display text-lg font-semibold text-charcoal">{trip.title}</h3>
                  <span className="rounded-full bg-gold/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-gold-dark">
                    {trip.status}
                  </span>
                </div>
                <div className="mt-3 flex flex-wrap gap-4 text-sm text-charcoal/60">
                  <span className="flex items-center gap-1.5">
                    <Wallet className="h-4 w-4" /> Budget: ${trip.budget}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <MapPin className="h-4 w-4" /> {trip.destinations?.join(", ")}
                  </span>
                  <span>{trip.duration} days</span>
                </div>
              </div>
            )}
          </AsyncState>
        </section>

        {/* Explore Trips — public endpoint, works even for a logged-out
            visitor once this section is reused on a public page. */}
        <section>
          <h2 className="mb-4 font-display text-xl font-semibold text-charcoal">Explore Trips</h2>
          <AsyncState
            loading={tripsLoading}
            error={tripsError}
            data={trips}
            onRetry={refetchTrips}
            emptyMessage="No trips are available right now — check back soon."
            loadingLabel="Loading trips…"
          >
            {(tripList) => (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {tripList.map((trip) => (
                  <article
                    key={trip._id}
                    className="overflow-hidden rounded-2xl border border-sand-line bg-white shadow-sm"
                  >
                    <img src={trip.image} alt={trip.title} className="h-36 w-full object-cover" />
                    <div className="p-4">
                      <h3 className="font-display text-base font-semibold text-charcoal">{trip.title}</h3>
                      <p className="mt-1 text-sm text-charcoal/55">{trip.location} · {trip.duration}</p>
                      <p className="mt-2 text-sm font-semibold text-gold-dark">${trip.price}</p>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </AsyncState>
        </section>
      </main>
    </div>
  );
}
