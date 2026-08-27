import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, Lock, Loader2, ArrowRight } from "lucide-react";
import FormInput from "./FormInput";
import Notification from "./Notification";
import { DividerWithText, GoogleButton } from "./SocialAuth";
import { loginUser } from "../../api/authApi";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validate(values) {
  const errors = {};
  if (!values.email.trim()) errors.email = "Email is required.";
  else if (!EMAIL_RE.test(values.email)) errors.email = "Enter a valid email address.";

  if (!values.password) errors.password = "Password is required.";
  else if (values.password.length < 6) errors.password = "Password must be at least 6 characters.";

  return errors;
}

export default function Login({ onSuccess }) {
  const navigate = useNavigate();
  const [values, setValues] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [banner, setBanner] = useState(null); // { type, message }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues((v) => ({ ...v, [name]: value }));
    if (touched[name]) {
      setErrors((prev) => ({ ...validate({ ...values, [name]: value }) }));
    }
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched((t) => ({ ...t, [name]: true }));
    setErrors(validate(values));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const nextErrors = validate(values);
    setErrors(nextErrors);
    setTouched({ email: true, password: true });
    if (Object.keys(nextErrors).length > 0) return;

    setIsSubmitting(true);
    setBanner(null);

    const { data, error } = await loginUser(values);

    setIsSubmitting(false);

    if (error) {
      setBanner({ type: "error", message: error });
      return;
    }

    setBanner({ type: "success", message: "Welcome back! Redirecting you now…" });
    onSuccess?.(data);
  };

  return (
    <div className="animate-fade-in">
      <header className="mb-8">
        <h1 className="font-display text-[28px] font-semibold leading-tight text-charcoal">
          Welcome back
        </h1>
        <p className="mt-1.5 text-sm text-charcoal/60">
          Sign in to continue planning your trip to Egypt.
        </p>
      </header>

      <Notification
        type={banner?.type}
        message={banner?.message}
        onDismiss={() => setBanner(null)}
      />

      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        <FormInput
          label="Email address"
          name="email"
          type="email"
          icon={Mail}
          placeholder="you@example.com"
          autoComplete="email"
          required
          value={values.email}
          onChange={handleChange}
          onBlur={handleBlur}
          error={touched.email ? errors.email : undefined}
        />

        <FormInput
          label="Password"
          name="password"
          type="password"
          icon={Lock}
          placeholder="••••••••"
          autoComplete="current-password"
          required
          value={values.password}
          onChange={handleChange}
          onBlur={handleBlur}
          error={touched.password ? errors.password : undefined}
        />

        <div className="flex justify-end">
          <button
            type="button"
            className="text-sm font-medium text-gold-dark transition-colors hover:text-charcoal"
          >
            Forgot password?
          </button>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="group flex w-full items-center justify-center gap-2 rounded-xl bg-gold px-4 py-3.5 text-[15px] font-semibold text-white shadow-sm transition-all duration-150 hover:bg-charcoal focus:outline-none focus:shadow-gold-glow disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="h-[18px] w-[18px] animate-spin" />
              Signing in…
            </>
          ) : (
            <>
              Sign in
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </>
          )}
        </button>
      </form>

      <DividerWithText>or</DividerWithText>

      <GoogleButton />

  <p className="mt-8 text-center text-sm text-charcoal/60">
  Don't have an account?{" "}
  <button
    type="button"
    onClick={() => navigate("/register")}
    className="font-semibold text-gold-dark hover:text-charcoal"
  >
    Create one
  </button>
</p>
    </div>
  );
}

