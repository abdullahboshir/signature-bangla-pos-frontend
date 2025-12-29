"use client";
import { DataPageLayout } from "@/components/shared/DataPageLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ReportsPage() {
    return (
        <DataPageLayout
            title="Reports Dashboard"
            description="Aggregated business reports and analytics."
        >
            <div className="p-4 border border-dashed rounded-lg bg-muted/50 text-center">
                <h3 className="text-lg font-medium">Reports Module Loading...</h3>
                <p className="text-sm text-muted-foreground mt-2">Select a specific report type from the sidebar or wait for the aggregated dashboard in the next update.</p>
            </div>
        </DataPageLayout>
    );
}
