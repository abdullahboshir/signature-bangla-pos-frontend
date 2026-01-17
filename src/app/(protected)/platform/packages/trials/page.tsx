
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Timer } from "lucide-react";

export const metadata = {
    title: "Trial Management | Platform Admin",
    description: "Monitor active trial subscriptions.",
};

export default function TrialsPage() {
    return (
        <div className="space-y-6">
            <div className="flex items-center gap-2">
                <Timer className="h-6 w-6 text-muted-foreground" />
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Active Trials</h1>
                    <p className="text-muted-foreground">Monitor and manage trial subscriptions.</p>
                </div>
            </div>

            <Card className="flex flex-col items-center justify-center p-12 text-center text-muted-foreground border-dashed">
                <Timer className="h-12 w-12 mb-4 opacity-50" />
                <CardTitle className="text-lg">No Active Trials</CardTitle>
                <CardDescription>
                    Trial monitoring system is currently being set up.
                </CardDescription>
            </Card>
        </div>
    );
}
