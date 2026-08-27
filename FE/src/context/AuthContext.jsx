import React, { createContext, useContext, useEffect, useState } from "react";
import { TOKEN_STORAGE_KEY, USER_STORAGE_KEY } from "../api/axiosInstance";
import { logoutUser } from "../api/authApi";

const AuthContext = createContext(null);

/**
 * AuthProvider
 * Single source of truth for "who is logged in", read from localStorage on
 * first load so a page refresh doesn't silently log the person out. Wrap
 * the app in this once, at the root (see main.jsx).
 *
 * loginUser() (in authApi.js) already writes to localStorage on success —
 * call context.setSession(data) right after so React state picks it up
 * immediately, without waiting for a re-render/reload.
 */
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem(TOKEN_STORAGE_KEY);
    const storedUser = localStorage.getItem(USER_STORAGE_KEY);
    if (storedToken) setToken(storedToken);
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        // Corrupted value — ignore and stay logged out rather than crash.
      }
    }
    setInitializing(false);
  }, []);

  const setSession = ({ token: newToken, user: newUser }) => {
    setToken(newToken);
    setUser(newUser);
  };

  const logout = async () => {
    await logoutUser(); // clears localStorage too, see authApi.js
    setToken(null);
    setUser(null);
  };

  const value = {
    user,
    token,
    isAuthenticated: !!token,
    initializing,
    setSession,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside an <AuthProvider>");
  return ctx;
}
