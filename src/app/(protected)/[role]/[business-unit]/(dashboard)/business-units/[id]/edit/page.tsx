"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { ArrowLeft, Save, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { axiosInstance } from "@/lib/axios/axiosInstance";
import Swal from "sweetalert2";

export default function EditBusinessUnitPage() {
    const router = useRouter();
    const params = useParams();
    const id = params?.id as string;
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    const { register, handleSubmit, control, setValue, formState: { errors } } = useForm({
        defaultValues: {
            name: "",
            email: "",
            phone: "",
            city: "",
            country: "",
            status: "active"
        }
    });

    useEffect(() => {
        const fetchUnit = async () => {
            if (!id) return;
            try {
                const response: any = await axiosInstance.get(`/super-admin/business-unit/${id}`);

                // Handle potentially nested data structure based on user feedback
                // API returns { success: ..., data: { success: ..., data: { branding: ... } } }
                const responseData = response?.data?.data ? response.data.data : (response?.data || response);

                if (responseData && (responseData.branding || responseData.name)) {
                    setValue("name", responseData.branding?.name || responseData.name || "");
                    setValue("email", responseData.contact?.email || "");
                    setValue("phone", responseData.contact?.phone || "");
                    setValue("city", responseData.location?.city || "");
                    setValue("country", responseData.location?.country || "");
                    setValue("status", responseData.status || "active");
                } else {
                    console.warn("Unexpected response structure:", response);
                    Swal.fire("Error", "Could not load business unit details", "error");
                }
            } catch (error) {
                console.error("Fetch error", error);
                Swal.fire("Error", "Failed to fetch business unit details", "error");
            } finally {
                setIsLoading(false);
            }
        };

        fetchUnit();
    }, [id, setValue]);

    const onSubmit = async (data: any) => {
        try {
            setIsSaving(true);
            const payload = {
                branding: { name: data.name },
                contact: { email: data.email, phone: data.phone },
                location: { city: data.city, country: data.country },
                status: data.status,
            };

            const response: any = await axiosInstance.patch(`/super-admin/business-unit/${id}`, payload);

            if (response?.success || response?.data?.success) {
                Swal.fire({
                    icon: 'success',
                    title: 'Updated!',
                    text: 'Business unit updated successfully',
                    timer: 1500,
                    showConfirmButton: false
                });
                router.back();
            }
        } catch (error) {
            console.error("Update error", error);
            Swal.fire("Error", "Failed to update business unit", "error");
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return <div className="flex h-screen items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
    }

    return (
        <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
            <div className="flex items-center space-x-2">
                <Button variant="ghost" size="icon" onClick={() => router.back()}>
                    <ArrowLeft className="h-4 w-4" />
                </Button>
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Edit Business Unit</h2>
                    <p className="text-muted-foreground">Update business unit information.</p>
                </div>
            </div>

            <Card>
                <CardContent className="pt-6">
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="name">Business Name</Label>
                                <Input id="name" {...register("name", { required: true })} />
                                {errors.name && <span className="text-sm text-red-500">Name is required</span>}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="status">Status</Label>
                                <Controller
                                    name="status"
                                    control={control}
                                    render={({ field }) => (
                                        <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select status" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="active">Active</SelectItem>
                                                <SelectItem value="inactive">Inactive</SelectItem>
                                                <SelectItem value="published">Published</SelectItem>
                                                <SelectItem value="draft">Draft</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    )}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input id="email" type="email" {...register("email", { required: true })} />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="phone">Phone</Label>
                                <Input id="phone" {...register("phone")} />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="city">City</Label>
                                <Input id="city" {...register("city")} />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="country">Country</Label>
                                <Input id="country" {...register("country")} />
                            </div>
                        </div>

                        <div className="flex justify-end space-x-2">
                            <Button variant="outline" type="button" onClick={() => router.back()}>Cancel</Button>
                            <Button type="submit" disabled={isSaving}>
                                {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Save Changes
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
