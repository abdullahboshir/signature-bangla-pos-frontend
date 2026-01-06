"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Plug, Plus, Settings } from "lucide-react"
import { usePermissions } from "@/hooks/usePermissions"
import { DataTable } from "@/components/shared/DataTable"
import { useGetIntegrationsQuery, useDeleteIntegrationMutation, useUpdateIntegrationMutation } from "@/redux/api/platform/integrationApi"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { IntegrationDialog } from "./IntegrationDialog"
import { useState } from "react"
import { Switch } from "@/components/ui/switch"

export default function IntegrationList() {
    const { hasPermission } = usePermissions();
    const { data: rawData, isLoading } = useGetIntegrationsQuery({});
    const [deleteIntegration] = useDeleteIntegrationMutation();
    const [updateIntegration] = useUpdateIntegrationMutation();

    const [selectedIntegration, setSelectedIntegration] = useState<any>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    // Safe casting
    const tableData = Array.isArray((rawData as any)?.data) ? (rawData as any).data : (Array.isArray(rawData) ? rawData : []);

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure?")) return;
        try {
            await deleteIntegration(id).unwrap();
            toast.success("Integration removed successfully");
        } catch (err) {
            toast.error("Failed to remove integration");
        }
    }

    const handleToggle = async (id: string, currentStatus: boolean) => {
        try {
            await updateIntegration({ id, body: { isActive: !currentStatus } }).unwrap();
            toast.success(`Integration ${!currentStatus ? 'activated' : 'deactivated'}`);
        } catch (err) {
            toast.error("Failed to update status");
        }
    }

    const columns = [
        {
            accessorKey: "provider",
            header: "Provider",
            cell: ({ row }: any) => (
                <div className="flex items-center gap-2">
                    <div className="font-medium capitalize">{row.original.provider}</div>
                </div>
            )
        },
        {
            accessorKey: "type",
            header: "Type",
            cell: ({ row }: any) => (
                <Badge variant="outline" className="capitalize">{row.original.type}</Badge>
            )
        },
        {
            accessorKey: "isActive",
            header: "Status",
            cell: ({ row }: any) => (
                <Switch
                    checked={row.original.isActive}
                    onCheckedChange={() => handleToggle(row.original._id, row.original.isActive)}
                />
            )
        },
        {
            id: "actions",
            header: "Actions",
            cell: ({ row }: any) => (
                <div className="flex gap-2">
                    <Button variant="ghost" size="sm" onClick={() => {
                        setSelectedIntegration(row.original);
                        setIsDialogOpen(true);
                    }}>
                        <Settings className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" className="text-red-500" onClick={() => handleDelete(row.original._id)}>
                        Remove
                    </Button>
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
                            <Plug className="h-5 w-5" />
                            Integrations
                        </CardTitle>
                        <CardDescription>Manage third-party integrations (Payment, Shipping, SMS).</CardDescription>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <DataTable
                    columns={columns}
                    data={tableData}
                    isLoading={isLoading}
                    searchKey="provider"
                />
            </CardContent>

            <IntegrationDialog
                open={isDialogOpen}
                onOpenChange={setIsDialogOpen}
                integration={selectedIntegration}
            />
        </Card>
    )
}
