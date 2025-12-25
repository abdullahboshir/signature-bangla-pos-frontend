"use client"

import { DataTable } from "@/components/shared/DataTable"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

import { PERMISSION_KEYS, RESOURCE_KEYS } from "@/config/permission-keys"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { usePermissions } from "@/hooks/usePermissions"

export default function AttributeGroupList() {
    const { hasPermission } = usePermissions()

    // Placeholder data
    const data = [
        { id: "1", name: "General Specs", description: "Standard specifications" },
        { id: "2", name: "Technical Specs", description: "For electronics" },
    ]

    const columns = [
        { accessorKey: "name", header: "Group Name" },
        { accessorKey: "description", header: "Description" },
    ]

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Attribute Groups</CardTitle>
                {hasPermission(PERMISSION_KEYS.ATTRIBUTE_GROUP.CREATE) && (
                    <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        Add Group
                    </Button>
                )}
            </CardHeader>
            <CardContent>
                <DataTable
                    columns={columns}
                    data={data}
                    searchKey="name"
                />
            </CardContent>
        </Card>
    )
}
