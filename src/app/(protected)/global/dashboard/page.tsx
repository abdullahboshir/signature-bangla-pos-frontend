"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import { useAuth } from "@/hooks/useAuth"
import { useGetDashboardStatsQuery } from "@/redux/api/iam/adminApi";
import { useGetBusinessUnitDashboardStatsQuery } from "@/redux/api/organization/businessUnitApi";
import { useCurrentRole } from "@/hooks/useCurrentRole";
import { MetricCards } from "@/components/modules/global-dashboard/MetricCards";
import { GrowthChart } from "@/components/modules/global-dashboard/GrowthChart";
import { RecentActivity } from "@/components/modules/global-dashboard/RecentActivity";
import { SystemHealth } from "@/components/modules/global-dashboard/SystemHealth";
import { DashboardFilterBar } from "@/components/modules/global-dashboard/DashboardFilterBar";
import { TopPerformers } from "@/components/modules/global-dashboard/TopPerformers";
import { SubscriptionOverview } from "@/components/modules/global-dashboard/SubscriptionOverview";
import { FinancialSummary } from "@/components/modules/global-dashboard/FinancialSummary";
import { ModuleUsageStats } from "@/components/modules/global-dashboard/ModuleUsageStats";
import { SupportTicketStats } from "@/components/modules/global-dashboard/SupportTicketStats";
import { isSuperAdmin, isCompanyOwner } from "@/config/auth-constants";

export default function RoleDashboard() {
    const router = useRouter();
    const { currentRole } = useCurrentRole();

    const [filters, setFilters] = useState<{
        businessUnitId: string | null;
        outletId: string | null;
        dateRange: any;
    }>({
        businessUnitId: null,
        outletId: null,
        dateRange: undefined
    });

    const isFiltered = !!filters.businessUnitId;

    const { data: globalStats, isLoading: globalLoading } = useGetDashboardStatsQuery({}, {
        skip: isFiltered || (!isSuperAdmin(currentRole) && !isCompanyOwner(currentRole)),
        refetchOnMountOrArgChange: true
    });

    const { data: filteredStats, isLoading: filteredLoading } = useGetBusinessUnitDashboardStatsQuery(
        {
            businessUnitId: filters.businessUnitId || "",
            outletId: filters.outletId || undefined
        },
        {
            skip: !isFiltered,
            refetchOnMountOrArgChange: true
        }
    );

    const activeStats = isFiltered ? filteredStats : globalStats;
    const activeLoading = isFiltered ? filteredLoading : globalLoading;

    const formatCurrency = (amount: number | undefined) => {
        return `৳ ${(amount || 0).toLocaleString('en-BD', { minimumFractionDigits: 2 })}`;
    };

    const normalizedStats = {
        revenue: activeStats?.revenue?.total || activeStats?.revenue || formatCurrency(0),
        activeUnits: activeStats?.businessUnits?.active || activeStats?.activeUnits || "0",
        totalUsers: activeStats?.users?.total || activeStats?.totalUsers || "0",
        totalSales: formatCurrency(activeStats?.totalSales),
        net: formatCurrency(activeStats?.net),
        invoiceDue: formatCurrency(activeStats?.invoiceDue),
        totalSellReturn: formatCurrency(activeStats?.totalSellReturn),
        totalPurchase: formatCurrency(activeStats?.totalPurchase),
        purchaseDue: formatCurrency(activeStats?.purchaseDue),
        totalPurchaseReturn: formatCurrency(activeStats?.totalPurchaseReturn),
        expense: formatCurrency(activeStats?.expense),
    };

    if (!isSuperAdmin(currentRole) && !isCompanyOwner(currentRole)) {
        return (
            <div className="p-6">
                <h1 className="text-2xl font-bold">Access Restricted</h1>
                <p className="text-muted-foreground">You do not have permission to view the global dashboard.</p>
            </div>
        )
    }

    return (
        <div className="space-y-3">
            <div className="flex flex-col md:flex-row justify-center items-start md:items-center gap-4">
                <DashboardFilterBar onFilterChange={setFilters} />
            </div>

            {activeLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    {[1, 2, 3, 4, 5, 6, 7, 8].map(i => <div key={i} className="h-24 bg-muted animate-pulse rounded-xl" />)}
                </div>
            ) : (
                <MetricCards stats={normalizedStats} />
            )}

            <div className="grid grid-cols-1 lg:grid-cols-7 gap-6">
                <GrowthChart />
                <div className="col-span-1 lg:col-span-3 space-y-6">
                    <FinancialSummary />
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-7 gap-6">
                <div className="col-span-1 lg:col-span-4 space-y-6">
                    {!filters.businessUnitId && <TopPerformers title="Top Business Units" />}
                    {filters.businessUnitId && <TopPerformers title="Top Outlets" />}
                </div>
                <div className="col-span-1 lg:col-span-3">
                    {!filters.businessUnitId && <SubscriptionOverview />}
                    {filters.businessUnitId && <ModuleUsageStats />}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <SupportTicketStats />
                <div className="col-span-1 lg:col-span-2 bg-card p-6 rounded-xl shadow-sm border border-border text-card-foreground">
                    <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {!filters.businessUnitId && (
                            <button
                                onClick={() => router.push("/global/companies/add")}
                                className="flex items-center justify-between p-3 text-sm font-medium text-primary bg-primary/5 border border-primary/20 rounded-lg hover:bg-primary/10 transition-colors"
                            >
                                <span>Add Company</span>
                                <Plus className="w-4 h-4" />
                            </button>
                        )}
                        <button
                            onClick={() => router.push(filters.businessUnitId ? `/global/user-management/business-users` : `/global/business-units/new`)}
                            className="flex items-center justify-between p-3 text-sm font-medium text-muted-foreground bg-muted/50 rounded-lg hover:bg-muted transition-colors"
                        >
                            <span>{filters.businessUnitId ? "Manage Staff" : "Create Business Unit"}</span>
                            <Plus className="w-4 h-4" />
                        </button>
                        <button
                            onClick={() => router.push("/global/user-management/business-users/add")}
                            className="flex items-center justify-between p-3 text-sm font-medium text-emerald-600 bg-emerald-50 border border-emerald-100 rounded-lg hover:bg-emerald-100 transition-colors"
                        >
                            <span>Add Staff</span>
                            <Plus className="w-4 h-4" />
                        </button>
                        <button
                            onClick={() => router.push("/global/system/audit-logs")}
                            className="flex items-center justify-between p-3 text-sm font-medium text-muted-foreground bg-muted/50 rounded-lg hover:bg-muted transition-colors"
                        >
                            <span>Audit Logs</span>
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                        </button>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                    <RecentActivity />
                </div>
                <div>
                    <SystemHealth />
                </div>
            </div>
        </div>
    );
}
