"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useGetAnalyticsQuery } from "@/redux/api/adminApi";

export default function AnalyticsPage() {
    // RTK Query
    const { data: analytics, isLoading: loading } = useGetAnalyticsQuery({});

    if (loading) {
        return (
            <div className="flex items-center justify-center h-96">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Analytics & Insights</h1>
                    <p className="text-gray-500 mt-1">System-wide performance metrics and trends</p>
                </div>
            </div>

            {/* Key Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <Card>
                    <CardHeader className="pb-2">
                        <CardDescription>Total Revenue</CardDescription>
                        <CardTitle className="text-2xl">BDT 0</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-xs text-muted-foreground">
                            <span className="text-green-600">+0%</span> from last month
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-2">
                        <CardDescription>Active Users</CardDescription>
                        <CardTitle className="text-2xl">0</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-xs text-muted-foreground">
                            <span className="text-blue-600">+0%</span> growth
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-2">
                        <CardDescription>Total Orders</CardDescription>
                        <CardTitle className="text-2xl">0</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-xs text-muted-foreground">All time</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-2">
                        <CardDescription>Conversion Rate</CardDescription>
                        <CardTitle className="text-2xl">0%</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-xs text-muted-foreground">
                            <span className="text-green-600">+0%</span> vs average
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Revenue Trend</CardTitle>
                        <CardDescription>Last 30 days performance</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="h-64 flex items-center justify-center text-gray-400">
                            <div className="text-center">
                                <p className="mb-2">📊</p>
                                <p>Chart will be implemented with Chart.js or Recharts</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>User Growth</CardTitle>
                        <CardDescription>New users over time</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="h-64 flex items-center justify-center text-gray-400">
                            <div className="text-center">
                                <p className="mb-2">📈</p>
                                <p>Chart will be implemented with Chart.js or Recharts</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Sales by Category</CardTitle>
                        <CardDescription>Top performing categories</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="h-64 flex items-center justify-center text-gray-400">
                            <div className="text-center">
                                <p className="mb-2">🥧</p>
                                <p>Pie chart placeholder</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Business Unit Performance</CardTitle>
                        <CardDescription>Comparative analysis</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="h-64 flex items-center justify-center text-gray-400">
                            <div className="text-center">
                                <p className="mb-2">📊</p>
                                <p>Bar chart placeholder</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-800">
                    <strong>Note:</strong> Analytics charts will be populated once the Sales/Orders module is implemented.
                    Mock data can be added for testing purposes.
                </p>
            </div>
        </div>
    );
}
