"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useGetProfitLossQuery } from "@/redux/api/finance/reportApi"
import { TrendingUp, TrendingDown, DollarSign, Calendar } from "lucide-react"
import { useSearchParams } from "next/navigation"

export default function ProfitLossReport() {
    const searchParams = useSearchParams();
    // In a real app, we would have a date range picker component updating the URL params
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");

    const { data: report, isLoading } = useGetProfitLossQuery({ startDate, endDate });

    if (isLoading) return <div>Loading report...</div>;

    const netProfit = (report?.income || 0) - (report?.expense || 0);

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <ReportCard
                    title="Total Income"
                    value={report?.income || 0}
                    icon={<TrendingUp className="h-4 w-4 text-green-500" />}
                    className="border-green-100 bg-green-50/50"
                />
                <ReportCard
                    title="Total Expenses"
                    value={report?.expense || 0}
                    icon={<TrendingDown className="h-4 w-4 text-red-500" />}
                    className="border-red-100 bg-red-50/50"
                />
                <ReportCard
                    title="Net Profit"
                    value={netProfit}
                    icon={<DollarSign className="h-4 w-4 text-blue-500" />}
                    className={netProfit >= 0 ? "border-blue-100 bg-blue-50/50" : "border-red-100 bg-red-50/50"}
                />
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Profit & Loss Statement</CardTitle>
                    <CardDescription>Detailed breakdown of income and expenses.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="text-sm text-center text-muted-foreground py-10">
                        {/* Placeholder for detailed chart or table */}
                        Detailed breakdown visualization coming soon (Chart/Table).
                        <br />
                        Raw Data: Income {report?.income}, Expense {report?.expense}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

function ReportCard({ title, value, icon, className }: { title: string, value: number, icon: any, className?: string }) {
    return (
        <Card className={className}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{title}</CardTitle>
                {icon}
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">BDT {value.toLocaleString()}</div>
            </CardContent>
        </Card>
    )
}
