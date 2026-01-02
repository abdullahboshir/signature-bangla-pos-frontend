"use client"

import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { useGetOutletsQuery } from "@/redux/api/organization/outletApi"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"

interface OutletMultiSelectProps {
    businessUnitId: string
    selectedOutlets: string[]
    onChange: (outlets: string[]) => void
}

export function OutletMultiSelect({ businessUnitId, selectedOutlets, onChange }: OutletMultiSelectProps) {
    const [open, setOpen] = React.useState(false)
    const { data: outletsData, isLoading } = useGetOutletsQuery({ businessUnit: businessUnitId })

    const outlets = React.useMemo(() => {
        if (!outletsData) return []
        return Array.isArray(outletsData) ? outletsData : (outletsData.data || [])
    }, [outletsData])

    const toggleOutlet = (outletId: string) => {
        if (selectedOutlets.includes(outletId)) {
            onChange(selectedOutlets.filter(id => id !== outletId))
        } else {
            onChange([...selectedOutlets, outletId])
        }
    }

    const toggleAll = () => {
        if (selectedOutlets.length === outlets.length) {
            onChange([])
        } else {
            onChange(outlets.map((o: any) => o._id || o.id))
        }
    }

    const isAllSelected = outlets.length > 0 && selectedOutlets.length === outlets.length

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-full justify-between"
                >
                    {selectedOutlets.length === 0
                        ? "Select Outlets..."
                        : `${selectedOutlets.length} outlet(s) selected`}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0">
                <Command>
                    <CommandInput placeholder="Search outlet..." />
                    <CommandList>
                        <CommandEmpty>{isLoading ? "Loading..." : "No outlet found."}</CommandEmpty>
                        <CommandGroup>
                            {outlets.length > 0 && (
                                <CommandItem
                                    onSelect={toggleAll}
                                    className="font-medium border-b"
                                >
                                    <div
                                        className={cn(
                                            "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                                            isAllSelected
                                                ? "bg-primary text-primary-foreground"
                                                : "opacity-50 [&_svg]:invisible"
                                        )}
                                    >
                                        <Check className={cn("h-4 w-4")} />
                                    </div>
                                    Select All ({outlets.length})
                                </CommandItem>
                            )}
                            {outlets.map((outlet: any) => {
                                const id = outlet._id || outlet.id;
                                const isSelected = selectedOutlets.includes(id);
                                return (
                                    <CommandItem
                                        key={id}
                                        value={outlet.name}
                                        onSelect={() => toggleOutlet(id)}
                                    >
                                        <div
                                            className={cn(
                                                "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                                                isSelected
                                                    ? "bg-primary text-primary-foreground"
                                                    : "opacity-50 [&_svg]:invisible"
                                            )}
                                        >
                                            <Check className={cn("h-4 w-4")} />
                                        </div>
                                        {outlet.name}
                                    </CommandItem>
                                )
                            })}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    )
}
