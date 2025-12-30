"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { useGetSystemSettingsQuery, useUpdateSystemSettingsMutation } from "@/redux/api/system/settingsApi"
import { useState, useEffect } from "react"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"

export function GlobalDataRetentionSettings() {
    const { data: settings, isLoading } = useGetSystemSettingsQuery(undefined);
    const [updateSettings, { isLoading: isUpdating }] = useUpdateSystemSettingsMutation();
    const [retentionDays, setRetentionDays] = useState<string | number>(365);
    const [isEnabled, setIsEnabled] = useState<boolean>(true);

    useEffect(() => {
        if (settings) {
            if (settings.softDeleteRetentionDays !== undefined) {
                setRetentionDays(settings.softDeleteRetentionDays);
            }
            if (settings.isRetentionPolicyEnabled !== undefined) {
                setIsEnabled(settings.isRetentionPolicyEnabled);
            }
        }
    }, [settings]);

    const handleSave = async () => {
        const days = Number(retentionDays);
        if (isNaN(days) || days < 1) {
            toast.error("Please enter a valid number of days (minimum 1)");
            return;
        }

        try {
            await updateSettings({
                softDeleteRetentionDays: days,
                isRetentionPolicyEnabled: isEnabled
            }).unwrap();
            toast.success("System settings updated successfully");
        } catch (error) {
            console.error(error);
            toast.error("Failed to update system settings");
        }
    };

    if (isLoading) {
        return <div className="p-4 border rounded mb-4 text-muted-foreground flex items-center gap-2"><Loader2 className="animate-spin h-4 w-4" /> Loading system settings...</div>
    }

    return (
        <Card className="mb-6 border-orange-200 bg-orange-50/30">
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle className="text-orange-900">Data Retention Policy</CardTitle>
                        <CardDescription>
                            Configure how long soft-deleted data is retained before permanent deletion.
                        </CardDescription>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Label htmlFor="policy-mode" className="text-sm font-medium">
                            {isEnabled ? "Enabled" : "Disabled"}
                        </Label>
                        <Switch
                            id="policy-mode"
                            checked={isEnabled}
                            onCheckedChange={setIsEnabled}
                        />
                    </div>
                </div>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="grid gap-2">
                    <Label htmlFor="retentionDays">Retention Period (Days)</Label>
                    <div className="flex gap-4 items-end">
                        <div className="flex-1">
                            <Input
                                id="retentionDays"
                                type="number"
                                min="1"
                                value={retentionDays}
                                disabled={!isEnabled}
                                onChange={(e) => {
                                    const val = e.target.value;
                                    setRetentionDays(val === '' ? '' : val);
                                }}
                                className="bg-white"
                            />
                            <p className="text-xs text-muted-foreground mt-1">
                                {isEnabled
                                    ? "Data older than this will be permanently deleted by the daily cleanup job."
                                    : "Automatic cleanup is currently disabled."}
                            </p>
                        </div>
                        <Button
                            onClick={handleSave}
                            disabled={isUpdating || (isEnabled && Number(retentionDays) < 1)}
                            className="bg-orange-600 hover:bg-orange-700 text-white"
                        >
                            {isUpdating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                            Save Policy
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

