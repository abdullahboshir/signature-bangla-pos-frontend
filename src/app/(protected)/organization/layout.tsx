"use client";

import { AppLayout } from "@/components/layouts/AppLayout";
import { useAuth } from "@/hooks/useAuth";
import { isOrganizationOwner, isPlatformLevel } from "@/config/auth-constants";
import { useRouter } from "next/navigation";
import React, { useEffect, useMemo, useState } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

interface CompanyAdminLayoutProps {
  children: React.ReactNode;
}

export default function CompanyAdminLayout({ children }: CompanyAdminLayoutProps) {
  const { user, isLoading, logout } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const router = useRouter();

  // Extract roles from user object - check multiple possible role sources
  const userRoles = useMemo(() => {
    if (!user) return [];

    const allRoles: string[] = [];
    console.log("Organization Admin Layout - Raw user object:", user);

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
        // Also check scope for organization-level access
        if (acc?.scope === 'COMPANY' || acc?.scope === 'organization') allRoles.push('organization-owner');
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

    console.log("Organization Admin Layout - Extracted roles:", allRoles);
    return [...new Set(allRoles)]; // Remove duplicates
  }, [user]);

  // Organization Admin layout allows: organization-owner and platform-level users (super-admin can access everything)
  const hasAccess = useMemo(() => {
    const access = isOrganizationOwner(userRoles) || isPlatformLevel(userRoles);
    console.log("Organization Admin Layout - User Roles:", userRoles, "Has Access:", access);
    return access;
  }, [userRoles]);
  console.log('hasAccess', hasAccess);

  // Temporarily disable logout to debug - just log the issue
  useEffect(() => {
    if (!isLoading && user) {
      console.log("Organization Admin Layout - User loaded. Has access:", hasAccess, "Roles:", userRoles);
      if (!hasAccess) {
        console.warn("Organization Admin Layout - User doesn't have access but allowing for now. Roles:", userRoles);
        // Temporarily disabled logout for debugging
        // toast.error("Access Denied: You don't have permission to access Organization Admin area.");
        // logout();
      }
    }
  }, [isLoading, user, userRoles, hasAccess]);

  if (isLoading || isLoggingOut) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  // If not authorized, show loading while logout is in progress
  if (!hasAccess) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return <AppLayout>{children}</AppLayout>;
}
