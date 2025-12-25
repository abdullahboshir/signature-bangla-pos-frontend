"use client"

import AttributeGroupList from "@/components/modules/catalog/attribute/AttributeGroupList"

export default function AttributeGroupsPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Attribute Groups</h1>
                <p className="text-muted-foreground">
                    Manage attribute groups for product specifications.
                </p>
            </div>

            <AttributeGroupList />
        </div>
    )
}
