"use client";

import { useState, useEffect } from "react";
import { useParams, useSearchParams, useRouter, usePathname } from "next/navigation";
import { useGetOutletsQuery } from "@/redux/api/organization/outletApi";
import { useGetBusinessUnitDashboardStatsQuery } from "@/redux/api/organization/businessUnitApi";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { MetricCards } from "@/components/modules/platform-dashboard/MetricCards";
import { GrowthChart } from "@/components/modules/platform-dashboard/GrowthChart";
import { FinancialSummary } from "@/components/modules/platform-dashboard/FinancialSummary";
import { RecentActivity } from "@/components/modules/platform-dashboard/RecentActivity";
import { TopPerformers } from "@/components/modules/platform-dashboard/TopPerformers";
import { ModuleUsageStats } from "@/components/modules/platform-dashboard/ModuleUsageStats";
import { SystemHealth } from "@/components/modules/platform-dashboard/SystemHealth";

export default function BusinessUnitDashboard() {
    const params = useParams();
    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();

    const businessUnitId = params["business-unit"] as string;
    const outletParam = searchParams.get("outlet");
    
    const [selectedOutletId, setSelectedOutletId] = useState<string | undefined>(outletParam || undefined);

    // Sync state with URL
    useEffect(() => {
        setSelectedOutletId(outletParam || undefined);
    }, [outletParam]);

    // 1. Fetch Outlets for Selector
    const { data: outletData, isLoading: outletsLoading } = useGetOutletsQuery({
        businessUnit: businessUnitId,
    });
    const outlets = Array.isArray(outletData) ? outletData : (outletData as any)?.result || [];

    // 2. Fetch Dashboard Stats (Aggregated across outlets if outlet=undefined)
    const { data: stats, isLoading: statsLoading } = useGetBusinessUnitDashboardStatsQuery({
        businessUnitId,
        outletId: selectedOutletId === "all" ? undefined : selectedOutletId
    });

    const handleOutletChange = (value: string) => {
        const newVal = value === "all" ? undefined : value;
        setSelectedOutletId(newVal);

        const newParams = new URLSearchParams(searchParams.toString());
        if (value === "all") {
            newParams.delete("outlet");
        } else {
            newParams.set("outlet", value);
        }
        router.push(`${pathname}?${newParams.toString()}`);
    };

    const formatCurrency = (amount: number | undefined) => {
        return `৳ ${(amount || 0).toLocaleString('en-BD', { minimumFractionDigits: 2 })}`;
    };

    const normalizedStats = {
        totalSales: formatCurrency(stats?.totalSales),
        net: formatCurrency(stats?.net),
        invoiceDue: formatCurrency(stats?.invoiceDue),
        totalSellReturn: formatCurrency(stats?.totalSellReturn),
        totalPurchase: formatCurrency(stats?.totalPurchase),
        purchaseDue: formatCurrency(stats?.purchaseDue),
        totalPurchaseReturn: formatCurrency(stats?.totalPurchaseReturn),
        expense: formatCurrency(stats?.expense),
    };

    return (
        <div className="container mx-auto py-6 space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1">
                    <h1 className="text-3xl font-bold tracking-tight">Business Unit Dashboard</h1>
                    <p className="text-muted-foreground">
                        Operational performance and outlet aggregation
                    </p>
                </div>

                <div className="w-[200px]">
                    <Select
                        value={selectedOutletId || "all"}
                        onValueChange={handleOutletChange}
                        disabled={outletsLoading}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="All Outlets" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Outlets (Aggregated)</SelectItem>
                            {outlets.map((outlet: any) => (
                                <SelectItem key={outlet.id || outlet._id} value={outlet.id || outlet._id}>
                                    {outlet.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {/* Metric Cards (8 Stats) */}
            {statsLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    {[1, 2, 3, 4, 5, 6, 7, 8].map(i => <div key={i} className="h-28 bg-muted animate-pulse rounded-xl" />)}
                </div>
            ) : (
                <MetricCards stats={normalizedStats} />
            )}

            {/* Operational Content */}
            <div className="grid grid-cols-1 lg:grid-cols-7 gap-6">
                <GrowthChart title={selectedOutletId ? "Outlet Daily Growth" : "BU Revenue Growth"} />
                <div className="col-span-1 lg:col-span-3">
                    <FinancialSummary stats={normalizedStats} />
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-7 gap-6">
                <div className="col-span-1 lg:col-span-4">
                    <TopPerformers title={selectedOutletId ? "Outlet Daily Performance" : "Top Performing Outlets"} />
                </div>
                <div className="col-span-1 lg:col-span-3">
                    <ModuleUsageStats />
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="col-span-1 lg:col-span-2">
                    <RecentActivity />
                </div>
                <SystemHealth />
            </div>
        </div>
    );
}
