"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import { format } from "date-fns";

import { useGetPurchasesQuery } from "@/redux/api/purchaseApi";

import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/shared/DataTable";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export function PurchaseList() {
    const router = useRouter();
    const params = useParams();
    // In global route 'inventory', this might be undefined or 'inventory' if caught by catch-all
    // logic depends on folder structure.
    const businessUnitParam = params["business-unit"] as string;
    const role = params["role"] as string;

    const isGlobal = businessUnitParam === 'inventory' || !businessUnitParam || (role === 'super-admin' && !businessUnitParam);
    const businessUnitId = !isGlobal ? businessUnitParam : undefined;

    const [searchTerm, setSearchTerm] = useState("");

    // Fetch Purchases
    // If businessUnitId is undefined, backend should ideally handle fetching all purchases or filtered by permission
    // Assuming backend supports fetching all if BU is not provided, or we might need to select a BU in global view?
    // For now, let's assume global view shows ALL purchases if no BU filter
    const { data: purchases = [], isLoading } = useGetPurchasesQuery({
        businessUnit: businessUnitId,
        searchTerm
    });

    const columns = [
        {
            accessorKey: "purchaseDate",
            header: "Date",
            cell: ({ row }: any) => format(new Date(row.original.purchaseDate || new Date()), "dd MMM yyyy"),
        },
        {
            accessorKey: "id",
            header: "Purchase ID",
        },
        {
            accessorKey: "referenceNo",
            header: "Reference",
        },
        {
            accessorKey: "supplier.name",
            header: "Supplier",
            cell: ({ row }: any) => row.original.supplier?.name || "N/A",
        },
        {
            accessorKey: "status",
            header: "Status",
            cell: ({ row }: any) => {
                const status = row.original.status;
                return (
                    <Badge variant={status === "received" ? "default" : status === "ordered" ? "secondary" : "outline"}>
                        {status.toUpperCase()}
                    </Badge>
                );
            },
        },
        {
            accessorKey: "grandTotal",
            header: "Total",
            cell: ({ row }: any) => `৳${row.original.grandTotal?.toFixed(2)}`,
        },
        {
            id: "actions",
            cell: ({ row }: any) => (
                <Button variant="ghost" size="sm" onClick={() => {
                    // If global, we might want to navigate to a global detail view, or scoped? 
                    // Let's stick to the current context structure. 
                    // If isGlobal, maybe route to /role/inventory/purchase/id ? (need to create that too)
                    // Or simpler: /role/inventory/purchase/id
                    if (isGlobal) {
                        router.push(`/${role}/inventory/purchase/${row.original._id}`);
                    } else {
                        router.push(`/${role}/${businessUnitParam}/inventory/purchase/${row.original._id}`);
                    }
                }}>
                    View
                </Button>
            ),
        }
    ];

    const handleCreate = () => {
        if (isGlobal) {
            router.push(`/${role}/inventory/purchase/create`);
        } else {
            router.push(`/${role}/${businessUnitParam}/inventory/purchase/create`);
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Purchases</h2>
                    <p className="text-muted-foreground">{isGlobal ? "Manage all purchases across units." : "Manage inventory purchases and stock entries."}</p>
                </div>
                <Button onClick={handleCreate}>
                    <Plus className="mr-2 h-4 w-4" /> New Purchase
                </Button>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Purchase History</CardTitle>
                    <CardDescription>{isGlobal ? "All purchase orders." : "All purchase orders for this business unit."}</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center py-4">
                        <Input
                            placeholder="Search purchases..."
                            value={searchTerm}
                            onChange={(event) => setSearchTerm(event.target.value)}
                            className="max-w-sm"
                        />
                    </div>
                    <DataTable
                        columns={columns}
                        data={purchases}
                        isLoading={isLoading}
                    />
                </CardContent>
            </Card>
        </div>
    );
}
