"use client"

import LicenseForm from "@/components/modules/saas/LicenseForm"
import { useGetLicenseByIdQuery } from "@/redux/api/platform/licenseApi"
import { Loader2 } from "lucide-react"

export default function EditLicensePage({ params }: { params: { id: string } }) {
    const { data: license, isLoading } = useGetLicenseByIdQuery(params.id)

    // License API returns { success: true, data: { ...license } }
    // Or just check if license.data exists
    const initialData = license?.data || license

    if (isLoading) {
        return (
            <div className="flex h-[50vh] w-full items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
        )
    }

    if (!initialData) {
        return <div>License not found</div>
    }

    return <LicenseForm initialData={initialData} isEdit={true} />
}
