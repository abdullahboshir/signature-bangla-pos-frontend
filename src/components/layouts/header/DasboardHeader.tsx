"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter, usePathname, useSearchParams } from "next/navigation";
import { Bell, Search, Menu, Calculator, MonitorPlay, MapPin, ShieldAlert, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { UserMenu } from "./UserMenu";
import { Notifications } from "./Notifications";
import { BusinessUnitSwitcher } from "./BusinessUnitSwitcher";
import { OrganizationSwitcher } from "./OrganizationSwitcher";
import { OutletSwitcher } from "./OutletSwitcher";
import { cn } from "@/lib/utils";
import { ModeToggle } from "@/components/mode-toggle";
import { useAuth } from "@/hooks/useAuth";
import { Clock } from "@/components/shared/Clock";
import { NetworkStatus } from "@/components/shared/NetworkStatus";
import { OpenRegisterModal } from "@/components/pos/OpenRegisterModal";
import { useGetBusinessUnitsQuery } from "@/redux/api/organization/businessUnitApi";
import { CommandPalette } from "@/components/shared/CommandPalette";
import { useGetOutletQuery } from "@/redux/api/organization/outletApi";
import { useCurrentRole } from "@/hooks/useCurrentRole";
import { useGetSystemSettingsQuery } from "@/redux/api/system/settingsApi";
import { useGetAllOrganizationsQuery } from "@/redux/api/platform/organizationApi";
import {
  normalizeAuthString,
  USER_ROLES,
  isSuperAdmin as checkIsSuperAdminHelper,
  isOrganizationOwner as checkIsOrganizationOwnerHelper
} from "@/config/auth-constants";

interface DashboardHeaderProps {
  onMenuClick?: () => void;
}

export default function DashboardHeader({ onMenuClick }: DashboardHeaderProps = {}) {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const { currentRole } = useCurrentRole();
  const { user, setActiveBusinessUnit } = useAuth();

  const [isOpenRegisterOpen, setIsOpenRegisterOpen] = useState(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);

  // Robust Slug Extraction
  let businessUnitSlug = (params["business-unit"] || params.businessUnit) as string;
  let role = currentRole as string;

  if (!businessUnitSlug && pathname.startsWith('/super-admin/')) {
    const segments = pathname.split('/');
    if (segments.length > 2) businessUnitSlug = segments[2];
  }

  if (!role) {
    if (pathname.startsWith('/super-admin')) {
      role = USER_ROLES.SUPER_ADMIN;
    }
  }

  const urlCompanyId = searchParams.get('organization');
  let outletId = searchParams.get('outlet');

  if (!outletId && pathname.includes('/outlets/')) {
    const parts = pathname.split('/outlets/');
    if (parts.length > 1) {
      const potentialId = parts[1].split('/')[0];
      if (potentialId) outletId = potentialId;
    }
  }

  const isSuperAdmin = user?.isSuperAdmin || (user?.globalRoles || []).some((r: any) =>
    checkIsSuperAdminHelper(typeof r === 'string' ? r : r.slug || r.name)
  );

  const isOrganizationOwner = (user?.globalRoles || []).some((r: any) =>
    checkIsOrganizationOwnerHelper(typeof r === 'string' ? r : r.slug || r.name)
  ) || normalizeAuthString(role) === USER_ROLES.ORGANIZATION_OWNER;

  const { data: allOrganizations, isLoading: isOrganizationsLoading } = useGetAllOrganizationsQuery(undefined, {
    skip: !(isSuperAdmin || isOrganizationOwner)
  });

  const { data: systemSettings } = useGetSystemSettingsQuery(undefined);
  const isValidOutletId = outletId && outletId !== 'undefined' && outletId !== 'null' && outletId !== '[object Object]';
  const { data: outletData } = useGetOutletQuery(outletId as string, { skip: !isValidOutletId });

  const organizations = Array.isArray(allOrganizations) ? allOrganizations : (allOrganizations as any)?.data || (allOrganizations as any)?.result || [];
  const activeOutlet = outletData?.data || outletData || null;

  const contextAvailable = user?.context?.available || [];
  let uniqueUserBUs: any[] = [];
  if (contextAvailable.length > 0) {
    uniqueUserBUs = contextAvailable.map((ctx: any) => ({
      ...(ctx.businessUnit || ctx.organization),
      outlets: ctx.outlets || []
    }));
  } else {
    uniqueUserBUs = (user?.businessAccess || []).map((acc: any) => acc.businessUnit).filter(Boolean);
  }

  const { data: allBusinessUnits } = useGetBusinessUnitsQuery(
    (isSuperAdmin || isOrganizationOwner) && urlCompanyId ? { organization: urlCompanyId } : undefined,
    { skip: !(isSuperAdmin || isOrganizationOwner) }
  );

  const businessUnits = Array.isArray(allBusinessUnits) ? allBusinessUnits : (allBusinessUnits as any)?.data || (allBusinessUnits as any)?.result || [];
  const fullPotentialUnits = (isSuperAdmin || isOrganizationOwner) ? businessUnits : uniqueUserBUs;

  const activeUnitFromUrl = businessUnitSlug
    ? fullPotentialUnits.find((u: any) => u.id === businessUnitSlug || u.slug === businessUnitSlug || u._id?.toString() === businessUnitSlug)
    : null;

  // Determine if current route is a platform route or organization route
  const isGlobalRoute = pathname.startsWith('/platform');
  const isCompanyAdminRoute = pathname.startsWith('/organization');

  // Derive organization ID from active unit
  const derivedOrganizationId = activeUnitFromUrl?.organization
    ? (typeof activeUnitFromUrl.organization === 'object'
      ? (activeUnitFromUrl.organization._id?.toString() || activeUnitFromUrl.organization.id?.toString())
      : activeUnitFromUrl.organization?.toString())
    : null;

  // Get single organization ID if only one organization exists
  const singleOrganizationId = (organizations?.length === 1)
    ? (organizations[0]._id?.toString() || organizations[0].id?.toString())
    : null;

  const rawEffectiveOrganizationId = (isGlobalRoute && !urlCompanyId && isSuperAdmin)
    ? null
    : (urlCompanyId || derivedOrganizationId || (isOrganizationOwner ? (singleOrganizationId || localStorage.getItem('active-organization-id')) : null));

  const effectiveOrganizationId = (rawEffectiveOrganizationId && typeof rawEffectiveOrganizationId === 'object')
    ? (rawEffectiveOrganizationId._id?.toString() || rawEffectiveOrganizationId.id?.toString() || rawEffectiveOrganizationId.toString())
    : rawEffectiveOrganizationId?.toString();

  let availableUnits = (isSuperAdmin || isOrganizationOwner)
    ? (businessUnits || [])
    : (uniqueUserBUs || []);

  const activeUnit = businessUnitSlug
    ? availableUnits.find((u: any) =>
      u.id === businessUnitSlug || u.slug === businessUnitSlug || u._id?.toString() === businessUnitSlug
    )
    : null;

  if ((isSuperAdmin || isOrganizationOwner) && effectiveOrganizationId) {
    availableUnits = availableUnits.filter((u: any) => {
      const uOrganizationId = typeof u.organization === 'object'
        ? (u.organization._id?.toString() || u.organization.id?.toString())
        : u.organization?.toString();
      return uOrganizationId === effectiveOrganizationId;
    });
  }

  useEffect(() => {
    if (businessUnitSlug) {
      const unit = availableUnits.find((u: any) => u.id === businessUnitSlug || u.slug === businessUnitSlug);
      if (unit && unit._id) setActiveBusinessUnit(unit._id);
    } else {
      setActiveBusinessUnit(null);
    }
  }, [businessUnitSlug, availableUnits, setActiveBusinessUnit]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (((e.ctrlKey || e.metaKey) && e.key === 'k') || e.key === 'F2') {
        e.preventDefault();
        setIsCommandPaletteOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const globalRoleNames = (user?.globalRoles || []).map((r: any) => typeof r === 'string' ? r : (r?.name || "")).filter(Boolean);
  const scopedRoleNames = (user?.businessAccess || []).map((acc: any) => acc.role?.name).filter(Boolean);
  const allRoleNames = [...new Set([...globalRoleNames, ...scopedRoleNames])].join(", ");

  const userData: any = {
    fullName: typeof user?.name === 'string' ? user.name : (user?.name?.firstName ? `${user.name.firstName} ${user.name.lastName}` : (user?.fullName || "Staff")),
    profileImg: user?.profileImg || user?.avatar || "/avatars/01.png",
    designation: user?.designation || allRoleNames || "Staff",
    role: allRoleNames || "Staff",
    businessUnit: uniqueUserBUs.map((u: any) => u.name).filter(Boolean) || [],
  };

  const handleNewSale = () => { if (businessUnitSlug) router.push(`/${businessUnitSlug}/sales/create`); };

  const handleExitContext = () => {
    localStorage.removeItem('active-business-unit');
    setActiveBusinessUnit(null);
    if (isSuperAdmin) {
      router.push('/platform/dashboard');
    } else if (isOrganizationOwner || normalizeAuthString(role) === USER_ROLES.ORGANIZATION_OWNER) {
      router.push('/organization/dashboard');
    }
  };

  const isImpersonating = isSuperAdmin && effectiveOrganizationId;
  const activeOrganization = organizations?.find((c: any) => c._id === effectiveOrganizationId);
  const impersonatedName = activeUnit?.name || activeOrganization?.name || "Lower Context";
  const contextType = businessUnitSlug ? "Business Unit" : "All Units (Overview)";

  const outletModules = activeOutlet?.activeModules;
  const unitModules = activeUnit?.activeModules || activeUnit?.organization?.activeModules;
  const userModules = (user as any)?.organization?.activeModules;
  const activeModules = outletModules || unitModules || userModules || systemSettings?.enabledModules || {};

  return (
    <>
      <header className={cn("sticky top-0 z-40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b")}>
        {isImpersonating && (
          <div className="bg-amber-500/10 border-b border-amber-500/20 text-amber-600 px-4 py-1.5 text-[11px] font-medium flex items-center justify-center gap-2">
            <ShieldAlert className="h-3 w-3" />
            <span>Impersonation Mode: Acting as <strong>{impersonatedName}</strong> ({contextType} Context)</span>
            <button onClick={handleExitContext} className="ml-2 px-2 py-0.5 bg-amber-500 text-white rounded hover:bg-amber-600 transition-colors flex items-center gap-1">
              <X className="h-3 w-3" /> Exit
            </button>
          </div>
        )}
        <div className="flex h-16 items-center px-4 gap-4">
          <div className="flex items-center gap-2 lg:min-w-[200px]">
            <Button variant="ghost" size="icon" className="lg:hidden" onClick={onMenuClick} type="button">
              <Menu className="h-5 w-5" />
            </Button>
            {(isSuperAdmin || (organizations?.length > 1)) && (
              <OrganizationSwitcher currentCompanyId={effectiveOrganizationId} companies={organizations} />
            )}
            {effectiveOrganizationId && (
              <BusinessUnitSwitcher currentBusinessUnit={businessUnitSlug || 'all'} effectiveCompanyId={effectiveOrganizationId} currentRole={role} availableUnits={availableUnits} />
            )}
            {businessUnitSlug && (
              <OutletSwitcher currentBusinessUnitSlug={businessUnitSlug} effectiveCompanyId={effectiveOrganizationId} activeUnit={activeUnit || activeUnitFromUrl} />
            )}
          </div>
          <div className="flex-1 flex justify-center items-center px-4">
            {/* CONTEXT INDICATOR (Top Bar) */}
            {/* <div className="hidden md:flex items-center gap-2 text-sm text-muted-foreground bg-muted/30 px-3 py-1.5 rounded-full border border-border/40">
                <span className={cn("font-medium", effectiveCompanyId ? "text-foreground" : "")}>
                    {activeCompany?.name || "Platform"}
                </span>
                
                {activeUnit && (
                    <>
                        <span className="text-muted-foreground/60">/</span>
                        <span className={cn("font-medium", activeUnit ? "text-foreground" : "")}>
                            {activeUnit.name}
                        </span>
                    </>
                )}

                {activeOutlet && (
                    <>
                        <span className="text-muted-foreground/60">/</span>
                        <span className="flex items-center gap-1 font-semibold text-primary">
                            <MapPin className="h-3.5 w-3.5" />
                            {activeOutlet.name}
                        </span>
                    </>
                )}
            </div> */}

            <button onClick={() => setIsCommandPaletteOpen(true)} className="hidden lg:flex w-full ml-4 max-w-xs relative items-center gap-2 px-3 h-9 bg-muted/50 border border-muted-foreground/20 rounded-md hover:bg-background transition-colors text-sm text-muted-foreground">
              <Search className="h-4 w-4" />
              <span>Search...</span>
              <div className="ml-auto text-[10px] border px-1.5 rounded bg-background">Ctrl+K</div>
            </button>
          </div>
          <div className="flex items-center justify-end gap-2 lg:min-w-[200px]">
            {outletId && activeModules.pos !== false && (
              <>
                <Button variant="outline" size="sm" className="hidden sm:flex gap-2 border-primary/20 hover:bg-primary/5 text-primary" onClick={() => setIsOpenRegisterOpen(true)} type="button">
                  <Calculator className="w-4 h-4" /> <span className="hidden xl:inline">Open Register</span>
                </Button>
                <Button variant="default" size="sm" className="hidden sm:flex gap-2 bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-600/20" onClick={handleNewSale} type="button">
                  <MonitorPlay className="w-4 h-4" /> <span className="hidden xl:inline">Sale</span>
                </Button>
              </>
            )}
            <div className="h-6 w-px bg-border mx-1" />
            <div className="flex items-center gap-1">
              <ModeToggle /> <Notifications /> <UserMenu user={userData} />
            </div>
          </div>
        </div>
      </header>
      <OpenRegisterModal open={isOpenRegisterOpen} onOpenChange={setIsOpenRegisterOpen} />
      <CommandPalette open={isCommandPaletteOpen} onOpenChange={setIsCommandPaletteOpen} />
    </>
  );
}
