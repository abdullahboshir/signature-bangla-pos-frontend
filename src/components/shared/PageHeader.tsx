
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

import { LucideIcon } from "lucide-react";

interface PageHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
    title: string;
    description?: string;
    icon?: LucideIcon;
}

export function PageHeader({
    title,
    description,
    className,
    children,
    icon: Icon,
    ...props
}: PageHeaderProps) {
    return (
        <div className={cn("space-y-4", className)} {...props}>
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    {Icon && (
                        <div className="p-2 bg-muted rounded-md border">
                            <Icon className="h-6 w-6 text-foreground" />
                        </div>
                    )}
                    <div className="space-y-0.5">
                        <h2 className="text-2xl font-bold tracking-tight">{title}</h2>
                        {description && (
                            <p className="text-muted-foreground">
                                {description}
                            </p>
                        )}
                    </div>
                </div>
                {children && <div className="flex items-center space-x-2">{children}</div>}
            </div>
            <Separator />
        </div>
    );
}
