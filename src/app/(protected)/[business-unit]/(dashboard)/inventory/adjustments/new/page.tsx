"use client";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { useCreateAdjustmentMutation } from "@/redux/api/inventory/inventoryApi";
import { useGetProductsQuery } from "@/redux/api/catalog/productApi"; // To select product
import { useGetOutletsQuery } from "@/redux/api/organization/outletApi"; // To select outlet

import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";

const adjustmentSchema = z.object({
    outlet: z.string().optional(),
    items: z.array(z.object({
        product: z.string().min(1, "Product is required"),
        type: z.enum(["increase", "decrease"]),
        quantity: z.number().min(1, "Quantity must be at least 1"),
        reason: z.string().min(1, "Reason is required")
    })).min(1, "At least one item is required")
});

type AdjustmentFormValues = z.infer<typeof adjustmentSchema>;

export default function NewAdjustmentPage() {
    const router = useRouter();
    const [createAdjustment, { isLoading }] = useCreateAdjustmentMutation();
    const { data: products = [] } = useGetProductsQuery({});
    const { data: outlets = [] } = useGetOutletsQuery({});

    const form = useForm<AdjustmentFormValues>({
        resolver: zodResolver(adjustmentSchema),
        defaultValues: {
            items: [{ type: "increase", quantity: 1, reason: "" }]
        }
    });

    const onSubmit: SubmitHandler<AdjustmentFormValues> = async (values) => {
        try {
            await createAdjustment(values).unwrap();
            toast.success("Adjustment created successfully");
            router.back();
        } catch (error: any) {
            toast.error(error?.data?.message || "Failed to create adjustment");
        }
    };

    return (
        <div className="p-8 max-w-2xl mx-auto">
            <Card>
                <CardHeader>
                    <CardTitle>New Stock Adjustment</CardTitle>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                            <FormField
                                control={form.control}
                                name="outlet"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Outlet (Optional - Global if empty)</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select Outlet" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {outlets.map((outlet: any) => (
                                                    <SelectItem key={outlet._id || outlet.id} value={outlet._id || outlet.id}>
                                                        {outlet.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Single Item Form for Simplicity - Can be expanded to FieldArray */}
                            <div className="border p-4 rounded-md space-y-4">
                                <h3 className="font-medium">Adjustment Details</h3>
                                <FormField
                                    control={form.control}
                                    name="items.0.product"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Product</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select Product" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {products.map((p: any) => (
                                                        <SelectItem key={p._id || p.id} value={p._id || p.id}>
                                                            {p.name} ({p.sku})
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <div className="grid grid-cols-2 gap-4">
                                    <FormField
                                        control={form.control}
                                        name="items.0.type"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Type</FormLabel>
                                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        <SelectItem value="increase">Increase (+)</SelectItem>
                                                        <SelectItem value="decrease">Decrease (-)</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="items.0.quantity"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Quantity</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type="number"
                                                        {...field}
                                                        onChange={e => field.onChange(e.target.valueAsNumber)}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <FormField
                                    control={form.control}
                                    name="items.0.reason"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Reason</FormLabel>
                                            <FormControl>
                                                <Textarea {...field} placeholder="e.g. Damaged, Found stock..." />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <Button type="submit" className="w-full" disabled={isLoading}>
                                {isLoading ? "Creating..." : "Create Adjustment"}
                            </Button>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    );
}
