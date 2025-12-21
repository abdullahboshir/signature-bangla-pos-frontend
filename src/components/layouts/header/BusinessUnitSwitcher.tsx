"use client";

import { useAuth } from "@/hooks/useAuth";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRouter } from "next/navigation";
import { useGetAllOutletsQuery } from "@/redux/api/outletApi";
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

  // Find current unit object to display safely
  const activeUnit = availableUnits.find((u: any) => u.id === currentBusinessUnit || u.slug === currentBusinessUnit);
  const activeUnitId = activeUnit?._id;

  // Fetch outlets for the active business unit
  // Skip if no active unit
  const { data: outletsData, isLoading: loadingOutlets } = useGetAllOutletsQuery(
    { businessUnit: activeUnitId },
    { skip: !activeUnitId }
  );

  const outlets = outletsData?.data || [];

  const handleSwitchUnit = (unitId: string) => {
    const unit = availableUnits.find((u: any) => u.id === unitId || u.slug === unitId || u._id === unitId);

    if (unit) {
      // Update Context
      if (unit._id) setActiveBusinessUnit(unit._id);

      // Reset Outlet when switching Unit
      setActiveOutletId(null);
      localStorage.removeItem("active-outlet-id");

      // Redirect
      const targetSlug = unit.slug || unit.id;
      const targetRole = currentRole || 'business-admin'; // Fallback

      router.push(`/${targetRole}/${targetSlug}`);
    }
  };

  const handleSwitchOutlet = (outletId: string) => {
    setActiveOutletId(outletId);
    // Persist outlet choice (optional, or use context)
    localStorage.setItem("active-outlet-id", outletId);

    // Force reload or just let context handle it? 
    // ideally reload to apply header filter if we use request interceptor
    window.location.reload();
  };

  // Sync state on mount
  useEffect(() => {
    const storedOutlet = localStorage.getItem("active-outlet-id");
    if (storedOutlet) setActiveOutletId(storedOutlet);
  }, []);


  if (!availableUnits || availableUnits.length === 0) return null;

  return (
    <div className="flex items-center gap-2">
      <Select value={activeUnit ? (activeUnit.id || activeUnit.slug) : ''} onValueChange={handleSwitchUnit}>
        <SelectTrigger className="w-[180px] h-8 text-sm bg-muted/50 border-muted-foreground/20">
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
          <SelectTrigger className="w-[150px] h-8 text-sm bg-muted/50 border-muted-foreground/20">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Store className="h-3 w-3" />
              <SelectValue placeholder="All Outlets" />
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