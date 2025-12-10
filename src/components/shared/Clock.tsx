"use client";

import { useState, useEffect } from "react";
import { Clock as ClockIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface ClockProps {
    className?: string;
    showIcon?: boolean;
}

export function Clock({ className, showIcon = true }: ClockProps) {
    const [time, setTime] = useState<Date | null>(null);

    useEffect(() => {
        setTime(new Date());
        const interval = setInterval(() => {
            setTime(new Date());
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    if (!time) return null;

    return (
        <div className={cn("flex items-center gap-2 text-sm font-medium", className)}>
            {showIcon && <ClockIcon className="h-4 w-4 text-muted-foreground" />}
            <div className="flex flex-col leading-none">
                <span className="tabular-nums">
                    {time.toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit',
                        hour12: true
                    })}
                </span>
                <span className="text-[10px] text-muted-foreground font-normal">
                    {time.toLocaleDateString([], {
                        weekday: 'short',
                        month: 'short',
                        day: 'numeric'
                    })}
                </span>
            </div>
        </div>
    );
}
