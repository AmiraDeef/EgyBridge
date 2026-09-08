import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Globe,
  ArrowRight,
  CheckCircle2,
  ExternalLink,
  User,
  ArrowLeft,
} from "lucide-react";
import Logo from "../components/common/Logo";
import characterImg from "../assets/serCharacter.png";
import { useAuth } from "../context/AuthContext";

export default function Visa() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [selectedCountry, setSelectedCountry] = useState("");

  return (
    <div className="min-h-screen bg-[#FDFBF7] font-body text-[#211D18] flex flex-col justify-between">
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
              VISA
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

      {/* Main Content Container */}
      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col items-center justify-center px-6 py-10 sm:px-10">
        <div className="relative flex w-full max-w-4xl flex-col items-center gap-0 lg:flex-row lg:items-center">
          
          {/* Character Illustration */}
          <div className="z-10 -mb-12 w-64 flex-shrink-0 lg:-mr-13 lg:mb-0 lg:w-64">
            <img
              src={characterImg}
              alt="EGI RISE Explorer Guide"
              className="h-auto w-full object-contain drop-shadow-xl"
            />
          </div>

          {/* Visa Card Container */}
          <div className="w-full rounded-[20px] border-2 border-[#BF9F41] bg-[#F1EAD0] p-8 shadow-xl sm:p-10">
            <div className="text-center">
              <h1 className="font-display text-3xl font-bold tracking-wider text-[#302711]">
                VISA
              </h1>
              <p className="mt-1 text-xs font-semibold text-[#8A7A55]">
                Check your Egypt visa requirements
              </p>
            </div>

            <div className="mt-6 space-y-4">
              {/* Country Selector */}
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-[#8A7A55]">
                  Where are you traveling from?
                </label>
                <div className="relative">
                  <Globe className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#211D18]/70" />
                  <select
                    value={selectedCountry}
                    onChange={(e) => setSelectedCountry(e.target.value)}
                    className="w-full appearance-none rounded-lg border border-[#BF9F41]/40 bg-[#ECDFB4] py-2.5 pl-10 pr-8 text-xs font-semibold text-[#211D18] outline-none transition-all focus:ring-2 focus:ring-[#BD8C1A]"
                  >
                    <option value="">Select Country</option>
                    <option value="US">United States</option>
                    <option value="UK">United Kingdom</option>
                    <option value="DE">Germany</option>
                    <option value="FR">France</option>
                    <option value="SA">Saudi Arabia</option>
                    <option value="AE">UAE</option>
                    <option value="OTHER">Other Countries</option>
                  </select>
                  <div className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-[#211D18]/70">
                    ▼
                  </div>
                </div>
              </div>

              {/* Info Box */}
              <div className="rounded-xl border border-[#BF9F41]/40 bg-[#ECDFB4]/80 p-4 space-y-3 text-xs">
                <div className="flex items-center justify-between border-b border-[#BF9F41]/30 pb-2.5">
                  <span className="font-semibold text-[#544629]">Visa Requirement</span>
                  <span className="flex items-center gap-1 font-bold text-[#9e5d28]">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    Visa required
                  </span>
                </div>

                <div className="flex items-center justify-between border-b border-[#BF9F41]/30 pb-2.5">
                  <span className="font-semibold text-[#544629]">Required Documents</span>
                  <button
                    type="button"
                    className="font-semibold text-[#211D18] hover:underline"
                  >
                    View Requirements &gt;
                  </button>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <span className="font-semibold text-[#544629]">Application</span>
                  <a
                    href="https://visa2egypt.gov.eg"
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1.5 rounded-lg bg-[#BD8C1A] px-4 py-2 text-xs font-bold text-white shadow-md hover:bg-[#a67c17] transition-colors"
                  >
                    Official Service
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                </div>
              </div>

              {/* Main Action Button (Redirects to visa2egypt.gov.eg) */}
              <div className="pt-2">
                <a
                  href="https://visa2egypt.gov.eg"
                  target="_blank"
                  rel="noreferrer"
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#BD8C1A] py-3.5 text-sm font-bold text-white shadow-lg transition-colors hover:bg-[#a67c17] active:scale-[0.99]"
                >
                  <span>Check Visa Requirements</span>
                  <ArrowRight className="h-4 w-4" />
                </a>
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}