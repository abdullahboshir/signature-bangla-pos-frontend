"use client";

import { useAuth } from "@/hooks/useAuth";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRouter, usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import { isSuperAdmin as checkIsSuperAdmin, isCompanyOwner as checkIsCompanyOwner, USER_ROLES } from "@/config/auth-constants";


interface BusinessUnitSwitcherProps {
  currentBusinessUnit: string;
  effectiveCompanyId?: string | null;
  currentRole: string;
  availableUnits: any[];
}

export function BusinessUnitSwitcher({ currentBusinessUnit, effectiveCompanyId, currentRole, availableUnits }: BusinessUnitSwitcherProps) {
  const router = useRouter();
  const { setActiveBusinessUnit } = useAuth();
  const activeUnit = availableUnits.find((u: any) =>
    u.id === currentBusinessUnit ||
    u.slug === currentBusinessUnit ||
    u._id?.toString() === currentBusinessUnit
  );



  useEffect(() => {
    if (activeUnit && activeUnit._id) {
      localStorage.setItem("active-business-unit", activeUnit._id.toString());
    }
  }, [activeUnit]);


  const pathname = usePathname();
  const isCompanyAdminRoute = pathname.startsWith('/company-admin');
  const isSuperAdminRole = checkIsSuperAdmin(currentRole);
  const isCompanyOwnerRole = checkIsCompanyOwner(currentRole) && !isSuperAdminRole;
  
  // Determine base path based on role
  const getBasePath = () => {
    if (isSuperAdminRole) return '/global';
    if (isCompanyOwnerRole || isCompanyAdminRoute) return '/company-admin';
    return '/global';
  };

  const handleSwitchUnit = (unitId: string) => {
    const basePath = getBasePath();
    
    if (unitId === 'all') {
      // Clear Unit Context and show Company Overview
      setActiveBusinessUnit(null);
      localStorage.removeItem("active-business-unit");
      localStorage.removeItem("active-outlet-id");

      if (effectiveCompanyId) {
        router.push(`${basePath}/dashboard?company=${effectiveCompanyId}`);
      } else {
        router.push(`${basePath}/dashboard`);
      }
      return;
    }

    if (unitId === 'add-new') {
      const url = effectiveCompanyId
        ? `${basePath}/business-units/new?company=${effectiveCompanyId}`
        : `${basePath}/business-units/new`;
      router.push(url);
      return;
    }

    const unit = availableUnits.find((u: any) => u.id === unitId || u.slug === unitId || u._id === unitId);

    if (unit) {
      // Update Context
      if (unit._id) {
        const unitIdStr = unit._id.toString();
        setActiveBusinessUnit(unitIdStr);
        localStorage.setItem("active-business-unit", unitIdStr);
      }

      // Reset Outlet when switching Unit
      localStorage.removeItem("active-outlet-id");

      // Redirect with Context Persistence
      const targetSlug = unit.slug || unit.id;
      const params = new URLSearchParams();
      if (effectiveCompanyId) params.set('company', effectiveCompanyId);

      const queryString = params.toString();
      router.push(`/${targetSlug}/dashboard${queryString ? `?${queryString}` : ''}`);
    }
  };


  if (!availableUnits || availableUnits.length === 0) return null;

  return (
    <div className="flex items-center gap-2">
      <Select value={activeUnit ? (activeUnit.id || activeUnit.slug) : (currentBusinessUnit === 'all' ? 'all' : '')} onValueChange={handleSwitchUnit}>
        <SelectTrigger className="w-auto h-8 text-sm bg-muted/50 border-muted-foreground/20 [&>span]:truncate [&>span]:block [&>span]:w-full [&>span]:text-left">
          <SelectValue placeholder="Select Business Unit" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Company Overview</SelectItem>
          <SelectSeparator />
          {availableUnits.map((unit: any) => (
            <SelectItem key={unit._id?.toString() || unit.id?.toString() || unit.id} value={unit._id?.toString() || unit.id?.toString() || unit.slug || unit.id}>
              {unit.name}
            </SelectItem>
          ))}
          <SelectSeparator />
          <SelectItem value="add-new" className="text-primary font-medium focus:text-primary focus:bg-primary/10">
            <div className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Add Business Unit
            </div>
          </SelectItem>
        </SelectContent>

      </Select>

      {/* Outlet Switcher - Only show if unit selected and outlets exist */}

    </div>
  );
}
