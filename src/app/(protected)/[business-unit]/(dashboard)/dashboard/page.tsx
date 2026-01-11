"use client"

import { useState, useEffect } from "react"
import { useParams, useSearchParams, useRouter, usePathname } from "next/navigation"
import { useGetOutletsQuery } from "@/redux/api/organization/outletApi"
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
    const searchParams = useSearchParams()
    const router = useRouter()
    const pathname = usePathname()

    // Note: params key depends on folder structure [business-unit]
    const businessUnitId = params["business-unit"] as string

    const outletParam = searchParams.get("outlet");
    const [selectedOutletId, setSelectedOutletId] = useState<string>(outletParam || "all")

    // Sync state with URL if it changes
    useEffect(() => {
        if (outletParam) {
            setSelectedOutletId(outletParam);
        } else {
            setSelectedOutletId("all");
        }
    }, [outletParam]);

    const handleOutletChange = (value: string) => {
        setSelectedOutletId(value);

        // Update URL to persist selection
        const newParams = new URLSearchParams(searchParams.toString());
        if (value === "all") {
            newParams.delete("outlet");
        } else {
            newParams.set("outlet", value);
        }
        router.push(`${pathname}?${newParams.toString()}`);
    };

    const { data: outletData, isLoading } = useGetOutletsQuery({
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
                        onValueChange={handleOutletChange}
                        disabled={isLoading}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Filter by Outlet" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Outlets</SelectItem>
                            {outlets.map((outlet: any) => (
                                <SelectItem key={outlet._id?.toString() || outlet.id?.toString()} value={outlet._id?.toString() || outlet.id?.toString()}>
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
