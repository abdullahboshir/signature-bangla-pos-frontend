
import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function VariantGenerator({ onGenerate }: { onGenerate: (variants: any[]) => void }) {
    const [attributes, setAttributes] = useState<{ name: string; values: string[] }[]>([
        { name: "Size", values: [] },
        { name: "Color", values: [] }
    ]);

    const addAttribute = () => {
        setAttributes([...attributes, { name: "", values: [] }]);
    };

    const removeAttribute = (index: number) => {
        const newAttrs = [...attributes];
        newAttrs.splice(index, 1);
        setAttributes(newAttrs);
    };

    const updateAttributeName = (index: number, name: string) => {
        const newAttrs = [...attributes];
        newAttrs[index].name = name;
        setAttributes(newAttrs);
    };

    const addValue = (index: number, value: string) => {
        if (!value.trim()) return;
        const newAttrs = [...attributes];
        if (!newAttrs[index].values.includes(value)) {
            newAttrs[index].values.push(value);
        }
        setAttributes(newAttrs);
    };

    const removeValue = (attrIndex: number, valIndex: number) => {
        const newAttrs = [...attributes];
        newAttrs[attrIndex].values.splice(valIndex, 1);
        setAttributes(newAttrs);
    };

    const handleGenerate = () => {
        // Cartesian Product Logic
        const validAttributes = attributes.filter(a => a.name && a.values.length > 0);

        if (validAttributes.length === 0) {
            toast.error("Please add at least one attribute with values.");
            return;
        }

        const cartesian = (args: any[][]) => {
            const r: any[] = [];
            const max = args.length - 1;
            function helper(arr: any[], i: number) {
                for (let j = 0, l = args[i].length; j < l; j++) {
                    const a = arr.slice(0); // clone arr
                    a.push(args[i][j]);
                    if (i === max)
                        r.push(a);
                    else
                        helper(a, i + 1);
                }
            }
            helper([], 0);
            return r;
        };

        const combinations = cartesian(validAttributes.map(a => a.values.map(v => ({ name: a.name, value: v }))));

        const generatedVariants = combinations.map(combo => {
            const name = combo.map((c: any) => c.value).join(" - "); // e.g. "Small - Red"
            return {
                name: name,
                sku: "", // User to fill or auto-generate
                price: 0,
                stock: 0,
                options: combo, // [{name: 'Size', value: 'Small'}, {name: 'Color', value: 'Red'}]
                isDefault: false
            };
        });

        onGenerate(generatedVariants);
        toast.success(`Generated ${generatedVariants.length} variants!`);
    };

    return (
        <div className="space-y-4 border p-4 rounded bg-background">
            {attributes.map((attr, idx) => (
                <div key={idx} className="space-y-2">
                    <div className="flex gap-2 items-start">
                        <div className="flex-1">
                            <label className="text-xs font-medium">Attribute Name (e.g. Size)</label>
                            <Input
                                value={attr.name}
                                onChange={(e) => updateAttributeName(idx, e.target.value)}
                                placeholder="Attribute Name"
                            />
                        </div>
                        <Button type="button" variant="ghost" size="icon" className="mt-5" onClick={() => removeAttribute(idx)}>
                            <Trash2 className="h-4 w-4 text-muted-foreground" />
                        </Button>
                    </div>

                    <div className="flex flex-wrap gap-2 items-center pl-2 border-l-2">
                        {attr.values.map((val, vIdx) => (
                            <span key={vIdx} className="bg-secondary text-secondary-foreground px-2 py-1 rounded text-xs flex items-center gap-1">
                                {val}
                                <button type="button" onClick={() => removeValue(idx, vIdx)} className="hover:text-destructive">×</button>
                            </span>
                        ))}
                        <div className="flex items-center gap-1">
                            <Input
                                className="h-7 w-24 text-xs"
                                placeholder="Value..."
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        e.preventDefault();
                                        addValue(idx, e.currentTarget.value);
                                        e.currentTarget.value = "";
                                    }
                                }}
                            />
                            <Button type="button" variant="ghost" size="icon" className="h-7 w-7" onClick={(e) => {
                                const input = e.currentTarget.previousElementSibling as HTMLInputElement;
                                addValue(idx, input.value);
                                input.value = "";
                            }}>
                                <Plus className="h-3 w-3" />
                            </Button>
                        </div>
                    </div>
                </div>
            ))}

            <div className="flex gap-2 pt-2">
                <Button type="button" variant="secondary" size="sm" onClick={addAttribute}>
                    <Plus className="mr-2 h-3 w-3" /> Add Attribute
                </Button>
                <Button type="button" size="sm" onClick={handleGenerate}>
                    Generate Variants
                </Button>
            </div>
        </div>
    );
}
