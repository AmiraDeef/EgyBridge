import api, { extractErrorMessage, TOKEN_STORAGE_KEY, USER_STORAGE_KEY } from "./axiosInstance";

/**
 * POST /api/user/register
 * payload: { fullName, email, password, confirmPassword, phone, country }
 * returns: { message } on success (201) — no token; user must log in separately.
 */
export async function registerUser({ fullName, email, password, confirmPassword, phone, country }) {
  try {
    const { data } = await api.post("/register", {
      fullName,
      email,
      password,
      confirmPassword,
      phone,
      country,
    });
    return { data };
  } catch (error) {
    return { error: extractErrorMessage(error, "Could not create your account. Please try again.") };
  }
}

/**
 * POST /api/user/login
 * payload: { email, password }
 * returns: { message, token, user: { id, fullName, email, role } }
 *
 * Persists the token + user to localStorage on success so the session
 * survives a page refresh — see AuthContext, which reads these same keys.
 */
export async function loginUser({ email, password }) {
  try {
    const { data } = await api.post("/login", { email, password });
    if (data?.token) {
      localStorage.setItem(TOKEN_STORAGE_KEY, data.token);
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(data.user));
    }
    return { data };
  } catch (error) {
    return { error: extractErrorMessage(error, "Invalid email or password.") };
  }
}

/**
 * GET /api/user/logout
 * The backend endpoint is a no-op (no session store to invalidate server
 * side), so the meaningful part of "logout" is clearing local storage.
 */
export async function logoutUser() {
  try {
    await api.get("/logout");
  } catch {
    // Even if the network call fails, still clear the local session below.
  } finally {
    localStorage.removeItem(TOKEN_STORAGE_KEY);
    localStorage.removeItem(USER_STORAGE_KEY);
  }
}

export default api;
