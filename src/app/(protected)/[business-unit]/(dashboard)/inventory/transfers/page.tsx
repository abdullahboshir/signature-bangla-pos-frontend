"use client"

import TransferList from "@/components/modules/inventory/TransferList"

export default function TransfersPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Stock Transfers</h1>
                <p className="text-muted-foreground">
                    Manage inventory transfers between warehouses.
                </p>
            </div>

            <TransferList />
        </div>
    )
}
