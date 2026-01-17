"use client";

import { useRouter } from "next/navigation";
import { UserForm } from "@/components/modules/user-management/UserForm";
import { useCreateUserMutation } from "@/redux/api/iam/userApi";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function PlatformAddUserPage() {
    const router = useRouter();
    const [createUser, { isLoading, error: userError }] = useCreateUserMutation();

    const handleSubmit = async (payload: any) => {
        try {
            await createUser(payload).unwrap();
            toast.success("Platform User created successfully");
            router.back();
        } catch (err: any) {
            console.error("Failed to create user", err);
            if (err?.data?.errorSources) {
                toast.error("Please check the form for errors.");
            } else {
                toast.error(err?.data?.message || "Failed to create user");
            }
        }
    };

    return (
        <div className="container mx-auto py-6 space-y-6 max-w-7xl">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" onClick={() => router.back()}>
                    <ArrowLeft className="h-4 w-4" />
                </Button>
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Add Platform User</h1>
                    <p className="text-muted-foreground">
                        Create a new user with global or scoped permissions.
                    </p>
                </div>
            </div>

            <UserForm
                mode="create"
                onSubmit={handleSubmit}
                onCancel={() => router.back()}
                apiError={userError}
                targetScope="GLOBAL"
                isSubmitting={isLoading}
            />
        </div>
    );
}
