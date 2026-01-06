"use client";

import { useAuth } from "@/hooks/useAuth";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRouter, usePathname } from "next/navigation";
import { useGetOutletsQuery } from "@/redux/api/organization/outletApi";
import { useState, useEffect } from "react";
import { Store } from "lucide-react";

interface BusinessUnitSwitcherProps {
  currentBusinessUnit: string;
  currentRole: string;
  availableUnits: any[];
}

export function BusinessUnitSwitcher({ currentBusinessUnit, currentRole, availableUnits }: BusinessUnitSwitcherProps) {
  const router = useRouter();
  const { setActiveBusinessUnit } = useAuth();
  const [activeOutletId, setActiveOutletId] = useState<string | null>(null);

  const activeUnit = availableUnits.find((u: any) => u.id === currentBusinessUnit || u.slug === currentBusinessUnit || u._id === currentBusinessUnit);

  const activeUnitId = activeUnit?._id || activeUnit?.id || activeUnit?.slug;
  // Check if active unit already has outlets (from filtered context)
  const preloadedOutlets = activeUnit?.outlets;
  const hasPreloadedOutlets = Array.isArray(preloadedOutlets) && preloadedOutlets.length > 0;

  // Fetch outlets for the active business unit if not preloaded
  // Skip if no active unit OR if we already have preloaded outlets
  const { data: outletsData, isLoading: loadingOutlets } = useGetOutletsQuery(
    { businessUnit: activeUnitId },
    { skip: !activeUnitId || hasPreloadedOutlets }
  );

  // handled by createCrudApi transformList, so outletsData should be the array
  // Priority: Preloaded (Filtered) > API Data (Full List)
  const outlets = hasPreloadedOutlets
    ? preloadedOutlets
    : (Array.isArray(outletsData) ? outletsData : (outletsData?.data || outletsData?.result || []));

  const pathname = usePathname();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    let outletId = params.get('outlet');

    if (!outletId && pathname?.includes('/outlets/')) {
      const parts = pathname.split('/outlets/');
      if (parts.length > 1) {
        outletId = parts[1].split('/')[0];
      }
    }

    if (outletId) {
      setActiveOutletId(outletId);
    } else {
      setActiveOutletId(null);
    }

    if (activeUnit && activeUnit._id) {
      localStorage.setItem("active-business-unit", activeUnit._id);
    }
  }, [activeUnit, pathname]);

  const handleSwitchUnit = (unitId: string) => {
    const unit = availableUnits.find((u: any) => u.id === unitId || u.slug === unitId || u._id === unitId);

    if (unit) {
      // Update Context
      if (unit._id) {
        setActiveBusinessUnit(unit._id);
        localStorage.setItem("active-business-unit", unit._id);
      }

      // Reset Outlet when switching Unit
      setActiveOutletId(null);
      localStorage.removeItem("active-outlet-id");

      // Redirect
      const targetSlug = unit.slug || unit.id;
      router.push(`/${targetSlug}/dashboard`);
    }
  };

  const handleSwitchOutlet = (outletId: string) => {
    const targetSlug = activeUnit?.slug || activeUnit?.id || currentBusinessUnit;

    if (outletId === 'all') {
      setActiveOutletId(null);
      router.push(`/${targetSlug}/dashboard`);
    } else {
      setActiveOutletId(outletId);
      router.push(`/${targetSlug}/outlets/${outletId}`);
    }
  };


  if (!availableUnits || availableUnits.length === 0) return null;

  return (
    <div className="flex items-center gap-2">
      <Select value={activeUnit ? (activeUnit.id || activeUnit.slug) : ''} onValueChange={handleSwitchUnit}>
        <SelectTrigger className="w-auto h-8 text-sm bg-muted/50 border-muted-foreground/20 [&>span]:truncate [&>span]:block [&>span]:w-full [&>span]:text-left">
          <SelectValue placeholder="Select Business Unit" />
        </SelectTrigger>
        <SelectContent>
          {availableUnits.map((unit: any) => (
            <SelectItem key={unit.id || unit._id} value={unit.id || unit.slug || unit._id}>
              {unit.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Outlet Switcher - Only show if unit selected and outlets exist */}
      {activeUnit && outlets.length > 0 && (
        <Select value={activeOutletId || "all"} onValueChange={handleSwitchOutlet}>
          <SelectTrigger className="w-auto h-8 text-sm bg-muted/50 border-muted-foreground/20 [&>span]:truncate [&>span]:block [&>span]:w-full [&>span]:text-left">
            <div className="flex items-center gap-2 text-muted-foreground overflow-hidden w-full">
              <Store className="h-3 w-3 shrink-0" />
              <div className="truncate">
                <SelectValue placeholder="All Outlets" />
              </div>
            </div>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Outlets</SelectItem>
            {outlets.map((outlet: any) => (
              <SelectItem key={outlet._id} value={outlet._id}>
                {outlet.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
    </div>
  );
}
