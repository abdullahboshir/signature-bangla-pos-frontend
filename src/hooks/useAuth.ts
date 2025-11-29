"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  login as authLogin,
  restoreAuthSession,
  clearAuthSession,
  getCurrentUser,
  User,
  LoginResponse,
} from "@/services/auth/authService";

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (user) {
      console.log("✅ User authenticated:", user.email);
    }
  }, [user]);

  useEffect(() => {
    (async () => {
      const restoredUser = await restoreAuthSession();
      setUser(restoredUser);
      setIsLoading(false);
    })();
  }, []);


  const login = async (formData: any): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      const response: LoginResponse = await authLogin(formData);

      if (!response.success || !response.user) {
        setError(response.message || "Login failed");
        setUser(null);
        return false;
      }

      // Fetch fresh user data
      const userData = await getCurrentUser();
      setUser(userData);
      setError(null);

      // Redirect if needed
      if (response.redirect) {
        router.push(response.redirect);
      }

      return true;
    } catch (err: any) {
      setError(err?.message || "Login failed");
      setUser(null);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // ✅ Logout function
  const logout = () => {
    clearAuthSession();
    setUser(null);
    setError(null);
    router.push("/auth/login");
  };

  // ✅ Manual refresh token
  const refreshSession = async (): Promise<boolean> => {
    try {
      const user = await restoreAuthSession();
      setUser(user);
      return !!user;
    } catch (err: any) {
      setError("Session refresh failed");
      setUser(null);
      return false;
    }
  };

  return {
    user,
    isLoading,
    error,
    isAuthenticated: !!user,
    login,
    logout,
    refreshSession,
  };
}