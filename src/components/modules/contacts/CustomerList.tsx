"use client";

import { useMemo, useState } from "react"
import { DataTable } from "@/components/shared/DataTable"
import { DataPageLayout } from "@/components/shared/DataPageLayout"
import { StatCard } from "@/components/shared/StatCard"
import { ColumnDef } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { useCurrentBusinessUnit } from "@/hooks/useCurrentBusinessUnit"
import { useAuth } from "@/hooks/useAuth"
import { Users, CheckCircle, MoreHorizontal, Edit, Trash2, Building } from "lucide-react"
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
import { useGetBusinessUnitsQuery } from "@/redux/api/businessUnitApi"
import { useParams } from "next/navigation"

export const CustomerList = () => {
    // Auth & Context
    const { user: currentUser } = useAuth();
    const params = useParams();
    const paramBusinessUnit = params?.["business-unit"] as string;
    const isSuperAdmin = currentUser?.roles?.some((r: any) => (typeof r === 'string' ? r : r.name) === 'super-admin');

    const { currentBusinessUnit: contextBusinessUnit } = useCurrentBusinessUnit();
    const effectiveBusinessUnitId = isSuperAdmin ? undefined : (contextBusinessUnit?._id || contextBusinessUnit?.id);

    // RTK Query Hooks
    const { data: usersData, isLoading: isUsersLoading } = useGetAllUsersQuery({})
    const { data: rolesData } = useGetRolesQuery({})
    const { data: businessUnits = [] } = useGetBusinessUnitsQuery({ limit: 100 }, { skip: !isSuperAdmin });

    const [createUser, { isLoading: isCreating }] = useCreateUserMutation()
    const [updateUser, { isLoading: isUpdating }] = useUpdateUserMutation()
    const [deleteUser] = useDeleteUserMutation()

    // Derived State
    const roles = Array.isArray(rolesData) ? rolesData : []

    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [selectedCustomer, setSelectedCustomer] = useState<any>(null)
    const [modalMode, setModalMode] = useState<'create' | 'edit'>('create')

    // Filter Logic
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
            const possibleArray = Object.values(usersData.data).find(val => Array.isArray(val));
            allUsers = possibleArray ? (possibleArray as any[]) : [];
        }

        // Filter by Business Unit
        if (!isSuperAdmin && effectiveBusinessUnitId) {
            allUsers = allUsers.filter((user: any) => {
                if (!user.businessUnits) return false;
                return user.businessUnits.some((bu: any) => {
                    const buId = typeof bu === 'string' ? bu : (bu.id || bu.slug || bu._id);
                    return buId === effectiveBusinessUnitId;
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
    }, [usersData, effectiveBusinessUnitId, isSuperAdmin]);

    const handleCreate = () => {
        setSelectedCustomer(null)
        setModalMode('create')
        setIsModalOpen(true)
    }

    const handleEdit = (customer: any) => {
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
            const customerRole = roles.find((r: any) => r.name === 'customer' || r.slug === 'customer');

            if (!customerRole && modalMode === 'create') {
                toast.error("System error: 'Customer' role not found.")
                return
            }

            // Determine Business Units
            let targetBusinessUnits: string[] = [];
            if (isSuperAdmin) {
                if (values.businessUnits) {
                    targetBusinessUnits = Array.isArray(values.businessUnits) ? values.businessUnits : [values.businessUnits];
                }
            } else if (effectiveBusinessUnitId) {
                targetBusinessUnits = [effectiveBusinessUnitId];
            }

            if (modalMode === 'edit') {
                const payload = {
                    name: {
                        firstName: values.firstName,
                        lastName: values.lastName
                    },
                    phone: values.phone,
                    status: values.status,
                    ...(isSuperAdmin && { businessUnits: targetBusinessUnits }) // Only update BUs if SA
                }
                const customerId = selectedCustomer._id || selectedCustomer.id;
                await updateUser({ id: customerId, data: payload }).unwrap();
                toast.success("Customer updated successfully")
            } else {
                const payload = {
                    name: {
                        firstName: values.firstName,
                        lastName: values.lastName
                    },
                    email: values.email,
                    phone: values.phone,
                    password: values.password || "123456",
                    roles: [customerRole._id || customerRole.id],
                    businessUnits: targetBusinessUnits,
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
        ...(isSuperAdmin ? [{
            name: "businessUnits",
            label: "Business Unit Access",
            type: "select", // Multi-select would be better but AutoForm types might be limited. AutoForm supports array?
            // If AutoForm 'select' supports 'multiple', use it. Or single for now.
            // Let's assume typical customer belongs to one or multiple.
            // To simplify, SA assigns to ONE.
            options: businessUnits.map((bu: any) => ({ label: bu.name, value: bu._id })),
            required: false,
            placeholder: "Select Business Unit (Optional)"
        } as FieldConfig] : []),
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
        ? customerFields.filter(f => f.name !== 'password' && f.name !== 'email')
        : customerFields;

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
            accessorKey: "businessUnits",
            header: "Business Unit",
            cell: ({ row }) => {
                if (!row.original.businessUnits || row.original.businessUnits.length === 0) return <span className="text-xs text-muted-foreground">Global</span>;
                // Just show first 1-2
                return <div className="flex flex-wrap gap-1">
                    {row.original.businessUnits.slice(0, 2).map((bu: any) => (
                        <Badge variant="outline" className="text-[10px]" key={typeof bu === 'string' ? bu : bu._id}>
                            {typeof bu === 'object' ? bu.name : 'Unknown BU'}
                        </Badge>
                    ))}
                    {row.original.businessUnits.length > 2 && <span className="text-xs">+{row.original.businessUnits.length - 2}</span>}
                </div>
            },
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

            <AutoFormModal
                open={isModalOpen}
                onOpenChange={setIsModalOpen}
                title={modalMode === 'create' ? "Add Customer" : "Edit Customer"}
                fields={displayedFields}
                onSubmit={handleSubmit}
                initialValues={selectedCustomer}
                submitLabel={modalMode === 'create' ? (isCreating ? "Creating..." : "Create Customer") : (isUpdating ? "Updating..." : "Update Customer")}
            />
        </DataPageLayout>
    );
}
