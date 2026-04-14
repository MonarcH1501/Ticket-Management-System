import { useState } from "react";
import { AuthContext } from "./auth-context";
import api from "../api/axios";

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const login = async (userData, token) => {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);
    // Fetch full user with roles
    try {
      const res = await api.get('/user');
      const fullUser = res.data;
      localStorage.setItem("user", JSON.stringify(fullUser));
      setUser(fullUser);
    } catch (err) {
      console.error('Failed to fetch full user data', err);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}