"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DataTable } from "@/components/shared/DataTable"
import { Ban, Plus, Trash2 } from "lucide-react"
import { usePermissions } from "@/hooks/usePermissions"
import { PERMISSION_KEYS } from "@/config/permission-keys"
import { ColumnDef } from "@tanstack/react-table"
import { toast } from "sonner"
import { useGetAllBlacklistEntriesQuery, useDeleteBlacklistEntryMutation } from "@/redux/api/risk/riskApi"
import { format } from "date-fns"

export default function BlacklistList() {
    const { hasPermission } = usePermissions();
    // const { toast } = useToast(); // Removed
    const { data: blacklistData, isLoading } = useGetAllBlacklistEntriesQuery({});
    const [deleteEntry] = useDeleteBlacklistEntryMutation();

    const handleDelete = async (id: string) => {
        try {
            await deleteEntry(id).unwrap();
            toast.success("Entry removed from blacklist");
        } catch (error) {
            toast.error("Failed to remove entry");
        }
    };

    const columns: ColumnDef<any>[] = [
        {
            accessorKey: "identifier",
            header: "Entity (IP/Email/Phone)",
            cell: ({ row }) => (
                <div className="flex flex-col">
                    <span className="font-medium">{row.original.identifier}</span>
                    <span className="text-xs text-muted-foreground uppercase">{row.original.type}</span>
                </div>
            )
        },
        {
            accessorKey: "reason",
            header: "Reason",
        },
        {
            accessorKey: "riskScore",
            header: "Risk Score",
            cell: ({ row }) => (
                <span className={`badge ${row.original.riskScore >= 80 ? 'text-red-600' : 'text-yellow-600'}`}>
                    {row.original.riskScore}
                </span>
            )
        },
        {
            accessorKey: "createdAt",
            header: "Date Added",
            cell: ({ row }) => format(new Date(row.original.createdAt), "dd MMM yyyy"),
        },
        {
            id: "actions",
            cell: ({ row }) => hasPermission(PERMISSION_KEYS.BLACKLIST.DELETE) && (
                <Button variant="ghost" size="icon" onClick={() => handleDelete(row.original._id)}>
                    <Trash2 className="h-4 w-4 text-red-500" />
                </Button>
            )
        }
    ];

    if (!hasPermission(PERMISSION_KEYS.BLACKLIST.READ)) {
        return <div className="p-4 text-center text-muted-foreground">You do not have permission to view the blacklist.</div>
    }

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle className="flex items-center gap-2">
                        <Ban className="h-5 w-5" />
                        Blacklist Management
                    </CardTitle>
                    <CardDescription>Manage blocked entities and restrictions.</CardDescription>
                </div>
                {hasPermission(PERMISSION_KEYS.BLACKLIST.CREATE) && (
                    <Button variant="destructive">
                        <Plus className="mr-2 h-4 w-4" />
                        Add Block
                    </Button>
                )}
            </CardHeader>
            <CardContent>
                <DataTable
                    columns={columns}
                    data={blacklistData?.result || []}
                    isLoading={isLoading}
                />
            </CardContent>
        </Card>
    )
}

