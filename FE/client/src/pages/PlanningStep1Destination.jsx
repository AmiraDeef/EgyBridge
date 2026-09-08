import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  MapPin,
  Landmark,
  Compass,
  ArrowRight,
  Check,
  Search,
  Clock,
  Coins,
  Sparkles,
  Info,
} from "lucide-react";
import SiteNavbar from "../components/layout/SiteNavbar";
import WizardStepper from "../components/layout/WizardStepper";
import BackButton from "../components/common/BackButton";
import { usePlanningDraft } from "../hooks/usePlanningDraft";
import homePic from "../assets/homePic.jpg";

// Strict geographic landmark mapping to prevent cross-city misallocation
export const STRICT_CITY_LANDMARKS = {
  Cairo: [
    {
      id: "cairo-pyramids",
      name: "Pyramids of Giza & Great Sphinx",
      city: "Cairo",
      category: "Ancient Wonder",
      duration: "3–4 hours",
      priceEgp: 540,
      image:
        "https://images.unsplash.com/photo-1524686975162-f6fb4d39759c?auto=format&fit=crop&w=800&q=80",
      description:
        "The last surviving wonder of the ancient world on the Giza plateau.",
      tips: "Visit early morning before tour buses arrive. Wear comfortable desert shoes.",
    },
    {
      id: "cairo-museum",
      name: "The Egyptian Museum (Tahrir)",
      city: "Cairo",
      category: "Museum",
      duration: "2–3 hours",
      priceEgp: 300,
      image:
        "https://images.unsplash.com/photo-1572252009286-268acec5ca0a?auto=format&fit=crop&w=800&q=80",
      description:
        "Over 120,000 ancient artifacts including Royal Mummies and golden treasures.",
      tips: "Hire a licensed guide inside for rich historical stories.",
    },
    {
      id: "cairo-bazaar",
      name: "Khan El Khalili Bazaar",
      city: "Cairo",
      category: "Culture & Market",
      duration: "2–3 hours",
      priceEgp: 0,
      image:
        "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=800&q=80",
      description:
        "Famous medieval marketplace filled with lamps, spices, perfumes and cafés.",
      tips: "Haggling is customary. Try mint tea at El Fishawy café.",
    },
    {
      id: "cairo-citadel",
      name: "Citadel of Saladin & Mosque of Muhammad Ali",
      city: "Cairo",
      category: "Historic Citadel",
      duration: "2 hours",
      priceEgp: 300,
      image:
        "https://images.unsplash.com/photo-1566192091743-5966a6079984?auto=format&fit=crop&w=800&q=80",
      description:
        "Historic fortress perched atop the city with panoramic skyline views of Cairo.",
      tips: "Modest dress required inside the alabaster mosque.",
    },
    {
      id: "cairo-nmec",
      name: "National Museum of Egyptian Civilization (NMEC)",
      city: "Cairo",
      category: "Museum",
      duration: "2 hours",
      priceEgp: 350,
      image:
        "https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=800&q=80",
      description:
        "State-of-the-art museum housing the 22 Royal Pharaohs Mummies Hall.",
      tips: "No photography allowed inside the Royal Mummies chamber.",
    },
    {
      id: "cairo-saqqara",
      name: "Saqqara Step Pyramid of Djoser",
      city: "Cairo",
      category: "Archaeological Site",
      duration: "3 hours",
      priceEgp: 300,
      image:
        "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=800&q=80",
      description:
        "The world's earliest colossal stone building and the prototype of all pyramids.",
      tips: "Can be easily combined with a Memphis open-air museum tour.",
    },
  ],
  Luxor: [
    {
      id: "luxor-karnak",
      name: "Karnak Temple Complex",
      city: "Luxor",
      category: "Ancient Temple",
      duration: "3 hours",
      priceEgp: 450,
      image:
        "https://images.unsplash.com/photo-1678889413421-14be34e3b921?auto=format&fit=crop&w=800&q=80",
      description:
        "The largest ancient religious precinct in the world with the Great Hypostyle Hall.",
      tips: "Sunrise or late afternoon light creates spectacular column shadows.",
    },
    {
      id: "luxor-kings",
      name: "Valley of the Kings",
      city: "Luxor",
      category: "Royal Tombs",
      duration: "3–4 hours",
      priceEgp: 600,
      image:
        "https://images.unsplash.com/photo-1539650116574-8efeb43e2750?auto=format&fit=crop&w=800&q=80",
      description:
        "Underground burial site of the New Kingdom Pharaohs, including Tutankhamun.",
      tips: "Standard ticket includes 3 tombs. Extra ticket required for Tutankhamun & Seti I.",
    },
    {
      id: "luxor-temple",
      name: "Luxor Temple on the Nile",
      city: "Luxor",
      category: "Ancient Temple",
      duration: "2 hours",
      priceEgp: 400,
      image:
        "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=800&q=80",
      description:
        "Stunning riverside temple illuminated beautifully after dusk in central Luxor.",
      tips: "Best visited at sunset when the floodlights illuminate the colossal statues.",
    },
    {
      id: "luxor-hatshepsut",
      name: "Mortuary Temple of Hatshepsut",
      city: "Luxor",
      category: "Ancient Temple",
      duration: "2 hours",
      priceEgp: 360,
      image:
        "https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=800&q=80",
      description:
        "Terraced monument built into the towering limestone cliffs of Deir el-Bahari.",
      tips: "Take the electric train from the ticket gate to escape the mid-day heat.",
    },
    {
      id: "luxor-memnon",
      name: "Colossi of Memnon",
      city: "Luxor",
      category: "Monuments",
      duration: "30 mins",
      priceEgp: 0,
      image:
        "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=800&q=80",
      description:
        "Two monumental 18-meter stone statues of Pharaoh Amenhotep III standing on the West Bank.",
      tips: "Free open-air stop on your way to the Valley of the Kings.",
    },
  ],
  Aswan: [
    {
      id: "aswan-abusimbel",
      name: "Abu Simbel Temples of Ramses II",
      city: "Aswan",
      category: "UNESCO Wonder",
      duration: "2–3 hours",
      priceEgp: 600,
      image:
        "https://images.unsplash.com/photo-1539650116574-8efeb43e2750?auto=format&fit=crop&w=800&q=80",
      description:
        "Colossal rock-cut temples relocated in an engineering triumph to save them from Lake Nasser.",
      tips: "Reach via early morning flight or coach convoy from Aswan.",
    },
    {
      id: "aswan-philae",
      name: "Philae Temple of Goddess Isis",
      city: "Aswan",
      category: "Island Temple",
      duration: "2 hours",
      priceEgp: 450,
      image:
        "https://images.unsplash.com/photo-1633033254409-bd538e785f51?auto=format&fit=crop&w=800&q=80",
      description:
        "Island temple complex dedicated to Isis, reached by scenic motorboat across the Nile.",
      tips: "Agree on roundtrip boat fare with boat captain at the marina before departure.",
    },
    {
      id: "aswan-highdam",
      name: "Aswan High Dam & Lake Nasser",
      city: "Aswan",
      category: "Modern Wonder",
      duration: "1 hour",
      priceEgp: 200,
      image:
        "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80",
      description:
        "Modern engineering marvel providing power and irrigation throughout Egypt.",
      tips: "Offers sweeping vistas over the reservoir Lake Nasser and Lotus monument.",
    },
    {
      id: "aswan-nubian",
      name: "Nubian Village (Gharb Soheil)",
      city: "Aswan",
      category: "Living Culture",
      duration: "3 hours",
      priceEgp: 0,
      image:
        "https://images.unsplash.com/photo-1633033254409-bd538e785f51?auto=format&fit=crop&w=800&q=80",
      description:
        "Brightly painted traditional houses, Nile views, hibiscus tea, and local handicrafts.",
      tips: "Take a traditional felucca or motorboat past Elephantine Island to arrive.",
    },
  ],
  Alexandria: [
    {
      id: "alex-qaitbay",
      name: "Citadel of Qaitbay",
      city: "Alexandria",
      category: "Seaside Fortress",
      duration: "1.5 hours",
      priceEgp: 150,
      image:
        "https://images.unsplash.com/photo-1682090471391-413a38705abe?auto=format&fit=crop&w=800&q=80",
      description:
        "15th-century defensive fortress on the Mediterranean, on the site of the ancient Pharos Lighthouse.",
      tips: "Enjoy the sea breeze and walk along the Alexandria Corniche afterwards.",
    },
    {
      id: "alex-library",
      name: "Bibliotheca Alexandrina",
      city: "Alexandria",
      category: "Modern Architecture",
      duration: "2 hours",
      priceEgp: 150,
      image:
        "https://images.unsplash.com/photo-1572252009286-268acec5ca0a?auto=format&fit=crop&w=800&q=80",
      description:
        "Commemoration of the ancient Library of Alexandria with vast reading halls and planetarium.",
      tips: "Guided architectural tours in English and Arabic run every 45 minutes.",
    },
  ],
  "Red Sea": [
    {
      id: "redsea-giftun",
      name: "Giftun Island Coral Reefs",
      city: "Red Sea",
      category: "Marine Reserve",
      duration: "Full Day",
      priceEgp: 800,
      image:
        "https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=800&q=80",
      description:
        "Crystal-clear turquoise waters with world-renowned coral gardens and snorkeling.",
      tips: "Bring eco-friendly sunscreen that does not damage coral reefs.",
    },
  ],
};

const CITY_OPTIONS = [
  {
    name: "Cairo",
    badge: "Pyramids & History",
    color: "from-amber-600 to-amber-800",
  },
  {
    name: "Luxor",
    badge: "Ancient Capital & Tombs",
    color: "from-yellow-600 to-amber-900",
  },
  {
    name: "Aswan",
    badge: "Nile & Nubian Culture",
    color: "from-emerald-700 to-teal-900",
  },
  {
    name: "Alexandria",
    badge: "Mediterranean Coast",
    color: "from-blue-700 to-cyan-900",
  },
  {
    name: "Red Sea",
    badge: "Beaches & Diving",
    color: "from-teal-600 to-emerald-800",
  },
];

export default function PlanningStep1Destination() {
  const navigate = useNavigate();
  const { draft, updateDraft } = usePlanningDraft();

  // State: selected cities (default to Cairo if empty)
  const [selectedCities, setSelectedCities] = useState(() =>
    draft.destinations && draft.destinations.length > 0
      ? draft.destinations
      : ["Cairo"],
  );

  // State: selected landmarks IDs
  const [selectedLandmarks, setSelectedLandmarks] = useState(
    () => draft.selectedPlaceIds || [],
  );

  // Search filter
  const [searchQuery, setSearchQuery] = useState("");

  const toggleCity = (city) => {
    setSelectedCities((prev) => {
      if (prev.includes(city)) {
        if (prev.length === 1) return prev; // Keep at least one city selected
        return prev.filter((c) => c !== city);
      } else {
        return [...prev, city];
      }
    });
  };

  const toggleLandmark = (id) => {
    setSelectedLandmarks((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  // Strictly filter landmarks based on currently selected cities
  const visibleLandmarks = useMemo(() => {
    const pool = [];
    selectedCities.forEach((city) => {
      if (STRICT_CITY_LANDMARKS[city]) {
        pool.push(...STRICT_CITY_LANDMARKS[city]);
      }
    });

    if (!searchQuery.trim()) return pool;
    const q = searchQuery.toLowerCase();
    return pool.filter(
      (item) =>
        item.name.toLowerCase().includes(q) ||
        item.city.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q),
    );
  }, [selectedCities, searchQuery]);

  const handleContinue = () => {
    updateDraft({
      destinations: selectedCities,
      selectedPlaceIds: selectedLandmarks,
    });
    // Advance to Step 2: Calendar & Dates
    navigate("/plan/dates");
  };

  return (
    <div className="min-h-screen bg-[#faf7ef] font-body text-[#2f2616]">
      <SiteNavbar />
      <div className="pt-5">
        <WizardStepper current="preferences" />
      </div>

      <main className="mx-auto max-w-[920px] px-5 pb-20 pt-5 sm:px-8">
        {/* Navigation Bar with Back Button */}
        <div className="mb-5 flex items-center justify-between">
          <BackButton fallbackPath="/" label="Back" />
          <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#8c806c]">
            Step 1 of 4: Choose Destinations
          </span>
        </div>

        {/* Header Title */}
        <section className="relative h-[218px] overflow-hidden rounded-[14px] shadow-[0_8px_22px_rgba(55,39,14,0.16)]">
          <img
            src={homePic}
            alt="Egyptian pyramids at sunset"
            className="absolute inset-0 h-full w-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-[#34220f]/45" />
          <div className="relative flex h-full flex-col justify-center px-6 text-[#fff4da] sm:px-10">
            <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-[#f3d898]">
              <Compass className="h-3.5 w-3.5" /> Step 1 of 4
            </div>
            <h1 className="mt-2 max-w-[560px] font-display text-[28px] font-bold leading-[1.05] sm:text-[36px]">
              Tell us about your Egypt trip
            </h1>
            <p className="mt-2 max-w-[500px] text-[11px] leading-5 text-white/85 sm:text-[13px]">
              Choose the destinations and places you want to include in your
              journey.
            </p>
          </div>
        </section>

        <section className="mt-10 border-t border-[#e5ddcd] pt-7">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="font-display text-[22px] font-bold text-[#4f3d1d]">
                Where in Egypt are you traveling?
              </h2>
              <p className="mt-1 max-w-2xl text-[12px] leading-5 text-[#7b715f]">
                Select one or more destination cities. Attractions and historic
                sites will strictly match your selected cities.
              </p>
            </div>
            <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#aa7a13]">
              Choose destinations
            </span>
          </div>

          <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-5">
            {CITY_OPTIONS.map((city) => {
              const active = selectedCities.includes(city.name);
              const landmarkCount =
                STRICT_CITY_LANDMARKS[city.name]?.length || 0;
              return (
                <button
                  key={city.name}
                  type="button"
                  onClick={() => toggleCity(city.name)}
                  className={`group flex min-h-[58px] items-center justify-center gap-2 rounded-[7px] border px-3 py-3 text-[12px] font-semibold transition-all duration-200 ${
                    active
                      ? "border-[#a97808] bg-[#a97808] text-white shadow-[0_5px_12px_rgba(108,76,4,0.18)]"
                      : "border-[#d7c8ad] bg-white text-[#594c37] hover:border-[#a97808]"
                  }`}
                >
                  <MapPin
                    className={`h-4 w-4 ${active ? "text-white" : "text-[#a97808]"}`}
                  />
                  <span>{city.name}</span>
                  <span
                    className={`rounded-full px-2 py-0.5 text-[9px] font-bold ${
                      active
                        ? "bg-white/20 text-white"
                        : "bg-[#f2eee5] text-[#887b67]"
                    }`}
                  >
                    {landmarkCount} sites
                  </span>
                </button>
              );
            })}
          </div>
        </section>

        {/* Search & Landmark Count */}
        <div className="mt-12 flex flex-col gap-4 border-t border-[#e5ddcd] pt-7 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-display text-[22px] font-bold text-[#4f3d1d]">
              Attractions in {selectedCities.join(" & ")}
            </h2>
            <p className="text-[12px] text-[#7b715f]">
              Showing {visibleLandmarks.length} landmark
              {visibleLandmarks.length !== 1 ? "s" : ""} strictly in selected
              cities
            </p>
          </div>

          <div className="relative w-full max-w-xs">
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/40" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search Pyramids, Temples, Museums..."
              className="w-full rounded-[6px] border border-[#d7c8ad] bg-white py-3 pl-10 pr-4 text-[12px] text-[#403522] outline-none transition-colors focus:border-[#a97808]"
            />
          </div>
        </div>

        {/* Strict Geographic Landmark Grid */}
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {visibleLandmarks.map((landmark) => {
            const isSelected = selectedLandmarks.includes(landmark.id);
            return (
              <div
                key={landmark.id}
                onClick={() => toggleLandmark(landmark.id)}
                className={`group cursor-pointer overflow-hidden rounded-[8px] border bg-white transition-all duration-200 hover:shadow-card ${
                  isSelected
                    ? "border-[#a97808] shadow-md"
                    : "border-[#d7c8ad] hover:border-[#a97808]"
                }`}
              >
                {/* Photo with City and Category Badge */}
                <div className="relative h-[156px] w-full overflow-hidden bg-[#eee8dc]">
                  <img
                    src={landmark.image}
                    alt={landmark.name}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#2e210f]/70 via-transparent to-transparent" />

                  {/* City pill */}
                  <span className="absolute left-3 top-3 rounded-[4px] bg-[#2d2417]/80 px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider text-white backdrop-blur-sm">
                    📍 {landmark.city}
                  </span>

                  {/* Selection Checkmark Button */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleLandmark(landmark.id);
                    }}
                    className={`absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full transition-colors ${
                      isSelected
                        ? "bg-[#a97808] text-white shadow-md"
                        : "bg-white/90 text-[#6d624f] hover:text-[#a97808]"
                    }`}
                  >
                    <Check
                      className={`h-4 w-4 ${isSelected ? "stroke-[3]" : ""}`}
                    />
                  </button>

                  <span className="absolute bottom-3 left-3 rounded-md bg-[#a97808]/90 px-2 py-0.5 text-[9px] font-bold text-white">
                    {landmark.category}
                  </span>
                </div>

                {/* Content Details */}
                <div className="p-4">
                  <h3 className="font-display text-[15px] font-bold text-[#44351d] line-clamp-1">
                    {landmark.name}
                  </h3>
                  <p className="mt-1.5 text-[11px] leading-4 text-[#766b5b] line-clamp-2">
                    {landmark.description}
                  </p>

                  <div className="mt-4 flex items-center justify-between border-t border-[#e5ddcd] pt-3 text-[11px] text-[#766b5b]">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5 text-[#a97808]" />
                      {landmark.duration}
                    </span>
                    <span className="font-semibold text-[#8a6208]">
                      {landmark.priceEgp > 0
                        ? `${landmark.priceEgp} EGP`
                        : "Free Entry"}
                    </span>
                  </div>

                  {landmark.tips && (
                    <p className="mt-2.5 rounded-[5px] bg-[#f3efe7] px-2.5 py-1.5 text-[10px] text-[#675b48] italic">
                      💡 {landmark.tips}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Actions Bar */}
        <div className="mt-12 flex items-center justify-between border-t border-[#e5ddcd] pt-6">
          <BackButton fallbackPath="/" label="Back" />

          <button
            type="button"
            onClick={handleContinue}
            disabled={selectedCities.length === 0}
            className="flex items-center gap-2 rounded-[5px] bg-[#bd8910] px-9 py-3 text-[12px] font-semibold text-white shadow-md transition-all duration-200 hover:bg-[#a97808] hover:shadow-lg disabled:opacity-40"
          >
            <span>Continue to Dates & Duration</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </main>
    </div>
  );
}
