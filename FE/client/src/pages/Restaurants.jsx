import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Globe, User, Search, ArrowLeft } from "lucide-react";
import Logo from "../components/common/Logo";
import characterImg from "../assets/serCharacter.png";
import { useAuth } from "../context/AuthContext";

export default function Restaurants() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  const [searchQuery, setSearchQuery] = useState("");
  const [location, setLocation] = useState("Cairo");
  const [selectedCuisine, setSelectedCuisine] = useState("Egyptian");
  const [selectedPrice, setSelectedPrice] = useState("$$");

  const cuisines = ["Egyptian", "Italian", "Asian", "Local"];
  const priceRanges = ["$", "$$", "$$$"];

  const handleSearch = (e) => {
    e.preventDefault();
    // Redirects to TripAdvisor Egypt Restaurants with applied search query
    const query = `${searchQuery} ${selectedCuisine} restaurants ${location} Egypt`.trim();
    const tripAdvisorUrl = `https://www.tripadvisor.com/Search?q=${encodeURIComponent(query)}`;
    window.open(tripAdvisorUrl, "_blank");
  };

  return (
    <div className="min-h-screen bg-[#FAF6ED] font-body text-[#211D18] flex flex-col justify-between">
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
              RESTAURANTS
            </span>
            <span className="hidden text-xs font-bold text-[#211D18]/80 sm:inline">$ USD</span>
          </div>

          <div className="flex items-center gap-6 text-xs font-bold uppercase tracking-wider text-[#211D18]/80">
            <Link to="/about" className="hidden transition-colors hover:text-[#835400] sm:inline">
              ABOUT
            </Link>
            {isAuthenticated ? (
              <Link to="/my-trip" className="flex items-center gap-1.5 text-[#835400] hover:text-[#A48238]">
                <User className="h-3.5 w-3.5" />
                <span>{user?.fullName?.split(" ")[0] || "MY TRIP"}</span>
              </Link>
            ) : (
              <Link to="/login" className="flex items-center gap-1.5 transition-colors hover:text-[#835400]">
                <User className="h-3.5 w-3.5" />
                <span>SIGN UP/LOGIN</span>
              </Link>
            )}
            <button type="button" className="flex items-center gap-1 transition-colors hover:text-[#835400]">
              <Globe className="h-3.5 w-3.5" />
              <span>Languages</span>
            </button>
          </div>
        </nav>
      </header>

      {/* Main Content */}
      <main className="mx-auto bg-[#FAF6ED] flex w-full max-w-5xl flex-1 flex-col items-center justify-center px-6 py-10 sm:px-10">
        {/* Section Heading */}
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-black uppercase text-[#211D18] tracking-tight sm:text-3xl">
            FIND A RESTAURANT
          </h1>
          <p className="mt-1 text-lg font-medium text-[#5C4000]">
            Find & Discover places to eat nearby
          </p>
        </div>

        {/* Form Container with Character Overlay */}
        <div className="relative flex w-full max-w-4xl flex-col items-center gap-0 lg:flex-row lg:items-center">
          {/* Character Image */}
          <div className="z-10 -mb-12 w-64 flex-shrink-0 lg:-mr-13 lg:mb-0 lg:w-64">
            <img
              src={characterImg}
              alt="EGI RISE Guide"
              className="h-auto w-full object-contain drop-shadow-xl"
            />
          </div>

          {/* Form Card */}
          <div className="w-full rounded-[24px] border-2 border-[#DCD3BE] bg-[#F1EAD0] p-6 shadow-xl sm:p-8">
            <form onSubmit={handleSearch} className="space-y-5">
              {/* Search Bar Input */}
              <div className="relative flex items-center rounded-xl border border-[#DCD3BE] bg-[#E3DAC2]/70 px-4 py-3">
                <input
                  type="text"
                  placeholder="Search restaurants..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-transparent text-xs font-medium text-[#211D18] placeholder:text-[#8A7A55] outline-none"
                />
                <Search className="h-4 w-4 text-[#8A7A55]" />
              </div>

              {/* Location & Cuisine Row */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {/* Location Select */}
                <div>
                  <label className="block text-[10px] font-semibold text-[#8A7A55] mb-1.5">
                    Location
                  </label>
                  <div className="relative flex items-center rounded-xl border border-[#DCD3BE] bg-[#E3DAC2]/70 px-3.5 py-2.5">
                    <select
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className="w-full bg-transparent text-xs font-bold text-[#3B2D0C] outline-none cursor-pointer"
                    >
                      <option value="Cairo">Cairo</option>
                      <option value="Alexandria">Alexandria</option>
                      <option value="Giza">Giza</option>
                      <option value="Luxor">Luxor</option>
                      <option value="Aswan">Aswan</option>
                      <option value="Sharm El Sheikh">Sharm El Sheikh</option>
                      <option value="Hurghada">Hurghada</option>
                    </select>
                  </div>
                </div>

                {/* Cuisine Badges */}
                <div>
                  <label className="block text-[10px] font-semibold text-[#8A7A55] mb-1.5">
                    Cuisine
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {cuisines.map((item) => (
                      <button
                        type="button"
                        key={item}
                        onClick={() => setSelectedCuisine(item)}
                        className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all ${
                          selectedCuisine === item
                            ? "bg-[#BD8C1A] text-white shadow-sm"
                            : "bg-[#E3DAC2] text-[#524016] hover:bg-[#d5caaf]"
                        }`}
                      >
                        {item}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Price Filter */}
              <div>
                <label className="block text-[10px] font-semibold text-[#8A7A55] mb-1.5">
                  Price
                </label>
                <div className="flex gap-2">
                  {priceRanges.map((price) => (
                    <button
                      type="button"
                      key={price}
                      onClick={() => setSelectedPrice(price)}
                      className={`min-w-[48px] rounded-xl border px-3 py-1.5 text-xs font-bold transition-all ${
                        selectedPrice === price
                          ? "border-[#BD8C1A] bg-[#BD8C1A] text-white"
                          : "border-[#DCD3BE] bg-[#E3DAC2]/70 text-[#524016] hover:bg-[#E3DAC2]"
                      }`}
                    >
                      {price}
                    </button>
                  ))}
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-[#BD8C1A] py-3.5 text-xs font-bold text-white shadow-md hover:bg-[#a67c17] transition-all"
              >
                <span>Find Restaurants ➔≡</span>
              </button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}