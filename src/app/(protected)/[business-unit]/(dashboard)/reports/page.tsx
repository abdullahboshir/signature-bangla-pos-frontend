"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { TabsContent } from "@/components/ui/tabs";
import { DataPageLayout } from "@/components/shared/DataPageLayout";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
    { name: 'Mon', revenue: 4000, expenses: 2400 },
    { name: 'Tue', revenue: 3000, expenses: 1398 },
    { name: 'Wed', revenue: 2000, expenses: 9800 },
    { name: 'Thu', revenue: 2780, expenses: 3908 },
    { name: 'Fri', revenue: 1890, expenses: 4800 },
    { name: 'Sat', revenue: 2390, expenses: 3800 },
    { name: 'Sun', revenue: 3490, expenses: 4300 },
];

export default function ReportsPage() {
    const [activeTab, setActiveTab] = useState("revenue");

    return (
        <DataPageLayout
            title="Financial Reports"
            description="View detailed financial analytics."
            activeTab={activeTab}
            onTabChange={setActiveTab}
            tabs={[
                { value: "revenue", label: "Revenue" },
                { value: "profit", label: "Profit & Loss" }
            ]}
        >
            <TabsContent value="revenue" className="mt-0">
                <div className="space-y-4">
                    <div>
                        <h3 className="text-lg font-medium">Revenue Analytics</h3>
                        <p className="text-sm text-muted-foreground">Daily revenue fluctuation over the past week.</p>
                    </div>
                    <div className="h-[400px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={data}>
                                <defs>
                                    <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                                        <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Area type="monotone" dataKey="revenue" stroke="#8884d8" fillOpacity={1} fill="url(#colorRev)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </TabsContent>
            <TabsContent value="profit" className="mt-0">
                <div className="space-y-4">
                    <div>
                        <h3 className="text-lg font-medium">Profit & Loss</h3>
                        <p className="text-sm text-muted-foreground">Net profit trends.</p>
                    </div>
                    <div className="h-[400px] flex items-center justify-center border rounded-md bg-muted/10 text-muted-foreground">
                        Profit chart placeholder
                    </div>
                </div>
            </TabsContent>
        </DataPageLayout>
    );
}
