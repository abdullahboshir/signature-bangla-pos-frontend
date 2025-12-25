"use client"

import { Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface CenteredLoadingProps {
    /** Loading message to display */
    message?: string
    /** Size of the spinner - 'auto' adapts to container */
    size?: "sm" | "md" | "lg" | "xl" | "auto"
    /** Full screen overlay */
    fullScreen?: boolean
    /** Minimum height for non-fullscreen mode */
    minHeight?: string
    /** Custom className */
    className?: string
}

const sizeClasses = {
    sm: "h-6 w-6",
    md: "h-8 w-8",
    lg: "h-12 w-12",
    xl: "h-16 w-16",
    auto: "h-[8%] w-[8%] min-h-8 min-w-8 max-h-16 max-w-16", // Responsive to container
}


export function CenteredLoading({
    message,
    size = "auto",
    fullScreen = false,
    minHeight = "200px",
    className,
}: CenteredLoadingProps) {
    const content = (
        <div className="flex flex-col items-center justify-center gap-4">
            <Loader2
                className={cn(
                    "animate-spin text-primary",
                    sizeClasses[size]
                )}
            />
            {message && (
                <p className="text-sm text-muted-foreground font-medium animate-pulse">
                    {message}
                </p>
            )}
        </div>
    )

    if (fullScreen) {
        return (
            <div
                className={cn(
                    "fixed inset-0 z-50 flex items-center justify-center",
                    "bg-background/80 backdrop-blur-sm",
                    className
                )}
            >
                {content}
            </div>
        )
    }

    // Regular mode - centered in parent container
    return (
        <div
            className={cn(
                "flex items-center justify-center w-full h-full",
                className
            )}
            style={{ minHeight }}
        >
            {content}
        </div>
    )
}
