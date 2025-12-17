"use client";

import { DataPageLayout } from "@/components/shared/DataPageLayout";
import { History } from "lucide-react";

export default function StockLedgerPage() {
    return (
        <DataPageLayout
            title="Stock Ledger"
            description="View history of stock movements and transactions."
        >
            <div className="flex flex-col items-center justify-center p-12 text-center border rounded-lg border-dashed min-h-[400px]">
                <div className="rounded-full bg-muted p-4 mb-4">
                    <History className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold">Under Construction</h3>
                <p className="text-sm text-muted-foreground max-w-sm mt-2">
                    This module is currently being developed.
                </p>
            </div>
        </DataPageLayout>
    );
}
