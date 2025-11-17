// components/layout/header/AccountMenus.tsx
"use client"

import { useState } from "react"
import { 
  User, 
  Settings, 
  LogOut, 
  Bell, 
  Building, 
  CreditCard, 
  HelpCircle,
  Moon,
  Sun,
  ChevronDown
} from "lucide-react"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { useTheme } from "next-themes"
// import { useAuth } from "@/hooks/useAuth"
// import { useCurrentBusinessUnit } from "@/hooks/useCurrentBusinessUnit"
import { Notifications } from "./Notifications"
import { BusinessUnitSwitcher } from "./BusinessUnitSwitcher"

interface AccountMenusProps {
  className?: string
  variant?: "default" | "minimal"
}

export function AccountMenus({ className, variant = "default" }: AccountMenusProps) {
  const [isOpen, setIsOpen] = useState(false)
  const { theme, setTheme } = useTheme()
//   const { user, logout, isLoading } = useAuth()
//   const { currentBusinessUnit, businessUnits } = useCurrentBusinessUnit()
  const router = useRouter()

//   if (isLoading || !user) {
//     return (
//       <div className="flex items-center gap-4">
//         <div className="h-8 w-8 animate-pulse rounded-full bg-muted" />
//         <div className="hidden md:flex flex-col">
//           <div className="h-4 w-20 animate-pulse bg-muted rounded" />
//           <div className="h-3 w-16 animate-pulse bg-muted rounded mt-1" />
//         </div>
//       </div>
//     )
//   }

//   const handleProfile = () => {
//     router.push(`/${currentBusinessUnit?.slug}/${user.role}/profile`)
//     setIsOpen(false)
//   }

//   const handleSettings = () => {
//     router.push(`/${currentBusinessUnit?.slug}/${user.role}/settings`)
//     setIsOpen(false)
//   }

//   const handleBilling = () => {
//     router.push(`/${currentBusinessUnit?.slug}/${user.role}/billing`)
//     setIsOpen(false)
//   }

//   const handleLogout = async () => {
//     await logout()
//     setIsOpen(false)
//     router.push("/auth/login")
//   }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map(part => part[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {/* Notifications Menu */}
      {/* <NotificationMenu /> */}
      
      {/* Business Unit Switcher - Only show if user has multiple business units */}
      {/* {businessUnits.length > 1 && (
        <BusinessUnitSwitcher />
      )} */}

      {/* Theme Toggle */}
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setTheme(theme === "light" ? "dark" : "light")}
        className="hidden sm:flex"
      >
        <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
        <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
        <span className="sr-only">Toggle theme</span>
      </Button>

      {/* Account Dropdown */}
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="relative h-8 gap-2 px-2 hover:bg-accent"
          >
            {/* <Avatar className="h-6 w-6">
              <AvatarImage src={user.avatar} alt={user.name} />
              <AvatarFallback className="text-xs bg-primary text-primary-foreground">
                {getInitials(user.name)}
              </AvatarFallback>
            </Avatar> */}
            
            {variant === "default" && (
              <>
                {/* <div className="hidden flex-col items-start sm:flex">
                  <span className="text-sm font-medium leading-none">
                    {user.name}
                  </span>
                  <span className="text-xs leading-none text-muted-foreground capitalize">
                    {user.role?.replace("-", " ")}
                  </span>
                </div> */}
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              </>
            )}
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent 
          className="w-56" 
          align="end" 
          forceMount
        >
          {/* User Info */}
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              {/* <p className="text-sm font-medium leading-none">{user.name}</p>
              <p className="text-xs leading-none text-muted-foreground">
                {user.email}
              </p> */}
              {/* <div className="flex items-center gap-1 pt-1">
                <Badge 
                  variant="secondary" 
                  className="text-xs capitalize"
                >
                  {user.role?.replace("-", " ")}
                </Badge>
                {currentBusinessUnit && (
                  <Badge variant="outline" className="text-xs">
                    {currentBusinessUnit.name}
                  </Badge>
                )}
              </div> */}
            </div>
          </DropdownMenuLabel>

          <DropdownMenuSeparator />

          {/* Quick Actions */}
          {/* <DropdownMenuGroup>
            <DropdownMenuItem onClick={handleProfile}>
              <User className="mr-2 h-4 w-4" />
              <span>Profile</span>
            </DropdownMenuItem>
            
            <DropdownMenuItem onClick={handleSettings}>
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
            </DropdownMenuItem>

            {user.role === "super-admin" && (
              <DropdownMenuItem onClick={handleBilling}>
                <CreditCard className="mr-2 h-4 w-4" />
                <span>Billing</span>
              </DropdownMenuItem>
            )}
          </DropdownMenuGroup> */}

          <DropdownMenuSeparator />

          {/* Theme Toggle for Mobile */}
          <DropdownMenuItem 
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
            className="sm:hidden"
          >
            {theme === "light" ? (
              <>
                <Moon className="mr-2 h-4 w-4" />
                <span>Dark mode</span>
              </>
            ) : (
              <>
                <Sun className="mr-2 h-4 w-4" />
                <span>Light mode</span>
              </>
            )}
          </DropdownMenuItem>

          <DropdownMenuItem onClick={() => {/* Help action */}}>
            <HelpCircle className="mr-2 h-4 w-4" />
            <span>Help & Support</span>
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          {/* Logout */}
          {/* <DropdownMenuItem 
            onClick={handleLogout}
            className="text-destructive focus:text-destructive"
          >
            <LogOut className="mr-2 h-4 w-4" />
            <span>Log out</span>
          </DropdownMenuItem> */}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}