import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
    title: string;
    value: React.ReactNode;
    icon: LucideIcon;
    className?: string;
}

export function StatCard({ title, value, icon: Icon, className }: StatCardProps) {
    return (<Card className={`w-full h-fit py-0 ${className}`}>
        <CardContent className="p-3 flex items-center gap-4 whitespace-nowrap">
            <div className="p-2 bg-primary/10 rounded-full">
                <Icon className="h-4 w-4 text-primary" />
            </div>
            <div>
                <p className="text-sm font-medium text-muted-foreground">{title}</p>
                <div className="text-2xl font-bold">{value}</div>
            </div>
        </CardContent>
    </Card>
    );
}
