import React, { createContext, useContext, useState, useEffect } from 'react';
import {jwtDecode} from "jwt-decode";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [logoutTimer, setLogoutTimer] = useState(null);

  // Load user from localStorage on first render
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser);
        setUser(parsed);

        // Setup auto logout if token exists
        if (parsed.token) {
          setupAutoLogout(parsed.token);
        }

      } catch (err) {
        console.error("Failed to parse user:", err);
      }
    }
    setLoading(false); // ✅ done loading
  }, []);

  const setupAutoLogout = (token) => {
    try {
      const decoded = jwtDecode(token); // { exp: 1698232323, iat: ... }
      const expTime = decoded.exp * 1000; // ms
      const now = Date.now();
      const timeLeft = expTime - now;

      if (timeLeft > 0) {
        // clear old timers
        if (logoutTimer) clearTimeout(logoutTimer);

        const timer = setTimeout(() => {
          console.log(" Token expired. Logging out...");
          logout();
        }, timeLeft);

        setLogoutTimer(timer);
      } else {
        // already expired
        logout();
      }
    } catch (err) {
      console.error("Failed to decode token:", err);
      logout();
    }
  };

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem("token", userData.token);

    // 🔹 Schedule auto logout
    if (userData.token) setupAutoLogout(userData.token);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem("token");
    localStorage.removeItem('mood');
    localStorage.removeItem('climate');

    if (logoutTimer) clearTimeout(logoutTimer);
  };




  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
