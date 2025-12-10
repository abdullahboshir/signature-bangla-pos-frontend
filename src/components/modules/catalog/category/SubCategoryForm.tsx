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
    category: z.string().min(1, "Parent Category is required"),
    description: z.string().max(200).optional(),
    isActive: z.boolean().default(true),
});

type FormValues = z.infer<typeof formSchema>;

interface SubCategoryFormProps {
    initialData?: any;
    businessUnitId: string;
    onSuccess?: () => void;
}

export function SubCategoryForm({ initialData, businessUnitId, onSuccess }: SubCategoryFormProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [categories, setCategories] = useState<any[]>([]);
    const router = useRouter();

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema) as any,
        defaultValues: {
            name: initialData?.name || "",
            category: initialData?.category?._id || initialData?.category || "",
            description: initialData?.description || "",
            isActive: initialData?.isActive ?? true,
        },
    });

    useEffect(() => {
        const loadCats = async () => {
            try {
                const data = await categoryService.getAll({ limit: 100 });
                setCategories(data);
            } catch (e) {
                toast.error("Failed to load parent categories");
            }
        };
        loadCats();
    }, []);

    const onSubmit = async (data: FormValues) => {
        setIsLoading(true);
        try {
            const payload = { ...data, businessUnit: businessUnitId };

            if (initialData?._id) {
                await categoryService.updateSub(initialData._id, payload);
                toast.success("Sub-Category updated successfully");
            } else {
                await categoryService.createSub(payload);
                toast.success("Sub-Category created successfully");
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
                    name="category"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Parent Category</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select Parent Category" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {categories.map((c) => (
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
                            <FormLabel>Sub-Category Name</FormLabel>
                            <FormControl>
                                <Input placeholder="e.g. Mobile Phones" {...field} />
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
                    {initialData ? "Update Sub-Category" : "Create Sub-Category"}
                </Button>
            </form>
        </Form>
    );
}
