"use client";
import { BusinessUnitForm } from "@/components/modules/business-units/BusinessUnitForm";
import { DataPageLayout } from "@/components/shared/DataPageLayout";


export default function NewBusinessUnitPage() {
    return (
        <DataPageLayout title="New Business Unit" description="Create a new business unit structure.">
            <BusinessUnitForm />
        </DataPageLayout>
    );
}
