import { createContext, useContext, useState, useEffect } from "react";
import api from "@/lib/axios";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("vn_user");
    return stored ? JSON.parse(stored) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem("vn_token"));

  // On mount, refresh the user profile if we have a token but no user
  useEffect(() => {
    if (token && !user) refreshUser();
  }, []);

  const saveSession = (userData, jwt) => {
    setUser(userData);
    setToken(jwt);
    localStorage.setItem("vn_token", jwt);
    localStorage.setItem("vn_user", JSON.stringify(userData));
  };

  const login = async (email, password) => {
    const { data } = await api.post("/api/users/login", { email, password });
    saveSession(data, data.token);
    // Fetch full profile (includes isEmailVerified, hasPin)
    const { data: profile } = await api.get("/api/users/me");
    const fullUser = { ...data, ...profile };
    setUser(fullUser);
    localStorage.setItem("vn_user", JSON.stringify(fullUser));
  };

  const register = async (name, email, password) => {
    const { data } = await api.post("/api/users/register", { name, email, password });
    saveSession(data, data.token);
  };

  const googleLogin = async (credential) => {
    const { data } = await api.post("/api/users/google", { credential });
    saveSession(data, data.token);
    // Fetch full profile so hasPin / isEmailVerified are available immediately
    try {
      const { data: profile } = await api.get("/api/users/me");
      const fullUser = { ...data, ...profile };
      setUser(fullUser);
      localStorage.setItem("vn_user", JSON.stringify(fullUser));
    } catch (_) {}
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("vn_token");
    localStorage.removeItem("vn_user");
    window.location.href = "/";
  };

  const refreshUser = async () => {
    try {
      const { data } = await api.get("/api/users/me");
      setUser(data);
      localStorage.setItem("vn_user", JSON.stringify(data));
    } catch {
      logout();
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, token, login, register, googleLogin, logout, refreshUser, setUser }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
