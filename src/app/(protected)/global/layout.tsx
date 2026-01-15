"use client";

import { AppLayout } from "@/components/layouts/AppLayout";
import { useAuth } from "@/hooks/useAuth";
import { isPlatformLevel, isCompanyOwner } from "@/config/auth-constants";
import { useRouter } from "next/navigation";
import React, { useEffect, useMemo, useState } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

interface GlobalLayoutProps {
  children: React.ReactNode;
}

/**
 * Global Layout - ONLY for Platform-Level Users (Super Admin, Platform Admin, etc.)
 * Company Owners should use /company-admin route instead
 */
export default function GlobalLayout({ children }: GlobalLayoutProps) {
  const { user, isLoading, logout } = useAuth();
  const [isRedirecting, setIsRedirecting] = useState(false);
  const router = useRouter();

  // Extract roles from user object - check multiple possible role sources
  const userRoles = useMemo(() => {
    if (!user) return [];

    const allRoles: string[] = [];

    // Check globalRoles array
    if (user.globalRoles) {
      const globalRoles = Array.isArray(user.globalRoles) ? user.globalRoles : [user.globalRoles];
      globalRoles.forEach((r: any) => {
        if (typeof r === "string") allRoles.push(r);
        else if (r?.name) allRoles.push(r.name);
        else if (r?.slug) allRoles.push(r.slug);
      });
    }

    // Check businessAccess roles
    if (user.businessAccess) {
      const businessAccess = Array.isArray(user.businessAccess) ? user.businessAccess : [user.businessAccess];
      businessAccess.forEach((acc: any) => {
        if (acc?.role) {
          if (typeof acc.role === "string") allRoles.push(acc.role);
          else if (acc.role?.name) allRoles.push(acc.role.name);
          else if (acc.role?.slug) allRoles.push(acc.role.slug);
        }
        // Also check scope for company-level access
        if (acc?.scope === 'COMPANY' || acc?.scope === 'company') allRoles.push('company-owner');
      });
    }

    // Check direct roles array (fallback)
    if (user.roles) {
      const roles = Array.isArray(user.roles) ? user.roles : [user.roles];
      roles.forEach((r: any) => {
        if (typeof r === "string") allRoles.push(r);
        else if (r?.name) allRoles.push(r.name);
        else if (r?.slug) allRoles.push(r.slug);
      });
    }

    return [...new Set(allRoles)]; // Remove duplicates
  }, [user]);

  // Only platform-level users can access /global routes
  const isPlatformUser = useMemo(() => {
    return isPlatformLevel(userRoles);
  }, [userRoles]);

  // Check if user is company owner (should redirect to /company-admin)
  const isCompanyOwnerUser = useMemo(() => {
    return isCompanyOwner(userRoles) && !isPlatformLevel(userRoles);
  }, [userRoles]);

  // Redirect company owners to /company-admin
  useEffect(() => {
    if (!isLoading && user && isCompanyOwnerUser && !isRedirecting) {
      console.log("Global Layout - Redirecting company owner to /company-admin. Roles:", userRoles);
      setIsRedirecting(true);
      toast.info("Redirecting to Company Admin dashboard...");
      router.replace("/company-admin/dashboard");
    }
  }, [isLoading, user, isCompanyOwnerUser, userRoles, router, isRedirecting]);

  // Logout unauthorized users (not platform level and not company owner)
  useEffect(() => {
    if (!isLoading && user && !isPlatformUser && !isCompanyOwnerUser && !isRedirecting) {
      setIsRedirecting(true);
      toast.error("Access Denied: Unauthorized access attempt detected. You have been logged out.");
      logout();
    }
  }, [isLoading, user, isPlatformUser, isCompanyOwnerUser, logout, isRedirecting]);

  if (isLoading || isRedirecting) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  // If not a platform user, show loading while redirect/logout is in progress
  if (!isPlatformUser) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return <AppLayout>{children}</AppLayout>;
}
