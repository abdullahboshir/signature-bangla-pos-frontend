// components/layout/header/UserMenu.tsx
"use client"

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
  CreditCard, 
  Bell,
  Shield
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

interface UserData {
  fullName: string
  profileImg?: string
  designation: string
  role: string
  businessUnit: string
}

interface UserMenuProps {
  user: UserData
}

export function UserMenu({ user }: UserMenuProps) {
  const handleLogout = () => {
    // Add your logout logic here
    console.log("Logging out...")
  }

console.log('user in UserMenu', user);

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case "super-admin": return "destructive"
      case "business-admin": return "default"
      case "store-manager": return "secondary"
      case "cashier": return "outline"
      default: return "outline"
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-9 w-9 rounded-full p-0">
          <Avatar className="h-9 w-9 border">
            <AvatarImage src={user.profileImg} alt={user.fullName} />
            <AvatarFallback className="bg-primary/10 text-primary font-medium">
              {user.fullName
                .split(" ")
                .map((n) => n[0])
                .join("")
                .toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-64" align="end">
        {/* User Info */}
        <DropdownMenuLabel className="p-4">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src={user.profileImg} alt={user.fullName} />
              <AvatarFallback className="bg-primary/10 text-primary font-medium">
                {user.fullName
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm truncate">{user.fullName}</p>
              <p className="text-xs text-muted-foreground truncate">
                {user.designation}
              </p>
              <Badge 
                variant={getRoleBadgeVariant(user.role)} 
                className="mt-1 text-xs capitalize"
              >
                {user.role.replace('-', ' ')}
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

        {user.role === "super-admin" && (
          <DropdownMenuItem className="cursor-pointer">
            <Shield className="mr-2 h-4 w-4" />
            <span>Admin Panel</span>
          </DropdownMenuItem>
        )}

        <DropdownMenuSeparator />

        {/* Business Info */}
        <div className="px-2 py-1.5 text-xs text-muted-foreground">
          <p>Business Unit: <span className="font-medium capitalize">
            {/* {user.businessUnit.replace('-', ' ')} */}
            {user.businessUnit}
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