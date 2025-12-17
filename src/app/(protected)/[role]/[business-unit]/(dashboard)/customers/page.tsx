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
import { Users, CheckCircle, MoreHorizontal, Edit, Trash2 } from "lucide-react"
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

export default function CustomersPage() {
    // Data State
    const [customers, setCustomers] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [roles, setRoles] = useState<any[]>([])

    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [selectedCustomer, setSelectedCustomer] = useState<any>(null)
    const [modalMode, setModalMode] = useState<'create' | 'edit'>('create')

    const { currentBusinessUnit } = useCurrentBusinessUnit()
    const { user: currentUser } = useAuth()

    useEffect(() => {
        fetchCustomers()
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

    const fetchCustomers = async () => {
        try {
            setLoading(true)
            const response = await api.get('/super-admin/users/all-users')

            const resData = (response as any);

            if (resData.success || (resData.data && resData.data.success)) {
                let allUsers: any[] = [];

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

                const customerUsers = allUsers.filter((u: any) =>
                    u.roles?.some((r: any) => {
                        const roleName = typeof r === 'string' ? r : r.name;
                        return roleName === 'customer';
                    })
                );

                const formattedCustomers = customerUsers.map((user: any) => ({
                    ...user,
                    name: typeof user.name === 'object' && user.name !== null
                        ? `${user.name.firstName || ''} ${user.name.lastName || ''}`.trim() || 'Unnamed'
                        : user.name,
                    status: user.status || 'inactive',
                    email: user.email || 'N/A',
                    phone: user.phone || 'N/A',
                }));

                setCustomers(formattedCustomers)
            }
        } catch (err) {
            console.error("Error fetching customers:", err)
            toast.error("Failed to fetch customers")
        } finally {
            setLoading(false)
        }
    }

    const handleCreate = () => {
        setSelectedCustomer(null)
        setModalMode('create')
        setIsModalOpen(true)
    }

    const handleEdit = (customer: any) => {
        // Transform data for form if needed, mainly name structure
        const formData = {
            ...customer,
            firstName: customer.name?.split(' ')[0] || "",
            lastName: customer.name?.split(' ').slice(1).join(' ') || "",
        };
        setSelectedCustomer(formData)
        setModalMode('edit')
        setIsModalOpen(true)
    }

    const handleDelete = async (customer: any) => {
        if (!confirm("Are you sure you want to delete this customer?")) return;

        try {
            const customerId = customer._id || customer.id;
            const res = await userService.delete(customerId);
            if (res && res.success) {
                toast.success("Customer deleted successfully")
                fetchCustomers()
            } else {
                toast.error("Failed to delete customer")
            }
        } catch (error) {
            console.error("Delete error:", error)
            toast.error("An error occurred while deleting")
        }
    }

    const handleSubmit = async (values: any) => {
        try {
            // Find 'customer' role ID
            const customerRole = roles.find(r => r.name === 'customer' || r.slug === 'customer');

            if (!customerRole && modalMode === 'create') {
                toast.error("System error: 'Customer' role not found.")
                return
            }

            if (modalMode === 'edit') {
                // Update
                const payload = {
                    name: {
                        firstName: values.firstName,
                        lastName: values.lastName
                    },
                    phone: values.phone,
                    status: values.status
                }
                const customerId = selectedCustomer._id || selectedCustomer.id;
                const res = await userService.update(customerId, payload);
                if (res && res.success) {
                    toast.success("Customer updated successfully")
                }
            } else {
                // Create
                const payload = {
                    name: {
                        firstName: values.firstName,
                        lastName: values.lastName
                    },
                    email: values.email,
                    phone: values.phone,
                    password: values.password || "123456",
                    roles: [customerRole._id || customerRole.id],
                    businessUnits: currentBusinessUnit ? [currentBusinessUnit.id || currentBusinessUnit._id] : [],
                    status: values.status
                }
                const res = await userService.create(payload)
                if (res && res.success) {
                    toast.success("Customer created successfully")
                }
            }
            setIsModalOpen(false)
            fetchCustomers()
        } catch (error: any) {
            console.error("Submit error:", error)
            toast.error(error?.message || "Operation failed")
        }
    }

    const customerFields: FieldConfig[] = [
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
            // Disable email in edit mode (handled by AutoFormModal via disabled prop or logic?) 
            // AutoFormModal generally updates all fields. Email shouldn't change for users easily.
            // But for now let's allow it or keep it simple.
        },
        {
            name: "phone",
            label: "Phone",
            type: "text",
        },
        {
            name: "password",
            label: "Password",
            type: "password",
            placeholder: "Default: 123456",
            // Hide in edit mode? AutoFormModal supports filtering fields?
            // Currently AutoFormModal takes 'fields' prop.
            // I can dynamically adjust fields below.
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

    // Filter fields based on mode
    const displayedFields = modalMode === 'edit'
        ? customerFields.filter(f => f.name !== 'password' && f.name !== 'email') // Hide password/email on edit for safety/simplicity
        : customerFields;


    // Define Columns
    const columns: ColumnDef<any>[] = [
        {
            accessorKey: "name",
            header: "Name",
            cell: ({ row }) => <span className="font-medium">{row.original.name}</span>,
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
                            <Edit className="mr-2 h-4 w-4" /> Edit Customer
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
                title="Customers"
                description="Manage customer profiles and loyalty programs."
                createAction={{
                    label: "Add Customer",
                    onClick: handleCreate
                }}
                stats={
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                        <StatCard
                            title="Total Customers"
                            value={customers.length}
                            icon={Users}
                        />
                        <StatCard
                            title="Active Customers"
                            value={customers.filter(c => c.status === 'active').length}
                            icon={CheckCircle}
                        />
                    </div>
                }
            >
                <DataTable columns={columns} data={customers} isLoading={loading} />
            </DataPageLayout>

            <AutoFormModal
                open={isModalOpen}
                onOpenChange={setIsModalOpen}
                title={modalMode === 'create' ? "Add Customer" : "Edit Customer"}
                fields={displayedFields}
                onSubmit={handleSubmit}
                initialValues={selectedCustomer}
                submitLabel={modalMode === 'create' ? "Create Customer" : "Update Customer"}
            />
        </div>
    );
}
