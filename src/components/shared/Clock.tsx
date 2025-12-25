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

    const formatTime = (date: Date) => {
        let hours = date.getHours();
        const minutes = date.getMinutes();
        const seconds = date.getSeconds();
        const ampm = hours >= 12 ? 'pm' : 'am';
        hours = hours % 12;
        hours = hours ? hours : 12; // the hour '0' should be '12'

        const strHours = hours < 10 ? '0' + hours : hours;
        const strMinutes = minutes < 10 ? '0' + minutes : minutes;
        const strSeconds = seconds < 10 ? '0' + seconds : seconds;

        return `${strHours}:${strMinutes}:${strSeconds} ${ampm}`;
    };

    const formatDate = (date: Date) => {
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

        const dayName = days[date.getDay()];
        const dayNum = date.getDate();
        const monthName = months[date.getMonth()];

        // Format: Wed 10 Dec
        return `${dayName} ${dayNum} ${monthName}`;
    };

    return (
        <div className={cn("flex items-center gap-3 text-sm font-medium", className)}>
            {showIcon && <ClockIcon className="h-6 w-6 text-muted-foreground/50 bg-muted/50 p-1.5 rounded-md" />}
            <div className="flex flex-col justify-center leading-tight">
                <div className="tabular-nums font-bold text-foreground whitespace-nowrap">
                    {formatTime(time)}
                </div>
                <div className="text-[10px] text-muted-foreground font-medium tracking-wide whitespace-nowrap">
                    {formatDate(time)}
                </div>
            </div>
        </div>
    );
}
