"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Search } from "lucide-react"
import { usePermissions } from "@/hooks/usePermissions"
import { PERMISSION_KEYS } from "@/config/permission-keys"

export default function SeoSettings() {
    const { hasPermission } = usePermissions();

    if (!hasPermission(PERMISSION_KEYS.SEO.READ)) {
        return <div className="p-4 text-center text-muted-foreground">You do not have permission to view SEO settings.</div>
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Search className="h-5 w-5" />
                    SEO Settings
                </CardTitle>
                <CardDescription>Manage global SEO configurations.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                    <Label>Default Meta Title</Label>
                    <Input placeholder="Enter default title..." />
                </div>
                <div className="space-y-2">
                    <Label>Default Meta Description</Label>
                    <Input placeholder="Enter default description..." />
                </div>
                {hasPermission(PERMISSION_KEYS.SEO.UPDATE) && (
                    <Button>Save SEO Settings</Button>
                )}
            </CardContent>
        </Card>
    )
}
