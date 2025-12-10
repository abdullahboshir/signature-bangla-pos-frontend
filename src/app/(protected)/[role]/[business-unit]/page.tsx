"use client";

import { useEffect } from "react";
import { useRouter, useParams } from "next/navigation";

export default function BusinessUnitRootPage() {
    const router = useRouter();
    const params = useParams();

    useEffect(() => {
        const role = params.role as string;
        const businessUnit = params["business-unit"] as string;

        // Redirect to the dashboard overview
        if (role && businessUnit) {
            router.replace(`/${role}/${businessUnit}/overview`);
        }
    }, [params, router]);

    return (
        <div className="flex items-center justify-center min-h-screen">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
    );
}
