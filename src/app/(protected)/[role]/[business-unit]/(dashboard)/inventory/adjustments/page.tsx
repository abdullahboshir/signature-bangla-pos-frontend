"use client";

import { useGetAdjustmentsQuery } from "@/redux/api/inventoryApi";
import { DataTable } from "@/components/shared/DataTable";
import { DataPageLayout } from "@/components/shared/DataPageLayout";
import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default function AdjustmentPage() {
    const { data, isLoading } = useGetAdjustmentsQuery({});
    const adjustments = data?.data || [];

    const columns: ColumnDef<any>[] = [
        {
            accessorKey: "referenceNo",
            header: "Reference",
        },
        {
            accessorKey: "date",
            header: "Date",
            cell: ({ row }) => format(new Date(row.original.date), "dd MMM yyyy, hh:mm a")
        },
        {
            accessorKey: "items",
            header: "Items",
            cell: ({ row }) => (
                <div className="space-y-1">
                    {row.original.items?.map((item: any, idx: number) => (
                        <div key={idx} className="text-xs">
                            <span className={item.type === 'increase' ? "text-green-600 font-bold" : "text-red-600 font-bold"}>
                                {item.type === 'increase' ? "+" : "-"}{item.quantity}
                            </span>
                            <span className="ml-1 text-muted-foreground">{item.product?.name}</span>
                        </div>
                    ))}
                </div>
            )
        },
        {
            accessorKey: "outlet.name",
            header: "Outlet",
            cell: ({ row }) => row.original.outlet?.name || "Global"
        },
        {
            accessorKey: "status",
            header: "Status",
            cell: ({ row }) => <Badge variant="outline">{row.original.status}</Badge>
        },
        {
            accessorKey: "adjustedBy",
            header: "Adjusted By",
            cell: ({ row }) => row.original.adjustedBy?.name || "System"
        }
    ];

    return (
        <DataPageLayout
            title="Stock Adjustments"
            description="Manage manual inventory corrections."
            extraFilters={
                <Button asChild size="sm">
                    <Link href="adjustments/new">
                        <Plus className="mr-2 h-4 w-4" />
                        New Adjustment
                    </Link>
                </Button>
            }
        >
            <DataTable columns={columns} data={adjustments} isLoading={isLoading} />
        </DataPageLayout>
    );
}
