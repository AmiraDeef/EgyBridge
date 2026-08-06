import React from "react";

/**
 * Logo
 * Recreates the EGI RISE sunrise mark (radiating sun over waves) so the
 * auth card doesn't depend on an external image asset.
 */
export default function Logo({ className = "" }) {
  return (
    <div className={`flex flex-col items-center gap-2 lg:items-start ${className}`}>
      <svg width="56" height="56" viewBox="0 0 100 100" aria-hidden="true">
        <defs>
          <linearGradient id="egiSun" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#F4D9A8" />
            <stop offset="55%" stopColor="#E09F3E" />
            <stop offset="100%" stopColor="#C48828" />
          </linearGradient>
        </defs>
        {/* rays */}
        {Array.from({ length: 9 }).map((_, i) => {
          const angle = (-90 + i * 22.5) * (Math.PI / 180);
          const r1 = 26,
            r2 = i % 2 === 0 ? 42 : 36;
          const x1 = 50 + r1 * Math.cos(angle);
          const y1 = 50 + r1 * Math.sin(angle);
          const x2 = 50 + r2 * Math.cos(angle);
          const y2 = 50 + r2 * Math.sin(angle);
          return (
            <line
              key={i}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke="url(#egiSun)"
              strokeWidth="3"
              strokeLinecap="round"
            />
          );
        })}
        {/* sun disc, clipped by the wave */}
        <clipPath id="waveClip">
          <path d="M18,54 Q30,46 42,54 T66,54 T90,54 L90,20 L18,20 Z" />
        </clipPath>
        <circle cx="50" cy="52" r="20" fill="url(#egiSun)" clipPath="url(#waveClip)" />
        {/* waves */}
        <path d="M18,58 Q30,50 42,58 T66,58 T90,58" stroke="#E09F3E" strokeWidth="3" fill="none" strokeLinecap="round" />
        <path d="M18,68 Q30,60 42,68 T66,68 T90,68" stroke="#C48828" strokeWidth="3" fill="none" strokeLinecap="round" opacity="0.7" />
      </svg>
      <span className="font-display text-xl font-semibold tracking-wide text-charcoal">
        EGI RISE
      </span>
    </div>
  );
}
