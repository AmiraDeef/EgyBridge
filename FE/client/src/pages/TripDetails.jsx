import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { PlusCircle, Compass, Clock, Ticket, MapPin, Bus, Hotel, Wallet } from "lucide-react";
import SiteNavbar from "../components/layout/SiteNavbar";
import Footer from "../components/layout/Footer";
import { getTripById } from "../api/tripsApi";
import TripReviews from "./TripReviews";

export default function TripDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 1. التمرير السلس إلى قسم التقييمات لو الرابط يحتوي على #reviews
  useEffect(() => {
    if (location.hash === "#reviews" && !loading) {
      const el = document.getElementById("reviews");
      if (el) {
        setTimeout(() => el.scrollIntoView({ behavior: "smooth" }), 300);
      }
    }
  }, [location, loading]);

  // 2. جلب بيانات الرحلة
  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    getTripById(id)
      .then((res) => {
        if (!isMounted) return;
        const tripData = res?.data?.data || res?.data || res;
        setTrip(tripData);
        setLoading(false);
      })
      .catch((err) => {
        if (!isMounted) return;
        console.error("Error fetching trip details:", err);
        setError("Failed to load trip details");
        setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [id]);

  // دالة التوجيه لصفحة التخطيط (Step 1)
  const handleAddToTrip = () => {
    navigate("/plan", { state: { selectedTrip: trip } });
  };

  if (loading) {
    return <div className="p-10 text-center text-lg">Loading details...</div>;
  }

  if (error || !trip) {
    return <div className="p-10 text-center text-red-500">Trip not found</div>;
  }

  return (
    <div className="min-h-screen bg-[#FDFCF7] text-[#2B2319]">
      <SiteNavbar />

      {/* Hero Banner Section */}
      <div className="relative h-[420px] w-full overflow-hidden bg-black/40">
        <img
          src={trip.image || trip.imageUrl || "https://images.unsplash.com/photo-1503177112274-9fe29139ebe0?auto=format&fit=crop&q=80&w=1600"}
          alt={trip.title}
          className="h-full w-full object-cover opacity-80"
          onError={(e) => {
            e.target.src = "https://images.unsplash.com/photo-1503177112274-9fe29139ebe0?auto=format&fit=crop&q=80&w=1600";
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        <div className="absolute bottom-8 left-0 right-0 mx-auto max-w-[1200px] px-6 text-white">
          <h1 className="text-4xl font-extrabold sm:text-5xl">{trip.title}</h1>
          <div className="mt-3 flex items-center gap-6 text-sm text-gray-200">
            <span className="flex items-center gap-1.5"><MapPin className="h-4 w-4" /> {trip.location}</span>
            <span className="flex items-center gap-1.5"><Clock className="h-4 w-4" /> {trip.duration || "Duration not specified"}</span>
          </div>
        </div>
      </div>

      <main className="mx-auto max-w-[1200px] px-6 py-12">
        {/* Top Details & Plan Visit Card */}
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <h2 className="text-3xl font-extrabold text-[#2B2319]">{trip.title}</h2>
            <p className="mt-1 flex items-center gap-1 text-sm text-[#8C7A6B]">
              <MapPin className="h-4 w-4 text-[#C59B27]" /> {trip.location}
            </p>

            <div className="mt-6 space-y-4 text-sm leading-relaxed text-[#5A4D41]">
              <p>{trip.description}</p>
            </div>

            {/* Tags */}
            <div className="mt-8 flex flex-wrap gap-3">
              {["UNESCO HERITAGE", "ANCIENT RUINS", "HISTORIC SITE"].map((tag, i) => (
                <span key={i} className="rounded-full border border-[#D9CEBF] px-4 py-1.5 text-xs font-semibold text-[#8C7A6B]">
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Plan Visit Right Card */}
          <div className="rounded-[20px] border border-[#EBE4D8] bg-[#FAF7F2] p-6 shadow-xs">
            <h3 className="text-lg font-bold text-[#2B2319]">Plan Visit</h3>
            <div className="mt-6 space-y-3">
              <button
                onClick={handleAddToTrip}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#C59B27] py-3 text-sm font-bold text-white transition-all hover:bg-[#B08A20]"
              >
                <PlusCircle className="h-4 w-4" /> ADD TO MY TRIP
              </button>
              
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                  `${trip.title || ''} ${trip.location || ''}`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex w-full items-center justify-center gap-2 rounded-xl border border-[#D9CEBF] bg-white py-3 text-sm font-semibold text-[#5A4D41] transition-all hover:bg-[#F3EFEA]"
              >
                <Compass className="h-4 w-4" /> GET DIRECTIONS
              </a>
            </div>

            <div className="mt-6 space-y-3 border-t border-[#EBE4D8] pt-6 text-xs text-[#7A6B5D]">
              <div>
                <p className="font-bold text-[#2B2319]">Opening Hours</p>
                <p className="mt-0.5">{trip.openingHours || "6:00 AM - 5:30 PM (Daily)"}</p>
              </div>
              <div>
                <p className="font-bold text-[#2B2319]">Admission</p>
                <p className="mt-0.5">Adults: {trip.price ? `$${trip.price}` : "200 EGP"}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Dynamic Itinerary Section */}
        <div className="mt-16">
          <h2 className="text-xl font-bold uppercase tracking-wider text-[#2B2319]">ITINERARY</h2>
          
          <div className="mt-6 grid grid-cols-1 gap-8 lg:grid-cols-3">
            <div className="space-y-8 lg:col-span-2">
              {trip.itinerary && trip.itinerary.length > 0 ? (
                trip.itinerary.map((day) => (
                  <div key={day._id || day.dayNumber}>
                    <h3 className="font-bold text-[#2B2319]">
                      Day {day.dayNumber}: {day.title}
                    </h3>
                    {day.description && (
                      <p className="mt-1 text-xs text-[#8C7A6B]">{day.description}</p>
                    )}
                    
                    <div className="mt-4 space-y-3">
                      {day.activities && day.activities.length > 0 ? (
                        day.activities.map((act, idx) => (
                          <div
                            key={act._id || idx}
                            className="flex items-center justify-between gap-4 rounded-xl border border-[#EBE4D8] bg-white p-4 text-sm"
                          >
                            <div>
                              <p className="text-xs font-bold text-[#C59B27]">
                                {act.time} • {act.title}
                              </p>
                              {act.description && (
                                <p className="mt-1 text-xs text-[#5A4D41]">
                                  {act.description}
                                </p>
                              )}
                            </div>

                            <a
                              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                                `${act.title} ${trip.location || ''}`
                              )}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex shrink-0 items-center gap-1 rounded-lg border border-[#EBE4D8] bg-[#FAF7F2] px-3 py-1.5 text-xs font-semibold text-[#5A4D41] hover:bg-[#EBE4D8]"
                            >
                              <MapPin className="h-3.5 w-3.5 text-[#C59B27]" /> Map
                            </a>
                          </div>
                        ))
                      ) : (
                        <p className="text-xs text-[#8C7A6B]">No specific activities planned for this day.</p>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-[#8C7A6B]">No detailed itinerary available for this trip yet.</p>
              )}
            </div>

            {/* Google Maps Column */}
            <div className="h-[300px] w-full overflow-hidden rounded-2xl border border-[#EBE4D8] bg-[#1E293B] relative shadow-xs">
              <div className="absolute top-3 left-3 z-10 bg-[#0F172A]/90 px-3 py-1.5 rounded-md text-xs text-white font-medium shadow-md flex items-center gap-1.5">
                <span>📍</span>
                <span>{trip.location || trip.title}</span>
              </div>
              <iframe
                title="Google Map"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                loading="lazy"
                src={`https://maps.google.com/maps?q=${encodeURIComponent(
                  `${trip.title || ''} ${trip.location || 'Egypt'}`
                )}&t=&z=13&ie=UTF8&iwloc=&output=embed`}
              ></iframe>
            </div>
          </div>
        </div>

        {/* 🌟 Reviews Section With ID Scroll Anchor */}
        <div id="reviews" className="mt-16">
          <TripReviews />
        </div>

        {/* Trip Summary Section */}
        <div className="mt-16">
          <h2 className="text-xl font-bold uppercase tracking-wider text-[#2B2319]">TRIP SUMMARY</h2>
          <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
            <div className="rounded-xl bg-[#F3EFEA] p-4">
              <Wallet className="h-5 w-5 text-[#8C7A6B]" />
              <p className="mt-3 text-xs text-[#8C7A6B]">Estimated Budget</p>
              <p className="text-sm font-bold text-[#2B2319]">
                ${trip.price ? trip.price : "1,250"} / person
              </p>
            </div>
            <div className="rounded-xl bg-[#F3EFEA] p-4">
              <Hotel className="h-5 w-5 text-[#8C7A6B]" />
              <p className="mt-3 text-xs text-[#8C7A6B]">Hotel Bookings</p>
              <p className="text-sm font-bold text-[#2B2319]">Included</p>
            </div>
            <div className="rounded-xl bg-[#F3EFEA] p-4">
              <Ticket className="h-5 w-5 text-[#8C7A6B]" />
              <p className="mt-3 text-xs text-[#8C7A6B]">Attraction Tickets</p>
              <p className="text-sm font-bold text-[#2B2319]">Guided Tour</p>
            </div>
            <div className="rounded-xl bg-[#F3EFEA] p-4">
              <Bus className="h-5 w-5 text-[#8C7A6B]" />
              <p className="mt-3 text-xs text-[#8C7A6B]">Transportation</p>
              <p className="text-sm font-bold text-[#2B2319]">Transfers Incl.</p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}