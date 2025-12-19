"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Download } from "lucide-react";
import { format } from "date-fns";

export default function ReportsPage() {
    const [reportType, setReportType] = useState<string>("revenue");
    const [dateRange, setDateRange] = useState<any>(null);
    const [generating, setGenerating] = useState(false);

    const handleGenerateReport = async () => {
        setGenerating(true);
        // TODO: Implement actual report generation
        setTimeout(() => {
            setGenerating(false);
            alert("Report generation will be implemented when backend endpoint is ready");
        }, 1000);
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Reports</h1>
                    <p className="text-gray-500 mt-1">Generate comprehensive business reports</p>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Generate Report</CardTitle>
                    <CardDescription>Select report type and date range</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Report Type</label>
                            <Select value={reportType} onValueChange={setReportType}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select report type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="revenue">Revenue Summary</SelectItem>
                                    <SelectItem value="sales">Sales Report</SelectItem>
                                    <SelectItem value="inventory">Inventory Report</SelectItem>
                                    <SelectItem value="users">User Activity</SelectItem>
                                    <SelectItem value="business-units">Business Unit Performance</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Date Range</label>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button variant="outline" className="w-full justify-start text-left font-normal">
                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                        {dateRange ? format(dateRange, "PPP") : "Pick a date"}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0" align="start">
                                    <Calendar
                                        mode="single"
                                        selected={dateRange}
                                        onSelect={setDateRange}
                                        initialFocus
                                    />
                                </PopoverContent>
                            </Popover>
                        </div>
                    </div>

                    <Button
                        onClick={handleGenerateReport}
                        disabled={generating}
                        className="w-full md:w-auto"
                    >
                        <Download className="mr-2 h-4 w-4" />
                        {generating ? "Generating..." : "Generate Report"}
                    </Button>
                </CardContent>
            </Card>

            {/* Recent Reports */}
            <Card>
                <CardHeader>
                    <CardTitle>Recent Reports</CardTitle>
                    <CardDescription>Previously generated reports</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="text-center py-8 text-gray-400">
                        <p>📄</p>
                        <p className="mt-2">No reports generated yet</p>
                        <p className="text-sm">Generate reports will appear here</p>
                    </div>
                </CardContent>
            </Card>

            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                <p className="text-sm text-amber-800">
                    <strong>Coming Soon:</strong> Report generation with PDF/Excel export will be implemented in the next phase.
                    Backend API endpoint needed: <code className="bg-amber-100 px-1 rounded">/api/v1/super-admin/reports</code>
                </p>
            </div>
        </div>
    );
}
