"use client";

import * as React from "react";
import { useRouter } from "next/navigation";

const ACCESS_CODE = "MKAOYO2025";

interface AuthContextValue {
  isAuthenticated: boolean;
  login: (code: string) => boolean;
  logout: () => void;
}

const AuthContext = React.createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = React.useState(false);
  const [isLoaded, setIsLoaded] = React.useState(false);

  React.useEffect(() => {
    const stored = sessionStorage.getItem("mka-oyo-auth");
    setIsAuthenticated(stored === "true");
    setIsLoaded(true);
  }, []);

  const login = React.useCallback((code: string): boolean => {
    if (code.trim().toUpperCase() === ACCESS_CODE) {
      sessionStorage.setItem("mka-oyo-auth", "true");
      setIsAuthenticated(true);
      return true;
    }
    return false;
  }, []);

  const logout = React.useCallback(() => {
    sessionStorage.removeItem("mka-oyo-auth");
    setIsAuthenticated(false);
  }, []);

  const value = React.useMemo(
    () => ({ isAuthenticated, login, logout }),
    [isAuthenticated, login, logout],
  );

  // Don't render children until we've checked sessionStorage
  if (!isLoaded) return null;

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = React.useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

/**
 * Hook that redirects to "/" if not authenticated.
 * Use in protected layouts/pages.
 */
export function useRequireAuth() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  React.useEffect(() => {
    if (!isAuthenticated) {
      router.replace("/");
    }
  }, [isAuthenticated, router]);

  return isAuthenticated;
}
