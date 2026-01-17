
import { Plug, Construction } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { PageHeader } from "@/components/shared/PageHeader";

export default function ModuleRegistryPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Module Registry & Feature Flags"
        description="Manage system modules and toggle feature flags."
        icon={Plug}
      />
      
      <Alert className="bg-blue-50/50 border-blue-200 text-blue-800 dark:bg-blue-950/20 dark:border-blue-800 dark:text-blue-300">
        <Construction className="h-4 w-4" />
        <AlertTitle>Under Construction</AlertTitle>
        <AlertDescription>
           This module is currently being implemented. You will soon be able to toggle system modules (e.g., POS, CRM, Logistics) and manage granular feature flags from this centralized registry.
        </AlertDescription>
      </Alert>

      <div className="p-12 border-2 border-dashed rounded-lg flex flex-col items-center justify-center text-muted-foreground bg-muted/5">
        <Plug className="h-16 w-16 mb-4 opacity-10" />
        <h3 className="text-xl font-medium tracking-tight">System Module Registry</h3>
        <p className="max-w-md text-center mt-2 text-sm text-muted-foreground/80">
           Centralized control plane for platform capabilities.
        </p>
      </div>
    </div>
  );
}
