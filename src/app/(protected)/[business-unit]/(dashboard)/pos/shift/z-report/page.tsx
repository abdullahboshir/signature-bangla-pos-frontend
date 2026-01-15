"use client";

import { PageHeader } from "@/components/shared/PageHeader";
import { FileText } from "lucide-react";

export default function ZReportPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Z-Report"
        description="View and generate daily Z-Reports for reconciliation."
        icon={FileText}
      />
      <div className="p-8 text-center border-2 border-dashed rounded-lg text-muted-foreground">
        <h3 className="text-lg font-medium">Z-Report Interface</h3>
        <p>This module is under construction. It will display end-of-day reports.</p>
      </div>
    </div>
  );
}
