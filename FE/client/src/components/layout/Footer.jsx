import React from "react";
import { Facebook, Instagram, Twitter, Youtube, AlertTriangle, Globe } from "lucide-react";

const COLUMNS = [
  {
    title: "Explore",
    links: ["Destinations", "Attractions", "Activities", "Restaurants"],
  },
  {
    title: "My Trip",
    links: ["My Itinerary", "Saved Places", "Offline Maps", "Trip Details"],
  },
  {
    title: "Services",
    links: ["Visa", "Transportation", "Accommodation", "Travel Insurance"],
  },
  {
    title: "Support",
    links: ["Help Center", "Contact Us", "About Us", "Terms & Privacy"],
  },
];

const SOCIALS = [
  { icon: Facebook, label: "Facebook" },
  { icon: Instagram, label: "Instagram" },
  { icon: Twitter, label: "X" },
  { icon: Youtube, label: "YouTube" },
];

export default function Footer() {
  return (
    <footer className="bg-ink-soft px-6 pb-6 pt-14 text-cream/80 sm:px-10">
      <div className="mx-auto grid max-w-6xl grid-cols-2 gap-10 sm:grid-cols-3 lg:grid-cols-5">
        {/* Brand block */}
        <div className="col-span-2 sm:col-span-3 lg:col-span-1">
          <div className="flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-full border border-gold text-[11px] font-semibold text-gold">
              E
            </span>
            <div>
              <p className="font-display text-sm font-semibold text-cream">EGYPT</p>
              <p className="text-[10px] uppercase tracking-wide text-cream/40">Travel Companion</p>
            </div>
          </div>
          <p className="mt-4 max-w-[220px] text-sm leading-relaxed text-cream/50">
            Explore Egypt with a plan that fits your journey.
          </p>
          <div className="mt-4 flex gap-2">
            {SOCIALS.map(({ icon: Icon, label }) => (
              <a
                key={label}
                href="#"
                aria-label={label}
                className="flex h-8 w-8 items-center justify-center rounded-full border border-cream/15 text-cream/60 transition-colors hover:border-gold hover:text-gold"
              >
                <Icon className="h-3.5 w-3.5" />
              </a>
            ))}
          </div>
        </div>

        {COLUMNS.map((col) => (
          <div key={col.title}>
            <p className="mb-4 text-sm font-semibold text-cream">{col.title}</p>
            <ul className="space-y-2.5">
              {col.links.map((link) => (
                <li key={link}>
                  <a href="#" className="text-sm text-cream/50 transition-colors hover:text-gold">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Emergency SOS callout */}
      <div className="mx-auto mt-10 max-w-6xl">
        <div className="ml-auto flex w-fit items-start gap-3 rounded-2xl border border-gold/25 bg-gold/10 px-5 py-4">
          <AlertTriangle className="mt-0.5 h-4 w-4 flex-shrink-0 text-gold" />
          <div>
            <p className="text-sm font-semibold text-gold">Emergency</p>
            <p className="mt-0.5 max-w-[220px] text-xs text-cream/50">
              Get help in case of any emergency
            </p>
            <button
              type="button"
              className="mt-3 rounded-full bg-gold px-4 py-1.5 text-xs font-semibold text-ink-soft transition-colors hover:bg-gold-light"
            >
              Open SOS
            </button>
          </div>
        </div>
      </div>

      <div className="mx-auto mt-10 flex max-w-6xl flex-col items-center justify-between gap-3 border-t border-cream/10 pt-6 text-xs text-cream/35 sm:flex-row">
        <p>© 2026 Egypt Travel Companion. All rights reserved.</p>
        <button type="button" className="flex items-center gap-1.5 hover:text-cream/60">
          <Globe className="h-3.5 w-3.5" />
          English
        </button>
      </div>
    </footer>
  );
}
