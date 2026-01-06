"use client";

import React, { useState, useMemo } from 'react';

import { Input } from '@/components/ui/input';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from '@/components/ui/badge';
import { Button } from "@/components/ui/button";
import { Loader2, Search, Check, Package, ShoppingCart, Users, Settings, Building2, TrendingUp, Shield, Warehouse, ShoppingBag, Globe, Truck, FileText, MessageSquare, Megaphone, BoxIcon, CreditCard, Monitor, Briefcase } from 'lucide-react';
import { useGetPermissionResourcesQuery, useGetPermissionsQuery } from "@/redux/api/iam/roleApi";

interface PermissionSelectorSharedProps {
    selectedPermissionIds: string[];
    onTogglePermission: (id: string) => void;
    disabled?: boolean;
    showSelectAll?: boolean;
    rolePermissionIds?: string[];
    rolePermissionCounts?: Record<string, number>;
    gridCols?: 2 | 3;
    allowedResources?: string[];
}

// Helper to map resource to icon
const getResourceIcon = (resource: string) => {
    const iconMap: Record<string, any> = {
        product: Package,
        category: BoxIcon,
        order: ShoppingCart,
        customer: Users,
        user: Users,
        role: Shield,
        permission: Settings,
        business: Building2,
        outlet: Building2,
        warehouse: Warehouse,
        inventory: Warehouse,
        purchase: ShoppingBag,
        sale: ShoppingCart,
        payment: CreditCard,
        expense: CreditCard,
        report: TrendingUp,
        setting: Settings,
        platform: Globe,
        delivery: Truck,
        invoice: FileText,
        notification: MessageSquare,
        campaign: Megaphone,
        pos: Monitor,
        hrm: Briefcase,
    };

    const lowerResource = resource.toLowerCase();
    for (const key in iconMap) {
        if (lowerResource.includes(key)) {
            return iconMap[key];
        }
    }
    return Package;
};

export const PermissionSelectorShared = React.memo(({
    selectedPermissionIds,
    onTogglePermission,
    disabled = false,
    showSelectAll = true,
    rolePermissionIds = [],
    rolePermissionCounts = {},
    gridCols = 3,
    allowedResources
}: PermissionSelectorSharedProps) => {
    const [permissionSearchQuery, setPermissionSearchQuery] = useState("");
    const [selectedResource, setSelectedResource] = useState<string>("");

    // Fetch resources and permissions
    const { data: resourcesData, isLoading: isResourcesLoading } = useGetPermissionResourcesQuery(undefined);
    const { data: permissionsData, isLoading: isPermsLoading, isFetching: isPermsFetching } = useGetPermissionsQuery({
        resource: (!permissionSearchQuery && selectedResource) || undefined,
        search: permissionSearchQuery || undefined
    });

    // FIRST: Parse permissions data (needed by resourceList for sorting)
    const permissions = useMemo(() => {
        const perms = Array.isArray(permissionsData)
            ? permissionsData
            : permissionsData?.result || permissionsData?.data || [];

        // Filter by resource if selected
        let filtered = perms;

        // CRITICAL: Strictly enforce allowedResources first (security/scoping)
        if (allowedResources && allowedResources.length > 0) {
            filtered = filtered.filter((p: any) =>
                allowedResources.includes(p.resource) ||
                allowedResources.includes(p.resource.toLowerCase())
            );
        }

        // Then apply selection filter if searching isn't active
        if (selectedResource && !permissionSearchQuery) {
            filtered = filtered.filter((p: any) => p.resource === selectedResource);
        }

        // Create a copy before sorting (RTK Query data is immutable)
        const permissionsCopy = [...filtered];

        // Sort: Role permissions first, then others
        return permissionsCopy.sort((a: any, b: any) => {
            const aFromRole = rolePermissionIds.includes(a._id);
            const bFromRole = rolePermissionIds.includes(b._id);

            if (aFromRole && !bFromRole) return -1;
            if (!aFromRole && bFromRole) return 1;
            return 0; // Keep original order for same category
        });
    }, [permissionsData, selectedResource, permissionSearchQuery, rolePermissionIds]);

    // SECOND: Parse and sort resource list (depends on permissions above)
    const resourceList = useMemo(() => {
        // Handle different response formats
        let resources = [];

        if (allowedResources && allowedResources.length > 0) {
            resources = allowedResources;
        } else if (Array.isArray(resourcesData)) {
            resources = resourcesData;
        } else {
            resources = resourcesData?.result || resourcesData?.data || [];
        }

        // Sort: Modules with role permissions first, then alphabetically
        return [...resources].sort((a: string, b: string) => {
            // Case-insensitive lookup for robustness
            const countA = rolePermissionCounts[a] || rolePermissionCounts[a.toLowerCase()] || 0;
            const countB = rolePermissionCounts[b] || rolePermissionCounts[b.toLowerCase()] || 0;

            // Primary sort: Has role permissions (descending count)
            if (countA > 0 && countB === 0) return -1;
            if (countA === 0 && countB > 0) return 1;
            if (countA !== countB) return countB - countA;

            // Secondary sort: Alphabetical
            return a.localeCompare(b);
        });
    }, [resourcesData, rolePermissionCounts]);

    // Set first resource as default or when sorting changes (role selection)
    React.useEffect(() => {
        if (resourceList.length > 0) {
            // Initial selection
            if (!selectedResource) {
                setSelectedResource(resourceList[0]);
            }
            // Auto-select top module when role context changes (indicated by rolePermissionCounts update)
            // We use a specific check to avoid overriding user navigation unless the context strictly changed
            else if (rolePermissionCounts && Object.keys(rolePermissionCounts).length > 0) {
                // But wait, checking usage of rolePermissionCounts in this effect might be tricky if reference is unstable.
                // However, we assume parent passes stable reference.
                // To be safe, we only force update if the top sorted module is DIFFERENT from current (and it's a role permission module)
                const topModule = resourceList[0];
                const topCount = rolePermissionCounts[topModule] || rolePermissionCounts[topModule.toLowerCase()] || 0;
                if (topCount > 0 && selectedResource !== topModule) {
                    setSelectedResource(topModule);
                }
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [resourceList, rolePermissionCounts]);

    // Filter modules based on search
    const filteredModules = useMemo(() => {
        if (!permissionSearchQuery) return resourceList;

        const searchLower = permissionSearchQuery.toLowerCase();

        return resourceList.filter((resource: string) => {
            if (resource.toLowerCase().includes(searchLower)) return true;

            const modulePermissions = permissions.filter((p: any) => p.resource === resource);
            return modulePermissions.some((perm: any) =>
                perm.action?.toLowerCase().includes(searchLower) ||
                perm.description?.toLowerCase().includes(searchLower)
            );
        });
    }, [resourceList, permissionSearchQuery, permissions]);

    const handleSelectAll = () => {
        const allSelected = permissions.every((p: any) => selectedPermissionIds.includes(p._id));
        permissions.forEach((p: any) => {
            if (allSelected && selectedPermissionIds.includes(p._id)) {
                onTogglePermission(p._id);
            } else if (!allSelected && !selectedPermissionIds.includes(p._id)) {
                onTogglePermission(p._id);
            }
        });
    };

    return (
        <div className="flex-1 overflow-hidden flex flex-col">
            {/* Search Bar */}
            <div className="p-4 border-b bg-background">
                <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search permissions..."
                        className="pl-8 h-9"
                        value={permissionSearchQuery}
                        onChange={(e) => setPermissionSearchQuery(e.target.value)}
                        disabled={disabled}
                    />
                </div>
            </div>

            <div className="flex-1 overflow-hidden flex bg-muted/10">
                {/* --- 1. Resource Sidebar (Modules) --- */}
                <div className="w-48 sm:w-52 border-r bg-background flex flex-col overflow-hidden" style={{ height: '600px' }}>
                    <div className="p-3 border-b font-medium text-xs text-muted-foreground bg-muted/10">
                        Modules ({filteredModules?.length || 0})
                    </div>
                    <ScrollArea className="flex-1 h-full">
                        <div className="p-2 space-y-1">
                            {isResourcesLoading ? (
                                <div className="p-4 text-center text-xs text-muted-foreground">Loading modules...</div>
                            ) : (
                                filteredModules?.map((resource: string) => {
                                    const ModuleIcon = getResourceIcon(resource);
                                    const isActive = selectedResource === resource;

                                    // Count role permissions in this module (case insensitive)
                                    const rolePermCount = rolePermissionCounts[resource] || rolePermissionCounts[resource.toLowerCase()] || 0;

                                    return (
                                        <button
                                            type="button"
                                            key={resource}
                                            onClick={() => setSelectedResource(resource)}
                                            disabled={disabled}
                                            className={`
                                                w-full flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors text-left
                                                ${isActive
                                                    ? 'bg-primary/10 text-primary font-medium'
                                                    : rolePermCount > 0
                                                        ? 'bg-purple-50/50 dark:bg-purple-950/20 text-foreground hover:bg-purple-100/50'
                                                        : 'hover:bg-muted text-muted-foreground hover:text-foreground'}
                                                ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
                                            `}
                                        >
                                            <ModuleIcon className={`h-4 w-4 ${isActive ? 'text-primary' : rolePermCount > 0 ? 'text-purple-600' : 'text-muted-foreground'}`} />
                                            <span className="truncate capitalize flex-1">{resource}</span>
                                            {rolePermCount > 0 && (
                                                <Badge variant="secondary" className="text-[9px] h-4 px-1.5 ml-auto bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300">
                                                    {rolePermCount}
                                                </Badge>
                                            )}
                                        </button>
                                    )
                                })
                            )}
                        </div>
                    </ScrollArea>
                </div>

                {/* --- 2. Permissions Content (Right Side) --- */}
                <div className="flex-1 flex flex-col overflow-hidden" style={{ height: '600px' }}>
                    {/* Header for selected module */}
                    <div className="px-4 py-2 border-b bg-background flex items-center justify-between shadow-sm z-10">
                        <div className="flex items-center gap-2">
                            <div className="p-1.5 bg-primary/10 rounded-md">
                                {(() => {
                                    const Icon = getResourceIcon(selectedResource || '');
                                    return <Icon className="h-5 w-5 text-primary" />;
                                })()}
                            </div>
                            <div>
                                <h3 className="font-semibold capitalize text-lg leading-none">
                                    {permissionSearchQuery ? `Search Results: "${permissionSearchQuery}"` : selectedResource}
                                </h3>
                                <p className="text-xs text-muted-foreground mt-1">
                                    {isPermsLoading
                                        ? 'Loading permissions...'
                                        : `${permissions?.length || 0} permissions available`
                                    }
                                </p>
                            </div>
                        </div>

                        {showSelectAll && !disabled && permissions.length > 0 && (
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={handleSelectAll}
                                className="h-8"
                            >
                                {permissions.every((p: any) => selectedPermissionIds?.includes(p._id))
                                    ? 'Deselect Module'
                                    : 'Select Module'
                                }
                            </Button>
                        )}
                    </div>

                    {/* Permissions Grid */}
                    <div className="flex-1 overflow-auto p-6 bg-muted/5 h-full">
                        {isPermsLoading || isPermsFetching ? (
                            <div className="flex h-full items-center justify-center">
                                <Loader2 className="h-8 w-8 animate-spin text-primary/50" />
                            </div>
                        ) : (
                            <div className={`grid grid-cols-1 sm:grid-cols-2 ${gridCols === 3 ? 'xl:grid-cols-3' : ''} gap-3`}>
                                {permissions.length === 0 ? (
                                    <div className="col-span-full py-10 text-center text-muted-foreground">
                                        No permissions found for this module.
                                    </div>
                                ) : (
                                    permissions.map((perm: any) => {
                                        const isSelected = selectedPermissionIds?.includes(perm._id);
                                        const isFromRole = rolePermissionIds.includes(perm._id);

                                        return (
                                            <div
                                                key={perm._id}
                                                onClick={() => !disabled && onTogglePermission(perm._id)}
                                                className={`
                                                    flex items-start space-x-3 p-3 rounded-xl border text-sm transition-all duration-200
                                                    ${isSelected
                                                        ? 'bg-card border-primary/40 shadow-sm'
                                                        : isFromRole
                                                            ? 'bg-purple-50/50 border-purple-200/50 dark:bg-purple-950/20 dark:border-purple-800/30'
                                                            : 'bg-card/50 border-transparent hover:border-border hover:bg-card'}
                                                    ${disabled ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'}
                                                `}
                                            >
                                                <div className={`
                                                    mt-0.5 h-5 w-5 rounded-md border flex items-center justify-center transition-all duration-200 shrink-0
                                                    ${isSelected ? 'bg-primary border-primary text-primary-foreground shadow-sm' : 'border-muted-foreground/30 bg-background'}
                                                `}>
                                                    {isSelected && <Check className="h-3.5 w-3.5" />}
                                                </div>
                                                <div className="flex flex-col gap-0.5">
                                                    <div className="flex items-center gap-2 flex-wrap">
                                                        <span className={`font-medium ${isSelected ? 'text-foreground' : 'text-muted-foreground'}`}>
                                                            {perm.action.replace(/_/g, ' ').toUpperCase()}
                                                        </span>
                                                        {isFromRole && (
                                                            <Badge variant="secondary" className="text-[9px] h-4 px-1.5 font-normal bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300">
                                                                From Role
                                                            </Badge>
                                                        )}
                                                    </div>
                                                    <span className="text-xs text-muted-foreground/70 leading-relaxed line-clamp-2">
                                                        {perm.description}
                                                    </span>

                                                    {/* Tags */}
                                                    {(perm.scope || perm.operator) && (
                                                        <div className="flex flex-wrap gap-1.5 mt-2">
                                                            {perm.scope && (
                                                                <Badge variant="secondary" className="text-[10px] h-5 py-0 px-1.5 font-normal bg-blue-50 text-blue-700 hover:bg-blue-100">
                                                                    {perm.scope}
                                                                </Badge>
                                                            )}
                                                            {perm.operator && (
                                                                <Badge variant="secondary" className="text-[10px] h-5 py-0 px-1.5 font-normal bg-orange-50 text-orange-700 hover:bg-orange-100">
                                                                    {perm.operator}
                                                                </Badge>
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div >
    );
});

PermissionSelectorShared.displayName = 'PermissionSelectorShared';
