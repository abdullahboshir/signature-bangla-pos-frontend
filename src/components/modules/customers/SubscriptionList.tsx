"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DataTable } from "@/components/shared/DataTable"
import { Repeat, Plus } from "lucide-react"
import { usePermissions } from "@/hooks/usePermissions"
import { PERMISSION_KEYS } from "@/config/permission-keys"
import { ColumnDef } from "@tanstack/react-table"

export default function SubscriptionList() {
    const { hasPermission } = usePermissions();

    const data: any[] = [];
    const isLoading = false;

    const columns: ColumnDef<any>[] = [
        {
            accessorKey: "customer",
            header: "Customer",
        },
        {
            accessorKey: "plan",
            header: "Plan",
        },
        {
            accessorKey: "status",
            header: "Status",
        },
        {
            accessorKey: "nextBilling",
            header: "Next Billing",
        }
    ];

    if (!hasPermission(PERMISSION_KEYS.SUBSCRIPTION.READ)) {
        return <div className="p-4 text-center text-muted-foreground">You do not have permission to view subscriptions.</div>
    }

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle className="flex items-center gap-2">
                        <Repeat className="h-5 w-5" />
                        Subscriptions
                    </CardTitle>
                    <CardDescription>Manage recurring subscriptions.</CardDescription>
                </div>
                {hasPermission(PERMISSION_KEYS.SUBSCRIPTION.CREATE) && (
                    <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        Add Subscription
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
