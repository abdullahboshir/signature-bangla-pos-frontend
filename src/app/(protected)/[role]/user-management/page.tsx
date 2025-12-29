"use client";
import { redirect } from "next/navigation";
import { ROUTE_PATHS } from "@/config/route-paths";

export default function UserManagementPage() {
    // Redirect to list view by default
    redirect(ROUTE_PATHS.USER_MANAGEMENT.ALL_USERS);
}
