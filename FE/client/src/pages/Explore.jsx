import React, { useMemo, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Accessibility,
  BedDouble,
  Bike,
  Heart,
  MapPin,
  Mic,
  Plus,
  Search,
  Star,
  Utensils,
  X,
  Clock,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Loader2,
} from "lucide-react";
import SiteNavbar from "../components/layout/SiteNavbar";
import Footer from "../components/layout/Footer";
import AsyncState from "../components/common/AsyncState";
import { useApi } from "../hooks/useApi";
import { getAllPlaces } from "../api/placesApi";
import pyramidsHero from "../assets/pyramidExplore.jpg";
import banner from "../assets/banner.jpg";

const DESTINATIONS = [
  "All Egypt",
  "Cairo",
  "Luxor",
  "Aswan",
  "South Sinai",
  "Alexandria",
];

const CATEGORIES = [
  { label: "Stay", icon: BedDouble },
  { label: "Food", icon: Utensils },
  { label: "Transport", icon: Bike },
  { label: "Activities", icon: Accessibility },
];

function getPlaceImage(place) {
  return place.images?.find(Boolean) || null;
}

function placeMatchesDestination(place, destination) {
  if (destination === "All Egypt") return true;
  return `${place.name} ${place.location?.address || ""}`
    .toLowerCase()
    .includes(destination.toLowerCase());
}

export default function Explore() {
  const [search, setSearch] = useState("");
  const [destination, setDestination] = useState("All Egypt");
  const { data: places, loading, error, refetch } = useApi(getAllPlaces);

  // States for Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6; // يمكنك تغيير عدد العناصر في الصفحة الواحدة من هنا

  // States for "Add to My Trip" Modal
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [selectedDay, setSelectedDay] = useState("");
  const [selectedTime, setSelectedTime] = useState("10:00 AM");
  const [userTrips, setUserTrips] = useState([]);
  const [activeTrip, setActiveTrip] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch active user trips to populate days dropdown
  useEffect(() => {
    const fetchTrips = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("/api/v1/trips", {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        if (res.ok) {
          const data = await res.json();
          const trips = data.data || data;
          if (Array.isArray(trips) && trips.length > 0) {
            setUserTrips(trips);
            setActiveTrip(trips[0]); // Default to first trip
          }
        }
      } catch (err) {
        console.warn("Notice: Fetching trips for modal setup", err);
      }
    };
    fetchTrips();
  }, []);

  const filteredPlaces = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();
    return (places || []).filter((place) => {
      const searchableText = `${place.name} ${place.description || ""} ${
        place.location?.address || ""
      }`.toLowerCase();
      return (
        placeMatchesDestination(place, destination) &&
        (!normalizedSearch || searchableText.includes(normalizedSearch))
      );
    });
  }, [places, search, destination]);

  // Reset to page 1 whenever search or destination changes
  useEffect(() => {
    setCurrentPage(1);
  }, [search, destination]);

  // Calculate paginated places
  const totalPages = Math.ceil((filteredPlaces?.length || 0) / itemsPerPage);
  const paginatedPlaces = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredPlaces.slice(start, start + itemsPerPage);
  }, [filteredPlaces, currentPage, itemsPerPage]);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleOpenAddModal = (e, place) => {
    e.preventDefault();
    e.stopPropagation();
    setSelectedPlace(place);
    setSelectedDay("");
    setSelectedTime("10:00 AM");
  };

  const handleCloseModal = () => {
    setSelectedPlace(null);
  };

  const handleAddToTripSubmit = async () => {
    if (!selectedDay) {
      alert("Please select a day for your itinerary");
      return;
    }

    setIsSubmitting(true);
    try {
      const token = localStorage.getItem("token");
      const tripId = activeTrip?._id || "1";

      const res = await fetch(`/api/v1/trip-plans`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          tripId: tripId,
          dayNumber: Number(selectedDay),
          activity: {
            title: selectedPlace.name,
            location: selectedPlace.location?.address || "Egypt",
            time: selectedTime,
            image: getPlaceImage(selectedPlace),
            placeId: selectedPlace._id,
          },
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to add place");
      }

      handleCloseModal();
    } catch (err) {
      handleCloseModal();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-dvh bg-[#FAF6ED] font-body text-[#3B2F1E]">
      <SiteNavbar />

      <main className="mx-auto max-w-[1240px] px-4 pb-24 sm:px-8">
        <section className="relative mt-1 h-[315px] overflow-hidden rounded-b-[14px]">
          <img
            src={pyramidsHero}
            alt="The pyramids of Giza"
            className="h-full w-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-[#401C00]/40" />
          <div className="absolute inset-x-0 top-0 h-[135px] bg-[#401C00]/20" />

          <div className="absolute inset-x-4 top-8 text-center text-white sm:top-10">
            <h1 className="text-[38px] font-bold leading-none text-[#F7E9C9] drop-shadow-[0_3px_6px_rgba(0,0,0,0.75)] sm:text-[42px]">
              Explore EGYPT
            </h1>
            <p className="mt-3 text-[16px] text-[#FFF7E8]">
              Discover places and experiences across Egypt
            </p>
          </div>

          <label className="absolute inset-x-4 top-[170px] mx-auto flex h-[48px] max-w-[920px] items-center gap-3 rounded-[12px] border border-[#D8C8A7] bg-[#FFFDF8] px-4 text-[#6F6657] shadow-lg sm:inset-x-16">
            <Search className="h-4 w-4 shrink-0" />
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="search place, activities..."
              className="min-w-0 flex-1 bg-transparent text-sm text-[#3B2F1E] outline-none placeholder:text-[#A9A093]"
              aria-label="Search places and activities"
            />
            <Mic className="h-4 w-4 shrink-0" />
          </label>
        </section>

        <section className="mx-auto mt-7 w-full max-w-[920px]">
          <h2 className="text-[16px] font-medium text-[#5C4000]">
            Explore by destination
          </h2>
          <div className="mt-3 flex flex-wrap gap-2">
            {DESTINATIONS.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setDestination(item)}
                className={`rounded-[8px] border px-5 py-2 text-[13px] transition-colors ${
                  destination === item
                    ? "border-[#5C4000] bg-[#5C4000] text-white"
                    : "border-[#D7C7B2] bg-[#FFF9F0] text-[#6B5B48] hover:border-[#5C4000]"
                }`}
              >
                {item}
              </button>
            ))}
          </div>
        </section>

        <section className="mx-auto mt-16 w-full max-w-[920px]">
          <h2 className="text-[16px] font-medium text-[#5C4000]">
            Popular places
          </h2>
          <AsyncState
            loading={loading}
            error={error}
            data={filteredPlaces}
            onRetry={refetch}
            emptyMessage="No places match your search."
            loadingLabel="Loading places..."
          >
            {() => (
              <>
                <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {paginatedPlaces.map((place) => {
                    const image = getPlaceImage(place);
                    if (!image) return null;

                    return (
                      <Link
                        key={place._id}
                        to={`/explore/${place._id}`}
                        className="group relative h-[142px] overflow-hidden rounded-[8px] shadow-sm"
                      >
                        <img
                          src={image}
                          alt={place.name}
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#401C00]/85 via-[#401C00]/25 to-transparent" />
                        <button
                          type="button"
                          aria-label={`Save ${place.name}`}
                          onClick={(event) => event.preventDefault()}
                          className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-[#FFFDF8]/90 text-[#6B5B48]"
                        >
                          <Heart className="h-4 w-4" />
                        </button>
                        <div className="absolute inset-x-3 bottom-2 text-white">
                          <div className="flex items-end justify-between gap-2">
                            <div className="min-w-0">
                              <h3 className="truncate text-[15px] font-semibold">
                                {place.name}
                              </h3>
                              <p className="truncate text-[9px] text-white/80">
                                <MapPin className="mr-0.5 inline h-2.5 w-2.5" />
                                {place.location?.address || "Egypt"}
                              </p>
                            </div>
                            <span className="flex shrink-0 items-center gap-0.5 text-[9px]">
                              <Star className="h-3 w-3 fill-[#F1C25B] text-[#F1C25B]" />{" "}
                              4.8
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={(e) => handleOpenAddModal(e, place)}
                            className="mt-1 flex w-fit items-center gap-1 rounded-full border border-[#F1C25B] px-2 py-0.5 text-[8px] font-semibold uppercase hover:bg-[#F1C25B] hover:text-[#401C00] transition-colors"
                          >
                            Add to my trip <Plus className="h-3 w-3" />
                          </button>
                        </div>
                      </Link>
                    );
                  })}
                </div>

                {/* Pagination Controls */}
                {totalPages > 1 && (
                  <div className="mt-8 flex items-center justify-center gap-2">
                    <button
                      type="button"
                      disabled={currentPage === 1}
                      onClick={() => handlePageChange(currentPage - 1)}
                      className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#D7C7B2] bg-[#FFF9F0] text-[#5C4000] disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#E3D2B4] transition-colors"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </button>

                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                      (page) => (
                        <button
                          key={page}
                          type="button"
                          onClick={() => handlePageChange(page)}
                          className={`h-8 w-8 rounded-lg text-xs font-semibold transition-colors ${
                            currentPage === page
                              ? "bg-[#5C4000] text-white"
                              : "border border-[#D7C7B2] bg-[#FFF9F0] text-[#6B5B48] hover:border-[#5C4000]"
                          }`}
                        >
                          {page}
                        </button>
                      ),
                    )}

                    <button
                      type="button"
                      disabled={currentPage === totalPages}
                      onClick={() => handlePageChange(currentPage + 1)}
                      className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#D7C7B2] bg-[#FFF9F0] text-[#5C4000] disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#E3D2B4] transition-colors"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>
                )}
              </>
            )}
          </AsyncState>
        </section>

        <section className="mx-auto mt-20 max-w-[920px] rounded-[10px] bg-[#E3D2B4] px-6 py-7 text-center">
          <h2 className="text-[18px] font-semibold text-[#3B2F1E]">
            Need something else?
          </h2>
          <div className="mt-4 flex justify-center gap-8">
            {CATEGORIES.map(({ label, icon: Icon }) => (
              <button
                key={label}
                type="button"
                className="flex flex-col items-center gap-1 text-[15px] font-semibold text-[#5C4000]"
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white">
                  <Icon className="h-4 w-4" />
                </span>
                {label}
              </button>
            ))}
          </div>
        </section>

        <section className="relative mx-auto mt-20 max-w-[920px] overflow-hidden rounded-[8px] bg-[#401C00] px-8 py-8 text-white">
          <img
            src={banner}
            alt=""
            aria-hidden="true"
            className="absolute inset-0 h-full w-full object-cover opacity-35"
          />
          <div className="relative flex items-center justify-around gap-4">
            <div>
              <h2 className="text-[28px] font-bold">
                Ready to plan your trip?
              </h2>
              <p className="mt-1 text-[15px] text-white/80">
                Let AI create a personalized journey for you
              </p>
            </div>
            <Link
              to="/plan"
              className="rounded-[6px] bg-[#C65D00] px-5 py-3 text-[12px] font-semibold text-white"
            >
              Start Planning
            </Link>
          </div>
        </section>
      </main>

      {/* POP-UP MODAL */}
      {selectedPlace && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-xs">
          <div className="w-full max-w-[420px] overflow-hidden rounded-[20px] bg-[#FAF8F5] shadow-2xl">
            <div className="flex items-center justify-between px-6 pt-5 pb-3 bg-[#FAF8F5]">
              <h3 className="text-[19px] font-bold text-[#3B2F1E]">
                Add to your trip
              </h3>
              <button
                type="button"
                onClick={handleCloseModal}
                className="text-[#3B2F1E] hover:opacity-70 transition-opacity"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="bg-[#FFF3D6] px-6 py-5 space-y-4">
              <div className="flex items-center gap-3 rounded-[12px] bg-[#F2EEF8]/70 p-3 shadow-xs">
                <img
                  src={
                    getPlaceImage(selectedPlace) ||
                    "https://images.unsplash.com/photo-1503177119275-0aa32b3a9368?q=80&w=800"
                  }
                  alt={selectedPlace.name}
                  className="h-16 w-16 rounded-[8px] object-cover shrink-0"
                />
                <div className="min-w-0 flex-1">
                  <h4 className="truncate text-[16px] font-bold text-[#3B2F1E]">
                    {selectedPlace.name}
                  </h4>
                  <p className="mt-0.5 flex items-center gap-1 text-[12px] text-[#7A6C58]">
                    <MapPin className="h-3 w-3 shrink-0 text-[#7A6C58]" />
                    <span className="truncate">
                      {selectedPlace.location?.address || "Luxor, Egypt"}
                    </span>
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-[12px] font-medium text-[#5C4000] mb-1.5">
                  Choose Day
                </label>
                <div className="relative">
                  <select
                    value={selectedDay}
                    onChange={(e) => setSelectedDay(e.target.value)}
                    className="w-full appearance-none rounded-[8px] border border-[#C2B59B] bg-[#EDE8DC] px-4 py-2.5 text-[13px] text-[#3B2F1E] outline-none cursor-pointer"
                  >
                    <option value="" disabled>
                      Select a day in your itinerary
                    </option>
                    <option value="1">Day 1</option>
                    <option value="2">Day 2</option>
                    <option value="3">Day 3</option>
                    <option value="4">Day 4</option>
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#3B2F1E]" />
                </div>
              </div>

              <div>
                <label className="block text-[12px] font-medium text-[#5C4000] mb-1.5">
                  Choose Time
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={selectedTime}
                    onChange={(e) => setSelectedTime(e.target.value)}
                    placeholder="10:00 AM"
                    className="w-full rounded-[8px] border border-[#C2B59B] bg-[#EDE8DC] px-4 py-2.5 text-[13px] text-[#3B2F1E] outline-none"
                  />
                  <Clock className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#3B2F1E]" />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 px-6 py-4 bg-[#FAF8F5]">
              <button
                type="button"
                onClick={handleCloseModal}
                className="rounded-[8px] border border-[#5C4000] px-6 py-2 text-[13px] font-medium text-[#3B2F1E] hover:bg-[#EDE8DC] transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isSubmitting}
                onClick={handleAddToTripSubmit}
                className="flex items-center gap-1.5 rounded-[8px] bg-[#423102] px-6 py-2 text-[13px] font-medium text-white hover:bg-[#2B2001] transition-colors disabled:opacity-50"
              >
                {isSubmitting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    <Plus className="h-3.5 w-3.5" /> Add
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
