"use client";
import { redirect } from "next/navigation";
import { ROUTE_PATHS } from "@/config/route-paths";

export default function UserManagementPage() {
    // Redirect to Platform Users
    redirect(ROUTE_PATHS.USER_MANAGEMENT.PLATFORM_USERS);
}
