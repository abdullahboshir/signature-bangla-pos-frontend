"use client"

import { RolePermissionManagement } from "@/components/modules/user-management/RolePermissionManagement"


export default function BusinessRolesPage() {
    return (
        <div className="container mx-auto p-4 max-w-[1600px]">
            <RolePermissionManagement viewScope="business" />
        </div>
    )
}
