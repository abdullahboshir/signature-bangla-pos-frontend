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
import { ICategory } from "@/types/catalog";
import { format } from "date-fns";
import { DataTable } from "@/components/shared/DataTable";
import { DataPageLayout } from "@/components/shared/DataPageLayout";
import { ColumnDef } from "@tanstack/react-table";
import {
    useGetCategoriesQuery,
    useCreateCategoryMutation,
    useUpdateCategoryMutation,
    useDeleteCategoryMutation
} from "@/redux/api/categoryApi";

export default function CategoriesPage() {
    const params = useParams();
    const businessUnit = params["business-unit"] as string;

    const [search, setSearch] = useState("");
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState<ICategory | null>(null);

    // RTK Query Hooks
    const { data: categories = [], isLoading } = useGetCategoriesQuery({ businessUnit });
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
                            setEditingCategory(row.original);
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
        <div>
            <DataPageLayout
                title="Categories"
                description="Manage your product categories (Level 1)"
                createAction={{
                    label: "Add Category",
                    onClick: () => {
                        setEditingCategory(null);
                        setIsCreateOpen(true);
                    }
                }}
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
                open={isCreateOpen}
                onOpenChange={setIsCreateOpen}
                title={editingCategory ? "Edit Category" : "Add New Category"}
                description="Manage your product categories."
                fields={[
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
                ]}
                defaultValues={editingCategory ? {
                    name: editingCategory.name,
                    description: editingCategory.description,
                    isActive: editingCategory.isActive ? "true" : "false",
                    image: editingCategory.image
                } : { isActive: "true" }}
                onSubmit={async (data) => {
                    try {
                        const formData = new FormData();
                        formData.append("name", data.name);
                        formData.append("description", data.description || "");
                        formData.append("isActive", data.isActive === "true" ? "true" : "false");
                        formData.append("businessUnit", businessUnit);

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
