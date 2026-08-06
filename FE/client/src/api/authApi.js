import axios from "axios";

// Central axios instance for the EGI RISE auth service.
// Adjust baseURL via env var when wiring into a real build (Vite: import.meta.env.VITE_API_URL).
const api = axios.create({
  baseURL: "http://localhost:8000/api/user/",
  withCredentials: true, // allow the server to set an HttpOnly cookie
  headers: {
    "Content-Type": "application/json",
  },
});

/**
 * Normalizes backend error shapes into a single readable message.
 * Express/Mongoose validation errors commonly arrive as either
 * { message } or { errors: [{ msg }] }.
 */
function extractErrorMessage(error, fallback) {
  const data = error?.response?.data;
  if (!data) return error?.message || fallback;
  if (data.message) return data.message;
  if (Array.isArray(data.errors) && data.errors.length) {
    return data.errors.map((e) => e.msg || e.message).join(" ");
  }
  return fallback;
}

/**
 * POST /api/v1/auth/register
 * payload: { name, email, password, phone }
 * returns: { user, token }
 */
export async function registerUser({ fullName, email, password,confirmPassword, phone,country }) {
  try {
    const { data } = await api.post("/register", { fullName, email, password,confirmPassword, phone,country});
    return { data };
  } catch (error) {
    return { error: extractErrorMessage(error, "Could not create your account. Please try again.") };
  }
}

/**
 * POST /api/v1/auth/login
 * payload: { email, password }
 * returns: { user, token }
 */
export async function loginUser({ email, password }) {
  try {
    const { data } = await api.post("/login", { email, password });
    return { data };
  } catch (error) {
    return { error: extractErrorMessage(error, "Invalid email or password.") };
  }
}

export default api;
