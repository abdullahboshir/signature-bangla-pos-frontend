"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter, usePathname } from "next/navigation";
import { Bell, Search, Menu, Calculator, MonitorPlay } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { UserMenu } from "./UserMenu";
import { Notifications } from "./Notifications";
import { BusinessUnitSwitcher } from "./BusinessUnitSwitcher";
import { cn } from "@/lib/utils";
import { ModeToggle } from "@/components/mode-toggle";
import { useAuth } from "@/hooks/useAuth";
import { Clock } from "@/components/shared/Clock";
import { NetworkStatus } from "@/components/shared/NetworkStatus";
import { OpenRegisterModal } from "@/components/pos/OpenRegisterModal";
import { useGetBusinessUnitsQuery } from "@/redux/api/businessUnitApi";
import { CommandPalette } from "@/components/shared/CommandPalette";

interface HeaderProps {
  onMenuClick?: () => void;
  className?: string;
}

export function DasboardHeader({ onMenuClick, className }: HeaderProps) {
  const params = useParams();
  const router = useRouter();
  const pathname = usePathname(); // Correct Next.js Hook

  // Robust Slug Extraction
  let businessUnitSlug = (params["business-unit"] || params.businessUnit) as string;
  let role = params.role as string;

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

  // Fetch all units if Super Admin
  const isSuperAdmin = user?.roles?.includes('super-admin') || user?.isSuperAdmin;
  const { data: allBusinessUnits } = useGetBusinessUnitsQuery(undefined, {
    skip: !isSuperAdmin
  });

  // Combine or select appropriate source of units
  const availableUnits = isSuperAdmin
    ? (allBusinessUnits || [])
    : (user?.businessUnits || []);

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

  const userData: any = {
    fullName: typeof user?.name === 'string' ? user.name : (user?.name?.firstName ? `${user.name.firstName} ${user.name.lastName}` : (user?.fullName || "Staff")),
    profileImg: user?.profileImg || user?.avatar || "/avatars/01.png",
    designation: user?.designation || (user?.roles?.map((role: any) => typeof role === 'string' ? role : role.name).filter(Boolean).join(", ") || "Staff"),
    role: user?.roles?.map((role: any) => typeof role === 'string' ? role : role.name).filter(Boolean).join(", ") || "Staff",
    businessUnit: user?.businessUnits?.map((u: any) => u.name) || [],
  };

  const businessUnitName = businessUnitSlug ? businessUnitSlug.replace("-", " ") : "Dashboard";

  const handleNewSale = () => {
    // If we have a scoped business unit, use it.
    if (businessUnitSlug) {
      router.push(`/${role}/${businessUnitSlug}/sales/create`);
    } else {
      // If Global Super Admin context, route to global sales create
      // Assuming /super-admin/sales/create is a valid route
      const targetRole = role || 'super-admin'; // Fallback
      router.push(`/${targetRole}/sales/create`);
    }
  };

  return (
    <>
      <header
        className={cn(
          "sticky top-0 z-40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b",
          className
        )}
      >
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

            <BusinessUnitSwitcher
              currentBusinessUnit={businessUnitSlug}
              currentRole={role}
              availableUnits={availableUnits}
            />
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
              <span className="hidden xl:inline">New Sale</span>
            </Button>

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
