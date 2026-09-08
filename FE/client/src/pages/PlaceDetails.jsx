import React from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  CalendarDays,
  Clock3,
  ExternalLink,
  Map,
  MapPin,
  Navigation,
  Ticket,
} from "lucide-react";
import SiteNavbar from "../components/layout/SiteNavbar";
import Footer from "../components/layout/Footer";
import AsyncState from "../components/common/AsyncState";
import TripReviews from "./TripReviews"; // <-- 1. استيراد مكون المراجعات
import { useApi } from "../hooks/useApi";
import { getPlaceById } from "../api/placesApi";

const FALLBACK_IMAGE = null;

function getImage(place) {
  return place?.images?.find(Boolean) || FALLBACK_IMAGE;
}

function DetailRow({ icon: Icon, label, value }) {
  if (!value) return null;
  return (
    <div className="flex items-start gap-3 text-sm text-[#514939]">
      <Icon className="mt-0.5 h-4 w-4 shrink-0 text-[#BD8C1A]" />
      <div>
        <p className="font-semibold text-[#302711] text-xs uppercase tracking-wider">{label}</p>
        <p className="text-sm font-medium text-[#524016] mt-0.5">{value}</p>
      </div>
    </div>
  );
}

export default function PlaceDetails() {
  const { id } = useParams();
  const {
    data: place,
    loading,
    error,
    refetch,
  } = useApi(() => getPlaceById(id), [id]);

  return (
    <div className="min-h-screen bg-[#FAF6ED] font-body text-[#211D18]">
      <SiteNavbar />
      <AsyncState
        loading={loading}
        error={error}
        data={place}
        onRetry={refetch}
        emptyMessage="This place could not be found."
        loadingLabel="Loading place details..."
      >
        {(currentPlace) => {
          const image = getImage(currentPlace);
          const address = currentPlace.location?.address || "Egypt";
          const practical = currentPlace.practicalInfo || {};
          const latitude = currentPlace.location?.lat;
          const longitude = currentPlace.location?.lng;
          const mapQuery =
            latitude && longitude ? `${latitude},${longitude}` : address;
          const mapEmbedUrl = `https://www.google.com/maps?q=${encodeURIComponent(mapQuery)}&z=15&output=embed`;
          const tags = [
            currentPlace.category === "attraction"
              ? "HISTORIC SITE"
              : currentPlace.category?.toUpperCase(),
            practical.estimatedVisitDuration &&
              `${practical.estimatedVisitDuration} VISIT`,
            currentPlace.priceContext?.range && "ENTRY INFORMATION",
          ].filter(Boolean);

          return (
            <>
              {/* Hero Banner Image */}
              <section className="relative h-[420px] w-full overflow-hidden shadow-md">
                {image ? (
                  <img
                    src={image}
                    alt={currentPlace.name}
                    className="h-full w-full object-cover object-center"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center bg-[#EADFB9] text-base font-semibold text-[#766b5b]">
                    Place image unavailable
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-[#211D18]/80 via-[#211D18]/30 to-transparent" />
                <div className="absolute inset-x-0 bottom-8 mx-auto max-w-6xl px-6 text-white sm:px-10">
                  <h1 className="font-display text-4xl font-bold leading-tight sm:text-5xl text-[#FDFBF7]">
                    {currentPlace.name}
                  </h1>
                  <div className="mt-3 flex flex-wrap items-center gap-4 text-sm font-medium text-white/90">
                    <span className="flex items-center gap-1.5">
                      <MapPin className="h-4 w-4 text-[#BD8C1A]" />
                      {address}
                    </span>
                    <span className="text-white/40">|</span>
                    <span className="flex items-center gap-1.5">
                      <CalendarDays className="h-4 w-4 text-[#BD8C1A]" />
                      Plan your visit
                    </span>
                  </div>
                </div>
              </section>

              {/* Main Container */}
              <main className="mx-auto max-w-6xl px-6 pb-28 pt-8 sm:px-10">
                <Link
                  to="/explore"
                  className="mb-8 inline-flex items-center gap-2 text-sm font-bold text-[#835400] transition-colors hover:text-[#BD8C1A]"
                >
                  <ArrowLeft className="h-4 w-4" /> Back to Explore
                </Link>

                <div className="grid gap-10 lg:grid-cols-[1fr_320px]">
                  {/* Left Column: Place Details */}
                  <div>
                    <h2 className="font-display text-3xl font-bold leading-tight text-[#302711] sm:text-4xl">
                      {currentPlace.name}
                    </h2>
                    <p className="mt-2 flex items-center gap-1.5 text-sm font-semibold text-[#835400]">
                      <MapPin className="h-4 w-4 text-[#BD8C1A]" />
                      {address}
                    </p>
                    <p className="mt-6 text-base leading-relaxed text-[#4A3E2C]">
                      {currentPlace.description ||
                        "Description unavailable for this place."}
                    </p>

                    {/* Tags */}
                    <div className="mt-8 flex flex-wrap gap-2.5">
                      {tags.map((tag) => (
                        <span
                          key={tag}
                          className="rounded-full border border-[#BD8C1A]/50 bg-[#F5EEDC] px-4 py-2 text-xs font-bold tracking-wider text-[#524016]"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Right Column: Plan Visit Card */}
                  <aside className="h-fit rounded-2xl border-2 border-[#BD8C1A]/30 bg-[#F1EAD0] p-6 shadow-lg">
                    <div className="flex items-center justify-between border-b border-[#BD8C1A]/20 pb-4">
                      <h3 className="font-display text-lg font-bold text-[#302711]">
                        Plan Visit
                      </h3>
                      <Ticket className="h-6 w-6 text-[#BD8C1A]" />
                    </div>

                    <Link
                      to="/plan/places"
                      className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-[#BD8C1A] px-4 py-3.5 text-xs font-bold uppercase tracking-wider text-white shadow-md transition-colors hover:bg-[#a67c17]"
                    >
                      ADD TO MY TRIP <span className="text-base font-bold">+</span>
                    </Link>

                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${currentPlace.location?.lat || ""},${currentPlace.location?.lng || ""}`}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-[#BD8C1A] bg-[#FDFBF7] px-4 py-3 text-xs font-bold uppercase tracking-wider text-[#835400] transition-colors hover:bg-[#F5EEDC]"
                    >
                      <Navigation className="h-4 w-4" /> GET DIRECTIONS
                    </a>

                    <div className="mt-6 space-y-4 border-t border-[#BD8C1A]/20 pt-5">
                      <DetailRow
                        icon={Clock3}
                        label="Opening Hours"
                        value={practical.openingHours}
                      />
                      <DetailRow
                        icon={Ticket}
                        label="Admission"
                        value={currentPlace.priceContext?.range}
                      />
                      <DetailRow
                        icon={CalendarDays}
                        label="Best Time"
                        value={practical.bestTimeToVisit}
                      />
                    </div>
                  </aside>
                </div>

                {/* Itinerary & Route Map Section */}
                <section className="mt-20 grid gap-10 lg:grid-cols-[1fr_320px]">
                  <div>
                    <h2 className="font-display text-2xl font-bold tracking-wide text-[#302711]">
                      ITINERARY
                    </h2>
                    <div className="mt-6 border-l-2 border-[#BD8C1A]/40 pl-5">
                      <div className="relative pb-6">
                        <span className="absolute -left-[27px] top-1 h-3 w-3 rounded-full border-2 border-white bg-[#BD8C1A]" />
                        <h3 className="text-base font-bold text-[#524016]">
                          Visit {currentPlace.name}
                        </h3>
                        <p className="mt-1 text-xs font-medium text-[#776d60]">
                          {practical.estimatedVisitDuration
                            ? `Estimated visit: ${practical.estimatedVisitDuration}`
                            : "Itinerary timing is not available for this place."}
                        </p>
                      </div>
                      <div className="rounded-xl border border-[#BD8C1A]/30 bg-[#F5EEDC]/60 p-4 text-xs text-[#524016]">
                        <p className="font-bold text-[#302711]">
                          Place itinerary data
                        </p>
                        <p className="mt-1 leading-relaxed">
                          The backend currently provides place details and
                          practical information, but no saved day-by-day
                          itinerary for this destination.
                        </p>
                      </div>
                    </div>
                    <Link
                      to="/explore"
                      className="mt-6 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#835400] hover:underline"
                    >
                      View Full Itinerary <ExternalLink className="h-3.5 w-3.5" />
                    </Link>
                  </div>

                  {/* Route Map */}
                  <aside className="h-[300px] overflow-hidden rounded-2xl border border-[#BD8C1A]/30 bg-[#F1EAD0] shadow-md">
                    <div className="flex h-10 items-center justify-between bg-[#302711] px-4 text-xs font-bold text-[#FDFBF7]">
                      <span>Route Map</span>
                      <Map className="h-4 w-4 text-[#BD8C1A]" />
                    </div>
                    <iframe
                      title={`Map showing ${currentPlace.name}`}
                      src={mapEmbedUrl}
                      className="h-[260px] w-full border-0"
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                    />
                  </aside>
                </section>

                {/* Trip Summary Section */}
                <section className="mt-20 border-t border-[#BD8C1A]/20 pt-10">
                  <h2 className="font-display text-2xl font-bold tracking-wide text-[#302711]">
                    TRIP SUMMARY
                  </h2>
                  <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <div className="rounded-xl border border-[#BD8C1A]/30 bg-[#F1EAD0]/80 p-4 text-xs">
                      <b className="text-sm font-bold text-[#302711]">Estimated Visit</b>
                      <p className="mt-2 font-medium text-[#524016]">
                        {practical.estimatedVisitDuration || "Not available"}
                      </p>
                    </div>
                    <div className="rounded-xl border border-[#BD8C1A]/30 bg-[#F1EAD0]/80 p-4 text-xs">
                      <b className="text-sm font-bold text-[#302711]">Opening Hours</b>
                      <p className="mt-2 font-medium text-[#524016]">
                        {practical.openingHours || "Not available"}
                      </p>
                    </div>
                    <div className="rounded-xl border border-[#BD8C1A]/30 bg-[#F1EAD0]/80 p-4 text-xs">
                      <b className="text-sm font-bold text-[#302711]">Admission</b>
                      <p className="mt-2 font-medium text-[#524016]">
                        {currentPlace.priceContext?.range || "Not available"}
                      </p>
                    </div>
                    <div className="rounded-xl border border-[#BD8C1A]/30 bg-[#F1EAD0]/80 p-4 text-xs">
                      <b className="text-sm font-bold text-[#302711]">Location</b>
                      <p className="mt-2 font-medium text-[#524016]">{address}</p>
                    </div>
                  </div>
                </section>

                {/* 2. قسم المراجعات (Reviews Section) */}
                <section className="mt-20 border-t border-[#BD8C1A]/20 pt-10">
                  <TripReviews tripId={currentPlace._id || id} />
                </section>
              </main>
            </>
          );
        }}
      </AsyncState>
      <Footer />
    </div>
  );
}