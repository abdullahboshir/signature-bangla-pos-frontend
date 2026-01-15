"use client";

import { useState, useEffect } from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Building2, Store, MapPin } from "lucide-react";
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
import { useSearchParams, useRouter } from "next/navigation";
import { useGetBusinessUnitsQuery } from "@/redux/api/organization/businessUnitApi";
import { useGetOutletsQuery } from "@/redux/api/organization/outletApi";
import { useGetAllCompaniesQuery } from "@/redux/api/platform/companyApi";

interface FilterState {
    companyId: string | null;
    businessUnitId: string | null;
    outletId: string | null;
    dateRange: { from: Date; to: Date } | undefined;
}

interface DashboardFilterBarProps {
    onFilterChange: (filters: FilterState) => void;
}

export function DashboardFilterBar({ onFilterChange }: DashboardFilterBarProps) {
    const searchParams = useSearchParams();
    const router = useRouter();

    const urlCompanyId = searchParams.get('company');

    const [companyId, setCompanyId] = useState<string | null>(urlCompanyId);
    const [businessUnitId, setBusinessUnitId] = useState<string | null>(null);
    const [outletId, setOutletId] = useState<string | null>(null);
    const [date, setDate] = useState<{ from: Date; to: Date } | undefined>({
        from: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
        to: new Date(),
    });

    // Update local companyId if URL change (header switch)
    useEffect(() => {
        if (urlCompanyId !== companyId) {
            setCompanyId(urlCompanyId);
            setBusinessUnitId(null);
            setOutletId(null);
        }
    }, [urlCompanyId, companyId]);

    // 1. Fetch Companies (Root Level)
    const { data: companiesData } = useGetAllCompaniesQuery({});
    const companies = Array.isArray(companiesData?.data) ? companiesData.data : (Array.isArray(companiesData) ? companiesData : []);

    // 2. Fetch Business Units (Filtered by Company)
    const { data: businessUnits } = useGetBusinessUnitsQuery(
        companyId ? { company: companyId } : {},
        { skip: !companyId }
    );

    // 3. Fetch Outlets (Filtered by BU)
    const { data: outletsData } = useGetOutletsQuery(
        businessUnitId ? { businessUnit: businessUnitId } : {},
        { skip: !businessUnitId }
    );
    const outlets = Array.isArray(outletsData) ? outletsData : (outletsData as any)?.result || [];

    // Effect: Notify parent on ANY state change
    useEffect(() => {
        onFilterChange({ companyId, businessUnitId, outletId, dateRange: date });
    }, [companyId, businessUnitId, outletId, date, onFilterChange]);


    const handleCompanyChange = (val: string) => {
        const newVal = val === "all" ? null : val;
        setCompanyId(newVal);
        setBusinessUnitId(null);
        setOutletId(null);

        // Sync with URL for consistency with Header Switcher
        const params = new URLSearchParams(searchParams.toString());
        if (newVal) {
            params.set('company', newVal);
        } else {
            params.delete('company');
        }
        router.push(`/global/dashboard${params.toString() ? `?${params.toString()}` : ''}`);
    };

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

            {/* Company Selector */}
            <Select onValueChange={handleCompanyChange} value={companyId || "all"}>
                <SelectTrigger className="w-[180px] h-9 text-sm">
                    <SelectValue placeholder="All Companies" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">Platform Overview</SelectItem>
                    {companies?.map((company: any) => (
                        <SelectItem key={company.id || company._id} value={company.id || company._id}>
                            {company.name}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>

            {/* Business Unit & Outlet Selectors - ONLY show if a company is selected (Commerce View) */}
            {companyId && (
                <>
                    {/* Business Unit Selector */}
                    <Select
                        onValueChange={handleBuChange}
                        value={businessUnitId || "all"}
                    >
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
                            {outlets?.map((outlet: any) => (
                                <SelectItem key={outlet.id || outlet._id} value={outlet.id || outlet._id}>
                                    {outlet.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </>
            )}

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
