import { UseFormReturn } from "react-hook-form";
import { FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ProductFormValues } from "../product.schema";

interface InventorySectionProps {
    form: UseFormReturn<ProductFormValues>;
}

export const InventorySection = ({ form }: InventorySectionProps) => {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Inventory Management</CardTitle>
                <CardDescription>
                    Stock levels are managed automatically via <b>Purchases</b> and <b>Sales</b>.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="p-3 bg-muted/50 border rounded-md text-sm text-muted-foreground">
                    <p>To increase stock, please create a new <b>Purchase</b>. To decrease, make a <b>Sale</b>.</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="inventory.inventory.stock"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Current Stock</FormLabel>
                                <FormControl>
                                    <Input
                                        type="number"
                                        {...field}
                                        readOnly
                                        className="bg-muted cursor-not-allowed font-semibold"
                                        title="System managed field"
                                    />
                                </FormControl>
                                <FormDescription>Global stock across all outlets.</FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="inventory.inventory.lowStockThreshold"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Low Stock Alert Level</FormLabel>
                                <FormControl>
                                    <Input type="number" {...field} onChange={e => field.onChange(parseFloat(e.target.value))} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
                <div className="space-y-2">
                    <FormField
                        control={form.control}
                        name="inventory.inventory.trackQuantity"
                        render={({ field }) => (
                            <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                                <FormControl>
                                    <Checkbox
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                    />
                                </FormControl>
                                <FormLabel>Track Quantity</FormLabel>
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="inventory.inventory.allowBackorder"
                        render={({ field }) => (
                            <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                                <FormControl>
                                    <Checkbox
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                    />
                                </FormControl>
                                <FormLabel>Allow Backorders (Continue selling when out of stock)</FormLabel>
                            </FormItem>
                        )}
                    />
                </div>
            </CardContent>
        </Card>
    );
};
