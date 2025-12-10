"use client"

import { useEffect, useState } from "react"
import { DynamicDataTable } from "@/components/data-display/tables/DaynamicDataTable"
import { Button } from "@/components/ui/button"
import { Plus, MapPin, Globe, Calendar, Smartphone, ShieldCheck } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useCurrentBusinessUnit } from "@/hooks/useCurrentBusinessUnit"
import { useAuth } from "@/hooks/useAuth"
import { LoadingSpinner } from "@/components/shared/LoadingSpinner"
import { axiosInstance as api } from "@/lib/axios/axiosInstance"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Input } from "@/components/ui/input"
import { toast } from "sonner" // Assuming sonner or similar toast is used

export default function AllUsersPage() {
  const [users, setUsers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Edit State
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [editingUser, setEditingUser] = useState<any>(null)
  const [availableRoles, setAvailableRoles] = useState<any[]>([])
  const [isSaving, setIsSaving] = useState(false)

  const { currentBusinessUnit } = useCurrentBusinessUnit()
  const { user: currentUser } = useAuth()

  useEffect(() => {
    fetchUsers()
    fetchRoles()
  }, [currentBusinessUnit])

  const fetchRoles = async () => {
    try {
      // Fetch roles to populate the dropdown
      const response = await api.get('/super-admin/users/roles')
      if (response.success || (response.data && response.data.success)) {
        const rolesData = Array.isArray(response.data) ? response.data : (response.data.data || response.data);
        // Ensure rolesData is an array
        setAvailableRoles(Array.isArray(rolesData) ? rolesData : []);
        console.log("Roles fetched:", rolesData);
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
        } else if (resData.data && typeof resData.data === 'object') {
          console.warn("Users data might be nested unexpectedly", resData.data);
          allUsers = [];
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
            : user.name
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
    console.log("Create user clicked")
  }

  const handleEdit = (user: any) => {
    console.log("Editing user:", user);
    setEditingUser({
      ...user,
      // Extract role ID safely
      roleIds: user.roles?.map((r: any) => typeof r === 'string' ? r : (r._id || r.id)) || [],
      // Ensure status is valid
      status: user.status || 'pending'
    })
    setIsEditOpen(true)
  }

  const handleSaveUser = async () => {
    if (!editingUser) return;

    try {
      setIsSaving(true);
      // Prepare payload correctly
      const payload = {
        roles: editingUser.roleIds,
        status: editingUser.status
      };

      console.log("Sending Payload:", payload);

      const response = await api.patch(`/super-admin/users/${editingUser._id || editingUser.id}`, payload);

      if (response.success || (response.data && response.data.success)) {
        setIsEditOpen(false);
        setEditingUser(null);
        fetchUsers(); // Refresh list
        // Optionally show success toast if available
        alert("User updated successfully!");
      } else {
        alert("Failed to update user");
      }
    } catch (err) {
      console.error("Error updating user:", err);
      alert("An error occurred while updating the user");
    } finally {
      setIsSaving(false);
    }
  }

  const handleDelete = (user: any) => {
    console.log("Delete user", user)
  }

  const handleView = (user: any) => {
    console.log("View user", user)
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
          <h1 className="text-3xl font-bold tracking-tight">All Users</h1>
          <p className="text-muted-foreground">
            View and manage all user accounts across the system.
          </p>
        </div>
      </div>

      <DynamicDataTable
        dataType="user"
        data={users}
        total={users.length}
        onCreate={handleCreate}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onView={handleView}
        onRefresh={fetchUsers}
        onExport={(format) => console.log('Export', format)}
        config={{
          showToolbar: true,
          toolbar: {
            placeholder: "Search users..."
          }
        }}
        renderSubComponent={(row) => {
          const user = row.original;
          return (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="shadow-none border-dashed">
                <CardContent className="pt-6 space-y-3">
                  <h4 className="font-semibold text-sm flex items-center mb-2">
                    <ShieldCheck className="mr-2 h-4 w-4 text-primary" />
                    Account Details
                  </h4>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <span className="text-muted-foreground">Phone:</span>
                    <span className="flex items-center"><Smartphone className="h-3 w-3 mr-1" /> {user.phone || 'N/A'}</span>

                    <span className="text-muted-foreground">Location:</span>
                    <span className="flex items-center"><MapPin className="h-3 w-3 mr-1" /> {user.address || 'N/A'}</span>

                    <span className="text-muted-foreground">Status:</span>
                    <Badge variant={user.status === 'active' ? 'default' : 'secondary'}>{user.status}</Badge>
                  </div>
                </CardContent>
              </Card>
              <Card className="shadow-none border-dashed bg-muted/20">
                <CardContent className="pt-6 space-y-3">
                  <h4 className="font-semibold text-sm mb-2">Assigned Roles</h4>
                  <div className="flex flex-wrap gap-2">
                    {user.roles && user.roles.map((role: any) => (
                      <Badge key={role._id || role.name} variant="outline" className="bg-background">
                        {role.name}
                      </Badge>
                    ))}
                  </div>

                  <h4 className="font-semibold text-sm mb-2 mt-4">Business Units</h4>
                  <div className="flex flex-wrap gap-2">
                    {user.businessUnits && user.businessUnits.length > 0 ? (
                      user.businessUnits.map((bu: any) => {
                        const buName = typeof bu === 'string' ? bu : (bu.name || bu.firstName || 'Unnamed Unit');
                        const buId = typeof bu === 'string' ? bu : (bu._id || bu.id);
                        return (
                          <Badge key={buId} variant="secondary">
                            {buName}
                          </Badge>
                        );
                      })
                    ) : (
                      <span className="text-muted-foreground text-xs">No Business Unit Assigned</span>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          )
        }}
      />

      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
            <DialogDescription>
              Make changes to the user's role and status here. Click save when you're done.
            </DialogDescription>
          </DialogHeader>

          {editingUser && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Name
                </Label>
                <Input
                  id="name"
                  value={typeof editingUser.name === 'string' ? editingUser.name : ((editingUser.name?.firstName || '') + ' ' + (editingUser.name?.lastName || '')).trim()}
                  disabled
                  className="col-span-3"
                />
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="role" className="text-right">
                  Role
                </Label>
                <div className="col-span-3">
                  <Select
                    value={editingUser.roleIds?.[0] || ''}
                    onValueChange={(value) => setEditingUser({ ...editingUser, roleIds: [value] })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a role" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableRoles.length > 0 ? availableRoles.map((role) => (
                        <SelectItem key={role._id || role.id} value={role._id || role.id}>
                          {role.name}
                        </SelectItem>
                      )) : (
                        <div className="p-2 text-sm text-muted-foreground">No roles available</div>
                      )}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="status" className="text-right">
                  Status
                </Label>
                <div className="col-span-3 flex items-center space-x-2">
                  <Switch
                    id="status"
                    checked={editingUser.status === 'active'}
                    onCheckedChange={(checked) => setEditingUser({ ...editingUser, status: checked ? 'active' : 'inactive' })}
                  />
                  <Label htmlFor="status">{editingUser.status === 'active' ? 'Active' : 'Inactive'}</Label>
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditOpen(false)}>Cancel</Button>
            <Button onClick={handleSaveUser} disabled={isSaving}>
              {isSaving ? <LoadingSpinner size="sm" className="mr-2" /> : null}
              Save changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
