"use client"

import { useGetPurchaseQuery, useUpdatePurchaseMutation } from "@/redux/api/inventory/purchaseApi";
import { PurchaseForm } from "@/components/modules/purchases/components/PurchaseForm";
import { useRouter, useParams } from "next/navigation";
import { toast } from "sonner";
import { usePermissions } from "@/hooks/usePermissions"
import { useAuth } from "@/hooks/useAuth";
import { useGetBusinessUnitsQuery } from "@/redux/api/organization/businessUnitApi";
import { Loader2 } from "lucide-react";

export default function EditPurchasePage() {
    const router = useRouter();
    const params = useParams();
    const id = params?.id as string;

    // Auth & Permissions (reused logic)
    const { user } = useAuth();
    const { isSuperAdmin } = usePermissions();
    const { data: businessUnits = [] } = useGetBusinessUnitsQuery({ limit: 100 }, { skip: !isSuperAdmin });

    // Fetch Purchase Data
    const { data: purchaseResponse, isLoading: isFetching } = useGetPurchaseQuery(id, {
        skip: !id,
        refetchOnMountOrArgChange: true
    });

    const [updatePurchase, { isLoading: isUpdating }] = useUpdatePurchaseMutation();
    const purchaseData = purchaseResponse?.data;

    const handleSubmit = async (values: any) => {
        try {
            // Clean up payload if needed, ensuring items have calculations correct
            const payload = { ...values };

            const res = await updatePurchase({ id, body: payload }).unwrap();

            if (res.success || res.data) {
                toast.success("Purchase updated successfully");
                // Navigate back to list
                const rolePath = params?.role as string;
                const buPath = params?.["business-unit"] as string;
                if (rolePath && buPath) {
                    router.push(`/${rolePath}/${buPath}/purchases`);
                } else {
                    router.back();
                }
            }
        } catch (error: any) {
            const msg = error?.data?.message || error?.message || "Failed to update purchase";
            toast.error(msg);
        }
    };

    if (isFetching) {
        return (
            <div className="flex h-full items-center justify-center">
                <Loader2 className="h-6 w-6 animate-spin" />
            </div>
        );
    }

    if (!purchaseData) {
        return <div>Purchase not found</div>;
    }

    // Prepare initial values
    const initialValues = {
        ...purchaseData,
        // Ensure supplier is just the ID
        supplier: purchaseData.supplier?._id || purchaseData.supplier?.id || purchaseData.supplier,
        // Ensure businessUnit is just the ID
        businessUnit: purchaseData.businessUnit?._id || purchaseData.businessUnit?.id || purchaseData.businessUnit,
        // Ensure outlet is just the ID
        outlet: purchaseData.outlet?._id || purchaseData.outlet?.id || purchaseData.outlet,
        // Format date for input type="date"
        purchaseDate: purchaseData.purchaseDate ? new Date(purchaseData.purchaseDate).toISOString().split("T")[0] : "",
        // Ensure items are properly mapped if needed (should already be ok from API)
        items: purchaseData.items.map((item: any) => ({
            ...item,
            product: item.product?._id || item.product // Ensure product ID is used
        }))
    };

    return (
        <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
            <div className="flex items-center justify-between space-y-2">
                <h2 className="text-3xl font-bold tracking-tight">Edit Purchase</h2>
            </div>
            <PurchaseForm
                initialValues={initialValues}
                onSubmit={handleSubmit}
                isSuperAdmin={isSuperAdmin}
                businessUnits={businessUnits}
                contextBUId={purchaseData.businessUnit?._id || purchaseData.businessUnit} // Pre-fill context from data
                isSubmitting={isUpdating}
            />
        </div>
    );
}
