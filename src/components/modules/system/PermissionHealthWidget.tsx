"use client"

import { useEffect, useState, useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, AlertTriangle, Info, RefreshCw, BarChart } from "lucide-react"
import { useAuth } from "@/hooks/useAuth"
import { useCurrentRole } from "@/hooks/useCurrentRole"
import { getSidebarMenu } from "@/config/sidebar-menu"
import { useParams } from "next/navigation"

export default function PermissionHealthWidget() {
    const { user } = useAuth();
    const { currentRole } = useCurrentRole();
    const params = useParams();

    const [stats, setStats] = useState({
        backendCount: 0,
        sidebarCount: 0,
        uniqueResources: 0,
        discrepancy: 0,
        isHealthy: false
    });

    const businessUnit = (params["business-unit"] as string) || (params.businessUnit as string);

    // Re-run logic whenever user/role changes
    useEffect(() => {
        if (!user) return;

        // 1. Calculate Backend Unique Resources
        const uniqueRes = new Set<string>();
        if (user.effectivePermissions && Array.isArray(user.effectivePermissions)) {
            user.effectivePermissions.forEach((p: string) => {
                if (typeof p === 'string') {
                    const [resource] = p.split(':');
                    if (resource) uniqueRes.add(resource);
                }
            });
        }
        const backendUnique = uniqueRes.size;

        // 2. Calculate Sidebar Visible Items
        const rawMenu = getSidebarMenu(currentRole || 'dynamic', businessUnit);

        // We must replicate the *Filtering* logic from Sidebar.tsx here to get accurate counts
        // However, Sidebar.tsx logic relies on the recursive 'searchFilter' or 'permissionFilter' there.
        // Since we are validating *IF* the sidebar shows the right things based on permissions,
        // we should conceptually re-calculate what *SHOULD* be visible.

        // Actually, simply counting the 'menu items' returned by getSidebarMenu isn't enough because 
        // Sidebar.tsx *HIDES* items based on permissions.
        // If we want to audit "Visible Items", we must replicate the permission check logic.

        // 1. Use Effective Permissions from Backend (mirroring Sidebar.tsx)
        let aggregatedPermissions: any[] = [];
        if (user.effectivePermissions && Array.isArray(user.effectivePermissions)) {
            aggregatedPermissions = user.effectivePermissions;
        } else if (user.permissions && Array.isArray(user.permissions)) {
            aggregatedPermissions = user.permissions;
        }

        // Helper to check permission ( Robust Match )
        const hasPermission = (item: any) => {
            if (!item.resource) return true; // Default Public Items

            return aggregatedPermissions.some((p: any) => {
                if (!p) return false;

                // Normalize Item Config
                const itemResource = item.resource.toLowerCase();
                const itemAction = item.action ? item.action.toLowerCase() : null;

                // Support both String IDs (legacy/simple) and Object permissions
                let pStr = "";
                if (typeof p === 'string') {
                    pStr = p.toLowerCase();
                } else if (p.resource) {
                    // If p is an object { resource: "product", action: "create" }
                    const r = p.resource.toLowerCase();
                    const a = p.action ? p.action.toLowerCase() : "";

                    // Construct string representation for comparison or compare directly
                    // Simple direct check:
                    if (itemAction) {
                        return r === itemResource && (a === itemAction || a === '*');
                    }
                    return r === itemResource;
                }

                // String Match Logic (colon or underscore)
                if (itemAction) {
                    return pStr === `${itemResource}:${itemAction}` || pStr === `${itemResource}_${itemAction}` || pStr === `*`;
                }
                return pStr.startsWith(`${itemResource}:`) || pStr.startsWith(`${itemResource}_`) || pStr === itemResource;
            });
        };

        const countVisibleRecursive = (items: any[]): number => {
            return items.reduce((acc, item) => {
                // 1. Check if this item allows access
                const canAccess = hasPermission(item);
                if (!canAccess) return acc; // Skip if hidden

                // 2. If it has children, recurse (don't count parent if we only care about leaves)
                // User requested counting LEAF nodes only previously.
                if (item.children && item.children.length > 0) {
                    return acc + countVisibleRecursive(item.children);
                }

                // 3. It's a visible leaf
                return acc + 1;
            }, 0);
        };

        const visibleCount = countVisibleRecursive(rawMenu);

        // Discrepancy Logic
        const diff = visibleCount - backendUnique;

        // We know 5 is the "Magic Number" for current config (3 Default + 2 Shared)
        // But let's make it generic: Is it positive? 
        // Usually Sidebar > Permissions is normal due to Public items.
        // Permissions > Sidebar means we have unused permissions (also normal).

        setStats({
            backendCount: user.effectivePermissions?.length || 0,
            uniqueResources: backendUnique,
            sidebarCount: visibleCount,
            discrepancy: diff,
            isHealthy: diff === 5 // Specific check for this user's peace of mind
        });

    }, [user, currentRole, businessUnit]);

    if (!user) return null;

    return (
        <Card className="mb-6 border-l-4 border-l-blue-500 shadow-sm">
            <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                    <CardTitle className="text-lg flex items-center gap-2">
                        <BarChart className="h-5 w-5 text-blue-600" />
                        System Health & Permission Diagnostic
                    </CardTitle>
                    <Badge variant="outline" className={stats.isHealthy ? "border-green-500 text-green-600 dark:text-green-400" : "border-amber-500 text-amber-600 dark:text-amber-400"}>
                        {stats.isHealthy ? "System Healthy" : "Discrepancy Detected"}
                    </Badge>
                </div>
                <CardDescription>
                    Real-time analysis of your permissions vs. sidebar accessibility.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

                    {/* 1. Backend Stats */}
                    <div className="p-4 bg-muted/50 rounded-lg border">
                        <div className="text-sm text-muted-foreground mb-1">Unqiue Backend Resources</div>
                        <div className="text-2xl font-bold flex items-center gap-2">
                            {stats.uniqueResources}
                            <span className="text-xs font-normal text-muted-foreground">
                                (from {stats.backendCount} actions)
                            </span>
                        </div>
                    </div>

                    {/* 2. Sidebar Stats */}
                    <div className="p-4 bg-muted/50 rounded-lg border">
                        <div className="text-sm text-muted-foreground mb-1">Visible Sidebar Items</div>
                        <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                            {stats.sidebarCount}
                        </div>
                    </div>

                    {/* 3. Integration Status */}
                    <div className="p-4 bg-muted/50 rounded-lg border">
                        <div className="text-sm text-muted-foreground mb-1">Architecture Status</div>
                        <div className="flex items-center gap-2">
                            {stats.isHealthy ? (
                                <CheckCircle2 className="h-8 w-8 text-green-500" />
                            ) : (
                                <Info className="h-8 w-8 text-amber-500" />
                            )}
                            <div>
                                <div className="font-semibold">
                                    {stats.isHealthy ? "Perfect Match" : "Review Needed"}
                                </div>
                                <div className="text-xs text-muted-foreground">
                                    Delta: {stats.discrepancy > 0 ? `+${stats.discrepancy}` : stats.discrepancy} items
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Explanation Section */}
                <div className="mt-4 pt-4 border-t">
                    <Alert className={stats.isHealthy ? "bg-green-500/10 border-green-500/50 text-green-700 dark:text-green-300" : "bg-blue-500/10 border-blue-500/50 text-blue-700 dark:text-blue-300"}>
                        <Info className="h-4 w-4" />
                        <AlertTitle>{stats.isHealthy ? "Verified Architecture" : "Diagnostic Info"}</AlertTitle>
                        <AlertDescription className="text-xs mt-1">
                            Currently there are <strong>{stats.uniqueResources}</strong> resource groups allocated to you.
                            The sidebar displays <strong>{stats.sidebarCount}</strong> items.
                            The difference of <strong>{stats.discrepancy}</strong> corresponds to public items (Dashboard, Profile) and shared resource menus (Inventory, Catalog).
                        </AlertDescription>
                    </Alert>
                </div>
            </CardContent>
        </Card>
    )
}
