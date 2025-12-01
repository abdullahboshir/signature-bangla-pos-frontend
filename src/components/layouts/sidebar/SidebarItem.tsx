// components/layout/sidebar/SidebarItem.tsx
"use client"

import { useState } from "react"
import Link from "next/link"
import { ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"

interface SidebarItemProps {
  item: any
  isCollapsed: boolean
  onItemClick?: () => void
  currentPath: string
  businessUnit: string
  role: string
}

export function SidebarItem({
  item,
  isCollapsed,
  onItemClick,
  currentPath,
  businessUnit,
  role,
}: SidebarItemProps) {
  const [isOpen, setIsOpen] = useState(false)
  
  const hasChildren = item.children && item.children.length > 0
  const Icon = item.icon
  
 
  const fullPath = `/${role}/${businessUnit}${item.path ? `/${item.path}` : ''}`
  
 
  // Check if current path matches
  const isActive = item.exact 
    ? currentPath === fullPath
    : currentPath.startsWith(fullPath)

    console.log('pathhhhhhhhh', fullPath, 'currentPat', currentPath, 'isActive', isActive)
  // For items with children
  if (hasChildren) {
    return (
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger asChild>
          <Button
            variant="ghost"
            className={cn(
              "w-full justify-start h-10 px-3 font-normal",
              isActive && "bg-accent text-accent-foreground",
              isCollapsed && "px-2"
            )}
          >
            {Icon && <Icon className={cn("h-4 w-4", isCollapsed ? "mr-0" : "mr-3")} />}
            {!isCollapsed && (
              <>
                <span className="flex-1 text-left">{item.title}</span>
                <ChevronDown
                  className={cn(
                    "h-4 w-4 transition-transform",
                    isOpen && "rotate-180"
                  )}
                />
              </>
            )}
          </Button>
        </CollapsibleTrigger>
        
        <CollapsibleContent>
          <div className={cn("ml-4 mt-1 space-y-1", isCollapsed && "ml-0")}>
            {item.children.map((child: any, index: number) => {
              const childFullPath = `/${role}/${businessUnit}${child.path ? `/${child.path}` : ''}`
              const isChildActive = currentPath === childFullPath
              
              return (
                <Link
                  key={index}
                  href={childFullPath}
                  onClick={onItemClick}
                >
                  <Button
                    variant="ghost"
                    className={cn(
                      "w-full justify-start h-8 px-3 font-normal text-sm",
                      isChildActive && "bg-accent text-accent-foreground",
                      isCollapsed && "px-2"
                    )}
                  >
                    {!isCollapsed && (
                      <span className="ml-6">{child.title}</span>
                    )}
                  </Button>
                </Link>
              )
            })}
          </div>
        </CollapsibleContent>
      </Collapsible>
    )
  }


  return (
    <Link
      href={fullPath}
      onClick={onItemClick}
    >
      <Button
        variant="ghost"
        className={cn(
          "w-full justify-start h-10 px-3 font-normal relative",
          isActive && "bg-accent text-accent-foreground",
          isCollapsed && "px-2"
        )}
      >
        {Icon && <Icon className={cn("h-4 w-4", isCollapsed ? "mr-0" : "mr-3")} />}
        
        {!isCollapsed && (
          <>
            <span className="flex-1 text-left">{item.title}</span>
            {item.badge && (
              <Badge variant="secondary" className="ml-2 text-xs">
                {item.badge}
              </Badge>
            )}
          </>
        )}
      </Button>
    </Link>
  )
}