"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { Search, Pencil, Trash2, MoreHorizontal, ImageIcon } from "lucide-react";
import { toast } from "sonner";
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
import { ISubCategory } from "@/types/catalog";
import { format } from "date-fns";
import { DataTable } from "@/components/shared/DataTable";
import { DataPageLayout } from "@/components/shared/DataPageLayout";
import { ColumnDef } from "@tanstack/react-table";
import {
    useGetSubCategoriesQuery,
    useCreateSubCategoryMutation,
    useUpdateSubCategoryMutation,
    useDeleteSubCategoryMutation
} from "@/redux/api/subCategoryApi";
import { useGetCategoriesQuery } from "@/redux/api/categoryApi";
import { useAuth } from "@/hooks/useAuth";
import { useGetBusinessUnitsQuery } from "@/redux/api/businessUnitApi";
import { useCurrentBusinessUnit } from "@/hooks/useCurrentBusinessUnit";
import { usePermissions } from "@/hooks/usePermissions";
import { PERMISSION_KEYS } from "@/config/permission-keys";

export const SubCategoryList = () => {
    const { user } = useAuth();
    const { hasPermission } = usePermissions();
    const isSuperAdmin = user?.roles?.some((r: any) => (typeof r === 'string' ? r : r.name) === 'super-admin');
    const { currentBusinessUnit } = useCurrentBusinessUnit();
    const params = useParams();
    const paramBusinessUnit = params?.["business-unit"] as string;

    const [search, setSearch] = useState("");
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<ISubCategory | null>(null);

    // Use the URL param for filtering if present (Scoped View)
    // If undefined (Global Root), it fetches all (or backend default)
    const businessUnit = isSuperAdmin ? (paramBusinessUnit || undefined) : paramBusinessUnit;
    // Note: In CategoryList we ended up just using `paramBusinessUnit` directly for the query which worked well.
    // Let's stick to the effectiveListBU pattern but make sure it respects the param for SA too if we want filtered list.
    // Actually, for the LIST table, we want:
    // SA + Global Route -> Show All
    // SA + Scoped Route -> Show Scoped
    // User + Scoped Route -> Show Scoped
    const listQueryBU = paramBusinessUnit;

    // RTK Query Hooks
    const { data: subCategories = [], isLoading: isSubsLoading } = useGetSubCategoriesQuery({ businessUnit: listQueryBU });
    const { data: businessUnits = [] } = useGetBusinessUnitsQuery({ limit: 100 }, { skip: !isSuperAdmin });

    // For the CREATE FORM:
    // We need to fetch Parent Categories.
    // Logic: 
    // 1. If Scoped View (paramBusinessUnit) -> Fetch Categories for that BU + Global. (Backend handles 'Global' inclusion if we send BU ID)
    // 2. If Global View -> We initially load ALL categories? OR we wait for user to select BU?
    //    Ideally, if user selects BU, we filter categories. 
    //    For now, adhering to user request "global category show inside all", so fetching ALL categories is decent for Global view.
    //    But if user selects a BU, we might want to narrow it down? 
    //    Let's use `paramBusinessUnit` if present. If not, fetch all.
    const parentCategoriesQueryBU = paramBusinessUnit;

    // We fetch categories based on the context. 
    // Note: If we want dynamic filtering based on Form Selection in Global View, we'd need state. 
    // But for this specific fix (Scoped View), using paramBusinessUnit is key.
    const { data: categories = [] } = useGetCategoriesQuery({
        limit: 1000,
        businessUnit: parentCategoriesQueryBU
    });

    const [createSubCategory, { isLoading: isCreating }] = useCreateSubCategoryMutation();
    const [updateSubCategory, { isLoading: isUpdating }] = useUpdateSubCategoryMutation();
    const [deleteSubCategory] = useDeleteSubCategoryMutation();

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this sub-category?")) return;
        try {
            await deleteSubCategory(id).unwrap();
            toast.success("Sub-Category deleted");
        } catch (error) {
            toast.error("Failed to delete sub-category");
        }
    };

    const filteredItems = subCategories.filter((c: ISubCategory) =>
        c.name.toLowerCase().includes(search.toLowerCase())
    );

    const columns: ColumnDef<ISubCategory>[] = [
        {
            accessorKey: "image",
            header: "Image",
            cell: ({ row }) => (
                <Avatar className="h-9 w-9 rounded-lg border">
                    <AvatarImage src={row.original.image as string} alt={row.original.name} />
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
            id: "parentCategory",
            header: "Parent Category",
            accessorFn: (row) => (row.category as any)?.name,
            cell: ({ row }) => (row.original.category as any)?.name || "—",
        },
        {
            accessorKey: "description",
            header: "Description",
            cell: ({ row }) => (
                <span className="max-w-[200px] truncate block" title={row.original.description}>
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
                                setEditingItem(row.original);
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

    // Helper for Form Fields
    const getFields = () => {
        const fields: any[] = [];

        if (isSuperAdmin) {
            let buOptions = [
                { label: "Global (No Business Unit)", value: "global" },
                ...businessUnits.map((bu: any) => ({
                    label: bu.name,
                    value: bu._id
                }))
            ];

            // If Scoped View, limit options to Current BU
            if (paramBusinessUnit) {
                const currentBU = businessUnits.find((b: any) =>
                    b.id === paramBusinessUnit ||
                    b._id === paramBusinessUnit ||
                    b.slug === paramBusinessUnit
                );
                if (currentBU) {
                    buOptions = [{ label: currentBU.name, value: currentBU._id }];
                }
            }

            fields.push({
                name: "businessUnit",
                label: "Business Unit",
                type: "select",
                options: buOptions,
                placeholder: "Select Business Unit",
                disabled: !!paramBusinessUnit
            });
        }

        fields.push({
            name: "category",
            label: "Parent Category",
            type: "select",
            required: true,
            placeholder: "Select Parent Category",
            options: (Array.isArray(categories) ? categories : []).map((c: any) => ({
                label: c.name + (c.businessUnit ? "" : " (Global)"), // Optional: Indicate Global
                value: c._id
            }))
        });

        fields.push(
            { name: "name", label: "Name", type: "text", required: true, placeholder: "Sub-Category Name" },
            { name: "description", label: "Description", type: "textarea", placeholder: "Description" },
            { name: "image", label: "Image", type: "file", accept: "image/*" },
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
        );

        return fields;
    };

    const getDefaultValues = () => {
        if (editingItem) {
            return {
                name: editingItem.name,
                description: editingItem.description,
                category: (editingItem.category as any)?._id || editingItem.category,
                isActive: editingItem.isActive ? "true" : "false",
                image: editingItem.image,
                businessUnit: (editingItem as any).businessUnit || "global" // simplifying
            };
        }

        // Default Logic for Scoped View
        const currentBU = businessUnits.find((b: any) =>
            b.id === paramBusinessUnit ||
            b._id === paramBusinessUnit ||
            b.slug === paramBusinessUnit
        );
        const defaultBUValue = currentBU ? currentBU._id : "global";

        return {
            isActive: "true",
            businessUnit: isSuperAdmin ? defaultBUValue : paramBusinessUnit
        };
    };

    return (
        <div>
            <DataPageLayout
                title="Sub-Categories"
                description="Manage sub-categories (Level 2)"
                createAction={hasPermission(PERMISSION_KEYS.CATEGORY.CREATE) ? {
                    label: "Add Sub-Category",
                    onClick: () => {
                        setEditingItem(null);
                        setIsCreateOpen(true);
                    }
                } : undefined}
                extraFilters={
                    <div className="relative flex-1 max-w-sm min-w-[200px]">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search..."
                            className="pl-8"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                }
            >
                <DataTable columns={columns} data={filteredItems} isLoading={isSubsLoading} />
            </DataPageLayout>

            <AutoFormModal<any>
                open={isCreateOpen}
                onOpenChange={setIsCreateOpen}
                title={editingItem ? "Edit Sub-Category" : "Add New Sub-Category"}
                description="Manage sub-categories."
                fields={getFields()}
                defaultValues={getDefaultValues()}
                onSubmit={async (data) => {
                    try {
                        const formData = new FormData();
                        formData.append("name", data.name);
                        formData.append("category", data.category);
                        formData.append("description", data.description || "");
                        formData.append("isActive", data.isActive === "true" ? "true" : "false");

                        // Handle Business Unit
                        let targetBU = "";
                        if (paramBusinessUnit) {
                            const matched = businessUnits.find((b: any) => b.id === paramBusinessUnit || b._id === paramBusinessUnit || b.slug === paramBusinessUnit);
                            targetBU = matched ? matched._id : paramBusinessUnit;
                        } else {
                            targetBU = data.businessUnit;
                        }

                        if (targetBU === 'global') targetBU = "";
                        if (targetBU) {
                            formData.append("businessUnit", targetBU);
                        }

                        if (data.image instanceof File) {
                            formData.append("image", data.image);
                        }

                        if (editingItem) {
                            await updateSubCategory({ id: editingItem._id, body: formData }).unwrap();
                            toast.success("Sub-Category updated successfully");
                        } else {
                            await createSubCategory(formData).unwrap();
                            toast.success("Sub-Category created successfully");
                        }
                        setIsCreateOpen(false);
                        setEditingItem(null);
                    } catch (error: any) {
                        toast.error(error?.data?.message || "Failed to save sub-category");
                    }
                }}
                isLoading={isCreating || isUpdating}
                submitLabel={editingItem ? "Update" : "Create"}
            />
        </div>
    );
}
