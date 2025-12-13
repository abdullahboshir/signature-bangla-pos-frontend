
import { UseFormReturn } from "react-hook-form";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ProductFormValues } from "../product.schema";

interface SeoSectionProps {
    form: UseFormReturn<ProductFormValues>;
}

export const SeoSection = ({ form }: SeoSectionProps) => {
    return (
        <Card>
            <CardHeader><CardTitle>Search Engine Optimization (SEO)</CardTitle></CardHeader>
            <CardContent className="space-y-4">
                <FormField
                    control={form.control}
                    name="marketing.seo.metaTitle"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Meta Title</FormLabel>
                            <FormControl>
                                <Input placeholder="SEO Title" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="marketing.seo.metaDescription"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Meta Description</FormLabel>
                            <FormControl>
                                <Textarea placeholder="SEO Description" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="marketing.seo.keywords"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Meta Keywords (Comma separated)</FormLabel>
                            <FormControl>
                                <Input
                                    placeholder="keyword1, keyword2"
                                    value={field.value?.join(", ") || ""}
                                    onChange={(e) => field.onChange(e.target.value.split(",").map(t => t.trim()).filter(Boolean))}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            </CardContent>
        </Card>
    );
};
