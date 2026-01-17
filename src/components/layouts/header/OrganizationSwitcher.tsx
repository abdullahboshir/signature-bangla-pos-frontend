"use client";

import { useAuth } from "@/hooks/useAuth";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectSeparator,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Building2, Plus } from "lucide-react";
import { isSuperAdmin as checkIsSuperAdmin, isOrganizationOwner as checkIsOrganizationOwner } from "@/config/auth-constants";
import { useCurrentRole } from "@/hooks/useCurrentRole";

interface OrganizationSwitcherProps {
    currentCompanyId: string | null;
    companies: any[];
}

export function OrganizationSwitcher({ currentCompanyId, companies }: OrganizationSwitcherProps) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const { currentRole } = useCurrentRole();

    const { setActiveBusinessUnit } = useAuth();
    
    const isCompanyAdminRoute = pathname.startsWith('/organization');
    const isSuperAdminRole = checkIsSuperAdmin(currentRole);
    const isOrganizationOwnerRole = checkIsOrganizationOwner(currentRole) && !isSuperAdminRole;
    
    // Determine base path based on role
    const getBasePath = () => {
        if (isSuperAdminRole) return '/platform';
        if (isOrganizationOwnerRole || isCompanyAdminRoute) return '/organization';
        return '/platform';
    };
    
    const handleSwitchCompany = (companyId: string) => {
        const params = new URLSearchParams(searchParams.toString());
        const basePath = getBasePath();

        if (companyId === 'add-new') {
            router.push(`/platform/organizations/add`);
            return;
        }

        if (companyId === 'all') {
            // Explicitly clear BU context when returning to Platform Global
            setActiveBusinessUnit(null);
            localStorage.removeItem('active-business-unit');

            params.delete('organization');
            router.push(`${basePath}/dashboard`);
        } else {
            // Set organization context
            params.set('organization', companyId);
            router.push(`${basePath}/dashboard?${params.toString()}`);
        }
    };

    if (!companies || companies.length === 0) return null;

    return (
        <div className="flex items-center gap-2">
            <Select value={currentCompanyId || "all"} onValueChange={handleSwitchCompany}>
                <SelectTrigger className="w-auto h-8 text-sm bg-muted/50 border-muted-foreground/20 [&>span]:truncate [&>span]:block [&>span]:w-full [&>span]:text-left font-medium">
                    <div className="flex items-center gap-2 truncate">
                        <Building2 className="h-4 w-4 shrink-0 text-primary" />
                        <SelectValue placeholder="Select Organization" />
                    </div>
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">Platform Global</SelectItem>
                    <SelectSeparator />
                    {companies.map((organization: any) => (
                        <SelectItem key={organization._id} value={organization._id}>
                            {organization.name}
                        </SelectItem>
                    ))}
                    <SelectSeparator />
                    <SelectItem value="add-new" className="text-primary font-medium focus:text-primary focus:bg-primary/10">
                        <div className="flex items-center gap-2">
                            <Plus className="h-4 w-4" />
                            Add New Organization
                        </div>
                    </SelectItem>
                </SelectContent>
            </Select>
        </div>
    );
}
