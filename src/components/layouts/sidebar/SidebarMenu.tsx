// components/layout/sidebar/SidebarMenu.tsx
"use client"

import { useState } from "react"
import Link from "next/link"
import { ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { SidebarItem } from "./SidebarItem"

interface SidebarMenuProps {
  items: any[]
  isCollapsed: boolean
  onItemClick?: () => void
  currentPath: string
  businessUnit: string
  role: string
}

export function SidebarMenu({
  items,
  isCollapsed,
  onItemClick,
  currentPath,
  businessUnit,
  role,
}: SidebarMenuProps) {
  return (
    <nav className="flex flex-col gap-2 p-4">
      {items.map((item, index) => (
        <SidebarItem
          key={index}
          item={item}
          isCollapsed={isCollapsed}
          onItemClick={onItemClick}
          currentPath={currentPath}
          businessUnit={businessUnit}
          role={role}
        />
      ))}
    </nav>
  )
}
