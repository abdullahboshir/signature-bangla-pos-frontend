"use client"

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useGetAllCompaniesQuery } from "@/redux/api/platform/companyApi";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { columns } from "./columns";
import { DataTable } from "@/components/shared/DataTable";
import { Heading } from "@/components/ui/heading";

export default function CompaniesPage() {
    const router = useRouter();
    const { data, isLoading } = useGetAllCompaniesQuery(undefined);

    return (
        <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
            <div className="flex items-center justify-between">
                <Heading
                    title={`Companies (${data?.data?.length || 0})`}
                    description="Manage client companies and their subscriptions."
                />
                <Button onClick={() => router.push("/global/companies/add")}>
                    <Plus className="mr-2 h-4 w-4" /> Add Company
                </Button>
            </div>
            <Separator />

            <DataTable
                searchKey="name"
                columns={columns}
                data={data?.data || []}
                isLoading={isLoading}
            />
        </div>
    );
}
