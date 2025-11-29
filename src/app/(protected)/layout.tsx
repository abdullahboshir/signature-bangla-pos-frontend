// src/app/(protected)/layout.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { useCurrentRole } from "@/hooks/useCurrentRole";
import { useCurrentBusinessUnit } from "@/hooks/useCurrentBusinessUnit";
import { usePermissions } from "@/hooks/usePermissions";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { Unauthorized } from "@/components/shared/Unauthorized";
import { verifyToken } from "@/lib/auth/token-manager";
import { hasRouteAccess } from "@/lib/auth/role-validator";


interface ProtectedLayoutProps {
  children: React.ReactNode;
}

export default function ProtectedLayout({ children }: ProtectedLayoutProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, isLoading: authLoading, logout } = useAuth();
  const { currentRole, isLoading: roleLoading } = useCurrentRole();
  const { currentBusinessUnit, isLoading: unitLoading } = useCurrentBusinessUnit();
  const { hasPermission, isLoading: permissionLoading } = usePermissions();

  const [isChecking, setIsChecking] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(true);

  // Extract route segments for validation
  const pathSegments = pathname.split("/").filter(Boolean);

  const roleFromPath = pathSegments[0]; // /[role]
  const businessUnitFromPath = pathSegments[1]; // /[businessUnit]

  useEffect(() => {
    const checkAccess = async () => {
      // Don't run check if hooks are still loading
     
      if (authLoading  || unitLoading || permissionLoading) {
        return;
      }
      
      
      try {
        setIsAuthorized(true)
        // 1. Check if user is authenticated
        if (!user) {
          setIsAuthorized(false);
          router.push("/auth/login");
          return;
        }
        
        // 2. Verify token validity
        const isTokenValid = await verifyToken();
        
        if (!isTokenValid) {
          setIsAuthorized(false);
          await logout();
          router.push("/auth/login?message=session_expired");
          return;
        }
        
        // 3. Check if user has access to this business unit
        if (
          businessUnitFromPath &&
          !user.accessibleBusinessUnits?.includes(businessUnitFromPath)
        ) {
          setIsAuthorized(false);
          return;
        }
        
        
        // 4. Check if user has this role
        if (roleFromPath && !currentRole.includes(roleFromPath) ) {
          setIsAuthorized(false);
          return;
        }
        
        
        // 5. Check route-level permissions
        const routeAccess = await hasRouteAccess(
          pathname,
          currentRole,
          user.permissions
        );
        
        
      

        if (!routeAccess) {
          setIsAuthorized(false);
          return;
        }

        // setIsAuthorized(true);
      } catch (error) {
        console.error("Access check failed:", error);
        setIsAuthorized(false);
        await logout();
        router.push("/auth/login?message=access_denied");
      } finally {
        setIsChecking(false);
      }
    };

    checkAccess();
  }, [
    user,
    pathname,
    router,
    logout,
    businessUnitFromPath,
    roleFromPath,
    authLoading,
    roleLoading,
    unitLoading,
    permissionLoading,
  ]);


    console.log('checkingggggggggggggggggg from layout', user, isAuthorized, isChecking);

  // Show loading state
  if (
    authLoading ||
    roleLoading ||
    unitLoading ||
    permissionLoading ||
    isChecking
  ) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-muted-foreground">
            Checking access permissions...
          </p>
        </div>
      </div>
    );
  }

  // Show unauthorized state
  if (!isAuthorized) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Unauthorized
          requiredRole={roleFromPath}
          requiredBusinessUnit={businessUnitFromPath}
          userRole={currentRole}
          userBusinessUnits={user?.accessibleBusinessUnits}
        />
      </div>
    );
  }

  // User is authorized, render the protected content
  return <div className="min-h-screen bg-background">{children}</div>;
}
