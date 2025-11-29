import { axiosInstance } from "@/lib/axios/axiosInstance";
import { jwtDecode } from "jwt-decode";

export interface User {
  id: string;
  name: string;
  email: string;
  roles: string[];
  isLoading: boolean;
  avatar?: string;
  accessibleBusinessUnits?: string[];
  permissions?: string[];
}

export interface LoginResponse {
  success: boolean;
  accessToken?: string;
  user?: User;
  redirect?: string;
  message?: string;
}

// ✅ Login with email/password
export const login = async (formData: any): Promise<LoginResponse> => {
  try {
    const res = await axiosInstance.post("/auth/login", formData);
    const { accessToken, user } = res.data.data;

    if (accessToken) {
      sessionStorage.setItem("accessToken", accessToken);
      
      const decoded = jwtDecode(accessToken) as any;
      const redirectPath =
        decoded?.role === "customer" ? "/" : "/super-admin/telemedicine";

      return {
        success: true,
        accessToken,
        user,
        redirect: redirectPath,
      };
    }

    return { success: false, message: "Invalid login" };
  } catch (error: any) {
    return {
      success: false,
      message: error?.response?.data?.message || "Login failed",
    };
  }
};

// ✅ Get new access token using refresh token
export const refreshAccessToken = async (): Promise<string | null> => {
  try {
    const res = await axiosInstance.post("/auth/refresh-token");
    const newToken = res?.data?.data?.accessToken;
    if (newToken) {
      sessionStorage.setItem("accessToken", newToken);
      return newToken;
    }

    return null;
  } catch (error: any) {
    console.error("❌ Refresh token failed:", error.message);
    sessionStorage.removeItem("accessToken");
    return null;
  }
};

// ✅ Fetch current logged-in user
export const getCurrentUser = async (): Promise<User | null> => {
  try {
    const res = await axiosInstance.get("/auth/me");
    return res?.data?.data || null;
  } catch (error: any) {
    console.error("❌ Get current user failed:", error.message);
    return null;
  }
};

// ✅ Logout helper
export const clearAuthSession = () => {
  sessionStorage.removeItem("accessToken");
};

// ✅ Restore session (combines refresh + getCurrentUser)
export const restoreAuthSession = async (): Promise<User | null> => {
  const token = await refreshAccessToken();

  // 
  if (!token) {
    clearAuthSession();
    return null;
  }

  const user = await getCurrentUser();
  
  if (!user) {
    clearAuthSession();
    return null;
  }

  return user;
};