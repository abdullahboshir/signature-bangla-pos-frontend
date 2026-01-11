"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Users, Calendar, DollarSign, CalendarDays } from "lucide-react"

interface HRMSettingsProps {
    data: any;
    onChange: (section: string, ...args: any[]) => void;
}

export function HRMSettings({ data, onChange }: HRMSettingsProps) {
    if (!data) return null;

    // HRM Structure: { attendance: {}, payroll: {}, leave: {} }

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Users className="h-5 w-5" />
                        Attendance Policy
                    </CardTitle>
                    <CardDescription>Configure attendance rules and tracking</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                            <Label>Enable Biometric Integration</Label>
                            <p className="text-sm text-muted-foreground">Sync with attendance hardware</p>
                        </div>
                        <Switch
                            checked={data.hrm?.attendance?.enableBiometric}
                            onCheckedChange={(c) => onChange('hrm', 'attendance', 'enableBiometric', c)}
                        />
                    </div>
                    <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                            <Label>Calculate Overtime</Label>
                        </div>
                        <Switch
                            checked={data.hrm?.attendance?.overtimeCalculation}
                            onCheckedChange={(c) => onChange('hrm', 'attendance', 'overtimeCalculation', c)}
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label>Grace Period (Minutes)</Label>
                        <Input
                            type="number"
                            value={data.hrm?.attendance?.gracePeriodMinutes || 15}
                            onChange={(e) => onChange('hrm', 'attendance', 'gracePeriodMinutes', parseInt(e.target.value))}
                        />
                        <p className="text-xs text-muted-foreground">Allowable late entry before penalty applies.</p>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <CalendarDays className="h-5 w-5" />
                        Leave Policy & Allocations
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="grid gap-2">
                            <Label>Annual Leave (Days)</Label>
                            <Input
                                type="number"
                                value={data.hrm?.leave?.annualLeaveDays || 14}
                                onChange={(e) => onChange('hrm', 'leave', 'annualLeaveDays', parseInt(e.target.value))}
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label>Sick Leave (Days)</Label>
                            <Input
                                type="number"
                                value={data.hrm?.leave?.sickLeaveDays || 10}
                                onChange={(e) => onChange('hrm', 'leave', 'sickLeaveDays', parseInt(e.target.value))}
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label>Casual Leave (Days)</Label>
                            <Input
                                type="number"
                                value={data.hrm?.leave?.casualLeaveDays || 10}
                                onChange={(e) => onChange('hrm', 'leave', 'casualLeaveDays', parseInt(e.target.value))}
                            />
                        </div>
                    </div>
                    <div className="grid gap-2 mt-2">
                        <Label>Carry Forward Limit (Days)</Label>
                        <Input
                            type="number"
                            value={data.hrm?.leave?.carryForwardLimit || 5}
                            onChange={(e) => onChange('hrm', 'leave', 'carryForwardLimit', parseInt(e.target.value))}
                        />
                        <p className="text-xs text-muted-foreground">Maximum unused leave carried to next year.</p>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <DollarSign className="h-5 w-5" />
                        Payroll Configuration
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label>Local Currency</Label>
                            <Select
                                value={data.hrm?.payroll?.currency || 'BDT'}
                                onValueChange={(val) => onChange('hrm', 'payroll', 'currency', val)}
                            >
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="BDT">Bangladeshi Taka (BDT)</SelectItem>
                                    <SelectItem value="USD">US Dollar (USD)</SelectItem>
                                    <SelectItem value="EUR">Euro (EUR)</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid gap-2">
                            <Label>Pay Cycle</Label>
                            <Select
                                value={data.hrm?.payroll?.payCycle || 'monthly'}
                                onValueChange={(val) => onChange('hrm', 'payroll', 'payCycle', val)}
                            >
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="weekly">Weekly</SelectItem>
                                    <SelectItem value="bi-weekly">Bi-Weekly</SelectItem>
                                    <SelectItem value="monthly">Monthly</SelectItem>
                                    <SelectItem value="daily">Daily</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                            <Label>Auto-Generate Payslips</Label>
                            <p className="text-sm text-muted-foreground">Generate draft payslips at cycle end</p>
                        </div>
                        <Switch
                            checked={data.hrm?.payroll?.autoGenerate}
                            onCheckedChange={(c) => onChange('hrm', 'payroll', 'autoGenerate', c)}
                        />
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
