import { createContext, useState, useEffect, useCallback } from "react";
import API from "../services/api";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = (userData) => {
    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem("user");
    setUser(null);
  };

  /** Refetch current user from API (xp, level, streak) and update context so points display updates */
  const refreshUser = useCallback(async () => {
    const stored = localStorage.getItem("user");
    if (!stored) return;
    try {
      const res = await API.get("/auth/me");
      const updated = { ...JSON.parse(stored), user: res.data.user };
      localStorage.setItem("user", JSON.stringify(updated));
      setUser(updated);
    } catch (_) {
      // ignore (e.g. 401)
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
};
