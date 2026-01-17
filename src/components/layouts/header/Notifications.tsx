// components/layout/header/Notifications.tsx
"use client"

import { useState } from "react"
import { Bell, Check, Trash2 } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"

interface Notification {
  id: string
  title: string
  description: string
  time: string
  type: "info" | "success" | "warning" | "error"
  read: boolean
}

export function Notifications() {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: "1",
      title: "Low Stock Alert",
      description: "Product 'iPhone 14' is running low. Only 5 items left.",
      time: "5 min ago",
      type: "warning",
      read: false,
    },
    {
      id: "2",
      title: "New Order Received",
      description: "New order #ORD-1234 has been placed.",
      time: "10 min ago",
      type: "success",
      read: false,
    },
    {
      id: "3",
      title: "Payment Processed",
      description: "Payment of $299.00 has been successfully processed.",
      time: "1 hour ago",
      type: "success",
      read: true,
    },
  ])

  const unreadCount = notifications.filter(n => !n.read).length

  const markAsRead = (id: string) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    ))
  }

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })))
  }

  const clearAll = () => {
    setNotifications([])
  }

  const getNotificationIcon = (type: string) => {
    const baseClasses = "h-3 w-3"
    switch (type) {
      case "success": return <div className={cn(baseClasses, "rounded-full bg-green-500")} />
      case "warning": return <div className={cn(baseClasses, "rounded-full bg-yellow-500")} />
      case "error": return <div className={cn(baseClasses, "rounded-full bg-red-500")} />
      default: return <div className={cn(baseClasses, "rounded-full bg-blue-500")} />
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
            >
              {unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-80" align="end">
        <DropdownMenuLabel className="flex items-center justify-between">
          <span>Notifications</span>
          <div className="flex gap-1">
            {unreadCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={markAllAsRead}
                className="h-6 text-xs"
              >
                <Check className="h-3 w-3 mr-1" />
                Mark all read
              </Button>
            )}
            {notifications.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearAll}
                className="h-6 text-xs text-destructive"
              >
                <Trash2 className="h-3 w-3 mr-1" />
                Clear all
              </Button>
            )}
          </div>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        <ScrollArea className="h-80">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <Bell className="h-8 w-8 text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground">No notifications</p>
            </div>
          ) : (
            <div className="space-y-1 p-1">
              {notifications.map((notification) => (
                <DropdownMenuItem
                  key={notification.id}
                  className={cn(
                    "flex items-start gap-3 p-3 cursor-pointer rounded-lg",
                    !notification.read && "bg-muted/50"
                  )}
                  onClick={() => markAsRead(notification.id)}
                >
                  {getNotificationIcon(notification.type)}
                  <div className="flex-1 space-y-1 min-w-0">
                    <p className="text-sm font-medium leading-none">
                      {notification.title}
                    </p>
                    <p className="text-xs text-muted-foreground line-clamp-2">
                      {notification.description}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {notification.time}
                    </p>
                  </div>
                  {!notification.read && (
                    <div className="h-2 w-2 rounded-full bg-blue-500 flex-shrink-0 mt-1" />
                  )}
                </DropdownMenuItem>
              ))}
            </div>
          )}
        </ScrollArea>

        <DropdownMenuSeparator />
        
        <DropdownMenuItem className="cursor-pointer text-center justify-center text-sm">
          View all notifications
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
