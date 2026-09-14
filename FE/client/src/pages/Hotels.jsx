import React, { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Globe, User, Calendar, Users, ArrowLeft } from "lucide-react";
import Logo from "../components/common/Logo";
import characterImg from "../assets/serCharacter.png";
import { useAuth } from "../context/AuthContext";

export default function Hotels() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  const [destination, setDestination] = useState("Cairo");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState("2 Guests");

  const checkInRef = useRef(null);
  const checkOutRef = useRef(null);

  const openDatePicker = (ref) => {
    if (ref.current && ref.current.showPicker) {
      ref.current.showPicker();
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const bookingUrl = `https://www.booking.com/searchresults.html?ss=${encodeURIComponent(
      destination + ", Egypt",
    )}&checkin=${checkIn}&checkout=${checkOut}`;
    window.open(bookingUrl, "_blank");
  };

  return (
    <div className=" bg-[#FAF6ED] min-h-dvh bg-[#FDFBF7] font-body text-[#211D18] flex flex-col justify-between">
      {/* CSS لإخفاء أيقونة التقويم الرمادية الافتراضية للـ Browser */}
      <style>{`
        input[type="date"]::-webkit-calendar-picker-indicator {
          display: none;
          -webkit-appearance: none;
        }
      `}</style>

      {/* Navbar */}
      <header className="mx-auto w-full max-w-6xl px-6 pt-6 sm:px-10">
        <nav className="flex items-center justify-between rounded-full border border-[#524016]/30 bg-[#FDFBF7] px-6 py-2.5 shadow-sm">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/services")}
              className="flex items-center gap-1 text-xs font-bold uppercase text-[#524016] hover:text-[#835400] transition-colors mr-2"
            >
              <ArrowLeft className="h-4 w-4" />
              <span className="hidden sm:inline">Back</span>
            </button>
            <Logo size="sm" variant="horizontal" />
            <span className="rounded-full bg-[#524016] px-5 py-1 text-[11px] font-bold uppercase tracking-wider text-[#FDFBF7]">
              HOTELS
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

      {/* Main Content */}
      <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col items-center justify-center px-6 py-10 sm:px-10 bg-[#FAF6ED]">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-black uppercase text-[#211D18] tracking-tight sm:text-3xl">
            FIND YOUR STAY
          </h1>
          <p className="mt-1 text-lg font-medium text-[#5C4000]">
            Find hotels and accommodation for your trip
          </p>
        </div>

        <div className="relative flex w-full max-w-4xl flex-col items-center gap-0 lg:flex-row lg:items-center">
          <div className="z-10 -mb-12 w-64 flex-shrink-0 lg:-mr-13 lg:mb-0 lg:w-64">
            <img
              src={characterImg}
              alt="EGI RISE Guide"
              className="h-auto w-full object-contain drop-shadow-xl"
            />
          </div>

          <div className="w-full rounded-[24px] border-2 border-[#DCD3BE] bg-[#F1EAD0] p-6 shadow-xl sm:p-8">
            <form onSubmit={handleSearch} className="space-y-4">
              {/* Destination */}
              <div>
                <label className="block text-[10px] font-semibold text-[#8A7A55] mb-1">
                  Destination
                </label>
                <div className="relative flex items-center rounded-xl border border-[#DCD3BE] bg-[#E3DAC2]/70 px-3.5 py-2.5">
                  <select
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    className="w-full bg-transparent text-xs font-bold text-[#3B2D0C] outline-none cursor-pointer"
                  >
                    <option value="Cairo">Cairo ▼</option>
                    <option value="Luxor">Luxor ▼</option>
                    <option value="Aswan">Aswan ▼</option>
                    <option value="Sharm El Sheikh">Sharm El Sheikh ▼</option>
                    <option value="Hurghada">Hurghada ▼</option>
                    <option value="Alexandria">Alexandria ▼</option>
                  </select>
                </div>
              </div>

              {/* Dates Row */}
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {/* Check-in */}
                <div>
                  <label className="block text-[10px] font-semibold text-[#8A7A55] mb-1">
                    Check-in
                  </label>
                  <div
                    onClick={() => openDatePicker(checkInRef)}
                    className="relative flex items-center justify-between rounded-xl border border-[#DCD3BE] bg-[#E3DAC2]/70 px-3.5 py-2.5 cursor-pointer"
                  >
                    <input
                      ref={checkInRef}
                      type="date"
                      value={checkIn}
                      onChange={(e) => setCheckIn(e.target.value)}
                      className="w-full bg-transparent text-xs font-medium text-[#211D18] outline-none cursor-pointer"
                    />
                    <Calendar className="h-4 w-4 text-[#8A7A55] flex-shrink-0" />
                  </div>
                </div>

                {/* Check-out */}
                <div>
                  <label className="block text-[10px] font-semibold text-[#8A7A55] mb-1">
                    Check-out
                  </label>
                  <div
                    onClick={() => openDatePicker(checkOutRef)}
                    className="relative flex items-center justify-between rounded-xl border border-[#DCD3BE] bg-[#E3DAC2]/70 px-3.5 py-2.5 cursor-pointer"
                  >
                    <input
                      ref={checkOutRef}
                      type="date"
                      value={checkOut}
                      onChange={(e) => setCheckOut(e.target.value)}
                      className="w-full bg-transparent text-xs font-medium text-[#211D18] outline-none cursor-pointer"
                    />
                    <Calendar className="h-4 w-4 text-[#8A7A55] flex-shrink-0" />
                  </div>
                </div>
              </div>

              {/* Guests */}
              <div>
                <label className="block text-[10px] font-semibold text-[#8A7A55] mb-1">
                  Guests
                </label>
                <div className="relative flex items-center rounded-xl border border-[#DCD3BE] bg-[#E3DAC2]/70 px-3.5 py-2.5 max-w-[220px]">
                  <Users className="mr-2.5 h-4 w-4 text-[#8A7A55]" />
                  <select
                    value={guests}
                    onChange={(e) => setGuests(e.target.value)}
                    className="w-full bg-transparent text-xs font-bold text-[#3B2D0C] outline-none cursor-pointer"
                  >
                    <option value="1 Guest">1 Guest ▼</option>
                    <option value="2 Guests">2 Guests ▼</option>
                    <option value="3 Guests">3 Guests ▼</option>
                    <option value="4+ Guests">4+ Guests ▼</option>
                  </select>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-[#BD8C1A] py-3.5 text-xs font-bold text-white shadow-md hover:bg-[#a67c17] transition-all"
              >
                <span>Search Hotels ➔≡</span>
              </button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}
