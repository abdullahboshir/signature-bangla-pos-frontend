
import { UseFormReturn } from "react-hook-form";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ProductFormValues } from "../product.schema";

interface BundleSectionProps {
    form: UseFormReturn<ProductFormValues>;
}

export const BundleSection = ({ form }: BundleSectionProps) => {
    return (
        <Card>
            <CardHeader><CardTitle>Bundle Configuration</CardTitle></CardHeader>
            <CardContent className="space-y-4">
                <FormField
                    control={form.control}
                    name="isBundle"
                    render={({ field }) => (
                        <FormItem className="flex flex-row items-center space-x-3 space-y-0 border p-3 rounded-md">
                            <FormControl>
                                <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                            </FormControl>
                            <FormLabel>Is Item Bundle?</FormLabel>
                        </FormItem>
                    )}
                />

                {form.watch("isBundle") && (
                    <FormField
                        control={form.control}
                        name="bundleDiscount"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Bundle Discount (%)</FormLabel>
                                <FormControl>
                                    <Input type="number" {...field} onChange={e => field.onChange(parseFloat(e.target.value))} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                )}
            </CardContent>
        </Card>
    );
};
