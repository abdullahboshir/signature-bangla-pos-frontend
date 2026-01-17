// components/layout/header/UserMenu.tsx
"use client"
import Link from "next/link"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  User,
  Settings,
  LogOut,
  Bell,
  Shield
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/hooks/useAuth"
import { isSuperAdmin as checkIsSuperAdmin, isOrganizationOwner as checkisOrganizationOwner, USER_ROLES } from "@/config/auth-constants"

interface UserData {
  fullName: string
  profileImg?: string
  designation: string
  role: string | string[]
  businessUnit: string[] | string
}

interface UserMenuProps {
  user: UserData
}

export function UserMenu({ user }: UserMenuProps) {

  const { logout } = useAuth();
  const handleLogout = () => {
    logout();
  }

  const getRoleBadgeVariant = (role: string | string[]) => {
    if (checkIsSuperAdmin(role)) return "destructive";
    if (role === USER_ROLES.ADMIN || role === "business-admin") return "default";
    if (role === USER_ROLES.OUTLET_MANAGER || role === "store-manager") return "secondary";
    if (role === USER_ROLES.CASHIER) return "outline";
    return "outline";
  }

  // Helper to safely get initials
  const getInitials = (name: string) => {
    if (typeof name !== 'string') return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  }

  const roleStr = Array.isArray(user.role) ? user.role[0] : String(user.role || "");
  const businessUnitStr = Array.isArray(user.businessUnit)
    ? user.businessUnit
      .filter(Boolean)
      .map((unit: any) => (typeof unit === 'string' ? unit : (unit?.name || "Global")).replace('-', ' '))
      .join(', ')
    : String((typeof user.businessUnit === 'object' && user.businessUnit !== null ? (user.businessUnit as any)?.name : user.businessUnit) || "").replace('-', ' ');

  const fullNameSafe = typeof user.fullName === 'string' ? user.fullName : "User";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-9 w-9 rounded-full p-0">
          <Avatar className="h-9 w-9 border">
            <AvatarImage src={user.profileImg} alt={fullNameSafe} />
            <AvatarFallback className="bg-primary/10 text-primary font-medium">
              {getInitials(fullNameSafe)}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-64" align="end">
        {/* User Info */}
        <DropdownMenuLabel className="p-4">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src={user.profileImg} alt={fullNameSafe} />
              <AvatarFallback className="bg-primary/10 text-primary font-medium">
                {getInitials(fullNameSafe)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm truncate">{fullNameSafe}</p>
              <p className="text-xs text-muted-foreground truncate">
                {user.designation}
              </p>
              <Badge
                variant={getRoleBadgeVariant(user.role)}
                className="mt-1 text-xs capitalize"
              >
                {roleStr.replace('-', ' ')}
              </Badge>
            </div>
          </div>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        {/* Quick Actions */}
        <DropdownMenuItem className="cursor-pointer">
          <User className="mr-2 h-4 w-4" />
          <span>My Profile</span>
        </DropdownMenuItem>

        <DropdownMenuItem className="cursor-pointer">
          <Bell className="mr-2 h-4 w-4" />
          <span>Notifications</span>
          <Badge variant="destructive" className="ml-auto h-5 w-5 p-0 text-xs">
            3
          </Badge>
        </DropdownMenuItem>

        <DropdownMenuItem className="cursor-pointer">
          <Settings className="mr-2 h-4 w-4" />
          <span>Settings</span>
        </DropdownMenuItem>

        {checkIsSuperAdmin(roleStr) && (
          <DropdownMenuItem asChild className="cursor-pointer">
            <Link href="/platform">
              <Shield className="mr-2 h-4 w-4" />
              <span>Platform Admin</span>
            </Link>
          </DropdownMenuItem>
        )}

        {checkisOrganizationOwner(roleStr) && !checkIsSuperAdmin(roleStr) && (
          <DropdownMenuItem asChild className="cursor-pointer">
            <Link href="/organization">
              <Shield className="mr-2 h-4 w-4" />
              <span>Organization Admin</span>
            </Link>
          </DropdownMenuItem>
        )}

        <DropdownMenuSeparator />

        {/* Business Info */}
        <div className="px-2 py-1.5 text-xs text-muted-foreground">
          <p>Business Unit: <span className="font-medium capitalize">
            {businessUnitStr}
          </span></p>
        </div>

        <DropdownMenuSeparator />

        {/* Logout */}
        <DropdownMenuItem
          className="cursor-pointer text-destructive focus:text-destructive"
          onClick={handleLogout}
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
