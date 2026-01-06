// components/layout/sidebar/Sidebar.tsx
"use client"

import { useState, useMemo, useEffect } from "react"
import { useParams, usePathname, useSearchParams } from "next/navigation"
import { cn } from "@/lib/utils"
import { getSidebarMenu } from "@/config/sidebar-menu"
import { Input } from "@/components/ui/input"
import { Search, ChevronLeft, ChevronRight } from "lucide-react"

import { useGetSystemSettingsQuery } from "@/redux/api/system/settingsApi"
import { SidebarMenu } from "./SidebarMenu"
import { SidebarHeader } from "./SidebarHeader"
import { useAuth } from "@/hooks/useAuth"
import { useCurrentRole } from "@/hooks/useCurrentRole"
import { checkIsSuperAdmin } from "@/lib/iam/permissions";
// import { SidebarFooter } from "./SidebarFooter"

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
  const { user } = useAuth()
  const { currentRole } = useCurrentRole();

  // Fetch System Settings for Feature Toggling
  const { data: systemSettings } = useGetSystemSettingsQuery(undefined);

  // Handle both "business-unit" and "businessUnit" params
  // Also handle "slug" array for [...slug] routes
  let businessUnit = (params["business-unit"] || params.businessUnit) as string

  // RESERVED GLOBAL MODULES (Should not be treated as Business Units)
  const RESERVED_PATHS = [
    "user-management",
    "finance",
    "reports",
    "support",
    "system",
    "logistics",
    "risk",
    "business-units",
    "settings",
    "profile"
  ];

  // Generic Fallback: Extract from Path if params missing
  // Pattern: /[role]/[business-unit]/...
  if (!businessUnit) {
    const segments = pathname.split('/').filter(Boolean); // Remove empty strings
    if (segments.length >= 2) {
      const firstSegment = segments[0];
      const secondSegment = segments[1];

      // Check if first segment looks like a role or context root
      // AND second segment is NOT a reserved global path
      if (
        !["auth", "global", "home", "api", "_next"].includes(firstSegment) &&
        !RESERVED_PATHS.includes(secondSegment)
      ) {
        businessUnit = secondSegment;
      }
    }
  }

  // FORCE GLOBAL CONTEXT if path starts with /global
  // This prevents accidental Business Unit Context leakage
  if (pathname.startsWith('/global')) {
    businessUnit = "";
  }

  // Derive role based on current auth state (Priority 1)
  let role = currentRole as string;

  // Fallback to params or path (Priority 2)
  if (!role) {
    if (params.role) {
      role = params.role as string;
    } else if (pathname.startsWith('/super-admin')) {
      role = 'super-admin';
    } else if (businessUnit) {
      // Default to business-admin for now when inside
      role = 'business-admin';
    }
  }

  // Resolve Outlet ID from Path or Query Params (for Context Persistence)
  const outletId = (params.outletId as string) || searchParams.get('outlet');

  // [NEW] Get Current Company Modules for Toggle Visibility
  // Safely access company from user object, fallback to System Global settings
  const activeModules = (user as any)?.company?.activeModules || systemSettings?.enabledModules || {};

  const rawMenuItems = getSidebarMenu(role, businessUnit || "", outletId as string)

  // 1. [CONFIG FILTER] Filter based on Company's Active Modules (Settings)
  // 1. [CONFIG FILTER] Filter based on Company's Active Modules (Settings)
  const configuredMenuItems = useMemo(() => {
    // Helper to recursively filter without mutation
    const filterByConfig = (items: any[]): any[] => {
      return items.reduce((acc: any[], item: any) => {
        // Module Toggle Check 🛡️
        if (item.module) {
          const moduleKey = item.module.toLowerCase(); // e.g. 'pos' from 'POS'
          // Strictly check for false. If undefined (legacy), allow it?
          // Or strictly check truthy?
          // Given our CompanyForm sets all keys, checking truthy is safer for correctness.
          // But strict false allows older records to work.
          // Let's use strict truthy check if we are confident, or activeModules[key] !== false.
          // Let's checking if explicitly disabled:
          if (activeModules[moduleKey] === false) {
            return acc;
          }
        }

        // Create shallow copy to avoid mutating original config
        const newItem = { ...item };

        if (newItem.children) {
          newItem.children = filterByConfig(newItem.children);
        }

        acc.push(newItem);
        return acc;
      }, []);
    };
    return filterByConfig(rawMenuItems);
  }, [rawMenuItems, activeModules]);








  // 2. [PERMISSION FILTER] Filter based on User Roles/Permissions
  const permittedMenuItems = useMemo(() => {
    if (!user) return [];

    const isSuperAdmin = checkIsSuperAdmin(user);

    // Fetch effective permissions
    let aggregatedPermissions: any[] = [];
    if ((user as any).effectivePermissions && Array.isArray((user as any).effectivePermissions)) {
      aggregatedPermissions = (user as any).effectivePermissions;
    } else if (user.permissions && Array.isArray(user.permissions)) {
      aggregatedPermissions = user.permissions;
    }

    const filterByPermission = (items: any[]): any[] => {
      try {
        return items.reduce((acc: any[], item: any) => {

          // [System Toggle Check - Redundant if configuredMenuItems works, but safe to keep]
          // Removing it here to rely on configuredMenuItems for simplicity and consistency

          let hasAccess = true;

          if (isSuperAdmin) {
            hasAccess = true;
          } else if (item.resource) {
            // Permission Checking Logic
            hasAccess = aggregatedPermissions.some((p: any) => {
              if (!p) return false;
              if (typeof p === 'string') {
                const resource = item.resource.toLowerCase();
                const action = item.action ? item.action.toLowerCase() : null;
                const pStr = p.toLowerCase();
                if (action) {
                  return pStr === `${resource}:${action}` || pStr === `${resource}_${action}` || pStr === `*`;
                }
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
              // Hide parent if all children are hidden
              if (item.children && newItem.children.length === 0) {
                hasAccess = false;
              }
            }
            if (hasAccess) acc.push(newItem);
          }
          return acc;
        }, []);
      } catch (err) {
        console.error("Sidebar filter error:", err);
        return [];
      }
    };

    return filterByPermission(configuredMenuItems);

  }, [configuredMenuItems, user]);


  // 3. [SEARCH FILTER] Final Output for Render
  const finalMenuItems = useMemo(() => {
    if (!searchQuery.trim()) return permittedMenuItems;

    const lowerQuery = searchQuery.toLowerCase();

    const searchFilter = (items: any[]): any[] => {
      return items.reduce((acc: any[], item: any) => {
        const title = item.title || "";
        const matchesTitle = title.toLowerCase().includes(lowerQuery);

        let matchingChildren = [];
        if (item.children) {
          matchingChildren = searchFilter(item.children);
        }

        // Keep item if it matches OR if it has matching children
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
    <div
      className={cn(
        "flex h-full flex-col border-r bg-background transition-all duration-300",
        isCollapsed ? "w-16" : "w-64",
        className
      )}
    >

      {!isCollapsed && (
        <div className="p-3 border-b">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search menu..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 h-9 text-sm"
            />
          </div>
        </div>
      )}


      <div className="flex-1 overflow-auto">
        <SidebarMenu
          items={finalMenuItems}
          isCollapsed={isCollapsed}
          onItemClick={onItemClick}
          currentPath={pathname}
          businessUnit={businessUnit}
          role={role}
        />
      </div>

      {/* Sidebar Footer with Collapse Toggle */}
      <div className="border-t p-3 flex justify-end">
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className={cn(
            "flex h-8 w-8 items-center justify-center rounded-md border text-muted-foreground hover:bg-accent hover:text-foreground transition-all",
            isCollapsed ? "mr-auto ml-auto" : ""
          )}
          title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
        >
          {isCollapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </button>
      </div>
    </div>
  )
}
