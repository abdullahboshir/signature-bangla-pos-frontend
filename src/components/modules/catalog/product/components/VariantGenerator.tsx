import { useState } from "react";
import { Plus, Trash2, Check } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCreateAttributeMutation, useGetAttributesQuery } from "@/redux/api/catalog/attributeApi";
import { AutoFormModal } from "@/components/shared/AutoFormModal";
import { TagInput } from "@/components/shared/TagInput";
import { Controller } from "react-hook-form";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { useVariantGenerator } from "../hooks/useVariantGenerator";

export function VariantGenerator({ onGenerate }: { onGenerate: (variants: any[]) => void }) {
    const { data: globalAttributes = [] } = useGetAttributesQuery({ limit: 100, status: 'active' });
    const [createAttribute, { isLoading: isCreating }] = useCreateAttributeMutation();
    const [isCreateAttributeOpen, setIsCreateAttributeOpen] = useState(false);

    // Use Custom Hook for Business Logic
    const {
        attributes,
        addAttribute,
        removeAttribute,
        updateAttributeName,
        addValue,
        removeValue,
        setValues,
        generateVariants
    } = useVariantGenerator();

    // Helper to find global values for a given attribute name
    const getGlobalValuesRaw = (attrName: string) => {
        const found = globalAttributes.find((ga: any) => ga.name.toLowerCase() === attrName.toLowerCase());
        return found ? found.values : [];
    };

    const handleGenerate = () => {
        const result = generateVariants();
        if (result.success) {
            onGenerate(result.variants);
            toast.success(`Generated ${result.variants.length} variants!`);
        } else {
            toast.error(result.error);
        }
    };

    const handleCreateAttribute = async (data: any) => {
        try {
            await createAttribute(data).unwrap();
            toast.success("Attribute created successfully");
            setIsCreateAttributeOpen(false);
            // No need to manually refetch, tags will handle it, and globalAttributes will update
        } catch (error: any) {
            console.error(error);
            toast.error(error?.data?.message || "Failed to create attribute");
        }
    };

    return (
        <>
            <div className="space-y-3 border p-2 rounded bg-background">
                {attributes.map((attr, idx) => {
                    const globalValues = getGlobalValuesRaw(attr.name);
                    const suggestedValues = globalValues.filter((v: string) => !attr.values.includes(v));

                    return (
                        <div key={idx} className="space-y-2 border-b pb-3 last:border-0 last:pb-0">
                            <div className="flex gap-4 items-start">
                                {/* Flex Row Container for Name and Values */}
                                <div className="flex-1 flex flex-col md:flex-row gap-2">
                                    {/* Left Column: Attribute Name */}
                                    <div className="md:w-[200px] flex flex-col gap-1.5">
                                        <label className="text-xs font-medium text-muted-foreground">Attribute Name</label>
                                        <div className="flex gap-2 items-center w-full">
                                            <Popover>
                                                <PopoverTrigger asChild>
                                                    <Button
                                                        variant="outline"
                                                        role="combobox"
                                                        className={cn(
                                                            "w-full justify-between flex-1",
                                                            !attr.name && "text-muted-foreground"
                                                        )}
                                                    >
                                                        {attr.name || "Select Attribute"}
                                                        <div className="opacity-50" />
                                                    </Button>
                                                </PopoverTrigger>
                                                <PopoverContent className="w-[200px] p-0">
                                                    <Command>
                                                        <CommandInput placeholder="Search attributes..." />
                                                        <CommandList>
                                                            <CommandEmpty>No attribute found.</CommandEmpty>
                                                            <CommandGroup heading="Global Attributes">
                                                                {globalAttributes.map((ga: any) => (
                                                                    <CommandItem
                                                                        key={ga._id}
                                                                        value={ga.name}
                                                                        onSelect={(currentValue) => {
                                                                            updateAttributeName(idx, ga.name);
                                                                        }}
                                                                    >
                                                                        <Check
                                                                            className={cn(
                                                                                "mr-2 h-4 w-4",
                                                                                attr.name === ga.name ? "opacity-100" : "opacity-0"
                                                                            )}
                                                                        />
                                                                        {ga.name}
                                                                    </CommandItem>
                                                                ))}
                                                            </CommandGroup>
                                                        </CommandList>
                                                    </Command>
                                                </PopoverContent>
                                            </Popover>

                                            <Button
                                                type="button"
                                                variant="outline"
                                                size="icon"
                                                className="shrink-0"
                                                onClick={() => setIsCreateAttributeOpen(true)}
                                                title="Create new global attribute"
                                            >
                                                <Plus className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>

                                    {/* Right Column: Values */}
                                    <div className="flex-1 flex flex-col gap-1.5">
                                        <label className="text-xs font-medium text-muted-foreground">Attribute Values</label>
                                        <div className="flex flex-wrap gap-2 items-center px-3 py-2 rounded-md border border-input bg-background min-h-[40px] focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 ring-offset-background">
                                            {attr.values.map((val, vIdx) => (
                                                <Badge key={vIdx} variant="secondary" className="px-2 py-0.5 text-xs gap-1">
                                                    {val}
                                                    <button
                                                        type="button"
                                                        onClick={() => removeValue(idx, vIdx)}
                                                        className="ml-1 text-muted-foreground hover:text-destructive transition-colors rounded-full"
                                                    >
                                                        ×
                                                    </button>
                                                </Badge>
                                            ))}

                                            <div className="flex items-center gap-1 min-w-[100px] flex-1">
                                                <Input
                                                    className="h-6 text-xs focus-visible:ring-0 border-0 bg-transparent p-0 placeholder:text-muted-foreground w-full"
                                                    placeholder="Type value..."
                                                    onKeyDown={(e) => {
                                                        if (e.key === 'Enter') {
                                                            e.preventDefault();
                                                            addValue(idx, e.currentTarget.value);
                                                            e.currentTarget.value = "";
                                                        }
                                                    }}
                                                />
                                            </div>
                                        </div>

                                        {/* Suggestions from Global */}
                                        {suggestedValues.length > 0 && (
                                            <div className="flex flex-wrap gap-1.5 mt-1">
                                                <div className="flex items-center gap-1.5">
                                                    <span className="text-[10px] text-muted-foreground self-center">Quick Add:</span>
                                                    <Badge
                                                        variant="outline"
                                                        className="cursor-pointer hover:bg-primary hover:text-primary-foreground text-[10px] font-normal transition-colors px-1.5 py-0 border-dashed"
                                                        onClick={() => {
                                                            const currentValues = attr.values;
                                                            const newValues = [...currentValues];
                                                            suggestedValues.forEach((v: string) => {
                                                                if (!newValues.includes(v)) {
                                                                    newValues.push(v);
                                                                }
                                                            });
                                                            setValues(idx, newValues);
                                                        }}
                                                    >
                                                        + Add All
                                                    </Badge>
                                                </div>
                                                {suggestedValues.map((sVal: string) => (
                                                    <Badge
                                                        key={sVal}
                                                        variant="outline"
                                                        className="cursor-pointer hover:bg-secondary text-[10px] font-normal transition-colors px-1.5 py-0"
                                                        onClick={() => addValue(idx, sVal)}
                                                    >
                                                        + {sVal}
                                                    </Badge>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    className="mt-6 text-muted-foreground hover:text-destructive shrink-0"
                                    onClick={() => removeAttribute(idx)}
                                    title="Remove Attribute Group"
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    );
                })}

                <div className="flex gap-2 pt-2">
                    <Button type="button" variant="secondary" size="sm" onClick={addAttribute}>
                        <Plus className="mr-2 h-3 w-3" /> Add Another Attribute
                    </Button>
                    <Button type="button" size="sm" onClick={handleGenerate}>
                        Generate Variants
                    </Button>
                </div>
            </div>

            <AutoFormModal
                open={isCreateAttributeOpen}
                onOpenChange={setIsCreateAttributeOpen}
                title="Add New Attribute"
                description="Create a new global attribute (e.g., Size, Material)."
                fields={[
                    { name: "name", label: "Name", type: "text", required: true, placeholder: "e.g. Material" },
                    {
                        name: "values",
                        label: "Values",
                        type: "custom",
                        required: true,
                        render: ({ control, name }) => (
                            <Controller
                                name={name}
                                control={control}
                                rules={{ required: "At least one value is required" }}
                                render={({ field: { value, onChange } }) => (
                                    <TagInput
                                        value={value || []}
                                        onChange={onChange}
                                        placeholder="Type value and press Enter (e.g. Cotton)"
                                    />
                                )}
                            />
                        )
                    },
                    {
                        name: "status",
                        label: "Status",
                        type: "select",
                        options: [
                            { label: "Active", value: "active" },
                            { label: "Inactive", value: "inactive" }
                        ],
                        defaultValue: "active",
                        required: true
                    }
                ]}
                defaultValues={{ status: "active", values: [] }}
                onSubmit={handleCreateAttribute}
                submitLabel={isCreating ? "Creating..." : "Create"}
            />
        </>
    );
}

