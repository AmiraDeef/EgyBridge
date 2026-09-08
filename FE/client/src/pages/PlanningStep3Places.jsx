import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, ArrowRight, Search, X, Loader2 } from "lucide-react";
import SiteNavbar from "../components/layout/SiteNavbar";
import { usePlanningDraft } from "../context/PlanningContext";
import { getAllTrips } from "../api/tripsApi"; // تعديل مسار الاستيراد بحسب مجلدك

export default function PlanningStep3Places() {
  const navigate = useNavigate();
  const { draft, updateDraft } = usePlanningDraft();

  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDestinations, setSelectedDestinations] = useState(
    draft?.selectedDestinations || []
  );

  // جلب الرحلات باستخدام getAllTrips
  useEffect(() => {
    async function fetchDestinations() {
      setLoading(true);
      const { data, error: apiError } = await getAllTrips();

      if (apiError) {
        setError(apiError);
      } else if (data) {
        // تحويل البيانات المستلمة لتوحيد بناء الأوبجكت للواجهة
        const formatted = (Array.isArray(data) ? data : data.trips || []).map((item) => ({
          id: item._id,
          title: item.title || item.location,
          subtitle: item.description || item.location,
          image: item.image || (item.images && item.images[0]) || "https://images.unsplash.com/photo-1572252009286-268acec5ca0a?auto=format&fit=crop&w=800&q=80",
        }));
        setDestinations(formatted);
      }
      setLoading(false);
    }

    fetchDestinations();
  }, []);

  const toggleDestination = (id) => {
    setSelectedDestinations((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const removeSelected = (id) => {
    setSelectedDestinations((prev) => prev.filter((item) => item !== id));
  };

  const handleContinue = () => {
    updateDraft("selectedDestinations", selectedDestinations);
    navigate("/plan/preferences");
  };

  const filteredDestinations = destinations.filter(
    (item) =>
      item.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.subtitle?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#FAF6ED] font-sans text-[#1A1A1A] pb-24">
      <SiteNavbar />

      <main className="mx-auto max-w-4xl px-6 py-8">
        {/* Navigation Bar Top */}
        <div className="mb-8 flex items-center justify-between border-b border-gray-100 pb-4 text-xs font-medium text-gray-500">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="flex items-center gap-1.5 transition hover:text-black"
          >
            <ChevronLeft className="h-4 w-4" /> Back
          </button>
          <span>Step 3 of 5</span>
        </div>

        {/* Title & Subtitle */}
        <div className="mb-8 text-center">
          <h2 className="mb-2 text-3xl font-extrabold text-black">
            Where do you want to go?
          </h2>
          <p className="text-xs text-gray-500">
            Search or select your preferred destinations.
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative mx-auto mb-6 max-w-2xl">
          <div className="flex items-center rounded-2xl border border-[#EFE8D8] bg-[#FAF6EE] px-4 py-3 shadow-inner">
            <Search className="mr-2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search destinations/places..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-transparent text-xs text-gray-800 placeholder-gray-400 outline-none"
            />
            {searchQuery && (
              <button type="button" onClick={() => setSearchQuery("")}>
                <X className="h-4 w-4 text-gray-400 hover:text-black" />
              </button>
            )}
          </div>
        </div>

        {/* Selected Destinations Tags */}
        <div className="mx-auto mb-10 max-w-2xl">
          <span className="mb-2 block text-[10px] font-bold tracking-wider uppercase text-gray-400">
            SELECTED
          </span>
          <div className="flex min-h-[44px] flex-wrap gap-2 rounded-xl border border-gray-100 bg-gray-50 p-2.5">
            {selectedDestinations.length === 0 && (
              <span className="self-center px-1 text-xs italic text-gray-400">
                No destinations selected yet.
              </span>
            )}
            {selectedDestinations.map((id) => {
              const item = destinations.find((d) => d.id === id);
              if (!item) return null;
              return (
                <span
                  key={id}
                  className="inline-flex items-center gap-1.5 rounded-md border border-gray-200 bg-white px-2.5 py-1 text-xs font-bold text-gray-800 shadow-sm"
                >
                  {item.title}
                  <button
                    type="button"
                    onClick={() => removeSelected(id)}
                    className="transition hover:text-red-500"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              );
            })}
          </div>
        </div>

        {/* Popular Destinations Grid / States */}
        <div className="mx-auto mb-12 max-w-3xl">
          <h3 className="mb-4 text-xs font-bold tracking-wider uppercase text-gray-400">
            POPULAR DESTINATIONS
          </h3>

          {loading ? (
            <div className="flex h-40 items-center justify-center gap-2 text-gray-500">
              <Loader2 className="h-6 w-6 animate-spin" />
              <span>Loading destinations...</span>
            </div>
          ) : error ? (
            <div className="py-8 text-center text-xs text-red-500">{error}</div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredDestinations.map((dest) => {
                const isSelected = selectedDestinations.includes(dest.id);
                return (
                  <div
                    key={dest.id}
                    onClick={() => toggleDestination(dest.id)}
                    className={`group relative h-[400px] cursor-pointer overflow-hidden rounded-[24px] transition-all duration-300 hover:-translate-y-1.5 ${
                      isSelected ? "ring-4 ring-[#B89332]" : ""
                    }`}
                  >
                    {/* Background Image */}
                    <img
                      src={dest.image}
                      alt={dest.title}
                      referrerPolicy="no-referrer"
                      crossOrigin="anonymous"
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />

                    {/* Card Content */}
                    <div className="absolute inset-x-0 bottom-0 p-5 text-white">
                      <h4 className="mb-1 text-lg font-bold">{dest.title}</h4>
                      <p className="mb-4 text-[11px] leading-tight text-gray-300 line-clamp-2">
                        {dest.subtitle}
                      </p>

                      <button
                        type="button"
                        className={`inline-flex items-center justify-center gap-1.5 rounded-lg border px-3.5 py-1.5 text-[11px] font-bold text-white backdrop-blur-md transition ${
                          isSelected
                            ? "border-[#B89332] bg-[#B89332]"
                            : "border-white/20 bg-black/60 hover:bg-black"
                        }`}
                      >
                        <span>{isSelected ? "selected" : "select"}</span>
                        <ArrowRight className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Bottom Continue Button */}
        <div className="mx-auto flex max-w-md justify-center">
          <button
            type="button"
            onClick={handleContinue}
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#B89332] py-3.5 text-xs font-bold uppercase tracking-wider text-white shadow-lg transition hover:bg-[#9E7A26]"
          >
            <span>continue</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </main>
    </div>
  );
}