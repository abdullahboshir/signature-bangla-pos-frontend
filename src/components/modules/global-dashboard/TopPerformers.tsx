
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export function TopPerformers({ title, data }: { title: string, data?: any[] }) {
    // Mock Data if not provided
    const items = data || [
        { name: "Dhaka Flagship Store", metric: "BDT 1.2M", status: "up", change: "12%" },
        { name: "Chittagong Hub", metric: "BDT 850k", status: "up", change: "5%" },
        { name: "Sylhet Outlet", metric: "BDT 420k", status: "down", change: "2%" },
        { name: "Online Store", metric: "BDT 2.1M", status: "up", change: "18%" },
        { name: "Rajshahi Branch", metric: "BDT 310k", status: "up", change: "8%" },
    ];

    return (
        <Card className="col-span-1 lg:col-span-3">
            <CardHeader>
                <CardTitle>{title}</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-6">
                    {items.map((item, index) => (
                        <div key={index} className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-muted">
                                    {index + 1}
                                </div>
                                <div className="space-y-1">
                                    <p className="text-sm font-medium leading-none">{item.name}</p>
                                    <p className="text-xs text-muted-foreground">Revenue</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <div className="font-bold text-sm">{item.metric}</div>
                                <Badge variant={item.status === 'up' ? "default" : "destructive"} className="mt-1 h-5 text-[10px] px-1.5 py-0">
                                    {item.status === 'up' ? '+' : '-'}{item.change}
                                </Badge>
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}
