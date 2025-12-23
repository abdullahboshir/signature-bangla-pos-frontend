"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { Plus, Store, CheckCircle, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable } from "@/components/shared/DataTable";
import { useGetAllOutletsQuery, useDeleteOutletMutation } from "@/redux/api/outletApi";
import Swal from "sweetalert2";
import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Edit, Trash } from "lucide-react";

export default function GlobalOutletListPage() {
    const router = useRouter();
    const pathname = usePathname();

    // Fetch ALL outlets (pass undefined/null to get global list)
    const { data: outletsResult, isLoading, refetch } = useGetAllOutletsQuery(undefined);
    const [deleteOutlet] = useDeleteOutletMutation();

    // Handle data structure
    const outlets = Array.isArray(outletsResult) ? outletsResult : (outletsResult?.data || outletsResult?.result || []);

    const handleDelete = async (id: string) => {
        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!"
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await deleteOutlet(id).unwrap();
                    Swal.fire("Deleted!", "Outlet has been deleted.", "success");
                    refetch();
                } catch (error) {
                    Swal.fire("Error!", "Failed to delete outlet.", "error");
                }
            }
        });
    };

    const columns: ColumnDef<any>[] = [
        {
            accessorKey: "name",
            header: "Outlet Name",
            cell: ({ row }) => (
                <div>
                    <div className="font-medium">{row.original.name}</div>
                    <div className="text-xs text-muted-foreground">{row.original.code}</div>
                </div>
            )
        },
        {
            accessorKey: "businessUnit",
            header: "Business Unit",
            // Assuming populated or available, otherwise might need adjustment
            cell: ({ row }) => (
                <Badge variant="outline">{typeof row.original.businessUnit === 'object' ? row.original.businessUnit?.name : row.original.businessUnit}</Badge>
            )
        },
        {
            accessorKey: "address",
            header: "Location",
            cell: ({ row }) => (
                <div className="max-w-[200px] truncate" title={row.original.address}>
                    {row.original.city}, {row.original.country}
                </div>
            )
        },
        {
            accessorKey: "phone",
            header: "Contact",
        },
        {
            accessorKey: "isActive",
            header: "Status",
            cell: ({ row }) => (
                row.original.isActive
                    ? <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Active</Badge>
                    : <Badge variant="destructive">Inactive</Badge>
            )
        },
        {
            id: "actions",
            header: "Actions",
            cell: ({ row }) => {
                const outlet = row.original;
                return (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem onClick={() => router.push(`${pathname}/${outlet._id}/edit`)}>
                                <Edit className="mr-2 h-4 w-4" /> Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleDelete(outlet._id)} className="text-red-600">
                                <Trash className="mr-2 h-4 w-4" /> Delete
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                );
            },
        },
    ];

    // Stats
    const totalOutlets = outlets.length;
    const activeOutlets = outlets.filter((o: any) => o.isActive).length;
    const inactiveOutlets = totalOutlets - activeOutlets;

    return (
        <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
            <div className="flex items-center justify-between space-y-2">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">All Outlets</h2>
                    <p className="text-muted-foreground">
                        Manage physical Outlet locations across all Business Units.
                    </p>
                </div>
                <div className="flex items-center space-x-2">
                    <Button onClick={() => router.push(`${pathname}/new`)}>
                        <Plus className="mr-2 h-4 w-4" /> Add Outlet
                    </Button>
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Outlets</CardTitle>
                        <Store className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{totalOutlets}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Active Outlets</CardTitle>
                        <CheckCircle className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{activeOutlets}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Inactive Outlets</CardTitle>
                        <XCircle className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{inactiveOutlets}</div>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardContent className="p-0">
                    <DataTable
                        columns={columns}
                        data={outlets}
                        searchKey="name"
                        isLoading={isLoading}
                    />
                </CardContent>
            </Card>
        </div>
    );
}
