
import { UseFormReturn } from "react-hook-form";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ProductFormValues } from "../product.schema";

interface ShippingSectionProps {
    form: UseFormReturn<ProductFormValues>;
}

export const ShippingSection = ({ form }: ShippingSectionProps) => {
    return (
        <Card>
            <CardHeader><CardTitle>Shipping & Delivery</CardTitle></CardHeader>
            <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="shipping.physicalProperties.weight"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Weight (kg)</FormLabel>
                                <FormControl>
                                    <Input type="number" {...field} onChange={e => field.onChange(parseFloat(e.target.value))} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <div className="space-y-2">
                        {/* requiresShipping not in schema, removing for now or could Map to !isDigital */}
                        <FormField
                            control={form.control}
                            name="attributes.isFragile"
                            render={({ field }) => (
                                <FormItem className="flex flex-row items-center space-x-3 space-y-0 border p-3 rounded-md">
                                    <FormControl>
                                        <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                                    </FormControl>
                                    <FormLabel>Fragile Item</FormLabel>
                                </FormItem>
                            )}
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <FormLabel>Dimensions (cm)</FormLabel>
                    <div className="grid grid-cols-3 gap-4">
                        <FormField
                            control={form.control}
                            name="shipping.physicalProperties.dimensions.length"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <Input placeholder="Length" type="number" {...field} onChange={e => field.onChange(parseFloat(e.target.value))} />
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="shipping.physicalProperties.dimensions.width"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <Input placeholder="Width" type="number" {...field} onChange={e => field.onChange(parseFloat(e.target.value))} />
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="shipping.physicalProperties.dimensions.height"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <Input placeholder="Height" type="number" {...field} onChange={e => field.onChange(parseFloat(e.target.value))} />
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
                    <FormField
                        control={form.control}
                        name="shipping.delivery.estimatedDeliveryBangla"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Estimated Delivery (Bangla Text)</FormLabel>
                                <FormControl>
                                    <Input placeholder="e.g. ২-৩ দিনের মধ্যে ডেলিভারি" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <div className="space-y-4">
                        <FormField
                            control={form.control}
                            name="shipping.delivery.installationAvailable"
                            render={({ field }) => (
                                <FormItem className="flex flex-row items-center space-x-3 space-y-0 border p-3 rounded-md mt-6">
                                    <FormControl>
                                        <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                                    </FormControl>
                                    <FormLabel>Installation Available</FormLabel>
                                </FormItem>
                            )}
                        />
                        {form.watch("shipping.delivery.installationAvailable") && (
                            <FormField
                                control={form.control}
                                name="shipping.delivery.installationCost"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Installation Cost</FormLabel>
                                        <FormControl>
                                            <Input type="number" placeholder="Cost" {...field} onChange={e => field.onChange(parseFloat(e.target.value))} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        )}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};
