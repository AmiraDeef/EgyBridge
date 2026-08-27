import React from "react";
import { Link } from "react-router-dom";

/**
 * Official EGI RISES High-Resolution Vector Logo
 *
 * @param {Object} props
 * @param {'sm' | 'md' | 'lg'} [props.size='md'] - Sizing preset
 * @param {'horizontal' | 'vertical' | 'markOnly'} [props.variant='horizontal'] - Layout orientation
 * @param {'default' | 'white' | 'gold'} [props.theme='default'] - Color theme
 * @param {boolean} [props.asLink=true] - Wrap in a React Router Link to "/"
 * @param {string} [props.className=''] - Additional container classes
 */
export default function Logo({
  size = "md",
  variant = "horizontal",
  theme = "default",
  asLink = true,
  className = "",
}) {
  const sizeMap = {
    sm: { markWidth: 26, markHeight: 39, textClass: "text-xs tracking-wider", gap: "gap-2" },
    md: { markWidth: 34, markHeight: 51, textClass: "text-base tracking-widest", gap: "gap-2.5" },
    lg: { markWidth: 46, markHeight: 69, textClass: "text-xl tracking-widest", gap: "gap-3.5" },
  };

  const currentSize = sizeMap[size] || sizeMap.md;

  const textColorClass = {
    default: "text-[#3D3319]",
    white: "text-[#FDFBF7]",
    gold: "text-[#A48238]",
  }[theme] || "text-[#3D3319]";

  const content = (
    <div className={`flex items-center ${variant === "vertical" ? "flex-col text-center" : ""} ${currentSize.gap} ${className}`}>
      {/* Official Emblem Mark */}
      <svg
        width={currentSize.markWidth}
        height={currentSize.markHeight}
        viewBox="0 0 100 150"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="flex-shrink-0 transition-transform duration-300 group-hover:scale-105"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="egyGoldGrad" x1="0" y1="0" x2="100" y2="150" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#C99D42" />
            <stop offset="50%" stopColor="#A48238" />
            <stop offset="100%" stopColor="#7E560E" />
          </linearGradient>
        </defs>

        {/* Outer Oval Contour */}
        <rect
          x="6"
          y="6"
          width="88"
          height="138"
          rx="44"
          stroke="url(#egyGoldGrad)"
          strokeWidth="6"
          fill="none"
        />

        {/* Top Sun Rays */}
        <line x1="50" y1="18" x2="50" y2="30" stroke="url(#egyGoldGrad)" strokeWidth="4" strokeLinecap="round" />
        <line x1="33" y1="24" x2="38" y2="35" stroke="url(#egyGoldGrad)" strokeWidth="4" strokeLinecap="round" />
        <line x1="67" y1="24" x2="62" y2="35" stroke="url(#egyGoldGrad)" strokeWidth="4" strokeLinecap="round" />
        <line x1="20" y1="36" x2="28" y2="44" stroke="url(#egyGoldGrad)" strokeWidth="3.5" strokeLinecap="round" />
        <line x1="80" y1="36" x2="72" y2="44" stroke="url(#egyGoldGrad)" strokeWidth="3.5" strokeLinecap="round" />

        {/* Center Sun Disc & Nile Wave Horizon */}
        <circle cx="50" cy="75" r="30" stroke="url(#egyGoldGrad)" strokeWidth="5" fill="none" />
        {/* Upper Wave */}
        <path
          d="M26 69 Q32 64 38 69 T50 69 T62 69 T74 69"
          stroke="url(#egyGoldGrad)"
          strokeWidth="4"
          fill="none"
          strokeLinecap="round"
        />
        {/* Lower Wave */}
        <path
          d="M26 80 Q32 75 38 80 T50 80 T62 80 T74 80"
          stroke="url(#egyGoldGrad)"
          strokeWidth="4"
          fill="none"
          strokeLinecap="round"
        />

        {/* Bottom Sun Rays */}
        <line x1="50" y1="132" x2="50" y2="120" stroke="url(#egyGoldGrad)" strokeWidth="4" strokeLinecap="round" />
        <line x1="33" y1="126" x2="38" y2="115" stroke="url(#egyGoldGrad)" strokeWidth="4" strokeLinecap="round" />
        <line x1="67" y1="126" x2="62" y2="115" stroke="url(#egyGoldGrad)" strokeWidth="4" strokeLinecap="round" />
        <line x1="20" y1="114" x2="28" y2="106" stroke="url(#egyGoldGrad)" strokeWidth="3.5" strokeLinecap="round" />
        <line x1="80" y1="114" x2="72" y2="106" stroke="url(#egyGoldGrad)" strokeWidth="3.5" strokeLinecap="round" />
      </svg>

      {/* Typography: Serif Display Brand Name */}
      {variant !== "markOnly" && (
        <div className="flex flex-col justify-center leading-none">
          <span className={`font-display font-bold uppercase ${currentSize.textClass} ${textColorClass}`}>
            Egi
          </span>
          <span className={`font-display font-bold uppercase ${currentSize.textClass} ${textColorClass} mt-0.5`}>
            Rises
          </span>
        </div>
      )}
    </div>
  );

  if (asLink) {
    return (
      <Link to="/" className="group inline-flex items-center no-underline focus:outline-none">
        {content}
      </Link>
    );
  }

  return content;
}
