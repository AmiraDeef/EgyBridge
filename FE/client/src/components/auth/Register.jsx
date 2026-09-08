import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { User, Mail, Lock, Phone, Globe, Loader2, ArrowRight } from "lucide-react";
import FormInput from "./FormInput";
import Notification from "./Notification";
import { DividerWithText, GoogleButton } from "./SocialAuth";
import { registerUser } from "../../api/authApi";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^[0-9]{11}$/;

function validate(values) {
  const errors = {};

  if (!values.fullName.trim()) errors.fullName = "Full name is required.";
  else if (values.fullName.trim().length < 10) errors.fullName = "Full name must be at least 10 characters.";

  if (!values.email.trim()) errors.email = "Email is required.";
  else if (!EMAIL_RE.test(values.email)) errors.email = "Enter a valid email address.";

  if (!values.country.trim()) errors.country = "Country is required.";

  if (!values.phone.trim()) errors.phone = "Phone number is required.";
  else if (!PHONE_RE.test(values.phone.trim())) errors.phone = "Phone number must be exactly 11 digits.";

  if (!values.password) errors.password = "Password is required.";
  else if (values.password.length < 6) errors.password = "Password must be at least 6 characters.";

  if (!values.confirmPassword) errors.confirmPassword = "Please confirm your password.";
  else if (values.confirmPassword !== values.password) errors.confirmPassword = "Passwords do not match.";

  return errors;
}

const initialValues = { fullName: "", email: "", country: "", phone: "", password: "", confirmPassword: "" };

export default function Register() {
  const navigate = useNavigate();
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [banner, setBanner] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const nextValues = { ...values, [name]: value };
    setValues(nextValues);
    if (touched[name]) setErrors(validate(nextValues));
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
    setTouched({ fullName: true, email: true, country: true, phone: true, password: true, confirmPassword: true });
    if (Object.keys(nextErrors).length > 0) return;

    setIsSubmitting(true);
    setBanner(null);

    
    const { data, error } = await registerUser({
      fullName: values.fullName.trim(),
      email: values.email.trim(),
      country: values.country.trim(),
      phone: values.phone.trim(),
      password: values.password,
      confirmPassword: values.confirmPassword 
    });

    setIsSubmitting(false);

    if (error) {
      setBanner({ type: "error", message: error });
      return;
    }

    setBanner({ type: "success", message: "Account created successfully! Redirecting you to sign in…" });
    setTimeout(() => navigate("/login"), 1200);
  };

  return (
    <div className="animate-fade-in">
      <header className="mb-4">
        <h1 className="font-display text-[28px] font-semibold leading-tight text-charcoal">
          Create your account
        </h1>
        <p className="mt-1.5 text-sm text-charcoal/60">
          Join EGI RISE and start building your Egypt itinerary.
        </p>
      </header>

      <Notification
        type={banner?.type}
        message={banner?.message}
        onDismiss={() => setBanner(null)}
      />

      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        <FormInput
          label="Full name"
          name="fullName"
          type="text"
          icon={User}
          placeholder="Engy"
          autoComplete="name"
          required
          value={values.fullName}
          onChange={handleChange}
          onBlur={handleBlur}
          error={touched.fullName ? errors.fullName : undefined}
        />

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
          label="Country"
          name="country"
          type="text"
          icon={Globe}
          placeholder="Egypt"
          autoComplete="country-name"
          required
          value={values.country}
          onChange={handleChange}
          onBlur={handleBlur}
          error={touched.country ? errors.country : undefined}
        />

        <FormInput
          label="Phone number"
          name="phone"
          type="tel"
          icon={Phone}
          placeholder="01000000000"
          autoComplete="tel"
          required
          value={values.phone}
          onChange={handleChange}
          onBlur={handleBlur}
          error={touched.phone ? errors.phone : undefined}
        />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormInput
            label="Password"
            name="password"
            type="password"
            icon={Lock}
            placeholder="••••••••"
            autoComplete="new-password"
            required
            value={values.password}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.password ? errors.password : undefined}
          />

          <FormInput
            label="Confirm password"
            name="confirmPassword"
            type="password"
            icon={Lock}
            placeholder="••••••••"
            autoComplete="new-password"
            required
            value={values.confirmPassword}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.confirmPassword ? errors.confirmPassword : undefined}
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="group flex w-full items-center justify-center gap-2 rounded-xl bg-gold px-4 py-3.5 text-[15px] font-semibold text-white shadow-sm transition-all duration-150 hover:bg-charcoal focus:outline-none focus:shadow-gold-glow disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="h-[18px] w-[18px] animate-spin" />
              Creating your account…
            </>
          ) : (
            <>
              Create account
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </>
          )}
        </button>

        <p className="text-center text-xs leading-relaxed text-charcoal/45">
          By creating an account you agree to EGI RISE's Terms of Service and Privacy Policy.
        </p>
      </form>

      <DividerWithText>or</DividerWithText>

      <GoogleButton label="Sign up with Google" />
<p className="mt-8 text-center text-sm text-charcoal/60">
  Already have an account?{" "}
  <button
    type="button"
    onClick={() => navigate("/login")}
    className="font-semibold text-gold-dark hover:text-charcoal"
  >
    Sign in
  </button>
</p>
    </div>
  );
}