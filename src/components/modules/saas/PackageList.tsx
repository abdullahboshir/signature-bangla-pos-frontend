"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Package, Plus } from "lucide-react"
import { usePermissions } from "@/hooks/usePermissions"
import { PERMISSION_KEYS } from "@/config/permission-keys"
import { DataTable } from "@/components/shared/DataTable"
import { useGetPackagesQuery, useDeletePackageMutation } from "@/redux/api/platform/packageApi"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { PACKAGE_STATUS } from "@/constant/package.constant"

export default function PackageList() {
    const { hasPermission } = usePermissions();
    const { data: packagesData, isLoading } = useGetPackagesQuery({});
    const [deletePackage] = useDeletePackageMutation();
    const router = useRouter();

    // Safe casting
    const tableData = Array.isArray((packagesData as any)?.data) ? (packagesData as any).data : (Array.isArray(packagesData) ? packagesData : []);

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure?")) return;
        try {
            await deletePackage(id).unwrap();
            toast.success("Package deleted successfully");
        } catch (err) {
            toast.error("Failed to delete package");
        }
    }

    const columns = [
        {
            accessorKey: "name",
            header: "Plan Name",
            cell: ({ row }: any) => (
                <div className="flex flex-col">
                    <span className="font-medium">{row.original.name}</span>
                    <span className="text-xs text-muted-foreground">{row.original.slug}</span>
                </div>
            )
        },
        {
            accessorKey: "price",
            header: "Price",
            cell: ({ row }: any) => <span className="font-bold">{row.original.price} {row.original.currency}</span>
        },
        {
            header: "Limits",
            cell: ({ row }: any) => (
                <div className="flex flex-col text-xs text-muted-foreground">
                    <span>Users: {row.original.limits?.maxUsers || 'Unltd'}</span>
                    <span>Outlets: {row.original.limits?.maxOutlets || 'Unltd'}</span>
                </div>
            )
        },
        {
            header: "Modules",
            cell: ({ row }: any) => (
                <div className="flex flex-wrap gap-1 max-w-[200px]">
                    {Object.entries(row.original.moduleAccess || {})
                        .filter(([_, allowed]) => allowed)
                        .map(([mod]) => (
                            <Badge key={mod} variant="secondary" className="text-[10px] px-1 py-0 uppercase">
                                {mod}
                            </Badge>
                        ))
                    }
                </div>
            )
        },
        {
            accessorKey: "isActive",
            header: "Status",
            cell: ({ row }: any) => (
                <Badge variant={row.original.isActive === PACKAGE_STATUS.ACTIVE ? "default" : "outline"}>
                    {row.original.isActive === PACKAGE_STATUS.ACTIVE ? "Active" : "Inactive"}
                </Badge>
            )
        },
        {
            id: "actions",
            header: "Actions",
            cell: ({ row }: any) => (
                <div className="flex gap-2">
                    <Button variant="ghost" size="sm" onClick={() => router.push(`/packages/${row.original.id}/edit`)}>Edit</Button>
                    <Button variant="ghost" size="sm" className="text-red-500" onClick={() => handleDelete(row.original.id)}>Delete</Button>
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
                            <Package className="h-5 w-5" />
                            SaaS Packages
                        </CardTitle>
                        <CardDescription>Manage subscription plans and licensing.</CardDescription>
                    </div>
                    <Button size="sm" onClick={() => router.push('/packages/new')}>
                        <Plus className="h-4 w-4 mr-2" /> New Package
                    </Button>
                </div>
            </CardHeader>
            <CardContent>
                <DataTable
                    columns={columns}
                    data={tableData}
                    isLoading={isLoading}
                    searchKey="name"
                />
            </CardContent>
        </Card>
    )
}
