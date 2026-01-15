"use client";

import { PageHeader } from "@/components/shared/PageHeader";
import { Store } from "lucide-react";

export default function ShiftManagePage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Shift Management"
        description="Open and close cash registers and manage shifts."
        icon={Store}
      />
      <div className="p-8 text-center border-2 border-dashed rounded-lg text-muted-foreground">
        <h3 className="text-lg font-medium">Shift Management Interface</h3>
        <p>This module is under construction. It will allow opening/closing shifts.</p>
      </div>
    </div>
  );
}
