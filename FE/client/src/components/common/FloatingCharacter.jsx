import React, { useState } from "react";
import { useLocation, Link } from "react-router-dom";
import {
  MessageCircle,
  X,
  Compass,
  PhoneCall,
  CreditCard,
  Sparkles,
  MapPin,
  FileText,
  Bot,
} from "lucide-react";
import characterImg from "../../assets/character.png";

/**
 * FloatingCharacter
 * A fixed widget rendered across all pages except /login and /register.
 * Features the 3D explorer guide character, speech bubble prompt, and quick trip drawer.
 */
export default function FloatingCharacter() {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  // Exclude Login and Register routes
  const isAuthPage =
    location.pathname === "/login" ||
    location.pathname === "/register" ||
    location.pathname.startsWith("/login/") ||
    location.pathname.startsWith("/register/");

  if (isAuthPage) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end pb-[env(safe-area-inset-bottom)] font-body sm:bottom-5 sm:right-5">
      {/* Quick Assist Modal / Drawer */}
      {isOpen && (
        <div className="mb-3 w-[calc(100vw-2rem)] max-w-80 overflow-hidden rounded-3xl border-2 border-gold/40 bg-cream p-5 shadow-2xl animate-fade-in text-ink">
          <div className="flex items-center justify-between border-b border-line pb-3">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gold/15 text-gold-dark font-bold text-xs">
                ✨
              </div>
              <div>
                <h4 className="font-display text-sm font-bold text-ink">
                  EGI RISE Guide
                </h4>
                <p className="text-[10px] text-ink/55">
                  Your Egypt Travel Assistant
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="rounded-full p-1 text-ink/50 hover:bg-sandbox hover:text-ink transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="mt-3 space-y-2 text-xs">
            <p className="text-xs text-ink/75 leading-relaxed">
              Hello traveler! Need assistance with your Egypt itinerary,
              bookings, or local travel tips?
            </p>

            <div className="mt-3 grid grid-cols-2 gap-2 pt-1">
              <Link
                to="/plan"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-2 rounded-2xl border border-line bg-sandbox p-2.5 font-semibold text-ink hover:border-gold hover:bg-cream transition-colors"
              >
                <Compass className="h-4 w-4 text-gold-dark" />
                <span>Plan Trip</span>
              </Link>
              <Link
                to="/car"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-2 rounded-2xl border border-line bg-sandbox p-2.5 font-semibold text-ink hover:border-gold hover:bg-cream transition-colors"
              >
                <MapPin className="h-4 w-4 text-gold-dark" />
                <span>Car Rental</span>
              </Link>
              <Link
                to="/services/visa"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-2 rounded-2xl border border-line bg-sandbox p-2.5 font-semibold text-ink hover:border-gold hover:bg-cream transition-colors"
              >
                <FileText className="h-4 w-4 text-gold-dark" />
                <span>Visa Info</span>
              </Link>
              <Link
                to="/chat"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-2 rounded-2xl border border-line bg-sandbox p-2.5 font-semibold text-ink hover:border-gold hover:bg-cream transition-colors"
              >
                <Bot className="h-4 w-4 text-gold-dark" />
                <span>AI Chat</span>
              </Link>
              <Link
                to="/checkout"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-2 rounded-2xl border border-line bg-sandbox p-2.5 font-semibold text-ink hover:border-gold hover:bg-cream transition-colors"
              >
                <CreditCard className="h-4 w-4 text-gold-dark" />
                <span>Checkout</span>
              </Link>
              <Link
                to="/emergency"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-2 rounded-2xl border border-line bg-sandbox p-2.5 font-semibold text-ink hover:border-gold hover:bg-cream transition-colors"
              >
                <PhoneCall className="h-4 w-4 text-red-500" />
                <span>Emergency</span>
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Floating speech bubble prompt */}
      {!isOpen && !isDismissed && (
        <div className="group relative mb-2 mr-2 flex items-center gap-2 rounded-2xl border border-gold/40 bg-cream/95 px-3.5 py-1.5 shadow-lg backdrop-blur-md animate-bounce">
          <span className="text-xs font-semibold text-ink flex items-center gap-1.5">
            <Sparkles className="h-3.5 w-3.5 text-gold" />
            Explore Egypt with me!
          </span>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setIsDismissed(true);
            }}
            className="text-ink/40 hover:text-ink ml-1 text-xs"
          >
            ×
          </button>
        </div>
      )}

      {/* Main Floating Character Avatar Trigger */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="EGI RISE Travel Assistant"
        className="group relative flex h-20 w-20 items-center justify-center transition-transform duration-200 hover:scale-110 active:scale-95 focus:outline-none"
      >
        <div className="absolute inset-0 rounded-full bg-gold/20 blur-md group-hover:bg-gold/30 transition-colors" />
        <div className="relative h-18 w-18 overflow-hidden rounded-full border-2 border-gold bg-cream shadow-xl">
          <img
            src={characterImg}
            alt="EGI RISE Explorer Guide"
            className="h-full w-full object-cover object-top transition-transform duration-300 group-hover:scale-110"
          />
        </div>
        <span className="absolute bottom-1 right-1 flex h-6 w-6 items-center justify-center rounded-full bg-gold text-cream shadow-md border-2 border-cream text-[10px] font-bold">
          <MessageCircle className="h-3 w-3 fill-current" />
        </span>
      </button>
    </div>
  );
}
