"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Package, Plus, MoreHorizontal, Edit, Trash2 } from "lucide-react"
import { usePermissions } from "@/hooks/usePermissions"
import { PERMISSION_KEYS } from "@/config/permission-keys"
import { DataTable } from "@/components/shared/DataTable"
import { useGetPackagesQuery, useDeletePackageMutation } from "@/redux/api/platform/packageApi"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { PACKAGE_STATUS } from "@/constant/package.constant"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

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
                <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                        <span className="font-bold">{row.original.name}</span>
                        {row.original.isRecommended && <Badge className="bg-amber-500 text-[8px] h-3 px-1">Best Value</Badge>}
                        {row.original.isFeatured && <Badge className="bg-purple-500 text-[8px] h-3 px-1">Featured</Badge>}
                    </div>
                    <span className="text-[10px] text-muted-foreground font-mono">{row.original.slug}</span>
                    <div className="flex gap-1">
                        {!row.original.isPublic && <Badge variant="outline" className="text-[8px] h-3 px-1 text-red-500 border-red-200">Private</Badge>}
                        {row.original.isDefaultPlan && <Badge variant="outline" className="text-[8px] h-3 px-1 text-blue-500 border-blue-200">Default</Badge>}
                    </div>
                </div>
            )
        },
        {
            header: "Commercials",
            cell: ({ row }: any) => (
                <div className="flex flex-col">
                    <span className="font-bold text-primary">{row.original.price} {row.original.currency}</span>
                    <span className="text-[10px] uppercase text-muted-foreground font-semibold italic">{row.original.billingCycle}</span>
                </div>
            )
        },
        {
            header: "Limits",
            cell: ({ row }: any) => (
                <div className="grid grid-cols-2 gap-x-3 gap-y-0.5 text-[10px]">
                    <span className="text-muted-foreground">Users:</span>
                    <span className="font-medium">{row.original.limits?.maxUsers === -1 ? '∞' : (row.original.limits?.maxUsers ?? 0)}</span>
                    <span className="text-muted-foreground">Outlets:</span>
                    <span className="font-medium">{row.original.limits?.maxOutlets === -1 ? '∞' : (row.original.limits?.maxOutlets ?? 0)}</span>
                    <span className="text-muted-foreground">Products:</span>
                    <span className="font-medium">{row.original.limits?.maxProducts === -1 ? '∞' : (row.original.limits?.maxProducts ?? 0)}</span>
                </div>
            )
        },
        {
            header: "Modules",
            cell: ({ row }: any) => (
                <div className="flex flex-wrap gap-1 max-w-[200px]">
                    {Object.entries(row.original.moduleAccess || {})
                        .filter(([_, config]: any) => config?.enabled)
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
            header: "Support & SLA",
            cell: ({ row }: any) => (
                <div className="flex flex-col gap-1">
                    <Badge variant="outline" className="text-[9px] uppercase border-primary/20 text-primary w-fit">
                        {row.original.supportType}
                    </Badge>
                    <span className="text-[10px] text-muted-foreground">
                        {row.original.supportChannels?.length || 0} Channels
                    </span>
                </div>
            )
        },
        {
            accessorKey: "isActive",
            header: "Status",
            cell: ({ row }: any) => (
                <Badge variant={row.original.isActive ? "default" : "secondary"} className={row.original.isActive ? "bg-green-500 hover:bg-green-600" : ""}>
                    {row.original.isActive ? "Active" : "Paused"}
                </Badge>
            )
        },
        {
            id: "actions",
            header: "Actions",
            cell: ({ row }: any) => (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            < MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-[160px]">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => router.push(`/platform/packages/${row.original.id}/edit`)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit Plan
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                            onClick={() => handleDelete(row.original.id)}
                            className="text-red-600 focus:text-red-600 focus:bg-red-50"
                        >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete Plan
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
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
                    <Button size="sm" onClick={() => router.push('/platform/packages/new')}>
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
