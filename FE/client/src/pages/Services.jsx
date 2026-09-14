import React from "react";
import { Link } from "react-router-dom";
import {
  Plane,
  Building2,
  UtensilsCrossed,
  Bus,
  CreditCard,
  Wallet,
  PhoneCall,
  Utensils,
  RefreshCw,
  Languages,
  ArrowUpRight,
} from "lucide-react";
import SiteNavbar from "../components/layout/SiteNavbar";
import Footer from "../components/layout/Footer";

const SERVICE_CARDS = [
  {
    key: "flights",
    label: "Flights",
    icon: Plane,
    description:
      "Book international and domestic flights with our premium airline partners.",
    to: "/services/flights",
  },
  {
    key: "accommodation",
    label: "Accommodation",
    icon: Building2,
    description: "Discover places to stay that fit your trip.",
    to: "/services/accommodation",
  },
  {
    key: "restaurants",
    label: "Restaurants & Cafés",
    icon: UtensilsCrossed,
    description: "Find places to eat and enjoy local experiences.",
    to: "/services/restaurants",
  },
  {
    key: "transportation",
    label: "Transportation",
    icon: Bus,
    description: "Find the best ways to move around Egypt.",
    to: "/car-rental",
  },
];

const SERVICE_CARDS_ROW2 = [
  {
    key: "sim",
    label: "SIM",
    icon: CreditCard,
    description:
      "Purchase local eSIMs instantly for uninterrupted data across Egypt.",
    to: "/sim",
  },
  {
    key: "payment",
    label: "Payment",
    icon: Wallet,
    description:
      "Exchange rates, ATM locators, and secure digital payment partners.",
    to: "/services/payment",
  },
  {
    key: "emergency",
    label: "Emergency Contacts",
    icon: PhoneCall,
    description:
      "Direct lines to tourist police, embassies, and medical facilities.",
    to: "/emergency",
    iconClass: "text-red-600",
  },
];

const SHORTCUTS = [
  {
    key: "restaurants-shortcut",
    label: "Restaurants",
    icon: Utensils,
    to: "/services/restaurants",
  },
  {
    key: "currency",
    label: "Currency",
    icon: RefreshCw,
    to: "/services/currency",
  },
  {
    key: "translation",
    label: "Translation",
    icon: Languages,
    to: "/services/translation",
  },
];

function ServiceCard({ label, icon: Icon, description, to, iconClass }) {
  return (
    <div className="flex h-full flex-col items-center rounded-2xl bg-[#EDE0C9] px-6 py-8 text-center">
      <Icon
        className={`h-8 w-8 ${iconClass || "text-[#846B20]"}`}
        strokeWidth={1.75}
      />
      <h3 className="mt-4 text-lg font-bold text-[#4F3B00]">{label}</h3>
      <p className="mt-2 text-sm leading-relaxed text-[#4F3B00]/85">
        {description}
      </p>
      <Link
        to={to}
        className="mt-6 flex items-center justify-center gap-2 rounded-full bg-[#BD8C1A] px-5 py-2.5 text-sm font-bold text-white transition-colors hover:bg-[#a67c17]"
      >
        <ArrowUpRight className="h-4 w-4" />
        View Service
      </Link>
    </div>
  );
}

export default function Services() {
  return (
    <div className="min-h-dvh bg-[#FAF6ED] font-body">
      <SiteNavbar />

      <main className="mx-auto bg-[#FAF6ED] max-w-6xl px-6 pb-20 pt-10 sm:px-10">
        <h1 className="text-3xl font-bold text-black sm:text-4xl">
          Travel Services
        </h1>
        <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-[#4C4546]">
          Direct Access to Trusted Services. Everything you need for a seamless
          journey through Egypt, curated and verified.
        </p>

        {/* Row 1 — 4 cards */}
        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {SERVICE_CARDS.map((card) => (
            <ServiceCard key={card.key} {...card} />
          ))}
        </div>

        {/* Row 2 — 3 cards */}
        <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-3">
          {SERVICE_CARDS_ROW2.map((card) => (
            <ServiceCard key={card.key} {...card} />
          ))}
        </div>

        <div className="mt-16 h-16 w-16" aria-hidden="true" />

        {/* Shortcuts */}
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-3">
          {SHORTCUTS.map(({ key, label, icon: Icon, to }) => (
            <Link
              key={key}
              to={to}
              className="flex flex-col items-center rounded-xl border border-gray-200 bg-[#F5F3EF] px-6 py-7 text-center transition-colors hover:border-[#BD8C1A]/50"
            >
              <Icon className="h-6 w-6 text-[#4F3B00]" strokeWidth={1.75} />
              <span className="mt-3 text-sm font-semibold text-[#2B2620]">
                {label}
              </span>
            </Link>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}
