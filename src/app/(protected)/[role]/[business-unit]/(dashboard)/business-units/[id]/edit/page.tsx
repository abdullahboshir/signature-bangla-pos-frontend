"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { ArrowLeft, Save, Loader2, ChevronsUpDown, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { Switch } from "@/components/ui/switch";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList
} from "@/components/ui/command";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useGetBusinessUnitByIdQuery, useUpdateBusinessUnitMutation } from "@/redux/api/businessUnitApi";
import { useGetAttributeGroupsQuery } from "@/redux/api/attributeGroupApi";
import Swal from "sweetalert2";
import { BUSINESS_UNIT_STATUS, BUSINESS_UNIT_STATUS_OPTIONS, BUSINESS_UNIT_TYPE, BUSINESS_UNIT_TYPE_OPTIONS } from "@/constant/business-unit.constant";

export default function EditBusinessUnitPage() {
    const router = useRouter();
    const params = useParams();
    const id = params?.id as string;
    const { data: businessUnit, isLoading: isFetching } = useGetBusinessUnitByIdQuery(id);
    const [updateBusinessUnit, { isLoading: isSaving }] = useUpdateBusinessUnitMutation();
    const { data: attributeGroups } = useGetAttributeGroupsQuery(undefined);

    const { register, handleSubmit, control, setValue, reset, watch, formState: { errors } } = useForm({
        defaultValues: {
            name: "",
            description: "",
            email: "",
            phone: "",
            city: "",
            country: "",
            status: "",
            type: "",
            attributeGroups: [] as string[],
            features: {
                hasInventory: true,
                hasVariants: true,
                hasAttributeGroups: true,
                hasShipping: true,
                hasSeo: true,
                hasCompliance: true,
                hasBundles: true,
                hasWarranty: true
            }
        }
    });

    // console.log('data', data)

    useEffect(() => {
        if (!businessUnit) return;

        // Parse attribute groups - can be array of objects or strings
        let initialGroups = [];
        if (businessUnit.attributeGroups && Array.isArray(businessUnit.attributeGroups)) {
            initialGroups = businessUnit.attributeGroups.map((g: any) => typeof g === 'object' ? g._id : g);
        } else if (businessUnit.attributeGroup) {
            // Fallback for legacy single group
            initialGroups = [typeof businessUnit.attributeGroup === 'object' ? businessUnit.attributeGroup._id : businessUnit.attributeGroup];
        }

        reset({
            name: businessUnit.branding?.name ?? businessUnit.name ?? "",
            description: businessUnit.branding?.description ?? "",
            email: businessUnit.contact?.email ?? "",
            phone: businessUnit.contact?.phone ?? "",
            city: businessUnit.location?.city ?? "",
            country: businessUnit.location?.country ?? "",
            status: businessUnit.status,
            type: businessUnit.businessUnitType,
            attributeGroups: initialGroups,
            features: {
                hasInventory: businessUnit.features?.hasInventory ?? true,
                hasVariants: businessUnit.features?.hasVariants ?? true,
                hasAttributeGroups: businessUnit.features?.hasAttributeGroups ?? true,
                hasShipping: businessUnit.features?.hasShipping ?? true,
                hasSeo: businessUnit.features?.hasSeo ?? true,
                hasCompliance: businessUnit.features?.hasCompliance ?? true,
                hasBundles: businessUnit.features?.hasBundles ?? true,
                hasWarranty: businessUnit.features?.hasWarranty ?? true,
            }
        });
    }, [businessUnit, reset]);



    const onSubmit = async (data: any) => {
        try {

            const payload = {
                name: data.name, // Top level name often required
                branding: {
                    name: data.name,
                    description: data.description || `Business unit for ${data.name}`
                },
                contact: { email: data.email, phone: data.phone },
                location: { city: data.city, country: data.country },

                status: data.status,
                businessUnitType: data.type,
                attributeGroups: data.attributeGroups,
                features: data.features
            };

            const response: any = await updateBusinessUnit({ id, body: payload }).unwrap();

            if (response?.success || response?.data?.success) {
                Swal.fire({
                    icon: 'success',
                    title: 'Updated!',
                    text: 'Business unit updated successfully',
                    timer: 1500,
                    showConfirmButton: false
                });
                router.back();
            }
        } catch (error: any) {
            console.error("Update error", error);
            // Show more detailed error if available
            const errorMsg = error?.data?.message || "Failed to update business unit";
            Swal.fire("Error", errorMsg, "error");
        }
    };

    if (isFetching) {
        return <div className="flex h-screen items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
    }

    return (
        <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
            <div className="flex items-center space-x-2">
                <Button variant="ghost" size="icon" onClick={() => router.back()}>
                    <ArrowLeft className="h-4 w-4" />
                </Button>
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Edit Business Unit</h2>
                    <p className="text-muted-foreground">Update business unit information.</p>
                </div>
            </div>

            <Card>
                <CardContent className="pt-6">
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="name">Business Name</Label>
                                <Input id="name" {...register("name", { required: true })} />
                                {errors.name && <span className="text-sm text-red-500">Name is required</span>}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="description">Description</Label>
                                <Input id="description" {...register("description")} />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="status">Status</Label>

                                <Controller
                                    name="status"
                                    control={control}
                                    render={({ field }) => (
                                        <Select
                                            key={field.value} // 🔥 THIS IS THE FIX
                                            value={field.value || undefined}
                                            onValueChange={field.onChange}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select status" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {BUSINESS_UNIT_STATUS_OPTIONS.map((status) => (
                                                    <SelectItem key={status.value} value={status.value}>
                                                        {status.label}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    )}
                                />

                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="type">Type</Label>
                                <Controller
                                    name="type"
                                    control={control}
                                    render={({ field }) => (
                                        <Select
                                            key={field.value} // 🔥 THIS IS THE FIX
                                            value={field.value || undefined}
                                            onValueChange={field.onChange}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select type" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {BUSINESS_UNIT_TYPE_OPTIONS.map((type) => (
                                                    <SelectItem key={type.value} value={type.value}>
                                                        {type.label}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    )}
                                />

                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="attributeGroups">Product Attribute Templates</Label>
                                <Controller
                                    name="attributeGroups"
                                    control={control}
                                    render={({ field }) => (
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <Button
                                                    variant="outline"
                                                    role="combobox"
                                                    className="w-full justify-between h-auto min-h-[40px]"
                                                >
                                                    {field.value?.length > 0
                                                        ? `${field.value.length} selected`
                                                        : "Select attribute templates"}
                                                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-full p-0">
                                                <Command>
                                                    <CommandInput placeholder="Search templates..." />
                                                    <CommandList>
                                                        <CommandEmpty>No template found.</CommandEmpty>
                                                        <CommandGroup>
                                                            {attributeGroups?.data?.map((group: any) => (
                                                                <CommandItem
                                                                    key={group._id}
                                                                    value={group.name}
                                                                    onSelect={() => {
                                                                        const current = field.value || [];
                                                                        const isSelected = current.includes(group._id);
                                                                        if (isSelected) {
                                                                            field.onChange(current.filter((id: string) => id !== group._id));
                                                                        } else {
                                                                            field.onChange([...current, group._id]);
                                                                        }
                                                                    }}
                                                                >
                                                                    <Check
                                                                        className={cn(
                                                                            "mr-2 h-4 w-4",
                                                                            field.value?.includes(group._id)
                                                                                ? "opacity-100"
                                                                                : "opacity-0"
                                                                        )}
                                                                    />
                                                                    {group.name}
                                                                </CommandItem>
                                                            ))}
                                                        </CommandGroup>
                                                    </CommandList>
                                                </Command>
                                            </PopoverContent>
                                        </Popover>
                                    )}
                                />
                                <div className="flex flex-wrap gap-1 mt-2">
                                    {(watch("attributeGroups") || []).map((id: string) => {
                                        const group = attributeGroups?.data?.find((g: any) => g._id === id);
                                        return group ? (
                                            <span key={id} className="bg-secondary text-secondary-foreground text-xs px-2 py-1 rounded-md">
                                                {group.name}
                                            </span>
                                        ) : null;
                                    })}
                                </div>
                            </div>

                            {/* Feature Configuration Section */}
                            <div className="col-span-2 mt-6">
                                <h3 className="text-lg font-medium mb-4">Module Configuration</h3>
                                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                                    <div className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                                        <div className="space-y-0.5">
                                            <Label>Inventory Management</Label>
                                            <p className="text-sm text-muted-foreground">Track stock levels</p>
                                        </div>
                                        <Controller
                                            name="features.hasInventory"
                                            control={control}
                                            render={({ field }) => (
                                                <Switch checked={field.value} onCheckedChange={field.onChange} />
                                            )}
                                        />
                                    </div>
                                    <div className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                                        <div className="space-y-0.5">
                                            <Label>Product Variants</Label>
                                            <p className="text-sm text-muted-foreground">Size, Color, etc.</p>
                                        </div>
                                        <Controller
                                            name="features.hasVariants"
                                            control={control}
                                            render={({ field }) => (
                                                <Switch checked={field.value} onCheckedChange={field.onChange} />
                                            )}
                                        />
                                    </div>
                                    <div className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                                        <div className="space-y-0.5">
                                            <Label>Dynamic Attributes</Label>
                                            <p className="text-sm text-muted-foreground">Custom fields from groups</p>
                                        </div>
                                        <Controller
                                            name="features.hasAttributeGroups"
                                            control={control}
                                            render={({ field }) => (
                                                <Switch checked={field.value} onCheckedChange={field.onChange} />
                                            )}
                                        />
                                    </div>
                                    <div className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                                        <div className="space-y-0.5">
                                            <Label>Shipping</Label>
                                            <p className="text-sm text-muted-foreground">Dimensions & Weight</p>
                                        </div>
                                        <Controller
                                            name="features.hasShipping"
                                            control={control}
                                            render={({ field }) => (
                                                <Switch checked={field.value} onCheckedChange={field.onChange} />
                                            )}
                                        />
                                    </div>
                                    <div className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                                        <div className="space-y-0.5">
                                            <Label>SEO Settings</Label>
                                            <p className="text-sm text-muted-foreground">Meta tags & keywords</p>
                                        </div>
                                        <Controller
                                            name="features.hasSeo"
                                            control={control}
                                            render={({ field }) => (
                                                <Switch checked={field.value} onCheckedChange={field.onChange} />
                                            )}
                                        />
                                    </div>
                                    <div className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                                        <div className="space-y-0.5">
                                            <Label>Compliance Info</Label>
                                            <p className="text-sm text-muted-foreground">Safety & Warnings</p>
                                        </div>
                                        <Controller
                                            name="features.hasCompliance"
                                            control={control}
                                            render={({ field }) => (
                                                <Switch checked={field.value} onCheckedChange={field.onChange} />
                                            )}
                                        />
                                    </div>
                                    <div className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                                        <div className="space-y-0.5">
                                            <Label>Product Bundles</Label>
                                            <p className="text-sm text-muted-foreground">Combo offers</p>
                                        </div>
                                        <Controller
                                            name="features.hasBundles"
                                            control={control}
                                            render={({ field }) => (
                                                <Switch checked={field.value} onCheckedChange={field.onChange} />
                                            )}
                                        />
                                    </div>
                                    <div className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                                        <div className="space-y-0.5">
                                            <Label>Warranty Info</Label>
                                            <p className="text-sm text-muted-foreground">Warranty terms</p>
                                        </div>
                                        <Controller
                                            name="features.hasWarranty"
                                            control={control}
                                            render={({ field }) => (
                                                <Switch checked={field.value} onCheckedChange={field.onChange} />
                                            )}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input id="email" type="email" {...register("email", { required: true })} />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="phone">Phone</Label>
                                <Input id="phone" {...register("phone")} />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="city">City</Label>
                                <Input id="city" {...register("city")} />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="country">Country</Label>
                                <Input id="country" {...register("country")} />
                            </div>

                        </div>
                        <div className="flex justify-end space-x-2">
                            <Button variant="outline" type="button" onClick={() => router.back()}>Cancel</Button>
                            <Button type="submit" disabled={isSaving}>
                                {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Save Changes
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
