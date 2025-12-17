"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { Plus, Search, Pencil, Trash2, MoreHorizontal, ImageIcon } from "lucide-react";
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

export default function SubCategoriesPage() {
    const params = useParams();
    const businessUnit = params["business-unit"] as string;

    const [search, setSearch] = useState("");
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<ISubCategory | null>(null);

    // RTK Query Hooks
    const { data: subCategories = [], isLoading: isSubsLoading } = useGetSubCategoriesQuery({ businessUnit });
    const { data: categories = [], isLoading: isCatsLoading } = useGetCategoriesQuery({ limit: 100 });

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

    // Define Columns
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
                        <DropdownMenuItem onClick={() => {
                            setEditingItem(row.original);
                            setIsCreateOpen(true);
                        }}>
                            <Pencil className="mr-2 h-4 w-4" /> Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDelete(row.original._id)} className="text-destructive">
                            <Trash2 className="mr-2 h-4 w-4" /> Delete
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            ),
        },
    ];

    return (
        <div className="p-6">
            <DataPageLayout
                title="Sub-Categories"
                description="Manage sub-categories (Level 2)"
                createAction={{
                    label: "Add Sub-Category",
                    onClick: () => {
                        setEditingItem(null);
                        setIsCreateOpen(true);
                    }
                }}
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
                fields={[
                    {
                        name: "category",
                        label: "Parent Category",
                        type: "select",
                        required: true,
                        placeholder: "Select Parent Category",
                        options: (Array.isArray(categories) ? categories : []).map((c: any) => ({ label: c.name, value: c._id }))
                    },
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
                ]}
                defaultValues={editingItem ? {
                    name: editingItem.name,
                    description: editingItem.description,
                    category: (editingItem.category as any)?._id || editingItem.category,
                    isActive: editingItem.isActive ? "true" : "false",
                    image: editingItem.image
                } : { isActive: "true" }}
                onSubmit={async (data) => {
                    try {
                        const formData = new FormData();
                        formData.append("name", data.name);
                        formData.append("category", data.category);
                        formData.append("description", data.description || "");
                        formData.append("isActive", data.isActive === "true" ? "true" : "false");
                        formData.append("businessUnit", businessUnit);

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
                        console.error(error);
                        toast.error(error?.data?.message || "Failed to save sub-category");
                    }
                }}
                isLoading={isCreating || isUpdating}
                submitLabel={editingItem ? "Update" : "Create"}
            />
        </div>
    );
}
