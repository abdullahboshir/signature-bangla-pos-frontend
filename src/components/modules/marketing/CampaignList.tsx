"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DataTable } from "@/components/shared/DataTable"
import { Target, Plus, Trash2 } from "lucide-react"
import { usePermissions } from "@/hooks/usePermissions"
import { PERMISSION_KEYS } from "@/config/permission-keys"
import { ColumnDef } from "@tanstack/react-table"
import { useGetCampaignsQuery, useDeleteCampaignMutation } from "@/redux/api/platform/marketingApi"
import { toast } from "sonner"
import { Badge } from "@/components/ui/badge"
import { MARKETING_STATUS } from "@/constant/marketing.constant"

export default function CampaignList() {
    const { hasPermission } = usePermissions();
    const { data: rawData, isLoading } = useGetCampaignsQuery({});
    const [deleteCampaign] = useDeleteCampaignMutation();

    // Safe casting
    const tableData = Array.isArray((rawData as any)?.data) ? (rawData as any).data : (Array.isArray(rawData) ? rawData : []);

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure?")) return;
        try {
            await deleteCampaign(id).unwrap();
            toast.success("Campaign deleted successfully");
        } catch (err) {
            toast.error("Failed to delete campaign");
        }
    }

    const columns: ColumnDef<any>[] = [
        {
            accessorKey: "name",
            header: "Campaign Name",
        },
        {
            accessorKey: "platform",
            header: "Platform",
            cell: ({ row }) => <Badge variant="outline">{row.original.platform}</Badge>
        },
        {
            accessorKey: "budget",
            header: "Budget",
            cell: ({ row }) => <span>{row.original.budget}</span>
        },
        {
            accessorKey: "status",
            header: "Status",
            cell: ({ row }) => {
                const status = row.original.status || MARKETING_STATUS.INACTIVE;
                return (
                    <Badge variant={status === MARKETING_STATUS.ACTIVE ? "default" : "secondary"}>
                        {status}
                    </Badge>
                )
            }
        },
        {
            id: "actions",
            header: "Actions",
            cell: ({ row }) => (
                hasPermission(PERMISSION_KEYS.AD_CAMPAIGN.DELETE) && (
                    <Button variant="ghost" size="sm" className="text-destructive h-8 w-8 p-0" onClick={() => handleDelete(row.original._id)}>
                        <Trash2 className="h-4 w-4" />
                    </Button>
                )
            )
        }
    ];

    if (!hasPermission(PERMISSION_KEYS.AD_CAMPAIGN.READ)) {
        return <div className="p-4 text-center text-muted-foreground">You do not have permission to view ad campaigns.</div>
    }

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle className="flex items-center gap-2">
                        <Target className="h-5 w-5" />
                        Ad Campaigns
                    </CardTitle>
                    <CardDescription>Track advertising campaigns and performance.</CardDescription>
                </div>
                {hasPermission(PERMISSION_KEYS.AD_CAMPAIGN.CREATE) && (
                    <Button onClick={() => toast.info("New Campaign Form (Mock)")}>
                        <Plus className="mr-2 h-4 w-4" />
                        New Campaign
                    </Button>
                )}
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
