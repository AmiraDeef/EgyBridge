import React, { useState } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import { Menu, X, User, LogOut, Compass } from "lucide-react";
import Logo from "../common/Logo";
import { useAuth } from "../../context/AuthContext";

const NAV_ITEMS = [
  { label: "Home", to: "/" },
  { label: "My Trip", to: "/my-trip" },
  { label: "Explore", to: "/explore" },
  { label: "Start Planning", to: "/plan" },
  { label: "Services", to: "/services" },
];

export default function SiteNavbar({ variant = "default" }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const headerClass =
    variant === "transparent"
      ? "absolute top-0 left-0 w-full z-40 bg-transparent px-6 py-3.5 sm:px-10 transition-colors"
      : variant === "my-trip"
        ? "sticky top-0 z-40 bg-[#E4DDCA] border-b border-[#D6C8A5]/60 px-6 py-3.5 transition-colors sm:px-10"
        : "sticky top-0 z-40 bg-[#E0D8C4] border-b border-[#D6C8A5]/60 px-6 py-3.5 sm:px-10 transition-colors";

  return (
    <header className={headerClass}>
      <nav className="mx-auto flex h-full max-w-6xl items-center justify-between">
        {/* Brand Logo */}
        <Logo size="md" variant="horizontal" />

        {/* Desktop Navigation Links */}
        <ul className="hidden items-center gap-1.5 md:flex">
          {NAV_ITEMS.map((item) => (
            <li key={item.to}>
              <NavLink
                to={item.to}
                end={item.to === "/"}
                className={({ isActive }) =>
                  [
                    "block rounded-lg px-5 py-2 text-sm font-medium transition-all duration-200",
                    isActive
                      ? "bg-[#524016] text-[#FDFBF7] shadow-sm font-semibold"
                      : "text-ink/75 hover:text-ink hover:bg-gold/15",
                  ].join(" ")
                }
              >
                {item.label}
              </NavLink>
            </li>
          ))}
        </ul>

        {/* Right Side CTA & Auth Status */}
        <div className="hidden items-center gap-3 md:flex">
          {isAuthenticated ? (
            <div className="flex items-center gap-2.5">
              <Link
                to="/profile"
                className="flex items-center gap-2 rounded-full border border-line bg-cream px-3.5 py-1.5 text-xs font-semibold text-ink shadow-sm transition-colors hover:border-gold"
              >
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gold/20 text-gold-dark font-bold text-[11px]">
                  {user?.fullName?.charAt(0).toUpperCase() || "U"}
                </div>
                <span>{user?.fullName?.split(" ")[0] || "Profile"}</span>
              </Link>
              <button
                type="button"
                onClick={handleLogout}
                title="Sign out"
                className="flex h-8 w-8 items-center justify-center rounded-full border border-line text-ink/60 transition-colors hover:border-red-300 hover:bg-red-50 hover:text-red-600"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <span className="cursor-pointer text-sm font-semibold text-ink/80">
                EN / USD ▾
              </span>
              <Link
                to="/login"
                className="rounded-lg bg-[#C78A2F] px-6 py-2.5 text-sm font-semibold text-white transition-all hover:bg-gold-light"
              >
                Login
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Hamburger Toggle */}
        <button
          type="button"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="rounded-xl border border-line bg-cream p-2 text-ink/80 transition-colors hover:text-ink md:hidden"
          aria-label="Toggle Menu"
        >
          {mobileMenuOpen ? (
            <X className="h-5 w-5" />
          ) : (
            <Menu className="h-5 w-5" />
          )}
        </button>
      </nav>

      {/* Mobile Dropdown Menu */}
      {mobileMenuOpen && (
        <div className="mt-3 rounded-2xl border border-line bg-cream p-4 shadow-card md:hidden animate-fade-in">
          <ul className="space-y-1.5">
            {NAV_ITEMS.map((item) => (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  end={item.to === "/"}
                  onClick={() => setMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    [
                      "block rounded-xl px-4 py-2.5 text-sm font-medium transition-colors",
                      isActive
                        ? "bg-[#524016] text-[#FDFBF7] font-semibold"
                        : "text-ink/80 hover:bg-sandbox",
                    ].join(" ")
                  }
                >
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>

          <div className="mt-4 border-t border-line pt-4">
            {isAuthenticated ? (
              <div className="flex items-center justify-between">
                <Link
                  to="/profile"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2 text-sm font-semibold text-ink"
                >
                  <User className="h-4 w-4 text-gold" />
                  {user?.fullName || "My Profile"}
                </Link>
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    handleLogout();
                  }}
                  className="flex items-center gap-1.5 text-xs font-semibold text-red-600 hover:underline"
                >
                  <LogOut className="h-3.5 w-3.5" />
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="flex gap-2">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex-1 rounded-xl border border-line bg-sandbox py-2 text-center text-sm font-semibold text-ink"
                >
                  Sign In
                </Link>
                <Link
                  to="/plan"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex-1 rounded-xl bg-gold py-2 text-center text-sm font-semibold text-cream"
                >
                  Plan Trip
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

// Named export for backwards compatibility
export { Logo };
