"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Key, Plus } from "lucide-react"
import { usePermissions } from "@/hooks/usePermissions"
import { DataTable } from "@/components/shared/DataTable"
import { useGetLicensesQuery, useDeleteLicenseMutation } from "@/redux/api/platform/licenseApi"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { LICENSE_STATUS } from "@/constant/license.constant"
import { format } from "date-fns"

export default function LicenseList() {
    const { hasPermission } = usePermissions();
    const { data: licenseData, isLoading } = useGetLicensesQuery({});
    const [deleteLicense] = useDeleteLicenseMutation();
    const router = useRouter();

    // Safe casting
    const tableData = Array.isArray((licenseData as any)?.data) ? (licenseData as any).data : (Array.isArray(licenseData) ? licenseData : []);

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure?")) return;
        try {
            await deleteLicense(id).unwrap();
            toast.success("License deleted successfully");
        } catch (err) {
            toast.error("Failed to delete license");
        }
    }

    const columns = [
        {
            accessorKey: "key",
            header: "License Key",
            cell: ({ row }: any) => <code className="bg-muted px-2 py-1 rounded text-xs">{row.original.key}</code>
        },
        {
            accessorKey: "clientName",
            header: "Client / Tenant",
            cell: ({ row }: any) => (
                <div className="flex flex-col">
                    <span className="font-medium">{row.original.clientName || 'Unknown'}</span>
                    <span className="text-xs text-muted-foreground">{row.original.clientId}</span>
                </div>
            )
        },
        {
            header: "Package",
            cell: ({ row }: any) => (
                <span className="font-medium">{row.original.packageId?.name || row.original.packageId}</span>
            )
        },
        {
            header: "Expiry",
            cell: ({ row }: any) => (
                <span className="text-xs">
                    {row.original.expiresAt ? format(new Date(row.original.expiresAt), "dd MMM yyyy") : "Lifetime"}
                </span>
            )
        },
        {
            accessorKey: "status",
            header: "Status",
            cell: ({ row }: any) => {
                let variant = "default";
                if (row.original.status === LICENSE_STATUS.EXPIRED) variant = "destructive";
                if (row.original.status === LICENSE_STATUS.REVOKED) variant = "secondary";

                return (
                    <Badge variant={variant as any} className="uppercase">
                        {row.original.status}
                    </Badge>
                )
            }
        },
        {
            id: "actions",
            header: "Actions",
            cell: ({ row }: any) => (
                <div className="flex gap-2">
                    <Button variant="ghost" size="sm" onClick={() => router.push(`/platform/licenses/${row.original.id}/edit`)}>Edit</Button>
                    <Button variant="ghost" size="sm" className="text-red-500" onClick={() => handleDelete(row.original.id)}>Revoke</Button>
                </div>
            )
        }
    ];

    return (
        <Card>
            <CardHeader>
                <div className="flex justify-between items-center">
                    <div>
                        <CardTitle className="flex items-center gap-2">
                            <Key className="h-5 w-5" />
                            License Keys
                        </CardTitle>
                        <CardDescription>Manage software licenses and keys.</CardDescription>
                    </div>
                    <Button size="sm" onClick={() => router.push('/platform/licenses/new')}>
                        <Plus className="h-4 w-4 mr-2" /> Issue License
                    </Button>
                </div>
            </CardHeader>
            <CardContent>
                <DataTable
                    columns={columns}
                    data={tableData}
                    isLoading={isLoading}
                    searchKey="key"
                />
            </CardContent>
        </Card>
    )
}
