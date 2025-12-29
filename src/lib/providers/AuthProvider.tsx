"use client";

import {
    createContext,
    useContext,
    ReactNode,
    useState,
    useEffect
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
import { jwtDecode } from "jwt-decode";

interface AuthContextType {
    user: User | null;
    isLoading: boolean;
    error: string | null;
    isAuthenticated: boolean;
    activeBusinessUnit: string | null;
    setActiveBusinessUnit: (id: string | null) => void;
    login: (formData: any) => Promise<LoginResponse>;
    logout: () => void;
    refreshSession: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const router = useRouter();

    const [activeBusinessUnit, setActiveBusinessUnitState] = useState<string | null>(null);

    // Initialize from localStorage on mount
    useEffect(() => {
        const stored = localStorage.getItem('active-business-unit');
        if (stored) {
            setActiveBusinessUnitState(stored);
        }
    }, []);

    const queryParams = activeBusinessUnit ? { businessUnitId: activeBusinessUnit } : undefined;

    // RTK Query Hooks
    // useGetMeQuery handles initial load, session restoration, and acts as the source of truth for 'user'
    const {
        data: user,
        isLoading: isUserLoading,
        refetch: refetchUser,
        isError
    } = useGetMeQuery(queryParams, {
        pollingInterval: 0,
        refetchOnFocus: false, // Don't aggressive refetch
        refetchOnMountOrArgChange: true // Ensure re-fetch on BU change
    });
    console.log('dddddddddddddddddddd', user)
    const [loginMutation] = useLoginMutation();
    const [logoutMutation] = useLogoutMutation();

    const setActiveBusinessUnit = (id: string | null) => {
        if (id) {
            localStorage.setItem('active-business-unit', id);
        } else {
            localStorage.removeItem('active-business-unit');
        }
        setActiveBusinessUnitState(id);
    };

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
            const decoded = jwtDecode(accessToken) as any;

            // Determine redirect
            const redirect = getRedirectPath(accessToken, userData);

            return {
                success: true,
                accessToken,
                status: decoded?.status,
                user: userData,
                redirect,
            };

        } catch (err: any) {
            // Detailed logging for debugging "Empty Error" issue
            console.error("LOGIN ERROR CAUGHT IN AUTH PROVIDER:", JSON.stringify(err, null, 2));

            // Log raw error if stringify fails/returns empty (e.g. Error object sometimes acts weird)
            if (Object.keys(err).length === 0) {
                console.error("LOGIN ERROR (RAW):", err);
                if (err.message) console.error("LOGIN ERROR MESSAGE:", err.message);
                if (err.stack) console.error("LOGIN ERROR STACK:", err.stack);
            }

            let errorMessage = "Login failed";

            if (err?.status === "FETCH_ERROR") {
                errorMessage = "Unable to connect to the server. Please check your internet connection.";
            } else if (err?.status === "PARSING_ERROR") {
                errorMessage = "Server response invalid. Please contact support.";
            } else if (err?.data?.message) {
                errorMessage = err.data.message;
            } else if (err?.error) {
                errorMessage = err.error;
            } else if (err?.message === "Failed to fetch" || err?.message?.includes("NetworkError")) {
                errorMessage = "Network Error: Unable to reach the server.";
            }

            return {
                success: false,
                message: errorMessage,
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
        localStorage.removeItem('active-business-unit'); // Clear context
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
                activeBusinessUnit,
                setActiveBusinessUnit,
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
