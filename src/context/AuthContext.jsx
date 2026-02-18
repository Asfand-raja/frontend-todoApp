import React, { createContext, useState, useEffect } from "react";
import api from "../utils/HandleApi";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // ------------------------
  // State
  // ------------------------
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user") || sessionStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [loading, setLoading] = useState(true); // ✅ show loading while validating token

  // ------------------------
  // Check token validity on app load
  // ------------------------
  useEffect(() => {
    const checkToken = async () => {
      const token = localStorage.getItem("authToken") || sessionStorage.getItem("authToken");
      if (token) {
        try {
          const res = await api.get("/auth/me"); // backend validates token
          setUser(res.data.user);
        } catch (err) {
          console.warn("Invalid token, clearing storage.");
          localStorage.removeItem("authToken");
          localStorage.removeItem("user");
          sessionStorage.removeItem("authToken");
          sessionStorage.removeItem("user");
          setUser(null);
        }
      }
      setLoading(false);
    };

    checkToken();
  }, []);

  // ------------------------
  // Logout function (async)
  // ------------------------
  const logout = async () => {
    try {
      await api.post("/auth/logout"); // call backend to invalidate session
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      localStorage.removeItem("authToken");
      localStorage.removeItem("user");
      sessionStorage.removeItem("authToken");
      sessionStorage.removeItem("user");
      setUser(null);
    }
  };

  // ------------------------
  // Context value
  // ------------------------
  const value = {
    user,
    setUser,
    logout,
    loading,
  };

  // ------------------------
  // Render
  // ------------------------
  return (
    <AuthContext.Provider value={value}>
      {loading ? (
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
          <p>Loading...</p>
        </div>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
};
