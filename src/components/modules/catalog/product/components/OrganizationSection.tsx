
import { UseFormReturn } from "react-hook-form";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ProductFormValues } from "../product.schema";
import { ModuleMultiSelect } from "@/components/forms/module-multi-select";

interface OrganizationSectionProps {
    form: UseFormReturn<ProductFormValues>;
    units: any[];
    businessUnits?: any[]; // Optional, mostly for Super Admin
    isLocked?: boolean;
}

export const OrganizationSection = ({ form, units, businessUnits, isLocked }: OrganizationSectionProps) => {
    return (
        <Card>
            <CardHeader><CardTitle>Organization & Status</CardTitle></CardHeader>
            <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    {/* Super Admin / Business Unit Selection */}
                    {businessUnits && (
                        <FormField
                            control={form.control}
                            name="businessUnit"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Business Unit</FormLabel>
                                    <Select
                                        key={field.value || "global"}
                                        onValueChange={field.onChange}
                                        value={field.value || ""}
                                        disabled={isLocked} // Disable if locked by context
                                    >
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select Business Unit (Optional)" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="global">Global (No Business Unit)</SelectItem>
                                            {businessUnits.map((bu: any) => (
                                                <SelectItem key={bu._id || bu.id} value={bu._id || bu.id}>
                                                    {bu.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    )}

                    <FormField
                        control={form.control}
                        name="unit"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Unit of Measure</FormLabel>
                                <Select key={field.value || "empty"} onValueChange={field.onChange} value={field.value || ""}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select Unit" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {units?.map((unit: any) => (
                                            <SelectItem key={unit._id || unit.id} value={unit._id || unit.id}>
                                                {unit.name} ({unit.symbol || unit.name})
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="statusInfo.status"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Product Status</FormLabel>
                                <Select key={field.value || "empty"} onValueChange={field.onChange} value={field.value}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select Status" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="draft">Draft</SelectItem>
                                        <SelectItem value="published">Published</SelectItem>
                                        <SelectItem value="under_review">Under Review</SelectItem>
                                        <SelectItem value="suspended">Suspended</SelectItem>
                                        <SelectItem value="archived">Archived</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <ModuleMultiSelect
                        name="availableModules"
                        label="Available Modules"
                        placeholder="Select where this product is available..."
                        include={['pos', 'ecommerce', 'logistics', 'crm', 'marketing', 'integrations']}
                    />
                </div>

                <div className="space-y-4">
                    <FormLabel>Marketing Flags</FormLabel>
                    <div className="flex flex-wrap gap-4">
                        <FormField
                            control={form.control}
                            name="marketing.isFeatured"
                            render={({ field }) => (
                                <FormItem className="flex flex-row items-center space-x-3 space-y-0 border p-3 rounded-md">
                                    <FormControl>
                                        <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                                    </FormControl>
                                    <FormLabel>Featured Product</FormLabel>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="marketing.isNew"
                            render={({ field }) => (
                                <FormItem className="flex flex-row items-center space-x-3 space-y-0 border p-3 rounded-md">
                                    <FormControl>
                                        <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                                    </FormControl>
                                    <FormLabel>New Arrival</FormLabel>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="marketing.isBestSeller"
                            render={({ field }) => (
                                <FormItem className="flex flex-row items-center space-x-3 space-y-0 border p-3 rounded-md">
                                    <FormControl>
                                        <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                                    </FormControl>
                                    <FormLabel>Best Seller</FormLabel>
                                </FormItem>
                            )}
                        />
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};
