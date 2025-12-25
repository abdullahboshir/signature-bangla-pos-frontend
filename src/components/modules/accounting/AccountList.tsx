"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DataTable } from "@/components/shared/DataTable"
import { Calculator, Plus } from "lucide-react"
import { usePermissions } from "@/hooks/usePermissions"
import { PERMISSION_KEYS } from "@/config/permission-keys"
import { ColumnDef } from "@tanstack/react-table"

export default function AccountList() {
    const { hasPermission } = usePermissions();

    const data: any[] = [];
    const isLoading = false;

    const columns: ColumnDef<any>[] = [
        {
            accessorKey: "name",
            header: "Account Name",
        },
        {
            accessorKey: "type",
            header: "Type",
        },
        {
            accessorKey: "balance",
            header: "Balance",
        }
    ];

    if (!hasPermission(PERMISSION_KEYS.ACCOUNT.READ)) {
        return <div className="p-4 text-center text-muted-foreground">You do not have permission to view accounts.</div>
    }

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle className="flex items-center gap-2">
                        <Calculator className="h-5 w-5" />
                        Chart of Accounts
                    </CardTitle>
                    <CardDescription>Manage financial accounts and ledgers.</CardDescription>
                </div>
                {/* Assuming MANAGE or CREATE permissions, falling back to READ gating at top level if not explicit create key */}
                <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    New Account
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
