"use client";

import {
    createContext,
    useContext,
    ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import {
    User,
    LoginResponse,
    setAuthSession,
    clearAuthSession as clearAuthCookies,
    getRedirectPath
} from "@/services/auth/authService";
import {
    useLoginMutation,
    useLogoutMutation,
    useGetMeQuery
} from "@/redux/api/authApi";

interface AuthContextType {
    user: User | null;
    isLoading: boolean;
    error: string | null;
    isAuthenticated: boolean;
    login: (formData: any) => Promise<LoginResponse>;
    logout: () => void;
    refreshSession: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const router = useRouter();

    // RTK Query Hooks
    // useGetMeQuery handles initial load, session restoration, and acts as the source of truth for 'user'
    const {
        data: user,
        isLoading: isUserLoading,
        refetch: refetchUser,
        isError
    } = useGetMeQuery(undefined, {
        pollingInterval: 0,
        refetchOnFocus: false, // Don't aggressive refetch
    });

    const [loginMutation] = useLoginMutation();
    const [logoutMutation] = useLogoutMutation();

    const login = async (formData: any): Promise<LoginResponse> => {
        try {
            const res: any = await loginMutation(formData).unwrap();

            // Debugging login response structure
            console.log("LOGIN RESPONSE DEBUG:", res);

            // Adjust based on actual API response structure. 
            // authApi transformResponse typically returns res.data or res.data.data from baseApi
            // But mutation returns exactly what backend sends usually unless transformed.
            // Let's assume standard response: { success, data: { accessToken, user } }

            const data = res.data || res;
            const accessToken = data?.accessToken;
            const userData = data?.user;

            if (!accessToken) {
                return { success: false, message: "Invalid login response" };
            }

            // Set cookie
            setAuthSession(accessToken);

            // Determine redirect
            const redirect = getRedirectPath(accessToken, userData);

            return {
                success: true,
                accessToken,
                user: userData,
                redirect,
            };

        } catch (err: any) {
            return {
                success: false,
                message: err?.data?.message || err?.message || "Login failed",
            };
        }
    };

    const logout = async () => {
        try {
            await logoutMutation({}).unwrap();
        } catch (e) {
            console.error("Logout error", e);
        }

        clearAuthCookies();
        // Force hard reload to clear all states and prevent protected layout loops
        window.location.href = "/auth/login";
        // router.push("/auth/login");
        // We can manually reset api state if needed, but invalidation should handle it
        // dispatch(baseApi.util.resetApiState()); // Optional if full clear required
    };

    const refreshSession = async (): Promise<boolean> => {
        try {
            const result = await refetchUser();
            return !!result.data;
        } catch {
            return false;
        }
    };

    return (
        <AuthContext.Provider
            value={{
                user: user || null,
                isLoading: isUserLoading,
                error: isError ? "Authentication error" : null,
                isAuthenticated: !!user,
                login,
                logout,
                refreshSession,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuthContext() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuthContext must be used within an AuthProvider");
    }
    return context;
}
