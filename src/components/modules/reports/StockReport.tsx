"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Package } from "lucide-react"
import { usePermissions } from "@/hooks/usePermissions"
import { PERMISSION_KEYS } from "@/config/permission-keys"
import { DataTable } from "@/components/shared/DataTable"
import { useGetStockSummaryQuery } from "@/redux/api/erp/reports/stockReportApi"

export default function StockReport() {
    const { hasPermission } = usePermissions();
    const { data: reportData, isLoading } = useGetStockSummaryQuery({});

    // Safe casting for data access
    const tableData = Array.isArray((reportData as any)?.data) ? (reportData as any).data : (Array.isArray(reportData) ? reportData : []);

    const columns = [
        { accessorKey: "productName", header: "Product" },
        { accessorKey: "sku", header: "SKU" },
        { accessorKey: "currentStock", header: "Current Stock" },
        { accessorKey: "value", header: "Stock Value" }
    ];

    if (!hasPermission(PERMISSION_KEYS.STOCK_REPORT.READ)) {
        return <div className="p-4 text-center text-muted-foreground">You do not have permission to view stock reports.</div>
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Package className="h-5 w-5" />
                    Stock Reports
                </CardTitle>
                <CardDescription>Inventory valuation and stock levels.</CardDescription>
            </CardHeader>
            <CardContent>
                <DataTable
                    columns={columns}
                    data={tableData}
                    isLoading={isLoading}
                    searchKey="productName"
                />
            </CardContent>
        </Card>
    )
}
