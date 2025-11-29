// components/layout/header/Header.tsx
"use client";

import { useParams } from "next/navigation";
import { Bell, Utensils, Search, Menu } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { UserMenu } from "./UserMenu";
import { Notifications } from "./Notifications";
import { BusinessUnitSwitcher } from "./BusinessUnitSwitcher";
import { cn } from "@/lib/utils";
import { ModeToggle } from "@/components/mode-toggle";
import { useAuth } from "@/hooks/useAuth";


interface HeaderProps {
  onMenuClick?: () => void;
  className?: string;
}

export function Header({ onMenuClick, className }: HeaderProps) {
  const params = useParams();
  // Handle both "business-unit" and "businessUnit" params
  const businessUnit = (params["business-unit"] ||
    params.businessUnit) as string;
  const role = params.role as string;

  const { user, isLoading: authLoading, logout } = useAuth();
  console.log("user from useAuth hook", user);

  if (authLoading) {
    return "loaiding...";
  }

  // const isAllow = user?.accessibleBusinessUnits?.includes(businessUnit);


  // console.log("Headerrrrrrrrrrrrrrrrrrr params:", isAllow);

  const userData = {
    fullName: user?.id || user?.email || "John Doe",
    profileImg: "/avatars/01.png",
    designation: user?.role || "Employee",
    role: 'super-admin',
    businessUnit: businessUnit,
  };

  return (
    <header
      className={cn(
        "sticky top-0 z-40 flex h-16 items-center gap-4 border-b bg-background px-4 lg:px-6",
        className
      )}
    >
      {/* Mobile Menu Button */}
      <Button
        variant="ghost"
        size="icon"
        className="lg:hidden"
        onClick={onMenuClick}
      >
        <Menu className="h-5 w-5" />
      </Button>

      {/* Breadcrumb & Title */}
      <div className="flex flex-1 items-center gap-4">
        <div className="flex-1">
          <h1 className="text-xl font-semibold capitalize">
            {businessUnit.replace("-", " ")}
          </h1>
          <p className="text-sm text-muted-foreground">
            Welcome back, {userData.fullName}
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
        <Button variant="ghost" size="icon" className="md:hidden">
          <Search className="h-4 w-4" />
        </Button>
        <ModeToggle />

        {/* Business Unit Switcher */}
        <BusinessUnitSwitcher
          currentBusinessUnit={businessUnit}
          currentRole={role}
        />

        {/* Notifications */}
        <Notifications />

        {/* Quick Actions */}
        {role === "business-admin" && (
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
        <UserMenu user={userData} />
      </div>
    </header>
  );
}
