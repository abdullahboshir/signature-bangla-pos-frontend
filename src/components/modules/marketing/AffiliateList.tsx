"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DataTable } from "@/components/shared/DataTable"
import { Share2, Plus } from "lucide-react"
import { usePermissions } from "@/hooks/usePermissions"
import { PERMISSION_KEYS } from "@/config/permission-keys"
import { ColumnDef } from "@tanstack/react-table"

export default function AffiliateList() {
    const { hasPermission } = usePermissions();

    const data: any[] = [];
    const isLoading = false;

    const columns: ColumnDef<any>[] = [
        {
            accessorKey: "name",
            header: "Affiliate Name",
        },
        {
            accessorKey: "referrals",
            header: "Referrals",
        },
        {
            accessorKey: "earnings",
            header: "Earnings",
        }
    ];

    if (!hasPermission(PERMISSION_KEYS.AFFILIATE.READ)) {
        return <div className="p-4 text-center text-muted-foreground">You do not have permission to view affiliates.</div>
    }

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle className="flex items-center gap-2">
                        <Share2 className="h-5 w-5" />
                        Affiliates
                    </CardTitle>
                    <CardDescription>Manage affiliate partners.</CardDescription>
                </div>
                {hasPermission(PERMISSION_KEYS.AFFILIATE.CREATE) && (
                    <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        Add Affiliate
                    </Button>
                )}
            </CardHeader>
            <CardContent>
                <DataTable
                    columns={columns}
                    data={data}
                    isLoading={isLoading}
                />
            </CardContent>
        </Card>
    )
}
