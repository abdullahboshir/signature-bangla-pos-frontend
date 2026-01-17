"use client";
import { UserManagementTable } from "@/components/modules/user-management/UserManagementTable";

export default function AllUsersPage() {
    return <UserManagementTable viewScope="platform" />;
}
