"use client"

import { usePermissions } from "@/hooks/usePermissions"
import { PERMISSION_KEYS } from "@/config/permission-keys"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, Pencil, Trash } from "lucide-react"
import { DataTable } from "@/components/shared/DataTable"
import { useState } from "react"
import { z } from "zod"
import { AutoFormModal } from "@/components/shared/AutoFormModal"
import { toast } from "sonner"
import {
    useGetExpenseCategoriesQuery,
    useCreateExpenseCategoryMutation,
    useUpdateExpenseCategoryMutation,
    useDeleteExpenseCategoryMutation
} from "@/redux/api/accounting/expenseCategoryApi"
import { ModuleSelect } from "@/components/forms/module-select"
import { MODULES } from "@/constant/modules"
import { ConfirmDialog } from "@/components/shared/ConfirmDialog"
import { EXPENSE_CATEGORY_TYPE_OPTIONS } from "@/constant/finance.constant"

export default function ExpenseCategoryList() {
    const { hasPermission: can } = usePermissions()
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [selectedCategory, setSelectedCategory] = useState<any>(null)
    const [isConfirmOpen, setIsConfirmOpen] = useState(false)
    const [categoryToDelete, setCategoryToDelete] = useState<string | null>(null)

    const { data: categories = [], isLoading } = useGetExpenseCategoriesQuery({})
    const [createCategory, { isLoading: isCreating }] = useCreateExpenseCategoryMutation()
    const [updateCategory, { isLoading: isUpdating }] = useUpdateExpenseCategoryMutation()
    const [deleteCategory, { isLoading: isDeleting }] = useDeleteExpenseCategoryMutation()

    const handleCreate = async (data: any) => {
        try {
            await createCategory(data).unwrap()
            toast.success("Category created successfully")
            setIsModalOpen(false)
        } catch (error: any) {
            toast.error(error?.data?.message || "Failed to create category")
        }
    }

    const handleUpdate = async (data: any) => {
        try {
            await updateCategory({ id: selectedCategory._id, body: data }).unwrap()
            toast.success("Category updated successfully")
            setIsModalOpen(false)
            setSelectedCategory(null)
        } catch (error: any) {
            toast.error(error?.data?.message || "Failed to update category")
        }
    }

    const handleDelete = async () => {
        if (!categoryToDelete) return
        try {
            await deleteCategory(categoryToDelete).unwrap()
            toast.success("Category deleted successfully")
            setIsConfirmOpen(false)
            setCategoryToDelete(null)
        } catch (error: any) {
            toast.error(error?.data?.message || "Failed to delete category")
        }
    }

    const columns = [
        { accessorKey: "name", header: "Name" },
        { accessorKey: "type", header: "Type" },
        { accessorKey: "module", header: "Module" },
        {
            accessorKey: "description",
            header: "Description",
            cell: ({ row }: any) => <span className="text-muted-foreground text-sm truncate max-w-[200px] block">{row.original.description || '-'}</span>
        },
        {
            id: "actions",
            cell: ({ row }: any) => {
                const category = row.original
                return (
                    <div className="flex justify-end gap-2">
                        {can(PERMISSION_KEYS.EXPENSE_CATEGORY.UPDATE) && (
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                    setSelectedCategory(category)
                                    setIsModalOpen(true)
                                }}
                            >
                                <Pencil className="h-4 w-4" />
                            </Button>
                        )}
                        {can(PERMISSION_KEYS.EXPENSE_CATEGORY.DELETE) && (
                            <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => {
                                    setCategoryToDelete(category._id)
                                    setIsConfirmOpen(true)
                                }}
                            >
                                <Trash className="h-4 w-4" />
                            </Button>
                        )}
                    </div>
                )
            }
        }
    ]

    return (
        <div className="space-y-4">
            {/* Header Section */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Expense Categories</h1>
                    <p className="text-muted-foreground">
                        Manage categories for expense tracking across modules.
                    </p>
                </div>
                {can(PERMISSION_KEYS.EXPENSE_CATEGORY.CREATE) && (
                    <Button onClick={() => {
                        setSelectedCategory(null)
                        setIsModalOpen(true)
                    }}>
                        <Plus className="mr-2 h-4 w-4" /> Add Category
                    </Button>
                )}
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Categories</CardTitle>
                    <CardDescription>List of all expense categories.</CardDescription>
                </CardHeader>
                <CardContent>
                    <DataTable
                        columns={columns}
                        data={categories}
                        searchKey="name"
                        isLoading={isLoading}
                    />
                </CardContent>
            </Card>

            <AutoFormModal
                open={isModalOpen}
                onOpenChange={(open) => {
                    setIsModalOpen(open)
                    if (!open) setSelectedCategory(null)
                }}
                title={selectedCategory ? "Edit Expense Category" : "Add Expense Category"}
                onSubmit={selectedCategory ? (handleUpdate as any) : (handleCreate as any)}
                defaultValues={selectedCategory || {
                    type: 'variable',
                    module: 'pos',
                    isActive: true
                }}
                isLoading={isCreating || isUpdating}
                fields={[
                    {
                        name: "name",
                        label: "Category Name",
                        type: "text",
                        placeholder: "e.g. Office Supplies",
                        required: true
                    },
                    {
                        name: "type",
                        label: "Expense Type",
                        type: "select",
                        options: EXPENSE_CATEGORY_TYPE_OPTIONS,
                        required: true
                    },
                    {
                        name: "module",
                        label: "Module Context",
                        type: "custom",
                        required: true,
                        render: ({ name }) => (
                            <ModuleSelect name={name} />
                        )
                    },
                    {
                        name: "description",
                        label: "Description",
                        type: "textarea",
                        placeholder: "Optional description..."
                    }
                ]}
            />

            <ConfirmDialog
                open={isConfirmOpen}
                onOpenChange={setIsConfirmOpen}
                title="Delete Category"
                description="Are you sure you want to delete this category? This action cannot be undone."
                onConfirm={handleDelete}
                isLoading={isDeleting}
            />
        </div>
    )
}
