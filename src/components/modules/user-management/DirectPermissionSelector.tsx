"use client";

import React, { useState, useMemo } from 'react';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from '@/components/ui/badge';
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Loader2, Search, Package, ShoppingCart, Monitor, FileText, Users, Shield, Building2, Settings, BoxIcon, Warehouse, CreditCard, Megaphone, TrendingUp, MessageSquare, Truck, Globe } from 'lucide-react';
import { useGetPermissionsQuery } from "@/redux/api/iam/roleApi";
import { RESOURCE_KEYS } from "@/config/permission-keys";

// Helper to map resource to icon
const getResourceIcon = (resource: string) => {
    switch (resource) {
        case RESOURCE_KEYS.PRODUCT: case RESOURCE_KEYS.CATEGORY: case RESOURCE_KEYS.BRAND: case RESOURCE_KEYS.ATTRIBUTE: case RESOURCE_KEYS.UNIT:
            return Package;
        case RESOURCE_KEYS.ORDER: case RESOURCE_KEYS.RETURN: case RESOURCE_KEYS.CART:
            return ShoppingCart;
        case RESOURCE_KEYS.TERMINAL: case RESOURCE_KEYS.CASH_REGISTER:
            return Monitor;
        case RESOURCE_KEYS.INVOICE:
            return FileText;
        case RESOURCE_KEYS.USER: case RESOURCE_KEYS.STAFF: case RESOURCE_KEYS.ATTENDANCE: case RESOURCE_KEYS.PAYROLL: case RESOURCE_KEYS.LEAVE: case RESOURCE_KEYS.DESIGNATION: case RESOURCE_KEYS.DEPARTMENT:
            return Users;
        case RESOURCE_KEYS.ROLE: case RESOURCE_KEYS.PERMISSION:
            return Shield;
        case RESOURCE_KEYS.BUSINESS_UNIT: case RESOURCE_KEYS.OUTLET:
            return Building2;
        case RESOURCE_KEYS.SYSTEM:
            return Settings;
        case RESOURCE_KEYS.INVENTORY: case RESOURCE_KEYS.PURCHASE: case RESOURCE_KEYS.SUPPLIER: case RESOURCE_KEYS.TRANSFER: case RESOURCE_KEYS.ADJUSTMENT:
            return BoxIcon;
        case RESOURCE_KEYS.WAREHOUSE:
            return Warehouse;
        case RESOURCE_KEYS.PAYMENT: case RESOURCE_KEYS.EXPENSE: case RESOURCE_KEYS.EXPENSE_CATEGORY: case RESOURCE_KEYS.BUDGET: case RESOURCE_KEYS.ACCOUNT: case RESOURCE_KEYS.TRANSACTION: case RESOURCE_KEYS.SETTLEMENT: case RESOURCE_KEYS.PAYOUT:
            return CreditCard;
        case RESOURCE_KEYS.STOREFRONT: case RESOURCE_KEYS.AD_CAMPAIGN: case RESOURCE_KEYS.PROMOTION: case RESOURCE_KEYS.COUPON: case RESOURCE_KEYS.AFFILIATE: case RESOURCE_KEYS.LOYALTY: case RESOURCE_KEYS.PIXEL: case RESOURCE_KEYS.AUDIENCE:
            return Megaphone;
        case RESOURCE_KEYS.CONTENT: case RESOURCE_KEYS.LANDING_PAGE: case RESOURCE_KEYS.EMAIL_TEMPLATE: case RESOURCE_KEYS.SMS_TEMPLATE:
            return FileText;
        case RESOURCE_KEYS.REPORT: case RESOURCE_KEYS.ANALYTICS: case RESOURCE_KEYS.SALES_REPORT: case RESOURCE_KEYS.PURCHASE_REPORT: case RESOURCE_KEYS.STOCK_REPORT: case RESOURCE_KEYS.PROFIT_LOSS_REPORT: case RESOURCE_KEYS.AUDIT_LOG:
            return TrendingUp;
        case RESOURCE_KEYS.TICKET: case RESOURCE_KEYS.CHAT: case RESOURCE_KEYS.DISPUTE: case RESOURCE_KEYS.QUESTION:
            return MessageSquare;
        case RESOURCE_KEYS.SHIPPING: case RESOURCE_KEYS.DELIVERY: case RESOURCE_KEYS.COURIER: case RESOURCE_KEYS.PARCEL:
            return Truck;
        case RESOURCE_KEYS.FRAUD_DETECTION: case RESOURCE_KEYS.BLACKLIST: case RESOURCE_KEYS.RISK_RULE: case RESOURCE_KEYS.RISK_PROFILE:
            return Shield;
        default:
            return Shield;
    }
};

interface DirectPermissionSelectorProps {
    selectedPermissionIds: string[];
    onTogglePermission: (id: string) => void;
    onToggleGroup: (resource: string, ids: string[], allSelected: boolean) => void;
}

const DirectPermissionSelector = React.memo(({ selectedPermissionIds, onTogglePermission, onToggleGroup }: DirectPermissionSelectorProps) => {
    const [permSearch, setPermSearch] = useState("");

    // Fetch permissions internally to decouple from parent re-renders
    const { data: permissionsData, isLoading: isLoadingPerms } = useGetPermissionsQuery({ limit: 5000 });

    const allPermissions = useMemo(() => {
        return Array.isArray(permissionsData)
            ? permissionsData
            : ((permissionsData as any)?.result || permissionsData?.data || []);
    }, [permissionsData]);

    // Filter permissions
    const filteredPermissions = useMemo(() => {
        return allPermissions.filter((p: any) =>
            p.id.toLowerCase().includes(permSearch.toLowerCase()) ||
            p.description?.toLowerCase().includes(permSearch.toLowerCase()) ||
            p.resource?.toLowerCase().includes(permSearch.toLowerCase())
        );
    }, [allPermissions, permSearch]);

    // Group permissions
    const groupedPermissions = useMemo(() => {
        return filteredPermissions.reduce((acc: any, perm: any) => {
            const resource = perm.resource || 'Other';
            if (!acc[resource]) {
                acc[resource] = [];
            }
            acc[resource].push(perm);
            return acc;
        }, {} as Record<string, any[]>);
    }, [filteredPermissions]);

    const handleGroupToggle = (resource: string) => {
        const permsInGroup = groupedPermissions[resource] || [];
        const idsInGroup = permsInGroup.map((p: any) => p._id);
        const allSelected = idsInGroup.every((id: string) => selectedPermissionIds.includes(id));
        onToggleGroup(resource, idsInGroup, allSelected);
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-xl font-bold tracking-tight">Direct Permission Overrides</h3>
                    <p className="text-sm text-muted-foreground">Grant specific exceptional permissions (grouped by resource).</p>
                </div>
                <div className="w-[300px]">
                    <div className="relative">
                        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search permissions..."
                            value={permSearch}
                            onChange={(e) => setPermSearch(e.target.value)}
                            className="pl-8"
                        />
                    </div>
                </div>
            </div>

            <ScrollArea className="h-[800px] pr-4 border rounded-md bg-muted/10 p-2">
                {isLoadingPerms ? (
                    <div className="text-center py-10"><Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" /></div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {(Object.entries(groupedPermissions) as [string, any[]][]).map(([resource, perms]) => {
                            const Icon = getResourceIcon(resource);
                            const allSelected = perms.every(p => selectedPermissionIds.includes(p._id));

                            const displayName = resource.replace(/_/g, " ").toUpperCase();

                            return (
                                <Card key={resource} className="flex flex-col overflow-hidden border-muted shadow-sm hover:shadow-md transition-shadow">
                                    <CardHeader className="bg-muted/30 py-3 px-4 flex flex-row items-center justify-between space-y-0">
                                        <div className="flex items-center gap-2">
                                            <div className="p-1.5 bg-primary/10 rounded-md">
                                                <Icon className="h-4 w-4 text-primary" />
                                            </div>
                                            <CardTitle className="text-base font-semibold">{displayName}</CardTitle>
                                            <Badge variant="secondary" className="text-[10px] h-5">{perms.length}</Badge>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Checkbox
                                                id={`group-${resource}`}
                                                checked={allSelected}
                                                onCheckedChange={() => handleGroupToggle(resource)}
                                            />
                                        </div>
                                    </CardHeader>

                                    <div className="p-3 grid gap-2">
                                        {perms.map((perm: any) => (
                                            <div key={perm._id} className="flex items-start space-x-2 p-2 rounded-md hover:bg-muted/50 transition-colors border border-transparent hover:border-border">
                                                <Checkbox
                                                    id={`perm-${perm._id}`}
                                                    checked={selectedPermissionIds.includes(perm._id)}
                                                    onCheckedChange={() => onTogglePermission(perm._id)}
                                                    className="mt-0.5"
                                                />
                                                <div className="grid gap-0.5 leading-none">
                                                    <Label
                                                        htmlFor={`perm-${perm._id}`}
                                                        className="text-sm font-medium cursor-pointer"
                                                    >
                                                        {perm.id}
                                                    </Label>
                                                    <p className="text-[10px] text-muted-foreground line-clamp-1" title={perm.description}>
                                                        {perm.description || "No description"}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </Card>
                            );
                        })}
                    </div>
                )}
            </ScrollArea>
        </div>
    );
});

DirectPermissionSelector.displayName = 'DirectPermissionSelector';

export { DirectPermissionSelector };
