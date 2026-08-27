import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  ArrowLeft,
  ArrowRight,
  Palmtree,
  Compass,
  Landmark,
  ScrollText,
  Users,
  Heart,
  UserRound,
  Users2,
} from "lucide-react";
import SiteNavbar from "../components/layout/SiteNavbar";
import WizardStepper from "../components/layout/WizardStepper";
import { usePlanningDraft } from "../hooks/usePlanningDraft";
import pyramidsHero from "../assets/the-pyramids-of-giza1.jpg";

const DURATION_PRESETS = [3, 5, 7, 10];

const INTERESTS = [
  { key: "relaxation", label: "Relaxation", icon: Palmtree },
  { key: "adventure", label: "Adventure", icon: Compass },
  { key: "culture", label: "Culture", icon: Landmark },
  { key: "history", label: "History", icon: ScrollText },
];

const COMPANIONS = [
  { key: "friends", label: "Friends", icon: Users },
  { key: "family", label: "Family", icon: Users2 },
  { key: "couple", label: "Couple", icon: Heart },
  { key: "solo", label: "Solo", icon: UserRound },
];

function addMonths(date, n) {
  return new Date(date.getFullYear(), date.getMonth() + n, 1);
}

function daysInMonth(date) {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
}

function firstWeekdayOfMonth(date) {
  return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
}

function sameDay(a, b) {
  return a && b && a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

function formatShort(date) {
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

/**
 * MiniCalendar
 * A dependency-free month grid — no external date library is installed in
 * this project, so this is built on native Date math rather than adding
 * one just for a single picker. Matches the Figma card styling (gold
 * border, muted-gold day cells, white cell for the selected date).
 */
function MiniCalendar({ monthDate, onNavigate, selectedDate, onSelectDate }) {
  const totalDays = daysInMonth(monthDate);
  const leadingBlanks = firstWeekdayOfMonth(monthDate);
  const cells = [...Array(leadingBlanks).fill(null), ...Array.from({ length: totalDays }, (_, i) => i + 1)];

  return (
    <div className="flex-1 rounded-2xl border border-gold/50 bg-sandbox p-5">
      <div className="mb-4 flex items-center justify-between">
        <button type="button" onClick={() => onNavigate(-1)} className="text-ink/50 hover:text-ink">
          <ChevronLeft className="h-4 w-4" />
        </button>
        <p className="font-display text-sm font-semibold text-ink">
          {monthDate.toLocaleDateString("en-US", { month: "long", year: "numeric" })}
        </p>
        <button type="button" onClick={() => onNavigate(1)} className="text-ink/50 hover:text-ink">
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1.5">
        {cells.map((day, i) => {
          if (!day) return <div key={`blank-${i}`} />;
          const cellDate = new Date(monthDate.getFullYear(), monthDate.getMonth(), day);
          const isSelected = sameDay(cellDate, selectedDate);
          return (
            <button
              key={day}
              type="button"
              onClick={() => onSelectDate(cellDate)}
              className={[
                "aspect-square rounded-lg text-xs font-medium transition-colors",
                isSelected ? "bg-white text-ink shadow-sm" : "bg-gold/25 text-ink/70 hover:bg-gold/40",
              ].join(" ")}
            >
              {day}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default function PlanningStep1() {
  const navigate = useNavigate();
  const { draft, updateDraft } = usePlanningDraft();

  const today = useMemo(() => new Date(), []);
  const [leftMonth, setLeftMonth] = useState(() => addMonths(today, 1));
  const [rightMonth, setRightMonth] = useState(() => addMonths(today, 1));
  const [startDate, setStartDate] = useState(() => (draft.startDate ? new Date(draft.startDate) : null));
  const [endDate, setEndDate] = useState(() => (draft.endDate ? new Date(draft.endDate) : null));
  const [duration, setDuration] = useState(draft.duration);
  const [interests, setInterests] = useState(draft.interests);
  const [companion, setCompanion] = useState(draft.companion);

  const nights =
    startDate && endDate ? Math.max(1, Math.round((endDate - startDate) / (1000 * 60 * 60 * 24))) : null;

  const toggleInterest = (key) => {
    setInterests((prev) => (prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]));
  };

  return (
    <div className="min-h-screen bg-cream font-body">
      <SiteNavbar />
      <div className="pt-6">
        <WizardStepper current="preferences" />
      </div>

      <main className="mx-auto max-w-6xl px-6 pb-20 pt-6 sm:px-10">
        {/* Hero */}
        <section className="relative overflow-hidden rounded-3xl">
          <img src={pyramidsHero} alt="" aria-hidden="true" className="h-72 w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-gold-dark/70 via-gold-dark/20 to-transparent" />

          <div className="absolute inset-0 flex flex-col justify-center px-8 sm:px-12">
            <h1 className="font-display text-3xl font-semibold text-ink">Tell us about your trip</h1>

            <div className="mt-6 flex max-w-xl flex-col gap-3 sm:flex-row">
              <div className="flex flex-1 items-center justify-between rounded-full bg-gold/60 px-5 py-3 backdrop-blur-sm">
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-wide text-ink/60">Arrival</p>
                  <p className="text-sm font-medium text-ink">
                    {startDate ? formatShort(startDate) : "Select date"}
                  </p>
                </div>
                <CalendarDays className="h-4 w-4 text-ink/60" />
              </div>
              <div className="flex flex-1 items-center justify-between rounded-full bg-gold/60 px-5 py-3 backdrop-blur-sm">
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-wide text-ink/60">Return</p>
                  <p className="text-sm font-medium text-ink">{endDate ? formatShort(endDate) : "Select date"}</p>
                </div>
                <CalendarDays className="h-4 w-4 text-ink/60" />
              </div>
            </div>
          </div>
        </section>

        {/* Duration */}
        <section className="mt-10">
          <p className="mb-4 text-sm font-medium text-ink/70">How long are you staying?</p>
          <div className="flex flex-wrap gap-3">
            {DURATION_PRESETS.map((d) => (
              <button
                key={d}
                type="button"
                onClick={() => setDuration(d)}
                className={[
                  "rounded-full px-5 py-2 text-sm font-semibold transition-colors",
                  duration === d ? "bg-gold-dark text-cream" : "bg-gold/30 text-ink/70 hover:bg-gold/45",
                ].join(" ")}
              >
                {d}
                {d === 10 ? "+" : ""} days
              </button>
            ))}
          </div>
        </section>

        {/* Dual calendar */}
        <section className="mt-8">
          <div className="flex flex-col gap-5 sm:flex-row">
            <MiniCalendar
              monthDate={leftMonth}
              onNavigate={(dir) => setLeftMonth((m) => addMonths(m, dir))}
              selectedDate={startDate}
              onSelectDate={setStartDate}
            />
            <MiniCalendar
              monthDate={rightMonth}
              onNavigate={(dir) => setRightMonth((m) => addMonths(m, dir))}
              selectedDate={endDate}
              onSelectDate={setEndDate}
            />
          </div>

          <div className="mt-4 flex flex-col gap-2 rounded-xl border border-line px-5 py-3 text-sm text-ink/70 sm:flex-row sm:items-center sm:justify-between">
            <span className="flex items-center gap-2">
              <CalendarDays className="h-4 w-4 text-gold" />
              {startDate && endDate ? `${formatShort(startDate)} — ${formatShort(endDate)}` : "Select your dates above"}
            </span>
            {nights && <span className="font-medium">{nights} night{nights > 1 ? "s" : ""} selected</span>}
          </div>
        </section>

        {/* Interests */}
        <section className="mt-16">
          <h2 className="mb-6 font-display text-xl font-semibold text-ink">What are you interested in?</h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {INTERESTS.map(({ key, label, icon: Icon }) => {
              const active = interests.includes(key);
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => toggleInterest(key)}
                  className={[
                    "flex flex-col items-center gap-2.5 rounded-2xl border-2 py-6 transition-all",
                    active ? "border-gold bg-gold/10" : "border-line bg-cream hover:border-gold/50",
                  ].join(" ")}
                >
                  <Icon className={`h-5 w-5 ${active ? "text-gold-dark" : "text-ink/60"}`} />
                  <span className="text-sm font-semibold uppercase tracking-wide text-ink">{label}</span>
                </button>
              );
            })}
          </div>
        </section>

        {/* Traveling with */}
        <section className="mt-10">
          <h2 className="mb-6 font-display text-xl font-semibold text-ink">What are you traveling with?</h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {COMPANIONS.map(({ key, label, icon: Icon }) => {
              const active = companion === key;
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => setCompanion(key)}
                  className={[
                    "flex flex-col items-center gap-2.5 rounded-2xl border-2 py-6 transition-all",
                    active ? "border-gold bg-gold/10" : "border-line bg-cream hover:border-gold/50",
                  ].join(" ")}
                >
                  <Icon className={`h-5 w-5 ${active ? "text-gold-dark" : "text-ink/60"}`} />
                  <span className="text-sm font-semibold uppercase tracking-wide text-ink">{label}</span>
                </button>
              );
            })}
          </div>
        </section>

        {/* Nav buttons */}
        <div className="mt-16 flex items-center justify-between">
          <button type="button" onClick={() => navigate("/")} className="flex items-center gap-2 text-sm font-medium text-ink/60 hover:text-ink">
            <ArrowLeft className="h-4 w-4" />
            Back
          </button>
          <button
            type="button"
            onClick={() => {
              updateDraft({
                duration,
                startDate: startDate?.toISOString() ?? null,
                endDate: endDate?.toISOString() ?? null,
                interests,
                companion,
              });
              navigate("/plan/places");
            }}
            className="flex items-center gap-2 rounded-full bg-gold px-6 py-3 text-sm font-semibold text-cream shadow-sm transition-colors hover:bg-gold-light"
          >
            Continue
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </main>
    </div>
  );
}
