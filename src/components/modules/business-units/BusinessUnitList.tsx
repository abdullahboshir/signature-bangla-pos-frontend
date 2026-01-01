"use client";

import { useGetBusinessUnitsQuery } from "@/redux/api/organization/businessUnitApi";
import { DataTable } from "@/components/shared/DataTable";
import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Edit, Trash, Store, ArrowRight, Eye } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useCurrentRole } from "@/hooks/useCurrentRole";
import { DataPageLayout } from "@/components/shared/DataPageLayout";

export default function BusinessUnitList() {
    const { data: rawUnits, isLoading } = useGetBusinessUnitsQuery({}) as any;
    const router = useRouter();
    const params = useParams();
    const { currentRole } = useCurrentRole();
    const role = currentRole as string;

    const businessUnits = Array.isArray(rawUnits) ? rawUnits : (rawUnits?.data || rawUnits?.result || []);

    const columns: ColumnDef<any>[] = [
        {
            accessorKey: "name",
            header: "Name & Identity",
            cell: ({ row }) => (
                <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                        <Store className="h-4 w-4 text-primary" />
                        <span className="font-semibold">{row.original.name}</span>
                    </div>
                    <span className="text-xs text-muted-foreground ml-6">{row.original.slug}</span>
                </div>
            )
        },
        {
            accessorKey: "operationalModel",
            header: "Model & Industry",
            cell: ({ row }) => (
                <div className="flex flex-col gap-1">
                    <Badge variant="outline" className="w-fit">{row.original.operationalModel || "Retail"}</Badge>
                    <span className="text-xs text-muted-foreground capitalize">{row.original.industry || "General"}</span>
                </div>
            )
        },
        {
            accessorKey: "contact",
            header: "Contact",
            cell: ({ row }) => (
                <div className="flex flex-col text-sm">
                    <span>{row.original.contact?.email}</span>
                    <span className="text-xs text-muted-foreground">{row.original.contact?.phone}</span>
                </div>
            )
        },
        {
            accessorKey: "location",
            header: "Location",
            cell: ({ row }) => (
                <div className="text-sm">
                    {row.original.location?.city ? `${row.original.location.city}, ${row.original.location.country}` : "Global"}
                </div>
            )
        },
        {
            accessorKey: "status",
            header: "Status",
            cell: ({ row }) => {
                const status = row.original.status || "draft";
                const colors: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
                    published: "default",
                    draft: "secondary",
                    suspended: "destructive",
                    archived: "outline"
                };
                return <Badge variant={colors[status]}>{status}</Badge>
            }
        },
        {
            id: "actions",
            cell: ({ row }) => {
                const unit = row.original;
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
                            <DropdownMenuItem onClick={() => router.push(`/${unit.slug}/overview`)}>
                                <Eye className="mr-2 h-4 w-4" /> View Dashboard
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => router.push(`/global/business-units/${unit.id}/edit`)}>
                                <Edit className="mr-2 h-4 w-4" /> Edit Details
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-red-500">
                                <Trash className="mr-2 h-4 w-4" /> Delete Unit
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                )
            }
        }
    ];

    return (
        <DataPageLayout
            title="Business Units"
            description="Manage your business units and subsidiaries."
            createAction={{
                label: "Add Business Unit",
                onClick: () => router.push(`/global/business-units/new`)
            }}
        >
            <DataTable
                columns={columns}
                data={businessUnits}
                isLoading={isLoading}
            />
        </DataPageLayout>
    );
}

