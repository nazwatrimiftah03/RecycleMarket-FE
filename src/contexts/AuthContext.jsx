import { createContext, useContext, useState, useEffect } from "react";
import { apiFetch } from '../utils/api';

const AuthContext = createContext(undefined);

export function AuthProvider({ children }) {
  const [admin, setAdmin] = useState(null);

  useEffect(() => {
    const savedAdmin = localStorage.getItem("currentAdmin");
    if (savedAdmin) {
      try {
        setAdmin(JSON.parse(savedAdmin));
      } catch(e) {
        localStorage.removeItem("currentAdmin");
      }
    }
  }, []);

  const register = async (name, email, phone, location, password) => {
    try {
      // Panggil API Register
      const data = await apiFetch('/auth/register', {
        method: 'POST',
        body: JSON.stringify({ name, email, phone, location, password }),
      });

      const adminData = {
        id: data.id,
        name: data.name,
        email: data.email,
        phone: data.phone,
        location: data.location,
        token: data.token, 
      };
      
      return true; 
    } catch (error) {
      console.error("Register error:", error.data?.message || error.message);
      return false;
    }
  };

  const login = async (email, password) => {
    try {
      // Panggil API Login
      const data = await apiFetch('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });
      
      const adminData = {
        id: data.id,
        name: data.name,
        email: data.email,
        phone: data.phone,
        location: data.location,
        token: data.token, 
      };
      
      setAdmin(adminData);
      localStorage.setItem("currentAdmin", JSON.stringify(adminData));
      return true;
      
    } catch (error) {
      console.error("Login error:", error.data?.message || error.message);
      return false;
    }
  };

  const logout = () => {
    setAdmin(null);
    localStorage.removeItem("currentAdmin");
  };

  return (
    <AuthContext.Provider value={{ admin, login, register, logout, isAuthenticated: !!admin }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
