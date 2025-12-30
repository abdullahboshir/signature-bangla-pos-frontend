import { useState } from "react";

export interface Attribute {
    name: string;
    values: string[];
}

export interface VariantOption {
    name: string;
    value: string;
}

export interface GeneratedVariant {
    name: string;
    sku: string;
    price: number;
    stock: number;
    images: string[];
    options: VariantOption[];
    isDefault: boolean;
}

export const useVariantGenerator = () => {
    const [attributes, setAttributes] = useState<Attribute[]>([
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

    const setValues = (index: number, values: string[]) => {
        const newAttrs = [...attributes];
        // Merge unique values
        values.forEach(v => {
            if (!newAttrs[index].values.includes(v)) {
                newAttrs[index].values.push(v);
            }
        });
        setAttributes(newAttrs);
    }

    const generateVariants = (): { success: boolean; variants: GeneratedVariant[]; error?: string } => {
        // Cartesian Product Logic
        const validAttributes = attributes.filter(a => a.name && a.values.length > 0);

        if (validAttributes.length === 0) {
            return { success: false, variants: [], error: "Please add values (e.g., S, M) to your attributes before generating variants." };
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
                images: [],
                options: combo, // [{name: 'Size', value: 'Small'}, {name: 'Color', value: 'Red'}]
                isDefault: false
            };
        });

        return { success: true, variants: generatedVariants };
    };

    return {
        attributes,
        setAttributes, // In case we need raw access
        addAttribute,
        removeAttribute,
        updateAttributeName,
        addValue,
        removeValue,
        setValues,
        generateVariants
    };
};
