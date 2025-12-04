"use client";

import {
    createContext,
    useContext,
    useEffect,
    useState,
    ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import {
    login as authLogin,
    restoreAuthSession,
    clearAuthSession,
    getCurrentUser,
    User,
    LoginResponse,
} from "@/services/auth/authService";

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
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    // Restore session on mount
    useEffect(() => {
        let mounted = true;

        const initAuth = async () => {
            try {
                const restoredUser = await restoreAuthSession();
                if (mounted) {
                    setUser(restoredUser);
                }
            } catch (err) {
                console.error("Auth initialization failed", err);
            } finally {
                if (mounted) {
                    setIsLoading(false);
                }
            }
        };

        initAuth();

        return () => {
            mounted = false;
        };
    }, []);

    const login = async (formData: any): Promise<LoginResponse> => {
        setIsLoading(true);
        setError(null);

        try {
            const response: LoginResponse = await authLogin(formData);

            if (!response.success || !response.accessToken) {
                const message = response.message || "Login failed";
                setError(message);
                setUser(null);
                return {
                    success: false,
                    message,
                };
            }

            // Fetch fresh user data to keep context consistent
            const userData: any = (await getCurrentUser()) || response.user;
            setUser(userData);
            setError(null);

            return {
                success: true,
                accessToken: response.accessToken,
                user: userData,
                redirect: response.redirect,
            };
        } catch (err: any) {
            const message = err?.message || "Login failed";
            setError(message);
            setUser(null);
            return {
                success: false,
                message,
            };
        } finally {
            setIsLoading(false);
        }
    };

    const logout = () => {
        clearAuthSession();
        setUser(null);
        setError(null);
        router.push("/auth/login");
    };

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

    return (
        <AuthContext.Provider
            value={{
                user,
                isLoading,
                error,
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
