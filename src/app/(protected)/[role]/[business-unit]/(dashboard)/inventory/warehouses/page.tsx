"use client";

import { useGetAllOutletsQuery } from "@/redux/api/outletApi";
import { DataTable } from "@/components/shared/DataTable";
import { DataPageLayout } from "@/components/shared/DataPageLayout";
import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";

export default function WarehousePage() {
    // Reuse outlet API to list warehouses/outlets
    const { data: outlets = [], isLoading } = useGetAllOutletsQuery({});

    const columns: ColumnDef<any>[] = [
        {
            accessorKey: "name",
            header: "Name",
        },
        {
            accessorKey: "address",
            header: "Address",
        },
        {
            accessorKey: "phone",
            header: "Phone",
        },
        {
            accessorKey: "isActive",
            header: "Status",
            cell: ({ row }) => (
                <Badge variant={row.original.isActive ? "default" : "secondary"}>
                    {row.original.isActive ? "Active" : "Inactive"}
                </Badge>
            )
        }
    ];

    return (
        <DataPageLayout
            title="Warehouses & Outlets"
            description="Manage your inventory locations."
        >
            <DataTable columns={columns} data={outlets} isLoading={isLoading} />
        </DataPageLayout>
    );
}
