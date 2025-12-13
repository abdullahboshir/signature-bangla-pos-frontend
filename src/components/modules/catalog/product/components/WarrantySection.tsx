
import { UseFormReturn } from "react-hook-form";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ProductFormValues } from "../product.schema";

interface WarrantySectionProps {
    form: UseFormReturn<ProductFormValues>;
}

export const WarrantySection = ({ form }: WarrantySectionProps) => {
    return (
        <Card className="mt-4">
            <CardHeader><CardTitle>Warranty & Return Policy</CardTitle></CardHeader>
            <CardContent className="grid grid-cols-2 gap-4">
                <FormField
                    control={form.control}
                    name="warranty.warranty.hasWarranty"
                    render={({ field }) => (
                        <FormItem className="flex flex-row items-center space-x-3 space-y-0 border p-3 rounded-md">
                            <FormControl>
                                <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                            </FormControl>
                            <FormLabel>Has Warranty?</FormLabel>
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="warranty.warranty.duration"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Duration (Months)</FormLabel>
                            <FormControl>
                                <Input type="number" {...field} onChange={e => field.onChange(parseFloat(e.target.value))} />
                            </FormControl>
                        </FormItem>
                    )}
                />
            </CardContent>
        </Card>
    );
};
