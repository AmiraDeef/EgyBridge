import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, User, Globe } from "lucide-react";
import Logo from "../common/Logo";
import BackButton from "../common/BackButton";
import { useAuth } from "../../context/AuthContext";

/**
 * FlowTopBar
 * The pill-shaped navigation bar for step-flow pages (SIM, Planning Wizard, MyTrip).
 */
export function FlowTopBar({ badge = "EXPEDITION" }) {
  const { isAuthenticated, user } = useAuth();

  return (
    <div className="mx-auto max-w-6xl px-6 pt-6 sm:px-10 font-body">
      <nav className="flex items-center justify-between rounded-full border border-line bg-[#E0D8C4] px-6 py-2.5 shadow-sm">
        <div className="flex items-center gap-3 sm:gap-4">
          <Logo size="sm" variant="horizontal" />
          <span className="rounded-full bg-[#524016] px-3.5 py-1 text-[11px] font-bold uppercase tracking-wide text-cream">
            {badge}
          </span>
          <span className="text-xs font-semibold text-ink/70 hidden sm:inline">$ USD</span>
        </div>

        <div className="hidden items-center gap-6 sm:flex">
          <Link to="/" className="text-xs font-semibold uppercase tracking-wide text-ink/75 hover:text-ink">
            Home
          </Link>
          <Link to="/services" className="text-xs font-semibold uppercase tracking-wide text-ink/75 hover:text-ink">
            Services
          </Link>
          {isAuthenticated ? (
            <Link
              to="/my-trip"
              className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-gold-dark hover:text-gold"
            >
              <User className="h-3.5 w-3.5" />
              {user?.fullName?.split(" ")[0] || "My Trip"}
            </Link>
          ) : (
            <Link
              to="/login"
              className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-ink/75 hover:text-ink"
            >
              <User className="h-3.5 w-3.5" />
              Sign up / Login
            </Link>
          )}
          <button type="button" className="flex items-center gap-1 text-xs text-ink/65 hover:text-ink">
            <Globe className="h-3.5 w-3.5" />
            EN
          </button>
        </div>
      </nav>
    </div>
  );
}

/**
 * StepHeader
 * Clear Back button using useNavigate(-1) + "STEP X OF N" indicator
 */
export function StepHeader({ step, total = 4, onBack, backTo = "/plan" }) {
  return (
    <div className="relative mx-auto mt-6 flex max-w-6xl items-center justify-between px-6 sm:px-10 font-body">
      <BackButton fallbackPath={backTo} onClick={onBack} label="Back" variant="ghost" />
      <p className="text-xs font-semibold uppercase tracking-[0.15em] text-ink/50">
        Step {step} of {total}
      </p>
      <div className="w-12" /> {/* Balancing spacer */}
    </div>
  );
}
