"use client"

import { useEffect, useState } from "react"
import { DynamicDataTable } from "@/components/data-display/tables/DaynamicDataTable"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { useCurrentBusinessUnit } from "@/hooks/useCurrentBusinessUnit"
import { useAuth } from "@/hooks/useAuth"
import { LoadingSpinner } from "@/components/shared/LoadingSpinner"
import { axiosInstance as api } from "@/lib/axios/axiosInstance"

export default function CustomerPage() {
  const [customers, setCustomers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const { currentBusinessUnit } = useCurrentBusinessUnit()
  const { user: currentUser } = useAuth()

  useEffect(() => {
    fetchCustomers()
  }, [currentBusinessUnit])

  const fetchCustomers = async () => {
    try {
      setLoading(true)
      // Reusing the same endpoint as AllUsersPage since customers are users with a specific role
      const response = await api.get('/super-admin/users/all-users')

      const resData = (response as any);

      if (resData.success || (resData.data && resData.data.success)) {
        let allUsers: any[] = [];

        // Parsing logic similar to AllUsersPage to handle various response structures
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

        // Filter for Customers ONLY
        const customerUsers = allUsers.filter((u: any) =>
          u.roles?.some((r: any) => {
            const roleName = typeof r === 'string' ? r : r.name;
            return roleName === 'customer';
          })
        );

        // Format data for the table
        const formattedCustomers = customerUsers.map((user: any) => ({
          ...user,
          name: typeof user.name === 'object' && user.name !== null
            ? `${user.name.firstName || ''} ${user.name.lastName || ''}`.trim() || 'Unnamed'
            : user.name,
          // Ensure other fields map correctly if needed by the customer table config
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

  const handleCreate = () => {
    console.log("Create customer clicked")
    // Implement create customer modal trigger here if needed
  }

  const handleEdit = (customer: any) => {
    console.log("Edit customer:", customer)
  }

  const handleDelete = (customer: any) => {
    console.log("Delete customer:", customer)
  }

  const handleView = (customer: any) => {
    console.log("View customer:", customer)
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
          <p className="text-muted-foreground">
            Manage your customer contacts and information
          </p>
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
        onView={handleView}
        onRefresh={fetchCustomers}
        onExport={(format) => console.log('Export', format)}
        config={{
          showToolbar: true,
          toolbar: {
            placeholder: 'Search customers...',
          }
        }}
      />
    </div>
  )
}
