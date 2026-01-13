import { useState, useMemo, useEffect, useRef } from "react"
import { useParams, usePathname, useSearchParams } from "next/navigation"
import { cn } from "@/lib/utils"
import { getSidebarMenu } from "@/config/sidebar-menu"
import { OPERATIONAL_MODULES } from "@/config/module-registry"
import { Input } from "@/components/ui/input"
import { Search, ChevronLeft, ChevronRight } from "lucide-react"

import { useGetSystemSettingsQuery } from "@/redux/api/system/settingsApi"
import { useGetBusinessUnitsQuery } from "@/redux/api/organization/businessUnitApi";
import { useGetOutletQuery } from "@/redux/api/organization/outletApi";
import { SidebarMenu } from "./SidebarMenu"
import { useAuth } from "@/hooks/useAuth"
import { useCurrentRole } from "@/hooks/useCurrentRole"
import {
  normalizeAuthString,
  USER_ROLES,
  isSuperAdmin as checkIsSuperAdminHelper,
  isCompanyOwner as checkIsCompanyOwnerHelper
} from "@/config/auth-constants";

interface SidebarProps {
  className?: string
  onItemClick?: () => void
}

export function Sidebar({ className, onItemClick }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const params = useParams()
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const { user, isLoading: isUserLoading } = useAuth()
  const { currentRole } = useCurrentRole();

  // Cache the company owner status to prevent flicker during refetch
  const cachedCompanyOwnerRef = useRef<boolean>(false);
  const cachedSuperAdminRef = useRef<boolean>(false);

  // Fetch System Settings for Feature Toggling
  const { data: systemSettings } = useGetSystemSettingsQuery(undefined);

  // Handle both "business-unit" and "businessUnit" params
  let businessUnit = (params["business-unit"] || params.businessUnit) as string

  // RESERVED GLOBAL MODULES
  const RESERVED_PATHS = [
    "user-management", "finance", "reports", "support", "system",
    "logistics", "risk", "business-units", "settings", "profile", "dashboard"
  ];

  if (!businessUnit) {
    const segments = pathname.split('/').filter(Boolean);
    if (segments.length >= 1) {
      const firstSegment = segments[0];
      // const secondSegment = segments[1]; // Removed as it was causing the bug (skipping the slug)

      const GLOBAL_ROOTS = ["auth", "global", "home", "api", "_next", "favicon.ico"];

      // If the first segment is NOT a global root AND NOT a reserved module name,
      // then it must be the Business Unit slug (e.g. /my-shop/dashboard)
      if (
        !GLOBAL_ROOTS.includes(firstSegment) &&
        !RESERVED_PATHS.includes(firstSegment)
      ) {
        businessUnit = firstSegment;
      }
    }
  }

  if (pathname.startsWith('/global')) {
    businessUnit = "";
  }

  // Derive role based on current auth state (Priority 1)
  let role = currentRole as string;

  // Fallback to params or path (Priority 2)
  if (!role) {
    if (params.role) {
      role = normalizeAuthString(params.role as string);
    } else if (pathname.startsWith('/super-admin')) {
      role = USER_ROLES.SUPER_ADMIN;
    } else if (pathname.startsWith('/global')) {
      const isOwner = (user?.globalRoles || []).some((r: any) =>
        checkIsCompanyOwnerHelper(typeof r === 'string' ? r : r.slug || r.name)
      );
      role = isOwner ? USER_ROLES.COMPANY_OWNER : USER_ROLES.SUPER_ADMIN;
    }
    else if (businessUnit) {
      role = USER_ROLES.ADMIN;
    }
  }

  const outletId = (params.outletId as string) || searchParams.get('outlet');
  const companyId = searchParams.get('company');

  // Compute current values from user data
  const currentIsSuperAdmin = user?.isSuperAdmin || (user?.globalRoles || []).some((r: any) =>
    checkIsSuperAdminHelper(typeof r === 'string' ? r : r.slug || r.name)
  );

  const currentIsCompanyOwner = (user?.globalRoles || []).some((r: any) =>
    checkIsCompanyOwnerHelper(typeof r === 'string' ? r : r.slug || r.name)
  ) || (user?.businessAccess || []).some((acc: any) =>
    checkIsCompanyOwnerHelper(typeof acc.role === 'string' ? acc.role : acc.role?.slug || acc.role?.name) ||
    acc.scope === 'COMPANY'
  );

  // Update refs when user data is available (not loading)
  useEffect(() => {
    if (!isUserLoading && user) {
      cachedSuperAdminRef.current = currentIsSuperAdmin;
      cachedCompanyOwnerRef.current = currentIsCompanyOwner;
    }
  }, [isUserLoading, user, currentIsSuperAdmin, currentIsCompanyOwner]);

  // Use cached values during loading to prevent flicker
  const isSuperAdmin = isUserLoading ? cachedSuperAdminRef.current : currentIsSuperAdmin;
  const isCompanyOwner = isUserLoading ? cachedCompanyOwnerRef.current : currentIsCompanyOwner;

  console.log("isSuperAdmin", isSuperAdmin);

  // Both super_admin and company_owner need to fetch business units
  const canFetchAllUnits = isSuperAdmin || isCompanyOwner;

  const { data: allBusinessUnits } = useGetBusinessUnitsQuery(
    canFetchAllUnits && companyId ? { company: companyId } : undefined,
    { skip: !canFetchAllUnits }
  );

  const businessUnitsResult = Array.isArray(allBusinessUnits) ? allBusinessUnits : (allBusinessUnits as any)?.data || (allBusinessUnits as any)?.result || [];
  const contextAvailable = user?.context?.available || [];
  let uniqueUserBUs: any[] = [];

  if (contextAvailable.length > 0) {
    uniqueUserBUs = contextAvailable.map((ctx: any) => ({
      ...(ctx.businessUnit || ctx.company),
      outlets: ctx.outlets || []
    }));
  } else {
    const userBusinessUnits = (user?.businessAccess || []).map((acc: any) => acc.businessUnit).filter((bu: any) => bu);
    uniqueUserBUs = [...new Map(userBusinessUnits.map((bu: any) => [bu._id || bu.id, bu])).values()];
  }

  const availableUnits = canFetchAllUnits ? businessUnitsResult : uniqueUserBUs;
  const activeUnit = businessUnit
    ? availableUnits.find((u: any) =>
      u.id === businessUnit || u.slug === businessUnit || u._id?.toString() === businessUnit
    )
    : null;

  const { data: activeOutletData } = useGetOutletQuery(outletId as string, { skip: !outletId });
  const activeOutlet = activeOutletData?.data || activeOutletData || null;

  const outletModules = activeOutlet?.activeModules;
  const unitModules = activeUnit?.activeModules || activeUnit?.company?.activeModules;
  const userModules = (user as any)?.company?.activeModules;
  const activeModules = outletModules || unitModules || userModules || systemSettings?.enabledModules || {};

  // Dynamic Context Switching:
  // If Company Owner enters a Business Unit (e.g. /business-units/xyz), 
  // they should see the 'Business Admin' menu (Outlets, POS, Inventory), 
  // not the high-level Company Owner menu (Governance, Shares).
  let menuRole = role;
  const isOwnerContext = isCompanyOwner || role === 'company-owner' || role === 'owner' || role === USER_ROLES.COMPANY_OWNER;

  if (isOwnerContext && businessUnit) {
    menuRole = 'business-admin';
  }


  const rawMenuItems = getSidebarMenu(menuRole, businessUnit || "", outletId as string, companyId)

  const configuredMenuItems = useMemo(() => {
    const filterByConfig = (items: any[]): any[] => {
      return items.reduce((acc: any[], item: any) => {
        if (item.module) {
          const moduleKey = item.module.toLowerCase();

          // Relaxed: Business Admin also gets access to operational modules regardless of global toggle (often misconfigured)
          // Fix: Company Owner string check should grant FULL access (like Super Admin), not restricted whitelist
          console.log("role", role);
          const isOwnerRole = ['company-owner', 'owner', USER_ROLES.COMPANY_OWNER].includes(role);
          const bypassRoles = ['business-admin', 'store-manager', 'admin', 'manager', 'staff'];

          // [STRICT] Even Owners/Admins should follow context-level module gating for operational clarity
          // Only Super Admin should have absolute bypass for debugging/config
          if (!isSuperAdmin && activeModules[moduleKey] === false) {
            return acc;
          }

          const hasFullModuleAccess = isCompanyOwner || isSuperAdmin || isOwnerRole ||
            (bypassRoles.includes(role) && OPERATIONAL_MODULES.includes(moduleKey));
        }
        const newItem = { ...item };
        if (newItem.children) {
          newItem.children = filterByConfig(newItem.children);
        }
        acc.push(newItem);
        return acc;
      }, []);
    };
    return filterByConfig(rawMenuItems);
  }, [rawMenuItems, activeModules, role, isCompanyOwner, isSuperAdmin]);


  const permittedMenuItems = useMemo(() => {
    if (!user && !isUserLoading) return [];
    // Use the cached/stable values calculated above
    const isSuperAdminUser = isSuperAdmin;
    const isCompanyOwnerUser = isCompanyOwner || role === 'company-owner' || role === 'owner' || role === USER_ROLES.COMPANY_OWNER;
    const aggregatedPermissions = (user as any)?.effectivePermissions || user?.permissions || [];

    const filterByPermission = (items: any[]): any[] => {
      try {
        return items.reduce((acc: any[], item: any) => {
          let hasAccess = true;
          // Super Admin and Company Owner          // Relaxed: Business Admin also gets access to operational modules
          const moduleKey = item.module ? item.module.toLowerCase() : '';
          const bypassRoles = ['business-admin', 'store-manager', 'admin', 'manager', 'staff']; // Added safe fallback roles
          const isOperationalBypass = bypassRoles.includes(role) &&
            OPERATIONAL_MODULES.includes(moduleKey);

          if (role === 'company-owner' || role === 'owner') {
            console.log(`[Access] Module: ${moduleKey} | Role: ${role} | OwnerAccess: ${isCompanyOwnerUser} | Bypass: ${isOperationalBypass} -> GRANTED`);
          }

          if (isSuperAdminUser || isCompanyOwnerUser || isOperationalBypass) {
            hasAccess = true;
          } else if (item.resource) {
            hasAccess = aggregatedPermissions.some((p: any) => {
              if (!p) return false;
              if (typeof p === 'string') {
                const resource = item.resource.toLowerCase();
                const action = item.action ? item.action.toLowerCase() : null;
                const pStr = p.toLowerCase();
                if (action) return pStr === `${resource}:${action}` || pStr === `${resource}_${action}` || pStr === `*`;
                return pStr.startsWith(`${resource}:`) || pStr.startsWith(`${resource}_`) || pStr === resource;
              }
              const permResource = p.resource || p.source || p.module;
              const permAction = p.action;
              const normalize = (s: string) => s ? s.toLowerCase().replace(/[^a-z0-9]/g, '') : '';
              const resourceMatch = normalize(permResource) === normalize(item.resource) || permResource === '*';
              const actionMatch = item.action ? (permAction === item.action || permAction === '*') : true;
              return resourceMatch && actionMatch;
            });
          }

          if (hasAccess) {
            const newItem = { ...item };
            if (newItem.children) {
              newItem.children = filterByPermission(newItem.children);
              if (item.children && newItem.children.length === 0) hasAccess = false;
            }
            if (hasAccess) acc.push(newItem);
          }
          return acc;
        }, []);
      } catch (err) {
        return [];
      }
    };
    return filterByPermission(configuredMenuItems);
  }, [configuredMenuItems, user, isSuperAdmin, isCompanyOwner, isUserLoading]);


  const finalMenuItems = useMemo(() => {
    if (!searchQuery.trim()) return permittedMenuItems;
    const lowerQuery = searchQuery.toLowerCase();
    const searchFilter = (items: any[]): any[] => {
      return items.reduce((acc: any[], item: any) => {
        const title = item.title || "";
        const matchesTitle = title.toLowerCase().includes(lowerQuery);
        let matchingChildren = [];
        if (item.children) matchingChildren = searchFilter(item.children);
        if (matchesTitle || matchingChildren.length > 0) {
          acc.push({
            ...item,
            children: matchingChildren.length > 0 ? matchingChildren : (matchesTitle ? item.children : [])
          });
        }
        return acc;
      }, []);
    };
    return searchFilter(permittedMenuItems);
  }, [permittedMenuItems, searchQuery]);

  return (
    <div className={cn("flex h-full flex-col border-r bg-background transition-all duration-300", isCollapsed ? "w-16" : "w-64", className)}>
      {!isCollapsed && (
        <div className="p-3 border-b">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search menu..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-8 h-9 text-sm" />
          </div>
        </div>
      )}
      <div className="flex-1 overflow-auto">
        <SidebarMenu items={finalMenuItems} isCollapsed={isCollapsed} onItemClick={onItemClick} currentPath={pathname} businessUnit={businessUnit} role={role} />
      </div>
      <div className="border-t p-3 flex justify-end">
        <button onClick={() => setIsCollapsed(!isCollapsed)} className={cn("flex h-8 w-8 items-center justify-center rounded-md border text-muted-foreground hover:bg-accent hover:text-foreground transition-all", isCollapsed ? "mr-auto ml-auto" : "")} title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}>
          {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </button>
      </div>
    </div>
  )
}
