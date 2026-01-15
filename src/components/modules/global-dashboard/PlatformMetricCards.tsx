
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    DollarSign,
    Building2,
    Users,
    Store
} from "lucide-react";

export function PlatformMetricCards({ stats }: { stats: any }) {
    const metrics = [
        {
            title: "Total Revenue",
            value: stats?.revenue || "৳ 0.00",
            icon: DollarSign,
            color: "text-emerald-600"
        },
        {
            title: "Active Companies",
            value: stats?.activeCompanies || "0",
            icon: Building2,
            color: "text-blue-600"
        },
        {
            title: "Business Units",
            value: stats?.activeUnits || "0",
            icon: Store,
            color: "text-purple-600"
        },
        {
            title: "Total Users",
            value: stats?.totalUsers || "0",
            icon: Users,
            color: "text-indigo-600"
        }
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {metrics.map((metric, index) => (
                <Card key={index} className="shadow-sm border-l-4" style={{ borderLeftColor: metric.color ? undefined : 'transparent' }}>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                            {metric.title}
                        </CardTitle>
                        <metric.icon className={`h-4 w-4 ${metric.color || "text-muted-foreground"}`} />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{metric.value}</div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}
