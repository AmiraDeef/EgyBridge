import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, User, Globe } from "lucide-react";
import Logo from "../common/Logo";
import { useAuth } from "../../context/AuthContext";

export default function ServiceHeader({ title = "SERVICE", backPath = "/services" }) {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  return (
    <header className="mx-auto w-full max-w-6xl px-4 pt-6 sm:px-8">
      <nav className="flex items-center justify-between rounded-full border border-[#D9C89E] bg-[#F7F4EB] px-6 py-2.5 shadow-sm">
        
        {/* Left Side: Back Button + Logo + Title Badge + Currency */}
        <div className="flex items-center gap-3 sm:gap-4">
          <button
            type="button"
            onClick={() => navigate(backPath)}
            className="flex items-center gap-1.5 rounded-full bg-[#EAE2CA] px-3.5 py-1 text-[11px] font-bold text-[#524016] hover:bg-[#D9C89E] transition-all"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>BACK</span>
          </button>

          <Logo size="sm" variant="horizontal" />

          <span className="rounded-full bg-[#524016] px-4 py-1 text-[11px] font-bold uppercase tracking-wider text-[#F7F4EB]">
            {title}
          </span>

          <span className="hidden sm:inline text-xs font-bold text-[#3B2F11]">$ USD</span>
        </div>

        {/* Right Side: Links & User Info */}
        <div className="flex items-center gap-5 text-xs font-bold uppercase tracking-wider text-[#3B2F11]">
          <Link to="/about" className="flex items-center gap-1 hover:opacity-80 transition-opacity">
            ABOUT <span className="h-2 w-2 rounded-full bg-[#524016]"></span>
          </Link>

          {isAuthenticated ? (
            <Link to="/my-trip" className="flex items-center gap-1.5 hover:opacity-80 transition-opacity">
              <User className="h-3.5 w-3.5" />
              <span>{user?.fullName?.split(" ")[0] || "SARA"}</span>
            </Link>
          ) : (
            <Link to="/login" className="flex items-center gap-1.5 hover:opacity-80 transition-opacity">
              <span>SIGN UP/LOGIN</span>
            </Link>
          )}

          <button type="button" className="flex items-center gap-1 hover:opacity-80 transition-opacity">
            <Globe className="h-3.5 w-3.5" />
            <span>Languages</span>
          </button>
        </div>
      </nav>
    </header>
  );
}