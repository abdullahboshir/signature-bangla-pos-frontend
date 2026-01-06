"use client"

import { useState } from "react"
import { usePermissions } from "@/hooks/usePermissions"
import { PERMISSION_KEYS } from "@/config/permission-keys"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, Pencil, Trash } from "lucide-react"
import { DataTable } from "@/components/shared/DataTable"
import { AutoFormModal } from "@/components/shared/AutoFormModal"
import { ConfirmDialog } from "@/components/shared/ConfirmDialog"
import { toast } from "sonner"
import {
    useGetExpensesQuery,
    useCreateExpenseMutation,
    useUpdateExpenseMutation,
    useDeleteExpenseMutation
} from "@/redux/api/pos/expenseApi"
import { useGetExpenseCategoriesQuery } from "@/redux/api/accounting/expenseCategoryApi"
import { PAYMENT_METHOD_OPTIONS, EXPENSE_STATUS } from "@/constant/finance.constant"
import { Badge } from "@/components/ui/badge"

export default function ExpenseList() {
    const { hasPermission: can } = usePermissions()
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [selectedExpense, setSelectedExpense] = useState<any>(null)
    const [isConfirmOpen, setIsConfirmOpen] = useState(false)
    const [expenseToDelete, setExpenseToDelete] = useState<string | null>(null)

    const { data: expenses = [], isLoading } = useGetExpensesQuery({})
    const { data: categories = [] } = useGetExpenseCategoriesQuery({})

    const [createExpense, { isLoading: isCreating }] = useCreateExpenseMutation()
    const [updateExpense, { isLoading: isUpdating }] = useUpdateExpenseMutation()
    const [deleteExpense, { isLoading: isDeleting }] = useDeleteExpenseMutation()

    const categoryOptions = categories.map((c: any) => ({
        label: c.name,
        value: c._id // Assuming category selection stores ID
    }));

    const handleCreate = async (data: any) => {
        try {
            await createExpense(data).unwrap()
            toast.success("Expense recorded successfully")
            setIsModalOpen(false)
        } catch (error: any) {
            toast.error(error?.data?.message || "Failed to record expense")
        }
    }

    const handleUpdate = async (data: any) => {
        try {
            await updateExpense({ id: selectedExpense._id, body: data }).unwrap()
            toast.success("Expense updated successfully")
            setIsModalOpen(false)
            setSelectedExpense(null)
        } catch (error: any) {
            toast.error(error?.data?.message || "Failed to update expense")
        }
    }

    const handleDelete = async () => {
        if (!expenseToDelete) return
        try {
            await deleteExpense(expenseToDelete).unwrap()
            toast.success("Expense deleted successfully")
            setIsConfirmOpen(false)
            setExpenseToDelete(null)
        } catch (error: any) {
            toast.error(error?.data?.message || "Failed to delete expense")
        }
    }

    const columns = [
        {
            accessorKey: "category.name", // Assuming population, otherwise just ID 
            header: "Category",
            cell: ({ row }: any) => row.original.category?.name || row.original.category || "Uncategorized"
        },
        {
            accessorKey: "amount",
            header: "Amount",
            cell: ({ row }: any) => `৳ ${row.original.amount}`
        },
        {
            accessorKey: "date",
            header: "Date",
            cell: ({ row }: any) => new Date(row.original.date).toLocaleDateString()
        },
        {
            accessorKey: "reference",
            header: "Reference",
            cell: ({ row }: any) => row.original.reference || '-'
        },
        {
            accessorKey: "status",
            header: "Status",
            cell: ({ row }: any) => (
                <Badge variant={row.original.status === EXPENSE_STATUS.APPROVED ? "default" : "secondary"}>
                    {row.original.status}
                </Badge>
            )
        },
        {
            accessorKey: "paymentMethod",
            header: "Payment Method",
            cell: ({ row }: any) => (
                <Badge variant="outline" className="capitalize">
                    {row.original.paymentMethod?.replace('_', ' ')}
                </Badge>
            )
        },
        {
            id: "actions",
            cell: ({ row }: any) => {
                const expense = row.original
                return (
                    <div className="flex justify-end gap-2">
                        {can(PERMISSION_KEYS.EXPENSE.UPDATE) && (
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                    setSelectedExpense(expense)
                                    setIsModalOpen(true)
                                }}
                            >
                                <Pencil className="h-4 w-4" />
                            </Button>
                        )}
                        {can(PERMISSION_KEYS.EXPENSE.DELETE) && (
                            <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => {
                                    setExpenseToDelete(expense._id)
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
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Expenses</h1>
                    <p className="text-muted-foreground">
                        Track and manage operational expenses.
                    </p>
                </div>
                {can(PERMISSION_KEYS.EXPENSE.CREATE) && (
                    <Button onClick={() => {
                        setSelectedExpense(null)
                        setIsModalOpen(true)
                    }}>
                        <Plus className="mr-2 h-4 w-4" /> Record Expense
                    </Button>
                )}
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Expense History</CardTitle>
                    <CardDescription>All recorded expenses.</CardDescription>
                </CardHeader>
                <CardContent>
                    <DataTable
                        columns={columns}
                        data={expenses}
                        searchKey="reference" // or category?
                        isLoading={isLoading}
                    />
                </CardContent>
            </Card>

            <AutoFormModal
                open={isModalOpen}
                onOpenChange={(open) => {
                    setIsModalOpen(open)
                    if (!open) setSelectedExpense(null)
                }}
                title={selectedExpense ? "Edit Expense" : "Record Expense"}
                onSubmit={selectedExpense ? (handleUpdate as any) : (handleCreate as any)}
                defaultValues={selectedExpense || { date: new Date().toISOString().split('T')[0] }}
                isLoading={isCreating || isUpdating}
                fields={[
                    {
                        name: "category",
                        label: "Expense Category",
                        type: "select",
                        options: categoryOptions,
                        required: true,
                        placeholder: "Select category"
                    },
                    {
                        name: "amount",
                        label: "Amount (BDT)",
                        type: "number",
                        required: true,
                        placeholder: "0.00"
                    },
                    {
                        name: "date",
                        label: "Date",
                        type: "date",
                        required: true
                    },
                    {
                        name: "paymentMethod",
                        label: "Payment Method",
                        type: "select",
                        options: PAYMENT_METHOD_OPTIONS,
                        required: true
                    },
                    {
                        name: "reference",
                        label: "Reference/Note",
                        type: "text",
                        placeholder: "e.g., Invoice #123"
                    },
                    {
                        name: "description",
                        label: "Description",
                        type: "textarea",
                        placeholder: "Details about the expense..."
                    }
                ]}
            />

            <ConfirmDialog
                open={isConfirmOpen}
                onOpenChange={setIsConfirmOpen}
                title="Delete Expense"
                description="Are you sure you want to delete this expense record?"
                onConfirm={handleDelete}
                isLoading={isDeleting}
            />
        </div>
    )
}
