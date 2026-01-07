"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter, usePathname, useSearchParams } from "next/navigation";
import { Bell, Search, Menu, Calculator, MonitorPlay, MapPin, ShieldAlert, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { UserMenu } from "./UserMenu";
import { Notifications } from "./Notifications";
import { BusinessUnitSwitcher } from "./BusinessUnitSwitcher";
import { CompanySwitcher } from "./CompanySwitcher";
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
import { useGetAllCompaniesQuery } from "@/redux/api/platform/companyApi";

interface DashboardHeaderProps {
  onMenuClick?: () => void;
}

export default function DashboardHeader({ onMenuClick }: DashboardHeaderProps = {}) {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const { currentRole } = useCurrentRole();

  // Robust Slug Extraction
  let businessUnitSlug = (params["business-unit"] || params.businessUnit) as string;
  let role = currentRole as string;

  // Handle [...slug] case for super-admin routes
  if (!businessUnitSlug && pathname.startsWith('/super-admin/')) {
    const segments = pathname.split('/');

    if (segments.length > 2) {
      businessUnitSlug = segments[2];
    }
  }

  // Robust Role Derivation (similar to Sidebar)
  if (!role) {
    if (pathname.startsWith('/super-admin')) {
      role = 'super-admin';
    }
  }
  const { user, setActiveBusinessUnit } = useAuth();

  const [isOpenRegisterOpen, setIsOpenRegisterOpen] = useState(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);

  // Determine Context
  const urlCompanyId = searchParams.get('company');
  let outletId = searchParams.get('outlet');

  // Fallback: Check pathname for /outlets/[id]
  if (!outletId && pathname.includes('/outlets/')) {
    const parts = pathname.split('/outlets/');
    if (parts.length > 1) {
      const potentialId = parts[1].split('/')[0]; // Handle /outlets/ID/edit etc.
      if (potentialId) outletId = potentialId;
    }
  }
  const isValidOutletId = outletId && outletId !== 'undefined' && outletId !== 'null' && outletId !== '[object Object]';
  const { data: outletData } = useGetOutletQuery(outletId, { skip: !isValidOutletId });

  // Fetch all units if Super Admin
  const isSuperAdmin = user?.isSuperAdmin || (user?.globalRoles || []).some((r: any) => {
    const rName = (typeof r === 'string' ? r : r.name).toLowerCase();
    return rName === 'super-admin' || rName === 'super_admin';
  });

  const { data: allBusinessUnits } = useGetBusinessUnitsQuery(
    isSuperAdmin && urlCompanyId ? { company: urlCompanyId } : undefined,
    { skip: !isSuperAdmin }
  );

  const { data: allCompanies } = useGetAllCompaniesQuery(undefined, {
    skip: !isSuperAdmin
  });

  // Normalize API data extraction
  const companies = Array.isArray(allCompanies) ? allCompanies : (allCompanies as any)?.data || (allCompanies as any)?.result || [];
  const businessUnits = Array.isArray(allBusinessUnits) ? allBusinessUnits : (allBusinessUnits as any)?.data || (allBusinessUnits as any)?.result || [];

  // Extract BUs from new Consumer Access Model or Context
  const contextAvailable = user?.context?.available || [];

  let uniqueUserBUs: any[] = [];

  if (contextAvailable.length > 0) {
    uniqueUserBUs = contextAvailable.map((ctx: any) => {
      const unit = ctx.businessUnit || ctx.company;
      return {
        ...unit,
        outlets: ctx.outlets || []
      };
    });
  } else {
    // Fallback to legacy businessAccess parsing
    const userBusinessUnits = (user?.businessAccess || [])
      .map((acc: any) => acc.businessUnit)
      .filter((bu: any) => bu);
    uniqueUserBUs = [...new Map(userBusinessUnits.map((bu: any) => [bu._id || bu.id, bu])).values()];
  }

  // Combine or select appropriate source of units
  let availableUnits = isSuperAdmin
    ? (businessUnits || [])
    : (uniqueUserBUs || []);

  // [NEW] Context Derivation: If no company in URL but in a BU, derive company from that BU
  const activeUnitFromUrl = availableUnits.find((u: any) => u.id === businessUnitSlug || u.slug === businessUnitSlug);
  const derivedCompanyId = activeUnitFromUrl?.company?._id || activeUnitFromUrl?.company;
  const effectiveCompanyId = urlCompanyId || derivedCompanyId;

  // Final Filter for available units (strictly by effective company)
  if (isSuperAdmin && effectiveCompanyId) {
    availableUnits = availableUnits.filter((u: any) =>
      u.company === effectiveCompanyId ||
      (typeof u.company === 'object' && u.company?._id === effectiveCompanyId)
    );
  }

  // console.log('HEADER DEBUG:', {
  //   isSuperAdmin,
  //   globalRoles: user?.globalRoles,
  //   businessAccessCount: user?.businessAccess?.length,
  //   contextAvailableCount: contextAvailable.length,
  //   availableUnitsCount: availableUnits?.length,
  // });

  // Sync active business unit from URL to Context (for API headers)
  useEffect(() => {
    if (businessUnitSlug) {
      const unit = availableUnits.find((u: any) => u.id === businessUnitSlug || u.slug === businessUnitSlug);

      if (unit && unit._id) {
        setActiveBusinessUnit(unit._id);
      }
    } else {
      setActiveBusinessUnit(null);
    }
  }, [businessUnitSlug, availableUnits, setActiveBusinessUnit]);

  // Global keyboard shortcut for Command Palette
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen(true);
      }
      if (e.key === 'F2') {
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

  const businessUnitName = businessUnitSlug ? businessUnitSlug.replace("-", " ") : "Dashboard";

  const handleNewSale = () => {
    // If we have a scoped business unit, use it.
    if (businessUnitSlug) {
      router.push(`/${businessUnitSlug}/sales/create`);
    }
  };

  const handleExitContext = () => {
    if (isSuperAdmin) {
      router.push('/global/dashboard');
    } else if (role === 'company-owner') {
      router.push('/global/dashboard');
    }
  };

  // Impersonation Banner Logic
  const isImpersonating = isSuperAdmin && effectiveCompanyId;
  const activeUnit = availableUnits.find((u: any) => u.id === businessUnitSlug || u.slug === businessUnitSlug);
  const activeCompany = companies?.find((c: any) => c._id === effectiveCompanyId);

  const impersonatedName = activeUnit?.name || activeCompany?.name || "Lower Context";
  const contextType = businessUnitSlug ? "Business Unit" : "Company";

  // [NEW] Get Current Company Modules for Header Visibility
  const { data: systemSettings } = useGetSystemSettingsQuery(undefined);
  const activeModules = (user as any)?.company?.activeModules || systemSettings?.enabledModules || {};

  return (
    <>
      <header
        className={cn(
          "sticky top-0 z-40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b"
        )}
      >
        {isImpersonating && (
          <div className="bg-amber-500/10 border-b border-amber-500/20 text-amber-600 px-4 py-1.5 text-[11px] font-medium flex items-center justify-center gap-2">
            <ShieldAlert className="h-3 w-3" />
            <span>
              Impersonation Mode: Acting as <strong>{impersonatedName}</strong> ({contextType} Context)
            </span>
            <button
              onClick={handleExitContext}
              className="ml-2 px-2 py-0.5 bg-amber-500 text-white rounded hover:bg-amber-600 transition-colors flex items-center gap-1"
            >
              <X className="h-3 w-3" />
              Exit
            </button>
          </div>
        )}
        <div className="flex h-16 items-center px-4 gap-4">

          {/* Left: Mobile Menu & Unit Switcher */}
          <div className="flex items-center gap-2 lg:min-w-[200px]">
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={onMenuClick}
              type="button"
            >
              <Menu className="h-5 w-5" />
            </Button>

            {/* 1. Company Switcher (Primary Context) */}
            {isSuperAdmin && (
              <CompanySwitcher
                currentCompanyId={effectiveCompanyId}
                companies={companies}
              />
            )}

            {/* 2. Business Unit Switcher (Sub-Context) */}
            {/* Show if: Not super-admin OR (Super Admin AND Company Picked) */}
            {(!isSuperAdmin || (isSuperAdmin && effectiveCompanyId)) && (
              <BusinessUnitSwitcher
                currentBusinessUnit={businessUnitSlug}
                effectiveCompanyId={effectiveCompanyId}
                currentRole={role}
                availableUnits={availableUnits}
              />
            )}
          </div>

          {/* Center: Search (POS Style) */}
          <div className="flex-1 flex justify-center items-center">
            <button
              onClick={() => setIsCommandPaletteOpen(true)}
              className="hidden lg:flex w-full max-w-sm relative items-center gap-2 px-3 h-9 bg-muted/50 border border-muted-foreground/20 rounded-md hover:bg-background transition-colors text-sm text-muted-foreground"
            >
              <Search className="h-4 w-4" />
              <span>Search products, pages...</span>
              <div className="ml-auto text-[10px] border px-1.5 rounded bg-background">Ctrl+K</div>
            </button>
          </div>

          {/* Right: Actions & User */}
          <div className="flex items-center justify-end gap-2 lg:min-w-[200px]">

            {/* POS Shortcut Actions - Only visible if POS module is active */}
            {activeModules.pos !== false && (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  className="hidden sm:flex gap-2 border-primary/20 hover:bg-primary/5 text-primary"
                  onClick={() => setIsOpenRegisterOpen(true)}
                  type="button"
                >
                  <Calculator className="w-4 h-4" />
                  <span className="hidden xl:inline">Open Register</span>
                </Button>

                <Button
                  variant="default"
                  size="sm"
                  className="hidden sm:flex gap-2 bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-600/20"
                  onClick={handleNewSale}
                  type="button"
                >
                  <MonitorPlay className="w-4 h-4" />
                  <span className="hidden xl:inline">Sale</span>
                </Button>
              </>
            )}

            <div className="h-6 w-px bg-border mx-1" />

            <div className="flex items-center gap-1">
              <ModeToggle />
              <Notifications />
              <UserMenu user={userData} />
            </div>
          </div>
        </div>
      </header>

      <OpenRegisterModal open={isOpenRegisterOpen} onOpenChange={setIsOpenRegisterOpen} />
      <CommandPalette open={isCommandPaletteOpen} onOpenChange={setIsCommandPaletteOpen} />
    </>
  );
}

