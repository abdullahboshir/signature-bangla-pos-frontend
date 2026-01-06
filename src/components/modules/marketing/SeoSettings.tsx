"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Search, Loader2 } from "lucide-react"
import { usePermissions } from "@/hooks/usePermissions"
import { PERMISSION_KEYS } from "@/config/permission-keys"
import { useGetSeoSettingsQuery, useUpdateSeoSettingsMutation } from "@/redux/api/platform/marketingApi"
import { useEffect, useState } from "react"
import { toast } from "sonner"

export default function SeoSettings() {
    const { hasPermission } = usePermissions();
    const { data: settings, isLoading } = useGetSeoSettingsQuery({});
    const [updateSeo, { isLoading: isUpdating }] = useUpdateSeoSettingsMutation();

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");

    useEffect(() => {
        if (settings) {
            setTitle(settings.title || "");
            setDescription(settings.description || "");
        }
    }, [settings]);

    const handleSave = async () => {
        try {
            await updateSeo({ title, description }).unwrap();
            toast.success("SEO settings updated");
        } catch (err) {
            toast.error("Failed to update SEO settings");
        }
    }

    if (!hasPermission(PERMISSION_KEYS.SEO.READ)) {
        return <div className="p-4 text-center text-muted-foreground">You do not have permission to view SEO settings.</div>
    }

    if (isLoading) {
        return <div className="p-4">Loading SEO settings...</div>
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
                    <Input
                        placeholder="Enter default title..."
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                </div>
                <div className="space-y-2">
                    <Label>Default Meta Description</Label>
                    <Input
                        placeholder="Enter default description..."
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                </div>
                {hasPermission(PERMISSION_KEYS.SEO.UPDATE) && (
                    <Button onClick={handleSave} disabled={isUpdating}>
                        {isUpdating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Save SEO Settings
                    </Button>
                )}
            </CardContent>
        </Card>
    )
}
