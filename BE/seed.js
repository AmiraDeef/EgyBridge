/**
 * seed.js — populates every collection with realistic, self-consistent
 * mock data so the frontend can be built/tested against a real API without
 * waiting on real user signups or admin content entry.
 *
 * This is destructive by design: it clears the collections it seeds before
 * inserting fresh data, so it's always safe to re-run for a clean slate.
 *
 * Run it with:
 *   npm run seed
 * or directly:
 *   node seed.js
 *
 * Requires the same .env as the server (MONGO_URI at minimum).
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

// Fixed demo password for every seeded account — printed at the end so
// there's no guessing what to log in with.
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
  console.log(`Created ${3} users.`);

  // ---------------------------------------------------------------------
  // Trips (sellable tour packages — matches the Home page destination cards)
  // ---------------------------------------------------------------------
  const trips = await Trip.create([
    {
      title: "Cairo & Giza: Pyramids, History & Museums",
      location: "Cairo, Egypt",
      duration: "3 Days",
      price: 250,
      description:
        "Stand before the Great Pyramid, ride into the desert at sunset, and walk through the treasures of the Egyptian Museum on a compact introduction to Cairo.",
      image:
        "https://images.unsplash.com/photo-1524686975162-f6fb4d39759c?auto=format&fit=crop&w=1200&q=80",
      featured: true,
    },
    {
      title: "Luxor: Ancient Temples & Valley of the Kings",
      location: "Luxor, Egypt",
      duration: "4 Days",
      price: 380,
      description:
        "Explore the Karnak and Luxor temple complexes, cross the Nile to the Valley of the Kings, and see where Tutankhamun's tomb was discovered.",
      image:
        "https://images.unsplash.com/photo-1678889413421-14be34e3b921?auto=format&fit=crop&w=1200&q=80",
      featured: true,
    },
    {
      title: "Aswan: Nubian Culture & Nile Views",
      location: "Aswan, Egypt",
      duration: "3 Days",
      price: 300,
      description:
        "Sail the Nile by felucca, visit a Nubian village, and take in the High Dam and Philae Temple in Egypt's most laid-back southern city.",
      image:
        "https://images.unsplash.com/photo-1633033254409-bd538e785f51?auto=format&fit=crop&w=1200&q=80",
      featured: false,
    },
    {
      title: "Alexandria: Mediterranean Coast & Historic Libraries",
      location: "Alexandria, Egypt",
      duration: "2 Days",
      price: 180,
      description:
        "Walk the Corniche, visit the modern Bibliotheca Alexandrina, and explore the Qaitbay Citadel on the site of the ancient lighthouse.",
      image:
        "https://images.unsplash.com/photo-1682090471391-413a38705abe?auto=format&fit=crop&w=1200&q=80",
      featured: false,
    },
  ]);
  const [cairoTrip, luxorTrip, aswanTrip, alexTrip] = trips;
  console.log(`Created ${trips.length} trips.`);

  // ---------------------------------------------------------------------
  // Places (context data — IA Section 4)
  // ---------------------------------------------------------------------
  const places = await Place.create([
    {
      name: "Pyramids of Giza",
      category: "attraction",
      description:
        "The last surviving wonder of the ancient world, on the edge of the Cairo desert.",
      location: { lat: 29.9792, lng: 31.1342, address: "Al Haram, Giza Governorate" },
      images: [
        "https://images.unsplash.com/photo-1524686975162-f6fb4d39759c?auto=format&fit=crop&w=800&q=80",
      ],
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
        budgetTips: ["Student ID gets ~50% off", "Interior tickets are limited per day — buy early"],
      },
      practicalInfo: {
        openingHours: "8:00 AM – 5:00 PM daily (shorter hours in Ramadan)",
        bestTimeToVisit: "Just after opening, before the heat and tour buses arrive",
        estimatedVisitDuration: "2–3 hours",
      },
      isFeatured: true,
    },
    {
      name: "Khan El Khalili Bazaar",
      category: "attraction",
      description: "A centuries-old market in Islamic Cairo, packed with spices, lanterns, and gold.",
      location: { lat: 30.0478, lng: 31.2622, address: "El-Gamaleya, Cairo" },
      images: [],
      culturalTips: {
        dos: ["Haggling is expected and part of the experience", "Try a mint tea at El Fishawy, the oldest café in the market"],
        donts: ["Don't accept the very first price offered", "Don't wander into unlit alleys alone late at night"],
      },
      transportOptions: [{ type: "metro", estimatedCost: 10, notes: "Nearest stop: Ataba, then a 10-minute walk" }],
      priceContext: { range: "Free to enter — costs are per item you buy", budgetTips: ["Prices drop noticeably if you're willing to walk away"] },
      practicalInfo: {
        openingHours: "10:00 AM – 11:00 PM (quieter Fri mornings)",
        bestTimeToVisit: "Early evening, once the heat breaks",
        estimatedVisitDuration: "2–4 hours",
      },
      isFeatured: true,
    },
    {
      name: "Karnak Temple Complex",
      category: "attraction",
      description: "The largest ancient religious site ever built, expanded by pharaohs over 2,000 years.",
      location: { lat: 25.7188, lng: 32.6573, address: "Karnak, Luxor" },
      images: [
        "https://images.unsplash.com/photo-1678889413421-14be34e3b921?auto=format&fit=crop&w=800&q=80",
      ],
      culturalTips: { dos: ["Hire a licensed guide at the entrance for context"], donts: ["Don't use flash photography near painted reliefs"] },
      transportOptions: [{ type: "taxi", estimatedCost: 80, notes: "Short ride from central Luxor" }],
      priceContext: { range: "450 EGP entry", budgetTips: ["Combined ticket with Luxor Temple saves money if visiting both"] },
      practicalInfo: {
        openingHours: "6:00 AM – 5:30 PM (extended in summer)",
        bestTimeToVisit: "Sunrise, or the evening Sound & Light show",
        estimatedVisitDuration: "2–3 hours",
      },
      isFeatured: true,
    },
    {
      name: "Abu Simbel Temples",
      category: "attraction",
      description: "Ramses II's colossal rock-cut temples, relocated in the 1960s to escape the Aswan High Dam floodwaters.",
      location: { lat: 22.3372, lng: 31.6258, address: "Abu Simbel, Aswan Governorate" },
      images: [],
      culturalTips: { dos: ["Book a convoy or flight from Aswan in advance"], donts: ["Don't skip sun protection — there's little shade"] },
      transportOptions: [
        { type: "flight", estimatedCost: 2500, notes: "20-min flight from Aswan, round trip" },
        { type: "bus", estimatedCost: 300, notes: "3-hour drive each way, usually in an early morning convoy" },
      ],
      priceContext: { range: "600 EGP entry", budgetTips: ["The bus convoy is far cheaper than flying if you have the time"] },
      practicalInfo: {
        openingHours: "5:00 AM – 6:00 PM",
        bestTimeToVisit: "Feb 22 or Oct 22 for the twice-yearly 'Sun Festival' alignment",
        estimatedVisitDuration: "1–2 hours on site",
      },
      isFeatured: false,
    },
    {
      name: "Aswan Nile Corniche",
      category: "attraction",
      description: "A palm-lined riverside promenade with views of Elephantine Island and sailing feluccas.",
      location: { lat: 24.0889, lng: 32.8998, address: "Corniche El Nil, Aswan" },
      images: [
        "https://images.unsplash.com/photo-1633033254409-bd538e785f51?auto=format&fit=crop&w=800&q=80",
      ],
      culturalTips: { dos: ["Take a sunset felucca ride — agree on the price and duration first"], donts: [] },
      transportOptions: [{ type: "walking", estimatedCost: 0, notes: "Central and walkable from most hotels" }],
      priceContext: { range: "Free to walk; felucca rides ~150–250 EGP/hour", budgetTips: ["Share a felucca with other travelers to split the cost"] },
      practicalInfo: {
        openingHours: "Open 24 hours",
        bestTimeToVisit: "Sunset",
        estimatedVisitDuration: "1–2 hours",
      },
      isFeatured: false,
    },
    {
      name: "Qaitbay Citadel",
      category: "attraction",
      description: "A 15th-century fort on the site of the ancient Lighthouse of Alexandria, overlooking the Mediterranean.",
      location: { lat: 31.2139, lng: 29.8853, address: "Ras El Tin, Alexandria" },
      images: [
        "https://images.unsplash.com/photo-1682090471391-413a38705abe?auto=format&fit=crop&w=800&q=80",
      ],
      culturalTips: { dos: ["Combine with a walk along the Corniche"], donts: ["Don't skip the naval museum inside — it's included in the ticket"] },
      transportOptions: [{ type: "taxi", estimatedCost: 60, notes: "Short ride from downtown Alexandria" }],
      priceContext: { range: "120 EGP entry", budgetTips: [] },
      practicalInfo: {
        openingHours: "9:00 AM – 4:00 PM",
        bestTimeToVisit: "Late afternoon for the light over the water",
        estimatedVisitDuration: "1 hour",
      },
      isFeatured: false,
    },
  ]);
  console.log(`Created ${places.length} places.`);

  // ---------------------------------------------------------------------
  // External Services (IA Section 5 — official/verified links)
  // ---------------------------------------------------------------------
  const services = await ExternalService.create([
    {
      name: "Egypt e-Visa Portal",
      category: "visa",
      officialLink: "https://visa2egypt.gov.eg",
      description: "The only official government portal for Egyptian tourist e-visas.",
      isVerified: true,
    },
    {
      name: "Uber Egypt",
      category: "transport",
      officialLink: "https://www.uber.com/eg/en/",
      description: "Metered ride-hailing, widely available in Cairo, Alexandria, and Giza.",
      isVerified: true,
    },
    {
      name: "Booking.com — Egypt Hotels",
      category: "accommodation",
      officialLink: "https://www.booking.com/country/eg.html",
      description: "Verified hotel and Nile cruise listings with free cancellation options.",
      isVerified: true,
      relatedPlace: null,
    },
    {
      name: "GoBus",
      category: "transport",
      officialLink: "https://go-bus.com/en",
      description: "Egypt's main intercity coach operator, connecting Cairo, Luxor, Aswan, and the coast.",
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
      trip: luxorTrip._id,
      seats: 1,
      totalPrice: luxorTrip.price * 1,
      status: "pending",
    },
  ]);
  console.log(`Created ${bookings.length} bookings.`);

  // ---------------------------------------------------------------------
  // Reviews
  // ---------------------------------------------------------------------
  const reviews = await Review.create([
    {
      user: sara._id,
      trip: cairoTrip._id,
      rating: 5,
      comment: "Our guide made the pyramids come alive — worth every pound. Loved the sunset camel ride.",
    },
    {
      user: omar._id,
      trip: luxorTrip._id,
      rating: 4,
      comment: "Karnak at sunrise was unforgettable. Hotel pickup ran late both mornings, otherwise flawless.",
    },
    {
      user: sara._id,
      trip: aswanTrip._id,
      rating: 5,
      comment: "The felucca sunset sail was the highlight of our whole trip to Egypt.",
    },
  ]);
  console.log(`Created ${reviews.length} reviews.`);

  // ---------------------------------------------------------------------
  // Trip Plan (personal itinerary — Flow A/B)
  // ---------------------------------------------------------------------
  const tripPlan = await TripPlan.create({
    user: sara._id,
    title: "Sara's 5-Day Egypt Trip",
    budget: 1200,
    duration: 5,
    interests: ["history", "culture", "food"],
    destinations: ["Cairo", "Luxor"],
    status: "generated",
    itinerary: [
      { day: 1, activities: [{ title: "Arrive in Cairo, check in, rest", place: null, notes: "Late flight — keep it light" }] },
      { day: 2, activities: [{ title: "Explore Pyramids of Giza", place: places[0]._id, time: "08:00" }] },
      { day: 3, activities: [{ title: "Wander Khan El Khalili Bazaar", place: places[1]._id, time: "17:00" }] },
      { day: 4, activities: [{ title: "Fly to Luxor, visit Karnak Temple", place: places[2]._id, time: "15:00" }] },
      { day: 5, activities: [{ title: "Valley of the Kings, fly home", place: null }] },
    ],
  });
  console.log("Created 1 trip plan.");

  // ---------------------------------------------------------------------
  // Emergency Incident (one resolved example, for the admin dashboard view)
  // ---------------------------------------------------------------------
  await EmergencyIncident.create({
    user: omar._id,
    location: { lat: 30.0444, lng: 31.2357, address: "Downtown Cairo" },
    landmark: "Near Tahrir Square",
    description: "Lost luggage after a taxi mix-up — resolved by hotel concierge.",
    status: "resolved",
    verifiedBy: admin._id,
    resolvedAt: new Date(),
  });
  console.log("Created 1 emergency incident (resolved, sample data).");

  // ---------------------------------------------------------------------
  // Summary
  // ---------------------------------------------------------------------
  console.log("\n================ SEED COMPLETE ================");
  console.log("Log in with any of these (password is the same for all):\n");
  console.log(`  Admin:  admin@egirise.com   / ${DEMO_PASSWORD}`);
  console.log(`  User 1: sara@example.com    / ${DEMO_PASSWORD}`);
  console.log(`  User 2: omar@example.com    / ${DEMO_PASSWORD}`);
  console.log("\nSeeded: 3 users, 4 trips, 6 places, 4 services, 2 bookings,");
  console.log("3 reviews, 1 trip plan, 1 emergency incident.");
  console.log("=================================================\n");

  await mongoose.disconnect();
  process.exit(0);
}

seed().catch((err) => {
  console.error("Seeding failed:", err);
  process.exit(1);
});
