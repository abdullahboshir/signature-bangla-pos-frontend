
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

interface PageHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
    title: string;
    description?: string;
}

export function PageHeader({
    title,
    description,
    className,
    children,
    ...props
}: PageHeaderProps) {
    return (
        <div className={cn("space-y-4", className)} {...props}>
            <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                    <h2 className="text-2xl font-bold tracking-tight">{title}</h2>
                    {description && (
                        <p className="text-muted-foreground">
                            {description}
                        </p>
                    )}
                </div>
                {children && <div className="flex items-center space-x-2">{children}</div>}
            </div>
            <Separator />
        </div>
    );
}
