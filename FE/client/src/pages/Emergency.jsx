import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Phone, MapPin, Camera, Globe, User, ArrowLeft, Mic, AlertTriangle } from "lucide-react";
import Logo from "../components/common/Logo";
import characterImg from "../assets/serCharacter.png";
import { useAuth } from "../context/AuthContext";

export default function Emergency() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [report, setReport] = useState("");
  const [isEmergencyActive, setIsEmergencyActive] = useState(false);

  const handleToggleEmergency = () => {
    const nextState = !isEmergencyActive;
    setIsEmergencyActive(nextState);
    if (nextState) {
      window.location.href = "tel:126";
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF6ED] font-body text-[#211D18] flex flex-col justify-between">
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
            <span className="rounded-full bg-[#B91C1C] px-5 py-1 text-[11px] font-bold uppercase tracking-wider text-white">
              EMERGENCY
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

      <main className="mx-auto flex bg-[#FAF6ED] w-full max-w-5xl flex-1 flex-col items-center justify-center px-6 py-10 sm:px-10">
        <div className="relative flex w-full flex-col items-center gap-0 lg:flex-row lg:items-center">
          <div className="z-10 -mb-12 w-64 flex-shrink-0 lg:-mr-13 lg:mb-0 lg:w-64">
            <img src={characterImg} alt="EGI RISE Guide" className="h-auto w-full object-contain drop-shadow-xl" />
          </div>

          <div className="w-full rounded-[24px] border-2 border-[#DCD3BE] bg-[#F1EAD0] p-6 shadow-xl sm:p-8">
            <div className="mb-4">
              <h1 className="text-xl font-bold text-[#B91C1C] flex items-center gap-1.5">
                <AlertTriangle className="h-5 w-5 text-[#B91C1C] stroke-[2.5]" /> Emergency
              </h1>
              <p className="text-xs font-semibold text-[#8A7A55]">Need help?</p>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-12">
              {/* Left Side Container */}
              <div className="md:col-span-7 flex flex-col justify-between gap-4">
                {/* Contact Official Service Switch Card */}
                <div className="rounded-2xl border border-[#DCD3BE] bg-white p-6 text-center shadow-sm flex flex-col items-center justify-center min-h-[180px]">
                  <span className="text-3xl font-black text-[#B91C1C]">*</span>
                  <p className="mt-1 text-xs font-bold text-[#8A7A55]">Contact Official Service</p>

                  {/* Toggle Switch */}
                  <button
                    type="button"
                    onClick={handleToggleEmergency}
                    className={`relative mt-4 flex h-12 w-full max-w-[280px] cursor-pointer items-center justify-between rounded-full px-2 transition-all duration-300 ${
                      isEmergencyActive
                        ? "bg-[#2A261C]"
                        : "border border-[#FCA5A5] bg-[#FEE2E2]"
                    }`}
                  >
                    {/* Circle Indicator */}
                    <div
                      className={`h-8 w-8 rounded-full bg-[#DC2626] shadow-md transition-transform duration-300 ${
                        isEmergencyActive ? "translate-x-0" : "translate-x-[228px]"
                      }`}
                    />

                    {/* Content inside Switch */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-0.5 pointer-events-none">
                      <Phone className={`h-4 w-4 fill-current ${isEmergencyActive ? "text-[#DC2626]" : "text-[#B91C1C]"}`} />
                      <span
                        className={`text-[9px] font-black uppercase tracking-wider ${
                          isEmergencyActive ? "text-[#DC2626]" : "text-[#B91C1C]"
                        }`}
                      >
                        {isEmergencyActive ? "CALL EMERGENCY SERVICES" : "SLIDE TO CALL"}
                      </span>
                    </div>
                  </button>
                </div>

                {/* Sub-cards */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col items-center justify-center rounded-2xl border border-[#DCD3BE] bg-[#F8F5EC] p-4 text-center cursor-pointer hover:bg-[#EFE8D5] transition-colors">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#BF9F41]/20 text-[#8A7A55]">
                      <MapPin className="h-4 w-4" />
                    </div>
                    <span className="mt-2 text-xs font-bold text-[#3B2D0C]">Share Location</span>
                    <span className="text-[9px] text-[#8A7A55]">Send exact GPS coordinates</span>
                  </div>

                  <div className="flex flex-col items-center justify-center rounded-2xl border border-[#DCD3BE] bg-[#F8F5EC] p-4 text-center cursor-pointer hover:bg-[#EFE8D5] transition-colors">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#BF9F41]/20 text-[#8A7A55]">
                      <Camera className="h-4 w-4" />
                    </div>
                    <span className="mt-2 text-xs font-bold text-[#3B2D0C]">Add Visual Evidence</span>
                    <span className="text-[9px] text-[#8A7A55]">Upload photo or video</span>
                  </div>
                </div>
              </div>

              {/* Right Side Container */}
              <div className="md:col-span-5 flex flex-col justify-between rounded-2xl border border-[#DCD3BE] bg-[#E3DAC2]/50 p-5">
                <div>
                  <h2 className="text-xs font-bold text-[#524016] flex items-center gap-1">
                    💬 Report Situation
                  </h2>
                  <div className="relative mt-3">
                    <textarea
                      rows="6"
                      value={report}
                      onChange={(e) => setReport(e.target.value)}
                      placeholder="Describe your emergency situation briefly..."
                      className="w-full resize-none rounded-xl border border-[#DCD3BE] bg-[#F1EAD0] p-3 pr-8 text-xs font-medium text-[#211D18] placeholder:text-[#8A7A55] outline-none focus:ring-2 focus:ring-[#BD8C1A]"
                    />
                    <Mic className="absolute right-3 bottom-3 h-4 w-4 text-[#8A7A55] cursor-pointer" />
                  </div>
                </div>

                <button
                  type="button"
                  className="mt-4 flex w-full items-center justify-center gap-1.5 rounded-xl bg-[#A29372] py-3 text-xs font-bold text-white shadow-sm hover:bg-[#8A7A55] transition-colors"
                >
                  <span>Send Report ➔≡</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}