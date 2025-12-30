"use client"

import { usePermissions } from "@/hooks/usePermissions";
import { useAuth } from "@/hooks/useAuth";
import { useCurrentBusinessUnit } from "@/hooks/useCurrentBusinessUnit";
import { useCreatePurchaseMutation } from "@/redux/api/inventory/purchaseApi";
import { useGetBusinessUnitsQuery } from "@/redux/api/organization/businessUnitApi";
import { PurchaseForm } from "@/components/modules/purchases/components/PurchaseForm";
import { useRouter, useParams } from "next/navigation"; // Correct import for App Router
import { toast } from "sonner";

export default function CreatePurchasePage() {
    const router = useRouter();
    const params = useParams();
    const { user } = useAuth();
    const { currentBusinessUnit: contextBusinessUnit } = useCurrentBusinessUnit();
    const { isSuperAdmin } = usePermissions();

    const [createPurchase, { isLoading }] = useCreatePurchaseMutation();

    // Fetch BUs for SA if needed
    const { data: businessUnits = [] } = useGetBusinessUnitsQuery({ limit: 100 }, { skip: !isSuperAdmin });

    // Reuse logic from PurchaseList to resolve BU ID if needed, 
    // though typically in this route contextBUId should be valid from Layout context if properly scoped.
    const contextBUId = contextBusinessUnit?._id;

    const handleSubmit = async (values: any) => {
        try {
            if (contextBUId) {
                values.businessUnit = contextBUId;
            }

            const res = await createPurchase(values).unwrap();
            if (res.success || res.data) {
                toast.success("Purchase created successfully");
                // Navigate back to list
                // We construct the path manually to be safe or use back()
                // Path: /[role]/[business-unit]/purchases
                const rolePath = params?.role as string;
                const buPath = params?.["business-unit"] as string;
                if (rolePath && buPath) {
                    router.push(`/${rolePath}/${buPath}/purchases`);
                } else {
                    router.back();
                }
            }
        } catch (error: any) {
            const msg = error?.data?.message || error?.message || "Failed to create purchase";
            toast.error(msg);
        }
    };

    return (
        <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
            <div className="flex items-center justify-between space-y-2">
                <h2 className="text-3xl font-bold tracking-tight">Create Purchase</h2>
            </div>
            <PurchaseForm
                onSubmit={handleSubmit}
                isSuperAdmin={isSuperAdmin}
                businessUnits={businessUnits}
                contextBUId={contextBUId}
                isSubmitting={isLoading}
            />
        </div>
    );
}
