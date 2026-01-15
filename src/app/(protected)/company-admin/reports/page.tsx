"use client";

import { PageHeader } from "@/components/shared/PageHeader";

export default function CompanyReportsPage() {
    return (
        <div className="space-y-6">
            <PageHeader
                title="Company Reports"
                description="View and analyze company-wide reports and analytics"
            />
            <div className="p-6 bg-card rounded-lg border">
                <p className="text-muted-foreground">Reports coming soon...</p>
            </div>
        </div>
    );
}
