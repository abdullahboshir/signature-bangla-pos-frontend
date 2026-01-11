"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Clock, Calendar, AlertTriangle, Truck } from "lucide-react"

interface OperationsSettingsProps {
    data: any;
    onChange: (section: string, ...args: any[]) => void;
}

export function OperationsSettings({ data, onChange }: OperationsSettingsProps) {
    if (!data) return null;

    // Helper for deeper updates to keep code clean, though we could call onChange directly
    // onChange('operatingHours', 'weekdays', 'open', val) -> Depth 3

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Clock className="h-5 w-5" />
                        Operating Hours
                    </CardTitle>
                    <CardDescription>Configure your business opening and closing times</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    {/* Weekdays */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                        <div className="font-medium">Weekdays (Mon-Fri)</div>
                        <div className="flex items-center gap-2">
                            <Label className="text-xs text-muted-foreground w-12">Open</Label>
                            <Input
                                type="time"
                                value={data.operatingHours?.weekdays?.open || "09:00"}
                                onChange={(e) => onChange('operatingHours', 'weekdays', 'open', e.target.value)}
                            />
                        </div>
                        <div className="flex items-center gap-2">
                            <Label className="text-xs text-muted-foreground w-12">Close</Label>
                            <Input
                                type="time"
                                value={data.operatingHours?.weekdays?.close || "18:00"}
                                onChange={(e) => onChange('operatingHours', 'weekdays', 'close', e.target.value)}
                            />
                        </div>
                    </div>

                    <Separator />

                    {/* Weekends */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                        <div className="space-y-1">
                            <div className="font-medium">Weekends</div>
                            <div className="flex items-center gap-2">
                                <Switch
                                    checked={data.operatingHours?.weekends?.isClosed}
                                    onCheckedChange={(c) => onChange('operatingHours', 'weekends', 'isClosed', c)}
                                />
                                <Label className="text-xs">Closed on Weekends</Label>
                            </div>
                        </div>

                        {!data.operatingHours?.weekends?.isClosed && (
                            <>
                                <div className="flex items-center gap-2">
                                    <Label className="text-xs text-muted-foreground w-12">Open</Label>
                                    <Input
                                        type="time"
                                        value={data.operatingHours?.weekends?.open || "10:00"}
                                        onChange={(e) => onChange('operatingHours', 'weekends', 'open', e.target.value)}
                                    />
                                </div>
                                <div className="flex items-center gap-2">
                                    <Label className="text-xs text-muted-foreground w-12">Close</Label>
                                    <Input
                                        type="time"
                                        value={data.operatingHours?.weekends?.close || "16:00"}
                                        onChange={(e) => onChange('operatingHours', 'weekends', 'close', e.target.value)}
                                    />
                                </div>
                            </>
                        )}
                    </div>

                    <Separator />

                    <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                            <Label>Public Holidays</Label>
                            <p className="text-sm text-muted-foreground">Automatically close on national holidays</p>
                        </div>
                        <Switch
                            checked={data.operatingHours?.publicHolidays}
                            onCheckedChange={(c) => onChange('operatingHours', 'publicHolidays', c)}
                        />
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                            <Label>24/7 Operation</Label>
                            <p className="text-sm text-muted-foreground">Always open (overrides specific hours)</p>
                        </div>
                        <Switch
                            checked={data.operatingHours?.is24Hours}
                            onCheckedChange={(c) => onChange('operatingHours', 'is24Hours', c)}
                        />
                    </div>

                </CardContent>
            </Card>

            <Card className="border-amber-200">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-amber-600">
                        <AlertTriangle className="h-5 w-5" />
                        Maintenance & Access
                    </CardTitle>
                    <CardDescription>Manage site availability and restrictions</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-amber-50 rounded-lg">
                        <div className="space-y-0.5">
                            <Label>Maintenance Mode</Label>
                            <p className="text-sm text-muted-foreground">Restrict access to customers. Storefront will appear offline.</p>
                        </div>
                        <Switch
                            checked={data.maintenance?.enableMaintenanceMode}
                            onCheckedChange={(c) => onChange('maintenance', 'enableMaintenanceMode', c)}
                        />
                    </div>

                    {data.maintenance?.enableMaintenanceMode && (
                        <div className="flex items-center justify-between pl-4">
                            <div className="space-y-0.5">
                                <Label>Allow Admin Access</Label>
                                <p className="text-sm text-muted-foreground">Admins can still access the site while in maintenance mode</p>
                            </div>
                            <Switch
                                checked={data.maintenance?.allowAdmins}
                                onCheckedChange={(c) => onChange('maintenance', 'allowAdmins', c)}
                            />
                        </div>
                    )}
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Truck className="h-5 w-5" />
                        Service Area & Delivery
                    </CardTitle>
                    <CardDescription>Define your delivery reach and availability for this outlet</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="flex items-center justify-between p-4 border rounded-lg">
                            <div className="space-y-0.5">
                                <Label>Delivery Available</Label>
                                <p className="text-xs text-muted-foreground">Enable delivery service from this store</p>
                            </div>
                            <Switch
                                checked={data.serviceArea?.isDeliveryAvailable}
                                onCheckedChange={(c) => onChange('serviceArea', 'isDeliveryAvailable', c)}
                            />
                        </div>

                        <div className="flex items-center justify-between p-4 border rounded-lg">
                            <div className="space-y-0.5">
                                <Label>Pickup Available</Label>
                                <p className="text-xs text-muted-foreground">Allow customers to pick up orders in-store</p>
                            </div>
                            <Switch
                                checked={data.serviceArea?.pickupAvailable}
                                onCheckedChange={(c) => onChange('serviceArea', 'pickupAvailable', c)}
                            />
                        </div>
                    </div>

                    {data.serviceArea?.isDeliveryAvailable && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Delivery Radius (KM)</Label>
                                <Input
                                    type="number"
                                    value={data.serviceArea?.deliveryRadius || 5}
                                    onChange={(e) => onChange('serviceArea', 'deliveryRadius', parseFloat(e.target.value))}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Supported Regions (Comma separated)</Label>
                                <Input
                                    value={data.serviceArea?.regions?.join(', ') || ""}
                                    onChange={(e) => onChange('serviceArea', 'regions', e.target.value.split(',').map(r => r.trim()))}
                                    placeholder="e.g. Dhaka, Gulshan, Banani"
                                />
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
