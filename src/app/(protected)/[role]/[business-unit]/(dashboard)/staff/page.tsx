"use client";

import { useEffect, useState } from "react"
import { DataTable } from "@/components/shared/DataTable"
import { DataPageLayout } from "@/components/shared/DataPageLayout"
import { StatCard } from "@/components/shared/StatCard"
import { ColumnDef } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { useCurrentBusinessUnit } from "@/hooks/useCurrentBusinessUnit"
import { useAuth } from "@/hooks/useAuth"
import { axiosInstance as api } from "@/lib/axios/axiosInstance"
import { userService, roleService } from "@/services/user/user.service"
import { Users, CheckCircle, MoreHorizontal, Edit, Trash2, Shield } from "lucide-react"
import { toast } from "sonner"
import { Badge } from "@/components/ui/badge"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { AutoFormModal } from "@/components/shared/AutoFormModal"
import { FieldConfig } from "@/types/auto-form"

export default function StaffPage() {
    // Data State
    const [staff, setStaff] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [roles, setRoles] = useState<any[]>([])

    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [selectedStaff, setSelectedStaff] = useState<any>(null)
    const [modalMode, setModalMode] = useState<'create' | 'edit'>('create')

    const { currentBusinessUnit } = useCurrentBusinessUnit()
    const { user: currentUser } = useAuth()

    useEffect(() => {
        fetchStaff()
        fetchRoles()
    }, [currentBusinessUnit])

    const fetchRoles = async () => {
        try {
            const data = await roleService.getAll()
            setRoles(Array.isArray(data) ? data : [])
        } catch (err) {
            console.error("Failed to fetch roles:", err)
        }
    }

    const fetchStaff = async () => {
        try {
            setLoading(true)
            const response = await api.get('/super-admin/users/all-users')
            const resData = (response as any);

            if (resData.success || (resData.data && resData.data.success)) {
                let allUsers: any[] = [];
                // Data extraction logic same as CustomersPage
                if (Array.isArray(resData.data)) {
                    allUsers = resData.data;
                } else if (resData.data && Array.isArray(resData.data.data)) {
                    allUsers = resData.data.data;
                } else if (resData.data && typeof resData.data === 'object' && Array.isArray(resData.data.result)) {
                    allUsers = resData.data.result;
                } else if (resData.result && Array.isArray(resData.result)) {
                    allUsers = resData.result;
                } else if (resData.data && typeof resData.data === 'object') {
                    const possibleArray = Object.values(resData.data).find(val => Array.isArray(val));
                    if (possibleArray) {
                        allUsers = possibleArray as any[];
                    } else {
                        allUsers = [];
                    }
                }

                const isSuperAdmin = currentUser?.roles?.some((r: any) => r.name === 'super-admin')

                if (!isSuperAdmin && currentBusinessUnit) {
                    allUsers = allUsers.filter((user: any) => {
                        if (!user.businessUnits) return false;
                        return user.businessUnits.some((bu: any) => {
                            const buId = typeof bu === 'string' ? bu : (bu.id || bu.slug || bu._id);
                            return buId === currentBusinessUnit.id || buId === currentBusinessUnit.slug || buId === currentBusinessUnit._id;
                        });
                    });
                }

                // Filter for Staff (Exclude customers)
                const staffUsers = allUsers.filter((u: any) =>
                    !u.roles?.some((r: any) => {
                        const roleName = typeof r === 'string' ? r : r.name;
                        return roleName === 'customer';
                    })
                );

                const formattedStaff = staffUsers.map((user: any) => ({
                    ...user,
                    name: typeof user.name === 'object' && user.name !== null
                        ? `${user.name.firstName || ''} ${user.name.lastName || ''}`.trim() || 'Unnamed'
                        : user.name,
                    role: user.roles?.[0]?.name || 'N/A', // Assuming single role for display
                    status: user.status || 'inactive',
                    email: user.email || 'N/A',
                    phone: user.phone || 'N/A',
                }));

                setStaff(formattedStaff)
            }
        } catch (err) {
            console.error("Error fetching staff:", err)
            toast.error("Failed to fetch staff")
        } finally {
            setLoading(false)
        }
    }

    const handleCreate = () => {
        setSelectedStaff(null)
        setModalMode('create')
        setIsModalOpen(true)
    }

    const handleEdit = (staffMember: any) => {
        const formData = {
            ...staffMember,
            firstName: staffMember.name?.split(' ')[0] || "",
            lastName: staffMember.name?.split(' ').slice(1).join(' ') || "",
            roleId: staffMember.roles?.[0]?._id || staffMember.roles?.[0]?.id || ""
        };
        setSelectedStaff(formData)
        setModalMode('edit')
        setIsModalOpen(true)
    }

    const handleDelete = async (staffMember: any) => {
        if (!confirm("Are you sure you want to delete this staff member?")) return;
        try {
            const id = staffMember._id || staffMember.id;
            const res = await userService.delete(id);
            if (res && res.success) {
                toast.success("Staff deleted successfully")
                fetchStaff()
            } else {
                toast.error("Failed to delete staff")
            }
        } catch (error) {
            toast.error("An error occurred while deleting")
        }
    }

    const handleSubmit = async (values: any) => {
        try {
            if (modalMode === 'edit') {
                const payload = {
                    name: {
                        firstName: values.firstName,
                        lastName: values.lastName
                    },
                    phone: values.phone,
                    status: values.status,
                    roles: [values.roleId]
                }
                const id = selectedStaff._id || selectedStaff.id;
                const res = await userService.update(id, payload);
                if (res && res.success) {
                    toast.success("Staff updated successfully")
                }
            } else {
                const payload = {
                    name: {
                        firstName: values.firstName,
                        lastName: values.lastName
                    },
                    email: values.email,
                    phone: values.phone,
                    password: values.password || "123456",
                    roles: [values.roleId],
                    businessUnits: currentBusinessUnit ? [currentBusinessUnit.id || currentBusinessUnit._id] : [],
                    status: values.status
                }
                const res = await userService.create(payload)
                if (res && res.success) {
                    toast.success("Staff created successfully")
                }
            }
            setIsModalOpen(false)
            fetchStaff()
        } catch (error: any) {
            console.error("Submit error:", error)
            toast.error(error?.message || "Operation failed")
        }
    }

    const staffFields: FieldConfig[] = [
        {
            name: "firstName",
            label: "First Name",
            type: "text",
            required: true,
        },
        {
            name: "lastName",
            label: "Last Name",
            type: "text",
        },
        {
            name: "email",
            label: "Email",
            type: "email",
            required: true,
            disabled: modalMode === 'edit'
        },
        {
            name: "phone",
            label: "Phone",
            type: "text",
        },
        {
            name: "roleId",
            label: "Role",
            type: "select",
            required: true,
            options: roles.filter(r => r.name !== 'customer').map(r => ({ label: r.name, value: r._id || r.id }))
        },
        {
            name: "password",
            label: "Password",
            type: "password",
            placeholder: "Default: 123456",
        },
        {
            name: "status",
            label: "Status",
            type: "select",
            options: [
                { label: "Active", value: "active" },
                { label: "Inactive", value: "inactive" }
            ],
            defaultValue: "active"
        }
    ];

    const displayedFields = modalMode === 'edit'
        ? staffFields.filter(f => f.name !== 'password')
        : staffFields;

    const columns: ColumnDef<any>[] = [
        {
            accessorKey: "name",
            header: "Name",
            cell: ({ row }) => <span className="font-medium">{row.original.name}</span>,
        },
        {
            accessorKey: "role",
            header: "Role",
            cell: ({ row }) => <Badge variant="outline">{row.original.role}</Badge>,
        },
        {
            accessorKey: "email",
            header: "Email",
            cell: ({ row }) => row.original.email,
        },
        {
            accessorKey: "phone",
            header: "Phone",
            cell: ({ row }) => row.original.phone,
        },
        {
            accessorKey: "status",
            header: "Status",
            cell: ({ row }) => (
                <Badge variant={row.original.status === "active" ? "default" : "secondary"}>
                    {row.original.status}
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
                        <DropdownMenuItem onClick={() => handleEdit(row.original)}>
                            <Edit className="mr-2 h-4 w-4" /> Edit Staff
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            className="text-destructive focus:text-destructive"
                            onClick={() => handleDelete(row.original)}
                        >
                            <Trash2 className="mr-2 h-4 w-4" /> Delete
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            ),
        },
    ];

    return (
        <div className="container mx-auto py-6">
            <DataPageLayout
                title="Staff Management"
                description="Manage employee profiles, roles, and access."
                createAction={{
                    label: "Add Staff",
                    onClick: handleCreate
                }}
                stats={
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                        <StatCard
                            title="Total Staff"
                            value={staff.length}
                            icon={Users}
                        />
                        <StatCard
                            title="Active Staff"
                            value={staff.filter(c => c.status === 'active').length}
                            icon={CheckCircle}
                        />
                        <StatCard
                            title="Roles"
                            value={roles.length}
                            icon={Shield}
                        />
                    </div>
                }
            >
                <DataTable columns={columns} data={staff} isLoading={loading} />
            </DataPageLayout>

            <AutoFormModal
                open={isModalOpen}
                onOpenChange={setIsModalOpen}
                title={modalMode === 'create' ? "Add Staff" : "Edit Staff"}
                fields={displayedFields}
                onSubmit={handleSubmit}
                initialValues={selectedStaff}
                submitLabel={modalMode === 'create' ? "Create Staff" : "Update Staff"}
            />
        </div>
    );
}
