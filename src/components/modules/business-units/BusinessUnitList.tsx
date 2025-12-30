"use client";

import { useGetBusinessUnitsQuery } from "@/redux/api/organization/businessUnitApi";
import { DataTable } from "@/components/shared/DataTable";
import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight, Store } from "lucide-react";
import { useRouter, useParams } from "next/navigation";
import { DataPageLayout } from "@/components/shared/DataPageLayout";
import { useCurrentRole } from "@/hooks/useCurrentRole";

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
            header: "Name",
            cell: ({ row }) => (
                <div className="flex items-center gap-2">
                    <Store className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">{row.original.name}</span>
                </div>
            )
        },
        {
            accessorKey: "slug",
            header: "ID / Slug",
            cell: ({ row }) => <Badge variant="outline">{row.original.slug}</Badge>
        },
        {
            accessorKey: "type",
            header: "Type",
            cell: ({ row }) => row.original.type || "Retail"
        },
        {
            id: "actions",
            cell: ({ row }) => (
                <Button variant="ghost" size="sm" onClick={() => router.push(`/${row.original.slug}/overview`)}>
                    View Dashboard <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
            )
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

