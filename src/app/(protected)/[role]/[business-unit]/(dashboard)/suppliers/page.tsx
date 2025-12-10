"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mail, Phone } from "lucide-react";

const SUPPLIERS = [
    { id: 1, name: "MegaCorp Distributors", contact: "John Supplier", email: "orders@megacorp.com", phone: "+1 555-0123" },
    { id: 2, name: "Local Farms Inc.", contact: "Jane Farmer", email: "fresh@localfarms.com", phone: "+1 555-0456" },
    { id: 3, name: "TechGadgets Wholesale", contact: "Mike Tech", email: "support@techgadgets.com", phone: "+1 555-0789" },
];

export default function SuppliersPage() {
    return (
        <div className="container mx-auto py-6 space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Suppliers</h1>
                <p className="text-muted-foreground">Manage supplier relationships and orders.</p>
            </div>

            <div className="grid gap-4">
                {SUPPLIERS.map(supplier => (
                    <Card key={supplier.id}>
                        <CardHeader>
                            <CardTitle>{supplier.name}</CardTitle>
                            <CardDescription>Contact: {supplier.contact}</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex gap-4">
                                <Button variant="outline" size="sm">
                                    <Mail className="mr-2 h-4 w-4" />
                                    {supplier.email}
                                </Button>
                                <Button variant="outline" size="sm">
                                    <Phone className="mr-2 h-4 w-4" />
                                    {supplier.phone}
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
