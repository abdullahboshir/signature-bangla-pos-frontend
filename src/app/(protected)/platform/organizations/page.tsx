"use client"

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useGetAllOrganizationsQuery } from "@/redux/api/platform/organizationApi";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { columns } from "./columns";
import { DataTable } from "@/components/shared/DataTable";
import { Heading } from "@/components/ui/heading";

import { OrganizationDetails } from "./OrganizationDetails";

export default function OrganizationsPage() {
    const router = useRouter();
    const { data, isLoading } = useGetAllOrganizationsQuery(undefined);

    return (
        <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
            <div className="flex items-center justify-between">
                <Heading
                    title={`Organizations (${data?.data?.length || 0})`}
                    description="Manage client organizations and their subscriptions."
                />
                <Button onClick={() => router.push("/platform/organizations/add")}>
                    <Plus className="mr-2 h-4 w-4" /> Add Organization
                </Button>
            </div>
            <Separator />

            <DataTable
                searchKey="name"
                columns={columns}
                data={data?.data || []}
                isLoading={isLoading}
                renderSubComponent={(row) => (
                    <OrganizationDetails data={row.original} />
                )}
            />
        </div>
    );
}
