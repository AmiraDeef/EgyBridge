import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

/**
 * BackButton
 * A clear, accessible navigation button using react-router-dom's useNavigate(-1).
 * Features smooth hover transitions, optional label, and fallback path support.
 *
 * @param {Object} props
 * @param {string} [props.fallbackPath] - Fallback route if history is empty (default: '/')
 * @param {string} [props.label] - Text label (default: 'Back')
 * @param {string} [props.className] - Additional CSS classes
 * @param {string} [props.variant] - 'pill' | 'ghost' | 'circular' (default: 'ghost')
 * @param {() => void} [props.onClick] - Custom click handler (overrides default navigate(-1))
 */
export default function BackButton({
  fallbackPath = "/",
  label = "Back",
  className = "",
  variant = "ghost",
  onClick,
}) {
  const navigate = useNavigate();

  const handleClick = (e) => {
    e.preventDefault();
    if (onClick) {
      onClick();
      return;
    }

    // If there is browser history, navigate back; otherwise fallback safely
    if (window.history.state && window.history.state.idx > 0) {
      navigate(-1);
    } else {
      navigate(fallbackPath);
    }
  };

  if (variant === "pill") {
    return (
      <button
        type="button"
        onClick={handleClick}
        aria-label={label || "Go back"}
        className={`inline-flex items-center gap-2 rounded-full border border-line bg-cream px-4 py-2 text-xs font-semibold text-ink/75 shadow-sm transition-all duration-200 hover:border-gold hover:bg-sandbox hover:text-ink hover:shadow active:scale-95 ${className}`}
      >
        <ArrowLeft className="h-3.5 w-3.5 text-gold-dark" />
        {label && <span>{label}</span>}
      </button>
    );
  }

  if (variant === "circular") {
    return (
      <button
        type="button"
        onClick={handleClick}
        aria-label={label || "Go back"}
        title={label || "Go back"}
        className={`inline-flex h-9 w-9 items-center justify-center rounded-full border border-line bg-cream text-ink/70 shadow-sm transition-all duration-200 hover:border-gold hover:bg-gold/10 hover:text-gold-dark active:scale-95 ${className}`}
      >
        <ArrowLeft className="h-4 w-4" />
      </button>
    );
  }

  // Default 'ghost' variant
  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label={label || "Go back"}
      className={`inline-flex items-center gap-2 text-sm font-medium text-ink/65 transition-colors duration-200 hover:text-ink group ${className}`}
    >
      <div className="flex h-7 w-7 items-center justify-center rounded-full border border-line/60 bg-cream/70 transition-all duration-200 group-hover:border-gold group-hover:bg-gold/10">
        <ArrowLeft className="h-4 w-4 text-ink/70 transition-transform duration-200 group-hover:-translate-x-0.5 group-hover:text-gold-dark" />
      </div>
      {label && <span className="font-semibold">{label}</span>}
    </button>
  );
}
