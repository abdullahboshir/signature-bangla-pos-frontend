"use client";

import InputField from "@/components/forms/InputField";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { MapPin } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FormControl, FormField, FormItem } from "@/components/ui/form";
import { useFormContext } from "react-hook-form";

interface LocationFieldsProps {
    prefix?: string; // e.g. "location"
}

export function LocationFields({ prefix = "" }: LocationFieldsProps) {
    const { control } = useFormContext();
    const getName = (name: string) => prefix ? `${prefix}.${name}` : name;

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><MapPin className="h-5 w-5" /> Physical Address & Logistics</CardTitle>
                <CardDescription>Exact location and operational geographic data.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <InputField
                    name={getName("address")}
                    label="Street Address"
                    placeholder="House #, Road #, Area..."
                    required
                />
                <div className="grid gap-4 md:grid-cols-3">
                    <InputField name={getName("city")} label="City" required />
                    <InputField name={getName("state")} label="State / Province" />
                    <InputField name={getName("postalCode")} label="Postal Code" />
                </div>
                <div className="grid gap-4 md:grid-cols-4 pt-4 border-t">
                    <InputField name={getName("country")} label="Country" />

                    <FormField
                        control={control}
                        name={getName("timezone")}
                        render={({ field }) => (
                            <FormItem>
                                <Label>Timezone</Label>
                                <Select onValueChange={field.onChange} defaultValue={field.value || "Asia/Dhaka"}>
                                    <FormControl>
                                        <SelectTrigger><SelectValue /></SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="Asia/Dhaka">Asia/Dhaka (GMT+6)</SelectItem>
                                        <SelectItem value="UTC">UTC (Universal)</SelectItem>
                                        <SelectItem value="Asia/Dubai">Asia/Dubai (GMT+4)</SelectItem>
                                        <SelectItem value="Europe/London">Europe/London (GMT+0)</SelectItem>
                                    </SelectContent>
                                </Select>
                            </FormItem>
                        )}
                    />

                    <InputField name={getName("coordinates.lat")} label="Latitude (GPS)" type="number" placeholder="23.8..." />
                    <InputField name={getName("coordinates.lng")} label="Longitude (GPS)" type="number" placeholder="90.4..." />
                </div>
            </CardContent>
        </Card>
    );
}
