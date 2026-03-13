"use client";

import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { useRouter, usePathname } from "next/navigation";
import { me as fetchMe, logout as apiLogout } from "@/functions/api/auth";

type User = {
  id: string;
  username: string;
  email: string;
};

type AuthContextType = {
  user: User | null;
  loading: boolean;
  login: (userData: any) => void;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  login: () => {},
  logout: async () => {},
  refreshUser: async () => {},
});

const PUBLIC_ONLY_ROUTES = ["/login", "/register", "/signup"];

const isProtectedPath = (path: string) =>
  path.startsWith("/dashboard") ||
  path.startsWith("/onboarding") ||
  path.startsWith("/profile");

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const router = useRouter();
  const pathname = usePathname();

  const loadUser = useCallback(async () => {
    try {
      const data = await fetchMe();
      // backend: { success: true, data: { id, email, username } }
      const userObj = data?.data ?? null;
      setUser(userObj);
    } catch (err) {
      if ((err as any)?.status !== 401) {
        console.error("AuthContext: loadUser failed", err);
      }
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  useEffect(() => {
    if (loading || !pathname) return;

    if (!user && isProtectedPath(pathname)) {
      router.replace("/login");
    } else if (user && PUBLIC_ONLY_ROUTES.includes(pathname)) {
      router.replace("/dashboard");
    }
  }, [user, loading, pathname, router]);

  const login = (data: any) => {
    // backend login returns: { success, token, data: { id, email, username } }
    const userObj = data?.data ?? null;
    if (userObj) setUser(userObj);
  };

  const logout = async () => {
    try {
      await apiLogout();
    } catch (err) {
      console.error("Logout failed:", err);
    } finally {
      setUser(null);
      router.push("/login");
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, refreshUser: loadUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);