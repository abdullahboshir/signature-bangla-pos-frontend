import { UseFormReturn } from "react-hook-form";
import { ProductFormValues } from "../product.schema";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, X } from "lucide-react";

interface RelatedProductsProps {
    form: UseFormReturn<ProductFormValues>;
}

export const RelatedProducts = ({ form }: RelatedProductsProps) => {
    // Ideally this would be a searchable dropdown
    // For now, we allow adding Product IDs manually or via a future modal

    const crossSell = form.watch("crossSellProducts") || [];
    const upsell = form.watch("upsellProducts") || [];

    const addId = (field: "crossSellProducts" | "upsellProducts", id: string) => {
        if (!id) return;
        const current = form.getValues(field) || [];
        if (!current.includes(id)) {
            form.setValue(field, [...current, id]);
        }
    };

    const removeId = (field: "crossSellProducts" | "upsellProducts", id: string) => {
        const current = form.getValues(field) || [];
        form.setValue(field, current.filter(itemId => itemId !== id));
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Related Products (Cross-Sell & Upsell)</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">

                {/* Cross Sell Section */}
                <div className="space-y-4 border p-4 rounded-md">
                    <h3 className="font-semibold text-sm">Frequently Bought Together (Cross-Sell)</h3>
                    <div className="flex gap-2">
                        <Input
                            placeholder="Enter Product ID (Future: Search)"
                            id="cross-input"
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    e.preventDefault();
                                    addId("crossSellProducts", e.currentTarget.value);
                                    e.currentTarget.value = "";
                                }
                            }}
                        />
                        <Button type="button" variant="outline" onClick={() => {
                            const el = document.getElementById("cross-input") as HTMLInputElement;
                            addId("crossSellProducts", el.value);
                            el.value = "";
                        }}>Add</Button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {crossSell.map((id, idx) => (
                            <div key={idx} className="bg-secondary text-secondary-foreground px-3 py-1 rounded-full flex items-center gap-2 text-sm">
                                <span>{id}</span>
                                <button type="button" onClick={() => removeId("crossSellProducts", id)}>
                                    <X className="h-3 w-3" />
                                </button>
                            </div>
                        ))}
                        {crossSell.length === 0 && <span className="text-muted-foreground text-xs">No products selected</span>}
                    </div>
                </div>

                {/* Upsell Section */}
                <div className="space-y-4 border p-4 rounded-md">
                    <h3 className="font-semibold text-sm">Better Alternatives (Upsell)</h3>
                    <div className="flex gap-2">
                        <Input
                            placeholder="Enter Product ID (Future: Search)"
                            id="upsell-input"
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    e.preventDefault();
                                    addId("upsellProducts", e.currentTarget.value);
                                    e.currentTarget.value = "";
                                }
                            }}
                        />
                        <Button type="button" variant="outline" onClick={() => {
                            const el = document.getElementById("upsell-input") as HTMLInputElement;
                            addId("upsellProducts", el.value);
                            el.value = "";
                        }}>Add</Button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {upsell.map((id, idx) => (
                            <div key={idx} className="bg-secondary text-secondary-foreground px-3 py-1 rounded-full flex items-center gap-2 text-sm">
                                <span>{id}</span>
                                <button type="button" onClick={() => removeId("upsellProducts", id)}>
                                    <X className="h-3 w-3" />
                                </button>
                            </div>
                        ))}
                        {upsell.length === 0 && <span className="text-muted-foreground text-xs">No products selected</span>}
                    </div>
                </div>

            </CardContent>
        </Card>
    );
};
