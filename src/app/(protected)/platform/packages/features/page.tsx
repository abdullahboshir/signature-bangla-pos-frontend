
import { ModuleToggleSettings } from "@/components/modules/settings/ModuleToggleSettings";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Flag } from "lucide-react";

export const metadata = {
    title: "Feature Flags | Platform Admin",
    description: "Manage global feature availability.",
};

export default function FeatureFlagsPage() {
    return (
        <div className="space-y-6">
            <div className="flex items-center gap-2">
                <Flag className="h-6 w-6 text-muted-foreground" />
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Feature Flags</h1>
                    <p className="text-muted-foreground">Toggle system-wide modules and capabilities.</p>
                </div>
            </div>

            <ModuleToggleSettings />
        </div>
    );
}
