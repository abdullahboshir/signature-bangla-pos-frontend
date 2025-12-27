// components/layout/sidebar/Sidebar.tsx
"use client"

import { useState, useMemo } from "react"
import { useParams, usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { getSidebarMenu } from "@/config/sidebar-menu"
import { Input } from "@/components/ui/input"
import { Search, ChevronLeft, ChevronRight } from "lucide-react"

import { useGetSystemSettingsQuery } from "@/redux/api/settingsApi"
import { SidebarMenu } from "./SidebarMenu"
import { SidebarHeader } from "./SidebarHeader"
import { useAuth } from "@/hooks/useAuth"
// import { SidebarFooter } from "./SidebarFooter"

interface SidebarProps {
  className?: string
  onItemClick?: () => void
}

export function Sidebar({ className, onItemClick }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const params = useParams()
  const pathname = usePathname()
  const { user } = useAuth()

  // Fetch System Settings for Feature Toggling
  const { data: systemSettings } = useGetSystemSettingsQuery(undefined);

  // Handle both "business-unit" and "businessUnit" params
  // Also handle "slug" array for [...slug] routes
  let businessUnit = (params["business-unit"] || params.businessUnit) as string

  // If we are in super-admin/[slug] route, extracting from slug or path
  if (!businessUnit && pathname.startsWith('/super-admin/')) {
    const segments = pathname.split('/');
    // /super-admin/nokhshangon -> ["", "super-admin", "nokhshangon"]
    if (segments.length > 2) {
      businessUnit = segments[2];
    }
  }

  // Derive role based on path or params
  let role = params.role as string
  if (!role) {
    if (pathname.startsWith('/super-admin')) {
      role = 'super-admin'
    } else if (businessUnit) {
      // Default to business-admin for now when inside a BU dashboard
      role = 'business-admin'
      // BUT: If the user IS super-admin (from auth), we should check that too?
      // Actually, Sidebar.tsx derives role from URL usually.
      // If we are super-admin visiting a BU, we want role='super-admin' PASSED to getSidebarMenu,
      // but getSidebarMenu handles context switching internally if businessUnit is passed.
      // Wait, let's look at getSidebarMenu Logic:
      // if (role === 'super-admin' && businessUnit) -> returns business-admin menu.

      // So 'role' here MUST be 'super-admin' if the URL starts with /super-admin.
      // My logic line 38 sets role = 'super-admin'.
      // So if businessUnit is found, it will work.
    }
  }


  const rawMenuItems = getSidebarMenu(role, businessUnit || "")



  // Filter menu items based on permissions
  const menuItems = useMemo(() => {
    if (!user) return [];

    const isSuperAdmin =
      user.isSuperAdmin ||
      user.roles?.some((r: any) =>
        (typeof r === 'string' && r === 'super-admin') ||
        (r?.name === 'super-admin') ||
        (r?.slug === 'super-admin')
      ) ||
      (Array.isArray(user.role) && user.role.some((r: any) => typeof r === 'string' && r.toLowerCase() === 'super-admin')) ||
      (typeof user.role === 'string' && (user.role as string).toLowerCase() === 'super-admin');

    // Flatten permissions from roles
    // Scoped Permissions Logic
    const currentUnitSlug = params["business-unit"] || params.businessUnit;
    const currentUnitId = user.businessUnits?.find((u: any) => u.id === currentUnitSlug)?._id;

    let aggregatedPermissions: any[] = [];

    if (user.permissions && Array.isArray(user.permissions) && user.permissions.length > 0) {
      // New Scoped RBAC
      const scopedAssignments = user.permissions.filter((p: any) =>
        p.scopeType === 'global' ||
        (p.scopeType === 'business-unit' && p.scopeId === currentUnitId)
      );

      aggregatedPermissions = scopedAssignments.flatMap((p: any) => p.role?.permissions || []);
    } else {
      // Fallback to Legacy Roles
      aggregatedPermissions = user.roles && Array.isArray(user.roles)
        ? user.roles.flatMap((role: any) => role.permissions || [])
        : [];
    }

    // Recursive filter function that returns new array
    const filterItems = (items: any[]): any[] => {
      try {
        return items.reduce((acc: any[], item: any) => {

          // 0. 🏁 Feature Toggle / Module Check
          if (item.module && systemSettings?.enabledModules) {
            const moduleKey = item.module.toLowerCase();
            // Check if specifically disabled
            if (systemSettings.enabledModules[moduleKey] === false) { // Strict check for false
              return acc; // Skip this item
            }
          }

          // 1. Check direct permission
          let hasAccess = true;

          if (isSuperAdmin) {
            hasAccess = true;
          } else if (item.resource) {
            // Logic adapted from role-validator.ts
            hasAccess = aggregatedPermissions.some((p: any) => {
              if (!p) return false;
              // Support both string IDs (legacy) and Object permissions
              if (typeof p === 'string') {
                const resource = item.resource.toUpperCase();
                const action = item.action ? item.action.toUpperCase() : null;
                return action ? p === `${resource}_${action}` : p.startsWith(`${resource}_`);
              }

              // Support Object Structure { resource, action }
              const permResource = p.resource || p.source || p.module; // Robust check
              const permAction = p.action;

              // 🟢 FIX 1: Loose Resource Matching (normalize case and separators)
              // This fixes issues like 'ad-campaign' vs 'adCampaign'
              const normalize = (s: string) => s ? s.toLowerCase().replace(/[^a-z0-9]/g, '') : '';

              const resourceMatch =
                normalize(permResource) === normalize(item.resource) ||
                permResource === '*';

              // If item has no action, view access usually sufficient or just resource match
              const actionMatch = item.action
                ? (permAction === item.action || permAction === '*')
                : true;

              return resourceMatch && actionMatch;
            });
          }

          // 2. Process children
          if (hasAccess) {
            const newItem = { ...item };

            if (newItem.children) {
              newItem.children = filterItems(newItem.children);

              // 🟢 FIX 2: Strict Parent Hiding
              // If item was a Group (had children), but all children were filtered out, 
              // we MUST hide the parent, even if it had a path.
              // We check 'item.children' (original) to know if it STARTED as a group.
              if (item.children && newItem.children.length === 0) {
                hasAccess = false;
              }
            }

            if (hasAccess) {
              acc.push(newItem);
            }
          }

          return acc;
        }, []);
      } catch (err) {
        console.error("Sidebar filter error:", err);
        return [];
      }
    };

    return filterItems(rawMenuItems);

  }, [rawMenuItems, user, systemSettings]);


  // 🔍 Search Filter Logic
  const filteredMenuItems = useMemo(() => {
    if (!searchQuery.trim()) return menuItems;

    const lowerQuery = searchQuery.toLowerCase();

    const searchFilter = (items: any[]): any[] => {
      return items.reduce((acc: any[], item: any) => {
        const matchesTitle = item.title.toLowerCase().includes(lowerQuery);

        let matchingChildren = [];
        if (item.children) {
          matchingChildren = searchFilter(item.children);
        }

        // Keep item if it matches OR if it has matching children
        if (matchesTitle || matchingChildren.length > 0) {
          acc.push({
            ...item,
            // If parent matches but children don't, show original children? 
            // Usually we show what matched. If parent matched, strict search implies showing children?
            // Let's keep children that matched. If parent matches, maybe show all children? 
            // For now, simpler: Show matched hierarchy.
            children: matchingChildren.length > 0 ? matchingChildren : (matchesTitle ? item.children : [])
          });
        }
        return acc;
      }, []);
    };

    return searchFilter(menuItems);
  }, [menuItems, searchQuery]);





  return (
    <div
      className={cn(
        "flex h-full flex-col border-r bg-background transition-all duration-300",
        isCollapsed ? "w-16" : "w-64",
        className
      )}
    >
      {/* Sidebar Header - Uncomment if needed to show active unit in sidebar top */}
      {/* <SidebarHeader 
        businessUnit={businessUnit}
        isCollapsed={isCollapsed}
      /> */}

      {/* Search Input Area */}
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
          items={filteredMenuItems}
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