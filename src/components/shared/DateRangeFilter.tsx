"use client"

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { DateRange } from "react-day-picker";

interface DateRangeFilterProps {
    dateFilter: string;
    setDateFilter: (value: string) => void;
    dateRange: DateRange | undefined;
    setDateRange: (range: DateRange | undefined) => void;
    isCalendarOpen: boolean;
    setIsCalendarOpen: (open: boolean) => void;
}

const PRESETS = [
    { label: "All Dates", value: "all" },
    { label: "Today", value: "today" },
    { label: "Last 7 Days", value: "week" },
    { label: "This Month", value: "this_month" },
    { label: "Last Month", value: "last_month" },
    { label: "This Year", value: "this_year" },
    { label: "Last Year", value: "last_year" }
];

export function DateRangeFilter({
    dateFilter,
    setDateFilter,
    dateRange,
    setDateRange,
    isCalendarOpen,
    setIsCalendarOpen
}: DateRangeFilterProps) {

    const getButtonLabel = () => {
        if (dateFilter === "custom" && dateRange?.from) {
            if (dateRange.to) {
                return <>{format(dateRange.from, "LLL dd, y")} - {format(dateRange.to, "LLL dd, y")}</>;
            }
            return format(dateRange.from, "LLL dd, y");
        }

        const preset = PRESETS.find(p => p.value === dateFilter);
        return preset ? preset.label : "Filter by Date";
    };

    return (
        <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant={"outline"}
                    className={cn(
                        "w-[210px] justify-start text-left font-normal",
                        !dateFilter && "text-muted-foreground"
                    )}
                >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {getButtonLabel()}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 max-h-[500px] overflow-y-auto" align="end">
                <div className="flex">
                    <div className="flex flex-col gap-2 p-3 border-r h-full">
                        {PRESETS.map((preset) => (
                            <Button
                                key={preset.value}
                                variant={dateFilter === preset.value ? "default" : "ghost"}
                                className="justify-start text-sm w-[100px]"
                                onClick={() => {
                                    setDateFilter(preset.value);
                                    if (preset.value !== "custom") {
                                        setIsCalendarOpen(false);
                                    }
                                }}
                            >
                                {preset.label}
                            </Button>
                        ))}
                    </div>
                    <div className="p-0">
                        <Calendar
                            initialFocus
                            mode="range"
                            defaultMonth={dateRange?.from}
                            selected={dateRange}
                            onSelect={(range) => {
                                setDateRange(range);
                                setDateFilter("custom");
                            }}
                            numberOfMonths={2}
                        />
                    </div>
                </div>
            </PopoverContent>
        </Popover>
    );
}
