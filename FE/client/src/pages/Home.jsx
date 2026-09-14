import React from "react";
import { Link } from "react-router-dom";
import {
  Compass,
  PhoneCall,
  Plane,
  CreditCard,
  Map as MapIcon,
  Briefcase,
  ArrowUpRight,
  Landmark,
  UtensilsCrossed,
  FileText,
  Building2,
  Bus,
  Star,
  MessageSquare,
} from "lucide-react";

import SiteNavbar from "../components/layout/SiteNavbar";
import Footer from "../components/layout/Footer";
import { useApi } from "../hooks/useApi";
import AsyncState from "../components/common/AsyncState";
import { getAllTrips } from "../api/tripsApi";
import pyramidsHero from "../assets/hero2.png";
import characterImg from "../assets/character.png";

const QUICK_ACTIONS = [
  { label: "Calender", iconColor: "#001E4F", icon: Briefcase, to: "/plan" },
  { label: "Explore", iconColor: "#B27F0B", icon: Compass, to: "/explore" },
  {
    label: "Emergency",
    icon: PhoneCall,
    iconColor: "#DC1212",
    to: "/emergency",
  },
  {
    label: "Travel services",
    iconColor: "#001E4F",
    icon: Plane,
    to: "/services",
  },
  { label: "SIM", iconColor: "#B27F0B", icon: CreditCard, to: "/sim" },
  {
    label: "Offline Maps",
    iconColor: "#DC1212",
    icon: MapIcon,
    to: "/offline-maps",
  },
];

const INFO_CARDS = [
  {
    title: "Cultural Attractions",
    description: "Explore museums, historic sites, and cultural events",
    icon: Landmark,
    to: "/services?category=attractions",
  },
  {
    title: "Restaurants & Cafés",
    description: "Find places to eat and enjoy local experiences",
    icon: UtensilsCrossed,
    to: "/services?category=restaurants",
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
    to: "/services?category=transportation",
  },
  {
    title: "Visa Info",
    description: "Get visa information and requirements",
    icon: FileText,
    to: "/services?category=visa",
  },
];

export default function Home() {
  const { data: trips, loading, error, refetch } = useApi(getAllTrips);

  return (
    <div className="relative min-h-dvh bg-[#FAF6ED] font-body text-[#3B2F1E]">
      <SiteNavbar />

      <main className="relative z-10 mx-auto w-full max-w-[1240px] px-4 pb-20 sm:px-8">
        {/* Hero Section */}
        <section className="relative mb-20 mt-6 h-[499px] w-full overflow-hidden rounded-[2rem] shadow-md">
          <img
            src={pyramidsHero}
            alt="Hero Pyramids"
            className="w-full h-full object-cover object-center"
          />

          <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-transparent" />

          <div className="absolute inset-0 z-10 flex h-full w-[760px] max-w-full flex-col justify-center px-10 sm:px-16 text-white">
            <h1
              className="max-w-[700px] text-[52px] sm:text-[64px] font-semibold leading-[1.05] text-[#DDD1B5] tracking-tight"
              style={{
                textShadow:
                  "3px 4px 0px rgba(40, 25, 10, 0.8), 0px 8px 20px rgba(0, 0, 0, 0.6)",
              }}
            >
              Plan your Egypt trip around your needs
            </h1>

            <p
              className="mt-4 max-w-[500px] text-[18px] font-medium leading-relaxed text-[#D4C3A3]"
              style={{ textShadow: "0px 2px 4px rgba(35, 24, 0, 0.9)" }}
            >
              Smart planning, local insights for a smooth trip and offline
              support
            </p>

            <div className="mt-10 flex flex-wrap gap-4 items-center">
              <Link
                to="/plan"
                className="flex items-center gap-2.5 rounded-[12px] bg-[#BD8C1A] px-7 py-3.5 text-[18px] font-bold text-white shadow-lg transition-all hover:bg-[#A8821D] active:scale-95"
              >
                Start planning <ArrowUpRight className="h-5 w-5" />
              </Link>

              <Link
                to="/explore"
                className="flex items-center gap-2.5 rounded-[12px] bg-transparent border-2 border-[#5C4000] px-7 py-3.5 text-[18px] font-bold text-[#FAF5EA] transition-all hover:bg-[#231800]/70 active:scale-95"
              >
                Explore EGYPT <ArrowUpRight className="h-5 w-5" />
              </Link>
            </div>
          </div>
        </section>

        {/* Quick Actions Grid */}
        <section className="my-16 w-full max-w-[1100px] flex flex-col items-center">
          <h2 className="mb-6 w-full text-center sm:text-left font-bold text-[24px] text-[#3B2F1E]">
            What do you want to do?
          </h2>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 w-full max-w-[950px]">
            {QUICK_ACTIONS.map(({ label, icon: Icon, iconColor, to }) => (
              <Link
                key={label}
                to={to}
                className="flex flex-col items-center justify-center gap-2.5 rounded-2xl border border-[#C8BEA7] bg-[#E8E2D5] p-5 transition-all hover:bg-[#DDD5C5] shadow-sm"
              >
                <div className="p-2 rounded-full bg-[#3B2F1E]/5">
                  <Icon
                    className="h-6 w-6"
                    style={{ color: iconColor || "#5C4928" }}
                  />
                </div>
                <span className="text-[16px] font-bold text-[#3B2F1E]">
                  {label}
                </span>
              </Link>
            ))}
          </div>
        </section>
        {/* Info Cards Section */}
        <section className="mt-60 max-w-[1100px] pb-100 mb-60">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 lg:grid-cols-5">
            {INFO_CARDS.map(({ title, description, icon: Icon, to }) => (
              <div
                key={title}
                className="group flex h-[250px] w-full flex-col items-center justify-between rounded-[16px] border border-[#DCD3C1] bg-[#EFE9DC] p-5 text-center shadow-sm transition-transform hover:-translate-y-1"
              >
                <div className="flex flex-col items-center w-full">
                  <Icon className="mb-3 h-6 w-6 text-[#5C4000]" />
                  <h3 className="text-[18px] font-bold leading-tight text-[#5C4000]">
                    {title}
                  </h3>
                  <p className="mt-2 text-[13px] leading-relaxed text-[#736348] line-clamp-3">
                    {description}
                  </p>
                </div>

                <Link
                  to={to}
                  className="w-full h-[42px] rounded-[10px] bg-[#BD8C1A] hover:bg-[#A87B16] active:bg-[#8F670F] text-white flex items-center justify-center gap-1.5 text-[15px] font-bold shadow-sm transition-colors"
                >
                  <ArrowUpRight className="h-4 w-4" /> View Service
                </Link>
              </div>
            ))}
          </div>
        </section>
        <section className="my-16 w-full max-w-[1100px] rounded-2xl border border-[#DCD3C1] bg-[#EFE9DC] p-8 text-center shadow-sm">
          <div className="flex flex-col items-center">
            <div className="flex items-center gap-1 text-amber-500 mb-2">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-5 w-5 fill-amber-400" />
              ))}
            </div>
            <h2 className="text-2xl font-bold text-[#5C4000]">
              What Travelers Say
            </h2>
            <p className="mt-2 text-sm text-[#736348] max-w-[500px]">
              Explore real experiences, comments, and media shared by tourists
              who visited Egypt!
            </p>

            {/* إرجاع المستخدم لأول رحلة كـ Example لمشاهدة التقييمات */}
            {trips && trips.length > 0 && (
              <Link
                to={`/trip-details/${trips[0]._id}#reviews`}
                className="mt-5 flex items-center gap-2 rounded-xl bg-[#BD8C1A] px-6 py-3 text-sm font-bold text-white transition-all hover:bg-[#A8821D]"
              >
                <MessageSquare className="h-4 w-4" /> Read Traveler Reviews
              </Link>
            )}
          </div>
        </section>

        {/* Floating Character & Popular Destinations Section */}
        <section className="relative mt-20 mb-20 max-w-[1100px] pt-[180px]">
          <div className="pointer-events-none absolute right-2 -top-[175px] z-30 hidden h-[392px] w-[261px] lg:block">
            <img
              src={characterImg}
              alt="Guide Character"
              className="h-full w-full object-contain object-bottom drop-shadow-md"
            />
          </div>

          <div className="w-full">
            <p className="mb-4 text-left text-[15px] font-bold uppercase tracking-wider text-[#736348]">
              POPULAR DESTINATIONS
            </p>

            <AsyncState
              loading={loading}
              error={error}
              data={trips}
              onRetry={refetch}
              emptyMessage="No destinations available right now."
              loadingLabel="Loading destinations..."
            >
              {(tripList) => (
                <div className="grid grid-cols-1 justify-items-center gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  {tripList.slice(0, 4).map((trip) => (
                    <Link
                      key={trip._id}
                      to={`/trip-details/${trip._id}`} // 👈 هنا التعديل للمسار الجديد
                      className="group relative h-[420px] w-full max-w-[296px] overflow-hidden rounded-[20px] shadow-sm transition-transform duration-300 hover:-translate-y-1"
                    >
                      <img
                        src={trip.image}
                        alt={trip.title}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />

                      <div className="absolute inset-x-0 bottom-0 h-[85%] bg-gradient-to-t from-[#120B04] via-[#1A1208]/80 via-50% to-transparent pointer-events-none" />

                      <div className="absolute inset-x-0 bottom-0 flex flex-col items-center justify-end p-6 text-center text-white z-10">
                        <h3 className="text-[26px] font-bold text-white tracking-wide drop-shadow-md">
                          {trip.location?.split(",")[0] || "Destination"}
                        </h3>

                        <p className="mt-1 line-clamp-2 text-[14px] font-normal leading-snug text-[#E2D8C3] max-w-[240px]">
                          {trip.title}
                        </p>

                        <div className="mt-5 flex h-[46px] w-[150px] items-center justify-center gap-2 rounded-[10px] border border-[#5C4000] bg-[#231800]/50 text-[16px] font-bold text-[#F9F4EB] transition-all duration-200 group-hover:border-[#BD8C1A] group-hover:bg-[#BD8C1A] active:bg-[#A8821D]">
                          continue
                          <ArrowUpRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1 group-hover:-translate-y-1" />
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </AsyncState>
          </div>
        </section>
      </main>

      <div className="mt-24">
        <Footer />
      </div>
    </div>
  );
}
