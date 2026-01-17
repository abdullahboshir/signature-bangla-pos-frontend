"use client";

import { useSearchParams } from "next/navigation";
import { DataPageLayout } from "@/components/shared/DataPageLayout";
import { OutletForm } from "@/components/features/outlet/OutletForm";

export default function NewOutletPage() {
    const searchParams = useSearchParams();
    const buId = searchParams.get("business-unit");

    return (
        <DataPageLayout title="New Outlet" description="Register a new outlet branch across the organization.">
            <OutletForm preSelectedSlug={buId || undefined} />
        </DataPageLayout>
    );
}
