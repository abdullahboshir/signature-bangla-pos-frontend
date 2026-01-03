"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp } from "lucide-react"
import { usePermissions } from "@/hooks/usePermissions"
import { PERMISSION_KEYS } from "@/config/permission-keys"
import { DataTable } from "@/components/shared/DataTable"
import { useGetProfitLossSummaryQuery } from "@/redux/api/erp/reports/profitLossApi"

export default function ProfitLossReport() {
    const { hasPermission } = usePermissions();
    const { data: reportData, isLoading } = useGetProfitLossSummaryQuery({});

    // Safe casting for data access
    const tableData = Array.isArray((reportData as any)?.data) ? (reportData as any).data : (Array.isArray(reportData) ? reportData : []);

    const columns = [
        { accessorKey: "period", header: "Period" },
        { accessorKey: "revenue", header: "Revenue" },
        { accessorKey: "cogs", header: "COGS" },
        { accessorKey: "grossProfit", header: "Gross Profit" },
        { accessorKey: "expenses", header: "Expenses" },
        { accessorKey: "netProfit", header: "Net Profit" }
    ];

    if (!hasPermission(PERMISSION_KEYS.PROFIT_LOSS_REPORT.READ)) {
        return <div className="p-4 text-center text-muted-foreground">You do not have permission to view profit & loss reports.</div>
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Profit & Loss
                </CardTitle>
                <CardDescription>Financial performance summary.</CardDescription>
            </CardHeader>
            <CardContent>
                <DataTable
                    columns={columns}
                    data={tableData}
                    isLoading={isLoading}
                    searchKey="period"
                />
            </CardContent>
        </Card>
    )
}
