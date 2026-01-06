"use client";

import React, { useState, useMemo } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from '@/components/ui/badge';
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Loader2, Search, ChevronDown, ChevronRight } from 'lucide-react';
import { useGetPermissionGroupsQuery } from "@/redux/api/iam/roleApi";

interface DirectPermissionSelectorProps {
    selectedPermissionIds: string[];
    onTogglePermission: (id: string) => void;
    onToggleGroup: (resource: string, ids: string[], allSelected: boolean) => void;
    rolePermissionGroupIds?: string[];
}

const DirectPermissionSelector = React.memo(({
    selectedPermissionIds,
    onTogglePermission,
    onToggleGroup,
    rolePermissionGroupIds = []
}: DirectPermissionSelectorProps) => {
    const [permSearch, setPermSearch] = useState("");
    const [expandedGroup, setExpandedGroup] = useState<string | null>(null);

    const { data: permissionGroupsData, isLoading } = useGetPermissionGroupsQuery({ limit: 1000 });

    const permissionGroups = useMemo(() => {
        return Array.isArray(permissionGroupsData)
            ? permissionGroupsData
            : (permissionGroupsData as any)?.data?.result || (permissionGroupsData as any)?.data || permissionGroupsData?.result || [];
    }, [permissionGroupsData]);

    const sortedGroups = useMemo(() => {
        let filtered = permissionGroups.filter((pg: any) =>
            pg.name?.toLowerCase().includes(permSearch.toLowerCase()) ||
            pg.description?.toLowerCase().includes(permSearch.toLowerCase())
        );

        return filtered.sort((a: any, b: any) => {
            const aMatched = rolePermissionGroupIds.includes(a._id || a.id);
            const bMatched = rolePermissionGroupIds.includes(b._id || b.id);

            if (aMatched && !bMatched) return -1;
            if (!aMatched && bMatched) return 1;
            return (a.name || '').localeCompare(b.name || '');
        });
    }, [permissionGroups, permSearch, rolePermissionGroupIds]);

    const toggleGroupExpansion = (groupId: string) => {
        setExpandedGroup(prev => prev === groupId ? null : groupId);
    };

    const handleGroupToggle = (group: any) => {
        const permissionIds = (group.permissions || []).map((p: any) => p._id || p.id || p);
        const allSelected = permissionIds.every((id: string) => selectedPermissionIds.includes(id));
        onToggleGroup(group.name, permissionIds, allSelected);
    };

    return (
        <div className="space-y-3">
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-base font-semibold">Direct Permission Overrides</h3>
                    <p className="text-xs text-muted-foreground">
                        Grant specific permissions by group. Groups from assigned roles are highlighted.
                    </p>
                </div>
                <div className="w-[250px]">
                    <div className="relative">
                        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search groups..."
                            value={permSearch}
                            onChange={(e) => setPermSearch(e.target.value)}
                            className="pl-8 h-9"
                        />
                    </div>
                </div>
            </div>

            <ScrollArea className="h-[700px] pr-3 border rounded-md bg-muted/10 p-3">
                {isLoading ? (
                    <div className="text-center py-10">
                        <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {sortedGroups.map((group: any, index: number) => {
                            const groupId = group._id || group.id;
                            const uniqueKey = `${groupId}-${index}`;
                            const isExpanded = expandedGroup === uniqueKey;
                            const isMatched = rolePermissionGroupIds.includes(groupId);

                            const permissionIds = (group.permissions || []).map((p: any) => {
                                if (typeof p === 'string') return p;
                                return p._id || p.id || p;
                            });

                            const selectedCount = permissionIds.filter((id: string) =>
                                selectedPermissionIds.includes(id)
                            ).length;
                            const totalCount = permissionIds.length;
                            const allSelected = totalCount > 0 && selectedCount === totalCount;

                            return (
                                <Card
                                    key={uniqueKey}
                                    className={`transition-all ${isMatched
                                            ? 'border-primary/50 bg-primary/5 shadow-sm'
                                            : 'border-muted'
                                        }`}
                                >
                                    <CardHeader className="py-0 px-3">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2 flex-1 min-w-0">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="h-5 w-5 p-0 shrink-0"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        toggleGroupExpansion(uniqueKey);
                                                    }}
                                                >
                                                    {isExpanded ? (
                                                        <ChevronDown className="h-3 w-3" />
                                                    ) : (
                                                        <ChevronRight className="h-3 w-3" />
                                                    )}
                                                </Button>

                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center gap-1.5 flex-wrap">
                                                        <CardTitle className="text-sm font-semibold truncate">
                                                            {group.name}
                                                        </CardTitle>
                                                        {isMatched && (
                                                            <Badge variant="secondary" className="text-[9px] h-4 px-1.5 shrink-0">
                                                                Role
                                                            </Badge>
                                                        )}
                                                        <Badge variant="outline" className="text-[9px] h-4 px-1.5 shrink-0">
                                                            {selectedCount}/{totalCount}
                                                        </Badge>
                                                    </div>
                                                    {group.description && (
                                                        <p className="text-[10px] text-muted-foreground mt-0.5 line-clamp-1">
                                                            {group.description}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>

                                            <Checkbox
                                                checked={allSelected}
                                                onCheckedChange={() => handleGroupToggle(group)}
                                                className="h-4 w-4 shrink-0 ml-2"
                                            />
                                        </div>
                                    </CardHeader>

                                    {isExpanded && (
                                        <CardContent className="pt-0 pb-2 px-3">
                                            <div className="grid gap-1.5 pl-7">
                                                {(group.permissions || []).map((perm: any) => {
                                                    const permId = typeof perm === 'string' ? perm : (perm._id || perm.id);
                                                    const permName = typeof perm === 'string' ? perm : (perm.id || perm.name);
                                                    const permDesc = typeof perm === 'object' ? perm.description : '';

                                                    return (
                                                        <div
                                                            key={permId}
                                                            className="flex items-start space-x-2 p-1.5 rounded-md hover:bg-muted/50 transition-colors border border-transparent hover:border-border"
                                                        >
                                                            <Checkbox
                                                                id={`perm-${permId}`}
                                                                checked={selectedPermissionIds.includes(permId)}
                                                                onCheckedChange={() => onTogglePermission(permId)}
                                                                className="mt-0.5 h-3.5 w-3.5"
                                                            />
                                                            <div className="grid gap-0.5 leading-none flex-1 min-w-0">
                                                                <label
                                                                    htmlFor={`perm-${permId}`}
                                                                    className="text-xs font-medium cursor-pointer truncate"
                                                                >
                                                                    {permName}
                                                                </label>
                                                                {permDesc && (
                                                                    <p className="text-[9px] text-muted-foreground line-clamp-1">
                                                                        {permDesc}
                                                                    </p>
                                                                )}
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </CardContent>
                                    )}
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
