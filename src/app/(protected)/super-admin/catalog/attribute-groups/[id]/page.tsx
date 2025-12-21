"use client";

import { AttributeGroupForm } from "@/components/modules/catalog/attribute-group/AttributeGroupForm";
import { useGetAttributeGroupByIdQuery, useUpdateAttributeGroupMutation } from "@/redux/api/attributeGroupApi";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { use } from "react";

interface EditAttributeGroupPageProps {
    params: Promise<{ id: string }>;
}

export default function EditAttributeGroupPage({ params }: EditAttributeGroupPageProps) {
    const router = useRouter();
    const { id } = use(params);

    const { data: attributeGroup, isLoading: isFetching } = useGetAttributeGroupByIdQuery(id);
    const [updateAttributeGroup, { isLoading: isUpdating }] = useUpdateAttributeGroupMutation();

    const handleSubmit = async (data: any) => {
        try {
            await updateAttributeGroup({ id, data }).unwrap();
            toast.success("Attribute Group updated successfully");
            router.push("/super-admin/catalog/attribute-groups");
        } catch (error) {
            toast.error("Failed to update Attribute Group");
            console.error(error);
        }
    };

    if (isFetching) {
        return (
            <div className="flex h-[80vh] items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="flex justify-center w-full">
            <div className="space-y-6 w-full max-w-4xl">
                <div className="flex flex-col items-center text-center space-y-2">
                    <h1 className="text-3xl font-bold tracking-tight">Edit Attribute Group</h1>
                    <p className="text-muted-foreground">
                        Modify the dynamic attributes template.
                    </p>
                </div>
                <AttributeGroupForm
                    key={attributeGroup?.data?._id || 'loading'}
                    initialData={attributeGroup?.data}
                    onSubmit={handleSubmit}
                    isLoading={isUpdating}
                />
            </div>
        </div>
    );
}
