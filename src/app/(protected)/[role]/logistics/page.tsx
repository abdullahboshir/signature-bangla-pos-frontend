"use client";
import { redirect } from "next/navigation";
import { ROUTE_PATHS } from "@/config/route-paths";

export default function LogisticsPage() {
    redirect(ROUTE_PATHS.LOGISTICS.COURIER);
}
