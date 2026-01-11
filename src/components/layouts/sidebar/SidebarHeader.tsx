// components/layout/header/Header.tsx
"use client"


import { Bell, Utensils, Search, Menu } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

import { cn } from "@/lib/utils"
import { UserMenu } from "../header/UserMenu"
import { BusinessUnitSwitcher } from "../header/BusinessUnitSwitcher"
import { Notifications } from "../header/Notifications"

import { useCurrentBusinessUnit } from "@/hooks/useCurrentBusinessUnit"
import { useAuth } from "@/hooks/useAuth"
import { useCurrentRole } from "@/hooks/useCurrentRole";
import { isBusinessAdmin as checkIsBusinessAdmin } from "@/config/auth-constants";

interface HeaderProps {
  onMenuClick?: () => void
  className?: string
}

export function SidebarHeader({ onMenuClick, className }: HeaderProps) {
  const { currentRole } = useCurrentRole();
  const role = currentRole as string;

  const { user } = useAuth()
  const { currentBusinessUnit, userBusinessUnits } = useCurrentBusinessUnit()

  // Safe fallback for business unit name
  const buName = currentBusinessUnit ? currentBusinessUnit.name : "Dashboard"

  return (
    <header className={cn(
      "sticky top-0 z-40 flex h-16 items-center gap-4 border-b bg-background px-4 lg:px-6",
      className
    )}>
      {/* Mobile Menu Button */}
      <Button
        variant="ghost"
        size="icon"
        className="lg:hidden"
        onClick={onMenuClick}
      >
        <Menu className="h-5 w-5" />
      </Button>


      <div className="flex flex-1 items-center gap-4">
        <div className="flex-1">
          <h1 className="text-xl font-semibold capitalize">
            {buName}
          </h1>
          <p className="text-sm text-muted-foreground">
            Welcome back, {typeof user?.name === 'string' ? user.name : user?.name?.firstName || "User"}
          </p>
        </div>

        {/* Search Bar - Hidden on mobile */}
        <div className="hidden md:flex flex-1 max-w-md">
          <div className="relative w-full">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search products, customers, orders..."
              className="pl-8"
            />
          </div>
        </div>
      </div>

      {/* Right Side Actions */}
      <div className="flex items-center gap-2">
        {/* Quick Search Mobile */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
        >
          <Search className="h-4 w-4" />
        </Button>

        {/* Business Unit Switcher */}
        <BusinessUnitSwitcher
          currentBusinessUnit={currentBusinessUnit?.id}
          currentRole={role}
          availableUnits={userBusinessUnits}
        />

        {/* Notifications */}
        <Notifications />

        {/* Quick Actions */}
        {checkIsBusinessAdmin(role) && (
          <Button
            variant="outline"
            size="icon"
            className="hidden sm:flex"
            title="Quick POS"
          >
            <Utensils className="h-4 w-4" />
          </Button>
        )}

        {/* User Menu */}
        {user && <UserMenu user={{
          fullName: typeof user.name === 'string' ? user.name : `${user.name?.firstName} ${user.name?.lastName}`,
          profileImg: user.avatar || "/avatars/01.png", // Fallback
          designation: role,
          role: role,
          businessUnit: currentBusinessUnit?.name || "Global"
        }} />}
      </div>
    </header>
  )
}