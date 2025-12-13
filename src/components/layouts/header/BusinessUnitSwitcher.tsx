"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Check, ChevronsUpDown, Store, LucideIcon } from "lucide-react"
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

export interface BusinessUnit {
  id: string
  name: string
  _id?: string
  role?: string
}

interface BusinessUnitSwitcherProps {
  currentBusinessUnit: string | undefined
  currentRole: string
  availableUnits: BusinessUnit[]
}

export function BusinessUnitSwitcher({
  currentBusinessUnit,
  currentRole,
  availableUnits = []
}: BusinessUnitSwitcherProps) {
  const [open, setOpen] = useState(false)
  const router = useRouter()

  // Find current unit object directly from availableUnits
  const currentUnit = availableUnits.find(unit => unit.id === currentBusinessUnit) || (availableUnits.length > 0 ? availableUnits[0] : null)

  const handleUnitSwitch = (unit: BusinessUnit) => {
    // Determine target path based on role and unit
    // Use currentRole or fallback to super-admin if undefined (though it should be passed)
    // We navigate to /[role]/[businessUnit]
    const rolePrefix = currentRole || 'super-admin';
    router.push(`/${rolePrefix}/${unit.id}`)
  }

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="hidden sm:flex items-center gap-2"
        >
          <Store className="h-4 w-4" />
          <span className="capitalize max-w-32 truncate">
            {currentUnit ? currentUnit.name : "Select Unit"}
          </span>
          <ChevronsUpDown className="h-4 w-4 opacity-50" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-56" align="end">
        <DropdownMenuLabel>Switch Business Unit</DropdownMenuLabel>
        <DropdownMenuSeparator />

        {availableUnits.map((unit) => {
          const isActive = unit.id === currentBusinessUnit

          return (
            <DropdownMenuItem
              key={unit.id}
              className={cn(
                "flex items-center gap-3 cursor-pointer",
                isActive && "bg-accent"
              )}
              onClick={() => handleUnitSwitch(unit)}
            >
              <Store className={cn("h-4 w-4", "text-blue-600")} />
              <div className="flex-1">
                <span className="font-medium">{unit.name}</span>
              </div>
              {isActive && <Check className="h-4 w-4" />}
            </DropdownMenuItem>
          )
        })}

        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="cursor-pointer text-center justify-center text-sm"
          onClick={() => router.push('/super-admin/business-units')}
        >
          View All Units (Super Admin)
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}