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
import { isSuperAdmin as checkIsSuperAdmin, isCompanyOwner as checkIsCompanyOwner } from "@/config/auth-constants";
import { useCurrentRole } from "@/hooks/useCurrentRole";

interface CompanySwitcherProps {
    currentCompanyId: string | null;
    companies: any[];
}

export function CompanySwitcher({ currentCompanyId, companies }: CompanySwitcherProps) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const { currentRole } = useCurrentRole();

    const { setActiveBusinessUnit } = useAuth();
    
    const isCompanyAdminRoute = pathname.startsWith('/company-admin');
    const isSuperAdminRole = checkIsSuperAdmin(currentRole);
    const isCompanyOwnerRole = checkIsCompanyOwner(currentRole) && !isSuperAdminRole;
    
    // Determine base path based on role
    const getBasePath = () => {
        if (isSuperAdminRole) return '/global';
        if (isCompanyOwnerRole || isCompanyAdminRoute) return '/company-admin';
        return '/global';
    };
    
    const handleSwitchCompany = (companyId: string) => {
        const params = new URLSearchParams(searchParams.toString());
        const basePath = getBasePath();

        if (companyId === 'add-new') {
            router.push(`/global/companies/add`);
            return;
        }

        if (companyId === 'all') {
            // Explicitly clear BU context when returning to Platform Global
            setActiveBusinessUnit(null);
            localStorage.removeItem('active-business-unit');

            params.delete('company');
            router.push(`${basePath}/dashboard`);
        } else {
            // Set company context
            params.set('company', companyId);
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
                        <SelectValue placeholder="Select Company" />
                    </div>
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">Platform Global</SelectItem>
                    <SelectSeparator />
                    {companies.map((company: any) => (
                        <SelectItem key={company._id} value={company._id}>
                            {company.name}
                        </SelectItem>
                    ))}
                    <SelectSeparator />
                    <SelectItem value="add-new" className="text-primary font-medium focus:text-primary focus:bg-primary/10">
                        <div className="flex items-center gap-2">
                            <Plus className="h-4 w-4" />
                            Add New Company
                        </div>
                    </SelectItem>
                </SelectContent>
            </Select>
        </div>
    );
}
