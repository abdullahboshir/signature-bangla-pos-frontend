"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart3 } from "lucide-react"

export default function RiskAnalyticsPage() {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Risk Analytics
                </CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-muted-foreground">Risk analytics dashboard coming soon.</p>
            </CardContent>
        </Card>
    )
}
