/**
 * seed.js — populates every collection with realistic, self-consistent
 * mock data including all Egyptian Governorates & Destinations.
 *
 * Run it with:
 *   npm run seed
 * or directly:
 *   node seed.js
 */

require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const User = require("./models/User");
const Trip = require("./models/Trip");
const Booking = require("./models/Booking");
const Review = require("./models/Review");
const Place = require("./models/Place");
const ExternalService = require("./models/ExternalService");
const TripPlan = require("./models/TripPlan");
const EmergencyIncident = require("./models/EmergencyIncident");

const DEMO_PASSWORD = "Password123";

async function seed() {
  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI is not set — copy your .env before seeding.");
  }

  await mongoose.connect(process.env.MONGO_URI);
  console.log("Connected to MongoDB for seeding.");

  console.log("Clearing existing data...");
  await Promise.all([
    User.deleteMany({}),
    Trip.deleteMany({}),
    Booking.deleteMany({}),
    Review.deleteMany({}),
    Place.deleteMany({}),
    ExternalService.deleteMany({}),
    TripPlan.deleteMany({}),
    EmergencyIncident.deleteMany({}),
  ]);

  // ---------------------------------------------------------------------
  // Users
  // ---------------------------------------------------------------------
  const hashedPassword = await bcrypt.hash(DEMO_PASSWORD, 10);

  const [admin, sara, omar] = await User.create([
    {
      fullName: "EGI RISE Admin Account",
      email: "admin@egirise.com",
      password: hashedPassword,
      phone: "01000000000",
      country: "Egypt",
      role: "admin",
    },
    {
      fullName: "Sara Ahmed Mostafa",
      email: "sara@example.com",
      password: hashedPassword,
      phone: "01011111111",
      country: "Egypt",
      role: "user",
    },
    {
      fullName: "Omar Khaled Hassan",
      email: "omar@example.com",
      password: hashedPassword,
      phone: "01022222222",
      country: "Germany",
      role: "user",
    },
  ]);
  console.log(`Created 3 users.`);

  // ---------------------------------------------------------------------
  // Trips (Sellable Packages / Governorates Overview with Dynamic Itinerary)
  // ---------------------------------------------------------------------
  const trips = await Trip.create([
    {
      title: "Cairo: Pyramids, History & Museums",
      location: "Cairo, Egypt",
      duration: "3 Days",
      price: 250,
      description: "Explore the bustling capital, Islamic Cairo bazaars, and world-class museums.",
      image: "https://images.unsplash.com/photo-1572252009286-268acec5ca0a?auto=format&fit=crop&w=800&q=80",
      featured: true,
      itinerary: [
        {
          dayNumber: 1,
          title: "Islamic Cairo & Khan El Khalili",
          description: "Explore the ancient streets, markets, and historic mosques of Old Cairo.",
          activities: [
            { time: "10:00 AM", title: "Khan El Khalili Bazaar", description: "Walk around centuries-old brassware and lantern shops." },
            { time: "01:00 PM", title: "Al-Azhar Mosque & Park", description: "Enjoy lunch with panoramic views of Islamic Cairo." }
          ]
        },
        {
          dayNumber: 2,
          title: "Egyptian Museum & Tahrir Square",
          description: "Discover thousands of ancient Egyptian artifacts and royal mummies.",
          activities: [
            { time: "09:30 AM", title: "Egyptian Museum", description: "Guided tour through King Tutankhamun treasures." },
            { time: "04:00 PM", title: "Nile Felucca Ride", description: "Relaxing sunset sail on the Nile river." }
          ]
        },
        {
          dayNumber: 3,
          title: "Coptic Cairo & Citadel",
          description: "Visit the Saladin Citadel, Mosque of Muhammad Ali, and the Hanging Church.",
          activities: [
            { time: "10:00 AM", title: "Saladin Citadel", description: "Explore the fortress and Muhammad Ali Mosque." },
            { time: "02:00 PM", title: "Hanging Church", description: "Historical tour in Old Coptic Cairo." }
          ]
        }
      ]
    },
    {
      title: "Giza: Great Pyramids, Sphinx & Grand Museum",
      location: "Giza, Egypt",
      duration: "1 Day",
      price: 150,
      description: "Stand before the Great Pyramid, ride into the desert at sunset, and visit the GEM.",
      image: "https://images.unsplash.com/photo-1503177119275-0aa32b3a9368?auto=format&fit=crop&w=800&q=80",
      featured: true,
      itinerary: [
        {
          dayNumber: 1,
          title: "Giza Plateau & Grand Egyptian Museum",
          description: "Full day tour covering the Pyramids, Great Sphinx, and GEM.",
          activities: [
            { time: "08:00 AM", title: "Pyramids of Giza & Sphinx", description: "Guided walk and camel ride around the Great Pyramids." },
            { time: "01:30 PM", title: "Grand Egyptian Museum (GEM)", description: "Visit the grand hall and modern exhibition galleries." }
          ]
        }
      ]
    },
    {
      title: "Luxor: Ancient Temples & Valley of the Kings",
      location: "Luxor, Egypt",
      duration: "4 Days",
      price: 380,
      description: "Explore Karnak and Luxor temples, cross the Nile to the ancient royal tombs.",
      image: "https://res.cloudinary.com/db0ljwgsi/image/upload/v1788817336/luxor-the-ancient-city-egypt-tours-portal_cu8bzm.jpg",
      featured: true,
      itinerary: [
        {
          dayNumber: 1,
          title: "East Bank Exploration",
          description: "Visit Karnak and Luxor Temples on the East Bank.",
          activities: [
            { time: "09:00 AM", title: "Karnak Temple Complex", description: "Explore the monumental Hypostyle Hall." },
            { time: "05:00 PM", title: "Luxor Temple by Night", description: "Experience temple lighting after dark." }
          ]
        },
        {
          dayNumber: 2,
          title: "West Bank Tombs & Hot Air Balloon",
          description: "Sunrise hot air balloon flight and Valley of the Kings.",
          activities: [
            { time: "05:00 AM", title: "Hot Air Balloon Flight", description: "Soar over West Bank temples at sunrise." },
            { time: "09:00 AM", title: "Valley of the Kings", description: "Explore famous Pharaohs underground tombs." }
          ]
        }
      ]
    },
    {
      title: "Aswan: Nubian Culture, Philae & Nile Views",
      location: "Aswan, Egypt",
      duration: "3 Days",
      price: 300,
      description: "Sail the Nile by felucca, visit colorful Nubian villages, and explore Philae Temple.",
      image: "https://res.cloudinary.com/db0ljwgsi/image/upload/v1788820902/AswanColorfol_uik3dk.jpg",
      featured: true,
      itinerary: [
        {
          dayNumber: 1,
          title: "Philae Temple & High Dam",
          description: "Island temple dedicated to Isis and engineering history.",
          activities: [
            { time: "09:00 AM", title: "Philae Temple", description: "Take a motorboat to Agilkia Island." },
            { time: "02:00 PM", title: "Aswan High Dam", description: "View Lake Nasser and the Aswan High Dam." }
          ]
        },
        {
          dayNumber: 2,
          title: "Nubian Village & Nile Felucca",
          description: "Immerse in vibrant Nubian traditions along the Nile.",
          activities: [
            { time: "03:00 PM", title: "Gharb Soheil Nubian Village", description: "Boat trip, tea, and colorful Nubian architecture." }
          ]
        }
      ]
    },
    {
      title: "Alexandria: Mediterranean Coast & Historic Citadel",
      location: "Alexandria, Egypt",
      duration: "2 Days",
      price: 180,
      description: "Walk the Mediterranean Corniche, visit the modern library and Qaitbay Citadel.",
      image: "https://res.cloudinary.com/db0ljwgsi/image/upload/v1788817339/alexandria-egypt-tours-portal_ntvxgc.jpg",
      featured: false,
      itinerary: [
        {
          dayNumber: 1,
          title: "Citadel & Seaside Walk",
          description: "Explore Mediterranean history at Citadel of Qaitbay.",
          activities: [
            { time: "10:00 AM", title: "Citadel of Qaitbay", description: "Tour the historic 15th-century fortress." },
            { time: "01:00 PM", title: "Seafood Lunch on Corniche", description: "Fresh Mediterranean seafood near the harbor." }
          ]
        },
        {
          dayNumber: 2,
          title: "Bibliotheca Alexandrina & Catacombs",
          description: "Culture and Greco-Roman wonders.",
          activities: [
            { time: "10:00 AM", title: "Bibliotheca Alexandrina", description: "Tour the modern library and underground museums." },
            { time: "02:00 PM", title: "Catacombs of Kom El Shoqafa", description: "Descend into ancient Roman catacombs." }
          ]
        }
      ]
    },
    {
      title: "Fayoum: Wadi El Hitan, Waterfalls & Magic Lake",
      location: "Fayoum, Egypt",
      duration: "2 Days",
      price: 120,
      description: "Desert safari, pottery villages, ancient whale fossils, and tranquil desert lakes.",
      image: "https://res.cloudinary.com/db0ljwgsi/image/upload/v1788817736/fayoum-beit_pitfwk.jpg",
      featured: false,
      itinerary: [
        {
          dayNumber: 1,
          title: "Tunis Village & Magic Lake Safari",
          description: "Pottery making and desert dune sandboarding.",
          activities: [
            { time: "11:00 AM", title: "Tunis Pottery Village", description: "Explore artisan workshops in Tunis village." },
            { time: "03:00 PM", title: "Magic Lake 4x4 Safari", description: "Dune bashing and sunset views over Magic Lake." }
          ]
        }
      ]
    },
    {
      title: "South Sinai: Sharm El Sheikh & Mountain Trails",
      location: "South Sinai, Egypt",
      duration: "5 Days",
      price: 450,
      description: "Red Sea coral reefs, luxury resorts, and spiritual hikes up Mount Sinai.",
      image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80",
      featured: false,
      itinerary: [
        {
          dayNumber: 1,
          title: "Ras Mohammed Marine Reserve",
          description: "Snorkeling in world-famous coral reefs.",
          activities: [
            { time: "09:00 AM", title: "Ras Mohammed Snorkeling", description: "Boat trip to marine reserve spots." }
          ]
        }
      ]
    },
    {
      title: "Dahab: Blue Hole & Laid-back Beach Life",
      location: "Dahab, South Sinai, Egypt",
      duration: "4 Days",
      price: 280,
      description: "World-class diving at the Blue Hole, windsurfing, and chill Bohemian vibes.",
      image: "https://res.cloudinary.com/db0ljwgsi/image/upload/v1788818157/Dahab_ygkem5.jpg",
      featured: true,
      itinerary: [
        {
          dayNumber: 1,
          title: "Blue Hole & Abu Galum",
          description: "World-renowned diving spot and boat/camel excursion.",
          activities: [
            { time: "09:00 AM", title: "Blue Hole Snorkeling & Diving", description: "Discover underwater submarine sinkhole." }
          ]
        }
      ]
    },
    {
      title: "Port Said: Suez Canal & Historic Architecture",
      location: "Port Said, Egypt",
      duration: "1 Day",
      price: 100,
      description: "Watch massive ships pass through the canal, ride the Port Fouad ferry, and taste fresh seafood.",
      image: "https://res.cloudinary.com/db0ljwgsi/image/upload/v1788820891/Portsaid_yvoktc.jpg",
      featured: false,
      itinerary: [
        {
          dayNumber: 1,
          title: "Suez Canal & Port Fouad",
          description: "Maritime heritage and salt mountains.",
          activities: [
            { time: "10:00 AM", title: "Port Fouad Ferry", description: "Cross the Suez Canal by free ferry." }
          ]
        }
      ]
    },
    {
      title: "Siwa Oasis: Salt Lakes & Desert Magic",
      location: "Siwa, Matrouh, Egypt",
      duration: "3 Days",
      price: 320,
      description: "Swim in crystal-clear salt lakes, explore the Shali Fortress, and experience desert hot springs.",
      image: "https://res.cloudinary.com/db0ljwgsi/image/upload/v1788854160/siwaSalt_ilupul.jpg",
      featured: true,
      itinerary: [
        {
          dayNumber: 1,
          title: "Salt Lakes & Shali Fortress",
          description: "Float in hypersaline pools and explore ancient mud ruins.",
          activities: [
            { time: "11:00 AM", title: "Siwa Salt Lakes", description: "Float effortlessly in turquoise natural pools." },
            { time: "04:30 PM", title: "Shali Fortress Sunset", description: "Climb the ancient mud-brick ruins for sunset." }
          ]
        }
      ]
    },
  ]);
  const [cairoTrip, gizaTrip, luxorTrip, aswanTrip, alexTrip, fayoumTrip, sinaiTrip, dahabTrip, portsaidTrip, siwaTrip] = trips;
  console.log(`Created ${trips.length} trips.`);

  // ---------------------------------------------------------------------
  // Places (Governorates & Key Attractions)
  // ---------------------------------------------------------------------
  const places = await Place.create([
    {
      name: "Pyramids of Giza",
      category: "attraction",
      description: "The last surviving wonder of the ancient world, on the edge of the Giza desert.",
      location: { lat: 29.9792, lng: 31.1342, address: "Al Haram, Giza Governorate" },
      images: ["https://images.unsplash.com/photo-1503177119275-0aa32b3a9368?auto=format&fit=crop&w=800&q=80"],
      culturalTips: {
        dos: ["Dress modestly — shoulders and knees covered", "Agree on camel/horse ride prices before mounting"],
        donts: ["Don't climb on the pyramid stones", "Don't pay unofficial 'guides' who approach you at the gate"],
      },
      transportOptions: [
        { type: "uber", estimatedCost: 150, notes: "From downtown Cairo, ~30 min without traffic" },
        { type: "taxi", estimatedCost: 200, notes: "Negotiate the fare before getting in" },
      ],
      priceContext: {
        range: "300 EGP entry (site) + 500 EGP (Great Pyramid interior, optional)",
        budgetTips: ["Student ID gets ~50% off", "Buy interior tickets early"],
      },
      practicalInfo: {
        openingHours: "8:00 AM – 5:00 PM daily",
        bestTimeToVisit: "Just after opening, before heat and buses arrive",
        estimatedVisitDuration: "2–3 hours",
      },
      isFeatured: true,
    },
    {
      name: "Khan El Khalili Bazaar",
      category: "attraction",
      description: "A centuries-old market in Islamic Cairo, packed with spices, lanterns, and brassware.",
      location: { lat: 30.0478, lng: 31.2622, address: "El-Gamaleya, Cairo Governorate" },
      images: ["https://images.unsplash.com/photo-1572252009286-268acec5ca0a?auto=format&fit=crop&w=800&q=80"],
      culturalTips: {
        dos: ["Haggling is expected", "Enjoy tea at El Fishawy Café"],
        donts: ["Don't accept the first price offered"],
      },
      transportOptions: [{ type: "metro", estimatedCost: 10, notes: "Nearest stop: Ataba" }],
      priceContext: { range: "Free entry", budgetTips: ["Walk around before purchasing"] },
      practicalInfo: {
        openingHours: "10:00 AM – 11:00 PM",
        bestTimeToVisit: "Early evening",
        estimatedVisitDuration: "2–4 hours",
      },
      isFeatured: true,
    },
    {
      name: "Karnak Temple Complex",
      category: "attraction",
      description: "The largest ancient religious complex ever built, expanded over 2,000 years in Luxor.",
      location: { lat: 25.7188, lng: 32.6573, address: "Karnak, Luxor Governorate" },
      images: ["https://res.cloudinary.com/db0ljwgsi/image/upload/v1788817336/luxor-the-ancient-city-egypt-tours-portal_cu8bzm.jpg"],
      culturalTips: { dos: ["Hire a licensed guide"], donts: ["Don't touch ancient wall reliefs"] },
      transportOptions: [{ type: "taxi", estimatedCost: 80, notes: "Short ride from central Luxor" }],
      priceContext: { range: "450 EGP entry", budgetTips: [] },
      practicalInfo: {
        openingHours: "6:00 AM – 5:30 PM",
        bestTimeToVisit: "Sunrise",
        estimatedVisitDuration: "2–3 hours",
      },
      isFeatured: true,
    },
    {
      name: "Aswan Nile Corniche & Elephantine Island",
      category: "attraction",
      description: "A serene riverside promenade with views of ancient ruins, feluccas, and Nubian villages.",
      location: { lat: 24.0889, lng: 32.8998, address: "Corniche El Nil, Aswan Governorate" },
      images: ["https://res.cloudinary.com/db0ljwgsi/image/upload/v1788820902/AswanColorfol_uik3dk.jpg"],
      culturalTips: { dos: ["Take a sunset felucca ride"], donts: [] },
      transportOptions: [{ type: "walking", estimatedCost: 0, notes: "Easily walkable" }],
      priceContext: { range: "Free to walk; feluccas ~200 EGP/hr", budgetTips: ["Share a boat to split costs"] },
      practicalInfo: {
        openingHours: "Open 24 hours",
        bestTimeToVisit: "Sunset",
        estimatedVisitDuration: "1–2 hours",
      },
      isFeatured: true,
    },
    {
      name: "Citadel of Qaitbay & Alexandria Corniche",
      category: "attraction",
      description: "15th-century seafront fortress standing where the ancient Lighthouse of Alexandria once stood.",
      location: { lat: 31.2139, lng: 29.8853, address: "Ras El Tin, Alexandria Governorate" },
      images: ["https://res.cloudinary.com/db0ljwgsi/image/upload/v1788817339/alexandria-egypt-tours-portal_ntvxgc.jpg"],
      culturalTips: { dos: ["Try fresh Mediterranean seafood nearby"], donts: [] },
      transportOptions: [{ type: "taxi", estimatedCost: 60, notes: "Ride along the seafront" }],
      priceContext: { range: "120 EGP entry", budgetTips: [] },
      practicalInfo: {
        openingHours: "9:00 AM – 4:00 PM",
        bestTimeToVisit: "Late afternoon",
        estimatedVisitDuration: "1–2 hours",
      },
      isFeatured: true,
    },
    {
      name: "Wadi El Hitan & Magic Lake",
      category: "attraction",
      description: "UNESCO World Heritage site with ancient whale fossils in the sand dunes of Fayoum.",
      location: { lat: 29.2708, lng: 30.0438, address: "Wadi El Rayan Protected Area, Fayoum Governorate" },
      images: ["https://res.cloudinary.com/db0ljwgsi/image/upload/v1788817736/fayoum-beit_pitfwk.jpg"],
      culturalTips: { dos: ["Bring plenty of water and sunscreen"], donts: ["Don't step off designated paths"] },
      transportOptions: [{ type: "car", estimatedCost: 1200, notes: "Requires a 4x4 safari vehicle" }],
      priceContext: { range: "150 EGP site entry", budgetTips: [] },
      practicalInfo: {
        openingHours: "7:00 AM – 5:00 PM",
        bestTimeToVisit: "Winter months",
        estimatedVisitDuration: "Full day",
      },
      isFeatured: true,
    },
    {
      name: "Blue Hole & Dahab Beachfront",
      category: "attraction",
      description: "World-famous submarine sinkhole off the coast of Dahab in South Sinai.",
      location: { lat: 28.5721, lng: 34.5374, address: "Dahab, South Sinai Governorate" },
      images: ["https://res.cloudinary.com/db0ljwgsi/image/upload/v1788818157/Dahab_ygkem5.jpg"],
      culturalTips: { dos: ["Rent proper snorkeling/diving gear"], donts: ["Don't touch or step on coral reefs"] },
      transportOptions: [{ type: "taxi", estimatedCost: 150, notes: "Pickup from central Dahab" }],
      priceContext: { range: "$10 protectorate entry fee", budgetTips: [] },
      practicalInfo: {
        openingHours: "8:00 AM – 5:00 PM",
        bestTimeToVisit: "Morning before winds pick up",
        estimatedVisitDuration: "3–5 hours",
      },
      isFeatured: true,
    },
    {
      name: "Suez Canal & Port Fouad Ferry",
      category: "attraction",
      description: "Historic waterfront promenade watching global shipping lanes and French colonial architecture.",
      location: { lat: 31.2653, lng: 32.3019, address: "Port Said Governorate" },
      images: ["https://res.cloudinary.com/db0ljwgsi/image/upload/v1788820891/Portsaid_yvoktc.jpg"],
      culturalTips: { dos: ["Take the free ferry to Port Fouad to see the iconic salt mountains"], donts: [] },
      transportOptions: [{ type: "ferry", estimatedCost: 0, notes: "Free public ferry ride" }],
      priceContext: { range: "Free", budgetTips: [] },
      practicalInfo: {
        openingHours: "Open 24 hours",
        bestTimeToVisit: "Afternoon",
        estimatedVisitDuration: "2 hours",
      },
      isFeatured: false,
    },
    {
      name: "Siwa Salt Lakes & Shali Fortress",
      category: "attraction",
      description: "Hypersaline natural pools where you float effortlessly, surrounded by ancient mud-brick ruins.",
      location: { lat: 29.2032, lng: 25.5195, address: "Siwa Oasis, Matrouh Governorate" },
      images: ["https://res.cloudinary.com/db0ljwgsi/image/upload/v1788854160/siwaSalt_ilupul.jpg"],
      culturalTips: { dos: ["Rinse off with fresh water immediately after floating"], donts: ["Don't splash salt water into your eyes"] },
      transportOptions: [{ type: "tuk-tuk", estimatedCost: 50, notes: "Common local transport in Siwa" }],
      priceContext: { range: "Free / Minimal entry fee", budgetTips: [] },
      practicalInfo: {
        openingHours: "Open 24 hours",
        bestTimeToVisit: "Midday for bright turquoise water photos",
        estimatedVisitDuration: "2–3 hours",
      },
      isFeatured: true,
    },
  ]);
  console.log(`Created ${places.length} places.`);

  // ---------------------------------------------------------------------
  // External Services
  // ---------------------------------------------------------------------
  const services = await ExternalService.create([
    {
      name: "Egypt e-Visa Portal",
      category: "visa",
      officialLink: "https://visa2egypt.gov.eg",
      description: "The official government portal for tourist e-visas.",
      isVerified: true,
    },
    {
      name: "Uber Egypt",
      category: "transport",
      officialLink: "https://www.uber.com/eg/en/",
      description: "Ride-hailing available in Cairo, Alexandria, Giza, and major hubs.",
      isVerified: true,
    },
    {
      name: "GoBus Egypt",
      category: "transport",
      officialLink: "https://go-bus.com/en",
      description: "Intercity coach transport connecting Cairo, Dahab, Alexandria, and Port Said.",
      isVerified: true,
    },
  ]);
  console.log(`Created ${services.length} external services.`);

  // ---------------------------------------------------------------------
  // Bookings
  // ---------------------------------------------------------------------
  const bookings = await Booking.create([
    {
      user: sara._id,
      trip: cairoTrip._id,
      seats: 2,
      totalPrice: cairoTrip.price * 2,
      status: "confirmed",
    },
    {
      user: omar._id,
      trip: dahabTrip._id,
      seats: 1,
      totalPrice: dahabTrip.price * 1,
      status: "pending",
    },
  ]);
  console.log(`Created ${bookings.length} bookings.`);

  // ---------------------------------------------------------------------
  // Reviews
  // ---------------------------------------------------------------------
  await Review.create([
    {
      user: sara._id,
      trip: cairoTrip._id,
      rating: 5,
      comment: "Unforgettable experience exploring Khan El Khalili and the pyramids!",
    },
    {
      user: omar._id,
      trip: dahabTrip._id,
      rating: 5,
      comment: "Dahab's Blue Hole and salt lakes in Siwa are absolute magic.",
    },
  ]);
  console.log("Created 2 reviews.");

  // ---------------------------------------------------------------------
  // Trip Plan
  // ---------------------------------------------------------------------
  await TripPlan.create({
    user: sara._id,
    title: "Sara's Egypt Oasis & Coast Tour",
    budget: 1500,
    duration: 6,
    interests: ["nature", "beach", "history"],
    destinations: ["Cairo", "Dahab", "Siwa"],
    status: "generated",
    itinerary: [
      { day: 1, activities: [{ title: "Arrive in Cairo & visit Khan El Khalili", place: places[1]._id, time: "17:00" }] },
      { day: 2, activities: [{ title: "Pyramids of Giza tour", place: places[0]._id, time: "09:00" }] },
      { day: 3, activities: [{ title: "Fly/Bus to Dahab & Relax by the Red Sea", place: places[6]._id }] },
      { day: 4, activities: [{ title: "Snorkeling at the Blue Hole", place: places[6]._id, time: "10:00" }] },
      { day: 5, activities: [{ title: "Travel to Siwa Oasis", place: places[8]._id }] },
      { day: 6, activities: [{ title: "Float in Siwa Salt Lakes", place: places[8]._id, time: "11:00" }] },
    ],
  });
  console.log("Created 1 trip plan.");

  // ---------------------------------------------------------------------
  // Emergency Incident
  // ---------------------------------------------------------------------
  await EmergencyIncident.create({
    user: omar._id,
    location: { lat: 30.0444, lng: 31.2357, address: "Downtown Cairo" },
    landmark: "Near Tahrir Square",
    description: "Lost luggage after taxi ride — safely recovered.",
    status: "resolved",
    verifiedBy: admin._id,
    resolvedAt: new Date(),
  });
  console.log("Created 1 emergency incident.");

  // Summary
  console.log("\n================ SEED COMPLETE ================");
  console.log("Log in with any of these (password: Password123):\n");
  console.log(`  Admin:  admin@egirise.com   / ${DEMO_PASSWORD}`);
  console.log(`  User 1: sara@example.com    / ${DEMO_PASSWORD}`);
  console.log(`  User 2: omar@example.com    / ${DEMO_PASSWORD}`);
  console.log(`\nSeeded: ${trips.length} Destinations/Trips with Itineraries & ${places.length} Places.`);
  console.log("=================================================\n");

  await mongoose.disconnect();
  process.exit(0);
}

seed().catch((err) => {
  console.error("Seeding failed:", err);
  process.exit(1);
});