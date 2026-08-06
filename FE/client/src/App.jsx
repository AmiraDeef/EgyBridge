import React from "react";
import { Routes, Route, Navigate, Link, useLocation } from "react-router-dom";
import AuthLayout from "./components/auth/AuthLayout";
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";

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

export default function App() {
  const handleAuthenticated = ({ user, token }) => {
    if (token) localStorage.setItem("egi_rise_token", token);
    console.log("Authenticated as:", user);
  };

  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />


      <Route
        path="/login"
        element={
          <AuthLayout>
            <AuthTabs />
            <Login onSuccess={handleAuthenticated} />
          </AuthLayout>
        }
      />

      
      <Route
        path="/register"
        element={
          <AuthLayout>
            <AuthTabs />
            <Register onSuccess={handleAuthenticated} />
          </AuthLayout>
        }
      />
    </Routes>
  );
}