"use client";
import { DataPageLayout } from "@/components/shared/DataPageLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function FinancePage() {
    return (
        <DataPageLayout
            title="Finance Dashboard"
            description="Overview of financial metrics and transactions."
        >
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Card>
                    <CardHeader>
                        <CardTitle>Coming Soon</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground">Financial reports and payout modules are currently under development.</p>
                    </CardContent>
                </Card>
            </div>
        </DataPageLayout>
    );
}
