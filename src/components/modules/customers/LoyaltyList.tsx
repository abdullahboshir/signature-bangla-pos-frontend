"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DataTable } from "@/components/shared/DataTable"
import { Award, Plus } from "lucide-react"
import { usePermissions } from "@/hooks/usePermissions"
import { PERMISSION_KEYS } from "@/config/permission-keys"
import { ColumnDef } from "@tanstack/react-table"

export default function LoyaltyList() {
    const { hasPermission } = usePermissions();

    const data: any[] = [];
    const isLoading = false;

    const columns: ColumnDef<any>[] = [
        {
            accessorKey: "customer",
            header: "Customer",
        },
        {
            accessorKey: "points",
            header: "Points Balance",
        },
        {
            accessorKey: "tier",
            header: "Tier",
        }
    ];

    if (!hasPermission(PERMISSION_KEYS.LOYALTY.READ)) {
        return <div className="p-4 text-center text-muted-foreground">You do not have permission to view loyalty programs.</div>
    }

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle className="flex items-center gap-2">
                        <Award className="h-5 w-5" />
                        Loyalty Program
                    </CardTitle>
                    <CardDescription>Manage customer loyalty points and tiers.</CardDescription>
                </div>
                {/* Assuming CREATE/MANAGE permissions exist */}
                <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Adjust Points
                </Button>
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
