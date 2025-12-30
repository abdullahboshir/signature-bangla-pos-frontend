"use client";

import { DataPageLayout } from "@/components/shared/DataPageLayout";
import LedgerList from "@/components/modules/inventory/ledger/LedgerList";

export default function LedgerPage() {
    return (
        <DataPageLayout
            title="Stock Ledger"
            description="History of all stock movements"
        >
            <LedgerList />
        </DataPageLayout>
    );
}
