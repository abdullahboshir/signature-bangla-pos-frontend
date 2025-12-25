"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { MessageSquare } from "lucide-react"
import { usePermissions } from "@/hooks/usePermissions"
import { PERMISSION_KEYS } from "@/config/permission-keys"

export default function ChatInterface() {
    const { hasPermission } = usePermissions();

    if (!hasPermission(PERMISSION_KEYS.CHAT.READ)) {
        return <div className="p-4 text-center text-muted-foreground">You do not have permission to access chat.</div>
    }

    return (
        <Card className="h-[600px] flex flex-col">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <MessageSquare className="h-5 w-5" />
                    Support Chat
                </CardTitle>
                <CardDescription>Live communication with customers.</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 flex items-center justify-center text-muted-foreground border-t">
                {/* Placeholder for chat UI */}
                Select a conversation to start chatting
            </CardContent>
        </Card>
    )
}
