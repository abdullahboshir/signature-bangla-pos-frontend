"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Loader2, Camera, User, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
    useGetSingleUserQuery,
    useUpdateUserMutation,
    useGetProfileQuery,
    useUpdateProfileMutation
} from "@/redux/api/iam/userApi";
import { useGetRolesQuery } from "@/redux/api/iam/roleApi";
import { useGetBusinessUnitsQuery } from "@/redux/api/organization/businessUnitApi";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { useAuth } from "@/hooks/useAuth";

interface UserProfileFormProps {
    userId?: string; // If provided, acts as Admin View for that user. If not, acts as "My Profile"
}

export function UserProfileForm({ userId }: UserProfileFormProps) {
    const router = useRouter();
    const { user: authUser } = useAuth(); // For "My Profile" fallback or permission check

    // --- Data Fetching ---
    // If userId is present, we fetch that specific user (Admin mode)
    // If no userId, we rely on `useGetProfileQuery` (Self mode)

    const useAdminQuery = !!userId;

    const {
        data: adminUserData,
        isLoading: isLoadingAdminUser
    } = useGetSingleUserQuery(userId as string, { skip: !useAdminQuery });

    const {
        data: profileData,
        isLoading: isLoadingProfile
    } = useGetProfileQuery(undefined, { skip: useAdminQuery });

    // Normalize Data
    // Admin API might return { success: true, data: { ... } }
    // Profile API might return { success: true, data: { ... } }

    // --- Data Fetching (Admin Only Roles/BUs) ---
    const { data: rolesData, isLoading: isLoadingRoles } = useGetRolesQuery({}, { skip: !useAdminQuery });
    const { data: businessUnitsData, isLoading: isLoadingBUs } = useGetBusinessUnitsQuery(undefined, { skip: !useAdminQuery });

    const roles = Array.isArray(rolesData) ? rolesData : [];
    const businessUnits = (Array.isArray(businessUnitsData) ? businessUnitsData : (businessUnitsData as any)?.data) || [];

    // Normalization logic
    const unwrapUser = (data: any) => {
        if (!data) return null;
        return data.data || data.result || data;
    };

    const fetchedUser = useAdminQuery
        ? unwrapUser(adminUserData)
        : unwrapUser(profileData) || authUser;

    const isLoading = useAdminQuery ? isLoadingAdminUser : isLoadingProfile;

    // --- Mutations ---
    const [updateUser, { isLoading: isUpdatingAdmin }] = useUpdateUserMutation();
    const [updateProfile, { isLoading: isUpdatingSelf }] = useUpdateProfileMutation();

    const isUpdating = isUpdatingAdmin || isUpdatingSelf;

    // --- State ---
    const [previewImage, setPreviewImage] = useState<string | null>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm({
        defaultValues: {
            firstName: "",
            lastName: "",
            email: "",
            phone: "",
            role: "",
            businessUnit: ""
        }
    });

    // Watch values for Select components (controlled)
    const selectedRole = watch("role");
    const selectedBU = watch("businessUnit");

    // --- Effects ---
    useEffect(() => {
        if (fetchedUser) {
            const firstName = fetchedUser.name?.firstName || (typeof fetchedUser.name === 'string' ? fetchedUser.name.split(' ')[0] : "") || "";
            const lastName = fetchedUser.name?.lastName || (typeof fetchedUser.name === 'string' ? fetchedUser.name.split(' ')[1] : "") || "";

            setValue("firstName", firstName);
            setValue("lastName", lastName);
            setValue("email", fetchedUser.email || "");
            setValue("phone", fetchedUser.phone || "");
            setPreviewImage(fetchedUser.avatar || null);

            // Set Role/BU if in Admin Mode
            if (useAdminQuery) {
                const roleId = fetchedUser.roles?.[0]?._id || (typeof fetchedUser.roles?.[0] === 'string' ? fetchedUser.roles[0] : "") || "";
                const buId = fetchedUser.businessUnits?.[0]?._id || (typeof fetchedUser.businessUnits?.[0] === 'string' ? fetchedUser.businessUnits[0] : "") || "";
                setValue("role", roleId);
                setValue("businessUnit", buId);
            }
        }
    }, [fetchedUser, setValue, useAdminQuery]);

    // --- Handlers ---
    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setSelectedFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewImage(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const onSubmit = async (data: any) => {
        try {
            const formData = new FormData();

            const updateData: any = {
                name: {
                    firstName: data.firstName,
                    lastName: data.lastName
                },
                phone: data.phone
            };

            if (useAdminQuery && userId) {
                // Attach Role & BU updates in Admin Mode
                if (data.role) updateData.roles = [data.role];
                if (data.businessUnit) updateData.businessUnits = [data.businessUnit];
            }

            formData.append("data", JSON.stringify(updateData));

            if (selectedFile) {
                formData.append("file", selectedFile);
            }

            if (useAdminQuery && userId) {
                // Admin Update
                await updateUser({ id: userId, data: formData }).unwrap();
                toast.success("User profile updated successfully");
            } else {
                // Self Update
                await updateProfile(formData).unwrap();
                toast.success("Profile updated successfully");
            }

        } catch (error: any) {
            console.error("Update error:", error);
            toast.error(error?.data?.message || "Failed to update profile");
        }
    };

    if (isLoading) return <LoadingSpinner />;
    if (useAdminQuery && !fetchedUser) return <div className="p-10 text-center">User not found</div>;

    const pageTitle = useAdminQuery ? "User Profile" : "My Profile";
    const pageDesc = useAdminQuery
        ? `Manage details for ${fetchedUser?.name?.firstName || fetchedUser?.name || 'user'}`
        : "Manage your account settings and preferences.";

    return (
        <div className="container mx-auto py-10 max-w-4xl">
            <div className="flex items-center gap-4 mb-6">
                {useAdminQuery && (
                    <Button variant="ghost" size="icon" onClick={() => router.back()}>
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                )}
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">{pageTitle}</h1>
                    <p className="text-muted-foreground">{pageDesc}</p>
                </div>
            </div>

            <div className="grid gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Profile Information</CardTitle>
                        <CardDescription>Update personal details and profile picture.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">

                            {/* Avatar Section */}
                            <div className="flex flex-col items-center gap-4">
                                <div className="relative group cursor-pointer">
                                    <Avatar className="h-24 w-24">
                                        <AvatarImage src={previewImage || ""} alt="Profile" />
                                        <AvatarFallback><User className="h-10 w-10" /></AvatarFallback>
                                    </Avatar>
                                    <label htmlFor="avatar-upload" className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                                        <Camera className="h-6 w-6 text-white" />
                                    </label>
                                    <input
                                        id="avatar-upload"
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={handleImageChange}
                                    />
                                </div>
                                <p className="text-sm text-muted-foreground">Click image to change (Max 5MB)</p>
                            </div>

                            <Separator />

                            {/* Admin-Only Role/BU Selection */}
                            {useAdminQuery && (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="businessUnit">Business Unit</Label>
                                        <Select
                                            value={selectedBU}
                                            onValueChange={(val) => setValue('businessUnit', val)}
                                            disabled={isLoadingBUs}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select Business Unit" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {businessUnits.map((bu: any) => (
                                                    <SelectItem key={bu._id || bu.id} value={bu._id || bu.id}>
                                                        {bu.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="role">Role</Label>
                                        <Select
                                            value={selectedRole}
                                            onValueChange={(val) => setValue('role', val)}
                                            disabled={isLoadingRoles}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select Role" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {roles.map((r: any) => (
                                                    <SelectItem key={r._id} value={r._id}>
                                                        {r.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                            )}

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="firstName">First Name</Label>
                                    <Input id="firstName" {...register("firstName")} placeholder="John" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="lastName">Last Name</Label>
                                    <Input id="lastName" {...register("lastName")} placeholder="Doe" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="email">Email</Label>
                                    <Input id="email" {...register("email")} disabled className="bg-muted" />
                                    <p className="text-xs text-muted-foreground">Email cannot be changed.</p>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="phone">Phone Number</Label>
                                    <Input id="phone" {...register("phone")} placeholder="+1234567890" />
                                </div>
                            </div>

                            <div className="flex justify-end gap-4">
                                <Button type="button" variant="outline" onClick={() => router.back()}>Cancel</Button>
                                <Button type="submit" disabled={isUpdating}>
                                    {isUpdating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                    Save Changes
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

