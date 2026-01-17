"use client"
import { useParams } from "next/navigation";
import PackageForm from "@/components/modules/saas/PackageForm";
import { useGetPackagesQuery } from "@/redux/api/platform/packageApi";

export default function EditPackagePage() {
    const params = useParams();
    const id = params?.id as string;

    // Fetch individual package (using getPackages with ID filter or finding from list if single get endpoint not available)
    // Assuming getPackages supports filtering by ID as per packageApi.ts arg: Record<string, any>
    const { data: packagesData, isLoading } = useGetPackagesQuery({ id });

    // Extract single package from response
    // Response could be { data: [...] } or [...] depending on API.
    // Based on PackageList: (packagesData as any)?.data
    const packageData = (packagesData as any)?.data?.find((p: any) => p.id === id || p._id === id) || (Array.isArray(packagesData) ? packagesData.find((p: any) => p.id === id) : null);

    if (isLoading) return <div>Loading...</div>;

    return <PackageForm initialData={packageData} isEdit={true} />;
}
