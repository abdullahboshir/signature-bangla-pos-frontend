"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function PosSettings({ data, onChange }: { data: any, onChange: (key: string, value: any) => void }) {
    if (!data) return null;

    const updatePos = (key: string, value: any) => {
        onChange('pos', { ...data.pos, [key]: value });
    }

    const updateRewards = (key: string, value: any) => {
        onChange('rewardPoints', { ...data.rewardPoints, [key]: value });
    }

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>POS Configuration</CardTitle>
                    <CardDescription>Point of Sale specific settings</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid gap-2">
                        <Label>Receipt Layout</Label>
                        <Select
                            value={data.pos?.receiptLayout || 'thermal'}
                            onValueChange={(val) => updatePos('receiptLayout', val)}
                        >
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="thermal">Thermal (Standard)</SelectItem>
                                <SelectItem value="simple">Simple Text</SelectItem>
                                <SelectItem value="detailed">Detailed (A4/Letter)</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                            <Label>Enable Sound Effects</Label>
                        </div>
                        <Switch
                            checked={data.pos?.soundEffects}
                            onCheckedChange={(c) => updatePos('soundEffects', c)}
                        />
                    </div>
                    <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                            <Label>Disable Suspend/Hold</Label>
                        </div>
                        <Switch
                            checked={data.pos?.disableSuspend}
                            onCheckedChange={(c) => updatePos('disableSuspend', c)}
                        />
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Loyalty & Rewards</CardTitle>
                    <CardDescription>Configure customer reward points system</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                            <Label>Enable Reward Points</Label>
                        </div>
                        <Switch
                            checked={data.rewardPoints?.enabled}
                            onCheckedChange={(c) => updateRewards('enabled', c)}
                        />
                    </div>
                    {data.rewardPoints?.enabled && (
                        <>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Points Per Currency Unit</Label>
                                    <Input
                                        type="number"
                                        value={data.rewardPoints?.pointsPerCurrency || 1}
                                        onChange={(e) => updateRewards('pointsPerCurrency', parseFloat(e.target.value))}
                                    />
                                    <p className="text-xs text-muted-foreground">E.g., Earn 1 point for every $1 spent</p>
                                </div>
                                <div className="space-y-2">
                                    <Label>Redemption Value (per point)</Label>
                                    <Input
                                        type="number"
                                        value={data.rewardPoints?.currencyPerPoint || 0.01}
                                        onChange={(e) => updateRewards('currencyPerPoint', parseFloat(e.target.value))}
                                    />
                                    <p className="text-xs text-muted-foreground">E.g., 1 point = $0.01 discount</p>
                                </div>
                            </div>
                            <div className="grid gap-2">
                                <Label>Points Expiry (Months)</Label>
                                <Input
                                    type="number"
                                    value={data.rewardPoints?.expiryPeriod || 12}
                                    onChange={(e) => updateRewards('expiryPeriod', parseFloat(e.target.value))}
                                />
                            </div>
                        </>
                    )}
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Receipt Customization</CardTitle>
                    <CardDescription>Customize the look and feel of printed receipts</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                            <Label>Show Store Logo</Label>
                        </div>
                        <Switch
                            checked={data.pos?.showLogo}
                            onCheckedChange={(c) => updatePos('showLogo', c)}
                        />
                    </div>
                    {data.pos?.showLogo && (
                        <div className="grid gap-2">
                            <Label>Logo Position</Label>
                            <Select
                                value={data.pos?.logoPosition || 'top'}
                                onValueChange={(val) => updatePos('logoPosition', val)}
                            >
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="top">Top (Header)</SelectItem>
                                    <SelectItem value="bottom">Bottom (Footer)</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    )}
                    <div className="grid gap-2">
                        <Label>Receipt Header Text</Label>
                        <Input
                            value={data.pos?.receiptHeader || ''}
                            onChange={(e) => updatePos('receiptHeader', e.target.value)}
                            placeholder="e.g. Welcome to Signature Bangla"
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label>Receipt Footer Text</Label>
                        <Input
                            value={data.pos?.receiptFooter || ''}
                            onChange={(e) => updatePos('receiptFooter', e.target.value)}
                            placeholder="e.g. Thank you for shopping with us!"
                        />
                    </div>
                </CardContent>
            </Card>
        </div >
    )
}
