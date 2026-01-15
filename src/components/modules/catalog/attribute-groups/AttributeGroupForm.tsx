"use client";

import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trash2, Plus, GripVertical } from "lucide-react";
import { TagInput } from "@/components/shared/TagInput";
import { useEffect } from "react";
import { Separator } from "@/components/ui/separator";

const FIELD_TYPES = [
    { value: "text", label: "Text" },
    { value: "number", label: "Number" },
    { value: "date", label: "Date" },
    { value: "boolean", label: "Yes/No" },
    { value: "select", label: "Dropdown" },
    { value: "textarea", label: "Text Area" },
];

const attributeFieldSchema = z.object({
    key: z.string().min(1, "Key is required"),
    label: z.string().min(1, "Label is required"),
    type: z.enum(["text", "number", "date", "boolean", "select", "textarea"]),
    required: z.boolean().optional(),
    options: z.array(z.string()).optional(),
    placeholder: z.string().optional(),
});

// ... imports
import { ModuleSelect } from "@/components/forms/module-select";
import { MODULES } from "@/constant/modules";

// ...

const attributeGroupSchema = z.object({
    name: z.string().min(1, "Name is required"),
    module: z.string().min(1, "Module is required"),
    description: z.string().optional(),
    isActive: z.boolean().optional(),
    fields: z.array(attributeFieldSchema).min(1, "At least one field is required"),
});

type AttributeGroupFormValues = z.infer<typeof attributeGroupSchema>;

interface AttributeGroupFormProps {
    initialData?: any;
    onSubmit: (data: AttributeGroupFormValues) => void;
    isLoading?: boolean;
}

export function AttributeGroupForm({ initialData, onSubmit, isLoading }: AttributeGroupFormProps) {
    const form = useForm<AttributeGroupFormValues>({
        resolver: zodResolver(attributeGroupSchema),
        defaultValues: initialData || {
            name: "",
            module: MODULES,
            description: "",
            isActive: true,
            fields: [{ key: "", label: "", type: "text", required: false }],
        },
    });

    useEffect(() => {
        if (initialData) {
            form.reset(initialData);
        }
    }, [initialData, form]);

    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: "fields",
    });

    // Watch for label changes to auto-generate keys
    const watchFields = form.watch("fields");

    // Helper to slugify user input for keys
    const generateKey = (label: string) => {
        return label
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/(^-|-$)+/g, "");
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Basic Information</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Group Name</FormLabel>
                                        <FormControl>
                                            <Input placeholder="e.g., Pharmacy Attributes" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <ModuleSelect
                                name="module"
                                label="Module Scope"
                                placeholder="Select which module this group belongs to"
                            />

                            <FormField
                                control={form.control}
                                name="description"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Description</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Description of this group..." {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="isActive"
                                render={({ field }) => (
                                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                        <div className="space-y-0.5">
                                            <FormLabel className="text-base">Active Status</FormLabel>
                                            <FormDescription>
                                                Disable if you want to hide this group from selection.
                                            </FormDescription>
                                        </div>
                                        <FormControl>
                                            <Switch
                                                checked={field.value}
                                                onCheckedChange={field.onChange}
                                            />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                        </CardContent>
                    </Card>
                </div>

                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-semibold">Form Fields</h2>
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => append({ key: "", label: "", type: "text", required: false })}
                        >
                            <Plus className="mr-2 h-4 w-4" />
                            Add Field
                        </Button>
                    </div>

                    <div className="grid grid-cols-1 gap-4">
                        {fields.map((field, index) => (
                            <Card key={field.id}>
                                <CardContent className="p-4">
                                    <div className="grid grid-cols-12 gap-4 items-start">
                                        <div className="col-span-1 flex items-center justify-center pt-3">
                                            <GripVertical className="h-5 w-5 text-muted-foreground cursor-grab" />
                                        </div>

                                        <div className="col-span-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                            {/* Label Input */}
                                            <FormField
                                                control={form.control}
                                                name={`fields.${index}.label`}
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel className="text-xs">Label</FormLabel>
                                                        <FormControl>
                                                            <Input
                                                                {...field}
                                                                placeholder="Display Label"
                                                                onChange={(e) => {
                                                                    field.onChange(e);
                                                                    // Auto-generate key if key is empty or matches previous slug
                                                                    const currentKey = form.getValues(`fields.${index}.key`);
                                                                    const newKey = generateKey(e.target.value);
                                                                    if (!currentKey || currentKey === generateKey(field.value)) {
                                                                        form.setValue(`fields.${index}.key`, newKey);
                                                                    }
                                                                }}
                                                            />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />

                                            {/* Key Input */}
                                            <FormField
                                                control={form.control}
                                                name={`fields.${index}.key`}
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel className="text-xs">Key (API)</FormLabel>
                                                        <FormControl>
                                                            <Input {...field} placeholder="api_key" />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />

                                            {/* Type Select */}
                                            <FormField
                                                control={form.control}
                                                name={`fields.${index}.type`}
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel className="text-xs">Type</FormLabel>
                                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                            <FormControl>
                                                                <SelectTrigger>
                                                                    <SelectValue placeholder="Select type" />
                                                                </SelectTrigger>
                                                            </FormControl>
                                                            <SelectContent>
                                                                {FIELD_TYPES.map((type) => (
                                                                    <SelectItem key={type.value} value={type.value}>
                                                                        {type.label}
                                                                    </SelectItem>
                                                                ))}
                                                            </SelectContent>
                                                        </Select>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />

                                            {/* Required Switch */}
                                            <FormField
                                                control={form.control}
                                                name={`fields.${index}.required`}
                                                render={({ field }) => (
                                                    <FormItem className="flex flex-row items-center justify-start gap-2 rounded-lg border p-2 mt-2">
                                                        <FormControl>
                                                            <Switch
                                                                checked={field.value}
                                                                onCheckedChange={field.onChange}
                                                            />
                                                        </FormControl>
                                                        <FormLabel className="text-xs m-0">Required</FormLabel>
                                                    </FormItem>
                                                )}
                                            />
                                        </div>

                                        <div className="col-span-1 flex items-center justify-center pt-2">
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="icon"
                                                className="text-destructive"
                                                onClick={() => remove(index)}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>

                                        {/* Conditional Options for Select Type */}
                                        {watchFields[index]?.type === "select" && (
                                            <div className="col-span-12 pl-10 pr-2">
                                                <FormField
                                                    control={form.control}
                                                    name={`fields.${index}.options`}
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel className="text-xs">Options</FormLabel>
                                                            <FormControl>
                                                                <TagInput
                                                                    placeholder="Type option and press enter..."
                                                                    value={field.value || []}
                                                                    onChange={(tags) => field.onChange(tags)}
                                                                />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                            </div>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>

                <Button type="submit" disabled={isLoading} className="w-full md:w-auto">
                    {isLoading ? "Saving..." : "Save Attribute Group"}
                </Button>
            </form>
        </Form>
    );
}
