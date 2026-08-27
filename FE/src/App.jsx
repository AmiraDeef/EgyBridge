import React from "react";
import { Routes, Route, Navigate, Link, useLocation, useNavigate } from "react-router-dom";
import AuthLayout from "./components/auth/AuthLayout";
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import Dashboard from "./pages/Dashboard";
import Home from "./pages/Home";
import SimPlans from "./pages/SimPlans";
import PlanningStep1 from "./pages/PlanningStep1";
import PlanningStep3Places from "./pages/PlanningStep3Places";
import PlanningStep4Itinerary from "./pages/PlanningStep4Itinerary";
import PlanningStep5Offline from "./pages/PlanningStep5Offline";
import Services from "./pages/Services";
import ComingSoon from "./pages/ComingSoon";
import { useAuth } from "./context/AuthContext";

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

// Redirects to /login unless a session exists.
function ProtectedRoute({ children }) {
  const { isAuthenticated, initializing } = useAuth();
  if (initializing) return null; // avoid a flash-redirect while localStorage is read
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return children;
}

// Sends an already-logged-in visitor away from the auth screens instead of
// letting them "log in" again over an existing session.
function RedirectIfAuthenticated({ children }) {
  const { isAuthenticated, initializing } = useAuth();
  if (initializing) return null;
  if (isAuthenticated) return <Navigate to="/my-trip" replace />;
  return children;
}

export default function App() {
  const navigate = useNavigate();
  const { setSession } = useAuth();

  // loginUser() (authApi.js) already persists { token, user } to
  // localStorage on success — this just syncs React state immediately and
  // moves on, rather than waiting for a reload to pick up the new session.
  const handleAuthenticated = (data) => {
    if (data?.token) {
      setSession({ token: data.token, user: data.user });
      navigate("/my-trip");
    }
  };

  return (
    <Routes>
      {/* Public marketing/browsing pages */}
      <Route path="/" element={<Home />} />
      <Route path="/plan" element={<PlanningStep1 />} />
      <Route path="/sim" element={<SimPlans />} />

      {/* Stubs — not built yet, kept as placeholders so nav links don't 404 */}
      <Route path="/explore" element={<ComingSoon title="Explore" />} />
      <Route path="/explore/:id" element={<ComingSoon title="Trip Details" />} />
      <Route path="/emergency" element={<ComingSoon title="Emergency" />} />
      <Route path="/offline-maps" element={<ComingSoon title="Offline Maps" />} />

      {/* Services — public directory of official/verified links */}
      <Route path="/services" element={<Services />} />

      {/* Wizard steps 3–5: generating and saving a real trip plan requires
          a session, so these are gated (Step 1 and the destinations/places
          browsing on Step 3 don't strictly need it, but the wizard is one
          continuous flow — better to ask for login once, up front, than
          mid-flow when Step 4's generate call would otherwise 401). */}
      <Route
        path="/plan/places"
        element={
          <ProtectedRoute>
            <PlanningStep3Places />
          </ProtectedRoute>
        }
      />
      <Route
        path="/plan/review"
        element={
          <ProtectedRoute>
            <PlanningStep4Itinerary />
          </ProtectedRoute>
        }
      />
      <Route
        path="/plan/offline"
        element={
          <ProtectedRoute>
            <PlanningStep5Offline />
          </ProtectedRoute>
        }
      />

      {/* Authenticated */}
      <Route
        path="/my-trip"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />

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
  );
}
