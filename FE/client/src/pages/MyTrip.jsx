import React, { useState, useEffect } from "react";
import {
  AlertTriangle,
  BedDouble,
  CalendarDays,
  CircleArrowDown,
  Facebook,
  FileDown,
  Globe,
  Instagram,
  Map,
  MapPin,
  Plane,
  Receipt,
  Ticket,
  Twitter,
  WalletCards,
  X,
  Youtube,
  Loader2,
  Compass,
  PlusCircle,
  Sparkles,
} from "lucide-react";
import { Link } from "react-router-dom";
import SiteNavbar from "../components/layout/SiteNavbar";
import { useAuth } from "../context/AuthContext";
import { useApi } from "../hooks/useApi";
import { getMyTrip } from "../api/tripPlanApi";
import { getMyBookings, cancelBooking } from "../api/bookingsApi";
import { exportTripToPdf } from "../utils/exportTripPdf";
import homePic from "../assets/homePic.jpg";

function formatDate(value) {
  if (!value) return null;
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
  }).format(new Date(value));
}

function getActivityLocation(activity, cityName) {
  if (activity?.place?.name) return activity.place.name;
  if (activity?.location) return activity.location;
  if (activity?.notes) return activity.notes;
  if (cityName) return `Exploring ${cityName}`;
  return "Details coming soon";
}

function SummaryTile({ icon: Icon, title, value }) {
  return (
    <div className="flex h-[96px] flex-col justify-center rounded-[8px] border border-[#b5a37b] bg-[#fffefd] px-5 shadow-[0_3px_16px_rgba(69,50,0,0.02)]">
      <div className="mb-1.5 flex h-6 w-6 items-center justify-center rounded-md bg-[#5a4600] text-white">
        <Icon className="h-3.5 w-3.5" strokeWidth={2} />
      </div>
      <p className="text-[12px] font-medium leading-4 text-[#554a35]">
        {title}
      </p>
      <p className="text-[13px] font-semibold leading-4 text-[#302711]">
        {value}
      </p>
    </div>
  );
}

const actionStyles = {
  itinerary: { icon: Map, iconClass: "bg-[#dfe6ff] text-[#5367bd]" },
  budget: { icon: WalletCards, iconClass: "bg-[#ffe6ae] text-[#a77a16]" },
  bookings: { icon: Receipt, iconClass: "bg-[#f9d8cf] text-[#bd634f]" },
  offline: { icon: CircleArrowDown, iconClass: "bg-[#5a4600] text-white" },
};

export default function MyTrip() {
  const { user } = useAuth();

  // جلب البيانات عبر الـ Hooks
  const { data: activeTripResponse, loading: apiLoading } = useApi(getMyTrip);
  const { data: bookedTours, refetch: refetchBookings } = useApi(getMyBookings);

  const [activeView, setActiveView] = useState("itinerary");
  const [showAllDays, setShowAllDays] = useState(false);
  const [downloadingPdf, setDownloadingPdf] = useState(false);
  
  // حالات إلغاء الحجز والـ Modal
  const [cancelBookingId, setCancelBookingId] = useState(null);
  const [isCanceling, setIsCanceling] = useState(false);

  // منع تعليق الـ Loading بمؤقت زمني
  const [forceLoaded, setForceLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setForceLoaded(true);
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

  const tripLoading = apiLoading && !forceLoaded;

  // استخراج البيانات وتفكيك التغليف (Unwrapping)
  const rawData = activeTripResponse?.data || activeTripResponse;
  const currentTrip = rawData?.data || rawData || null;

  // التحقق من وجود رحلة فعلية أم لا
  const hasTrip = currentTrip && (
    (Array.isArray(currentTrip.itinerary) && currentTrip.itinerary.length > 0) ||
    (Array.isArray(currentTrip.days) && currentTrip.days.length > 0) ||
    (Array.isArray(currentTrip.tripPlan) && currentTrip.tripPlan.length > 0) ||
    currentTrip.title
  );

  // استخراج أراي برنامج الرحلة إن وجدت
  const itinerary = hasTrip
    ? currentTrip.itinerary || currentTrip.days || currentTrip.tripPlan || []
    : [];

  const visibleDays = showAllDays ? itinerary : itinerary.slice(0, 3);

  const destinations =
    hasTrip && Array.isArray(currentTrip.destinations) && currentTrip.destinations.length > 0
      ? currentTrip.destinations
      : ["Egypt Journey"];

  // تنزيل ملف الـ PDF
  const handleExportPdf = async () => {
    if (!hasTrip) return;
    setDownloadingPdf(true);
    try {
      await exportTripToPdf(currentTrip, user);
    } catch (error) {
      console.error("PDF export failed:", error);
    } finally {
      setDownloadingPdf(false);
    }
  };

  const handleCancelBooking = async () => {
    if (!cancelBookingId) return;

    setIsCanceling(true);
    const { error } = await cancelBooking(cancelBookingId);

    if (error) {
      console.error("Failed to cancel booking:", error);
      alert(error);
    } else {
      if (refetchBookings) {
        await refetchBookings();
      }
      setCancelBookingId(null);
    }
    
    setIsCanceling(false);
  };

  if (tripLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#FAF6ED] font-body text-[#302711]">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-[#5a4600]" />
          <p className="text-xs font-semibold text-[#705e35]">Loading your journey...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF6ED] font-body text-[#302711]">
      <SiteNavbar variant="my-trip" />
      <main className="bg-[#FAF6ED]">
        {/* Banner Section */}
        <section className="relative mt-[9px] h-[260px] overflow-hidden rounded-b-[3px]">
          <img
            src={homePic}
            alt="The pyramids of Giza"
            className="absolute inset-0 h-full w-full object-cover object-[35%_55%]"
          />
          <div className="absolute inset-0 bg-[#101329]/55" />
          <div className="relative mx-auto flex h-full max-w-[850px] flex-col justify-end px-5 pb-6 text-white">
            <h1 className="font-display text-[28px] font-bold capitalize leading-none sm:text-[32px]">
              {hasTrip
                ? currentTrip.title || `${user?.fullName ? user.fullName.split(" ")[0] + "'s" : "Your"} Egypt Journey`
                : `${user?.fullName ? user.fullName.split(" ")[0] + "'s" : "Your"} Egypt Journey`}
            </h1>
            <div className="mt-2.5 flex items-center gap-1.5 text-[12px] leading-none text-white/90">
              <MapPin className="h-[13px] w-[13px]" />
              <span className="capitalize">{hasTrip ? destinations.join(" · ") : "No active itinerary"}</span>
              {hasTrip && (
                <>
                  <span className="mx-1 text-white/55">|</span>
                  <CalendarDays className="h-[13px] w-[13px]" />
                  <span>{currentTrip.duration ? `${currentTrip.duration} Days` : `${itinerary.length} Days`}</span>
                </>
              )}
            </div>
          </div>
        </section>

        <div className="relative mx-auto w-[88vw] max-w-[1080px] px-0 pb-0">
          {/* Action Grid */}
          <div className="relative grid grid-cols-2 gap-4 pt-[57px] sm:grid-cols-4">
            {Object.entries(actionStyles).map(
              ([key, { icon: Icon, iconClass }]) => (
                <button
                  key={key}
                  type="button"
                  disabled={!hasTrip && key === "offline"}
                  onClick={() => {
                    if (key === "offline") {
                      handleExportPdf();
                      return;
                    }
                    setActiveView(key);
                    if (key === "itinerary")
                      document
                        .getElementById("upcoming")
                        ?.scrollIntoView({ behavior: "smooth" });
                  }}
                  className={`flex h-[98px] flex-col items-center justify-center rounded-[8px] border border-[#b5a37b] bg-white text-[16px] font-semibold text-[#4f3c04] shadow-[0_4px_10px_rgba(69,50,0,0.03)] transition-colors hover:bg-[#fffcf1] ${
                    !hasTrip && key === "offline" ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  <span
                    className={`mb-2.5 flex h-[30px] w-[30px] items-center justify-center rounded-full ${iconClass}`}
                  >
                    <Icon className="h-[15px] w-[15px]" strokeWidth={1.8} />
                  </span>
                  {key === "offline"
                    ? "Offline Pack"
                    : key[0].toUpperCase() + key.slice(1)}
                </button>
              )
            )}
          </div>

          {/* 🔴 حالة عدم وجود رحلة (Empty State Container) */}
          {!hasTrip ? (
            <section className="relative mt-12 flex flex-col items-center justify-center rounded-[16px] border border-dashed border-[#b5a37b] bg-white/70 px-6 py-12 text-center shadow-sm">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#f6edda] text-[#654b08]">
                <Sparkles className="h-8 w-8" />
              </div>
              <h3 className="mt-4 font-display text-[22px] font-bold text-[#4a3700]">
                No trip plan created yet
              </h3>
              <p className="mt-2 max-w-[420px] text-[14px] text-[#766f62]">
                You haven't planned a customized journey to Egypt yet. Start creating your AI trip plan or explore curated places!
              </p>

              {/* أزرار الاقتراحات والإجراءات */}
              <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                <Link
                  to="/plan"
                  className="flex items-center gap-2 rounded-lg bg-[#5a4600] px-5 py-2.5 text-[14px] font-semibold text-white shadow-sm transition-all hover:bg-[#433400]"
                >
                  <PlusCircle className="h-4 w-4" />
                  Create New Trip
                </Link>

                <Link
                  to="/services"
                  className="flex items-center gap-2 rounded-lg border border-[#b5a37b] bg-white px-5 py-2.5 text-[14px] font-semibold text-[#4a3700] shadow-sm transition-all hover:bg-[#FAF6ED]"
                >
                  <Compass className="h-4 w-4" />
                  Explore Services & Attractions
                </Link>
              </div>
            </section>
          ) : (
            <>
              {/* Itinerary Tab */}
              {activeView === "itinerary" && (
                <section id="upcoming" className="relative pt-[80px]">
                  <div className="mb-4 flex items-center justify-between">
                    <h2 className="font-display text-[26px] font-semibold text-[#654b08]">
                      Upcoming
                    </h2>
                    {itinerary.length > 3 && (
                      <button
                        type="button"
                        onClick={() => setShowAllDays(!showAllDays)}
                        className="text-[13px] font-medium text-[#7185d3] hover:underline"
                      >
                        {showAllDays ? "Show Upcoming" : "View Full Itinerary"}
                      </button>
                    )}
                  </div>

                  <div className="space-y-[12px]">
                    {visibleDays.map((dayPlan, index) => {
                      const dayNum = dayPlan.dayNumber || dayPlan.day || index + 1;
                      const activitiesList = dayPlan.activities || dayPlan.items || [];
                      const activity = activitiesList[0] || {};
                      const currentCity = dayPlan.city || dayPlan.destination || destinations[index % destinations.length];

                      const title =
                        activity.title || activity.name || `Explore ${currentCity}`;
                      const dateDisplay =
                        formatDate(dayPlan.date) || String(dayNum).padStart(2, "0");
                      const isTravelDay = /luxor|journey|fly|train|flight/i.test(title);

                      return (
                        <article
                          key={dayNum}
                          className={`flex min-h-[86px] items-center rounded-[8px] border border-[#b5a37b] bg-white px-5 ${
                            isTravelDay ? "border-r-4 border-r-[#d67850]" : ""
                          }`}
                        >
                          <div className="mr-5 flex h-[52px] w-[54px] flex-shrink-0 flex-col items-center justify-center rounded-[6px] bg-[#f7f7f5] text-[#705e35]">
                            <span className="text-[11px] leading-4">
                              DAY {dayNum}
                            </span>
                            <span className="text-[17px] font-semibold leading-4">
                              {dateDisplay}
                            </span>
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2">
                              <h3 className="truncate text-[15px] font-semibold capitalize text-[#4a3700]">
                                {title}
                              </h3>
                              {isTravelDay && (
                                <span className="rounded-[3px] bg-[#f6d4c9] px-2 py-0.5 text-[9px] font-medium text-[#9e4e3a]">
                                  TRAVEL DAY
                                </span>
                              )}
                            </div>
                            <p className="mt-[5px] flex items-center gap-1.5 truncate text-[12px] capitalize text-[#766f62]">
                              <MapPin className="h-[11px] w-[11px] flex-shrink-0" />
                              {getActivityLocation(activity, currentCity)}
                            </p>
                          </div>

                          <Link
                            to="/plan/itinerary"
                            className="ml-4 flex h-[34px] w-[76px] flex-shrink-0 items-center justify-center rounded-[5px] border border-[#b6b6b6] text-[12px] font-medium text-[#4d4638] transition-colors hover:border-[#634b00] hover:bg-[#634b00] hover:text-white"
                          >
                            Details
                          </Link>
                        </article>
                      );
                    })}
                  </div>
                </section>
              )}

              {/* Bookings Tab */}
              {activeView === "bookings" && (
                <section className="relative pt-[80px]">
                  <div className="flex items-center justify-between border-b border-[#e5dfd1] pb-3">
                    <h2 className="font-display text-[26px] font-semibold text-[#654b08]">
                      Bookings
                    </h2>
                    <button
                      type="button"
                      onClick={() => setActiveView("itinerary")}
                      className="text-[13px] text-[#7185d3]"
                    >
                      Back to itinerary
                    </button>
                  </div>
                  <div className="mt-4 space-y-3">
                    {(bookedTours || []).map((booking) => (
                      <div
                        key={booking._id || booking.id}
                        className="flex items-center justify-between rounded-[8px] border border-[#b5a37b] p-5 text-sm"
                      >
                        <span className="text-[15px] font-medium">
                          {booking.title || booking.tourName || "Booked service"}
                        </span>
                        <button
                          type="button"
                          onClick={() => setCancelBookingId(booking._id || booking.id)}
                          className="rounded border border-red-200 px-3 py-1 text-xs text-red-600 transition-colors hover:bg-red-50 hover:underline"
                        >
                          Cancel
                        </button>
                      </div>
                    ))}
                    {!bookedTours?.length && (
                      <p className="text-xs text-[#766f62]">No active bookings found.</p>
                    )}
                  </div>
                </section>
              )}

              {/* Budget Tab */}
              {activeView === "budget" && (
                <section className="relative pt-[80px]">
                  <div className="flex items-center justify-between border-b border-[#e5dfd1] pb-3">
                    <h2 className="font-display text-[26px] font-semibold text-[#654b08]">
                      Budget
                    </h2>
                    <button
                      type="button"
                      onClick={() => setActiveView("itinerary")}
                      className="text-[13px] text-[#7185d3]"
                    >
                      Back to itinerary
                    </button>
                  </div>
                  <p className="mt-4 text-base text-[#766f62]">
                    Estimated budget: ${currentTrip?.budget || 0} USD
                  </p>
                </section>
              )}

              {/* Summary Tiles */}
              {activeView === "itinerary" && (
                <div className="mt-[80px] grid grid-cols-2 gap-4 sm:grid-cols-4">
                  <SummaryTile
                    icon={Receipt}
                    title="Estimated Budget"
                    value={`$${currentTrip?.budget || 0} / person`}
                  />
                  <SummaryTile
                    icon={BedDouble}
                    title="Hotel Bookings"
                    value={bookedTours?.length ? "Booked" : "Pending"}
                  />
                  <SummaryTile
                    icon={Ticket}
                    title="Attraction Tickets"
                    value="Purchased"
                  />
                  <SummaryTile
                    icon={Plane}
                    title="Transportation"
                    value="Scheduled"
                  />
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        <footer className="mt-[80px] bg-[#1a1714] pb-8 pt-14 text-[#d8d3cb]">
          <div className="mx-auto max-w-[1180px] px-6">
            <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
              <div className="lg:col-span-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full border border-[#8c7b5a] text-[13px] font-bold text-[#d8c090]">
                    E
                  </div>
                  <div>
                    <h3 className="font-display text-[15px] font-bold tracking-wider text-white">
                      EGYPT
                    </h3>
                    <p className="text-[10px] tracking-widest text-[#a3998b]">
                      TRAVEL COMPANION
                    </p>
                  </div>
                </div>
                <p className="mt-5 text-[13px] leading-relaxed text-[#a3998b]">
                  Explore Egypt with a plan that fits your journey.
                </p>
                <div className="mt-5 flex items-center gap-2.5">
                  {[Facebook, Instagram, Twitter, Youtube].map(
                    (Icon, index) => (
                      <a
                        key={index}
                        href="#"
                        className="flex h-8 w-8 items-center justify-center rounded-full border border-white/10 text-white/70 transition-colors hover:border-white/30 hover:text-white"
                      >
                        <Icon className="h-3.5 w-3.5" />
                      </a>
                    )
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-8 sm:grid-cols-4 lg:col-span-6">
                <div>
                  <h4 className="text-[14px] font-semibold text-white">Explore</h4>
                  <ul className="mt-4 space-y-2.5 text-[13px] text-[#a3998b]">
                    <li><a href="#" className="hover:text-white">Destinations</a></li>
                    <li><a href="#" className="hover:text-white">Attractions</a></li>
                    <li><a href="#" className="hover:text-white">Activities</a></li>
                    <li><a href="#" className="hover:text-white">Restaurants</a></li>
                  </ul>
                </div>

                <div>
                  <h4 className="text-[14px] font-semibold text-white">My Trip</h4>
                  <ul className="mt-4 space-y-2.5 text-[13px] text-[#a3998b]">
                    <li><a href="#" className="hover:text-white">My Itinerary</a></li>
                    <li><a href="#" className="hover:text-white">Saved Places</a></li>
                    <li><a href="#" className="hover:text-white">Offline Maps</a></li>
                    <li><a href="#" className="hover:text-white">Trip Details</a></li>
                  </ul>
                </div>

                <div>
                  <h4 className="text-[14px] font-semibold text-white">Services</h4>
                  <ul className="mt-4 space-y-2.5 text-[13px] text-[#a3998b]">
                    <li><a href="#" className="hover:text-white">Visa</a></li>
                    <li><a href="#" className="hover:text-white">Transportation</a></li>
                    <li><a href="#" className="hover:text-white">Accommodation</a></li>
                    <li><a href="#" className="hover:text-white">Travel Insurance</a></li>
                  </ul>
                </div>

                <div>
                  <h4 className="text-[14px] font-semibold text-white">Support</h4>
                  <ul className="mt-4 space-y-2.5 text-[13px] text-[#a3998b]">
                    <li><a href="#" className="hover:text-white">Help Center</a></li>
                    <li><a href="#" className="hover:text-white">Contact Us</a></li>
                    <li><a href="#" className="hover:text-white">About Us</a></li>
                    <li><a href="#" className="hover:text-white">Terms & Privacy</a></li>
                  </ul>
                </div>
              </div>

              <div className="lg:col-span-3 lg:flex lg:justify-end">
                <div className="w-full rounded-xl border border-white/10 bg-[#231f1a] p-4 sm:max-w-[260px]">
                  <div className="flex items-start gap-2.5">
                    <AlertTriangle className="mt-0.5 h-4 w-4 text-[#d8c090]" />
                    <div>
                      <h5 className="text-[13px] font-semibold text-[#d8c090]">Emergency</h5>
                      <p className="mt-1 text-[11px] text-[#a3998b]">Get help in case of any emergency</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    className="mt-3.5 w-full rounded-lg bg-[#c49a45] py-2 text-[12px] font-semibold text-[#1a1714] transition-colors hover:bg-[#b0883b]"
                  >
                    Open SOS
                  </button>
                </div>
              </div>
            </div>

            <div className="mt-12 flex flex-col items-center justify-between border-t border-white/10 pt-6 text-[12px] text-[#a3998b] sm:flex-row">
              <p>© 2026 Egypt Travel Companion. All rights reserved.</p>
              <div className="mt-3 flex items-center gap-1.5 sm:mt-0">
                <Globe className="h-3.5 w-3.5" />
                <span>English</span>
              </div>
            </div>
          </div>
        </footer>
      </main>

      {/* Confirmation Modal for Booking Cancellation */}
      {cancelBookingId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="relative w-full max-w-md rounded-xl bg-white p-6 text-center shadow-2xl">
            <button
              type="button"
              disabled={isCanceling}
              onClick={() => setCancelBookingId(null)}
              className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 disabled:opacity-50"
            >
              <X className="h-5 w-5" />
            </button>

            <h3 className="font-display text-xl font-bold text-[#302711]">
              Cancel booking?
            </h3>
            <p className="mt-2 text-xs text-gray-500">
              This action cannot be undone. Are you sure you want to proceed?
            </p>

            <div className="mt-6 flex justify-center gap-3">
              <button
                type="button"
                disabled={isCanceling}
                onClick={() => setCancelBookingId(null)}
                className="rounded-lg border border-gray-300 px-4 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-50"
              >
                Keep Booking
              </button>

              <button
                type="button"
                disabled={isCanceling}
                onClick={handleCancelBooking}
                className="flex items-center gap-2 rounded-lg bg-red-600 px-5 py-2 text-xs font-semibold text-white shadow-sm hover:bg-red-700 disabled:opacity-50"
              >
                {isCanceling ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    Canceling...
                  </>
                ) : (
                  "Confirm cancellation"
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {downloadingPdf && (
        <div className="sr-only" role="status">
          Generating PDF
        </div>
      )}
      <button type="button" onClick={handleExportPdf} className="sr-only">
        <FileDown />
      </button>
    </div>
  );
}