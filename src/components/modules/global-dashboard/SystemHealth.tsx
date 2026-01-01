
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, AlertCircle, XCircle } from "lucide-react";

export function SystemHealth() {
    const services = [
        { name: "API Gateway", status: "operational", latency: "45ms" },
        { name: "Database Primary", status: "operational", latency: "12ms" },
        { name: "Search Engine", status: "degraded", latency: "350ms" },
        { name: "Redis Cache", status: "operational", latency: "2ms" },
    ];

    return (
        <Card className="col-span-3 lg:col-span-1">
            <CardHeader>
                <CardTitle>System Health</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {services.map((service, index) => (
                        <div key={index} className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                                {service.status === 'operational' ? (
                                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                                ) : service.status === 'degraded' ? (
                                    <AlertCircle className="h-4 w-4 text-yellow-500" />
                                ) : (
                                    <XCircle className="h-4 w-4 text-red-500" />
                                )}
                                <span className="text-sm font-medium">{service.name}</span>
                            </div>
                            <span className={`text-xs ${service.status === 'degraded' ? 'text-yellow-600' : 'text-muted-foreground'}`}>
                                {service.latency}
                            </span>
                        </div>
                    ))}
                </div>
                <div className="mt-6 pt-4 border-t">
                    <div className="flex justify-between items-center text-sm">
                        <span className="text-muted-foreground">Last checked:</span>
                        <span className="font-medium">Just now</span>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
