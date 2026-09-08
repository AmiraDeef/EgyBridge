import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  Clock,
  Wallet,
  Users,
  Sparkles,
  Info,
  CalendarCheck,
  Check,
} from "lucide-react";
import SiteNavbar from "../components/layout/SiteNavbar";
import WizardStepper from "../components/layout/WizardStepper";
import BackButton from "../components/common/BackButton";
import { usePlanningDraft } from "../hooks/usePlanningDraft";

const DURATION_PRESETS = [3, 5, 7, 8, 10, 14];

const COMPANIONS = [
  { key: "solo", label: "Solo Traveler", multiplier: 1 },
  { key: "couple", label: "Couple (2 Persons)", multiplier: 1.8 },
  { key: "family", label: "Family (3-4 Persons)", multiplier: 2.6 },
  { key: "friends", label: "Group of Friends", multiplier: 3.2 },
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
  return (
    a &&
    b &&
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function isDateInRange(target, start, end) {
  if (!target || !start || !end) return false;
  const t = new Date(target.getFullYear(), target.getMonth(), target.getDate()).getTime();
  const s = new Date(start.getFullYear(), start.getMonth(), start.getDate()).getTime();
  const e = new Date(end.getFullYear(), end.getMonth(), end.getDate()).getTime();
  return t >= s && t <= e;
}

function formatFormattedDate(date) {
  if (!date) return "Select date";
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

/**
 * Calculates the exact inclusive calendar days count between start and end dates.
 * Example: May 10 to May 17 = 8 days (May 10, 11, 12, 13, 14, 15, 16, 17 inclusive).
 */
export function calculateInclusiveDays(startDate, endDate) {
  if (!startDate || !endDate) return 0;
  const start = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate());
  const end = new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate());
  const diffMs = end.getTime() - start.getTime();
  if (diffMs < 0) return 1;
  const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));
  return diffDays + 1; // Inclusive day count
}

/**
 * MiniInteractiveCalendar
 * Visual monthly calendar supporting single date and range selection with gold highlight
 */
function MiniInteractiveCalendar({
  monthDate,
  onNavigate,
  startDate,
  endDate,
  onDateClick,
}) {
  const totalDays = daysInMonth(monthDate);
  const leadingBlanks = firstWeekdayOfMonth(monthDate);
  const cells = [...Array(leadingBlanks).fill(null), ...Array.from({ length: totalDays }, (_, i) => i + 1)];

  return (
    <div className="flex-1 rounded-3xl border border-gold/40 bg-sandbox p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <button
          type="button"
          onClick={() => onNavigate(-1)}
          className="rounded-full p-1 text-ink/60 transition-colors hover:bg-cream hover:text-ink"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <p className="font-display text-sm font-bold text-ink">
          {monthDate.toLocaleDateString("en-US", { month: "long", year: "numeric" })}
        </p>
        <button
          type="button"
          onClick={() => onNavigate(1)}
          className="rounded-full p-1 text-ink/60 transition-colors hover:bg-cream hover:text-ink"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center">
        {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day) => (
          <span key={day} className="text-[10px] font-bold uppercase tracking-wider text-ink/40 py-1">
            {day}
          </span>
        ))}

        {cells.map((day, i) => {
          if (!day) return <div key={`blank-${i}`} className="aspect-square" />;
          const cellDate = new Date(monthDate.getFullYear(), monthDate.getMonth(), day);
          const isStart = sameDay(cellDate, startDate);
          const isEnd = sameDay(cellDate, endDate);
          const inRange = isDateInRange(cellDate, startDate, endDate);

          let cellClass = "bg-gold/20 text-ink hover:bg-gold/40";
          if (isStart || isEnd) {
            cellClass = "bg-gold text-cream font-bold shadow-md scale-105";
          } else if (inRange) {
            cellClass = "bg-gold/40 text-ink font-semibold";
          }

          return (
            <button
              key={day}
              type="button"
              onClick={() => onDateClick(cellDate)}
              className={`aspect-square rounded-xl text-xs transition-all duration-150 ${cellClass}`}
            >
              {day}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default function PlanningStep2Dates() {
  const navigate = useNavigate();
  const { draft, updateDraft } = usePlanningDraft();

  const today = useMemo(() => new Date(), []);
  const initialStart = useMemo(() => {
    if (draft.startDate) return new Date(draft.startDate);
    const d = new Date();
    d.setDate(d.getDate() + 14); // 2 weeks from today default
    return d;
  }, [draft.startDate]);

  const initialEnd = useMemo(() => {
    if (draft.endDate) return new Date(draft.endDate);
    const d = new Date(initialStart);
    d.setDate(d.getDate() + (draft.duration ? draft.duration - 1 : 7)); // Default 8 days inclusive
    return d;
  }, [draft.endDate, initialStart, draft.duration]);

  const [startDate, setStartDate] = useState(initialStart);
  const [endDate, setEndDate] = useState(initialEnd);
  const [leftMonth, setLeftMonth] = useState(() => addMonths(today, 1));
  const [rightMonth, setRightMonth] = useState(() => addMonths(today, 2));
  const [selectedCompanion, setSelectedCompanion] = useState(draft.companion || "couple");

  // Dynamic exact inclusive days calculation (e.g. May 10 to May 17 = 8 days)
  const calculatedDays = useMemo(() => {
    return calculateInclusiveDays(startDate, endDate);
  }, [startDate, endDate]);

  const calculatedNights = useMemo(() => {
    return Math.max(1, calculatedDays - 1);
  }, [calculatedDays]);

  // Calendar click handler supporting start -> end date picking
  const handleDateClick = (clickedDate) => {
    if (!startDate || (startDate && endDate)) {
      setStartDate(clickedDate);
      setEndDate(null);
    } else if (startDate && !endDate) {
      if (clickedDate < startDate) {
        setStartDate(clickedDate);
        setEndDate(startDate);
      } else {
        setEndDate(clickedDate);
      }
    }
  };

  // Preset duration button click handler
  const handlePresetSelect = (daysCount) => {
    const start = startDate || new Date();
    const newEnd = new Date(start);
    newEnd.setDate(start.getDate() + (daysCount - 1));
    setStartDate(start);
    setEndDate(newEnd);
  };

  // Scaled Price Estimates calculation
  const companionObj = COMPANIONS.find((c) => c.key === selectedCompanion) || COMPANIONS[1];
  const estimatedDailyRate = 135; // base rate in USD
  const estimatedTotalBudget = Math.round(calculatedDays * estimatedDailyRate * companionObj.multiplier);

  // Scaled Itinerary Breakdown generator for any duration (e.g. 7, 8, 10, 14 days)
  const destinationsList = draft.destinations && draft.destinations.length > 0 ? draft.destinations : ["Cairo", "Luxor"];
  const itineraryDays = useMemo(() => {
    const days = [];
    for (let dayNum = 1; dayNum <= Math.max(1, calculatedDays); dayNum++) {
      const city = destinationsList[(dayNum - 1) % destinationsList.length];
      let highlight = "";
      if (dayNum === 1) highlight = `Arrival & Welcome in ${city}, Check-in & Evening Nile Walk`;
      else if (dayNum === calculatedDays) highlight = `Farewell Souvenirs, Final Exploration & Departure`;
      else highlight = `Full Day Guided Discovery & Heritage Tour in ${city}`;

      days.push({
        day: dayNum,
        city,
        highlight,
      });
    }
    return days;
  }, [calculatedDays, destinationsList]);

  const handleContinue = () => {
    updateDraft({
      startDate: startDate ? startDate.toISOString() : null,
      endDate: endDate ? endDate.toISOString() : null,
      duration: calculatedDays,
      budget: estimatedTotalBudget,
      companion: selectedCompanion,
    });
    // Advance to Step 3: Places & Services
    navigate("/plan/places");
  };

  return (
    <div className="min-h-screen bg-cream font-body">
      <SiteNavbar />
      <div className="pt-6">
        <WizardStepper current="preferences" />
      </div>

      <main className="mx-auto max-w-6xl px-6 pb-24 pt-6 sm:px-10">
        {/* Step Navigation Header */}
        <div className="mb-6 flex items-center justify-between">
          <BackButton fallbackPath="/plan/destination" label="Back to Destinations" />
          <span className="text-xs font-semibold uppercase tracking-widest text-ink/50">
            Step 2 of 4: Dates & Duration
          </span>
        </div>

        {/* Hero Banner with Live Dynamic Duration Badge */}
        <div className="rounded-3xl border border-line bg-sandbox p-6 sm:p-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-gold/15 px-3 py-1 text-xs font-bold uppercase tracking-wider text-gold-dark">
                <CalendarDays className="h-3.5 w-3.5 text-gold" />
                Duration & Dates Calculator
              </div>
              <h1 className="mt-3 font-display text-2xl font-bold text-ink sm:text-3xl">
                When are you taking this journey?
              </h1>
              <p className="mt-1 text-xs sm:text-sm text-ink/65">
                Pick your travel dates or choose a duration preset. The itinerary and budget dynamically scale to the exact length.
              </p>
            </div>

            {/* Live calculated pill */}
            <div className="rounded-2xl border-2 border-gold bg-cream p-4 text-center shadow-md sm:min-w-[190px]">
              <span className="text-[10px] font-bold uppercase tracking-wider text-ink/50">
                Calculated Trip Length
              </span>
              <p className="font-display text-2xl font-bold text-gold-dark">
                {calculatedDays} Days
              </p>
              <p className="text-xs font-semibold text-ink/75">
                {calculatedNights} Night{calculatedNights > 1 ? "s" : ""} in Egypt
              </p>
            </div>
          </div>

          {/* Quick Duration Presets */}
          <div className="mt-6">
            <p className="text-xs font-bold uppercase tracking-wider text-ink/60 mb-2.5">
              Quick Duration Presets:
            </p>
            <div className="flex flex-wrap gap-2.5">
              {DURATION_PRESETS.map((d) => {
                const isSelected = calculatedDays === d;
                return (
                  <button
                    key={d}
                    type="button"
                    onClick={() => handlePresetSelect(d)}
                    className={`rounded-full px-5 py-2 text-xs font-bold transition-all ${
                      isSelected
                        ? "bg-gold text-cream shadow-md scale-105"
                        : "border border-line bg-cream text-ink/70 hover:border-gold/60 hover:bg-cream/80"
                    }`}
                  >
                    {d} Days
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Interactive Dual Calendar Picker */}
        <div className="mt-8">
          <div className="mb-4 flex flex-col gap-2 rounded-2xl border border-gold/40 bg-cream p-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <CalendarCheck className="h-5 w-5 text-gold-dark" />
              <div>
                <p className="text-xs text-ink/50 font-medium">Selected Range</p>
                <p className="font-display text-sm font-bold text-ink">
                  {formatFormattedDate(startDate)} → {formatFormattedDate(endDate)}
                </p>
              </div>
            </div>
            <div className="text-xs text-ink/60">
              💡 Tip: Click start date then end date on the calendar to customize
            </div>
          </div>

          <div className="flex flex-col gap-6 lg:flex-row">
            <MiniInteractiveCalendar
              monthDate={leftMonth}
              onNavigate={(dir) => setLeftMonth((m) => addMonths(m, dir))}
              startDate={startDate}
              endDate={endDate}
              onDateClick={handleDateClick}
            />
            <MiniInteractiveCalendar
              monthDate={rightMonth}
              onNavigate={(dir) => setRightMonth((m) => addMonths(m, dir))}
              startDate={startDate}
              endDate={endDate}
              onDateClick={handleDateClick}
            />
          </div>
        </div>

        {/* Companion & Dynamic Pricing Estimates */}
        <div className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Traveling with */}
          <div className="rounded-3xl border border-line bg-cream p-6 shadow-sm">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-gold-dark" />
              <h2 className="font-display text-base font-bold text-ink">
                Who are you traveling with?
              </h2>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-3">
              {COMPANIONS.map((comp) => {
                const active = selectedCompanion === comp.key;
                return (
                  <button
                    key={comp.key}
                    type="button"
                    onClick={() => setSelectedCompanion(comp.key)}
                    className={`rounded-2xl border-2 p-4 text-left transition-all ${
                      active
                        ? "border-gold bg-gold/10 shadow-sm font-bold"
                        : "border-line bg-sandbox text-ink/75 hover:border-gold/50"
                    }`}
                  >
                    <p className="text-xs font-semibold text-ink">{comp.label}</p>
                    <p className="text-[10px] text-ink/50 mt-0.5">
                      {comp.key === "solo" ? "Single traveler" : "Shared room options"}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Dynamic Scaling Budget Breakdown */}
          <div className="rounded-3xl border border-gold/40 bg-sandbox p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Wallet className="h-4 w-4 text-gold-dark" />
                <h2 className="font-display text-base font-bold text-ink">
                  Estimated Trip Budget
                </h2>
              </div>
              <span className="font-display text-2xl font-bold text-gold-dark">
                ${estimatedTotalBudget} USD
              </span>
            </div>

            <div className="mt-4 space-y-2 text-xs text-ink/75">
              <div className="flex justify-between border-b border-line/60 pb-1.5">
                <span>Duration ({calculatedDays} Days / {calculatedNights} Nights):</span>
                <span className="font-semibold">${calculatedDays * 85}</span>
              </div>
              <div className="flex justify-between border-b border-line/60 pb-1.5">
                <span>Accommodation & Private Transport:</span>
                <span className="font-semibold">${Math.round(calculatedDays * 35 * companionObj.multiplier)}</span>
              </div>
              <div className="flex justify-between pb-1">
                <span>Monument Entry & Heritage Guidance:</span>
                <span className="font-semibold">${Math.round(calculatedDays * 15 * companionObj.multiplier)}</span>
              </div>
            </div>

            <p className="mt-3 rounded-xl bg-cream/80 p-2.5 text-[11px] text-ink/65">
              ✨ Accurate estimation calibrated for {calculatedDays} days across {destinationsList.join(", ")}.
            </p>
          </div>
        </div>

        {/* Scaled Day-by-Day Itinerary Outline Preview */}
        <div className="mt-10 rounded-3xl border border-line bg-cream p-6 shadow-sm sm:p-8">
          <div className="flex items-center justify-between border-b border-line/60 pb-4">
            <div>
              <h2 className="font-display text-lg font-bold text-ink">
                Scaled {calculatedDays}-Day Itinerary Outline
              </h2>
              <p className="text-xs text-ink/55">
                Daily breakdown dynamically tailored to your exact {calculatedDays} days
              </p>
            </div>
            <span className="rounded-full bg-gold/15 px-3 py-1 text-xs font-bold text-gold-dark">
              {itineraryDays.length} Days Generated
            </span>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {itineraryDays.map((item) => (
              <div
                key={item.day}
                className="rounded-2xl border border-line bg-sandbox p-4 transition-transform hover:scale-[1.02]"
              >
                <div className="flex items-center justify-between">
                  <span className="rounded-lg bg-gold px-2 py-0.5 text-[10px] font-bold text-cream">
                    Day {item.day}
                  </span>
                  <span className="text-[11px] font-bold text-gold-dark">
                    📍 {item.city}
                  </span>
                </div>
                <p className="mt-2.5 text-xs font-semibold leading-snug text-ink line-clamp-2">
                  {item.highlight}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Actions Footer */}
        <div className="mt-12 flex items-center justify-between border-t border-line/60 pt-6">
          <BackButton fallbackPath="/plan/destination" label="Back to Destinations" />

          <button
            type="button"
            onClick={handleContinue}
            className="flex items-center gap-2 rounded-full bg-gold px-8 py-3 text-sm font-semibold text-cream shadow-md transition-all hover:bg-gold-light hover:shadow-lg"
          >
            <span>Continue to Places & Budget</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </main>
    </div>
  );
}
