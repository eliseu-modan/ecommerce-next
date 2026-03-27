"use client";

import { createContext, useState, useEffect, ReactNode } from "react";
import type { AuthUser } from "@/lib/types";

interface AuthContextType {
  token: string | null;
  user: AuthUser | null;
  isReady: boolean;
  login: (token: string, user: AuthUser) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    const savedUser = localStorage.getItem("user");

    if (savedToken && savedUser && savedUser !== "undefined") {
      try {
        setToken(savedToken);
        setUser(JSON.parse(savedUser));
      } catch (error) {
        console.error("Erro ao fazer parse do usuário:", error);
        localStorage.removeItem("user");
      }
    }

    setIsReady(true);
  }, []);

  const login = (newToken: string, newUser: AuthUser) => {
    localStorage.setItem("token", newToken);
    localStorage.setItem("user", JSON.stringify(newUser));
    setToken(newToken);
    setUser(newUser);
    window.location.href = "/";
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    sessionStorage.clear();

    window.location.href = "/";
  };

  return (
    <AuthContext.Provider value={{ token, user, isReady, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
