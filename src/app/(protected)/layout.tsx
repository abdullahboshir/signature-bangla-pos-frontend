"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { UserMenu } from "@/components/layouts/header/UserMenu";
import { LoadingClearer } from "@/components/shared/LoadingClearer";

interface ProtectedLayoutProps {
  children: React.ReactNode;
}

export default function ProtectedLayout({ children }: ProtectedLayoutProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, isLoading: authLoading } = useAuth();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Check for Outlet Restriction (Moved to top to avoid Hook Order Errors)
  useEffect(() => {
    if (user && !authLoading && user.permissions?.length > 0) {
      const restrictedOutlet = user.permissions.every((p: any) => p.outlet);

      if (restrictedOutlet && !user.isSuperAdmin) {
        // Safe access to outlet ID
        const firstPerm = user.permissions[0] as any;
        const targetOutletId = typeof firstPerm.outlet === 'object'
          ? firstPerm.outlet?._id
          : firstPerm.outlet;

        if (targetOutletId) {
          const isAllowedPath = pathname.includes(`/outlets/${targetOutletId}`);

          if (!isAllowedPath) {
            // Extract Role and BU from current path if possible, or fallback to user data
            const pathParts = pathname.split('/').filter(Boolean);
            // Standard: [role, business-unit, ...]
            let roleSlug = pathParts[0];
            let buSlug = pathParts[1];

            // Fallback if path is invalid (e.g. root) and we need to construct from user data
            if (!roleSlug || !buSlug) {
              // Try to get from user
              // Note: user.roles is ObjectId or populated object. 
              // This simple logic assumes standard path structure is maintained or valid defaults exist.
              // If we can't determine, we might just let it be or redirect to a known safe route if feasible.
              // But usually standard login redirects to /[role]/[bu]/...
              return;
            }

            // Force Redirect
            const targetPath = `/${roleSlug}/${buSlug}/outlets/${targetOutletId}`;
            // Avoid infinite redirect loop if matched
            if (pathname !== targetPath && !pathname.startsWith(targetPath)) {
              console.log("Restricting User to Outlet:", targetPath);
              router.replace(targetPath);
            }
          }
        }
      }
    }
  }, [user, authLoading, pathname]);

  // Defensive check: If we are on an auth URL, render children directly
  if (pathname.startsWith("/auth") || pathname.startsWith("/home")) {
    return <>{children}</>;
  }

  // Handle loading state
  if (!mounted || authLoading) {
    return <LoadingSpinner />;
  }

  // If not authenticated, the AuthProvider/useAuth should handle redirect, 
  // but we can return null here to avoid flashing content or errors.
  if (!user) {
    return null;
  }

  // Map user data to the format expected by UserMenu
  const userData = {
    fullName: typeof user.name === 'string' ? user.name : `${user.name?.firstName || ''} ${user.name?.lastName || ''}`,
    profileImg: user.avatar,
    designation: "Staff", // Placeholder as it's not in the User interface
    role: user.roles?.[0] || "staff",
    businessUnit: user.businessUnits?.map((bu: any) => typeof bu === 'string' ? bu : (bu.name || bu.slug || bu)) || []
  };



  return (
    <div className="min-h-screen bg-background">
      <LoadingClearer />
      {children}
    </div>
  );
}
