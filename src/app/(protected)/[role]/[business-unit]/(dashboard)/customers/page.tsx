"use client";

import { useEffect, useState } from "react"
import { DynamicDataTable } from "@/components/data-display/tables/DaynamicDataTable"
import { Button } from "@/components/ui/button"
import { useCurrentBusinessUnit } from "@/hooks/useCurrentBusinessUnit"
import { useAuth } from "@/hooks/useAuth"
import { LoadingSpinner } from "@/components/shared/LoadingSpinner"
import { axiosInstance as api } from "@/lib/axios/axiosInstance"
import { userService, roleService } from "@/services/user/user.service"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Plus, Loader2 } from "lucide-react"
import { toast } from "sonner"
import { Switch } from "@/components/ui/switch"

export default function CustomersPage() {
    // Data State
    const [customers, setCustomers] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [roles, setRoles] = useState<any[]>([])

    // Modal / Form State
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [isSaving, setIsSaving] = useState(false)
    const [editingCustomer, setEditingCustomer] = useState<any>(null)

    // Form Data
    const initialFormData = {
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        password: "",
        status: "active" as "active" | "inactive"
    }
    const [formData, setFormData] = useState(initialFormData)

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
            } else {
                setError("Failed to fetch customers")
            }
        } catch (err) {
            console.error("Error fetching customers:", err)
            setError("An error occurred while fetching customers")
        } finally {
            setLoading(false)
        }
    }

    const resetForm = () => {
        setFormData(initialFormData)
        setEditingCustomer(null)
        setIsDialogOpen(false)
    }

    const handleCreate = () => {
        setFormData(initialFormData)
        setEditingCustomer(null)
        setIsDialogOpen(true)
    }

    const handleEdit = (customer: any) => {
        setEditingCustomer(customer)
        setFormData({
            firstName: customer.name?.split(' ')[0] || customer.name || "",
            lastName: customer.name?.split(' ').slice(1).join(' ') || "",
            email: customer.email === 'N/A' ? "" : customer.email,
            phone: customer.phone === 'N/A' ? "" : customer.phone,
            password: "", // Password typically not editable directly or shown
            status: customer.status
        })
        setIsDialogOpen(true)
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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSaving(true)

        try {
            // Find 'customer' role ID
            const customerRole = roles.find(r => r.name === 'customer' || r.slug === 'customer');

            if (!customerRole && !editingCustomer) {
                toast.error("System error: 'Customer' role not found. Please contact admin.")
                setIsSaving(false)
                return
            }

            if (editingCustomer) {
                // Update
                const payload = {
                    name: {
                        firstName: formData.firstName,
                        lastName: formData.lastName
                    },
                    phone: formData.phone,
                    status: formData.status
                    // Note: Email usually shouldn't be changed on simple edit or needs backend support
                }

                const customerId = editingCustomer._id || editingCustomer.id;
                const res = await userService.update(customerId, payload);

                if (res && res.success) {
                    toast.success("Customer updated successfully")
                    resetForm()
                    fetchCustomers()
                } else {
                    toast.error(res?.error || res?.message || "Failed to update customer")
                }

            } else {
                // Create
                const payload = {
                    name: {
                        firstName: formData.firstName,
                        lastName: formData.lastName
                    },
                    email: formData.email,
                    phone: formData.phone,
                    password: formData.password || "123456", // Default if empty
                    roles: [customerRole._id || customerRole.id],
                    businessUnits: currentBusinessUnit ? [currentBusinessUnit.id || currentBusinessUnit._id] : [],
                    status: formData.status
                }

                const res = await userService.create(payload)

                if (res && res.success) {
                    toast.success("Customer created successfully")
                    resetForm()
                    fetchCustomers()
                } else {
                    toast.error(res?.error || res?.message || "Failed to create customer")
                }
            }
        } catch (error: any) {
            console.error("Submit error:", error)
            const errorMessage = error?.response?.data?.error || error?.response?.data?.message || error?.message || "An error occurred";
            toast.error(errorMessage)
        } finally {
            setIsSaving(false)
        }
    }

    if (loading) {
        return <div className="flex justify-center py-10"><LoadingSpinner /></div>
    }

    if (error) {
        return <div className="text-red-500 text-center py-10">{error}</div>
    }

    return (
        <div className="container mx-auto py-6 space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Customers</h1>
                    <p className="text-muted-foreground">Manage customer profiles and loyalty programs.</p>
                </div>
                <Button onClick={handleCreate}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Customer
                </Button>
            </div>

            <DynamicDataTable
                dataType="customer"
                data={customers}
                total={customers.length}
                onCreate={handleCreate}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onView={(item) => console.log('View Customer', item)}
                onRefresh={fetchCustomers}
                onExport={(format) => console.log('Export', format)}
                config={{
                    showToolbar: true,
                    toolbar: { placeholder: "Search customers..." }
                }}
            />

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>{editingCustomer ? 'Edit Customer' : 'Add New Customer'}</DialogTitle>
                        <DialogDescription>
                            {editingCustomer
                                ? "Update the customer's details below."
                                : "Enter the details for the new customer."}
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleSubmit}>
                        <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="firstName">First Name</Label>
                                    <Input
                                        id="firstName"
                                        value={formData.firstName}
                                        onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="lastName">Last Name</Label>
                                    <Input
                                        id="lastName"
                                        value={formData.lastName}
                                        onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    disabled={!!editingCustomer} // Often email is immutable or requires special handling
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="phone">Phone</Label>
                                <Input
                                    id="phone"
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                />
                            </div>

                            {!editingCustomer && (
                                <div className="space-y-2">
                                    <Label htmlFor="password">Password</Label>
                                    <Input
                                        id="password"
                                        type="password"
                                        placeholder="Default: 123456"
                                        value={formData.password}
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    />
                                </div>
                            )}

                            <div className="flex items-center space-x-2">
                                <Switch
                                    id="status"
                                    checked={formData.status === 'active'}
                                    onCheckedChange={(checked) => setFormData({ ...formData, status: checked ? 'active' : 'inactive' })}
                                />
                                <Label htmlFor="status">Active Status</Label>
                            </div>
                        </div>
                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={resetForm}>Cancel</Button>
                            <Button type="submit" disabled={isSaving}>
                                {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                {editingCustomer ? 'Update' : 'Create'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
}
