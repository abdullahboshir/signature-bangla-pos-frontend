"use client";
import { redirect } from "next/navigation";
import { ROUTE_PATHS } from "@/config/route-paths";

export default function RiskPage() {
    redirect(ROUTE_PATHS.RISK.FRAUD);
}
