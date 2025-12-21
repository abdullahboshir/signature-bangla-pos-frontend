"use client";

import { useGetAllAttributeGroupsQuery, useDeleteAttributeGroupMutation } from "@/redux/api/attributeGroupApi";
import { DataTable } from "@/components/data-display/tables/DataTable";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Plus, Edit, Trash2 } from "lucide-react"; // Adjust lucide import if needed, checking other files
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";

export default function AttributeGroupsPage() {
    const { data: attributeGroups, isLoading } = useGetAllAttributeGroupsQuery(undefined);
    const [deleteAttributeGroup] = useDeleteAttributeGroupMutation();

    const handleDelete = async (id: string) => {
        try {
            await deleteAttributeGroup(id).unwrap();
            toast.success("Attribute Group deleted successfully");
        } catch (error) {
            toast.error("Failed to delete Attribute Group");
        }
    };

    const columns: ColumnDef<any>[] = [
        {
            accessorKey: "name",
            header: "Name",
        },
        {
            accessorKey: "fields",
            header: "Fields",
            cell: ({ row }) => {
                const fields = row.original.fields;
                return (
                    <div className="flex flex-wrap gap-1">
                        {fields.map((field: any) => (
                            <Badge key={field.key} variant="outline" className="text-xs">
                                {field.label}
                            </Badge>
                        ))}
                    </div>
                );
            },
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
            cell: ({ row }) => {
                const id = row.original._id || row.original.id;
                return (
                    <div className="flex gap-2">
                        <Link href={`/super-admin/catalog/attribute-groups/${id}`}>
                            <Button variant="ghost" size="icon">
                                <Edit className="w-4 h-4" />
                            </Button>
                        </Link>
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button variant="ghost" size="icon" className="text-destructive">
                                    <Trash2 className="w-4 h-4" />
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        This action cannot be undone. This will permanently delete the attribute group
                                        and remove it from our servers.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction onClick={() => handleDelete(id)}>Continue</AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </div>
                );
            },
        },
    ];

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Attribute Groups</h1>
                    <p className="text-muted-foreground">
                        Manage dynamic product attribute templates for different business types.
                    </p>
                </div>
                <Link href="/super-admin/catalog/attribute-groups/new">
                    <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        Create Group
                    </Button>
                </Link>
            </div>

            <DataTable
                columns={columns}
                data={attributeGroups?.data || []}
                isLoading={isLoading}
            />
        </div>
    );
}
