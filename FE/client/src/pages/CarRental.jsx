import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  MapPin,
  Calendar,
  ChevronDown,
  Globe,
  User,
  ArrowLeft,
} from "lucide-react";
import Logo from "../components/common/Logo";
import characterImg from "../assets/serCharacter.png";
import { useAuth } from "../context/AuthContext";

export default function CarRental() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  const [location, setLocation] = useState("Cairo International Airport");
  const [pickUpDate, setPickUpDate] = useState("");
  const [returnDate, setReturnDate] = useState("");
  const [carType, setCarType] = useState("Economy");

  const handleSearch = (e) => {
    e.preventDefault();
    window.location.href = "https://www.rentalcars.com";
  };

  return (
    <div className="min-h-dvh bg-[#FAF6ED] font-body text-[#211D18] flex flex-col justify-between">
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
              CAR
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

      <main className="bg-[#FAF6ED] mx-auto flex w-full max-w-6xl flex-1 flex-col items-center justify-center px-6 py-10 sm:px-10">
        <div className="mb-6 text-center">
          <h1 className="text-xl font-bold uppercase tracking-wide text-black sm:text-4xl">
            FIND CAR RENTAL
          </h1>
          <p className="mt-2 text-lg font-semibold text-[#5C4000]">
            Find a car for your trip
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

          <div className="w-full rounded-[20px] border-2 border-[#BF9F41] bg-[#F1EAD0] p-8 shadow-xl sm:p-10">
            <form onSubmit={handleSearch} className="space-y-5">
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-[#8A7A55]">
                  Pick-up Location
                </label>
                <div className="relative">
                  <MapPin className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#211D18]/70" />
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full rounded-lg border border-[#BF9F41]/40 bg-[#ECDFB4] py-2.5 pl-9 pr-9 text-sm font-medium text-[#211D18] outline-none focus:ring-2 focus:ring-[#BD8C1A]"
                  />
                  <ChevronDown className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#211D18]/70" />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-[#8A7A55]">
                    Pick-up Date
                  </label>
                  <input
                    type="date"
                    value={pickUpDate}
                    onChange={(e) => setPickUpDate(e.target.value)}
                    className="w-full rounded-lg border border-[#BF9F41]/40 bg-[#ECDFB4] px-4 py-2.5 text-sm font-medium text-[#211D18] outline-none focus:ring-2 focus:ring-[#BD8C1A]"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-[#8A7A55]">
                    Return Date
                  </label>
                  <input
                    type="date"
                    value={returnDate}
                    onChange={(e) => setReturnDate(e.target.value)}
                    className="w-full rounded-lg border border-[#BF9F41]/40 bg-[#ECDFB4] px-4 py-2.5 text-sm font-medium text-[#211D18] outline-none focus:ring-2 focus:ring-[#BD8C1A]"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-semibold text-[#8A7A55]">
                  Car Type
                </label>
                <div className="flex gap-3">
                  {["Economy", "SUV", "Luxury"].map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setCarType(type)}
                      className={`rounded-full px-5 py-2 text-xs font-bold transition-all ${
                        carType === type
                          ? "bg-[#BD8C1A] text-white shadow-sm"
                          : "bg-[#ECDFB4] text-[#211D18] hover:bg-[#E2D4A1]"
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#BD8C1A] py-3.5 text-sm font-bold text-white shadow-lg transition-colors hover:bg-[#a67c17]"
                >
                  <span>Find cars ➔≡</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}
