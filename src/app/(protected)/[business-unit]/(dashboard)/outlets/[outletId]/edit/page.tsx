"use client";

import { useParams } from "next/navigation";
import { OutletForm } from "@/components/features/outlet/OutletForm";
import { useGetOutletQuery } from "@/redux/api/organization/outletApi";
import { Loader2 } from "lucide-react";

export default function EditOutletPage() {
    const params = useParams();
    const outletId = params.outletId as string;
    const businessUnitSlug = params["business-unit"] as string;

    const { data: outlet, isLoading } = useGetOutletQuery(outletId);

    if (isLoading) {
        return <div className="flex h-[50vh] items-center justify-center"><Loader2 className="h-8 w-8 animate-spin" /></div>;
    }

    if (!outlet) {
        return <div>Outlet not found</div>;
    }

    return <OutletForm preSelectedSlug={businessUnitSlug} initialData={outlet} isEditMode={true} />;
}
