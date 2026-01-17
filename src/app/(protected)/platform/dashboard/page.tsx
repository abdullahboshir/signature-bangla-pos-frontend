"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Plus, Building2, Users, Store, DollarSign, Shield } from "lucide-react";

import { useGetDashboardStatsQuery } from "@/redux/api/iam/adminApi";
import { useGetBusinessUnitDashboardStatsQuery } from "@/redux/api/organization/businessUnitApi";
import { useCurrentRole } from "@/hooks/useCurrentRole";
import { GrowthChart } from "@/components/modules/platform-dashboard/GrowthChart";
import { RecentActivity } from "@/components/modules/platform-dashboard/RecentActivity";
import { SystemHealth } from "@/components/modules/platform-dashboard/SystemHealth";
import { TopPerformers } from "@/components/modules/platform-dashboard/TopPerformers";
import { SubscriptionOverview } from "@/components/modules/platform-dashboard/SubscriptionOverview";
import { SupportTicketStats } from "@/components/modules/platform-dashboard/SupportTicketStats";
import { DashboardFilterBar } from "@/components/modules/platform-dashboard/DashboardFilterBar";
import { FinancialSummary } from "@/components/modules/platform-dashboard/FinancialSummary";
import { ModuleUsageStats } from "@/components/modules/platform-dashboard/ModuleUsageStats";
import { MetricCards } from "@/components/modules/platform-dashboard/MetricCards";
import { PlatformMetricCards } from "@/components/modules/platform-dashboard/PlatformMetricCards";
import { isSuperAdmin, isOrganizationOwner } from "@/config/auth-constants";
import { useGetOrganizationDashboardStatsQuery } from "@/redux/api/platform/organizationApi";

export default function ContextAwareDashboard() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { currentRole } = useCurrentRole();

    const [filters, setFilters] = useState<{
        companyId: string | null;
        businessUnitId: string | null;
        outletId: string | null;
        dateRange: any;
    }>({
        companyId: searchParams.get('organization'),
        businessUnitId: null,
        outletId: null,
        dateRange: undefined
    });

    // View State Logic
    const isPlatformView = isSuperAdmin(currentRole) && !filters.companyId;
    const isCompanyView = !!filters.companyId && !filters.businessUnitId;
    const isBuOrOutletView = !!filters.businessUnitId;

    // 1. Platform Stats
    const { data: platformStats, isLoading: platformLoading } = useGetDashboardStatsQuery({}, {
        skip: !isPlatformView,
        refetchOnMountOrArgChange: true
    });

    // 2. Organization Stats
    const { data: companyStats, isLoading: companyLoading } = useGetOrganizationDashboardStatsQuery(
        filters.companyId || "",
        {
            skip: !isCompanyView,
            refetchOnMountOrArgChange: true
        }
    );

    // 3. BU / Outlet Stats
    const { data: buStats, isLoading: buLoading } = useGetBusinessUnitDashboardStatsQuery(
        {
            businessUnitId: filters.businessUnitId || "",
            outletId: filters.outletId || undefined
        },
        {
            skip: !isBuOrOutletView,
            refetchOnMountOrArgChange: true
        }
    );

    const activeStats = isPlatformView ? platformStats : (isCompanyView ? companyStats : buStats);
    const activeLoading = isPlatformView ? platformLoading : (isCompanyView ? companyLoading : buLoading);

    const formatCurrency = (amount: number | undefined) => {
        return `৳ ${(amount || 0).toLocaleString('en-BD', { minimumFractionDigits: 2 })}`;
    };

    const normalizedStats = {
        // Platform
        revenue: formatCurrency(activeStats?.revenue?.total ?? (typeof activeStats?.revenue === 'number' ? activeStats?.revenue : 0)),
        activeCompanies: activeStats?.companies?.active ?? activeStats?.activeCompanies ?? "0",
        activeUnits: activeStats?.businessUnits?.active ?? activeStats?.activeUnits ?? "0",
        totalUsers: activeStats?.users?.total ?? activeStats?.totalUsers ?? "0",
        // Commerce
        totalSales: formatCurrency(activeStats?.totalSales),
        net: formatCurrency(activeStats?.net),
        invoiceDue: formatCurrency(activeStats?.invoiceDue),
        totalSellReturn: formatCurrency(activeStats?.totalSellReturn),
        totalPurchase: formatCurrency(activeStats?.totalPurchase),
        purchaseDue: formatCurrency(activeStats?.purchaseDue),
        totalPurchaseReturn: formatCurrency(activeStats?.totalPurchaseReturn),
        expense: formatCurrency(activeStats?.expense),
    };

    if (!isSuperAdmin(currentRole) && !isOrganizationOwner(currentRole)) {
        return (
            <div className="p-6">
                <h1 className="text-2xl font-bold">Access Restricted</h1>
                <p className="text-muted-foreground">Access denied.</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Filter Bar */}
            <div className="flex justify-center">
                <DashboardFilterBar onFilterChange={setFilters} />
            </div>

            {/* Metric Cards */}
            {activeLoading && !activeStats ? (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    {[1, 2, 3, 4, 5, 6, 7, 8].map(i => <div key={i} className="h-28 bg-muted animate-pulse rounded-xl" />)}
                </div>
            ) : (
                isPlatformView ? (
                    <PlatformMetricCards stats={normalizedStats} />
                ) : (
                    <MetricCards stats={normalizedStats} />
                )
            )}

            {/* View Specific Content */}
            {isPlatformView ? (
                /* PLATFORM VIEW */
                <>
                    <div className="grid grid-cols-1 lg:grid-cols-7 gap-6">
                        <GrowthChart title="Global Platform Growth" />
                        <div className="col-span-1 lg:col-span-3">
                            <SubscriptionOverview />
                        </div>
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-7 gap-6">
                        <div className="col-span-1 lg:col-span-4">
                            <TopPerformers title="Top Performing Companies" />
                        </div>
                        <div className="col-span-1 lg:col-span-3">
                            <SupportTicketStats />
                        </div>
                    </div>
                </>
            ) : (
                /* COMMERCE VIEW (Organization/BU/Outlet) */
                <>
                    <div className="grid grid-cols-1 lg:grid-cols-7 gap-6">
                        <GrowthChart title="Platform Revenue Growth" />
                        <div className="col-span-1 lg:col-span-3">
                            <FinancialSummary stats={normalizedStats} />
                        </div>
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-7 gap-6">
                        <div className="col-span-1 lg:col-span-4">
                            {isCompanyView ? <TopPerformers title="Top Business Units" /> : <TopPerformers title="Top Outlets" />}
                        </div>
                        <div className="col-span-1 lg:col-span-3">
                            {isCompanyView ? <SubscriptionOverview /> : <ModuleUsageStats />}
                        </div>
                    </div>
                </>
            )}

            {/* Shared Bottom Row (Health, Logs, Activity) */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="col-span-1 lg:col-span-2 bg-card p-6 rounded-xl shadow-sm border border-border">
                    <h2 className="text-lg font-semibold mb-4">Contextual Actions</h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {isPlatformView && (
                            <button onClick={() => router.push(`/platform/companies/add?organization=${filters.companyId || ''}`)} className="flex items-center justify-between p-3 text-sm font-medium text-primary bg-primary/5 border border-primary/20 rounded-lg hover:bg-primary/10 transition-colors">
                                <span>Add Organization</span> <Plus className="w-4 h-4" />
                            </button>
                        )}
                        {!isPlatformView && (
                            <button onClick={() => router.push(`/platform/business-units/new?organization=${filters.companyId || ''}`)} className="flex items-center justify-between p-3 text-sm font-medium text-primary bg-primary/5 border border-primary/20 rounded-lg hover:bg-primary/10 transition-colors">
                                <span>Add Business Unit</span> <Plus className="w-4 h-4" />
                            </button>
                        )}
                        <button onClick={() => router.push(`/platform/user-management/business-users/add?organization=${filters.companyId || ''}`)} className="flex items-center justify-between p-3 text-sm font-medium text-emerald-600 bg-emerald-50 border border-emerald-100 rounded-lg hover:bg-emerald-100 transition-colors">
                            <span>Add staff</span> <Plus className="w-4 h-4" />
                        </button>
                        <button onClick={() => router.push(`/platform/system/audit-logs?organization=${filters.companyId || ''}`)} className="flex items-center justify-between p-3 text-sm font-medium text-muted-foreground bg-muted/50 rounded-lg hover:bg-muted transition-colors">
                            <span>Audit Logs</span> <Shield className="w-4 h-4" />
                        </button>
                    </div>
                </div>
                <SystemHealth />
            </div>

            <RecentActivity />
        </div>
    );
}
