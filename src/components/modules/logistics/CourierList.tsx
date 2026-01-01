"use client"

import { useState } from "react"
import { CourierDialog } from "./CourierDialog"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DataTable } from "@/components/shared/DataTable"
import { Plus, Truck, Settings } from "lucide-react"
import { usePermissions } from "@/hooks/usePermissions"
import { PERMISSION_KEYS } from "@/config/permission-keys"
import { ColumnDef } from "@tanstack/react-table"
import { useGetAllCouriersQuery } from "@/redux/api/logistics/logisticsApi"
import { Badge } from "@/components/ui/badge"

export default function CourierList() {
    const { hasPermission } = usePermissions();
    const { data: courierData, isLoading } = useGetAllCouriersQuery({});
    const [dialogOpen, setDialogOpen] = useState(false);
    const [selectedCourier, setSelectedCourier] = useState<any>(null);

    const handleEdit = (courier: any) => {
        setSelectedCourier(courier);
        setDialogOpen(true);
    };

    const handleAdd = () => {
        setSelectedCourier(null);
        setDialogOpen(true);
    };

    const columns: ColumnDef<any>[] = [
        {
            accessorKey: "name",
            header: "Courier Name",
            cell: ({ row }) => (
                <div className="flex items-center gap-2">
                    <Truck className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">{row.original.name}</span>
                </div>
            )
        },
        {
            accessorKey: "providerId",
            header: "Provider ID",
        },
        {
            accessorKey: "isActive",
            header: "Status",
            cell: ({ row }) => (
                <Badge variant={row.original.isActive ? "default" : "secondary"}>
                    {row.original.isActive ? "Active" : "Inactive"}
                </Badge>
            )
        },
        {
            id: "actions",
            cell: ({ row }) => (
                <Button variant="ghost" size="icon" onClick={() => handleEdit(row.original)}>
                    <Settings className="h-4 w-4" />
                </Button>
            )
        }
    ];

    console.log("hasPermission(PERMISSION_KEYS.COURIER.READ)", PERMISSION_KEYS.COURIER.READ, hasPermission(PERMISSION_KEYS.COURIER.READ));
    console.log("hasPermission(PERMISSION_KEYS.COURIER.MANAGE)", hasPermission(PERMISSION_KEYS.COURIER.MANAGE));

    const canView = hasPermission(PERMISSION_KEYS.COURIER.READ) || hasPermission(PERMISSION_KEYS.COURIER.MANAGE);

    if (!canView) {
        return <div className="p-4 text-center text-muted-foreground">You do not have permission to view couriers.</div>
    }

    return (
        <>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                        <CardTitle className="flex items-center gap-2">
                            <Truck className="h-5 w-5" />
                            Courier Services
                        </CardTitle>
                        <CardDescription>Manage courier partners and integrations.</CardDescription>
                    </div>
                    {hasPermission(PERMISSION_KEYS.COURIER.CREATE) && (
                        <Button onClick={handleAdd}>
                            <Plus className="mr-2 h-4 w-4" />
                            Add Courier
                        </Button>
                    )}
                </CardHeader>
                <CardContent>
                    <DataTable
                        columns={columns}
                        data={courierData?.result || []}
                        isLoading={isLoading}
                    />
                </CardContent>
            </Card>

            <CourierDialog
                open={dialogOpen}
                onOpenChange={setDialogOpen}
                courier={selectedCourier}
            />
        </>
    )
}

