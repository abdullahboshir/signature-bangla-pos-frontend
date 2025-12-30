"use client";

import { useGetLedgerQuery } from "@/redux/api/inventory/inventoryApi";
import { DataTable } from "@/components/shared/DataTable";
import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

export default function LedgerList() {
    const { data, isLoading } = useGetLedgerQuery({});
    const ledger = data?.data || [];

    const columns: ColumnDef<any>[] = [
        {
            accessorKey: "date",
            header: "Date",
            cell: ({ row }) => format(new Date(row.original.date), "dd MMM yyyy, hh:mm a")
        },
        {
            accessorKey: "product.name",
            header: "Product",
        },
        {
            accessorKey: "type",
            header: "Type",
            cell: ({ row }) => <Badge variant="outline" className="capitalize">{row.original.type}</Badge>
        },
        {
            accessorKey: "quantity",
            header: "Qty Change",
            cell: ({ row }) => (
                <span className={row.original.quantity > 0 ? "text-green-600 font-bold" : "text-red-600 font-bold"}>
                    {row.original.quantity > 0 ? "+" : ""}{row.original.quantity}
                </span>
            )
        },
        {
            accessorKey: "balanceAfter",
            header: "Balance After",
            cell: ({ row }) => row.original.balanceAfter ?? "-"
        },
        {
            accessorKey: "reference",
            header: "Reference",
            cell: ({ row }) => (
                <div className="flex flex-col">
                    <span className="text-xs font-medium">{row.original.reference}</span>
                    <span className="text-[10px] text-muted-foreground">{row.original.referenceType}</span>
                </div>
            )
        },
        {
            accessorKey: "outlet.name",
            header: "Outlet",
            cell: ({ row }) => row.original.outlet?.name || "-"
        }
    ];

    return (
        <DataTable columns={columns} data={ledger} isLoading={isLoading} searchPlaceholder="Search ledger..." />
    );
}
