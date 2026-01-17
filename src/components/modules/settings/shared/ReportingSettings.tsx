"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { BarChart3, Clock, Mail, Trash2, Plus } from "lucide-react"

interface ScheduledReport {
    reportType: string
    frequency: "daily" | "weekly" | "monthly"
    recipients: string[]
}

interface ReportingData {
    visibleMetrics?: string[]
    scheduledReports?: ScheduledReport[]
    retentionDays?: number
}

interface ReportingSettingsProps {
    data: ReportingData
    onChange: (section: string, ...args: any[]) => void;
}

const REPORT_TYPES = [
    { value: "sales_summary", label: "Sales Summary" },
    { value: "inventory_status", label: "Inventory Analysis" },
    { value: "financial_health", label: "Profit & Loss" },
    { value: "audit_logs", label: "Compliance & Audit" },
    { value: "employee_performance", label: "HRM Insights" }
]

const METRICS = [
    "Gross Revenue", "Net Profit", "Customer Lifetime Value", "Burn Rate",
    "Employee Turnover", "Stock Accuracy", "Return Rate", "SLA Fulfillment"
]

export default function ReportingSettings({ data, onChange }: ReportingSettingsProps) {
    const handleAddReport = () => {
        const newReports = [...(data.scheduledReports || []), {
            reportType: "sales_summary",
            frequency: "weekly" as const,
            recipients: []
        }]
        onChange("reporting", "scheduledReports", newReports)
    }

    const handleRemoveReport = (index: number) => {
        const newReports = (data.scheduledReports || []).filter((_, i) => i !== index)
        onChange("reporting", "scheduledReports", newReports)
    }

    const handleReportChange = (index: number, field: keyof ScheduledReport, value: any) => {
        const newReports = [...(data.scheduledReports || [])]
        newReports[index] = { ...newReports[index], [field]: value }
        onChange("reporting", "scheduledReports", newReports)
    }

    const toggleMetric = (metric: string) => {
        const current = data.visibleMetrics || []
        const updated = current.includes(metric)
            ? current.filter(m => m !== metric)
            : [...current, metric]
        onChange("reporting", "visibleMetrics", updated)
    }

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <BarChart3 className="h-5 w-5 text-blue-500" />
                        Dashboard Metrics
                    </CardTitle>
                    <CardDescription>Select which high-level metrics are visible on the executive dashboard.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {METRICS.map(metric => (
                            <div
                                key={metric}
                                className={`flex items-center justify-between p-3 border rounded-lg cursor-pointer transition-all ${data.visibleMetrics?.includes(metric) ? 'border-primary bg-primary/5' : 'bg-muted/20'
                                    }`}
                                onClick={() => toggleMetric(metric)}
                            >
                                <span className="text-sm font-medium">{metric}</span>
                                <Switch checked={data.visibleMetrics?.includes(metric)} />
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0">
                    <div>
                        <CardTitle className="flex items-center gap-2">
                            <Clock className="h-5 w-5 text-orange-500" />
                            Scheduled Reports
                        </CardTitle>
                        <CardDescription>Automate report generation and email delivery to stakeholders.</CardDescription>
                    </div>
                    <Button variant="outline" size="sm" onClick={handleAddReport}>
                        <Plus className="h-4 w-4 mr-2" /> Add Schedule
                    </Button>
                </CardHeader>
                <CardContent className="space-y-4">
                    {(!data.scheduledReports || data.scheduledReports.length === 0) ? (
                        <div className="text-center py-8 border-2 border-dashed rounded-lg text-muted-foreground">
                            No scheduled reports configured.
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {data.scheduledReports.map((report, index) => (
                                <div key={index} className="p-4 border rounded-lg space-y-4 bg-muted/30 relative">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="absolute top-2 right-2 text-destructive"
                                        onClick={() => handleRemoveReport(index)}
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label>Report Type</Label>
                                            <Select
                                                value={report.reportType}
                                                onValueChange={(val) => handleReportChange(index, "reportType", val)}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {REPORT_TYPES.map(rt => (
                                                        <SelectItem key={rt.value} value={rt.value}>{rt.label}</SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Frequency</Label>
                                            <Select
                                                value={report.frequency}
                                                onValueChange={(val: any) => handleReportChange(index, "frequency", val)}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="daily">Daily</SelectItem>
                                                    <SelectItem value="weekly">Weekly</SelectItem>
                                                    <SelectItem value="monthly">Monthly</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="flex items-center gap-2"><Mail className="h-4 w-4" /> Recipients</Label>
                                        <Input
                                            placeholder="stakeholder@organization.com, admin@organization.com (Comma separated)"
                                            value={report.recipients.join(", ")}
                                            onChange={(e) => handleReportChange(index, "recipients", e.target.value.split(",").map(r => r.trim()))}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Trash2 className="h-5 w-5 text-destructive" />
                        Data Retention Policy
                    </CardTitle>
                    <CardDescription>Define how long detailed transaction reports are kept in active storage.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-2 max-w-xs">
                        <Label>Retention Period (Days)</Label>
                        <Input
                            type="number"
                            value={data.retentionDays || 365}
                            onChange={(e) => onChange("reporting", "retentionDays", parseInt(e.target.value))}
                        />
                        <p className="text-xs text-muted-foreground mt-1">Data older than this will be moved to cold archival storage.</p>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
