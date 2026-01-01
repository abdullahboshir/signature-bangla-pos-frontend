"use client";

import { useState, useEffect } from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useGetBusinessUnitsQuery } from "@/redux/api/organization/businessUnitApi";
import { useGetOutletsQuery } from "@/redux/api/organization/outletApi";

interface FilterState {
    businessUnitId: string | null;
    outletId: string | null;
    dateRange: { from: Date; to: Date } | undefined;
}

interface DashboardFilterBarProps {
    onFilterChange: (filters: FilterState) => void;
}

export function DashboardFilterBar({ onFilterChange }: DashboardFilterBarProps) {
    const [businessUnitId, setBusinessUnitId] = useState<string | null>(null);
    const [outletId, setOutletId] = useState<string | null>(null);
    const [date, setDate] = useState<{ from: Date; to: Date } | undefined>({
        from: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
        to: new Date(),
    });

    const { data: businessUnits, isLoading: buLoading } = useGetBusinessUnitsQuery({});

    // Fetch outlets based on selected BU
    // Note: If no BU selected, we don't fetch outlets (or fetch all? user implies hierarchy)
    const { data: outlets, isLoading: outletLoading } = useGetOutletsQuery(
        businessUnitId ? { businessUnit: businessUnitId } : {},
        { skip: !businessUnitId }
    );

    // Effect to notify parent on ANY state change
    useEffect(() => {
        onFilterChange({ businessUnitId, outletId, dateRange: date });
    }, [businessUnitId, outletId, date]);

    const handleBuChange = (val: string) => {
        const newVal = val === "all" ? null : val;
        setBusinessUnitId(newVal);
        setOutletId(null);
    };

    const handleOutletChange = (val: string) => {
        const newVal = val === "all" ? null : val;
        setOutletId(newVal);
    };

    return (
        <div className="flex flex-col md:flex-row gap-2 items-center bg-card p-2 rounded-lg border shadow-sm">
            {/* Business Unit Selector */}
            <Select onValueChange={handleBuChange} value={businessUnitId || "all"}>
                <SelectTrigger className="w-[180px] h-9 text-sm">
                    <SelectValue placeholder="All Business Units" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">All Business Units</SelectItem>
                    {businessUnits?.map((unit: any) => (
                        <SelectItem key={unit.id || unit._id} value={unit.id || unit._id}>
                            {unit.name}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>

            {/* Outlet Selector */}
            <Select
                onValueChange={handleOutletChange}
                value={outletId || "all"}
                disabled={!businessUnitId}
            >
                <SelectTrigger className="w-[180px] h-9 text-sm">
                    <SelectValue placeholder="All Outlets" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">All Outlets</SelectItem>
                    {/* Handle potential response variations */}
                    {(outlets as any)?.result?.map((outlet: any) => (
                        <SelectItem key={outlet.id || outlet._id} value={outlet.id || outlet._id}>
                            {outlet.name}
                        </SelectItem>
                    )) || (outlets as any)?.map?.((outlet: any) => (
                        <SelectItem key={outlet.id || outlet._id} value={outlet.id || outlet._id}>
                            {outlet.name}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>

            {/* Date Range Picker */}
            <Popover>
                <PopoverTrigger asChild>
                    <Button
                        id="date"
                        variant={"outline"}
                        className={cn(
                            "w-[240px] justify-start text-left font-normal h-9 text-sm",
                            !date && "text-muted-foreground"
                        )}
                    >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {date?.from ? (
                            date.to ? (
                                <>
                                    {format(date.from, "MMM dd, y")} -{" "}
                                    {format(date.to, "MMM dd, y")}
                                </>
                            ) : (
                                format(date.from, "MMM dd, y")
                            )
                        ) : (
                            <span>Pick a date</span>
                        )}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                        initialFocus
                        mode="range"
                        defaultMonth={date?.from}
                        selected={date}
                        onSelect={(range: any) => setDate(range)}
                        numberOfMonths={2}
                    />
                </PopoverContent>
            </Popover>
        </div>
    );
}
