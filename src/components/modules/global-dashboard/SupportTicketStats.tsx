
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export function SupportTicketStats() {
    return (
        <Card className="col-span-1 lg:col-span-3">
            <CardHeader>
                <CardTitle>Support Overview</CardTitle>
                <CardDescription>Support ticket status stats</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="space-y-1">
                            <p className="text-sm font-medium leading-none">Open Tickets</p>
                            <p className="text-xs text-muted-foreground">Requires attention</p>
                        </div>
                        <div className="font-bold text-red-600">12</div>
                    </div>
                    <div className="flex items-center justify-between">
                        <div className="space-y-1">
                            <p className="text-sm font-medium leading-none">Pending Reply</p>
                            <p className="text-xs text-muted-foreground">Waiting on user</p>
                        </div>
                        <div className="font-bold text-yellow-600">5</div>
                    </div>
                    <div className="flex items-center justify-between">
                        <div className="space-y-1">
                            <p className="text-sm font-medium leading-none">Resolved (Today)</p>
                            <p className="text-xs text-muted-foreground">Closed tickets</p>
                        </div>
                        <div className="font-bold text-green-600">28</div>
                    </div>
                    <div className="pt-2">
                        <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                            <div className="h-full bg-green-500 w-[70%]" />
                        </div>
                        <p className="text-xs text-muted-foreground mt-2 text-center">70% Satisfaction Rate</p>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
