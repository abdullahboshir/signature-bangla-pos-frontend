import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function RecentActivity() {
    const activities = [
        {
            user: "Alice Smith",
            action: "Created a new Business Unit",
            target: "Dhaka Retail Store",
            time: "2 mins ago",
            avatar: "AS"
        },
        {
            user: "System",
            action: "Automated Backup Completed",
            target: "Database",
            time: "1 hour ago",
            avatar: "SYS"
        },
        {
            user: "John Doe",
            action: "Upgraded Subscription",
            target: "Standard Plan",
            time: "3 hours ago",
            avatar: "JD"
        },
        {
            user: "Support Bot",
            action: "Flagged High Risk Login",
            target: "IP: 192.168.1.1",
            time: "5 hours ago",
            avatar: "BOT"
        }
    ];

    return (
        <Card className="col-span-3">
            <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>
                    Latest actions across the platform.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-8">
                    {activities.map((item, index) => (
                        <div key={index} className="flex items-center">
                            <Avatar className="h-9 w-9">
                                <AvatarImage src="/avatars/01.png" alt="Avatar" />
                                <AvatarFallback>{item.avatar}</AvatarFallback>
                            </Avatar>
                            <div className="ml-4 space-y-1">
                                <p className="text-sm font-medium leading-none">{item.action}</p>
                                <p className="text-sm text-muted-foreground">
                                    by {item.user} • {item.target}
                                </p>
                            </div>
                            <div className="ml-auto font-medium text-xs text-muted-foreground">
                                {item.time}
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}
