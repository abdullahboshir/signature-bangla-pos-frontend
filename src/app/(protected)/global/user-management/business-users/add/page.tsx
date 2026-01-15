"use client"

import { useRouter, useParams, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { useCreateUserMutation } from "@/redux/api/iam/userApi"
import { toast } from "sonner"
import { UserForm } from "@/components/modules/user-management/UserForm"

export default function AddBusinessUserPage() {
    const router = useRouter()
    const params = useParams()
    const searchParams = useSearchParams()
    const [createUser, { isLoading, error: userError }] = useCreateUserMutation()

    // Support both path params (for sub-routes) and query params (for shortcuts)
    const buSlug = searchParams.get("business-unit") || (params && params['business-unit'] ? params['business-unit'] as string : undefined);

    const handleSubmit = async (payload: any) => {
        try {
            await createUser(payload).unwrap();
            toast.success("User created successfully!")
            router.back()
        } catch (error: any) {
            console.error("User creation error:", error)
            if (error?.data?.message) {
                toast.error(error.data.message);
            } else if (error?.data?.errorSources) {
                toast.error("Please check the form for errors.");
            } else {
                toast.error(error?.message || "Failed to create user");
            }
        }
    }

    return (
        <div className="container mx-auto py-6 space-y-6 max-w-7xl">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" onClick={() => router.back()}>
                    <ArrowLeft className="h-4 w-4" />
                </Button>
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Add Business Staff</h1>
                    <p className="text-muted-foreground">
                        Create a new user account and assign roles.
                    </p>
                </div>
            </div>

            <UserForm
                mode="create"
                onSubmit={handleSubmit}
                onCancel={() => router.back()}
                apiError={userError}
                isSubmitting={isLoading}
                targetScope="BUSINESS"
                initialBusinessUnitSlug={buSlug}
            />
        </div>
    )
}
