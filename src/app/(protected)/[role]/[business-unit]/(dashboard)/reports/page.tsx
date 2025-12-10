"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
    return (
        <div className="container mx-auto py-6 space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Financial Reports</h1>
                <p className="text-muted-foreground">View detailed financial analytics.</p>
            </div>

            <Tabs defaultValue="revenue" className="w-full">
                <TabsList className="grid w-full grid-cols-2 max-w-[400px]">
                    <TabsTrigger value="revenue">Revenue</TabsTrigger>
                    <TabsTrigger value="profit">Profit & Loss</TabsTrigger>
                </TabsList>
                <TabsContent value="revenue" className="mt-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Revenue Analytics</CardTitle>
                            <CardDescription>Daily revenue fluctuation over the past week.</CardDescription>
                        </CardHeader>
                        <CardContent className="h-[400px]">
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
                        </CardContent>
                    </Card>
                </TabsContent>
                <TabsContent value="profit" className="mt-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Profit & Loss</CardTitle>
                            <CardDescription>Net profit trends.</CardDescription>
                        </CardHeader>
                        <CardContent className="h-[400px] flex items-center justify-center text-muted-foreground">
                            Profit chart placeholder
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
