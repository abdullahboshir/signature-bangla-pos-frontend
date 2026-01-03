"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart3 } from "lucide-react"
import { usePermissions } from "@/hooks/usePermissions"
import { PERMISSION_KEYS } from "@/config/permission-keys"
import { DataTable } from "@/components/shared/DataTable"
import { useGetSalesSummaryQuery } from "@/redux/api/erp/reports/salesReportApi"

export default function SalesReport() {
    const { hasPermission } = usePermissions();
    const { data: reportData, isLoading } = useGetSalesSummaryQuery({});

    // Safe casting for data access
    const tableData = Array.isArray((reportData as any)?.data) ? (reportData as any).data : (Array.isArray(reportData) ? reportData : []);

    const columns = [
        { accessorKey: "date", header: "Date" },
        { accessorKey: "totalSales", header: "Total Sales" },
        { accessorKey: "totalOrders", header: "Orders" },
        { accessorKey: "netProfit", header: "Net Profit" }
    ];

    if (!hasPermission(PERMISSION_KEYS.SALES_REPORT.READ)) {
        return <div className="p-4 text-center text-muted-foreground">You do not have permission to view sales reports.</div>
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Sales Analysis
                </CardTitle>
                <CardDescription>Comprehensive sales performance reports.</CardDescription>
            </CardHeader>
            <CardContent>
                <DataTable
                    columns={columns}
                    data={tableData}
                    isLoading={isLoading}
                    searchKey="date"
                />
            </CardContent>
        </Card>
    )
}
