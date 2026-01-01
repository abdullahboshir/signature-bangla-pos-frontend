"use client"

import { useState } from "react"
import { useParams } from "next/navigation"
import { useGetOutletQuery } from "@/redux/api/organization/outletApi"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { DashboardGrid } from "@/components/dashboard/DashboardGrid"

export default function DashboardPage() {
    const params = useParams()
    // Note: params key depends on folder structure [business-unit]
    const businessUnitId = params["business-unit"] as string
    const [selectedOutletId, setSelectedOutletId] = useState<string>("all")

    const { data: outletData, isLoading } = useGetOutletQuery({
        businessUnit: businessUnitId,
        limit: 100,
    })

    // Assuming response structure after transformResponse is { result: [], meta: {} }
    const outlets = outletData?.result || []

    return (
        <div className="container mx-auto py-6 space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1">
                    <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
                    <p className="text-muted-foreground">
                        Overview of your business performance
                    </p>
                </div>

                <div className="w-[200px]">
                    <Select
                        value={selectedOutletId}
                        onValueChange={setSelectedOutletId}
                        disabled={isLoading}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Filter by Outlet" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Outlets</SelectItem>
                            {outlets.map((outlet: any) => (
                                <SelectItem key={outlet._id} value={outlet._id}>
                                    {outlet.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <DashboardGrid outletId={selectedOutletId === "all" ? undefined : selectedOutletId} />
        </div>
    )
}
