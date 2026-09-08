import axios from "axios";

// Central axios instance every API module in src/api should import instead
// of creating its own axios.create(). This is the single place that knows
// about the token, the base URL, and how to react to an expired session.
//
// Vite exposes env vars via import.meta.env.VITE_* (not process.env — that's
// a Create React App convention and is undefined in a Vite build). Set
// VITE_API_URL in a .env file at the FE project root; see .env.example.
const baseURL = import.meta.env.VITE_API_URL || "https://egy-backend.vercel.app/api/user";

export const TOKEN_STORAGE_KEY = "egi_rise_token";
export const USER_STORAGE_KEY = "egi_rise_user";

const api = axios.create({
  baseURL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach the JWT bearer token to every request, for every protected route,
// automatically — nothing else in the app needs to remember to do this.
api.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_STORAGE_KEY);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// If the token is missing/expired, the backend's authMiddleware responds
// 401. Clear the stale session and bounce to /login rather than leaving the
// app stuck showing a broken authenticated view.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem(TOKEN_STORAGE_KEY);
      localStorage.removeItem(USER_STORAGE_KEY);
      if (typeof window !== "undefined" && !window.location.pathname.startsWith("/login")) {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

/**
 * Normalizes backend error shapes into a single readable string.
 * This backend's Joi-validation errors come back as
 * { message: ["err1", "err2", ...] } — an array, not a string — so that
 * has to be joined before it's safe to render in a banner. Plain
 * { message: "..." } responses (not-found, bad password, etc.) pass through
 * unchanged.
 */
export function extractErrorMessage(error, fallback = "Something went wrong. Please try again.") {
  const data = error?.response?.data;
  if (!data) return error?.message || fallback;
  if (Array.isArray(data.message)) return data.message.join(" ");
  if (data.message) return data.message;
  if (Array.isArray(data.errors) && data.errors.length) {
    return data.errors.map((e) => e.msg || e.message).join(" ");
  }
  return fallback;
}

export default api;
