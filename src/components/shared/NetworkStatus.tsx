"use client";

import { useState, useEffect } from "react";
import { Wifi, WifiOff } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

export function NetworkStatus({ className }: { className?: string }) {
    const [isOnline, setIsOnline] = useState(true);

    useEffect(() => {
        setIsOnline(navigator.onLine);

        const handleOnline = () => setIsOnline(true);
        const handleOffline = () => setIsOnline(false);

        window.addEventListener("online", handleOnline);
        window.addEventListener("offline", handleOffline);

        return () => {
            window.removeEventListener("online", handleOnline);
            window.removeEventListener("offline", handleOffline);
        };
    }, []);

    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                    <div className={cn(
                        "flex items-center justify-center w-8 h-8 rounded-full transition-colors",
                        isOnline ? "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-500" : "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-500",
                        className
                    )}>
                        {isOnline ? <Wifi className="h-4 w-4" /> : <WifiOff className="h-4 w-4" />}
                    </div>
                </TooltipTrigger>
                <TooltipContent>
                    <p>{isOnline ? "System Online" : "System Offline"}</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
}
