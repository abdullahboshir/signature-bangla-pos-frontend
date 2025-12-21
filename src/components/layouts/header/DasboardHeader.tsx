"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
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

interface HeaderProps {
  onMenuClick?: () => void;
  className?: string;
}

export function DasboardHeader({ onMenuClick, className }: HeaderProps) {
  const params = useParams();
  const router = useRouter();
  const businessUnitSlug = (params["business-unit"] || params.businessUnit) as string;
  const role = params.role as string;
  const { user, setActiveBusinessUnit } = useAuth(); // Destructure setActiveBusinessUnit

  const [isOpenRegisterOpen, setIsOpenRegisterOpen] = useState(false);

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
      // Find unit in available list
      // Note: API might return unit.id as slug or unit.slug. 
      // User.businessUnits has .id (slug).
      // Check both .id and .slug properties just in case.
      const unit = availableUnits.find((u: any) => u.id === businessUnitSlug || u.slug === businessUnitSlug);

      if (unit && unit._id) {
        setActiveBusinessUnit(unit._id);
      }
    } else {
      setActiveBusinessUnit(null);
    }
  }, [businessUnitSlug, availableUnits, setActiveBusinessUnit]);

  const userData: any = {
    fullName: typeof user?.name === 'string' ? user.name : (user?.name?.firstName ? `${user.name.firstName} ${user.name.lastName}` : (user?.fullName || "Staff")),
    profileImg: user?.profileImg || user?.avatar || "/avatars/01.png",
    designation: user?.designation || (user?.roles?.map((role: any) => typeof role === 'string' ? role : role.name).filter(Boolean).join(", ") || "Staff"),
    role: user?.roles?.map((role: any) => typeof role === 'string' ? role : role.name).filter(Boolean).join(", ") || "Staff",
    businessUnit: user?.businessUnits?.map((u: any) => u.name) || [],
  };

  const businessUnitName = businessUnitSlug ? businessUnitSlug.replace("-", " ") : "Dashboard";

  const handleNewSale = () => {
    router.push(`/${role}/${businessUnitSlug}/sales/create`);
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

          {/* Center: Search & Status (POS Style) */}
          <div className="flex-1 flex justify-center items-center gap-6">
            <div className="hidden md:flex items-center gap-2 bg-muted/40 px-3 py-1.5 rounded-full border tabular-nums">
              <Clock className="text-xs" />
              <div className="h-4 w-px bg-border" />
              <NetworkStatus className="w-2 h-2 text-[10px]" />
            </div>

            <div className="hidden lg:flex w-full max-w-sm relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Scan item or search..."
                className="pl-9 h-9 bg-muted/50 border-muted-foreground/20 focus-visible:bg-background focus-visible:ring-1 focus-visible:ring-ring"
              />
              <div className="absolute right-2 top-2 text-[10px] text-muted-foreground border px-1.5 rounded">F2</div>
            </div>
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
    </>
  );
}
