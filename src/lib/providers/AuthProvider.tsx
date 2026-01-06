"use client";

import {
    createContext,
    useContext,
    ReactNode,
    useState
} from "react";
import { useRouter, usePathname } from "next/navigation";
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
} from "@/redux/api/iam/authApi";
import { jwtDecode } from "jwt-decode";
import { authKey } from "@/constant/authKey";

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

    const [activeBusinessUnit, setActiveBusinessUnitState] = useState<string | null>(() => {
        if (typeof window !== 'undefined') {
            return localStorage.getItem('active-business-unit');
        }
        return null;
    });

    const queryParams = activeBusinessUnit ? { businessUnitId: activeBusinessUnit } : undefined;

    const pathname = usePathname();
    const isAuthPage = pathname?.includes("/auth");

    const hasToken = typeof window !== 'undefined' ? document.cookie.includes(authKey) : false;

    const shouldSkip = !hasToken || isAuthPage;

    const {
        data: user,
        isLoading: isUserLoading,
        refetch: refetchUser,
        isError
    } = useGetMeQuery(queryParams, {
        pollingInterval: 0,
        refetchOnFocus: false,
        refetchOnMountOrArgChange: true,
        skip: shouldSkip
    });

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

            // console.log("LOGIN RESPONSE DEBUG:", res);

            const data = res.data || res;
            const accessToken = data?.accessToken;

            if (!accessToken) {
                return { success: false, message: "Invalid login response" };
            }

            // Set cookie
            setAuthSession(accessToken);
            const decoded = jwtDecode(accessToken) as any;
            console.log("JWT DECODED INFO:", decoded);

            let redirect = "/global/dashboard";
            const context = decoded?.context;
            const roles = Array.isArray(decoded?.role) ? decoded.role : [decoded?.role || ""];

            // Helper to check management roles
            const isManagementRole = roles.some((r: string) =>
                ["admin", "super-admin", "manager", "owner", "ceo", "director", "business-admin"].includes(r.toLowerCase())
            );

            if (decoded?.isSuperAdmin) {
                redirect = "/global/dashboard";
            } else if (context?.primary) {
                const { businessUnit, outlet } = context.primary;
                const slug = businessUnit?.slug || "unknown";

                // Find the full details in available list to check outlet counts
                const availableEntry = context.available?.find((a: any) =>
                    a.businessUnit._id === businessUnit._id || a.businessUnit.id === businessUnit.id
                );

                const outletCount = availableEntry?.outletCount || 0;

                // LOGIC UPDATE: Management Roles go to Business Dashboard regardless of outlet count
                // Operational Roles (Cashier, Sales) go to Outlet Dashboard if single context
                if (!isManagementRole && (outletCount === 1 && availableEntry?.outlets?.length > 0)) {
                    // Operational Staff -> Direct Outlet Login
                    const singleOutletId = availableEntry.outlets[0]._id;
                    redirect = `/${slug}/outlets/${singleOutletId}`;
                } else if (!isManagementRole && outlet) {
                    // Operational Staff with specific outlet context -> Direct Outlet
                    redirect = `/${slug}/outlets/${outlet._id}`;
                } else {
                    // Managers/Admins OR Multiple Outlets -> Business Dashboard (Head Office View)
                    redirect = `/${slug}/dashboard`;
                }

                // Store active BU in local storage
                if (businessUnit._id) {
                    setActiveBusinessUnit(businessUnit._id);
                }
            } else if (context?.available?.length > 0) {
                // Fallback if no primary is set but BUs exist - pick first
                const first = context.available[0];
                const slug = first.businessUnit.slug;

                // Same Logic for Non-Primary Context
                if (!isManagementRole && first.outletCount === 1) {
                    redirect = `/${slug}/outlets/${first.outlets[0]._id}`;
                } else {
                    redirect = `/${slug}/dashboard`;
                }

                if (first.businessUnit._id) {
                    setActiveBusinessUnit(first.businessUnit._id);
                }
            }

            return {
                success: true,
                accessToken,
                status: decoded?.status,
                redirect,
            };

        } catch (err: any) {
            console.error("LOGIN ERROR CAUGHT IN AUTH PROVIDER:", JSON.stringify(err, null, 2));

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
        localStorage.removeItem('active-business-unit');
        window.location.href = "/auth/login";
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

