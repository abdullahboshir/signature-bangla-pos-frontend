"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ShoppingCart } from "lucide-react"
import { usePermissions } from "@/hooks/usePermissions"
import { PERMISSION_KEYS } from "@/config/permission-keys"
import { DataTable } from "@/components/shared/DataTable"
import { useGetPurchaseSummaryQuery } from "@/redux/api/erp/reports/purchaseReportApi"

export default function PurchaseReport() {
    const { hasPermission } = usePermissions();
    const { data: reportData, isLoading } = useGetPurchaseSummaryQuery({});

    // Safe casting for data access
    const tableData = Array.isArray((reportData as any)?.data) ? (reportData as any).data : (Array.isArray(reportData) ? reportData : []);

    const columns = [
        { accessorKey: "date", header: "Date" },
        { accessorKey: "totalPurchases", header: "Total Purchases" },
        { accessorKey: "itemsPurchased", header: "Items Count" },
        { accessorKey: "supplier", header: "Supplier" }
    ];

    if (!hasPermission(PERMISSION_KEYS.PURCHASE_REPORT.READ)) {
        return <div className="p-4 text-center text-muted-foreground">You do not have permission to view purchase reports.</div>
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <ShoppingCart className="h-5 w-5" />
                    Purchase Reports
                </CardTitle>
                <CardDescription>Purchase history and supplier analysis.</CardDescription>
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
