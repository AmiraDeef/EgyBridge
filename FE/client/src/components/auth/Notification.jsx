import React from "react";
import { CheckCircle2, XCircle, X } from "lucide-react";

/**
 * Notification
 * Inline banner for success / error feedback after a submit attempt.
 */
export default function Notification({ type = "error", message, onDismiss }) {
  if (!message) return null;

  const isSuccess = type === "success";

  return (
    <div
      role="alert"
      className={[
        "mb-5 flex items-start gap-2.5 rounded-xl border px-4 py-3 animate-fade-in",
        isSuccess
          ? "border-emerald-200 bg-emerald-50 text-emerald-700"
          : "border-red-200 bg-red-50 text-red-600",
      ].join(" ")}
    >
      {isSuccess ? (
        <CheckCircle2 className="mt-0.5 h-[18px] w-[18px] flex-shrink-0" />
      ) : (
        <XCircle className="mt-0.5 h-[18px] w-[18px] flex-shrink-0" />
      )}
      <p className="flex-1 text-sm font-medium leading-snug">{message}</p>
      {onDismiss && (
        <button
          type="button"
          onClick={onDismiss}
          aria-label="Dismiss notification"
          className="text-current/60 transition-opacity hover:opacity-70"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}
