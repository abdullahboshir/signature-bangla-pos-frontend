"use client"

import { UserManagementTable } from "@/components/modules/user-management/UserManagementTable"
import { useParams } from "next/navigation"

export default function BusinessUsersPage() {
    // The table component handles scoped fetching automatically if we might want to enforce "business" scope
    // But mainly the UserManagementTable is designed to be smart.
    // Let's reuse it directly. It reads params internally or checks context.

    return (
        <div className="container mx-auto p-4 max-w-[1600px]">
            <UserManagementTable viewScope="business" />
        </div>
    )
}
