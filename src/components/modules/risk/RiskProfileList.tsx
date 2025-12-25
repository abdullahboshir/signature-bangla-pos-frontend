"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DataTable } from "@/components/shared/DataTable"
import { Shield } from "lucide-react"
import { usePermissions } from "@/hooks/usePermissions"
import { PERMISSION_KEYS } from "@/config/permission-keys"
import { ColumnDef } from "@tanstack/react-table"

export default function RiskProfileList() {
    const { hasPermission } = usePermissions();

    const data: any[] = [];
    const isLoading = false;

    const columns: ColumnDef<any>[] = [
        {
            accessorKey: "entity",
            header: "Entity ID",
        },
        {
            accessorKey: "riskScore",
            header: "Risk Score",
        },
        {
            accessorKey: "level",
            header: "Risk Level",
        }
    ];

    if (!hasPermission(PERMISSION_KEYS.RISK_PROFILE.READ)) {
        return <div className="p-4 text-center text-muted-foreground">You do not have permission to view risk profiles.</div>
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    Risk Profiles
                </CardTitle>
                <CardDescription>View risk assessment profiles.</CardDescription>
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
