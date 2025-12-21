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
import { useGetBusinessUnitByIdQuery, useUpdateBusinessUnitMutation } from "@/redux/api/businessUnitApi";
import { useGetAllAttributeGroupsQuery } from "@/redux/api/attributeGroupApi";
import Swal from "sweetalert2";
import { BUSINESS_UNIT_STATUS, BUSINESS_UNIT_STATUS_OPTIONS, BUSINESS_UNIT_TYPE, BUSINESS_UNIT_TYPE_OPTIONS } from "@/constant/business-unit.constant";

export default function EditBusinessUnitPage() {
    const router = useRouter();
    const params = useParams();
    const id = params?.id as string;
    const { data: businessUnit, isLoading: isFetching } = useGetBusinessUnitByIdQuery(id);
    const [updateBusinessUnit, { isLoading: isSaving }] = useUpdateBusinessUnitMutation();
    const { data: attributeGroups } = useGetAllAttributeGroupsQuery(undefined);

    const { register, handleSubmit, control, setValue, reset, watch, formState: { errors } } = useForm({
        defaultValues: {
            name: "",
            description: "",
            email: "",
            phone: "",
            city: "",
            country: "",
            status: "",
            type: "",
            attributeGroup: ""
        }
    });

    // console.log('data', data)

    useEffect(() => {
        if (!businessUnit) return;

        reset({
            name: businessUnit.branding?.name ?? businessUnit.name ?? "",
            description: businessUnit.branding?.description ?? "",
            email: businessUnit.contact?.email ?? "",
            phone: businessUnit.contact?.phone ?? "",
            city: businessUnit.location?.city ?? "",
            country: businessUnit.location?.country ?? "",

            status: BUSINESS_UNIT_STATUS_OPTIONS.some(
                (s) => s.value === businessUnit.status
            )
                ? businessUnit.status
                : BUSINESS_UNIT_STATUS.DRAFT,

            type: BUSINESS_UNIT_TYPE_OPTIONS.some(
                (t) => t.value === businessUnit.businessUnitType
            )
                ? businessUnit.businessUnitType
                : BUSINESS_UNIT_TYPE.GENERAL,

            attributeGroup: businessUnit.attributeGroup?._id || businessUnit.attributeGroup || "",
        });
    }, [businessUnit, reset]);



    const onSubmit = async (data: any) => {
        try {

            const payload = {
                name: data.name, // Top level name often required
                branding: {
                    name: data.name,
                    description: data.description || `Business unit for ${data.name}`
                },
                contact: { email: data.email, phone: data.phone },
                location: { city: data.city, country: data.country },

                status: data.status,
                businessUnitType: data.type,
                attributeGroup: data.attributeGroup || undefined,
            };

            const response: any = await updateBusinessUnit({ id, body: payload }).unwrap();

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
        } catch (error: any) {
            console.error("Update error", error);
            // Show more detailed error if available
            const errorMsg = error?.data?.message || "Failed to update business unit";
            Swal.fire("Error", errorMsg, "error");
        }
    };

    if (isFetching) {
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
                                <Label htmlFor="description">Description</Label>
                                <Input id="description" {...register("description")} />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="status">Status</Label>

                                <Controller
                                    name="status"
                                    control={control}
                                    render={({ field }) => (
                                        <Select
                                            key={field.value} // 🔥 THIS IS THE FIX
                                            value={field.value || undefined}
                                            onValueChange={field.onChange}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select status" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {BUSINESS_UNIT_STATUS_OPTIONS.map((status) => (
                                                    <SelectItem key={status.value} value={status.value}>
                                                        {status.label}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    )}
                                />

                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="type">Type</Label>
                                <Controller
                                    name="type"
                                    control={control}
                                    render={({ field }) => (
                                        <Select
                                            key={field.value} // 🔥 THIS IS THE FIX
                                            value={field.value || undefined}
                                            onValueChange={field.onChange}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select type" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {BUSINESS_UNIT_TYPE_OPTIONS.map((type) => (
                                                    <SelectItem key={type.value} value={type.value}>
                                                        {type.label}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    )}
                                />

                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="attributeGroup">Product Attribute Template</Label>
                                <Controller
                                    name="attributeGroup"
                                    control={control}
                                    render={({ field }) => (
                                        <Select
                                            value={field.value || undefined}
                                            onValueChange={field.onChange}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select attribute template" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {attributeGroups?.data?.map((group: any) => (
                                                    <SelectItem key={group._id} value={group._id}>
                                                        {group.name}
                                                    </SelectItem>
                                                ))}
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
