"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { ArrowLeft, Check, ChevronsUpDown, Loader2, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { axiosInstance } from "@/lib/axios/axiosInstance";
import Swal from "sweetalert2";

// Hardcoded types removed

export default function EditUnitPage() {
    const router = useRouter();
    const params = useParams();
    const id = params?.id as string;
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [openCombobox, setOpenCombobox] = useState(false);
    const [businessTypes, setBusinessTypes] = useState<{ label: string; value: string }[]>([]);

    const { register, handleSubmit, control, setValue, watch, formState: { errors } } = useForm({
        defaultValues: {
            name: "",
            symbol: "",
            status: "active",
            relatedBusinessTypes: [] as string[]
        }
    });

    const selectedTypes = watch("relatedBusinessTypes");

    useEffect(() => {
        const fetchData = async () => {
            if (!id) return;
            try {
                const [unitResponse, businessUnitResponse] = await Promise.all([
                    axiosInstance.get(`/super-admin/units/${id}`),
                    axiosInstance.get('/super-admin/business-unit')
                ]);

                // Handle Business Types
                if (businessUnitResponse?.data?.success || businessUnitResponse?.data) {
                    const data = Array.isArray(businessUnitResponse?.data) ? businessUnitResponse.data : businessUnitResponse?.data?.data || [];
                    const options = data.map((bu: any) => ({
                        label: bu.name,
                        value: bu.name
                    })).filter((v: any, i: any, a: any) => a.findIndex((t: any) => t.value === v.value) === i);
                    setBusinessTypes(options);
                }

                // Handle Unit Data
                const data = unitResponse?.data?.data || unitResponse?.data;
                if (data) {
                    setValue("name", data.name || "");
                    setValue("symbol", data.symbol || "");
                    setValue("status", data.status || "active");
                    setValue("relatedBusinessTypes", data.relatedBusinessTypes || []);
                }
            } catch (error) {
                console.error("Fetch error", error);
                Swal.fire("Error", "Failed to fetch details", "error");
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [id, setValue]);

    const toggleType = (value: string) => {
        const current = selectedTypes || [];
        if (current.includes(value)) {
            setValue("relatedBusinessTypes", current.filter((i) => i !== value));
        } else {
            setValue("relatedBusinessTypes", [...current, value]);
        }
    };

    const onSubmit = async (data: any) => {
        try {
            setIsSaving(true);
            const response: any = await axiosInstance.patch(`/super-admin/units/${id}`, data);

            if (response?.success) {
                Swal.fire({
                    icon: 'success',
                    title: 'Updated!',
                    text: 'Measurement unit updated successfully',
                    timer: 1500,
                    showConfirmButton: false
                });
                router.back();
            }
        } catch (error: any) {
            console.error("Update error", error);
            const errorMessage = error?.response?.data?.message || error?.message || "Failed to update unit";
            Swal.fire({
                icon: "error",
                title: "Error",
                text: errorMessage,
            });
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return <div className="flex h-screen items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
    }

    return (
        <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
            <div className="flex items-center space-x-2 mb-6">
                <Button variant="ghost" size="icon" onClick={() => router.back()}>
                    <ArrowLeft className="h-4 w-4" />
                </Button>
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Edit Measurement Unit</h2>
                    <p className="text-muted-foreground">Update measurement unit details.</p>
                </div>
            </div>

            <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Unit Details</CardTitle>
                        <CardDescription>
                            Basic information about the measurement unit.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                            <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="name">Unit Name <span className="text-red-500">*</span></Label>
                                        <Input id="name" {...register("name", { required: true })} />
                                        {errors.name && <span className="text-sm text-red-500">Name is required</span>}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="symbol">Symbol <span className="text-red-500">*</span></Label>
                                        <Input id="symbol" {...register("symbol", { required: true })} />
                                        {errors.symbol && <span className="text-sm text-red-500">Symbol is required</span>}
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label>Business Types (Optional)</Label>
                                    <CardDescription className="mb-2">Select which business types this unit applies to. Leave empty for all.</CardDescription>

                                    <Popover open={openCombobox} onOpenChange={setOpenCombobox}>
                                        <PopoverTrigger asChild>
                                            <Button
                                                variant="outline"
                                                role="combobox"
                                                aria-expanded={openCombobox}
                                                className="w-full justify-between"
                                            >
                                                {selectedTypes?.length > 0
                                                    ? `${selectedTypes.length} selected`
                                                    : "Select business types..."}
                                                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-full p-0">
                                            <Command>
                                                <CommandInput placeholder="Search business type..." />
                                                <CommandList>
                                                    <CommandEmpty>No type found.</CommandEmpty>
                                                    <CommandGroup>
                                                        {businessTypes.map((type) => (
                                                            <CommandItem
                                                                key={type.value}
                                                                value={type.value}
                                                                onSelect={() => toggleType(type.value)}
                                                            >
                                                                <Check
                                                                    className={cn(
                                                                        "mr-2 h-4 w-4",
                                                                        selectedTypes?.includes(type.value)
                                                                            ? "opacity-100"
                                                                            : "opacity-0"
                                                                    )}
                                                                />
                                                                {type.label}
                                                            </CommandItem>
                                                        ))}
                                                    </CommandGroup>
                                                </CommandList>
                                            </Command>
                                        </PopoverContent>
                                    </Popover>

                                    <div className="flex flex-wrap gap-2 mt-3">
                                        {selectedTypes?.map((type) => (
                                            <Badge key={type} variant="secondary" className="px-2 py-1">
                                                {type}
                                                <button
                                                    type="button"
                                                    className="ml-2 ring-offset-background rounded-full outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                                                    onClick={() => toggleType(type)}
                                                >
                                                    <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                                                </button>
                                            </Badge>
                                        ))}
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="status">Status</Label>
                                    <Controller
                                        name="status"
                                        control={control}
                                        render={({ field }) => (
                                            <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select status" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="active">Active</SelectItem>
                                                    <SelectItem value="inactive">Inactive</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        )}
                                    />
                                </div>
                            </div>

                            <div className="flex justify-end space-x-2 pt-4">
                                <Button variant="outline" type="button" onClick={() => router.back()}>Cancel</Button>
                                <Button type="submit" disabled={isSaving}>
                                    {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                    Save Changes
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>

                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Preview</CardTitle>
                            <CardDescription>How this unit might appear.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center justify-between p-4 border rounded-lg bg-card text-card-foreground shadow-sm">
                                <div className="space-y-1">
                                    <div className="text-xl font-semibold">{watch("name") || "Unit Name"}</div>
                                    <div className="text-sm text-muted-foreground">Symbol: {watch("symbol") || "sym"}</div>
                                </div>
                                <Badge variant={watch("status") === "active" ? "default" : "secondary"}>
                                    {watch("status")}
                                </Badge>
                            </div>
                            {selectedTypes?.length > 0 && (
                                <div className="mt-4">
                                    <p className="text-sm font-medium mb-2 text-muted-foreground">Visible to:</p>
                                    <div className="flex flex-wrap gap-1">
                                        {selectedTypes.map(t => <Badge key={t} variant="outline" className="text-xs">{t}</Badge>)}
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
