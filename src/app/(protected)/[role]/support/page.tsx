"use client";
import { redirect } from "next/navigation";
import { ROUTE_PATHS } from "@/config/route-paths";

export default function SupportPage() {
    redirect(ROUTE_PATHS.SUPPORT.TICKETS);
}
