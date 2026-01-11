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
import { useRouter, useSearchParams } from "next/navigation";
import { Building2, Plus } from "lucide-react";

interface CompanySwitcherProps {
    currentCompanyId: string | null;
    companies: any[];
}

export function CompanySwitcher({ currentCompanyId, companies }: CompanySwitcherProps) {
    const router = useRouter();
    const searchParams = useSearchParams();

    const { setActiveBusinessUnit } = useAuth();
    const handleSwitchCompany = (companyId: string) => {
        const params = new URLSearchParams(searchParams.toString());

        if (companyId === 'add-new') {
            router.push(`/global/companies/add`);
            return;
        }

        if (companyId === 'all') {
            // Explicitly clear BU context when returning to Platform Global
            setActiveBusinessUnit(null);
            localStorage.removeItem('active-business-unit');

            params.delete('company');
            router.push(`/global/dashboard`);
        } else {
            // Set company context
            params.set('company', companyId);
            router.push(`/global/dashboard?${params.toString()}`);
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
