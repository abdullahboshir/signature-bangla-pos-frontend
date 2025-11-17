// components/layout/sidebar/Sidebar.tsx
"use client"

import { useState } from "react"
import { useParams, usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { getSidebarMenu, getBusinessUnitInfo } from "@/config/sidebar-menu"
// import { SidebarHeader } from "./SidebarHeader"
import { SidebarMenu } from "./SidebarMenu"
// import { SidebarFooter } from "./SidebarFooter"

interface SidebarProps {
  className?: string
  onItemClick?: () => void
}

export function Sidebar({ className, onItemClick }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const params = useParams()
  const pathname = usePathname()

  // Handle both "business-unit" and "businessUnit" params
  const businessUnit = (params["business-unit"] || params.businessUnit) as string
  const role = params.role as string

  const menuItems = getSidebarMenu(role, businessUnit || "")
  const businessUnitInfo = businessUnit ? getBusinessUnitInfo(businessUnit) : undefined

  return (
    <div
      className={cn(
        "flex h-full flex-col border-r bg-background transition-all duration-300",
        isCollapsed ? "w-16" : "w-64",
        className
      )}
    >
      {/* Sidebar Header */}
      {/* <SidebarHeader 
        businessUnit={businessUnitInfo}
        isCollapsed={isCollapsed}
      /> */}

      {/* Navigation Menu */}
      <div className="flex-1 overflow-auto">
        <SidebarMenu
          items={menuItems}
          isCollapsed={isCollapsed}
          onItemClick={onItemClick}
          currentPath={pathname}
          businessUnit={businessUnit}
          role={role}
        />
      </div>

      {/* Sidebar Footer */}
      {/* <SidebarFooter
        isCollapsed={isCollapsed}
        onToggle={() => setIsCollapsed(!isCollapsed)}
      /> */}
    </div>
  )
}