"use client";

import { useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { ArrowLeft, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { useGetBrandQuery, useUpdateBrandMutation } from "@/redux/api/brandApi";
import Swal from "sweetalert2";

export default function EditBrandPage() {
    const router = useRouter();
    const params = useParams();
    const id = params?.id as string;
    const [updateBrand, { isLoading: isSaving }] = useUpdateBrandMutation();
    const { data: brandData, isLoading: isBrandLoading } = useGetBrandQuery(id, { skip: !id });

    // Derived loading state
    const isLoading = isBrandLoading;

    const { register, handleSubmit, control, setValue, formState: { errors } } = useForm({
        defaultValues: {
            name: "",
            description: "",
            website: "",
            status: "active"
        }
    });

    useEffect(() => {
        if (brandData) {
            setValue("name", brandData.name || "");
            setValue("description", brandData.description || "");
            setValue("website", brandData.website || "");
            setValue("status", brandData.status || "active");
        }
    }, [brandData, setValue]);

    const onSubmit = async (data: any) => {
        try {
            const response: any = await updateBrand({ id, body: data }).unwrap();

            if (response?.success || response?.data) {
                Swal.fire({
                    icon: 'success',
                    title: 'Updated!',
                    text: 'Brand updated successfully',
                    timer: 1500,
                    showConfirmButton: false
                });
                router.back();
            }
        } catch (error) {
            console.error("Update error", error);
            Swal.fire("Error", "Failed to update brand", "error");
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
                    <h2 className="text-3xl font-bold tracking-tight">Edit Brand</h2>
                    <p className="text-muted-foreground">Update brand information.</p>
                </div>
            </div>

            <Card>
                <CardContent className="pt-6">
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="name">Brand Name</Label>
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
                                            </SelectContent>
                                        </Select>
                                    )}
                                />
                            </div>

                            <div className="space-y-2 col-span-2">
                                <Label htmlFor="description">Description (Optional)</Label>
                                <Textarea id="description" {...register("description")} />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="website">Website (Optional)</Label>
                                <Input id="website" {...register("website")} placeholder="https://" />
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
