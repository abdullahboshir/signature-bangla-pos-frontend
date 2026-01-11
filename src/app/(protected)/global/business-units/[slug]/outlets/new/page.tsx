"use client";

import { useParams } from "next/navigation";
import { DataPageLayout } from "@/components/shared/DataPageLayout";
import { OutletForm } from "@/components/features/outlet/OutletForm";

export default function BusinessUnitAddOutletPage() {
    const params = useParams();
    const slug = params?.slug as string;

    return (
        <DataPageLayout title="New Outlet" description="Add a new outlet to this business unit context.">
            <OutletForm preSelectedSlug={slug} />
        </DataPageLayout>
    );
}
