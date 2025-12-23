
import { UseFormReturn } from "react-hook-form";
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ProductFormValues } from "../product.schema";

interface PricingSectionProps {
    form: UseFormReturn<ProductFormValues>;
    handlePriceChange: (type: 'cost' | 'selling' | 'margin', value: string) => void;
}

export const PricingSection = ({ form, handlePriceChange }: PricingSectionProps) => {
    return (
        <Card>
            <CardHeader><CardTitle>Pricing & Tax</CardTitle></CardHeader>
            <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <FormField
                        control={form.control}
                        name="pricing.costPrice"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Cost Price</FormLabel>
                                <FormControl>
                                    <Input
                                        type="number"
                                        {...field}
                                        value={field.value === 0 ? '' : field.value}
                                        onChange={e => {
                                            field.onChange(e.target.value === '' ? '' : parseFloat(e.target.value));
                                            handlePriceChange('cost', e.target.value);
                                        }}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="pricing.profitMarginType"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Profit Type</FormLabel>
                                <Select onValueChange={(val) => {
                                    field.onChange(val);
                                    const currentMargin = form.getValues("pricing.profitMargin");
                                    handlePriceChange('margin', String(currentMargin));
                                }} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="percentage">Percentage (%)</SelectItem>
                                        <SelectItem value="fixed">Fixed Amount</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="pricing.profitMargin"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Profit Margin</FormLabel>
                                <FormControl>
                                    <Input
                                        type="number"
                                        {...field}
                                        value={field.value === 0 ? '' : field.value}
                                        onChange={e => {
                                            field.onChange(e.target.value === '' ? '' : parseFloat(e.target.value));
                                            handlePriceChange('margin', e.target.value);
                                        }}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="pricing.basePrice"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Selling Price</FormLabel>
                                <FormControl>
                                    <Input
                                        type="number"
                                        {...field}
                                        value={field.value === 0 ? '' : field.value}
                                        onChange={e => {
                                            field.onChange(e.target.value === '' ? '' : parseFloat(e.target.value));
                                            handlePriceChange('selling', e.target.value);
                                        }}
                                    />
                                </FormControl>
                                <FormDescription className="text-xs">Auto-calculated</FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <FormField
                        control={form.control}
                        name="pricing.currency"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Currency</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="BDT">BDT</SelectItem>
                                        <SelectItem value="USD">USD</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
                <Separator />
                <div className="grid grid-cols-3 gap-4 items-end">
                    <FormField
                        control={form.control}
                        name="pricing.tax.taxClass"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Tax Class</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="standard">Standard</SelectItem>
                                        <SelectItem value="reduced">Reduced</SelectItem>
                                        <SelectItem value="zero">Zero-Rated</SelectItem>
                                    </SelectContent>
                                </Select>
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="pricing.tax.taxRate"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Tax Rate (%)</FormLabel>
                                <FormControl>
                                    <Input
                                        type="number"
                                        {...field}
                                        onChange={e => field.onChange(e.target.value === '' ? '' : parseFloat(e.target.value))}

                                    />
                                </FormControl>
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="pricing.tax.taxInclusive"
                        render={({ field }) => (
                            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                                <FormControl>
                                    <Checkbox
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                    />
                                </FormControl>
                                <div className="space-y-1 leading-none">
                                    <FormLabel>Tax Inclusive</FormLabel>
                                </div>
                            </FormItem>
                        )}
                    />
                </div>
            </CardContent>
        </Card>
    );
};
