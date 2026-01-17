"use client"

import { useRouter, useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Loader2 } from "lucide-react"
import { useGetSingleUserQuery, useUpdateUserMutation } from "@/redux/api/iam/userApi"
import { toast } from "sonner"
import { UserForm } from "@/components/modules/user-management/UserForm"

export default function GlobalEditUserPage() {
    const router = useRouter()
    const params = useParams()
    const userId = params.id as string

    // Query Hooks
    const { data: userData, isLoading: isLoadingUser } = useGetSingleUserQuery(userId)
    const user = userData?.data || userData;
    const [updateUser, { isLoading: isUpdating, error: updateError }] = useUpdateUserMutation()

    const handleSubmit = async (payload: any) => {
        try {
            console.log("Updating user (Global):", payload);
            await updateUser({ id: userId, data: payload }).unwrap();
            toast.success("User updated successfully!")
            router.back()
        } catch (error: any) {
            console.error("User update error", error)
            if (error?.data?.errorSources) {
                toast.error("Please check the form for errors.")
            } else {
                toast.error(error?.data?.message || "Failed to update user")
            }
        }
    }

    if (isLoadingUser) {
        return <div className="p-10 flex justify-center"><Loader2 className="h-8 w-8 animate-spin" /></div>
    }

    return (
        <div className="container mx-auto py-6 space-y-6 max-w-7xl">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" onClick={() => router.back()}>
                    <ArrowLeft className="h-4 w-4" />
                </Button>
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Edit User</h1>
                    <p className="text-muted-foreground">
                        Manage user details, roles, and permissions across system.
                    </p>
                </div>
            </div>

            {user && (
                <UserForm
                    initialData={user}
                    mode="edit"
                    onSubmit={handleSubmit}
                    isSubmitting={isUpdating}
                    onCancel={() => router.back()}
                    apiError={updateError}
                />
            )}
        </div>
    )
}
