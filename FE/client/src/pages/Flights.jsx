import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  PlaneTakeoff,
  PlaneLanding,
  Calendar,
  ChevronDown,
  Globe,
  User,
  ArrowUpRight,
  ArrowLeft,
} from "lucide-react";
import Logo from "../components/common/Logo";
import characterImg from "../assets/serCharacter.png";
import { useAuth } from "../context/AuthContext";

const AIRPORTS = [
  "Cairo Airport",
  "Luxor Airport",
  "Hurghada Airport",
  "Sharm El Sheikh Airport",
];

export default function Flights() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  const [from, setFrom] = useState("Cairo Airport");
  const [to, setTo] = useState("");
  const [departureDate, setDepartureDate] = useState("");
  const [returnDate, setReturnDate] = useState("");
  const [passengers, setPassengers] = useState(2);

  const handleSearch = (e) => {
    e.preventDefault();
    // Direct link to Air Egypt as requested
    window.location.href = "https://www.egyptair.com";
  };

  return (
    <div className="min-h-dvh bg-[#FDFBF7] font-body text-[#211D18] flex flex-col justify-between bg-[#FAF6ED]">
      {/* Top pill nav */}
      <header className="mx-auto w-full max-w-6xl px-6 pt-6 sm:px-10">
        <nav className="flex items-center justify-between rounded-full border border-[#524016]/30 bg-[#FDFBF7] px-6 py-2.5 shadow-sm">
          <div className="flex items-center gap-4">
            {/* Back Button to return to Services page */}
            <button
              onClick={() => navigate("/services")}
              className="flex items-center gap-1 text-xs font-bold uppercase text-[#524016] hover:text-[#835400] transition-colors mr-2"
              title="Back to Services"
            >
              <ArrowLeft className="h-4 w-4" />
              <span className="hidden sm:inline">Back</span>
            </button>
            <Logo size="sm" variant="horizontal" />
            <span className="rounded-full bg-[#524016] px-5 py-1 text-[11px] font-bold uppercase tracking-wider text-[#FDFBF7]">
              Flights
            </span>
            <span className="hidden text-xs font-bold text-[#211D18]/80 sm:inline">
              $ USD
            </span>
          </div>

          <div className="flex items-center gap-6 text-xs font-bold uppercase tracking-wider text-[#211D18]/80">
            <Link
              to="/about"
              className="hidden transition-colors hover:text-[#835400] sm:inline"
            >
              ABOUT
            </Link>
            {isAuthenticated ? (
              <Link
                to="/my-trip"
                className="flex items-center gap-1.5 text-[#835400] hover:text-[#A48238]"
              >
                <User className="h-3.5 w-3.5" />
                <span>{user?.fullName?.split(" ")[0] || "MY TRIP"}</span>
              </Link>
            ) : (
              <Link
                to="/login"
                className="flex items-center gap-1.5 transition-colors hover:text-[#835400]"
              >
                <User className="h-3.5 w-3.5" />
                <span>SIGN UP/LOGIN</span>
              </Link>
            )}
            <button
              type="button"
              className="flex items-center gap-1 transition-colors hover:text-[#835400]"
            >
              <Globe className="h-3.5 w-3.5" />
              <span>Languages</span>
            </button>
          </div>
        </nav>
      </header>

      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col items-center justify-center px-6 py-10 sm:px-10">
        <div className="mb-2 text-center">
          <h1 className="text-xl font-bold uppercase tracking-wide text-black sm:text-4xl">
            Find Your Flight
          </h1>
          <p className="mt-5 text-lg font-semibold text-[#5C4000]">
            Search flights to and from Egypt
          </p>
        </div>

        <div className="relative flex w-full max-w-4xl flex-col items-center gap-0 lg:flex-row lg:items-center">
          <div className="z-10 -mb-12 w-64 flex-shrink-0 lg:-mr-13 lg:mb-0 lg:w-64">
            <img
              src={characterImg}
              alt="EGI RISE Explorer Guide"
              className="h-auto w-full object-contain drop-shadow-xl"
            />
          </div>

          <div className="w-full rounded-[20px] border-2 border-[#BF9F41] bg-[#F1EAD0] p-8 shadow-xl sm:p-10">
            <form onSubmit={handleSearch} className="space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-[#8A7A55]">
                    From
                  </label>
                  <div className="relative">
                    <PlaneTakeoff className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#211D18]/70" />
                    <select
                      value={from}
                      onChange={(e) => setFrom(e.target.value)}
                      className="w-full appearance-none rounded-lg border border-[#BF9F41]/40 bg-[#ECDFB4] py-2.5 pl-9 pr-9 text-sm font-medium text-[#211D18] outline-none focus:ring-2 focus:ring-[#BD8C1A]"
                    >
                      {AIRPORTS.map((airport) => (
                        <option key={airport} value={airport}>
                          {airport}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#211D18]/70" />
                  </div>
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-[#8A7A55]">
                    To
                  </label>
                  <div className="relative">
                    <PlaneLanding className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#211D18]/70" />
                    <input
                      type="text"
                      value={to}
                      onChange={(e) => setTo(e.target.value)}
                      placeholder="[ Destination ]"
                      className="w-full rounded-lg border border-[#BF9F41]/40 bg-[#ECDFB4] py-2.5 pl-9 pr-9 text-sm font-medium text-[#211D18] placeholder:text-[#211D18]/50 outline-none focus:ring-2 focus:ring-[#BD8C1A]"
                    />
                    <Globe className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#211D18]/70" />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-[#8A7A55]">
                    Departure
                  </label>
                  <div className="relative">
                    {/* Activated Date Picker */}
                    <input
                      type="date"
                      value={departureDate}
                      onChange={(e) => setDepartureDate(e.target.value)}
                      className="w-full rounded-lg border border-[#BF9F41]/40 bg-[#ECDFB4] px-4 py-2.5 text-sm font-medium text-[#211D18] outline-none focus:ring-2 focus:ring-[#BD8C1A] cursor-pointer"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-[#8A7A55]">
                    Return
                  </label>
                  <div className="relative">
                    {/* Activated Date Picker */}
                    <input
                      type="date"
                      value={returnDate}
                      onChange={(e) => setReturnDate(e.target.value)}
                      className="w-full rounded-lg border border-[#BF9F41]/40 bg-[#ECDFB4] px-4 py-2.5 text-sm font-medium text-[#211D18] outline-none focus:ring-2 focus:ring-[#BD8C1A] cursor-pointer"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-semibold text-[#8A7A55]">
                  Passengers
                </label>
                <div className="relative w-full sm:w-56">
                  <select
                    value={passengers}
                    onChange={(e) => setPassengers(Number(e.target.value))}
                    className="w-full appearance-none rounded-lg bg-[#9A7D3C] py-2.5 pl-4 pr-9 text-sm font-medium text-[#FDFBF7] outline-none focus:ring-2 focus:ring-[#BD8C1A]"
                  >
                    {[1, 2, 3, 4, 5, 6].map((n) => (
                      <option
                        key={n}
                        value={n}
                        className="bg-[#524016] text-white"
                      >
                        [ {n} Adult{n > 1 ? "s" : ""} ]
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#FDFBF7]" />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#BD8C1A] py-3.5 text-sm font-bold text-white shadow-lg transition-colors hover:bg-[#a67c17] active:scale-[0.99]"
                >
                  <span>Search Flights (EgyptAir)</span>
                  <ArrowUpRight className="h-4 w-4" />
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}
