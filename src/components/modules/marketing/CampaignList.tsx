"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DataTable } from "@/components/shared/DataTable"
import { Target, Plus } from "lucide-react"
import { usePermissions } from "@/hooks/usePermissions"
import { PERMISSION_KEYS } from "@/config/permission-keys"
import { ColumnDef } from "@tanstack/react-table"

export default function CampaignList() {
    const { hasPermission } = usePermissions();

    const data: any[] = [];
    const isLoading = false;

    const columns: ColumnDef<any>[] = [
        {
            accessorKey: "name",
            header: "Campaign Name",
        },
        {
            accessorKey: "platform",
            header: "Platform",
        },
        {
            accessorKey: "budget",
            header: "Budget",
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
                {/* Assuming there might be a CREATE permission, but specifically checking READ as primary */}
                <Button disabled={true}>
                    <Plus className="mr-2 h-4 w-4" />
                    New Campaign
                </Button>
            </CardHeader>
            <CardContent>
                <DataTable
                    columns={columns}
                    data={data}
                    isLoading={isLoading}
                />
            </CardContent>
        </Card>
    )
}
