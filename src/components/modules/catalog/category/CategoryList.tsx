"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { Plus, Search, Pencil, Trash2, MoreHorizontal, ImageIcon } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";
import { ColumnDef } from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";

import { AutoFormModal } from "@/components/shared/AutoFormModal";
import { DataTable } from "@/components/shared/DataTable";
import { DataPageLayout } from "@/components/shared/DataPageLayout";

import { ICategory } from "@/types/catalog";
import {
    useGetCategoriesQuery,
    useCreateCategoryMutation,
    useUpdateCategoryMutation,
    useDeleteCategoryMutation
} from "@/redux/api/categoryApi";
import { useAuth } from "@/hooks/useAuth";
import { useGetBusinessUnitsQuery } from "@/redux/api/businessUnitApi";
import { usePermissions } from "@/hooks/usePermissions";
import { PERMISSION_KEYS } from "@/config/permission-keys";

export const CategoryList = () => {
    const params = useParams();
    const paramBusinessUnit = params["business-unit"] as string;
    const { user } = useAuth();
    const { hasPermission } = usePermissions();
    const isSuperAdmin = user?.roles?.some((r: any) => (typeof r === 'string' ? r : r.name) === 'super-admin');

    // Use the URL param for filtering if present. 
    // This allows Super Admin to see "scoped" view when inside a business unit.
    // If undefined (Global Root), it fetches all (or backend default).
    const businessUnit = paramBusinessUnit;

    const [search, setSearch] = useState("");
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState<ICategory | null>(null);

    // RTK Query Hooks
    const { data: categories = [], isLoading } = useGetCategoriesQuery({ businessUnit });
    const { data: businessUnits = [], isLoading: isLoadingBusinessUnits } = useGetBusinessUnitsQuery({ limit: 100 }, { skip: !isSuperAdmin });

    const [createCategory, { isLoading: isCreating }] = useCreateCategoryMutation();
    const [updateCategory, { isLoading: isUpdating }] = useUpdateCategoryMutation();
    const [deleteCategory] = useDeleteCategoryMutation();

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this category?")) return;
        try {
            await deleteCategory(id).unwrap();
            toast.success("Category deleted");
        } catch (error) {
            toast.error("Failed to delete category");
        }
    };

    const filteredCategories = (Array.isArray(categories) ? categories : []).filter((c: ICategory) =>
        c.name.toLowerCase().includes(search.toLowerCase())
    );

    // Define Columns
    const columns: ColumnDef<ICategory>[] = [
        {
            accessorKey: "image",
            header: "Image",
            cell: ({ row }) => (
                <Avatar className="h-9 w-9 rounded-lg border">
                    <AvatarImage src={row.original.image} alt={row.original.name} />
                    <AvatarFallback className="rounded-lg">
                        <ImageIcon className="h-4 w-4 text-muted-foreground" />
                    </AvatarFallback>
                </Avatar>
            ),
        },
        {
            accessorKey: "name",
            header: "Name",
            cell: ({ row }) => (
                <div className="flex flex-col">
                    <span className="font-medium">{row.original.name}</span>
                    <span className="text-xs text-muted-foreground">{row.original.slug}</span>
                </div>
            ),
        },
        {
            accessorKey: "description",
            header: "Description",
            cell: ({ row }) => (
                <span className="max-w-[300px] truncate block" title={row.original.description}>
                    {row.original.description || "—"}
                </span>
            ),
        },
        {
            accessorKey: "isActive",
            header: "Status",
            cell: ({ row }) => (
                <Badge variant={row.original.isActive ? "default" : "secondary"}>
                    {row.original.isActive ? 'Active' : 'Inactive'}
                </Badge>
            ),
        },
        {
            accessorKey: "businessUnit",
            header: "Business Unit",
            cell: ({ row }) => {
                const bu = row.original.businessUnit;
                if (!bu) return <span className="text-muted-foreground text-xs">Global</span>;
                return <span className="text-xs">{(typeof bu === 'object' && (bu as any).name) ? (bu as any).name : bu}</span>;
            },
        },
        {
            accessorKey: "createdAt",
            header: "Created At",
            cell: ({ row }) => row.original.createdAt ? format(new Date(row.original.createdAt), "MMM d, yyyy") : "-",
        },
        {
            id: "actions",
            header: "Actions",
            cell: ({ row }) => (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        {hasPermission(PERMISSION_KEYS.CATEGORY.UPDATE) && (
                            <DropdownMenuItem onClick={() => {
                                setEditingCategory(row.original);
                                setIsCreateOpen(true);
                            }}>
                                <Pencil className="mr-2 h-4 w-4" /> Edit
                            </DropdownMenuItem>
                        )}
                        {hasPermission(PERMISSION_KEYS.CATEGORY.DELETE) && (
                            <DropdownMenuItem onClick={() => handleDelete(row.original._id)} className="text-destructive">
                                <Trash2 className="mr-2 h-4 w-4" /> Delete
                            </DropdownMenuItem>
                        )}
                    </DropdownMenuContent>
                </DropdownMenu>
            ),
        },
    ];


    const getFields = () => {
        const fields: any[] = [
            { name: "name", label: "Name", type: "text", required: true, placeholder: "Category Name" },
            { name: "description", label: "Description", type: "textarea", placeholder: "Category Description" },
            { name: "image", label: "Category Image", type: "file", placeholder: "Upload Image", accept: "image/*" },
            {
                name: "isActive",
                label: "Status",
                type: "select",
                required: true,
                options: [
                    { label: "Active", value: "true" },
                    { label: "Inactive", value: "false" }
                ],
                defaultValue: "true"
            }
        ];

        if (isSuperAdmin) {
            let buOptions = [
                { label: "Global (No Business Unit)", value: "global" },
                ...businessUnits.map((bu: any) => ({
                    label: bu.name,
                    value: bu._id // Always use MongoID as value if available
                }))
            ];

            // If we are in a specific Business Unit context (URL has param), limit the options
            // to ONLY that Business Unit.
            if (paramBusinessUnit) {
                const currentBU = businessUnits.find((b: any) =>
                    b.id === paramBusinessUnit ||
                    b._id === paramBusinessUnit ||
                    b.slug === paramBusinessUnit
                );

                if (currentBU) {
                    buOptions = [{
                        label: currentBU.name,
                        value: currentBU._id
                    }];
                }
            }

            fields.push({
                name: "businessUnit",
                label: "Business Unit",
                type: "select",
                options: buOptions,
                placeholder: "Select Business Unit",
                disabled: !!paramBusinessUnit // Disable if context is fixed
            });
        }

        return fields;
    };

    const getDefaultValues = () => {
        if (editingCategory) {
            return {
                name: editingCategory.name,
                description: editingCategory.description,
                isActive: editingCategory.isActive ? "true" : "false",
                image: editingCategory.image,
                businessUnit: (editingCategory.businessUnit as any)?.id || (editingCategory.businessUnit as any)?._id || editingCategory.businessUnit || "global"
            };
        }

        // Find the ID for the current paramBusinessUnit (slug)
        // paramBusinessUnit is likely "BU-xxxx" (slug) or MongoID.
        // businessUnits array usually has: { _id: "mongoID", id: "BU-slug", name: "..." }
        const currentBU = businessUnits.find((b: any) =>
            b.id === paramBusinessUnit ||
            b._id === paramBusinessUnit ||
            b.slug === paramBusinessUnit // If slug field exists separately
        );

        // If found, use its _id (MongoID) as the value. Fallback to "global".
        const defaultBUValue = currentBU ? currentBU._id : "global";

        return {
            isActive: "true",
            businessUnit: isSuperAdmin ? defaultBUValue : paramBusinessUnit
        };
    };

    return (
        <div>
            <DataPageLayout
                title="Categories"
                description="Manage your product categories (Level 1)"
                createAction={hasPermission(PERMISSION_KEYS.CATEGORY.CREATE) ? {
                    label: "Add Category",
                    onClick: () => {
                        setEditingCategory(null);
                        setIsCreateOpen(true);
                    }
                } : undefined}
                extraFilters={
                    <div className="relative flex-1 max-w-sm min-w-[200px]">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search categories..."
                            className="pl-8"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                }
            >
                <DataTable columns={columns} data={filteredCategories} isLoading={isLoading} />
            </DataPageLayout>

            <AutoFormModal<any>
                key={isSuperAdmin ? businessUnits.length : 'static'} // Force re-render when business units load
                open={isCreateOpen}
                onOpenChange={setIsCreateOpen}
                title={editingCategory ? "Edit Category" : "Add New Category"}
                description="Manage your product categories."
                fields={getFields()}
                defaultValues={getDefaultValues()}
                onSubmit={async (data) => {
                    try {
                        const formData = new FormData();
                        formData.append("name", data.name);
                        formData.append("description", data.description || "");
                        formData.append("isActive", data.isActive === "true" ? "true" : "false");

                        // Handle Business Unit
                        let targetBU = "";

                        // If there is a URL param for Business Unit, we MUST use it.
                        // This applies to both Standard Users and Super Admins in a Scoped View.
                        // (The form field is disabled in this case, so data.businessUnit might be undefined).
                        if (paramBusinessUnit) {
                            // Helper to find the ID if we have the list loaded, otherwise send the slug (backend handles both)
                            const matched = businessUnits.find((b: any) => b.id === paramBusinessUnit || b._id === paramBusinessUnit || b.slug === paramBusinessUnit);
                            targetBU = matched ? matched._id : paramBusinessUnit;
                        } else {
                            // No param means we are in Global View (Super Admin only).
                            // Use the form selection.
                            targetBU = data.businessUnit;
                        }

                        if (targetBU === 'global') targetBU = "";

                        if (targetBU) {
                            formData.append("businessUnit", targetBU);
                        }

                        if (data.image instanceof File) {
                            formData.append("image", data.image);
                        }

                        if (editingCategory) {
                            await updateCategory({ id: editingCategory._id, body: formData }).unwrap();
                            toast.success("Category updated successfully");
                        } else {
                            await createCategory(formData).unwrap();
                            toast.success("Category created successfully");
                        }
                        setIsCreateOpen(false);
                        setEditingCategory(null);
                    } catch (error) {
                        console.error(error);
                        toast.error("Failed to save category");
                    }
                }}
                isLoading={isCreating || isUpdating}
                submitLabel={editingCategory ? "Update Category" : "Create Category"}
            />
        </div>
    );
}
