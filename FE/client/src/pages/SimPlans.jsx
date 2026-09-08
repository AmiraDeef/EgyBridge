import React, { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Globe, User, ArrowLeft, ChevronLeft, ChevronRight, ExternalLink } from "lucide-react";
import Logo from "../components/common/Logo";
import characterImg from "../assets/serCharacter.png";
import { useAuth } from "../context/AuthContext";

const SIM_PLANS = [
  {
    id: "1gb",
    data: "1 GB",
    validity: "7 Days",
    price: "7.00",
    coverage: "EGYPT",
    providerUrl: "https://te.eg/",
  },
  {
    id: "2gb",
    data: "2 GB",
    validity: "15 Days",
    price: "11.00",
    coverage: "EGYPT",
    providerUrl: "https://web.vodafone.com.eg/en/home",
  },
  {
    id: "3gb",
    data: "3 GB",
    validity: "30 Days",
    price: "17.00",
    coverage: "EGYPT",
    providerUrl: "https://te.eg/",
  },
  {
    id: "4gb",
    data: "4 GB",
    validity: "30 Days",
    price: "21.00",
    coverage: "EGYPT",
    providerUrl: "https://web.vodafone.com.eg/en/home",
  },
  {
    id: "8gb",
    data: "8 GB",
    validity: "30 Days",
    price: "28.00",
    coverage: "EGYPT",
    providerUrl: "https://te.eg/",
  },
];

export default function SimPlans() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [selectedPlan, setSelectedPlan] = useState("2gb");
  const sliderRef = useRef(null);

  const scroll = (direction) => {
    if (sliderRef.current) {
      const scrollAmount = direction === "left" ? -240 : 240;
      sliderRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  const handleBuyNow = (url) => {
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const handleContinue = () => {
    const activePlan = SIM_PLANS.find((p) => p.id === selectedPlan);
    if (activePlan) {
      window.open(activePlan.providerUrl, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF6ED] font-body text-[#3B2F11] flex flex-col justify-between overflow-x-hidden">
      {/* Top Bar */}
      <header className="mx-auto w-full max-w-6xl px-4 pt-6 sm:px-8">
        <nav className="flex items-center justify-between rounded-full border border-[#D9C89E] bg-[#F7F4EB] px-6 py-2.5 shadow-sm">
          <div className="flex items-center gap-4">
            <Logo size="sm" variant="horizontal" />
            <span className="rounded-full bg-[#524016] px-5 py-1 text-[11px] font-bold uppercase tracking-wider text-[#F7F4EB]">
              SIM
            </span>
            <span className="text-xs font-bold text-[#3B2F11]">$ USD</span>
          </div>

          <div className="flex items-center gap-6 text-xs font-bold uppercase tracking-wider text-[#3B2F11]">
            <Link to="/about" className="flex items-center gap-1 hover:opacity-80 transition-opacity">
              ABOUT <span className="h-2 w-2 rounded-full bg-[#524016]"></span>
            </Link>

            {isAuthenticated ? (
              <Link to="/my-trip" className="flex items-center gap-1.5 hover:opacity-80 transition-opacity">
                <User className="h-3.5 w-3.5" />
                <span>{user?.fullName?.split(" ")[0] || "MY TRIP"}</span>
              </Link>
            ) : (
              <Link to="/login" className="flex items-center gap-1.5 hover:opacity-80 transition-opacity">
                <span>SIGN UP/LOGIN</span>
              </Link>
            )}

            <button type="button" className="flex items-center gap-1 hover:opacity-80 transition-opacity">
              <Globe className="h-3.5 w-3.5" />
              <span>Languages</span>
            </button>
          </div>
        </nav>
      </header>

      {/* Main Content Area */}
      <main className="relative mx-auto bg-[#FAF6ED] w-full max-w-6xl px-4 py-6 sm:px-8 flex-1 flex flex-col justify-center">
        {/* Step Indicator */}
        <div className="mb-4 flex items-center justify-between px-2">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-1 text-xs font-semibold text-[#524016] hover:opacity-80 transition-opacity"
          >
            <ArrowLeft className="h-4 w-4" />Back to services
          </button>
          
          <div className="w-4"></div>
        </div>

        {/* Layout Container */}
        <div className="relative flex flex-col lg:flex-row items-center lg:items-center justify-center">
          {/* Character Image */}
          <div className="z-20 w-60 flex-shrink-0 lg:w-64 lg:-mr-8 pointer-events-none">
            <img
              src={characterImg}
              alt="EGI RISE Guide"
              className="h-auto w-full object-contain drop-shadow-xl"
            />
          </div>

          {/* Slider Wrapper (Seamless Integration) */}
          <div className="relative flex-1 w-full overflow-hidden py-4 -ml-4 lg:-ml-10">
            {/* Left Nav Arrow - Overlayed on Character edge */}
            <button
              onClick={() => scroll("left")}
              className="absolute left-6 lg:left-12 top-1/2 -translate-y-1/2 z-30 flex h-9 w-9 items-center justify-center rounded-full bg-[#524016] text-[#F7F4EB] shadow-md hover:bg-[#B5871D] transition-all"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>

            {/* Slider Track */}
            <div
              ref={sliderRef}
              className="flex items-stretch gap-4 overflow-x-auto scroll-smooth pl-16 pr-10 lg:pl-24 py-2 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
            >
              {SIM_PLANS.map((plan) => {
                const isSelected = selectedPlan === plan.id;
                return (
                  <div
                    key={plan.id}
                    onClick={() => setSelectedPlan(plan.id)}
                    className={`relative w-52 flex-shrink-0 min-h-[380px] rounded-3xl border-2 p-5 flex flex-col justify-between transition-all duration-300 cursor-pointer text-center bg-[#F4EEDC] ${
                      isSelected
                        ? "border-[#B5871D] ring-2 ring-[#B5871D]/30 shadow-xl scale-[1.01] bg-[#F1E9CE]"
                        : "border-[#E5DBC1] hover:border-[#B5871D]/60 hover:shadow-md opacity-90 hover:opacity-100"
                    }`}
                  >
                    {/* Coverage Banner */}
                    <div className="mx-auto w-full rounded-xl bg-[#EAE2CA] py-2 px-3 flex items-center justify-between border border-[#D9CEB0]">
                      <div className="text-left">
                        <p className="text-[8px] font-bold tracking-wider text-[#8A7A55] uppercase">
                          COVERAGE
                        </p>
                        <p className="text-[10px] font-black uppercase text-[#3B2F11] flex items-center gap-1">
                          <span className="text-[9px]">EG</span> {plan.coverage}
                        </p>
                      </div>
                      <div className="h-4 w-5 bg-[#C89B2B] rounded flex items-center justify-center shadow-sm">
                        <span className="text-[7px] text-white font-bold">SIM</span>
                      </div>
                    </div>

                    {/* Data Display */}
                    <div className="my-auto py-4">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-[#8A7A55]">
                        DATA
                      </p>
                      <p className="font-serif text-4xl font-black text-[#524016] mt-2">
                        {plan.data}
                      </p>
                    </div>

                    {/* Details & Button */}
                    <div>
                      <div className="flex items-center justify-between border-t border-[#E0D5B8] pt-3 text-left">
                        <div>
                          <p className="text-[8px] font-bold uppercase text-[#8A7A55]">VALIDITY</p>
                          <p className="text-xs font-bold text-[#3B2F11]">{plan.validity}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-[8px] font-bold uppercase text-[#8A7A55]">PRICE</p>
                          <p className="text-xs font-bold text-[#3B2F11]">
                            ${plan.price} <span className="text-[8px] font-normal text-[#8A7A55]">USD</span>
                          </p>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleBuyNow(plan.providerUrl);
                        }}
                        className={`mt-4 w-full rounded-full py-2.5 text-[11px] font-bold transition-all border flex flex-col items-center justify-center gap-0.5 ${
                          isSelected
                            ? "bg-[#C89B2B] text-white border-[#B5871D] shadow-md hover:bg-[#b08722]"
                            : "border-[#B5871D] text-[#524016] bg-transparent hover:bg-[#C89B2B]/10"
                        }`}
                      >
                        <div className="leading-tight flex items-center gap-1">
                          BUY NOW <ExternalLink className="h-3 w-3 inline" />
                        </div>
                        <div className="text-[8px] font-normal opacity-80">or Select Plan</div>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Right Nav Arrow */}
            <button
              onClick={() => scroll("right")}
              className="absolute right-2 top-1/2 -translate-y-1/2 z-30 flex h-9 w-9 items-center justify-center rounded-full bg-[#524016] text-[#F7F4EB] shadow-md hover:bg-[#B5871D] transition-all"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Continue Action Button Right Aligned */}
        <div className="mt-6 flex justify-end px-2">
          <button
            type="button"
            onClick={handleContinue}
            className="flex items-center gap-2 rounded-xl bg-[#C89B2B] px-8 py-2.5 text-xs font-bold text-white shadow-md hover:bg-[#b08722] transition-all"
          >
            <span>continue</span>
            <span className="text-sm">➔≡</span>
          </button>
        </div>
      </main>
    </div>
  );
}