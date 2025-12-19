"use client";

import { useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { ArrowLeft, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { useGetTaxQuery, useUpdateTaxMutation } from "@/redux/api/taxApi";
import Swal from "sweetalert2";

interface TaxFormValues {
    name: string;
    rate: number;
    type: "percentage" | "fixed";
    isDefault: boolean;
    isActive: boolean;
    businessUnit?: string;
}

export default function EditTaxPage() {
    const router = useRouter();
    const params = useParams();
    const id = params?.id as string;
    const [updateTax, { isLoading: isSaving }] = useUpdateTaxMutation();
    const { data: taxData, isLoading: isTaxLoading } = useGetTaxQuery(id, { skip: !id });

    // Use derived state for loading if needed, or just rely on isTaxLoading
    const isLoading = isTaxLoading;

    const { register, handleSubmit, control, setValue, formState: { errors } } = useForm<TaxFormValues>({
        defaultValues: {
            name: "",
            rate: 0,
            type: "percentage",
            isDefault: false,
            isActive: true,
        },
    });

    useEffect(() => {
        if (taxData) {
            setValue("name", taxData.name);
            setValue("rate", taxData.rate);
            setValue("type", taxData.type);
            setValue("isDefault", taxData.isDefault);
            setValue("isActive", taxData.isActive);
        }
    }, [taxData, setValue]);

    const onSubmit = async (data: TaxFormValues) => {
        try {
            const payload = { ...data, rate: Number(data.rate) };
            const response: any = await updateTax({ id, body: payload }).unwrap();

            if (response?.success || response?.data) {
                Swal.fire({
                    icon: 'success',
                    title: 'Updated!',
                    text: 'Tax updated successfully',
                    timer: 1500,
                    showConfirmButton: false
                });
                router.back();
            }
        } catch (error) {
            console.error("Update error", error);
            Swal.fire("Error", "Failed to update tax", "error");
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
                    <h2 className="text-3xl font-bold tracking-tight">Edit Tax</h2>
                    <p className="text-muted-foreground">Update tax details.</p>
                </div>
            </div>

            <Card>
                <CardContent className="pt-6">
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="name">Tax Name</Label>
                                <Input id="name" {...register("name", { required: "Name is required" })} />
                                {errors.name && <span className="text-sm text-red-500">{errors.name.message}</span>}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="rate">Rate</Label>
                                <Input
                                    id="rate"
                                    type="number"
                                    step="0.01"
                                    {...register("rate", { required: "Rate is required", min: { value: 0, message: "Rate cannot be negative" } })}
                                />
                                {errors.rate && <span className="text-sm text-red-500">{errors.rate.message}</span>}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="type">Type</Label>
                                <Controller
                                    name="type"
                                    control={control}
                                    render={({ field }) => (
                                        <Select key={field.value} onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select type" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="percentage">Percentage (%)</SelectItem>
                                                <SelectItem value="fixed">Fixed Amount</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    )}
                                />
                            </div>

                            <div className="flex flex-col space-y-4 pt-8">
                                <div className="flex items-center space-x-2">
                                    <Controller
                                        name="isDefault"
                                        control={control}
                                        render={({ field }) => (
                                            <Switch
                                                id="isDefault"
                                                checked={field.value}
                                                onCheckedChange={field.onChange}
                                            />
                                        )}
                                    />
                                    <Label htmlFor="isDefault">Is Default Tax?</Label>
                                </div>

                                <div className="flex items-center space-x-2">
                                    <Controller
                                        name="isActive"
                                        control={control}
                                        render={({ field }) => (
                                            <Switch
                                                id="isActive"
                                                checked={field.value}
                                                onCheckedChange={field.onChange}
                                            />
                                        )}
                                    />
                                    <Label htmlFor="isActive">Active</Label>
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-end space-x-2">
                            <Button variant="outline" type="button" onClick={() => router.back()}>Cancel</Button>
                            <Button type="submit" disabled={isSaving}>
                                {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Update Tax
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
