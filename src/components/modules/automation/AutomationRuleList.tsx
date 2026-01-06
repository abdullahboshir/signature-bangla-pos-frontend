"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DataTable } from "@/components/shared/DataTable"
import { Bot, Plus, Trash2 } from "lucide-react"
import { usePermissions } from "@/hooks/usePermissions"
import { PERMISSION_KEYS } from "@/config/permission-keys"
import { ColumnDef } from "@tanstack/react-table"
import { useGetAutomationRulesQuery, useDeleteAutomationRuleMutation } from "@/redux/api/platform/automationApi"
import { toast } from "sonner"
import { Badge } from "@/components/ui/badge"

export default function AutomationRuleList() {
    const { hasPermission } = usePermissions();
    const { data: rawData, isLoading } = useGetAutomationRulesQuery({});
    const [deleteRule] = useDeleteAutomationRuleMutation();

    // Safe casting
    const tableData = Array.isArray((rawData as any)?.data) ? (rawData as any).data : (Array.isArray(rawData) ? rawData : []);

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure?")) return;
        try {
            await deleteRule(id).unwrap();
            toast.success("Rule deleted");
        } catch (err) {
            toast.error("Failed to delete rule");
        }
    }

    const columns: ColumnDef<any>[] = [
        {
            accessorKey: "name",
            header: "Rule Name",
        },
        {
            accessorKey: "trigger",
            header: "Trigger",
            cell: ({ row }) => <Badge variant="outline">{row.original.trigger}</Badge>
        },
        {
            accessorKey: "isActive",
            header: "Status",
            cell: ({ row }) => (
                <Badge variant={row.original.isActive ? "default" : "destructive"}>
                    {row.original.isActive ? "Active" : "Inactive"}
                </Badge>
            )
        },
        {
            id: "actions",
            header: "Actions",
            cell: ({ row }) => (
                <Button variant="ghost" size="sm" className="text-destructive h-8 w-8 p-0" onClick={() => handleDelete(row.original._id)}>
                    <Trash2 className="h-4 w-4" />
                </Button>
            )
        }
    ];

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle className="flex items-center gap-2">
                        <Bot className="h-5 w-5" />
                        Automation Rules
                    </CardTitle>
                    <CardDescription>Manage event-based triggers and actions.</CardDescription>
                </div>
                <Button onClick={() => toast.info("Rule Builder Coming Soon")}>
                    <Plus className="mr-2 h-4 w-4" />
                    Create Rule
                </Button>
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
