"use client";

import { useState } from "react";
import { useRouter, useParams, usePathname } from "next/navigation";
import { Store, MapPin, Phone, MoreHorizontal, Edit, Trash2, CheckCircle, XCircle, Search, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useDeleteOutletMutation, useGetOutletQuery, useGetOutletsQuery } from "@/redux/api/organization/outletApi";
import { useGetBusinessUnitsQuery } from "@/redux/api/organization/businessUnitApi";
import Swal from "sweetalert2";
import { DataTable } from "@/components/shared/DataTable";
import { DataPageLayout } from "@/components/shared/DataPageLayout";
import { ColumnDef } from "@tanstack/react-table";
import { StatCard } from "@/components/shared/StatCard";
import { TabsContent } from "@/components/ui/tabs";

interface Outlet {
    _id: string;
    name: string;
    code: string;
    address: string;
    city: string;
    country: string;
    phone: string;
    email?: string;
    isActive: boolean;
    businessUnit: string | { _id: string, name: string };
}

export default function OutletListPage() {
    const router = useRouter();
    const pathname = usePathname();
    const params = useParams();
    const businessUnit = params["business-unit"] as string;
    const [searchTerm, setSearchTerm] = useState("");
    const [activeTab, setActiveTab] = useState("all");

    // RTK Query
    // Assuming backend supports filtering by businessUnit via query params
    // 1. Resolve Slug to ID (Robustness)
    const { data: bUnitsData } = useGetBusinessUnitsQuery(undefined);
    const businessUnits = Array.isArray(bUnitsData) ? bUnitsData : (bUnitsData || []);

    // Find matching BU
    const matchedBU = businessUnits?.find((bu: any) =>
        bu.id === businessUnit ||
        bu._id === businessUnit ||
        bu.slug === businessUnit
    );

    const resolveBuId = matchedBU?._id || matchedBU?.id || businessUnit;

    const { data: outletsResult, isLoading, refetch } = useGetOutletsQuery(
        { businessUnit: resolveBuId },
        { skip: !resolveBuId } // Skip if no ID yet (though slug fallback exists)
    );
    const [deleteOutlet] = useDeleteOutletMutation();

    // Handle data structure (support array or object with data/result property)
    const outlets: Outlet[] = Array.isArray(outletsResult) ? outletsResult :
        (outletsResult?.data || outletsResult?.result || []);

    const handleDelete = async (id: string) => {
        const result = await Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!"
        });

        if (result.isConfirmed) {
            try {
                const res: any = await deleteOutlet(id).unwrap();
                if (res?.success) {
                    Swal.fire({
                        title: "Deleted!",
                        text: "Outlet has been deleted.",
                        icon: "success",
                        timer: 2000,
                        showConfirmButton: false
                    });
                }
            } catch (error) {
                console.error("Delete failed", error);
                Swal.fire("Error!", "Failed to delete outlet.", "error");
            }
        }
    };

    const filterOutlets = (status: string) => {
        let filtered = outlets;

        if (searchTerm) {
            const lower = searchTerm.toLowerCase();
            filtered = filtered.filter(u =>
                u.name.toLowerCase().includes(lower) ||
                u.code.toLowerCase().includes(lower) ||
                u.city.toLowerCase().includes(lower)
            );
        }

        if (status === "all") return filtered;
        if (status === "active") return filtered.filter(u => u.isActive);
        if (status === "inactive") return filtered.filter(u => !u.isActive);

        return filtered;
    };

    // Define Columns
    const columns: ColumnDef<Outlet>[] = [
        {
            accessorKey: "name",
            header: "Outlet Name",
            cell: ({ row }) => (
                <div className="flex flex-col">
                    <span className="font-medium">{row.original.name}</span>
                    <span className="text-xs text-muted-foreground">Code: {row.original.code}</span>
                </div>
            ),
        },
        {
            id: "location",
            header: "Location",
            cell: ({ row }) => (
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <MapPin className="h-3 w-3" />
                    {row.original.address}, {row.original.city}
                </div>
            ),
        },
        {
            id: "businessUnit",
            header: "Business Unit",
            cell: ({ row }) => {
                const bu = row.original.businessUnit;
                return (
                    <div className="flex items-center gap-1 text-sm font-medium">
                        {typeof bu === 'object' ? bu.name : 'N/A'}
                    </div>
                );
            },
        },
        {
            id: "contact",
            header: "Contact",
            cell: ({ row }) => (
                <div className="flex flex-col text-sm">
                    <span className="flex items-center gap-1"><Phone className="h-3 w-3" /> {row.original.phone}</span>
                    {row.original.email && (
                        <span className="flex items-center gap-1"><Mail className="h-3 w-3" /> {row.original.email}</span>
                    )}
                </div>
            ),
        },
        {
            accessorKey: "isActive",
            header: "Status",
            cell: ({ row }) => (
                <Badge variant={row.original.isActive ? "default" : "secondary"}>
                    {row.original.isActive ? "Active" : "Inactive"}
                </Badge>
            ),
        },
        {
            id: "actions",
            header: "Actions",
            cell: ({ row }) => (
                <div className="flex justify-end gap-2">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem onClick={() => router.push(`${pathname}/${row.original._id}`)}>
                                <Store className="mr-2 h-4 w-4" /> Dashboard
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => router.push(`${pathname}/${row.original._id}/edit`)}>
                                <Edit className="mr-2 h-4 w-4" /> Edit Details
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                className="text-destructive focus:text-destructive"
                                onClick={() => handleDelete(row.original._id)}
                            >
                                <Trash2 className="mr-2 h-4 w-4" /> Delete
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            ),
        },
    ];

    return (
        <DataPageLayout
            title="Outlets"
            description="Manage your physical Outlet locations."
            createAction={{
                label: "Add Outlet",
                onClick: () => {
                    router.push(`${pathname}/new`);
                }
            }}
            extraFilters={
                <div className="relative flex-1 max-w-sm ml-auto">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search outlets..."
                        className="pl-8"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            }
            stats={
                <div className="grid gap-4 md:grid-cols-3">
                    <StatCard
                        title="Total Outlets"
                        icon={Store}
                        value={outlets.length}
                    />
                    <StatCard
                        title="Active Outlets"
                        icon={CheckCircle}
                        value={outlets.filter(u => u.isActive).length}
                    />
                    <StatCard
                        title="Inactive Outlets"
                        icon={XCircle}
                        value={outlets.filter(u => !u.isActive).length}
                    />
                </div>
            }
            tabs={[
                { value: "all", label: "All Outlets" },
                { value: "active", label: "Active" },
                { value: "inactive", label: "Inactive" },
            ]}
            activeTab={activeTab}
            onTabChange={setActiveTab}
        >
            <TabsContent value="all" className="mt-0">
                <DataTable columns={columns} data={filterOutlets("all")} isLoading={isLoading} />
            </TabsContent>
            <TabsContent value="active" className="mt-0">
                <DataTable columns={columns} data={filterOutlets("active")} isLoading={isLoading} />
            </TabsContent>
            <TabsContent value="inactive" className="mt-0">
                <DataTable columns={columns} data={filterOutlets("inactive")} isLoading={isLoading} />
            </TabsContent>
        </DataPageLayout>
    );
}
