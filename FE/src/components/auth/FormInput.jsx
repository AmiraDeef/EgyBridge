import React, { useId, useState } from "react";
import { Eye, EyeOff } from "lucide-react";

/**
 * FormInput
 * Shared, accessible text input for the auth forms. Handles password
 * visibility toggling and inline validation messaging.
 */
export default function FormInput({
  label,
  type = "text",
  icon: Icon,
  error,
  value,
  onChange,
  onBlur,
  placeholder,
  autoComplete,
  required = false,
  name,
}) {
  const id = useId();
  const isPassword = type === "password";
  const [visible, setVisible] = useState(false);
  const resolvedType = isPassword ? (visible ? "text" : "password") : type;

  return (
    <div className="w-full">
      <label
        htmlFor={id}
        className="mb-1.5 block text-sm font-medium text-charcoal"
      >
        {label}
        {required && <span className="ml-0.5 text-gold-dark">*</span>}
      </label>

      <div className="relative">
        {Icon && (
          <Icon
            className="pointer-events-none absolute left-3.5 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-charcoal/40"
            aria-hidden="true"
          />
        )}

        <input
          id={id}
          name={name}
          type={resolvedType}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          placeholder={placeholder}
          autoComplete={autoComplete}
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-error` : undefined}
          className={[
            "w-full rounded-xl border bg-white py-3 text-[15px] text-charcoal placeholder:text-charcoal/35",
            "transition-all duration-150 outline-none",
            Icon ? "pl-10" : "pl-4",
            isPassword ? "pr-11" : "pr-4",
            error
              ? "border-red-300 focus:border-red-400 focus:shadow-[0_0_0_4px_rgba(248,113,113,0.12)]"
              : "border-sand-line focus:border-gold focus:shadow-gold-glow",
          ].join(" ")}
        />

        {isPassword && (
          <button
            type="button"
            onClick={() => setVisible((v) => !v)}
            tabIndex={-1}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-charcoal/40 transition-colors hover:text-gold-dark"
            aria-label={visible ? "Hide password" : "Show password"}
          >
            {visible ? <EyeOff className="h-[18px] w-[18px]" /> : <Eye className="h-[18px] w-[18px]" />}
          </button>
        )}
      </div>

      {error && (
        <p id={`${id}-error`} className="mt-1.5 animate-fade-in text-xs font-medium text-red-500">
          {error}
        </p>
      )}
    </div>
  );
}
