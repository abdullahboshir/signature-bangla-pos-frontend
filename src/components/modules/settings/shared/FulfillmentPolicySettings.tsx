"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Truck, Clock, CheckCircle } from "lucide-react"

interface FulfillmentPolicyData {
    autoApproveOrders?: boolean
    allowOrderCancellation?: boolean
    cancellationWindowMinutes?: number
}

interface FulfillmentPolicySettingsProps {
    data: FulfillmentPolicyData
    onChange: (section: string, key: string, value: any) => void
}

export default function FulfillmentPolicySettings({ data, onChange }: FulfillmentPolicySettingsProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Truck className="h-5 w-5 text-blue-500" />
                    Fulfillment & Order Policy
                </CardTitle>
                <CardDescription>Configure how orders are processed and managed post-purchase.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                        <Label className="text-base flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-emerald-500" />
                            Auto-Approve Orders
                        </Label>
                        <p className="text-sm text-muted-foreground">Skip manual review for new orders and move directly to fulfillment</p>
                    </div>
                    <Switch
                        checked={data.autoApproveOrders ?? false}
                        onCheckedChange={(val) => onChange("fulfillmentPolicy", "autoApproveOrders", val)}
                    />
                </div>

                <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                        <Label className="text-base">Allow Order Cancellation</Label>
                        <p className="text-sm text-muted-foreground">Permit customers or staff to cancel orders within a specific timeframe</p>
                    </div>
                    <Switch
                        checked={data.allowOrderCancellation ?? true}
                        onCheckedChange={(val) => onChange("fulfillmentPolicy", "allowOrderCancellation", val)}
                    />
                </div>

                {data.allowOrderCancellation && (
                    <div className="space-y-2 pt-4 border-t max-w-xs">
                        <Label className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-orange-500" />
                            Cancellation Window (Minutes)
                        </Label>
                        <Input
                            type="number"
                            value={data.cancellationWindowMinutes || 30}
                            onChange={(e) => onChange("fulfillmentPolicy", "cancellationWindowMinutes", parseInt(e.target.value))}
                        />
                        <p className="text-xs text-muted-foreground">Time limit allowed for self-service or standard cancellation.</p>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}
