import { useState } from "react";
import { AuthContext } from "./auth-context";
import api from "../api/axios";

export default function AuthProvider({ children }) {

  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [token, setToken] = useState(() => {
    return localStorage.getItem("token");
  });

  const login = async (userData, tokenData) => {
    // simpan ke localStorage
    localStorage.setItem("token", tokenData);
    localStorage.setItem("user", JSON.stringify(userData));

    // simpan ke state
    setUser(userData);
    setToken(tokenData);

    // 🔥 fetch user lengkap (roles, permissions)
    try {
      const res = await api.get("/user", {
        headers: {
          Authorization: `Bearer ${tokenData}`
        }
      });

      const fullUser = res.data;

      localStorage.setItem("user", JSON.stringify(fullUser));
      setUser(fullUser);

    } catch (err) {
      console.error("Failed to fetch full user data", err);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setUser(null);
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}