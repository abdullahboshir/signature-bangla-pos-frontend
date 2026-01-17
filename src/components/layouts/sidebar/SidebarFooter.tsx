"use client"

import { useAuth } from "@/hooks/useAuth"
import { useCurrentBusinessUnit } from "@/hooks/useCurrentBusinessUnit"
import { HelpCircle, AlertCircle, Wifi, WifiOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Clock } from "@/components/shared/Clock"
import { NetworkStatus } from "@/components/shared/NetworkStatus"
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import { useEffect, useState } from "react"

export function SidebarFooter() {
    const { user } = useAuth()
    const { currentBusinessUnit } = useCurrentBusinessUnit()
    const currentYear = new Date().getFullYear()
    const [isOnline, setIsOnline] = useState(true)

    // Network status monitoring
    useEffect(() => {
        const updateOnlineStatus = () => setIsOnline(navigator.onLine)

        window.addEventListener('online', updateOnlineStatus)
        window.addEventListener('offline', updateOnlineStatus)

        return () => {
            window.removeEventListener('online', updateOnlineStatus)
            window.removeEventListener('offline', updateOnlineStatus)
        }
    }, [])

    return (
        <footer className="border-t bg-background py-2.5">
            <div className="container mx-auto px-4">
                <div className="flex flex-col lg:flex-row items-center justify-between gap-2 text-xs">
                    {/* Left Section - Organization Info + Time */}
                    <div className="flex items-center gap-3 flex-wrap justify-center lg:justify-start">
                        <span className="text-muted-foreground">
                            © {currentYear} Signature Bangla POS
                        </span>
                        <Badge variant="outline" className="text-xs">
                            v1.0.0
                        </Badge>

                        {/* Time & Network Status */}
                        <div className="flex items-center gap-2 bg-muted/40 px-2.5 py-1 rounded-full border">
                            <Clock className="text-[10px] tabular-nums" />
                            <div className="h-3 w-px bg-border" />
                            <NetworkStatus className="w-3 h-3 text-[9px]" />
                        </div>
                    </div>

                    {/* Middle Section - Context Info */}
                    <div className="flex items-center gap-3 flex-wrap justify-center text-muted-foreground">
                        {currentBusinessUnit && (
                            <>
                                <span className="flex items-center gap-1.5">
                                    <span className="font-medium text-foreground">Unit:</span>
                                    <span>{currentBusinessUnit.name}</span>
                                </span>
                                <span>•</span>
                            </>
                        )}

                        {user?.email && (
                            <span className="flex items-center gap-1.5">
                                <span className="font-medium text-foreground">User:</span>
                                <span>{user.email}</span>
                            </span>
                        )}
                    </div>

                    {/* Right Section - Quick Actions */}
                    <div className="flex items-center gap-2">
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="h-6 px-2 text-xs"
                                        onClick={() => window.open('/docs', '_blank')}
                                    >
                                        <HelpCircle className="h-3 w-3 mr-1" />
                                        Help
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>Access Documentation</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>

                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="h-6 px-2 text-xs"
                                        onClick={() => window.open('mailto:support@signaturebangla.com', '_blank')}
                                    >
                                        <AlertCircle className="h-3 w-3 mr-1" />
                                        Support
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>Contact Support</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </div>
                </div>
            </div>
        </footer>
    )
}
