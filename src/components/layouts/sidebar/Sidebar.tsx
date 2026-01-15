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

  // Cache settings to prevent flicker during refetch
  const cachedCompanyOwnerRef = useRef<boolean>(false);
  const cachedSuperAdminRef = useRef<boolean>(false);

  // Fetch System Settings
  const { data: systemSettings } = useGetSystemSettingsQuery(undefined);

  // 1. Resolve Business Unit Context
  let businessUnit = (params["business-unit"] || params.businessUnit) as string

  const RESERVED_PATHS = [
    "user-management", "finance", "reports", "support", "system",
    "logistics", "risk", "business-units", "settings", "profile", "dashboard"
  ];

  // Detect if we're on company-admin route
  const isCompanyAdminRoute = pathname.startsWith('/company-admin');

  if (!businessUnit) {
    const segments = pathname.split('/').filter(Boolean);
    if (segments.length >= 1) {
      const firstSegment = segments[0];
      const GLOBAL_ROOTS = ["auth", "global", "company-admin", "home", "api", "_next", "favicon.ico"];

      if (
        !GLOBAL_ROOTS.includes(firstSegment) &&
        !RESERVED_PATHS.includes(firstSegment)
      ) {
        businessUnit = firstSegment;
      }
    }
  }

  if (pathname.startsWith('/global') || pathname.startsWith('/company-admin')) {
    businessUnit = "";
  }

  const outletId = (params.outletId as string) || searchParams.get('outlet');
  const companyId = searchParams.get('company');

  // 2. Identify Roles & Scopes Robustly
  const currentIsSuperAdmin = !!(user?.isSuperAdmin || (user?.globalRoles || []).some((r: any) =>
    checkIsSuperAdminHelper(typeof r === 'string' ? r : r.slug || r.name)
  ));

  const currentIsCompanyOwner = !!((user?.globalRoles || []).some((r: any) =>
    checkIsCompanyOwnerHelper(typeof r === 'string' ? r : r.slug || r.name)
  ) || (user?.businessAccess || []).some((acc: any) =>
    checkIsCompanyOwnerHelper(typeof acc.role === 'string' ? acc.role : acc.role?.slug || acc.role?.name) ||
    acc.scope === 'COMPANY'
  ));

  // Determine Active Role
  let role = currentRole as string;
  if (!role) {
    if (pathname.startsWith('/global')) {
      // Global route is only for super-admin/platform users
      role = USER_ROLES.SUPER_ADMIN;
    } else if (pathname.startsWith('/company-admin')) {
      // Company-admin route is for company owners
      role = USER_ROLES.COMPANY_OWNER;
    } else if (businessUnit) {
      role = USER_ROLES.ADMIN;
    }
  }

  // Update refs when user data is available
  useEffect(() => {
    if (!isUserLoading && user) {
      cachedSuperAdminRef.current = currentIsSuperAdmin;
      cachedCompanyOwnerRef.current = currentIsCompanyOwner;
    }
  }, [isUserLoading, user, currentIsSuperAdmin, currentIsCompanyOwner]);

  const isSuperAdmin = isUserLoading ? cachedSuperAdminRef.current : currentIsSuperAdmin;
  const isCompanyOwner = isUserLoading ? cachedCompanyOwnerRef.current : currentIsCompanyOwner;

  // 3. Fetch Contextual Data (Business Units / Outlets)
  const canFetchAllUnits = isSuperAdmin || isCompanyOwner;
  const { data: allBusinessUnits } = useGetBusinessUnitsQuery(
    canFetchAllUnits && companyId ? { company: companyId } : undefined,
    { skip: !canFetchAllUnits }
  );

  const businessUnitsResult = Array.isArray(allBusinessUnits) ? allBusinessUnits : (allBusinessUnits as any)?.data || [];
  const contextAvailable = user?.context?.available || [];
  let availableUnits: any[] = [];

  if (canFetchAllUnits) {
    availableUnits = businessUnitsResult;
  } else if (contextAvailable.length > 0) {
    availableUnits = contextAvailable.map((ctx: any) => ({
      ...(ctx.businessUnit || ctx.company),
      outlets: ctx.outlets || []
    }));
  } else {
    const userBUs = (user?.businessAccess || []).map((acc: any) => acc.businessUnit).filter(Boolean);
    availableUnits = [...new Map(userBUs.map((bu: any) => [bu._id || bu.id, bu])).values()];
  }

  const activeUnit = businessUnit
    ? availableUnits.find((u: any) => u.id === businessUnit || u.slug === businessUnit || u._id?.toString() === businessUnit)
    : null;

  const { data: activeOutletData } = useGetOutletQuery(outletId as string, { skip: !outletId });
  const activeOutlet = activeOutletData?.data || activeOutletData || null;

  // 4. Resolve Active Modules for Filtering
  const outletModules = activeOutlet?.activeModules;
  const unitModules = activeUnit?.activeModules || activeUnit?.company?.activeModules;
  const userModules = (user as any)?.company?.activeModules;
  const activeModules = outletModules || unitModules || userModules || systemSettings?.enabledModules || {};

  // 5. Menu Generation
  const isOwnerContext = isCompanyOwner || role === USER_ROLES.COMPANY_OWNER || role === 'owner';
  let menuRole = (isOwnerContext && businessUnit) ? 'business-admin' : role;

  const rawMenuItems = getSidebarMenu(menuRole, businessUnit || "", outletId as string, companyId, isCompanyAdminRoute);

  // 6. Filter Menu Items by Module configuration
  const configuredMenuItems = useMemo(() => {
    const filterByConfig = (items: any[]): any[] => {
      return items.reduce((acc: any[], item: any) => {
        if (item.module) {
          const moduleKey = item.module.toLowerCase();
          // Hide item if specifically disabled in current context
          if (!isSuperAdmin && activeModules[moduleKey] === false) {
            return acc;
          }
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
  }, [rawMenuItems, activeModules, isSuperAdmin]);

  // 7. Filter Menu Items by Permissions
  const permittedMenuItems = useMemo(() => {
    if (!user && !isUserLoading) return [];
    const isSuperAdminUser = isSuperAdmin;
    const isCompanyOwnerUser = isCompanyOwner || role === USER_ROLES.COMPANY_OWNER || role === 'owner';
    const effectivePermissions = (user as any)?.effectivePermissions || [];

    const filterByPermission = (items: any[]): any[] => {
      return items.reduce((acc: any[], item: any) => {
        let hasAccess = false;
        const moduleKey = item.module ? item.module.toLowerCase() : '';
        const bypassRoles = ['business-admin', 'store-manager', 'admin', 'manager'];
        const isOperationalBypass = bypassRoles.includes(role) && OPERATIONAL_MODULES.includes(moduleKey);

        if (isSuperAdminUser || isCompanyOwnerUser || isOperationalBypass) {
          hasAccess = true;
        } else if (item.resource) {
          const resource = item.resource.toLowerCase();
          const action = (item.action || 'read').toLowerCase();
          hasAccess = effectivePermissions.some((p: string) => {
            const pLower = p.toLowerCase();
            return pLower === `${resource}:${action}` || pLower === `*` || (pLower === resource && !action);
          });
        } else {
          hasAccess = true; // No resource key = public/generic
        }

        if (hasAccess) {
          const newItem = { ...item };
          if (newItem.children) {
            newItem.children = filterByPermission(newItem.children);
            // Hide parent if it has children defined but none are accessible
            if (item.children && item.children.length > 0 && newItem.children.length === 0) {
              hasAccess = false;
            }
          }
          if (hasAccess) acc.push(newItem);
        }
        return acc;
      }, []);
    };
    return filterByPermission(configuredMenuItems);
  }, [configuredMenuItems, user, isSuperAdmin, isCompanyOwner, isUserLoading, role]);

  // 8. Search Filtering
  const finalMenuItems = useMemo(() => {
    if (!searchQuery.trim()) return permittedMenuItems;
    const lowerQuery = searchQuery.toLowerCase();
    const searchFilter = (items: any[]): any[] => {
      return items.reduce((acc: any[], item: any) => {
        const matchesTitle = (item.title || "").toLowerCase().includes(lowerQuery);
        let matchingChildren: any[] = [];
        if (item.children) matchingChildren = searchFilter(item.children);
        
        if (matchesTitle || matchingChildren.length > 0) {
          acc.push({
            ...item,
            children: matchingChildren
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
        <button onClick={() => setIsCollapsed(!isCollapsed)} className={cn("flex h-8 w-8 items-center justify-center rounded-md border text-muted-foreground hover:bg-accent hover:text-foreground transition-all", isCollapsed ? "mx-auto" : "")} title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}>
          {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </button>
      </div>
    </div>
  )
}
