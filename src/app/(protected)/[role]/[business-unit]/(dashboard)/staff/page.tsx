"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const STAFF = [
    { id: 1, name: "Sarah Connor", role: "Store Manager", status: "Active" },
    { id: 2, name: "Kyle Reese", role: "Cashier", status: "Active" },
    { id: 3, name: "T-800", role: "Security", status: "On Leave" },
];

export default function StaffPage() {
    return (
        <div className="container mx-auto py-6 space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Staff Management</h1>
                <p className="text-muted-foreground">Manage employee shifts, roles, and performance.</p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {STAFF.map(s => (
                    <Card key={s.id}>
                        <CardHeader>
                            <div className="flex justify-between items-start">
                                <div>
                                    <CardTitle>{s.name}</CardTitle>
                                    <CardDescription>{s.role}</CardDescription>
                                </div>
                                <Badge variant={s.status === 'Active' ? 'default' : 'secondary'}>{s.status}</Badge>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-sm text-muted-foreground">
                                Schedule: 9:00 AM - 5:00 PM
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
