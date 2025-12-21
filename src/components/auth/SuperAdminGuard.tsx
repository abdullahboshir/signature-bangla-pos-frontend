"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { Loader2 } from "lucide-react";

interface SuperAdminGuardProps {
    children: React.ReactNode;
}

export function SuperAdminGuard({ children }: SuperAdminGuardProps) {
    const { user, isLoading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!isLoading && user) {
            const isSuperAdmin = user.roles?.some((r: any) =>
                (typeof r === 'string' ? r : r.name) === 'super-admin'
            );

            if (!isSuperAdmin) {
                // Not authorized, redirect to home or login
                // Better to redirect to a generic unauthorized page or their scoped dashboard if possible
                // For now, redirecting to root which usually handles redirection based on role
                router.replace("/");
            }
        } else if (!isLoading && !user) {
            router.replace("/login");
        }
    }, [user, isLoading, router]);

    if (isLoading) {
        return (
            <div className="flex h-screen w-full items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    // Check again for render safety (optional but good for strictness)
    const isSuperAdmin = user?.roles?.some((r: any) =>
        (typeof r === 'string' ? r : r.name) === 'super-admin'
    );

    if (!user || !isSuperAdmin) {
        return null; // Don't render children while redirecting
    }

    return <>{children}</>;
}
