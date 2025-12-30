"use client"

import { useEffect, useState } from "react"
import { DynamicDataTable } from "@/components/data-display/tables/DaynamicDataTable"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { useCurrentBusinessUnit } from "@/hooks/useCurrentBusinessUnit"
import { usePermissions } from "@/hooks/usePermissions";
import { useAuth } from "@/hooks/useAuth"
import { LoadingSpinner } from "@/components/shared/LoadingSpinner"
import { useGetAllUsersQuery } from "@/redux/api/iam/userApi"

export default function CustomerPage() {
  const [customers, setCustomers] = useState<any[]>([])
  const [error, setError] = useState<string | null>(null)

  const { currentBusinessUnit } = useCurrentBusinessUnit()
  const { user: currentUser } = useAuth()

  // RTK Query
  const { data: allUsersResponse, isLoading: loading, error: queryError } = useGetAllUsersQuery({});

  useEffect(() => {
    if (allUsersResponse) {
      let allUsers: any[] = [];
      const resData = allUsersResponse;

      // Parsing logic as per observed response patterns
      if (Array.isArray(resData)) {
        allUsers = resData;
      } else if (Array.isArray(resData.data)) {
        allUsers = resData.data;
      } else if (resData.result && Array.isArray(resData.result)) {
        allUsers = resData.result;
      } else if (resData.data && Array.isArray(resData.data.result)) {
        allUsers = resData.data.result;
      } else if (resData.data && typeof resData.data === 'object') {
        // Fallback for object with array values
        const possibleArray = Object.values(resData.data).find(val => Array.isArray(val));
        if (possibleArray) allUsers = possibleArray as any[];
      }

      const { isSuperAdmin } = usePermissions();

      // Filter by Business Unit
      let filteredUsers = allUsers;
      if (!isSuperAdmin && currentBusinessUnit) {
        filteredUsers = allUsers.filter((user: any) => {
          if (!user.businessUnits) return false;
          return user.businessUnits.some((bu: any) => {
            const buId = typeof bu === 'string' ? bu : (bu.id || bu.slug || bu._id);
            return buId === currentBusinessUnit.id || buId === currentBusinessUnit.slug || buId === currentBusinessUnit._id;
          });
        });
      }

      // Filter for Customers ONLY
      const customerUsers = filteredUsers.filter((u: any) =>
        u.roles?.some((r: any) => {
          const roleName = typeof r === 'string' ? r : r.name;
          return roleName === 'customer';
        })
      );

      // Format data for table
      const formattedCustomers = customerUsers.map((user: any) => ({
        ...user,
        name: typeof user.name === 'object' && user.name !== null
          ? `${user.name.firstName || ''} ${user.name.lastName || ''}`.trim() || 'Unnamed'
          : user.name,
        status: user.status || 'inactive',
        email: user.email || 'N/A',
        phone: user.phone || 'N/A',
      }));

      setCustomers(formattedCustomers);
    }

    if (queryError) {
      setError("Failed to fetch customers");
      console.error("Error fetching customers:", queryError);
    }

  }, [allUsersResponse, currentBusinessUnit, currentUser, queryError]);

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
        onRefresh={() => { /* automatic refetch via tag invalidation or polling if needed */ }}
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
