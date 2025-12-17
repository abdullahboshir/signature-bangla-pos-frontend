"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Users, User, Search, MoreHorizontal, Edit, Trash2, ShieldCheck, MapPin, Smartphone, CheckCircle, RefreshCw, Download, Clock, Calendar, Check, X, Building, Layers } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useCurrentBusinessUnit } from "@/hooks/useCurrentBusinessUnit"
import { useAuth } from "@/hooks/useAuth"
import { LoadingSpinner } from "@/components/shared/LoadingSpinner"
import { axiosInstance as api } from "@/lib/axios/axiosInstance"
import { Switch } from "@/components/ui/switch"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DataTable } from "@/components/shared/DataTable"
import { DataPageLayout } from "@/components/shared/DataPageLayout"
import { StatCard } from "@/components/shared/StatCard"
import { ColumnDef } from "@tanstack/react-table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { AutoFormModal } from "@/components/shared/AutoFormModal"
import { useParams } from "next/navigation"

const USER_STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  SUSPENDED: 'suspended',
  PENDING: 'pending',
  BLOCKED: 'blocked',
} as const;

export default function AllUsersPage() {
  const [users, setUsers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")

  // Edit/Create State
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingUser, setEditingUser] = useState<any>(null)
  const [availableRoles, setAvailableRoles] = useState<any[]>([])

  const { currentBusinessUnit } = useCurrentBusinessUnit()
  const { user: currentUser } = useAuth()
  const params = useParams();

  // Derived state for filtered users
  const getFilteredUsers = () => {
    let data = users;

    // Search Filter
    if (searchTerm) {
      const lower = searchTerm.toLowerCase();
      data = data.filter(u =>
        u.name?.toLowerCase().includes(lower) ||
        u.email?.toLowerCase().includes(lower) ||
        u.phone?.includes(searchTerm)
      );
    }

    if (activeTab === 'all') return data;
    if (activeTab === 'staff') {
      return data.filter(u => u.roles?.some((r: any) =>
        ['super-admin', 'admin', 'manager', 'sales-associate', 'support-agent'].includes(typeof r === 'string' ? r : r.name) || r.isSystemRole
      ));
    }
    if (activeTab === 'customer') {
      return data.filter(u => u.roles?.some((r: any) => (typeof r === 'string' ? r : r.name) === 'customer'));
    }
    if (activeTab === 'supplier') {
      return data.filter(u => u.roles?.some((r: any) => ['supplier', 'vendor'].includes(typeof r === 'string' ? r : r.name)));
    }
    return data;
  }

  const filteredData = getFilteredUsers();

  useEffect(() => {
    fetchUsers()
    fetchRoles()
  }, [currentBusinessUnit])

  const fetchRoles = async () => {
    try {
      const response = await api.get('/super-admin/users/roles')
      if ((response.data as any)?.success) {
        const rolesData = Array.isArray(response.data) ? response.data : (response.data.data || response.data);
        setAvailableRoles(Array.isArray(rolesData) ? rolesData : []);
      }
    } catch (err) {
      console.error("Failed to fetch roles", err);
    }
  }

  const fetchUsers = async () => {
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
          if (possibleArray) allUsers = possibleArray as any[];
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

        const formattedUsers = allUsers.map((user: any) => ({
          ...user,
          name: typeof user.name === 'object' && user.name !== null
            ? `${user.name.firstName || ''} ${user.name.lastName || ''}`.trim() || 'Unnamed'
            : user.name,
        }));
        setUsers(formattedUsers)
      } else {
        setError("Failed to fetch users")
      }
    } catch (err) {
      console.error("Error fetching users:", err)
      setError("An error occurred while fetching users")
    } finally {
      setLoading(false)
    }
  }

  const handleCreate = () => {
    setEditingUser(null);
    setIsModalOpen(true);
  }

  const handleEdit = (user: any) => {
    setEditingUser(user);
    setIsModalOpen(true);
  }

  const handleSubmit = async (data: any) => {
    try {
      if (editingUser) {
        // Edit Mode
        const updatePayload = {
          roles: [data.role],
          status: data.status,
        };
        await api.patch(`/super-admin/users/${editingUser._id || editingUser.id}`, updatePayload);
        toast.success("User updated successfully");
      } else {
        // Create Mode
        const createPayload = {
          name: { firstName: data.firstName, lastName: data.lastName },
          email: data.email,
          phone: data.phone,
          password: data.password || "default123",
          roles: [data.role],
          businessUnits: [currentBusinessUnit?.id || params["business-unit"]],
          status: "active"
        };
        await api.post('/super-admin/users/create', createPayload);
        toast.success("User created successfully");
      }
      setIsModalOpen(false);
      fetchUsers();
    } catch (err: any) {
      console.error(err);
      toast.error(err?.response?.data?.message || "Operation failed");
    }
  };

  const handleDelete = (user: any) => {
    if (confirm("Are you sure you want to delete this user?")) {
      toast.info("Delete functionality implementation in progress");
    }
  }

  const handleQuickStatusUpdate = async (userId: string, newStatus: string) => {
    try {
      toast.promise(
        api.patch(`/super-admin/users/${userId}`, { status: newStatus }),
        {
          loading: 'Updating status...',
          success: (data: any) => {
            fetchUsers();
            return `Status updated to ${newStatus}`;
          },
          error: 'Failed to update status',
        }
      );
    } catch (err) {
      console.error("Status update error", err);
    }
  }

  // Define Columns
  const columns: ColumnDef<any>[] = [
    {
      accessorKey: "name",
      header: "User",
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          <Avatar className="h-9 w-9">
            <AvatarImage src={row.original.avatar} alt={row.original.name} />
            <AvatarFallback>{row.original.name?.charAt(0)?.toUpperCase() || "U"}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="font-medium">{row.original.name}</span>
            <span className="text-xs text-muted-foreground">{row.original.email}</span>
          </div>
        </div>
      )
    },
    {
      accessorKey: "roles",
      header: "Roles",
      cell: ({ row }) => (
        <div className="flex flex-wrap gap-1">
          {row.original.roles?.map((r: any, idx: number) => {
            const roleName = typeof r === 'string' ? r : r.name;
            return (
              <Badge key={idx} variant="outline" className="text-xs font-normal">
                {roleName}
              </Badge>
            );
          })}
        </div>
      )
    },
    {
      accessorKey: "phone",
      header: "Contact",
      cell: ({ row }) => row.original.phone || "—",
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const user = row.original;
        const isTargetSuperAdmin = user.roles?.some((r: any) => (typeof r === 'string' ? r : r.name) === 'super-admin');

        const getStatusVariant = (status: string) => {
          switch (status) {
            case USER_STATUS.ACTIVE: return 'default';
            case USER_STATUS.BLOCKED: return 'destructive';
            case USER_STATUS.SUSPENDED: return 'destructive';
            case USER_STATUS.PENDING: return 'outline';
            default: return 'secondary';
          }
        };

        if (isTargetSuperAdmin) {
          return (
            <Badge variant={getStatusVariant(user.status)}>
              {user.status || "Pending"}
            </Badge>
          )
        }

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div className="cursor-pointer hover:opacity-80">
                <Badge variant={getStatusVariant(user.status)}>
                  {user.status || "Pending"}
                </Badge>
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuLabel>Change Status</DropdownMenuLabel>
              {Object.values(USER_STATUS).map((status) => (
                <DropdownMenuItem
                  key={status}
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent row expand
                    handleQuickStatusUpdate(user._id || user.id, status)
                  }}
                  disabled={user.status === status}
                >
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        )
      }
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const isTargetSuperAdmin = row.original.roles?.some((r: any) => (typeof r === 'string' ? r : r.name) === 'super-admin');

        if (isTargetSuperAdmin) {
          return <div className="w-8" />; // Empty placeholder
        }

        return (
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
                <Edit className="mr-2 h-4 w-4" /> Edit Role/Status
              </DropdownMenuItem>
              <DropdownMenuItem className="text-destructive" onClick={() => handleDelete(row.original)}>
                <Trash2 className="mr-2 h-4 w-4" /> Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )
      }
    }
  ];

  return (
    <>
      <DataPageLayout
        title="All Users"
        description="View and manage all user accounts across the system."
        createAction={{
          label: "Add User",
          onClick: handleCreate
        }}
        stats={
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <StatCard
              title="Total Users"
              value={users.length}
              icon={Users}
            />
            <StatCard
              title="Active Staff"
              value={users.filter(u => u.status === 'active' && u.roles?.some((r: any) => ['super-admin', 'admin', 'manager', 'sales-associate'].includes(typeof r === 'string' ? r : r.name))).length}
              icon={ShieldCheck}
            />
            <StatCard
              title="Active Customers"
              value={users.filter(u => u.status === 'active' && u.roles?.some((r: any) => (typeof r === 'string' ? r : r.name) === 'customer')).length}
              icon={User}
            />
            <StatCard
              title="New (Pending)"
              value={users.filter(u => u.status === 'pending').length}
              icon={CheckCircle}
            />
          </div>
        }
        tabs={[
          { value: "all", label: "All Users" },
          { value: "staff", label: "Staff" },
          { value: "customer", label: "Customers" },
          { value: "supplier", label: "Suppliers" },
        ]}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        extraFilters={
          <div className="flex items-center gap-2 flex-1">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search users..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button variant="outline" size="sm" onClick={fetchUsers}>
              <RefreshCw className="mr-2 h-4 w-4" /> Refresh
            </Button>
            <Button variant="outline" size="sm" onClick={() => console.log('Export')}>
              <Download className="mr-2 h-4 w-4" /> Export
            </Button>
          </div>
        }
      >
        <DataTable
          columns={columns}
          data={filteredData}
          isLoading={loading}
          renderSubComponent={(row) => {
            const user = row.original;
            return (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-2 bg-muted/30 rounded-lg">
                {/* Personal & Security Info */}
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-semibold mb-2 flex items-center text-primary">
                      <User className="mr-2 h-4 w-4" /> Personal Information
                    </h4>
                    <div className="bg-card rounded-md border p-3 space-y-2 text-sm">
                      <div className="grid grid-cols-[100px_1fr] gap-1">
                        <span className="text-muted-foreground">Full Name:</span>
                        <span className="font-medium">{user.name}</span>

                        <span className="text-muted-foreground">Email:</span>
                        <span className="flex items-center gap-1">
                          {user.email}
                          {user.isEmailVerified ?
                            <Check className="h-3 w-3 text-green-500" /> :
                            <X className="h-3 w-3 text-red-500" />
                          }
                        </span>

                        <span className="text-muted-foreground">Phone:</span>
                        <span className="flex items-center gap-1">
                          {user.phone || 'N/A'}
                          {user.phone && (user.isPhoneVerified ?
                            <Check className="h-3 w-3 text-green-500" /> :
                            <X className="h-3 w-3 text-red-500" />
                          )}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-semibold mb-2 flex items-center text-primary">
                      <ShieldCheck className="mr-2 h-4 w-4" /> Security
                    </h4>
                    <div className="bg-card rounded-md border p-3 space-y-2 text-sm">
                      <div className="grid grid-cols-[120px_1fr] gap-1">
                        <span className="text-muted-foreground">Status:</span>
                        <Badge variant={user.status === 'active' ? 'default' : 'secondary'} className="w-fit h-5 text-[10px]">
                          {user.status}
                        </Badge>

                        <span className="text-muted-foreground">Password Change:</span>
                        <span>{user.needsPasswordChange ? "Required" : "Not Required"}</span>

                        <span className="text-muted-foreground">Last Login:</span>
                        <span>{user.lastLogin ? new Date(user.lastLogin).toLocaleString() : 'Never'}</span>

                        <span className="text-muted-foreground">Joined:</span>
                        <span>{user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Organization Info */}
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-semibold mb-2 flex items-center text-primary">
                      <Building className="mr-2 h-4 w-4" /> Organization
                    </h4>
                    <div className="bg-card rounded-md border p-3 space-y-3 text-sm">
                      <div>
                        <span className="text-muted-foreground block mb-1 text-xs">Business Units</span>
                        <div className="flex flex-wrap gap-1">
                          {user.businessUnits?.length > 0 ? user.businessUnits.map((bu: any, i: number) => (
                            <Badge key={i} variant="secondary" className="text-[10px]">
                              {typeof bu === 'string' ? bu : (bu.name || 'Unit')}
                            </Badge>
                          )) : <span className="text-muted-foreground italic text-xs">None</span>}
                        </div>
                      </div>

                      <div>
                        <span className="text-muted-foreground block mb-1 text-xs">Departments</span>
                        <div className="flex flex-wrap gap-1">
                          {user.departments?.length > 0 ? user.departments.map((d: any, i: number) => (
                            <Badge key={i} variant="outline" className="text-[10px]">
                              {typeof d === 'string' ? d : d.name}
                            </Badge>
                          )) : <span className="text-muted-foreground italic text-xs">None</span>}
                        </div>
                      </div>

                      <div>
                        <span className="text-muted-foreground block mb-1 text-xs">Branches</span>
                        <div className="flex flex-wrap gap-1">
                          {user.branches?.length > 0 ? user.branches.map((b: any, i: number) => (
                            <Badge key={i} variant="outline" className="text-[10px]">
                              {typeof b === 'string' ? b : b.name}
                            </Badge>
                          )) : <span className="text-muted-foreground italic text-xs">None</span>}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Permissions & Roles */}
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-semibold mb-2 flex items-center text-primary">
                      <Layers className="mr-2 h-4 w-4" /> Roles & Permissions
                    </h4>
                    <div className="bg-card rounded-md border p-3 space-y-3 text-sm">
                      <div>
                        <span className="text-muted-foreground block mb-1 text-xs">Assigned Roles</span>
                        <div className="flex flex-wrap gap-1">
                          {user.roles?.map((r: any, idx: number) => (
                            <Badge key={idx} className="bg-primary/10 text-primary hover:bg-primary/20 border-0 text-[10px]">
                              {typeof r === 'string' ? r : r.name}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div>
                        <span className="text-muted-foreground block mb-1 text-xs">Direct Permissions</span>
                        <div className="p-2 bg-muted rounded text-xs">
                          <span className="font-semibold">{user.directPermissions?.length || 0}</span> custom permissions assigned.
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )
          }}
        />
      </DataPageLayout>

      <AutoFormModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        title={editingUser ? "Edit User" : "Add New User"}
        description={editingUser ? "Edit user details and roles." : "Create a new user account."}
        fields={[
          {
            name: "firstName",
            label: "First Name",
            type: "text",
            required: true,
            placeholder: "John",
            disabled: !!editingUser
          },
          {
            name: "lastName",
            label: "Last Name",
            type: "text",
            placeholder: "Doe",
            disabled: !!editingUser
          },
          {
            name: "email",
            label: "Email",
            type: "email",
            required: true,
            placeholder: "email@example.com",
            disabled: !!editingUser
          },
          {
            name: "phone",
            label: "Phone",
            type: "text",
            placeholder: "Phone number",
            disabled: !!editingUser
          },
          !editingUser && {
            name: "password",
            label: "Password",
            type: "text",
            placeholder: "Default: default123",
          },
          {
            name: "role",
            label: "Role",
            type: "select",
            required: true,
            options: availableRoles.map(r => ({ label: r.name, value: r._id || r.id })),
            placeholder: "Select Role"
          },
          {
            name: "status",
            label: "Status",
            type: "select",
            required: true,
            options: Object.values(USER_STATUS).map(s => ({ label: s.toUpperCase(), value: s })),
            defaultValue: "active"
          }
        ].filter(Boolean) as any}
        defaultValues={editingUser ? {
          firstName: typeof editingUser.name === 'string' ? editingUser.name.split(' ')[0] : editingUser.name?.firstName,
          lastName: typeof editingUser.name === 'string' ? editingUser.name.split(' ')[1] : editingUser.name?.lastName,
          email: editingUser.email,
          phone: editingUser.phone,
          role: editingUser.roles?.[0]?._id || editingUser.roles?.[0]?.id || (typeof editingUser.roles?.[0] === 'string' ? editingUser.roles?.[0] : ''),
          status: editingUser.status
        } : { status: "active" }}
        onSubmit={handleSubmit}
        submitLabel={editingUser ? "Update User" : "Create User"}
      />
    </>
  )
}
