"use client";

import { useAuth } from "@/hooks/useAuth";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useRouter, useSearchParams } from "next/navigation";
import { Building2 } from "lucide-react";

interface CompanySwitcherProps {
    currentCompanyId: string | null;
    companies: any[];
}

export function CompanySwitcher({ currentCompanyId, companies }: CompanySwitcherProps) {
    const router = useRouter();
    const searchParams = useSearchParams();

    const handleSwitchCompany = (companyId: string) => {
        const params = new URLSearchParams(searchParams.toString());

        if (companyId === 'all') {
            params.delete('company');
            router.push(`/global/dashboard?${params.toString()}`);
        } else {
            params.set('company', companyId);
            // When switching company, we usually want to land on the company dashboard
            router.push(`/global/dashboard?${params.toString()}`);
        }
    };

    if (!companies || companies.length === 0) return null;

    return (
        <div className="flex items-center gap-2">
            <Select value={currentCompanyId || "all"} onValueChange={handleSwitchCompany}>
                <SelectTrigger className="w-[180px] h-8 text-sm bg-muted/50 border-muted-foreground/20 [&>span]:truncate [&>span]:block [&>span]:w-full [&>span]:text-left font-medium">
                    <div className="flex items-center gap-2 truncate">
                        <Building2 className="h-4 w-4 shrink-0 text-primary" />
                        <SelectValue placeholder="Select Company" />
                    </div>
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">Platform Global</SelectItem>
                    {companies.map((company: any) => (
                        <SelectItem key={company._id} value={company._id}>
                            {company.name}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    );
}
