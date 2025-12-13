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
import { BusinessUnitSwitcher } from "@/components/layouts/header/BusinessUnitSwitcher";
import { UserMenu } from "@/components/layouts/header/UserMenu";

interface ProtectedLayoutProps {
  children: React.ReactNode;
}

export default function ProtectedLayout({ children }: ProtectedLayoutProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, isLoading: authLoading, logout } = useAuth();
  const { currentRole, isLoading: roleLoading } = useCurrentRole();
  const { userBusinessUnits, currentBusinessUnit, isLoading: unitLoading } = useCurrentBusinessUnit();
  const { hasPermission, isLoading: permissionLoading } = usePermissions();

  const [isChecking, setIsChecking] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(true);

  const pathSegments = pathname.split("/").filter(Boolean);
  const roleFromPath = pathSegments[0]; // /[role]
  const businessUnitFromPath = pathSegments[1]; // /[businessUnit]

  useEffect(() => {
    const checkAccess = async () => {
      if (authLoading || unitLoading || roleLoading || permissionLoading) {
        return;
      }

      try {
        if (!user) {
          setIsAuthorized(false);
          setIsChecking(false);
          router.push("/auth/login");
          return;
        }

        // 2. Verify token validity
        const isTokenValid = await verifyToken();

        if (!isTokenValid) {
          setIsAuthorized(false);
          setIsChecking(false);
          logout();
          router.push("/auth/login?message=session_expired");
          return;
        }

        // 3. Check if user has access to this business unit
        const isSuperAdmin =
          (user?.roles && Array.isArray(user.roles) && user.roles.some((r: any) =>
            (r.name && r.name.toLowerCase() === 'super-admin') ||
            (r.id && r.id === 'super-admin')
          )) ||
          (user && (user as any).role && Array.isArray((user as any).role) && (user as any).role.some((r: string) => r.toLowerCase() === 'super-admin'));

        console.log("=== ACCESS CONTROL DEBUG ===");
        console.log("businessUnitFromPath:", businessUnitFromPath);
        console.log("isSuperAdmin:", isSuperAdmin);
        console.log("userBusinessUnits:", userBusinessUnits);

        const hasAccessToUnit = userBusinessUnits?.some((u: any) => {
          const checks = {
            matchId: u.id === businessUnitFromPath,
            matchSlug: u.slug && u.slug === businessUnitFromPath,
            matchName: u.name && u.name.toLowerCase().replace(/ /g, '-') === businessUnitFromPath,
            matchObjectId: u._id && u._id.toString() === businessUnitFromPath
          };

          console.log(`Checking unit: ${u.name || u.id}`, checks);

          return checks.matchId || checks.matchSlug || checks.matchName || checks.matchObjectId;
        });

        console.log("hasAccessToUnit:", hasAccessToUnit);
        console.log("=== END DEBUG ===");

        if (
          businessUnitFromPath &&
          !isSuperAdmin &&
          !hasAccessToUnit
        ) {
          console.error('❌ ACCESS DENIED:', { businessUnitFromPath, isSuperAdmin, hasAccessToUnit, userBusinessUnits });
          setIsAuthorized(false);
          setIsChecking(false);
          return;
        }

        // Special case for /super-admin root - allow if role is super-admin
        if (pathname === '/super-admin') {
          if (isSuperAdmin) {
            setIsAuthorized(true);
            setIsChecking(false);
            return;
          }
        }

        // 4. Check if user has this role
        console.log("=== ROLE CHECK DEBUG ===");
        console.log("roleFromPath:", roleFromPath);
        console.log("currentRole:", currentRole);

        // Ensure currentRole is treated as array for inclusion check if needed, or handle string
        const roleArray = Array.isArray(currentRole) ? currentRole : [currentRole];
        console.log("roleArray:", roleArray);
        console.log("roleArray.includes(roleFromPath):", roleArray.includes(roleFromPath));

        if (roleFromPath && !roleArray.includes(roleFromPath)) {
          if (!isSuperAdmin) {
            console.error("❌ ROLE MISMATCH - Access Denied!");
            setIsAuthorized(false);
            setIsChecking(false);
            return;
          }
        }
        console.log("=== ROLE CHECK PASSED ===");

        // 5. Check route-level permissions
        // If user is super-admin, they have access to everything, skip check
        if (isSuperAdmin) {
          setIsAuthorized(true);
          setIsChecking(false);
          return;
        }

        const aggregatedPermissions = Array.isArray(user?.roles)
          ? user.roles.flatMap((role: any) => role?.permissions || [])
          : [];

        // Note: hasRouteAccess expects string userRole. Passing first role if array, or the string.
        const primaryRole = Array.isArray(currentRole) ? currentRole[0] : currentRole;

        console.log("=== ROUTE ACCESS CHECK ===");
        console.log("primaryRole:", primaryRole);
        console.log("pathname:", pathname);

        const routeAccess = await hasRouteAccess(
          pathname,
          primaryRole,
          aggregatedPermissions
        );

        console.log("routeAccess:", routeAccess);

        if (!routeAccess) {
          console.error("❌ ROUTE ACCESS DENIED");
          setIsAuthorized(false);
          setIsChecking(false);
          return;
        }

        console.log("✅ ALL CHECKS PASSED - Granting access");
        setIsAuthorized(true);
      } catch (error) {
        console.error("Access check failed:", error);
        setIsAuthorized(false);
        setIsChecking(false);
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
    userBusinessUnits,
    currentRole,
    currentBusinessUnit
  ]);

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

  if (!isAuthorized) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Unauthorized
          requiredRole={roleFromPath}
          requiredBusinessUnit={businessUnitFromPath}
          userRole={currentRole}
          userBusinessUnits={userBusinessUnits}
        />
      </div>
    );
  }

  // Prepare user data for UserMenu
  const userData = user ? {
    fullName: String(user.name || "User"),
    profileImg: String(user.avatar || ""),
    designation: "System User",
    role: String(currentRole || "User"),
    businessUnit: user.businessUnits?.map((u: any) => String(u.name)) || []
  } : {
    fullName: "Guest",
    profileImg: "",
    designation: "Guest",
    role: "Guest",
    businessUnit: []
  };

  // User is authorized, render the protected content
  return (
    <div className="min-h-screen bg-background">
      {/* Only show header switcher if we are inside a dashboard business unit route */}
      {children}
    </div>
  );
}
