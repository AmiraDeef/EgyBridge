import React from "react";
import { useLocation } from "react-router-dom";
import imgRE from "../../assets/mo-gabrail-iuC3w8mLDcs-unsplash.jpg";

export const LOGIN_BG =
  "https://images.unsplash.com/photo-1503177119275-0aa32b3a9368?auto=format&fit=crop&w=1200&q=80"; // Pyramids

export default function AuthLayout({ children }) {
  const location = useLocation();

  const isRegister = location.pathname.includes("register");
  const currentImage = isRegister ? imgRE : LOGIN_BG;

  return (
    <div className="flex h-dvh w-full min-w-0 overflow-hidden bg-sand font-body">
      {/* Left showcase panel */}
      <div className="relative hidden w-[45%] min-w-0 overflow-hidden bg-charcoal-deep lg:block">
        <ShowcaseArt image={currentImage} />
      </div>

      <div className="flex h-full w-full min-w-0 flex-1 items-center justify-center overflow-y-auto px-4 py-4 sm:px-8 lg:w-[55%] lg:px-12">
        <div className="my-auto w-full max-w-[400px] min-w-0 rounded-2xl border border-sand-line bg-white p-5 shadow-card sm:p-6 lg:border-0 lg:bg-transparent lg:p-0 lg:shadow-none">
          {children}
        </div>
      </div>
    </div>
  );
}

function ShowcaseArt({ image }) {
  return (
    <div className="absolute inset-0 h-full w-full">
      <img
        src={image}
        alt="Egypt Showcase"
        className="h-full w-full object-cover object-center"
      />

      <div className="absolute inset-0 bg-gradient-to-t from-charcoal-deep/90 via-charcoal-deep/20 to-transparent" />

      <div className="absolute inset-x-0 bottom-10 p-10 text-sand-soft">
        <p className="font-display text-2xl font-semibold tracking-tight">
          Egypt, at first light.
        </p>
        <p className="mt-2 max-w-xs text-sm leading-relaxed text-sand-soft/80">
          Curated journeys along the Nile, the pyramids of Giza, and the Red Sea
          coast — planned around you.
        </p>
      </div>
    </div>
  );
}
