"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

const INVENTORY_ITEMS = [
  { id: "INV-001", name: "Premium T-Shirt", stock: 150, capacity: 500, status: "good" },
  { id: "INV-002", name: "Denim Jeans", stock: 45, capacity: 100, status: "low" },
  { id: "INV-003", name: "Sneakers", stock: 12, capacity: 50, status: "critical" },
  { id: "INV-004", name: "Cap", stock: 89, capacity: 100, status: "good" },
];

export default function InventoryPage() {
  return (
    <div className="container mx-auto py-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Inventory Management</h1>
        <p className="text-muted-foreground">Monitor stock levels and manage warehouse operations.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {INVENTORY_ITEMS.map((item) => (
          <Card key={item.id}>
            <CardHeader className="pb-2">
              <div className="flex justify-between">
                <CardTitle className="text-sm font-medium">{item.name}</CardTitle>
                <Badge variant={item.status === 'good' ? 'default' : item.status === 'low' ? 'secondary' : 'destructive'}>
                  {item.status}
                </Badge>
              </div>
              <CardDescription className="text-xs">{item.id}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{item.stock} / {item.capacity}</div>
              <Progress value={(item.stock / item.capacity) * 100} className="mt-2 text-xs" />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
