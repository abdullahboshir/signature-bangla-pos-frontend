"use client";

import { useParams } from "next/navigation";
import { OutletForm } from "@/components/features/outlet/OutletForm";
import { DataPageLayout } from "@/components/shared/DataPageLayout";

export default function AddOutletPage() {
    const params = useParams();
    const businessUnitSlug = params["business-unit"] as string;

    return (
        <DataPageLayout title="New Outlet" description="Create a new physical store location.">
            <OutletForm preSelectedSlug={businessUnitSlug} />
        </DataPageLayout>
    );
}
