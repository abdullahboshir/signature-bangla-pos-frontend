"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function InventorySettings({ data, onChange }: { data: any, onChange: (section: string, ...args: any[]) => void }) {
    if (!data) return null;

    const updateInventory = (key: string, value: any) => {
        onChange('inventory', key, value);
    }

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Inventory Control</CardTitle>
                    <CardDescription>Manage stock handling and alerts</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                            <Label>Allow Negative Stock</Label>
                            <p className="text-sm text-muted-foreground">Allow sales even when product stock is 0 or less</p>
                        </div>
                        <Switch
                            checked={data.inventory?.allowNegativeStock}
                            onCheckedChange={(c) => updateInventory('allowNegativeStock', c)}
                        />
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Valuation & Automation</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label>Valuation Method</Label>
                            <Select
                                value={data.inventory?.valuationMethod || 'FIFO'}
                                onValueChange={(val) => updateInventory('valuationMethod', val)}
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="FIFO">First In, First Out (FIFO)</SelectItem>
                                    <SelectItem value="LIFO">Last In, First Out (LIFO)</SelectItem>
                                    <SelectItem value="AVCO">Average Cost (AVCO)</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid gap-2">
                            <Label>Stock-out Action</Label>
                            <Select
                                value={data.inventory?.stockOutAction || 'block'}
                                onValueChange={(val) => updateInventory('stockOutAction', val)}
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="block">Block Sales</SelectItem>
                                    <SelectItem value="warn">Warn Cashier</SelectItem>
                                    <SelectItem value="allow">Allow (Negative Stock)</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                            <Label>Auto-Reorder Logic</Label>
                            <p className="text-sm text-muted-foreground">Automatically draft Purchase Orders when low stock</p>
                        </div>
                        <Switch
                            checked={data.inventory?.autoReorderEnabled}
                            onCheckedChange={(c) => updateInventory('autoReorderEnabled', c)}
                        />
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Low Stock Alerts</CardTitle>
                    <CardDescription>Configure when to be notified about low inventory</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                            <Label>Enable Low Stock Alerts</Label>
                        </div>
                        <Switch
                            checked={data.inventory?.enableLowStockAlerts}
                            onCheckedChange={(c) => updateInventory('enableLowStockAlerts', c)}
                        />
                    </div>
                    {data.inventory?.enableLowStockAlerts && (
                        <div className="grid gap-2">
                            <Label>Global Low Stock Threshold</Label>
                            <Input
                                type="number"
                                min="1"
                                value={data.inventory?.lowStockThreshold || 5}
                                onChange={(e) => updateInventory('lowStockThreshold', parseInt(e.target.value))}
                            />
                            <p className="text-xs text-muted-foreground">Products with stock below this number will be flagged as low stock.</p>
                        </div>
                    )}
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Barcode & Labeling</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid gap-2">
                        <Label>Default Barcode Format</Label>
                        <Select
                            value={data.inventory?.barcodeFormat || 'CODE128'}
                            onValueChange={(val) => updateInventory('barcodeFormat', val)}
                        >
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="CODE128">Code 128 (Alphanumeric)</SelectItem>
                                <SelectItem value="EAN13">EAN-13 (13 Digits)</SelectItem>
                                <SelectItem value="UPCA">UPC-A (12 Digits)</SelectItem>
                            </SelectContent>
                        </Select>
                        <p className="text-xs text-muted-foreground">Used when auto-generating barcodes for new products.</p>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
