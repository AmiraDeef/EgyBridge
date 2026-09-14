import React, { useMemo, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  Users,
  Heart,
  UserRound,
  Users2,
  Church,
  Landmark,
  Flower2,
  Shield,
  Compass,
  Sailboat,
  Briefcase,
  Umbrella,
  Check,
  MapPin,
  Sparkles,
  Accessibility,
} from "lucide-react";
import SiteNavbar from "../components/layout/SiteNavbar";
import { usePlanningDraft } from "../context/PlanningContext";

// استيراد الصور
import pyramidsHero from "../assets/the-pyramids-of-giza1.jpg";
import guideCharacter from "../assets/character.png";

const INTERESTS = [
  { key: "religious", label: "Religious", icon: Church },
  { key: "historical", label: "Historical", icon: Landmark },
  { key: "wellness", label: "Wellness", icon: Flower2 },
  { key: "military", label: "Military", icon: Shield },
  { key: "adventure", label: "Adventure", icon: Compass },
  { key: "nile_cruise", label: "Nile Cruise", icon: Sailboat },
  { key: "business", label: "Business", icon: Briefcase },
  { key: "recreational", label: "Recreational", icon: Umbrella },
];

const COMPANIONS = [
  { key: "friends", label: "Friends", icon: Users },
  { key: "couple", label: "Couple", icon: Heart },
  { key: "family", label: "Family", icon: Users2 },
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
  const t = new Date(
    target.getFullYear(),
    target.getMonth(),
    target.getDate(),
  ).getTime();
  const s = new Date(
    start.getFullYear(),
    start.getMonth(),
    start.getDate(),
  ).getTime();
  const e = new Date(
    end.getFullYear(),
    end.getMonth(),
    end.getDate(),
  ).getTime();
  return t > s && t <= e;
}

function formatShort(date) {
  if (!date) return "Select date";
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function FigmaCalendar({
  label,
  monthDate,
  onNavigate,
  startDate,
  endDate,
  onSelectDate,
}) {
  const totalDays = daysInMonth(monthDate);
  const leadingBlanks = firstWeekdayOfMonth(monthDate);
  const cells = [
    ...Array(leadingBlanks).fill(null),
    ...Array.from({ length: totalDays }, (_, i) => i + 1),
  ];

  return (
    <div className="flex flex-col items-center">
      {/* Box فوق الكاليندر */}
      <div className="mb-4 flex w-72 items-center gap-4 rounded-xl border border-[#E6DBC9] bg-white px-5 py-3 shadow-sm">
        <CalendarDays className="h-7 w-7 text-[#8C6D3B]" />
        <div>
          <p className="text-xs font-bold uppercase tracking-wide text-[#A39274]">
            {label}
          </p>
          <p className="text-base font-bold text-[#4A3E2C]">
            {label === "Check-in"
              ? formatShort(startDate)
              : formatShort(endDate)}
          </p>
        </div>
      </div>

      {/* الكاليندر بتصميم الـ Gold / Warm Cream */}
      <div className="relative w-80 rounded-3xl border-2 border-[#CBB07E] bg-[#E8DAB8] p-5 shadow-md">
        <div className="absolute top-3 left-4 h-3 w-3 rounded-full bg-[#4A3512]" />
        <div className="absolute top-3 right-4 h-3 w-3 rounded-full bg-[#4A3512]" />

        <div className="mb-4 flex items-center justify-between border-b border-[#CBB387] pb-2">
          <button
            type="button"
            onClick={() => onNavigate(-1)}
            className="p-1 text-[#4A3512] hover:opacity-70"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <span className="font-serif text-lg font-bold text-[#4A3512]">
            {monthDate.toLocaleDateString("en-US", { month: "long" })}
          </span>
          <button
            type="button"
            onClick={() => onNavigate(1)}
            className="p-1 text-[#4A3512] hover:opacity-70"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
        </div>

        <div className="grid grid-cols-7 gap-2 text-center text-xs font-bold text-[#6E5325]">
          {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => (
            <span key={d} className="py-1">
              {d}
            </span>
          ))}
          {cells.map((day, i) => {
            if (!day) return <div key={`blank-${i}`} className="h-8 w-8" />;
            const cellDate = new Date(
              monthDate.getFullYear(),
              monthDate.getMonth(),
              day,
            );
            const isStart = sameDay(cellDate, startDate);
            const isEnd = sameDay(cellDate, endDate);
            const inRange = isDateInRange(cellDate, startDate, endDate);

            let cellStyle = "text-[#3B2B0F] hover:bg-[#D2BB8E]";
            if (isStart || isEnd) {
              cellStyle =
                "bg-[#7A5B27] text-white font-bold rounded-lg shadow-md";
            } else if (inRange) {
              cellStyle = "bg-[#CBB07E] text-[#2A1E0A] font-semibold";
            }

            return (
              <button
                key={day}
                type="button"
                onClick={() => onSelectDate(cellDate)}
                className={`flex h-8 w-8 items-center justify-center rounded-md text-sm font-medium transition ${cellStyle}`}
              >
                {day}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default function PlanningStep1() {
  const navigate = useNavigate();
  const { draft, updateDraft } = usePlanningDraft();
  const today = useMemo(() => new Date(), []);

  const [leftMonth, setLeftMonth] = useState(() => addMonths(today, 0));
  const [rightMonth, setRightMonth] = useState(() => addMonths(today, 1));

  // استرجاع البيانات من الـ draft إن وجدت
  const [startDate, setStartDate] = useState(() =>
    draft?.dates?.start ? new Date(draft.dates.start) : null,
  );
  const [endDate, setEndDate] = useState(() =>
    draft?.dates?.end ? new Date(draft.dates.end) : null,
  );
  const [interests, setInterests] = useState(draft?.interests || []);
  const [companion, setCompanion] = useState(draft?.companion || "solo");
  const [isAccessible, setIsAccessible] = useState(
    draft?.isAccessible || false,
  );

  const stepsSectionRef = useRef(null);

  const scrollToSteps = () => {
    stepsSectionRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleDateSelection = (date) => {
    if (!startDate || (startDate && endDate)) {
      setStartDate(date);
      setEndDate(null);
    } else if (startDate && !endDate) {
      if (date < startDate) {
        setStartDate(date);
        setEndDate(startDate);
      } else {
        setEndDate(date);
      }
    }
  };

  const toggleInterest = (key) => {
    setInterests((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key],
    );
  };

  // ✅ حفظ البيانات الحقيقية والانتقال للخطوة التالية
  const handleContinue = () => {
    updateDraft("dates", {
      start: startDate ? startDate.toISOString() : null,
      end: endDate ? endDate.toISOString() : null,
    });
    updateDraft("interests", interests);
    updateDraft("companion", companion);
    updateDraft("isAccessible", isAccessible);

    navigate("/plan/budget");
  };

  return (
    <div className="min-h-dvh bg-[#FAF6ED] pb-20 font-sans text-[#2D261E]">
      <SiteNavbar />

      {/* Hero Header */}
      <section className="relative h-[420px] w-full overflow-hidden">
        <img
          src={pyramidsHero}
          alt="Hero"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-black/30" />

        <div className="absolute inset-0 flex flex-col items-center justify-center px-6 pt-4">
          <h1 className="mb-5 font-serif text-4xl font-bold text-white drop-shadow-md md:text-5xl">
            Tell us about your trip
          </h1>

          {/* Navigation Bar Overlay */}
          <div className="mb-5 flex rounded-2xl bg-black/40 p-1.5 backdrop-blur-md">
            <button className="flex items-center gap-2 rounded-xl px-6 py-2.5 text-sm font-bold text-cream">
              <Sparkles className="h-4 w-4 text-[#B89332]" />
              AI planner
            </button>
            <button className="px-6 py-2.5 text-sm font-semibold text-white hover:text-[#F3E2C2]">
              Quick Booking
            </button>
            <button className="px-6 py-2.5 text-sm font-semibold text-white hover:text-[#F3E2C2]">
              Sightseeing Tickets
            </button>
          </div>

          {/* Filter Bar */}
          <div className="flex w-full max-w-5xl flex-col gap-3 rounded-2xl border border-white/10 bg-black/40 p-3 backdrop-blur-md sm:flex-row sm:items-center">
            <div className="flex flex-1 items-center gap-3 rounded-xl bg-black/20 px-4 py-2.5 text-white">
              <MapPin className="h-5 w-5 text-[#CBB07E]" />
              <div className="text-left">
                <span className="block text-[10px] font-bold uppercase tracking-wider text-[#D6C4A5]">
                  Tourist Destination
                </span>
                <span className="block truncate text-sm font-medium text-white/90">
                  Cairo, Luxor, Sharm El-Sheikh...
                </span>
              </div>
            </div>

            <div className="flex flex-1 items-center gap-3 rounded-xl bg-black/20 px-4 py-2.5 text-white">
              <CalendarDays className="h-5 w-5 text-[#CBB07E]" />
              <div className="text-left">
                <span className="block text-[10px] font-bold uppercase tracking-wider text-[#D6C4A5]">
                  Trip Dates
                </span>
                <span className="block text-sm font-medium text-white/90">
                  {startDate && endDate
                    ? `${formatShort(startDate)} - ${formatShort(endDate)}`
                    : "Check-in - Check-out"}
                </span>
              </div>
            </div>

            <div className="flex flex-1 items-center gap-3 rounded-xl bg-black/20 px-4 py-2.5 text-white">
              <Briefcase className="h-5 w-5 text-[#CBB07E]" />
              <div className="text-left">
                <span className="block text-[10px] font-bold uppercase tracking-wider text-[#D6C4A5]">
                  Budget & Interests
                </span>
                <span className="block truncate text-sm font-medium text-white/90">
                  Medium - Cultural & Historical
                </span>
              </div>
            </div>
          </div>

          {/* Accessible Switch Toggle + Submit Button */}
          <div className="mt-5 flex w-full max-w-5xl items-center justify-between px-2">
            <button
              type="button"
              onClick={() => setIsAccessible(!isAccessible)}
              className="flex items-center gap-4 rounded-full bg-[#FCE8E6] px-5 py-2.5 shadow-sm transition hover:bg-[#F9D7D3]"
            >
              <div className="flex items-center gap-2">
                <Accessibility className="h-5 w-5 text-rose-600" />
                <span className="text-sm font-bold text-rose-950">
                  People with disabilities
                </span>
              </div>

              <div
                className={`relative h-6 w-11 rounded-full transition-colors ${
                  isAccessible ? "bg-rose-600" : "bg-gray-300"
                }`}
              >
                <span
                  className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white transition-transform ${
                    isAccessible ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </div>
            </button>

            <button
              type="button"
              onClick={scrollToSteps}
              className="rounded-full bg-[#B89332] px-8 py-3 text-sm font-bold uppercase tracking-wider text-white shadow-lg transition hover:bg-[#9E7A26] active:scale-95"
            >
              CREATE MY JOURNEY
            </button>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <main ref={stepsSectionRef} className="mx-auto max-w-5xl px-6 py-12">
        <div className="mb-10 flex items-center justify-between border-b border-[#EADFCB] pb-4 text-sm font-medium text-[#8C7A5E]">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-1.5 hover:text-[#4A3E2C]"
          >
            <ChevronLeft className="h-5 w-5" /> Back
          </button>
          <span className="font-semibold">Step 1 of 5</span>
        </div>

        <div className="mb-12 text-center">
          <h2 className="mb-2 font-serif text-3xl font-bold text-[#3B3021]">
            When will you travel?
          </h2>
          <p className="text-sm text-[#73634C]">
            Select your ideal start and end dates.
          </p>
        </div>

        {/* Calendar Section */}
        <div className="flex flex-col items-center justify-center gap-10 lg:flex-row">
          <FigmaCalendar
            label="Check-in"
            monthDate={leftMonth}
            onNavigate={(dir) => setLeftMonth((m) => addMonths(m, dir))}
            startDate={startDate}
            endDate={endDate}
            onSelectDate={handleDateSelection}
          />
          <FigmaCalendar
            label="Check-out"
            monthDate={rightMonth}
            onNavigate={(dir) => setRightMonth((m) => addMonths(m, dir))}
            startDate={startDate}
            endDate={endDate}
            onSelectDate={handleDateSelection}
          />
        </div>

        <div className="my-20 flex items-center justify-center gap-4">
          <div className="h-[1px] w-24 bg-[#EADFCB]" />
          <div className="h-2 w-2 rounded-full bg-[#CBB07E]" />
          <div className="h-[1px] w-24 bg-[#EADFCB]" />
        </div>

        <div className="relative rounded-3xl border border-[#E8DFC8] bg-[#F7F3EB] p-8 shadow-sm sm:p-12">
          {guideCharacter && (
            <img
              src={guideCharacter}
              alt="Guide Character"
              className="absolute -top-[80px] right-2 h-40 w-auto object-contain drop-shadow-md sm:-top-[210px] sm:h-52"
            />
          )}

          <div className="mb-10 text-center">
            <h3 className="inline-block border-b-2 border-[#CBB07E] pb-2 font-serif text-2xl font-bold text-[#3B3021]">
              Tell us about your trip
            </h3>
          </div>

          {/* Section 1: Companions */}
          <section className="mb-12">
            <h4 className="mb-4 text-base font-bold text-[#4A3E2C]">
              Who are you traveling with?
            </h4>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {COMPANIONS.map(({ key, label, icon: Icon }) => {
                const active = companion === key;
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setCompanion(key)}
                    className={`flex items-center justify-between rounded-2xl border px-6 py-4 transition ${
                      active
                        ? "border-[#B89332] bg-[#FFFDF9] shadow-md ring-1 ring-[#B89332]"
                        : "border-[#E5DEC9] bg-white hover:border-[#C8B896]"
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <Icon className="h-6 w-6 text-[#73634C]" />
                      <span className="text-sm font-bold text-[#3B3021]">
                        {label}
                      </span>
                    </div>
                    <div
                      className={`flex h-5 w-5 items-center justify-center rounded-md border ${
                        active
                          ? "border-[#3B3021] bg-[#3B3021] text-white"
                          : "border-[#C8B896]"
                      }`}
                    >
                      {active && (
                        <Check className="h-3.5 w-3.5" strokeWidth={3} />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </section>

          {/* Section 2: Interests */}
          <section>
            <h4 className="mb-4 text-base font-bold text-[#4A3E2C]">
              What are you interested in?
            </h4>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {INTERESTS.map(({ key, label, icon: Icon }) => {
                const active = interests.includes(key);
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => toggleInterest(key)}
                    className={`flex items-center justify-between rounded-2xl border px-6 py-4 transition ${
                      active
                        ? "border-[#B89332] bg-[#FFFDF9] shadow-md ring-1 ring-[#B89332]"
                        : "border-[#E5DEC9] bg-white hover:border-[#C8B896]"
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <Icon className="h-6 w-6 text-[#73634C]" />
                      <span className="text-sm font-bold text-[#3B3021]">
                        {label}
                      </span>
                    </div>
                    <div
                      className={`flex h-5 w-5 items-center justify-center rounded-md border ${
                        active
                          ? "border-[#3B3021] bg-[#3B3021] text-white"
                          : "border-[#C8B896]"
                      }`}
                    >
                      {active && (
                        <Check className="h-3.5 w-3.5" strokeWidth={3} />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </section>
        </div>

        {/* Continue Button */}
        <div className="mt-14 flex justify-center">
          <button
            type="button"
            onClick={handleContinue}
            className="flex w-full items-center justify-center gap-3 rounded-2xl bg-[#B89332] py-4 text-sm font-bold uppercase tracking-wider text-white shadow-lg transition hover:bg-[#9E7A26]"
          >
            CONTINUE
            <ArrowRight className="h-5 w-5" />
          </button>
        </div>
      </main>
    </div>
  );
}
