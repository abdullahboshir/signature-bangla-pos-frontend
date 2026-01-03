"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DataTable } from "@/components/shared/DataTable"
import { Building, Plus, Pencil, Trash } from "lucide-react"
import { usePermissions } from "@/hooks/usePermissions"
import { PERMISSION_KEYS } from "@/config/permission-keys"
import { ColumnDef } from "@tanstack/react-table"
import { useState } from "react"
import { z } from "zod"
import { AutoFormModal } from "@/components/shared/AutoFormModal"
import { ModuleSelect } from "@/components/forms/module-select"
import { MODULES } from "@/constant/modules"
import { useGetDepartmentsQuery, useCreateDepartmentMutation, useUpdateDepartmentMutation, useDeleteDepartmentMutation } from "@/redux/api/hrm/departmentApi" // Assuming these exist
import { toast } from "sonner"
import Swal from "sweetalert2"

const departmentSchema = z.object({
    name: z.string().min(1, "Name is required"),
    head: z.string().optional(), // Could be user ID select
    description: z.string().optional(),
    module: z.string().min(1, "Module is required"),
});

export default function DepartmentList() {
    const { hasPermission } = usePermissions();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedDepartment, setSelectedDepartment] = useState<any>(null);

    const { data: departmentsData, isLoading } = useGetDepartmentsQuery({});
    const [createDepartment] = useCreateDepartmentMutation();
    const [updateDepartment] = useUpdateDepartmentMutation();
    const [deleteDepartment] = useDeleteDepartmentMutation();

    const departments = departmentsData?.result || [];

    const handleCreate = async (values: z.infer<typeof departmentSchema>) => {
        try {
            await createDepartment(values).unwrap();
            toast.success("Department created successfully");
            setIsModalOpen(false);
        } catch (error: any) {
            toast.error(error?.data?.message || "Failed to create department");
        }
    };

    const handleUpdate = async (values: z.infer<typeof departmentSchema>) => {
        if (!selectedDepartment) return;
        try {
            await updateDepartment({
                id: selectedDepartment._id,
                body: values
            }).unwrap();
            toast.success("Department updated successfully");
            setIsModalOpen(false);
            setSelectedDepartment(null);
        } catch (error: any) {
            toast.error(error?.data?.message || "Failed to update department");
        }
    };

    const handleDelete = async (id: string) => {
        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await deleteDepartment(id).unwrap();
                    Swal.fire('Deleted!', 'Department has been deleted.', 'success');
                } catch (error: any) {
                    Swal.fire('Error!', error?.data?.message || 'Failed to delete department.', 'error');
                }
            }
        });
    };

    const openCreateModal = () => {
        setSelectedDepartment(null);
        setIsModalOpen(true);
    };

    const openEditModal = (department: any) => {
        setSelectedDepartment(department);
        setIsModalOpen(true);
    };

    const columns: ColumnDef<any>[] = [
        {
            accessorKey: "name",
            header: "Department Name",
        },
        {
            accessorKey: "module",
            header: "Module",
            cell: ({ row }) => <span className="capitalize">{row.getValue("module")}</span>
        },
        {
            accessorKey: "head",
            header: "Head of Dept",
            cell: ({ row }) => row.original.head?.name || row.original.head || "N/A"
        },
        {
            id: "actions",
            header: "Actions",
            cell: ({ row }) => (
                <div className="flex items-center gap-2">
                    {hasPermission(PERMISSION_KEYS.DEPARTMENT.UPDATE) && (
                        <Button variant="ghost" size="icon" onClick={() => openEditModal(row.original)}>
                            <Pencil className="h-4 w-4" />
                        </Button>
                    )}
                    {hasPermission(PERMISSION_KEYS.DEPARTMENT.DELETE) && (
                        <Button variant="ghost" size="icon" className="text-red-500" onClick={() => handleDelete(row.original._id)}>
                            <Trash className="h-4 w-4" />
                        </Button>
                    )}
                </div>
            )
        }
    ];

    if (!hasPermission(PERMISSION_KEYS.DEPARTMENT.READ)) {
        return <div className="p-4 text-center text-muted-foreground">You do not have permission to view departments.</div>
    }

    return (
        <>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                        <CardTitle className="flex items-center gap-2">
                            <Building className="h-5 w-5" />
                            Departments
                        </CardTitle>
                        <CardDescription>Manage organizational departments.</CardDescription>
                    </div>
                    {hasPermission(PERMISSION_KEYS.DEPARTMENT.CREATE) && (
                        <Button onClick={openCreateModal}>
                            <Plus className="mr-2 h-4 w-4" />
                            Add Department
                        </Button>
                    )}
                </CardHeader>
                <CardContent>
                    <DataTable
                        columns={columns}
                        data={departments}
                        isLoading={isLoading}
                    />
                </CardContent>
            </Card>

            <AutoFormModal
                open={isModalOpen}
                onOpenChange={setIsModalOpen}
                title={selectedDepartment ? "Edit Department" : "Add Department"}
                onSubmit={selectedDepartment ? (handleUpdate as any) : (handleCreate as any)}
                defaultValues={selectedDepartment || { module: MODULES.HRM }}
                fields={[
                    {
                        name: "name",
                        label: "Department Name",
                        type: "text",
                        placeholder: "e.g. Engineering",
                        required: true
                    },
                    {
                        name: "head",
                        label: "Head of Department (User ID)",
                        type: "text",
                        placeholder: "Optional User ID"
                    },
                    {
                        name: "module",
                        label: "Module",
                        type: "custom",
                        required: true,
                        render: ({ name, control }) => (
                            <ModuleSelect
                                // Controlled via AutoForm internal Controller? No, render passed control.
                                // Actually AutoFormModal render passes { control, name } but ModuleSelect expects value/onChange OR FormContext
                                // AutoFormModal WRAPS form in FormProvider.
                                // So ModuleSelect can use FormContext!
                                // So I don't need to pass props if I use name.
                                name={name}
                            />
                        )
                    },
                    {
                        name: "description",
                        label: "Description",
                        type: "textarea",
                        placeholder: "Department description..."
                    }
                ]}
            />
        </>
    )
}
