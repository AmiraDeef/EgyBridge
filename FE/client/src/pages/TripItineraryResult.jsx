import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Calendar,
  Wallet,
  Pencil,
  Bookmark,
  Utensils,
  Car,
  Download,
  ArrowRight,
  Landmark,
  Loader2,
} from "lucide-react";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

import SiteNavbar from "../components/layout/SiteNavbar";
import OfflinePackModal from "../components/common/OfflinePackModal";
import axiosInstance from "../api/axiosInstance";

import markerIconPng from "leaflet/dist/images/marker-icon.png";
import markerShadowPng from "leaflet/dist/images/marker-shadow.png";

const customIcon = L.icon({
  iconUrl: markerIconPng,
  shadowUrl: markerShadowPng,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

export default function TripItineraryResult() {
  const navigate = useNavigate();
  const [tripData, setTripData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isOfflineModalOpen, setIsOfflineModalOpen] = useState(false);

  useEffect(() => {
    const fetchLatestTrip = async () => {
      try {
        const response = await axiosInstance.get("trip-plans/my-trip");
        const data = response.data?.data || response.data;
        setTripData(data);
      } catch (error) {
        console.error("Error fetching trip plan:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLatestTrip();
  }, []);

  // دالة لتوليد وصف ديناميكي بناءً على المدينة والنشاط
  const DynamicDescription = ({ item, cityName }) => {
    const rawDesc = item.description || item.details || "";

    // إذا كان هناك وصف حقيقي من الـ DB ولا يحتوي على "Auto-generated"
    if (rawDesc && !rawDesc.toLowerCase().includes("auto-generated")) {
      return <p className="text-[#736033] leading-relaxed">{rawDesc}</p>;
    }

    const name = (item.title || item.name || cityName || "").toLowerCase();

    let text = `Enjoy a curated day exploring the best attractions and local culture in ${cityName || "Egypt"}.`;

    if (name.includes("alexandria")) {
      text =
        "Discover Mediterranean heritage, iconic seaside views, and vibrant coastal culture.";
    } else if (name.includes("luxor")) {
      text =
        "Immerse yourself in ancient Egyptian history, world-class temples, and historic monuments.";
    } else if (
      name.includes("sinai") ||
      name.includes("south_sinai") ||
      name.includes("dahab")
    ) {
      text =
        "Unwind along Red Sea beaches, world-class diving spots, and tranquil desert landscapes.";
    } else if (name.includes("cairo")) {
      text =
        "Explore vibrant bazaars, rich Islamic architecture, and world-famous ancient wonders.";
    } else if (name.includes("aswan")) {
      text =
        "Relax by the scenic Nile, explore colorful Nubian villages, and serene island temples.";
    }

    return <p className="text-[#736033] leading-relaxed">{text}</p>;
  };

  const getIconForType = (type) => {
    switch (type?.toLowerCase()) {
      case "restaurant":
      case "food":
      case "dining":
        return Utensils;
      case "transportation":
      case "transport":
        return Car;
      default:
        return Landmark;
    }
  };

  if (loading) {
    return (
      <div className="min-h-dvh bg-[#FAF8F5] flex flex-col items-center justify-center gap-3">
        <Loader2 className="h-8 w-8 animate-spin text-[#B58E2A]" />
        <p className="text-xs font-bold text-[#8C753D]">
          Loading your trip itinerary...
        </p>
      </div>
    );
  }

  if (!tripData) {
    return (
      <div className="min-h-dvh bg-[#FAF8F5] text-center pt-20">
        <p className="text-sm font-bold text-[#3D3011]">No trip plan found.</p>
        <button
          onClick={() => navigate("/plan/traveler")}
          className="mt-4 rounded-xl bg-[#B58E2A] px-5 py-2 text-xs font-bold text-white"
        >
          Create New Plan
        </button>
      </div>
    );
  }

  const daysList = tripData.itinerary || tripData.days || [];
  const mapLocations = tripData.mapLocations || [];
  const defaultCenter =
    mapLocations.length > 0
      ? [mapLocations[0].lat, mapLocations[0].lng]
      : [30.0444, 31.2357];

  return (
    <div className="min-h-dvh bg-[#FAF6ED] font-sans text-[#4A3B18] pb-24">
      <SiteNavbar />

      <main className="mx-auto max-w-6xl px-6 pt-8 bg-[#FAF6ED]">
        {/* Header Section */}
        <div className="mb-8 border-b border-[#EAE3D2] pb-6">
          <h1 className="text-3xl font-extrabold text-[#3D3011] mb-2 capitalize">
            {tripData.title || "Your Egypt Trip"}
          </h1>

          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-6 text-xs font-semibold text-[#8C753D]">
              <span className="flex items-center gap-1.5">
                <Calendar className="h-4 w-4 text-[#B58E2A]" />
                {tripData.duration ? `${tripData.duration} Days` : "7 Days"}
              </span>
              <span className="flex items-center gap-1.5">
                <Wallet className="h-4 w-4 text-[#B58E2A]" />
                Budget: ${tripData.budget || 0}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => navigate("/plan/preferences")}
                className="flex items-center gap-1.5 rounded-lg border border-[#DCD3BE] bg-white px-3 py-1.5 text-xs font-bold text-[#524312] shadow-sm hover:bg-[#FAF6EE]"
              >
                <Pencil className="h-3.5 w-3.5" /> Edit Plan
              </button>
              <button
                type="button"
                onClick={() => navigate("/my-trip")}
                className="flex items-center gap-1.5 rounded-lg bg-[#524312] px-3 py-1.5 text-xs font-bold text-white shadow-sm hover:bg-[#3D3011]"
              >
                <Bookmark className="h-3.5 w-3.5" /> Save Trip
              </button>
            </div>
          </div>
        </div>

        {/* Grid Container */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Side: Map & Overview */}
          <div className="lg:col-span-4 space-y-6">
            <div className="border border-[#EAE2CE] rounded-xl overflow-hidden shadow-sm bg-white p-1">
              <div className="w-full h-64 rounded-lg overflow-hidden relative z-0">
                <MapContainer
                  center={defaultCenter}
                  zoom={7}
                  scrollWheelZoom={false}
                  className="w-full h-full"
                >
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  {mapLocations.map((loc, idx) => (
                    <Marker
                      key={loc.id || idx}
                      position={[loc.lat, loc.lng]}
                      icon={customIcon}
                    >
                      <Popup>{loc.title || loc.name}</Popup>
                    </Marker>
                  ))}
                </MapContainer>
              </div>
            </div>

            {/* Overview Card */}
            <div className="border border-[#EAE2CE] rounded-xl bg-white p-5 shadow-sm space-y-3">
              <h3 className="text-xs font-bold text-[#3D3011] border-b border-[#EAE2CE] pb-2">
                Trip Overview
              </h3>
              <div className="flex justify-between text-xs py-1">
                <span className="text-[#8C753D]">Total Days</span>
                <span className="font-semibold text-[#3D3011]">
                  {tripData.duration} Days
                </span>
              </div>
              <div className="flex justify-between text-xs py-1 border-t border-[#FAF6EE]">
                <span className="text-[#8C753D]">Pace</span>
                <span className="font-semibold text-[#3D3011] capitalize">
                  {tripData.pace || "Balanced"}
                </span>
              </div>
              <div className="flex justify-between text-xs py-1 border-t border-[#FAF6EE]">
                <span className="text-[#8C753D]">Destinations</span>
                <span className="font-semibold text-[#3D3011] capitalize">
                  {tripData.destinations?.join(", ") || "Egypt"}
                </span>
              </div>
            </div>
          </div>

          {/* Right Side: Timeline Days */}
          <div className="lg:col-span-8 space-y-6">
            {daysList.length > 0 ? (
              daysList.map((day, dIdx) => {
                const activities =
                  day.activities || day.items || day.places || [];
                const currentCity =
                  day.city ||
                  day.destination ||
                  tripData.destinations?.[
                    dIdx % (tripData.destinations?.length || 1)
                  ] ||
                  "Egypt";

                return (
                  <div
                    key={day.dayNumber || day.day || dIdx + 1}
                    className="border border-[#EAE2CE] rounded-xl bg-white shadow-sm overflow-hidden"
                  >
                    <div className="bg-[#F5F0E1]/60 px-5 py-3 border-b border-[#EAE2CE] flex justify-between items-center">
                      <h2 className="text-base font-extrabold text-[#3D3011]">
                        DAY {day.dayNumber || day.day || dIdx + 1}
                      </h2>
                      <span className="text-xs font-bold text-[#8C753D] bg-white border border-[#EAE2CE] px-2.5 py-0.5 rounded-md capitalize">
                        {currentCity}
                      </span>
                    </div>

                    <div className="p-5 space-y-6">
                      {activities.length > 0 ? (
                        activities.map((item, idx) => {
                          const ItemIcon = getIconForType(
                            item.type || item.category,
                          );
                          return (
                            <div
                              key={idx}
                              className="flex items-start gap-4 text-xs"
                            >
                              <div className="p-2 rounded-lg bg-[#FAF6EE] border border-[#EAE2CE] text-[#B58E2A] flex-shrink-0">
                                <ItemIcon className="h-4 w-4" />
                              </div>
                              <div className="flex-grow space-y-1">
                                <div className="text-[11px] font-bold text-[#8C753D]">
                                  {item.time || "Schedule"} —{" "}
                                  {item.type || "Activity"}
                                </div>
                                <h4 className="text-sm font-bold text-[#3D3011] capitalize">
                                  {item.title ||
                                    item.name ||
                                    item.placeName ||
                                    `Explore ${currentCity}`}
                                </h4>
                                <DynamicDescription
                                  item={item}
                                  cityName={currentCity}
                                />
                              </div>
                            </div>
                          );
                        })
                      ) : (
                        <div className="flex items-start gap-4 text-xs">
                          <div className="p-2 rounded-lg bg-[#FAF6EE] border border-[#EAE2CE] text-[#B58E2A] flex-shrink-0">
                            <Landmark className="h-4 w-4" />
                          </div>
                          <div className="flex-grow space-y-1">
                            <div className="text-[11px] font-bold text-[#8C753D]">
                              Schedule — Activity
                            </div>
                            <h4 className="text-sm font-bold text-[#3D3011] capitalize">
                              Explore {currentCity}
                            </h4>
                            <DynamicDescription
                              item={{}}
                              cityName={currentCity}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="border border-[#EAE2CE] rounded-xl bg-white p-8 text-center text-xs text-[#8C753D]">
                No itinerary details available.
              </div>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="mt-12 flex items-center justify-between border-t border-[#EAE3D2] pt-6">
          <button
            type="button"
            onClick={() => setIsOfflineModalOpen(true)}
            className="flex items-center gap-2 rounded-xl border border-[#DCD3BE] bg-[#EAE2CE]/50 px-5 py-3 text-xs font-bold text-[#524312] hover:bg-[#EAE2CE] transition cursor-pointer"
          >
            <Download className="h-4 w-4" />
            <span>Download Offline</span>
          </button>

          <button
            type="button"
            onClick={() => navigate("/my-trip")}
            className="flex items-center gap-2 rounded-xl bg-[#B58E2A] hover:bg-[#9B771E] px-8 py-3.5 text-xs font-bold text-white shadow-md uppercase tracking-wider"
          >
            <span>Save trip</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>

        <OfflinePackModal
          isOpen={isOfflineModalOpen}
          onClose={() => setIsOfflineModalOpen(false)}
          itinerary={tripData}
        />
      </main>
    </div>
  );
}
