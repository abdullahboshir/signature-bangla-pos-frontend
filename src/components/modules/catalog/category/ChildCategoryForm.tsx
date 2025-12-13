"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

import { categoryService } from "@/services/catalog/category.service";

const formSchema = z.object({
    name: z.string().min(1, "Name is required").max(50),
    slug: z.string().min(1, "Slug is required"),
    subCategory: z.string().min(1, "Sub-Category is required"),
    description: z.string().max(200).optional(),
    isActive: z.boolean().default(true),
});

type FormValues = z.infer<typeof formSchema>;

interface ChildCategoryFormProps {
    initialData?: any;
    businessUnitId: string;
    onSuccess?: () => void;
}

export function ChildCategoryForm({ initialData, businessUnitId, onSuccess }: ChildCategoryFormProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [subCategories, setSubCategories] = useState<any[]>([]);
    const router = useRouter();

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema) as any,
        defaultValues: {
            name: initialData?.name || "",
            slug: initialData?.slug || "",
            subCategory: initialData?.subCategory?._id || initialData?.subCategory || "",
            description: initialData?.description || "",
            isActive: initialData?.isActive ?? true,
        },
    });

    useEffect(() => {
        const loadSubs = async () => {
            try {
                const data = await categoryService.getAllSub({ limit: 100 });
                setSubCategories(data);
            } catch (e) {
                toast.error("Failed to load sub-categories");
            }
        };
        loadSubs();
    }, []);

    const onSubmit = async (data: FormValues) => {
        setIsLoading(true);
        try {
            const payload = { ...data, businessUnit: businessUnitId };

            if (initialData?._id) {
                await categoryService.updateChild(initialData._id, payload);
                toast.success("Child-Category updated successfully");
            } else {
                await categoryService.createChild(payload);
                toast.success("Child-Category created successfully");
            }

            if (onSuccess) {
                onSuccess();
            } else {
                router.refresh();
            }
        } catch (error: any) {
            console.error(error);
            toast.error(error?.response?.data?.message || "Something went wrong");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">

                <FormField
                    control={form.control}
                    name="subCategory"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Sub-Category</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select Sub-Category" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {subCategories.map((c) => (
                                        <SelectItem key={c._id} value={c._id}>{c.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Child-Category Name</FormLabel>
                            <FormControl>
                                <Input placeholder="e.g. Android Phones" {...field} onChange={e => {
                                    field.onChange(e);
                                    if (!initialData) {
                                        form.setValue("slug", e.target.value.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, ''));
                                    }
                                }} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="slug"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Slug</FormLabel>
                            <FormControl>
                                <Input placeholder="e.g. gaming-laptops" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Description</FormLabel>
                            <FormControl>
                                <Textarea placeholder="Short description..." {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="isActive"
                    render={({ field }) => (
                        <FormItem className="flex flex-row items-center space-x-3 space-y-0 rounded-md border p-4">
                            <FormControl>
                                <Checkbox
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                                <FormLabel>Active</FormLabel>
                            </div>
                        </FormItem>
                    )}
                />

                <Button type="submit" disabled={isLoading} className="w-full">
                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {initialData ? "Update Child-Category" : "Create Child-Category"}
                </Button>
            </form>
        </Form>
    );
}
