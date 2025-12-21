"use client";

import { useParams } from "next/navigation";
import { OutletForm } from "@/components/features/outlet/OutletForm";

export default function AddOutletPage() {
    const params = useParams();
    const businessUnitSlug = params["business-unit"] as string;

    return <OutletForm preSelectedSlug={businessUnitSlug} />;
}
