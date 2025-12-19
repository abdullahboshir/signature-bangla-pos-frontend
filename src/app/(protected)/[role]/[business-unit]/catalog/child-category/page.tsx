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
import { IChildCategory } from "@/types/catalog";
import { format } from "date-fns";
import { DataTable } from "@/components/shared/DataTable";
import { DataPageLayout } from "@/components/shared/DataPageLayout";
import { ColumnDef } from "@tanstack/react-table";
import {
    useGetChildCategoriesQuery,
    useCreateChildCategoryMutation,
    useUpdateChildCategoryMutation,
    useDeleteChildCategoryMutation
} from "@/redux/api/childCategoryApi";
import { useGetSubCategoriesQuery } from "@/redux/api/subCategoryApi";

export default function ChildCategoriesPage() {
    const params = useParams();
    const businessUnit = params["business-unit"] as string;

    const [search, setSearch] = useState("");
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<IChildCategory | null>(null);

    // RTK Query Hooks
    const { data: childCategories = [], isLoading: isChildLoading } = useGetChildCategoriesQuery({ businessUnit });
    const { data: subCategories = [], isLoading: isSubLoading } = useGetSubCategoriesQuery({ limit: 100 });
    console.log("DEBUG: subCategories", subCategories, typeof subCategories, Array.isArray(subCategories));

    const [createChildCategory, { isLoading: isCreating }] = useCreateChildCategoryMutation();
    const [updateChildCategory, { isLoading: isUpdating }] = useUpdateChildCategoryMutation();
    const [deleteChildCategory] = useDeleteChildCategoryMutation();

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this child-category?")) return;
        try {
            await deleteChildCategory(id).unwrap();
            toast.success("Child-Category deleted");
        } catch (error) {
            toast.error("Failed to delete child-category");
        }
    };

    const filteredItems = childCategories.filter((c: IChildCategory) =>
        c.name.toLowerCase().includes(search.toLowerCase())
    );

    // Define Columns
    const columns: ColumnDef<IChildCategory>[] = [
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
            id: "subCategory",
            header: "Sub-Category",
            accessorFn: (row) => (row.subCategory as any)?.name,
            cell: ({ row }) => (row.original.subCategory as any)?.name || "—",
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
        <div>
            <DataPageLayout
                title="Child-Categories"
                description="Manage child-categories (Level 3)"
                createAction={{
                    label: "Add Child-Category",
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
                <DataTable columns={columns} data={filteredItems} isLoading={isChildLoading} />
            </DataPageLayout>

            <AutoFormModal<any>
                open={isCreateOpen}
                onOpenChange={setIsCreateOpen}
                title={editingItem ? "Edit Child-Category" : "Add New Child-Category"}
                description="Manage child categories."
                fields={[
                    {
                        name: "subCategory",
                        label: "Sub-Category",
                        type: "select",
                        required: true,
                        placeholder: "Select Sub-Category",
                        options: subCategories.map((c: any) => ({ label: c.name, value: c._id }))
                    },
                    { name: "name", label: "Name", type: "text", required: true, placeholder: "Child-Category Name" },
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
                    subCategory: (editingItem.subCategory as any)?._id || editingItem.subCategory,
                    isActive: editingItem.isActive ? "true" : "false",
                    image: editingItem.image
                } : { isActive: "true" }}
                onSubmit={async (data) => {
                    try {
                        const formData = new FormData();
                        formData.append("name", data.name);
                        formData.append("subCategory", data.subCategory);
                        formData.append("description", data.description || "");
                        formData.append("isActive", data.isActive === "true" ? "true" : "false");
                        formData.append("businessUnit", businessUnit);

                        if (data.image instanceof File) {
                            formData.append("image", data.image);
                        }

                        if (editingItem) {
                            await updateChildCategory({ id: editingItem._id, body: formData }).unwrap();
                            toast.success("Child-Category updated successfully");
                        } else {
                            await createChildCategory(formData).unwrap();
                            toast.success("Child-Category created successfully");
                        }
                        setIsCreateOpen(false);
                        setEditingItem(null);
                    } catch (error: any) {
                        console.error(error);
                        toast.error(error?.data?.message || "Failed to save child-category");
                    }
                }}
                isLoading={isCreating || isUpdating}
                submitLabel={editingItem ? "Update" : "Create"}
            />
        </div>
    );
}
