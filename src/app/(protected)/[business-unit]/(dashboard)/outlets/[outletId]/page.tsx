"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, ShoppingBag, AlertTriangle, MonitorSmartphone } from "lucide-react"
import { useParams } from "next/navigation"
import { useGetOutletStatsQuery, OutletStats } from "@/redux/api/organization/outletApi";

// Inline currency formatter if missing
const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-BD', {
        style: 'currency',
        currency: 'BDT',
    }).format(amount);
}

export default function OutletDashboard() {
    const params = useParams();
    const outletId = params.outletId as string;

    // Fetch real stats
    const { data, isLoading } = useGetOutletStatsQuery(outletId, {
        skip: !outletId
    });

    const stats = data as OutletStats | undefined;

    if (isLoading) {
        return <div className="p-8 text-center text-muted-foreground">Loading dashboard stats...</div>;
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Outlet Dashboard</h1>
                <p className="text-muted-foreground">
                    Overview for Outlet ID: {outletId}
                </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Today's Sales
                        </CardTitle>
                        <ShoppingBag className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {stats?.todaySales ? `৳ ${stats.todaySales.toLocaleString()}` : '৳ 0'}
                        </div>
                        <p className="text-xs text-muted-foreground">
                            {stats?.salesCount || 0} orders today
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Active Registers
                        </CardTitle>
                        <MonitorSmartphone className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats?.activeRegisters || 0}</div>
                        <p className="text-xs text-muted-foreground">
                            Counters Open
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Low Stock Items
                        </CardTitle>
                        <AlertTriangle className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats?.lowStockCount || 0}</div>
                        <p className="text-xs text-muted-foreground">
                            Require Attention
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Staff Active
                        </CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats?.activeStaff || 0}</div>
                        <p className="text-xs text-muted-foreground">
                            Currently clocked in
                        </p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-4">
                    <CardHeader>
                        <CardTitle>Recent Sales</CardTitle>
                    </CardHeader>
                    <CardContent className="pl-2">
                        <div className="h-[200px] flex items-center justify-center text-muted-foreground">
                            Chart Placeholder
                        </div>
                    </CardContent>
                </Card>
                <Card className="col-span-3">
                    <CardHeader>
                        <CardTitle>Register Status</CardTitle>
                        <CardDescription>
                            Cash handling summary
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="flex items-center">
                                <span className="flex-1 font-medium">Main Counter</span>
                                <span className={(stats?.activeRegisters || 0) > 0 ? "text-green-600" : "text-gray-400"}>
                                    {(stats?.activeRegisters || 0) > 0 ? "Open" : "Closed"}
                                </span>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
