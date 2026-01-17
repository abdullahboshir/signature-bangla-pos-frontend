"use client";
import { redirect } from "next/navigation";
import { ROUTE_PATHS } from "@/config/route-paths";

export default function SystemPage() {
    redirect(ROUTE_PATHS.SYSTEM.AUDIT_LOGS);
}
