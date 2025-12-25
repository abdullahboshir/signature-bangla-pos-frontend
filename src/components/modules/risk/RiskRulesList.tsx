"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DataTable } from "@/components/shared/DataTable"
import { Gavel, Plus } from "lucide-react"
import { usePermissions } from "@/hooks/usePermissions"
import { PERMISSION_KEYS } from "@/config/permission-keys"
import { ColumnDef } from "@tanstack/react-table"

export default function RiskRulesList() {
    const { hasPermission } = usePermissions();

    const data: any[] = [];
    const isLoading = false;

    const columns: ColumnDef<any>[] = [
        {
            accessorKey: "name",
            header: "Rule Name",
        },
        {
            accessorKey: "severity",
            header: "Severity",
        },
        {
            accessorKey: "action",
            header: "Action",
        }
    ];

    if (!hasPermission(PERMISSION_KEYS.RISK_RULE.READ)) {
        return <div className="p-4 text-center text-muted-foreground">You do not have permission to view risk rules.</div>
    }

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle className="flex items-center gap-2">
                        <Gavel className="h-5 w-5" />
                        Risk Rules
                    </CardTitle>
                    <CardDescription>Configure automated risk assessment rules.</CardDescription>
                </div>
                {hasPermission(PERMISSION_KEYS.RISK_RULE.CREATE) && (
                    <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        New Rule
                    </Button>
                )}
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
