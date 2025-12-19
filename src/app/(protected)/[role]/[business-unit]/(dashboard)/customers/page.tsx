"use client";

import { useMemo, useState } from "react"
import { DataTable } from "@/components/shared/DataTable"
import { DataPageLayout } from "@/components/shared/DataPageLayout"
import { StatCard } from "@/components/shared/StatCard"
import { ColumnDef } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { useCurrentBusinessUnit } from "@/hooks/useCurrentBusinessUnit"
import { useAuth } from "@/hooks/useAuth"
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
import {
    useGetAllUsersQuery,
    useCreateUserMutation,
    useUpdateUserMutation,
    useDeleteUserMutation
} from "@/redux/api/userApi"
import { useGetRolesQuery } from "@/redux/api/roleApi"

export default function CustomersPage() {
    // RTK Query Hooks
    const { data: usersData, isLoading: isUsersLoading } = useGetAllUsersQuery({})
    const { data: rolesData } = useGetRolesQuery({})
    const [createUser, { isLoading: isCreating }] = useCreateUserMutation()
    const [updateUser, { isLoading: isUpdating }] = useUpdateUserMutation()
    const [deleteUser] = useDeleteUserMutation()

    // Derived State
    const roles = Array.isArray(rolesData) ? rolesData : []

    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [selectedCustomer, setSelectedCustomer] = useState<any>(null)
    const [modalMode, setModalMode] = useState<'create' | 'edit'>('create')

    const { currentBusinessUnit } = useCurrentBusinessUnit()
    const { user: currentUser } = useAuth()

    const customers = useMemo(() => {
        if (!usersData?.data) return []

        // Normalize users list
        let allUsers: any[] = []
        if (Array.isArray(usersData.data)) {
            allUsers = usersData.data;
        } else if (usersData.data && Array.isArray(usersData.data.data)) {
            allUsers = usersData.data.data;
        } else if (usersData.data && Array.isArray(usersData.data.result)) {
            allUsers = usersData.data.result;
        } else if (usersData.result && Array.isArray(usersData.result)) {
            allUsers = usersData.result;
        } else {
            // Fallback for weird structures
            const possibleArray = Object.values(usersData.data).find(val => Array.isArray(val));
            allUsers = possibleArray ? (possibleArray as any[]) : [];
        }

        const isSuperAdmin = currentUser?.roles?.some((r: any) => r.name === 'super-admin')

        // Filter by Business Unit
        if (!isSuperAdmin && currentBusinessUnit) {
            allUsers = allUsers.filter((user: any) => {
                if (!user.businessUnits) return false;
                return user.businessUnits.some((bu: any) => {
                    const buId = typeof bu === 'string' ? bu : (bu.id || bu.slug || bu._id);
                    return buId === currentBusinessUnit.id || buId === currentBusinessUnit.slug || buId === currentBusinessUnit._id;
                });
            });
        }

        // Filter for Customers
        const customerUsers = allUsers.filter((u: any) =>
            u.roles?.some((r: any) => {
                const roleName = typeof r === 'string' ? r : r.name;
                return roleName.toLowerCase() === 'customer';
            })
        );

        return customerUsers.map((user: any) => ({
            ...user,
            name: typeof user.name === 'object' && user.name !== null
                ? `${user.name.firstName || ''} ${user.name.lastName || ''}`.trim() || 'Unnamed'
                : user.name,
            status: user.status || 'inactive',
            email: user.email || 'N/A',
            phone: user.phone || 'N/A',
        }));
    }, [usersData, currentBusinessUnit, currentUser]);

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
            await deleteUser(customerId).unwrap();
            toast.success("Customer deleted successfully")
        } catch (error) {
            console.error("Delete error:", error)
            toast.error("An error occurred while deleting")
        }
    }

    const handleSubmit = async (values: any) => {
        try {
            // Find 'customer' role ID
            const customerRole = roles.find((r: any) => r.name === 'customer' || r.slug === 'customer');

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
                await updateUser({ id: customerId, data: payload }).unwrap();
                toast.success("Customer updated successfully")
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
                await createUser(payload).unwrap();
                toast.success("Customer created successfully")
            }
            setIsModalOpen(false)
        } catch (error: any) {
            console.error("Submit error:", error)
            toast.error(error?.data?.message || error?.message || "Operation failed")
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
                <DataTable columns={columns} data={customers} isLoading={isUsersLoading} />
            </DataPageLayout>

            <AutoFormModal
                open={isModalOpen}
                onOpenChange={setIsModalOpen}
                title={modalMode === 'create' ? "Add Customer" : "Edit Customer"}
                fields={displayedFields}
                onSubmit={handleSubmit}
                initialValues={selectedCustomer}
                submitLabel={modalMode === 'create' ? (isCreating ? "Creating..." : "Create Customer") : (isUpdating ? "Updating..." : "Update Customer")}
            />
        </div>
    );
}
