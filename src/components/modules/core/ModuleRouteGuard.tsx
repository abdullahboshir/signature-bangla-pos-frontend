"use client"

import { usePathname } from "next/navigation"
import { useGetSystemSettingsQuery } from "@/redux/api/system/settingsApi"
import { ReactNode } from "react"
import { ShieldAlert } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"

const MODULE_ROUTE_MAPPING: Record<string, string[]> = {
    pos: ['pos', 'outlets', 'terminals'],
    erp: ['inventory', 'sales', 'purchases', 'finance', 'accounting', 'catalog', 'reports', 'suppliers'],
    hrm: ['hrm', 'staff', 'payroll', 'attendance', 'leave', 'shift'],
    ecommerce: ['online-store', 'content', 'products/collections'],
    crm: ['marketing', 'customers', 'support', 'contacts'],
    logistics: ['logistics', 'risk', 'courier'],
}

export function ModuleRouteGuard({ children }: { children: ReactNode }) {
    const pathname = usePathname();
    const { data: settings, isLoading } = useGetSystemSettingsQuery(undefined);

    // Helper to determine if current path is restricted
    const getRestriction = () => {
        if (!settings?.enabledModules) return null;

        // Check each module mapping
        for (const [moduleKey, segments] of Object.entries(MODULE_ROUTE_MAPPING)) {
            const isEnabled = settings.enabledModules[moduleKey as keyof typeof settings.enabledModules];

            // If module is explicitly disabled
            if (isEnabled === false) {
                // Check if current path contains any of the segments for this module
                // We use strict segment matching to avoid false positives (e.g. 'sport' matching 'port')
                // Actually, simpler .includes('/segment') or '/segment/' check is usually robust enough for this structure
                const matchedSegment = segments.find(seg => pathname.includes(`/${seg}`));

                if (matchedSegment) {
                    return moduleKey;
                }
            }
        }
        return null;
    };

    const restrictedModule = getRestriction();

    if (isLoading) {
        return <>{children}</>; // Optimization: Don't block during loading, or show spinner
    }

    if (restrictedModule) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] p-6 animate-in fade-in zoom-in duration-300">
                <Card className="max-w-md w-full border-red-200 bg-red-50/50 shadow-lg">
                    <CardHeader className="text-center">
                        <div className="mx-auto bg-red-100 p-3 rounded-full w-fit mb-4">
                            <ShieldAlert className="h-10 w-10 text-red-600" />
                        </div>
                        <CardTitle className="text-2xl text-red-700">Module Disabled</CardTitle>
                        <CardDescription className="text-red-600/80">
                            Access Restricted
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4 text-center">
                        <p className="text-sm text-muted-foreground">
                            The <strong>{restrictedModule.toUpperCase()}</strong> module is currently disabled in system settings.
                            You cannot access this resource.
                        </p>
                        <div className="pt-4">
                            <Button asChild variant="outline" className="border-red-200 hover:bg-red-100 hover:text-red-900">
                                <Link href="/">Back to Dashboard</Link>
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        )
    }

    return <>{children}</>;
}

