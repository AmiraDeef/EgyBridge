import React from "react";
import { Link } from "react-router-dom";
import {
  AlertTriangle,
  Facebook,
  Globe,
  Instagram,
  Linkedin,
  Mail,
  Music2,
} from "lucide-react";
import { FaSnapchatGhost } from "react-icons/fa";

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
  {
    icon: Facebook,
    label: "Facebook",
    path: "https://www.facebook.com/profile.php?id=61563981225135",
  },
  {
    icon: Instagram,
    label: "Instagram",
    path: "https://www.instagram.com/egirises_egypt_rises/",
  },
  {
    icon: Music2,
    label: "TikTok",
    path: "https://www.tiktok.com/@egirises_egyptrises?_r=1&_t=ZS-99iqMdBmg6e",
  },
  {
    icon: FaSnapchatGhost,
    label: "Snapchat",
    path: "https://snapchat.com/t/n5zhibr4",
  },
  {
    icon: Linkedin,
    label: "LinkedIn",
    path: "https://www.linkedin.com/company/egirises/",
  },
  {
    icon: Mail,
    label: "Gmail",
    path: "mailto:egirises@gmail.com",
  },
];

export default function Footer() {
  return (
    <footer className="w-full max-w-full overflow-x-hidden bg-ink-soft px-6 pb-[env(safe-area-inset-bottom)] pt-14 text-cream/80 sm:px-10">
      <div className="mx-auto grid w-full max-w-6xl min-w-0 grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-8 lg:grid-cols-5">
        {/* Brand block */}
        <div className="col-span-1 min-w-0 sm:col-span-2 lg:col-span-1">
          <div className="flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-full border border-gold text-[11px] font-semibold text-gold">
              E
            </span>
            <div>
              <p className="font-display text-sm font-semibold text-cream">
                EGYPT
              </p>
              <p className="text-[10px] uppercase tracking-wide text-cream/40">
                Travel Companion
              </p>
            </div>
          </div>
          <p className="mt-4 max-w-[220px] text-sm leading-relaxed text-cream/50">
            Explore Egypt with a plan that fits your journey.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {SOCIALS.map(({ icon: Icon, label, path }) => (
              <a
                key={label}
                href={path}
                target={path.startsWith("http") ? "_blank" : undefined}
                rel={path.startsWith("http") ? "noreferrer" : undefined}
                aria-label={label}
                className="flex h-8 w-8 items-center justify-center rounded-full border border-cream/15 text-cream/60 transition-colors hover:border-gold hover:text-gold"
              >
                <Icon className="h-3.5 w-3.5" />
              </a>
            ))}
          </div>
        </div>

        {COLUMNS.map((col) => (
          <div key={col.title} className="min-w-0">
            <p className="mb-4 text-sm font-semibold text-cream">{col.title}</p>
            <ul className="space-y-2.5">
              {col.links.map((link) => (
                <li key={link}>
                  <a
                    href="#"
                    className="text-sm text-cream/50 transition-colors hover:text-gold"
                  >
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
            {/* التعديل هنا: تحويل الزر إلى Link ليوجه إلى /emergency */}
            <Link
              to="/emergency"
              className="mt-3 inline-block rounded-full bg-gold px-4 py-1.5 text-xs font-semibold text-ink-soft transition-colors hover:bg-gold-light"
            >
              Open SOS
            </Link>
          </div>
        </div>
      </div>

      <div className="mx-auto mt-10 flex max-w-6xl flex-col items-center justify-between gap-3 border-t border-cream/10 pt-6 text-xs text-cream/35 sm:flex-row">
        <p>© 2026 Egypt Travel Companion. All rights reserved.</p>
        <button
          type="button"
          className="flex items-center gap-1.5 hover:text-cream/60"
        >
          <Globe className="h-3.5 w-3.5" />
          English
        </button>
      </div>
    </footer>
  );
}
