"use client";

import { DynamicDataTable } from "@/components/data-display/tables/DaynamicDataTable"

const CUSTOMERS = [
    {
        id: "1",
        name: "Alice Johnson",
        email: "alice@example.com",
        phone: "+1 234 567 8901",
        orderCount: 15,
        totalSpent: 1200.00,
        createdAt: "2023-01-15T00:00:00Z",
        status: "active"
    },
    {
        id: "2",
        name: "Bob Smith",
        email: "bob@example.com",
        phone: "+1 234 567 8902",
        orderCount: 8,
        totalSpent: 850.50,
        createdAt: "2023-02-20T00:00:00Z",
        status: "active"
    },
    {
        id: "3",
        name: "Charlie Davis",
        email: "charlie@example.com",
        phone: "+1 234 567 8903",
        orderCount: 22,
        totalSpent: 2300.25,
        createdAt: "2023-03-10T00:00:00Z",
        status: "inactive"
    },
];

export default function CustomersPage() {
    return (
        <div className="container mx-auto py-6 space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Customers</h1>
                <p className="text-muted-foreground">Manage customer profiles and loyalty programs.</p>
            </div>

            <DynamicDataTable
                dataType="customer"
                data={CUSTOMERS}
                total={CUSTOMERS.length}
                onCreate={() => console.log('Create Customer')}
                onEdit={(item) => console.log('Edit Customer', item)}
                onDelete={(item) => console.log('Delete Customer', item)}
                onView={(item) => console.log('View Customer', item)}
                config={{
                    showToolbar: true,
                    toolbar: { placeholder: "Search customers..." }
                }}
            />
        </div>
    );
}
