"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Bar, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts"
import { DollarSign, Plus, ShoppingCart, TrendingUp, Users } from "lucide-react"
import { useGetOutletsQuery } from "@/redux/api/organization/outletApi"
import { useGetBusinessUnitByIdQuery, useGetBusinessUnitDashboardStatsQuery } from "@/redux/api/organization/businessUnitApi"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

const data = [
    { name: "Jan", total: 1200 },
    { name: "Feb", total: 2100 },
    { name: "Mar", total: 1800 },
    { name: "Apr", total: 2400 },
    { name: "May", total: 3200 },
    { name: "Jun", total: 3800 },
]

interface BusinessUnitDashboardProps {
    slug: string;
}

export default function BusinessUnitDashboard({ slug }: BusinessUnitDashboardProps) {
    const [selectedOutletId, setSelectedOutletId] = useState<string>("all")

    // 1. Fetch Business Unit Details to get ID (if param is slug)
    // Using `skip` is handled in query hook if needed, but passing slug directly is fine if API handles it.
    // Based on previous code, we just passed the param.
    const { data: buData } = useGetBusinessUnitByIdQuery(slug, {
        skip: !slug
    })

    // Extract real ID
    const businessUnitId = buData?._id || buData?.id;

    // 2. Fetch Outlets using the resolved ID
    const { data: outletData, isLoading: outletsLoading } = useGetOutletsQuery({
        businessUnit: businessUnitId,
        limit: 100,
    }, {
        skip: !businessUnitId
    })

    const outlets = Array.isArray(outletData) ? outletData : (outletData?.data?.result || outletData?.result || [])

    const { data: stats, isLoading: statsLoading } = useGetBusinessUnitDashboardStatsQuery({
        businessUnitId: businessUnitId,
        outletId: selectedOutletId === 'all' ? undefined : selectedOutletId
    }, {
        skip: !businessUnitId
    })

    const formatCurrency = (amount: number = 0) => {
        return new Intl.NumberFormat('en-BD', { style: 'currency', currency: 'BDT' }).format(amount)
    }

    if (!slug) return null;

    return (
        <div className="space-y-6 container mx-auto py-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1">
                    <h1 className="text-3xl font-bold tracking-tight">Business Overview</h1>
                    <p className="text-muted-foreground">
                        High-level insights across all business units.
                    </p>
                </div>

                <div className="w-[200px]">
                    <Select
                        value={selectedOutletId}
                        onValueChange={setSelectedOutletId}
                        disabled={outletsLoading || statsLoading}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Filter by Outlet" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Outlets</SelectItem>
                            {outlets.map((outlet: any) => (
                                <SelectItem key={outlet._id} value={outlet._id}>
                                    {outlet.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{statsLoading ? "..." : formatCurrency(stats?.revenue)}</div>
                        <p className="text-xs text-muted-foreground">+20.1% from last month</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Active Sales</CardTitle>
                        <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{statsLoading ? "..." : (stats?.activeSales || 0)}</div>
                        <p className="text-xs text-muted-foreground">+180.1% from last month</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Active Users</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{statsLoading ? "..." : (stats?.activeUsers || 0)}</div>
                        <p className="text-xs text-muted-foreground">+19% from last month</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Growth</CardTitle>
                        <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{statsLoading ? "..." : (stats?.growth || 0)}%</div>
                        <p className="text-xs text-muted-foreground">+201 since last hour</p>
                    </CardContent>
                </Card>
            </div>

            {/* Quick Actions Row */}
            <div className="bg-card p-6 rounded-xl shadow-sm border border-border">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold flex items-center gap-2">
                        <Users className="w-5 h-5 text-primary" />
                        Quick Management
                    </h2>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    <button
                        onClick={() => window.location.href = `/${slug}/user-management/business-users/add`}
                        className="flex flex-col items-center justify-center p-4 hover:bg-emerald-50 border border-transparent hover:border-emerald-100 rounded-xl transition-all group"
                    >
                        <div className="w-10 h-10 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                            <Plus className="w-5 h-5" />
                        </div>
                        <span className="text-xs font-medium text-emerald-700">Add Staff</span>
                    </button>
                    {/* Placeholder for future actions */}
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-4">
                    <CardHeader>
                        <CardTitle>Revenue Overview</CardTitle>
                    </CardHeader>
                    <CardContent className="pl-2">
                        <ResponsiveContainer width="100%" height={350}>
                            <BarChart data={data}>
                                <XAxis
                                    dataKey="name"
                                    stroke="#888888"
                                    fontSize={12}
                                    tickLine={false}
                                    axisLine={false}
                                />
                                <YAxis
                                    stroke="#888888"
                                    fontSize={12}
                                    tickLine={false}
                                    axisLine={false}
                                    tickFormatter={(value: number) => `$${value}`}
                                />
                                <Tooltip cursor={{ fill: 'transparent' }} />
                                <Bar dataKey="total" fill="#8884d8" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
                <Card className="col-span-3">
                    <CardHeader>
                        <CardTitle>Recent Sales</CardTitle>
                        <CardDescription>
                            You made 265 sales this month.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-8">
                            <div className="flex items-center">
                                <div className="ml-4 space-y-1">
                                    <p className="text-sm font-medium leading-none">Olivia Martin</p>
                                    <p className="text-sm text-muted-foreground">olivia.martin@email.com</p>
                                </div>
                                <div className="ml-auto font-medium">+$1,999.00</div>
                            </div>
                            <div className="flex items-center">
                                <div className="ml-4 space-y-1">
                                    <p className="text-sm font-medium leading-none">Jackson Lee</p>
                                    <p className="text-sm text-muted-foreground">jackson.lee@email.com</p>
                                </div>
                                <div className="ml-auto font-medium">+$39.00</div>
                            </div>
                            <div className="flex items-center">
                                <div className="ml-4 space-y-1">
                                    <p className="text-sm font-medium leading-none">Isabella Nguyen</p>
                                    <p className="text-sm text-muted-foreground">isabella.nguyen@email.com</p>
                                </div>
                                <div className="ml-auto font-medium">+$299.00</div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

