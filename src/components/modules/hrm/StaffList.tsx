"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DataTable } from "@/components/shared/DataTable"
import { Users, Plus } from "lucide-react"
import { usePermissions } from "@/hooks/usePermissions"
import { PERMISSION_KEYS } from "@/config/permission-keys"
import { useParams, useRouter } from "next/navigation"
import { ColumnDef } from "@tanstack/react-table"
import { useGetAllUsersQuery } from "@/redux/api/iam/userApi"
import { Badge } from "@/components/ui/badge"

export default function StaffList() {
    const { hasPermission } = usePermissions();
    const router = useRouter();
    const params = useParams();
    const { data: rawData, isLoading } = useGetAllUsersQuery({});

    // Filter mainly staff members (non-customers) or show all with role badge
    const staffData = Array.isArray(rawData) ? rawData.filter((u: any) => u.role?.name !== 'customer') : [];

    const columns: ColumnDef<any>[] = [
        {
            accessorKey: "name",
            header: "Name",
            cell: ({ row }) => (
                <div>
                    <div className="font-medium">{row.original.name}</div>
                    <div className="text-xs text-muted-foreground">{row.original.email}</div>
                </div>
            )
        },
        {
            accessorKey: "role",
            header: "Role",
            cell: ({ row }) => <Badge className="uppercase">{row.original.role?.name || 'N/A'}</Badge>
        },
        {
            accessorKey: "businessUnit",
            header: "Business Unit",
            cell: ({ row }) => <span>{row.original.businessUnit?.name || 'Global'}</span>
        },
        {
            accessorKey: "status",
            header: "Status",
            cell: ({ row }) => (
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${row.original.isActive !== false ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                    {row.original.isActive !== false ? "Active" : "Inactive"}
                </span>
            )
        }
    ];

    if (!hasPermission(PERMISSION_KEYS.STAFF.READ)) {
        return <div className="p-4 text-center text-muted-foreground">You do not have permission to view staff.</div>
    }

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle className="flex items-center gap-2">
                        <Users className="h-5 w-5" />
                        Staff Directory
                    </CardTitle>
                    <CardDescription>Manage employee information and records.</CardDescription>
                </div>
                {hasPermission(PERMISSION_KEYS.STAFF.CREATE) && (
                    <Button onClick={() => {
                        if (params["business-unit"]) {
                            router.push(`/${params["business-unit"]}/user-management/business-users/add`);
                        } else {
                            router.push('/platform/user-management/business-users/add');
                        }
                    }}>
                        <Plus className="mr-2 h-4 w-4" />
                        Add Staff
                    </Button>
                )}
            </CardHeader>
            <CardContent>
                <DataTable
                    columns={columns}
                    data={staffData}
                    isLoading={isLoading}
                    searchKey="name"
                />
            </CardContent>
        </Card>
    )
}
