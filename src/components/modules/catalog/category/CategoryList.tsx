"use client";

import { useState, useMemo } from "react";
import { useParams } from "next/navigation";
import { Plus, Search, Pencil, Trash2, MoreHorizontal, ImageIcon, ChevronRight, ChevronDown, FolderOpen } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";
import { ColumnDef } from "@tanstack/react-table";
import { Switch } from "@/components/ui/switch";

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
} from "@/redux/api/catalog/categoryApi";
import { useAuth } from "@/hooks/useAuth";
import { useGetBusinessUnitsQuery } from "@/redux/api/organization/businessUnitApi";
import { usePermissions } from "@/hooks/usePermissions";
import { PERMISSION_KEYS } from "@/config/permission-keys";
import { cn } from "@/lib/utils";
import { ModuleMultiSelect } from "@/components/forms/module-multi-select";

// Optimized Tree Transformation
const buildCategoryTree = (categories: any[]) => {
    const map = new Map();
    const roots: any[] = [];

    // Initialize Map
    categories.forEach(cat => {
        map.set(cat._id, { ...cat, children: [] });
    });

    // Build Tree
    categories.forEach(cat => {
        if (cat.parentId && map.has(cat.parentId._id || cat.parentId)) {
            const parentId = cat.parentId._id || cat.parentId;
            map.get(parentId).children.push(map.get(cat._id));
        } else {
            roots.push(map.get(cat._id));
        }
    });

    return roots;
};

// Flatten tree for table with depth indicator
const flattenTree = (nodes: any[], depth = 0, expanded: Set<string>): any[] => {
    let result: any[] = [];
    nodes.forEach(node => {
        result.push({ ...node, depth, hasChildren: node.children && node.children.length > 0 });
        if (expanded.has(node._id) && node.children) {
            result = result.concat(flattenTree(node.children, depth + 1, expanded));
        }
    });
    return result;
};

export const CategoryList = () => {
    const params = useParams();
    const paramBusinessUnit = params["business-unit"] as string;
    const { user } = useAuth();
    const { hasPermission } = usePermissions();
    const { isSuperAdmin } = usePermissions();
    const businessUnit = paramBusinessUnit;

    const [search, setSearch] = useState("");
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState<ICategory | null>(null);
    const [expanded, setExpanded] = useState<Set<string>>(new Set());

    const toggleExpand = (id: string) => {
        const newExpanded = new Set(expanded);
        if (newExpanded.has(id)) newExpanded.delete(id);
        else newExpanded.add(id);
        setExpanded(newExpanded);
    };

    // RTK Query Hooks
    const { data: categories = [], isLoading } = useGetCategoriesQuery({ businessUnit });
    const { data: businessUnits = [] } = useGetBusinessUnitsQuery({ limit: 100 }, { skip: !isSuperAdmin });

    const [createCategory, { isLoading: isCreating }] = useCreateCategoryMutation();
    const [updateCategory, { isLoading: isUpdating }] = useUpdateCategoryMutation();
    const [deleteCategory] = useDeleteCategoryMutation();

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this category? Sub-categories might prevent deletion.")) return;
        try {
            await deleteCategory(id).unwrap();
            toast.success("Category deleted");
        } catch (error: any) {
            toast.error(error?.data?.message || "Failed to delete category");
        }
    };

    const treeData = useMemo(() => {
        const raw = Array.isArray(categories) ? categories : [];
        if (search) {
            return raw.filter((c: any) => c.name.toLowerCase().includes(search.toLowerCase()));
        }
        const tree = buildCategoryTree(raw);
        return flattenTree(tree, 0, expanded);
    }, [categories, expanded, search]);

    // Parent Options for Select (Flat list, maybe filtered to exclude self and children to prevent cycles)
    const getParentOptions = () => {
        const raw = Array.isArray(categories) ? categories : [];
        return raw
            .filter((c: any) => c._id !== editingCategory?._id) // Prevent self-parenting
            .map((c: any) => ({
                label: c.name,
                value: c._id
            }));
    };

    const columns: ColumnDef<any>[] = [
        {
            accessorKey: "name",
            header: "Name",
            cell: ({ row }) => (
                <div
                    className={cn(
                        "flex items-center cursor-pointer hover:bg-muted/50 -mx-4 px-4 py-2 rounded-md transition-colors",
                        row.original.hasChildren && "font-medium"
                    )}
                    style={{ paddingLeft: `${row.original.depth * 24 + 16}px` }}
                    onClick={() => row.original.hasChildren && toggleExpand(row.original._id)}
                >
                    {row.original.hasChildren ? (
                        <div className="h-6 w-6 flex items-center justify-center mr-2">
                            {expanded.has(row.original._id) ?
                                <ChevronDown className="h-4 w-4 text-muted-foreground" /> :
                                <ChevronRight className="h-4 w-4 text-muted-foreground" />
                            }
                        </div>
                    ) : (
                        <div className="w-6 mr-2" /> // Spacer
                    )}

                    <Avatar className="h-8 w-8 rounded-lg border mr-3">
                        <AvatarImage src={row.original.image} alt={row.original.name} />
                        <AvatarFallback><FolderOpen className="h-4 w-4 text-muted-foreground" /></AvatarFallback>
                    </Avatar>

                    <div className="flex flex-col">
                        <span className="font-medium">{row.original.name}</span>
                        {row.original.slug && <span className="text-[10px] text-muted-foreground">{row.original.slug}</span>}
                    </div>
                </div>
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
                        {hasPermission(PERMISSION_KEYS.CATEGORY.CREATE) && (
                            <DropdownMenuItem onClick={() => {
                                setEditingCategory({ parentId: row.original._id } as any);
                                setIsCreateOpen(true);
                            }}>
                                <Plus className="mr-2 h-4 w-4" /> Add Sub-Category
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
            {
                name: "parentId",
                label: "Parent Category",
                type: "select",
                placeholder: "Select Parent (Optional)",
                options: [{ label: "No Parent (Root)", value: "null" }, ...getParentOptions()]
            },
            { name: "description", label: "Description", type: "textarea", placeholder: "Category Description" },
            { name: "image", label: "Category Image", type: "file", placeholder: "Upload Image", accept: "image/*" },
            {
                name: "isActive",
                label: "Status",
                type: "select",
                required: true,
                options: [{ label: "Active", value: "true" }, { label: "Inactive", value: "false" }],
                defaultValue: "true"
            }
        ];

        // Business Unit Logic (Same as before)
        if (isSuperAdmin) {
            let buOptions = [
                { label: "Global (No Business Unit)", value: "global" },
                ...businessUnits.map((bu: any) => ({ label: bu.name, value: bu._id }))
            ];

            if (paramBusinessUnit) {
                const currentBU = businessUnits.find((b: any) => b.id === paramBusinessUnit || b._id === paramBusinessUnit || b.slug === paramBusinessUnit);
                if (currentBU) buOptions = [{ label: currentBU.name, value: currentBU._id }];
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
            name: "availableModules",
            label: "Available Modules",
            type: "custom",
            render: () => (
                <ModuleMultiSelect
                    name="availableModules"
                    label="Available Modules"
                    placeholder="Select available modules..."
                />
            )
        });

        return fields;
    };

    const getDefaultValues = () => {
        // Default BU
        const currentBU = businessUnits.find((b: any) =>
            b.id === paramBusinessUnit || b._id === paramBusinessUnit || b.slug === paramBusinessUnit
        );
        const defaultBUValue = currentBU ? currentBU._id : "global";

        if (editingCategory) {
            return {
                name: editingCategory.name,
                description: editingCategory.description,
                isActive: editingCategory.isActive ? "true" : "false",
                image: editingCategory.image,
                parentId: (editingCategory.parentId as any)?._id || editingCategory.parentId || "null",
                availableModules: (editingCategory as any).availableModules || [],
                businessUnit: (editingCategory.businessUnit as any)?.id || (editingCategory.businessUnit as any)?._id || editingCategory.businessUnit || defaultBUValue
            };
        }

        return {
            isActive: "true",
            parentId: "null",
            availableModules: [],
            businessUnit: isSuperAdmin ? defaultBUValue : paramBusinessUnit
        };
    };

    return (
        <div>
            <DataPageLayout
                title="Categories"
                description="Manage your product categories hierarchy."
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
                <DataTable columns={columns} data={treeData} isLoading={isLoading} />
            </DataPageLayout>

            <AutoFormModal<any>
                key={isCreateOpen ? 'open' : 'closed'}
                open={isCreateOpen}
                onOpenChange={setIsCreateOpen}
                title={editingCategory?._id ? "Edit Category" : "Add New Category"}
                description="Manage your product categories."
                fields={getFields()}
                defaultValues={getDefaultValues()}
                onSubmit={async (data) => {
                    try {
                        const formData = new FormData();
                        formData.append("name", data.name);
                        formData.append("description", data.description || "");
                        formData.append("isActive", data.isActive === "true" ? "true" : "false");
                        // Don't append parentId if it's "null" string (means no parent/root)
                        if (data.parentId && data.parentId !== "null") {
                            formData.append("parentId", data.parentId);
                        }

                        // BU Logic
                        let targetBU = "";
                        if (paramBusinessUnit) {
                            const matched = businessUnits.find((b: any) => b.id === paramBusinessUnit || b._id === paramBusinessUnit || b.slug === paramBusinessUnit);
                            targetBU = matched ? matched._id : paramBusinessUnit;
                        } else {
                            targetBU = data.businessUnit;
                        }
                        if (targetBU === 'global') targetBU = "";
                        if (targetBU) formData.append("businessUnit", targetBU);

                        if (data.image instanceof File) {
                            formData.append("image", data.image);
                        }

                        if (editingCategory && editingCategory._id && !editingCategory.parentId && data.parentId) {
                            // Only update provided ID if standard edit
                            // If creating sub using preset, editingCategory is temp obj
                        }

                        if (editingCategory?._id) {
                            await updateCategory({ id: editingCategory._id, body: formData }).unwrap();
                            toast.success("Category updated");
                        } else {
                            await createCategory(formData).unwrap();
                            toast.success("Category created");
                        }
                        setIsCreateOpen(false);
                        setEditingCategory(null);
                    } catch (error: any) {
                        console.error(error);
                        toast.error(error?.data?.message || "Failed to save category");
                    }
                }}
                isLoading={isCreating || isUpdating}
                submitLabel={editingCategory?._id ? "Update Category" : "Create Category"}
            />
        </div>
    );
}
