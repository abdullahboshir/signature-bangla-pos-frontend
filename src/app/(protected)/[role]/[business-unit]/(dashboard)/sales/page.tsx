"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const RECENT_SALES = [
    { id: "ORD-001", customer: "Walk-in Customer", total: 45.00, status: "completed", date: "10 min ago" },
    { id: "ORD-002", customer: "John Doe", total: 120.50, status: "completed", date: "1 hour ago" },
    { id: "ORD-003", customer: "Jane Smith", total: 34.00, status: "returned", date: "2 hours ago" },
    { id: "ORD-004", customer: "Bob Wilson", total: 89.99, status: "completed", date: "3 hours ago" },
    { id: "ORD-005", customer: "Alice Brown", total: 15.00, status: "completed", date: "yesterday" },
];

export default function SalesPage() {
    return (
        <div className="container mx-auto py-6 space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Sales History</h1>
                <p className="text-muted-foreground">View and manage all sales transactions.</p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Recent Transactions</CardTitle>
                    <CardDescription>A list of recent sales records.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {RECENT_SALES.map(sale => (
                            <div key={sale.id} className="flex items-center justify-between p-4 border rounded-lg">
                                <div>
                                    <div className="font-medium">{sale.id}</div>
                                    <div className="text-sm text-muted-foreground">{sale.customer} &bull; {sale.date}</div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <Badge variant={sale.status === 'completed' ? 'default' : 'destructive'} className="capitalize">{sale.status}</Badge>
                                    <div className="font-bold w-20 text-right">${sale.total.toFixed(2)}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
