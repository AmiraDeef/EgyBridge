import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Construction } from "lucide-react";
import SiteNavbar from "../components/layout/SiteNavbar";
import Footer from "../components/layout/Footer";

/**
 * Placeholder for pages referenced by nav/links that haven't been built yet
 * (Explore, My Trip, Services, Emergency, Offline Maps, and wizard steps
 * 3–5: Budget, Places/Services, Review). Exists so clicking around the site
 * never 404s while the rest of the pages are built out incrementally.
 */
export default function ComingSoon({ title = "Coming soon" }) {
  return (
    <div className="flex min-h-screen flex-col bg-cream font-body">
      <SiteNavbar />
      <main className="flex flex-1 flex-col items-center justify-center px-6 py-24 text-center">
        <Construction className="h-8 w-8 text-gold" />
        <h1 className="mt-4 font-display text-2xl font-semibold text-ink">{title}</h1>
        <p className="mt-2 max-w-sm text-sm text-ink/55">
          This page isn't built yet — it's on the list.
        </p>
        <Link
          to="/"
          className="mt-6 flex items-center gap-2 rounded-full bg-gold px-5 py-2.5 text-sm font-semibold text-cream hover:bg-gold-light"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </Link>
      </main>
      <Footer />
    </div>
  );
}
