// components/layout/sidebar/SidebarItem.tsx
"use client"

import { useState } from "react"
import Link from "next/link"
import { ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider
} from "@/components/ui/tooltip"
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

  // [FIX] Use the absolute path directly from sidebar-menu.ts
  const fullPath = item.path || '#';

  const isActive = item.exact
    ? currentPath === fullPath
    : currentPath.startsWith(fullPath)


  if (hasChildren) {
    // If collapsed, show DropdownMenu instead of Collapsible
    if (isCollapsed) {
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className={cn(
                "w-full justify-center h-10 px-2 font-normal",
                isActive && "bg-accent text-accent-foreground"
              )}
            >
              {Icon && <Icon className="h-4 w-4" />}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent side="right" align="start" className="w-48 ml-2">
            <DropdownMenuLabel>{item.title}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {item.children.map((child: any, index: number) => {
              // [FIX] Use absolute child path directly
              const childFullPath = child.path || '#';
              const isChildActive = currentPath === childFullPath

              return (
                <DropdownMenuItem key={index} asChild>
                  <Link
                    href={childFullPath}
                    onClick={onItemClick}
                    className={cn("cursor-pointer", isChildActive && "bg-accent/50 font-medium")}
                  >
                    {child.title}
                  </Link>
                </DropdownMenuItem>
              )
            })}
          </DropdownMenuContent>
        </DropdownMenu>
      )
    }

    // Expanded Mode (Collapsible)
    return (
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger asChild>
          <Button
            variant="ghost"
            className={cn(
              "w-full justify-start h-10 px-3 font-normal",
              isActive && "bg-accent text-accent-foreground"
            )}
          >
            {Icon && <Icon className="h-4 w-4 mr-3" />}
            <span className="flex-1 text-left">{item.title}</span>
            <ChevronDown
              className={cn(
                "h-4 w-4 transition-transform",
                isOpen && "rotate-180"
              )}
            />
          </Button>
        </CollapsibleTrigger>

        <CollapsibleContent>
          <div className="ml-4 mt-1 space-y-1">
            {item.children.map((child: any, index: number) => {
              // [FIX] Use absolute child path directly
              const childFullPath = child.path || '#';
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
                      isChildActive && "bg-accent text-accent-foreground"
                    )}
                  >
                    <span className="ml-6">{child.title}</span>
                  </Button>
                </Link>
              )
            })}
          </div>
        </CollapsibleContent>
      </Collapsible>
    )
  }


  // Single Item (No Children)
  if (isCollapsed) {
    return (
      <TooltipProvider>
        <Tooltip delayDuration={0}>
          <TooltipTrigger asChild>
            <Link href={fullPath} onClick={onItemClick}>
              <Button
                variant="ghost"
                className={cn(
                  "w-full justify-center h-10 px-2 font-normal",
                  isActive && "bg-accent text-accent-foreground"
                )}
              >
                {Icon && <Icon className="h-4 w-4" />}
              </Button>
            </Link>
          </TooltipTrigger>
          <TooltipContent side="right" className="ml-2">
            {item.title}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
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
          isActive && "bg-accent text-accent-foreground"
        )}
      >
        {Icon && <Icon className="h-4 w-4 mr-3" />}
        <span className="flex-1 text-left">{item.title}</span>
        {item.badge && (
          <Badge variant="secondary" className="ml-2 text-xs">
            {item.badge}
          </Badge>
        )}
      </Button>
    </Link>
  )
}