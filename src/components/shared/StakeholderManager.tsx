"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Trash2, Plus, Users } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface Stakeholder {
    name: string
    sharePercentage?: number
    designation?: string
    nidOrPassport?: string
    isManagingDirector?: boolean
}

interface StakeholderManagerProps {
    type: "shareholders" | "directors"
    value: Stakeholder[]
    onChange: (stakeholders: Stakeholder[]) => void
}

export function StakeholderManager({ type, value, onChange }: StakeholderManagerProps) {
    const isShareholder = type === "shareholders"

    const addStakeholder = () => {
        const newStakeholder: Stakeholder = {
            name: "",
            ...(isShareholder ? { sharePercentage: 0 } : { designation: "", isManagingDirector: false }),
            nidOrPassport: ""
        }
        onChange([...value, newStakeholder])
    }

    const removeStakeholder = (index: number) => {
        onChange(value.filter((_, i) => i !== index))
    }

    const updateStakeholder = (index: number, field: keyof Stakeholder, val: any) => {
        const updated = [...value]
        updated[index] = { ...updated[index], [field]: val }
        onChange(updated)
    }

    const totalShares = isShareholder
        ? value.reduce((sum, s) => sum + (s.sharePercentage || 0), 0)
        : 0

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Users className="h-5 w-5 text-purple-500" />
                        {isShareholder ? "Shareholders" : "Directors"}
                    </div>
                    {isShareholder && (
                        <Badge variant={totalShares === 100 ? "default" : "destructive"}>
                            Total: {totalShares}%
                        </Badge>
                    )}
                </CardTitle>
                <CardDescription>
                    {isShareholder
                        ? "List all shareholders and their ownership percentages (must total 100%)"
                        : "List all directors and their designations"
                    }
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                {value.map((stakeholder, index) => (
                    <div key={index} className="p-4 border rounded-lg space-y-3 bg-muted/30">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-semibold text-muted-foreground">
                                {isShareholder ? "Shareholder" : "Director"} #{index + 1}
                            </span>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => removeStakeholder(index)}
                                className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                            >
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div className="space-y-2">
                                <Label>
                                    Full Name <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                    placeholder="John Doe"
                                    value={stakeholder.name}
                                    onChange={(e) => updateStakeholder(index, "name", e.target.value)}
                                    required
                                />
                            </div>

                            {isShareholder ? (
                                <div className="space-y-2">
                                    <Label>
                                        Share Percentage (%) <span className="text-red-500">*</span>
                                    </Label>
                                    <Input
                                        type="number"
                                        min="0"
                                        max="100"
                                        step="0.01"
                                        placeholder="25.5"
                                        value={stakeholder.sharePercentage || ""}
                                        onChange={(e) => updateStakeholder(index, "sharePercentage", parseFloat(e.target.value) || 0)}
                                        required
                                    />
                                </div>
                            ) : (
                                <div className="space-y-2">
                                    <Label>
                                        Designation <span className="text-red-500">*</span>
                                    </Label>
                                    <Input
                                        placeholder="CEO, Chairman, etc."
                                        value={stakeholder.designation || ""}
                                        onChange={(e) => updateStakeholder(index, "designation", e.target.value)}
                                        required
                                    />
                                </div>
                            )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div className="space-y-2">
                                <Label>NID / Passport Number</Label>
                                <Input
                                    placeholder="1234567890"
                                    value={stakeholder.nidOrPassport || ""}
                                    onChange={(e) => updateStakeholder(index, "nidOrPassport", e.target.value)}
                                />
                            </div>

                            {!isShareholder && (
                                <div className="flex items-center space-x-2 pt-8">
                                    <Switch
                                        id={`md-${index}`}
                                        checked={stakeholder.isManagingDirector || false}
                                        onCheckedChange={(checked) => updateStakeholder(index, "isManagingDirector", checked)}
                                    />
                                    <Label htmlFor={`md-${index}`} className="cursor-pointer">
                                        Managing Director
                                    </Label>
                                </div>
                            )}
                        </div>
                    </div>
                ))}

                {isShareholder && totalShares !== 100 && value.length > 0 && (
                    <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-sm text-yellow-800">
                        ⚠️ Share percentages must total exactly 100%. Current total: {totalShares}%
                    </div>
                )}

                <Button
                    type="button"
                    variant="outline"
                    onClick={addStakeholder}
                    className="w-full"
                >
                    <Plus className="h-4 w-4 mr-2" />
                    Add {isShareholder ? "Shareholder" : "Director"}
                </Button>
            </CardContent>
        </Card>
    )
}
