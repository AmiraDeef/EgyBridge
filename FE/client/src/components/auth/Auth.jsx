import React, { useState } from "react";
import AuthLayout from "./AuthLayout";
import Login from "./Login";
import Register from "./Register";
import Logo from "./Logo";

/**
 * Auth
 * Top-level entry point for the authentication experience. Toggles between
 * Login and Register while keeping the branded split layout constant.
 *
 * Usage:
 *   <Auth onAuthenticated={({ user, token }) => { ... }} />
 */
export default function Auth({ onAuthenticated, initialMode = "login" }) {
  const [mode, setMode] = useState(initialMode); // "login" | "register"

  const handleSuccess = (data) => {
    // data is { user, token } per the backend response contract.
    // Give the success banner a moment to be seen before redirecting.
    setTimeout(() => onAuthenticated?.(data), 900);
  };

  return (
    <AuthLayout>
      <div className="mb-8 flex flex-col items-center lg:items-start">
        <Logo />
      </div>

      <ModeTabs mode={mode} onChange={setMode} />

      {mode === "login" ? (
        <Login onSuccess={handleSuccess} onSwitchToRegister={() => setMode("register")} />
      ) : (
        <Register onSuccess={handleSuccess} onSwitchToLogin={() => setMode("login")} />
      )}
    </AuthLayout>
  );
}

function ModeTabs({ mode, onChange }) {
  const tabs = [
    { key: "login", label: "Sign in" },
    { key: "register", label: "Create account" },
  ];

  return (
    <div
      role="tablist"
      aria-label="Authentication mode"
      className="mb-8 grid grid-cols-2 gap-1 rounded-xl bg-sand-line/50 p-1"
    >
      {tabs.map((tab) => {
        const active = mode === tab.key;
        return (
          <button
            key={tab.key}
            role="tab"
            type="button"
            aria-selected={active}
            onClick={() => onChange(tab.key)}
            className={[
              "rounded-lg py-2.5 text-sm font-semibold transition-all duration-150",
              active
                ? "bg-white text-charcoal shadow-sm"
                : "text-charcoal/50 hover:text-charcoal/80",
            ].join(" ")}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
