// components/layout/header/BusinessUnitSwitcher.tsx
"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Check, ChevronsUpDown, Store, LucideIcon  } from "lucide-react"
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
import { cn } from "@/lib/utils"

interface BusinessUnit {
  id: string
  name: string
  role: string
  icon: LucideIcon
  color: string
}

interface BusinessUnitSwitcherProps {
  currentBusinessUnit: string
  currentRole: string,
  user: any
}

export function BusinessUnitSwitcher({ 
  currentBusinessUnit, 
  currentRole,
  user
}: BusinessUnitSwitcherProps) {
  const [open, setOpen] = useState(false)
  const router = useRouter()

  const businessUnits: BusinessUnit[] = [
    {
      id: "all-business-units",
      name: "All Business Units",
      role: user.role[0],
      icon: Store,
      color: "text-yellow-600",
    },
    {
      id: "telemedicine",
      name: "Telemedicine",
        role: user.role[0],
      icon: Store,
      color: "text-blue-600",
    },
    {
      id: "clothing",
      name: "Clothing Store",
        role: user.role[0], 
      icon: Store,
      color: "text-purple-600",
    },
    {
      id: "grocery",
      name: "Grocery Mart",
       role: user.role[0],
      icon: Store,
      color: "text-green-600",
    },
    {
      id: "books",
      name: "Book Store", 
       role: user.role[0],
      icon: Store,
      color: "text-orange-600",
    },
  ]
console.log('currentRole', currentRole)
  const currentUnit = businessUnits.find(unit => unit.id === currentBusinessUnit)

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="hidden sm:flex items-center gap-2"
        >
          {currentUnit && (
            <currentUnit.icon className={cn("h-4 w-4", currentUnit.color)} />
          )}
          <span className="capitalize max-w-32 truncate">
            {currentBusinessUnit.replace('-', ' ')}
          </span>
          <ChevronsUpDown className="h-4 w-4 opacity-50" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-56" align="end">
        <DropdownMenuLabel>Switch Business Unit</DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        {businessUnits.map((unit) => {
          const isActive = unit.id === currentBusinessUnit
          const Icon = unit.icon

          return (
            <DropdownMenuItem
              key={unit.id}
              className={cn(
                "flex items-center gap-3 cursor-pointer",
                isActive && "bg-accent"
              )}
              onClick={() => {
                // Navigate to the business unit dashboard
                router.push(`/${unit.role}/${unit.id}`)
              }}
            >
              <Icon className={cn("h-4 w-4", unit.color)} />
              <div className="flex-1">
                <span className="font-medium">{unit.name}</span>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="outline" className="text-xs capitalize">
                    {unit.role.replace('-', ' ')}
                  </Badge>
                </div>
              </div>
              {isActive && <Check className="h-4 w-4" />}
            </DropdownMenuItem>
          )
        })}

        <DropdownMenuSeparator />
        <DropdownMenuItem className="cursor-pointer text-center justify-center text-sm">
          Manage Business Units
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}