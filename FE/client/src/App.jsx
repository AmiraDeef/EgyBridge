import React, { useState } from "react";
import {
  Routes,
  Route,
  Navigate,
  Link,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { CreditCard, Landmark } from "lucide-react";
import TripItineraryResult from "./pages/TripItineraryResult";
import AuthLayout from "./components/auth/AuthLayout";
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import Home from "./pages/Home";
import MyTrip from "./pages/MyTrip";
import TripDetails from "./pages/TripDetails";
import TourGuideChat from "./pages/TourGuideChat.jsx";
import SimPlans from "./pages/SimPlans";
import { PlanningProvider } from "./context/PlanningContext";
import PlanningStep1 from "./pages/PlanningStep1";
import PlanningStep2Budget from "./pages/PlanningStep2Budget";
import PlanningStep3Places from "./pages/PlanningStep3Places";
import PlanningStep4Preferences from "./pages/PlanningStep4Preferences";
import PlanningStep5Review from "./pages/PlanningStep5Review";
import Visa from "./pages/Visa.jsx";
import Services from "./pages/Services";
import Flights from "./pages/Flights";
import Hotels from "./pages/Hotels";
import Restaurants from "./pages/Restaurants";
import Translation from "./pages/Translation";
import Emergency from "./pages/Emergency";
import Explore from "./pages/Explore";
import PlaceDetails from "./pages/PlaceDetails";
import ComingSoon from "./pages/ComingSoon";
import Checkout from "./pages/Checkout";
import CarRental from "./pages/CarRental";
import SiteNavbar from "./components/layout/SiteNavbar";
import Footer from "./components/layout/Footer";
import FloatingCharacter from "./components/common/FloatingCharacter";
import { useAuth } from "./context/AuthContext";

/* --- Service Components --- */

function Currency() {
  const [amount, setAmount] = useState(100);
  return (
    <div className="min-h-screen bg-white font-body">
      <SiteNavbar />
      <main className="mx-auto max-w-xl px-6 py-10 text-center">
        <h1 className="text-3xl font-bold text-black">Currency Converter</h1>
        <div className="mt-8 rounded-2xl bg-[#EDE0C9] p-8">
          <label className="text-xs font-bold text-[#846B20]">
            Amount in USD ($)
          </label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
            className="mt-2 w-full rounded-xl bg-white p-3 text-center text-xl font-bold outline-none focus:ring-2 focus:ring-[#846B20]"
          />
          <div className="mt-4 text-3xl font-bold text-[#4F3B00]">
            {(amount * 48.5).toFixed(2)} EGP
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

function PaymentInfo() {
  return (
    <div className="min-h-screen bg-white font-body">
      <SiteNavbar />
      <main className="mx-auto max-w-4xl px-6 py-10">
        <h1 className="text-3xl font-bold text-black">
          Payments & Financial Info
        </h1>
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div className="rounded-2xl bg-[#EDE0C9] p-6">
            <CreditCard className="h-8 w-8 text-[#846B20]" />
            <h3 className="mt-4 text-lg font-bold text-[#4F3B00]">
              International Cards Accepted
            </h3>
            <p className="mt-1 text-xs text-[#4F3B00]/80">
              Visa and Mastercard are widely accepted across major cities in
              Egypt.
            </p>
          </div>
          <div className="rounded-2xl bg-[#EDE0C9] p-6">
            <Landmark className="h-8 w-8 text-[#846B20]" />
            <h3 className="mt-4 text-lg font-bold text-[#4F3B00]">
              ATM Locator & Cash Guide
            </h3>
            <p className="mt-1 text-xs text-[#4F3B00]/80">
              Easily find ATMs nearby for EGP cash withdrawals.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

/* --- Auth Helper Components --- */

function AuthTabs() {
  const location = useLocation();
  const isRegister = location.pathname.includes("register");

  return (
    <div className="mb-6 flex rounded-xl bg-sand-subtle p-1 border border-sand-line">
      <Link
        to="/login"
        className={`flex-1 rounded-lg py-2 text-center text-sm font-semibold transition-all ${
          !isRegister
            ? "bg-white text-charcoal shadow-sm"
            : "text-charcoal/60 hover:text-charcoal"
        }`}
      >
        Sign in
      </Link>
      <Link
        to="/register"
        className={`flex-1 rounded-lg py-2 text-center text-sm font-semibold transition-all ${
          isRegister
            ? "bg-white text-charcoal shadow-sm"
            : "text-charcoal/60 hover:text-charcoal"
        }`}
      >
        Create account
      </Link>
    </div>
  );
}

function ProtectedRoute({ children }) {
  const { isAuthenticated, initializing } = useAuth();
  if (initializing) return null;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return children;
}

function RedirectIfAuthenticated({ children }) {
  const { isAuthenticated, initializing } = useAuth();
  if (initializing) return null;
  if (isAuthenticated) return <Navigate to="/my-trip" replace />;
  return children;
}

/* --- Main App Component --- */

export default function App() {
  const navigate = useNavigate();
  const { setSession } = useAuth();

  const handleAuthenticated = (data) => {
    if (data?.token) {
      setSession({ token: data.token, user: data.user });
      navigate("/my-trip");
    }
  };

  return (
    <div className="relative min-h-dvh w-full max-w-full overflow-x-hidden">
      <PlanningProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/sim" element={<SimPlans />} />
          <Route path="/services" element={<Services />} />

          {/* Services Routes */}
          <Route path="/services/flights" element={<Flights />} />
          <Route
            path="/services/flights/results"
            element={<ComingSoon title="Flight Results" />}
          />
          <Route path="/services/accommodation" element={<Hotels />} />
          <Route path="/services/restaurants" element={<Restaurants />} />
          <Route path="/services/translation" element={<Translation />} />
          <Route path="/services/currency" element={<Currency />} />
          <Route path="/services/payment" element={<Checkout />} />
          <Route path="/services/visa" element={<Visa />} />

          {/* Dedicated App Screens */}
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/car" element={<CarRental />} />
          <Route path="/car-rental" element={<CarRental />} />

          {/* Planning Flow */}
          <Route path="/plan" element={<PlanningStep1 />} />
          <Route path="/plan/budget" element={<PlanningStep2Budget />} />
          <Route
            path="/plan/places"
            element={
              <ProtectedRoute>
                <PlanningStep3Places />
              </ProtectedRoute>
            }
          />
          <Route
            path="/plan/preferences"
            element={
              <ProtectedRoute>
                <PlanningStep4Preferences />
              </ProtectedRoute>
            }
          />
          <Route
            path="/plan/review"
            element={
              <ProtectedRoute>
                <PlanningStep5Review />
              </ProtectedRoute>
            }
          />
          <Route
            path="/plan/itinerary"
            element={
              <ProtectedRoute>
                <TripItineraryResult />
              </ProtectedRoute>
            }
          />

          {/* Exploratory & Utility Routes */}
          <Route path="/explore" element={<Explore />} />
          <Route path="/explore/:id" element={<PlaceDetails />} />
          <Route path="/emergency" element={<Emergency />} />
          <Route
            path="/offline-maps"
            element={<ComingSoon title="Offline Maps" />}
          />
          <Route
            path="/about"
            element={<ComingSoon title="About EGI RISE" />}
          />

          {/* MyTrip Dashboard */}
          <Route
            path="/my-trip"
            element={
              <ProtectedRoute>
                <MyTrip />
              </ProtectedRoute>
            }
          />

          {/* Trip Details Routes (Dynamic ID Route) */}
          <Route path="/trip-details/:id" element={<TripDetails />} />
          <Route path="/trip-details" element={<TripDetails />} />

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <MyTrip />
              </ProtectedRoute>
            }
          />

          {/* Chat Route */}
          <Route path="/chat" element={<TourGuideChat />} />

          {/* Auth Screens */}
          <Route
            path="/login"
            element={
              <RedirectIfAuthenticated>
                <AuthLayout>
                  <AuthTabs />
                  <Login onSuccess={handleAuthenticated} />
                </AuthLayout>
              </RedirectIfAuthenticated>
            }
          />
          <Route
            path="/register"
            element={
              <RedirectIfAuthenticated>
                <AuthLayout>
                  <AuthTabs />
                  <Register />
                </AuthLayout>
              </RedirectIfAuthenticated>
            }
          />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </PlanningProvider>
      <FloatingCharacter />
    </div>
  );
}
