// components/layout/mobile/MobileAccountMenu.tsx
"use client"

import {
  User,
  Settings,
  LogOut,
  Bell,
  Building,
  Menu
} from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useAuth } from "@/hooks/useAuth"

interface MobileAccountMenuProps {
  className?: string
}

export function MobileAccountMenu({ className }: MobileAccountMenuProps) {
  const { user, logout } = useAuth()

  const getInitials = (name: string | { firstName: string, lastName: string } | undefined) => {
    if (!name) return "U";
    if (typeof name === 'string') {
      return name
        .split(" ")
        .map(part => part[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    }
    return `${name.firstName?.[0] || ''}${name.lastName?.[0] || ''}`.toUpperCase();
  }

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className={className}>
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>

      <SheetContent side="right" className="w-80">
        <SheetHeader>
          <SheetTitle>Menu</SheetTitle>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          {/* User Info */}
          {user && (
            <div className="flex items-center gap-3 p-2 rounded-lg bg-muted">
              <Avatar className="h-10 w-10">
                <AvatarImage src={user.avatar} alt={typeof user.name === 'string' ? user.name : user.name?.firstName} />
                <AvatarFallback className="bg-primary text-primary-foreground">
                  {getInitials(user.name)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">{typeof user.name === 'string' ? user.name : `${user.name?.firstName} ${user.name?.lastName}`}</p>
                <p className="text-sm text-muted-foreground truncate">
                  {user.email}
                </p>
              </div>
            </div>
          )}

          {/* Quick Actions */}
          <div className="space-y-2">
            <Button variant="ghost" className="w-full justify-start gap-3">
              <Bell className="h-4 w-4" />
              Notifications
            </Button>

            <Button variant="ghost" className="w-full justify-start gap-3">
              <Building className="h-4 w-4" />
              Switch Business Unit
            </Button>

            <Button variant="ghost" className="w-full justify-start gap-3">
              <User className="h-4 w-4" />
              Profile
            </Button>

            <Button variant="ghost" className="w-full justify-start gap-3">
              <Settings className="h-4 w-4" />
              Settings
            </Button>
          </div>

          {/* Logout */}
          <Button
            variant="ghost"
            className="w-full justify-start gap-3 text-destructive"
            onClick={logout}
          >
            <LogOut className="h-4 w-4" />
            Log out
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  )
}
