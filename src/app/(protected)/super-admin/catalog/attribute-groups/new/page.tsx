"use client";

import { AttributeGroupForm } from "@/components/modules/catalog/attribute-group/AttributeGroupForm";
import { useCreateAttributeGroupMutation } from "@/redux/api/attributeGroupApi";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function NewAttributeGroupPage() {
    const router = useRouter();
    const [createAttributeGroup, { isLoading }] = useCreateAttributeGroupMutation();

    const handleSubmit = async (data: any) => {
        try {
            await createAttributeGroup(data).unwrap();
            toast.success("Attribute Group created successfully");
            router.push("/super-admin/catalog/attribute-groups");
        } catch (error) {
            toast.error("Failed to create Attribute Group");
            console.error(error);
        }
    };

    return (
        <div className="flex justify-center w-full">
            <div className="space-y-6 w-full max-w-4xl">
                <div className="flex flex-col items-center text-center space-y-2">
                    <h1 className="text-3xl font-bold tracking-tight">Create Attribute Group</h1>
                    <p className="text-muted-foreground">
                        Define a new set of dynamic attributes for products.
                    </p>
                </div>
                <AttributeGroupForm onSubmit={handleSubmit} isLoading={isLoading} />
            </div>
        </div>
    );
}
