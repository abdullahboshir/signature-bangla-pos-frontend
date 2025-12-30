import { GlobalDataRetentionSettings } from "@/components/global/system/DataRetentionSettings";
import { PageHeader } from "@/components/shared/PageHeader";

export default function DataRetentionPage() {
    return (
        <div className="space-y-6">
            <PageHeader
                title="Data Retention Policies"
                description="Configure how long system data is retained before deletion."
            />
            <GlobalDataRetentionSettings />
        </div>
    );
}
