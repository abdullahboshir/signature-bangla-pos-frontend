"use client"

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useGetAllCompaniesQuery } from "@/redux/api/platform/companyApi";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { columns } from "./columns";
import { CompanyForm } from "@/components/modules/companies/CompanyForm";
import { useState } from "react";
import { Dialog, DialogContent, DialogTrigger, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { DataTable } from "@/components/shared/DataTable";
import { Heading } from "@/components/ui/heading";

export default function CompaniesPage() {
    const router = useRouter();
    const { data, isLoading } = useGetAllCompaniesQuery(undefined);
    const [isCreateOpen, setIsCreateOpen] = useState(false);

    return (
        <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
            <div className="flex items-center justify-between">
                <Heading
                    title={`Companies (${data?.data?.length || 0})`}
                    description="Manage client companies and their subscriptions."
                />
                <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                    <DialogTrigger asChild>
                        <Button>
                            <Plus className="mr-2 h-4 w-4" /> Add Company
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-3xl h-[85vh] flex flex-col p-0 gap-0">
                        <DialogHeader className="px-6 py-4 border-b bg-background z-10 rounded-t-lg">
                            <DialogTitle>Create New Company</DialogTitle>
                            <DialogDescription>
                                Add a new client company and configure their licensed modules.
                            </DialogDescription>
                        </DialogHeader>
                        <CompanyForm onSuccess={() => setIsCreateOpen(false)} />
                    </DialogContent>
                </Dialog>
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
