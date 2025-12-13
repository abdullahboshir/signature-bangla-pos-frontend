
import { UseFormReturn } from "react-hook-form";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ProductFormValues } from "../product.schema";

interface ComplianceSectionProps {
    form: UseFormReturn<ProductFormValues>;
}

export const ComplianceSection = ({ form }: ComplianceSectionProps) => {
    return (
        <Card>
            <CardHeader><CardTitle>Compliance & Safety</CardTitle></CardHeader>
            <CardContent className="space-y-4">
                <FormField
                    control={form.control}
                    name="compliance.certifications"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Certifications (Comma separated)</FormLabel>
                            <FormControl>
                                <Input
                                    placeholder="ISO 9001, CE"
                                    value={field.value?.join(", ") || ""}
                                    onChange={(e) => field.onChange(e.target.value.split(",").map(t => t.trim()).filter(Boolean))}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="compliance.safetyStandards"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Safety Standards (Comma separated)</FormLabel>
                            <FormControl>
                                <Input
                                    placeholder="ASTM F963, EN 71"
                                    value={field.value?.join(", ") || ""}
                                    onChange={(e) => field.onChange(e.target.value.split(",").map(t => t.trim()).filter(Boolean))}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                {/*  Add more compliance fields here if needed e.g., ageRestriction */}
            </CardContent>
        </Card>
    );
};
