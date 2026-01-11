import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Hammer, AlertTriangle, Clock } from 'lucide-react';

interface MaintenanceSettingsProps {
    data: any;
    onChange: (section: string, ...args: any[]) => void;
}

const MaintenanceSettings: React.FC<MaintenanceSettingsProps> = ({ data, onChange }) => {
    const maintenance = data?.maintenance || {};

    const addWindow = () => {
        const windows = [...(maintenance.scheduledMaintenance || [])];
        windows.push({ title: 'System Maintenance', start: new Date().toISOString(), end: new Date().toISOString() });
        onChange('maintenance', 'scheduledMaintenance', windows);
    }

    const removeWindow = (index: number) => {
        const windows = maintenance.scheduledMaintenance.filter((_: any, i: number) => i !== index);
        onChange('maintenance', 'scheduledMaintenance', windows);
    }

    const updateWindow = (index: number, key: string, val: any) => {
        const windows = [...maintenance.scheduledMaintenance];
        windows[index] = { ...windows[index], [key]: val };
        onChange('maintenance', 'scheduledMaintenance', windows);
    }

    return (
        <div className="space-y-6">
            <Card className={maintenance.enableMaintenanceMode ? "border-amber-500 bg-amber-50/50" : ""}>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle className="flex items-center gap-2 text-lg">
                            <Hammer className="w-5 h-5 text-amber-500" />
                            Maintenance Mode
                        </CardTitle>
                        <Switch
                            checked={maintenance.enableMaintenanceMode}
                            onCheckedChange={(v) => onChange('maintenance', 'enableMaintenanceMode', v)}
                        />
                    </div>
                    <CardDescription>
                        When enabled, only authorized users can access the platform.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    {maintenance.enableMaintenanceMode && (
                        <Alert variant="destructive" className="bg-amber-100 border-amber-500 text-amber-900">
                            <AlertTriangle className="h-4 w-4" />
                            <AlertTitle>Active Warning</AlertTitle>
                            <AlertDescription>
                                The platform is currently in maintenance mode. Public access is disabled.
                            </AlertDescription>
                        </Alert>
                    )}

                    <div className="flex items-center justify-between p-4 border rounded-lg bg-background">
                        <div className="space-y-0.5">
                            <Label>Allow Admin Access</Label>
                            <p className="text-sm text-muted-foreground">
                                Super Admins and Platform Admins can bypass maintenance.
                            </p>
                        </div>
                        <Switch
                            checked={maintenance.allowAdmins}
                            onCheckedChange={(v) => onChange('maintenance', 'allowAdmins', v)}
                        />
                    </div>

                    <div className="pt-4 border-t">
                        <div className="flex items-center justify-between mb-4">
                            <Label className="flex items-center gap-2">
                                <Clock className="w-4 h-4" />
                                Scheduled Maintenance
                            </Label>
                            <Button variant="outline" size="sm" onClick={addWindow}>Schedule Window</Button>
                        </div>

                        <div className="space-y-3">
                            {maintenance.scheduledMaintenance?.length > 0 ? (
                                maintenance.scheduledMaintenance.map((win: any, idx: number) => (
                                    <div key={idx} className="p-3 border rounded-lg bg-muted/30 space-y-3">
                                        <div className="flex items-center gap-2">
                                            <Input
                                                className="h-8 flex-1"
                                                value={win.title}
                                                onChange={(e) => updateWindow(idx, 'title', e.target.value)}
                                                placeholder="Maintenance Title"
                                            />
                                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-destructive" onClick={() => removeWindow(idx)}>×</Button>
                                        </div>
                                        <div className="grid grid-cols-2 gap-2">
                                            <div className="space-y-1">
                                                <Label className="text-[10px]">Start</Label>
                                                <Input
                                                    type="datetime-local"
                                                    className="h-8 text-[10px]"
                                                    value={win.start ? win.start.slice(0, 16) : ""}
                                                    onChange={(e) => updateWindow(idx, 'start', new Date(e.target.value).toISOString())}
                                                />
                                            </div>
                                            <div className="space-y-1">
                                                <Label className="text-[10px]">End</Label>
                                                <Input
                                                    type="datetime-local"
                                                    className="h-8 text-[10px]"
                                                    value={win.end ? win.end.slice(0, 16) : ""}
                                                    onChange={(e) => updateWindow(idx, 'end', new Date(e.target.value).toISOString())}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-8 border-2 border-dashed rounded-lg bg-muted/50">
                                    <p className="text-sm text-muted-foreground">No maintenance windows scheduled.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default MaintenanceSettings;
