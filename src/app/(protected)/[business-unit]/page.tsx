"use client"

import { useParams } from "next/navigation"
import BusinessUnitDashboard from "@/components/modules/business-units/BusinessUnitDashboard"

export default function BusinessUnitDashboardPage() {
    const params = useParams()
    const businessUnitParam = params["business-unit"] as string

    return <BusinessUnitDashboard slug={businessUnitParam} />
}
