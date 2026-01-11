"use client";

import InputField from "@/components/forms/InputField";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Globe, Palette } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FormControl, FormField, FormItem } from "@/components/ui/form";
import { useFormContext } from "react-hook-form";

interface BrandingFieldsProps {
    prefix?: string; // e.g. "branding"
}

export function BrandingFields({ prefix = "" }: BrandingFieldsProps) {
    const { control } = useFormContext();
    const getName = (name: string) => prefix ? `${prefix}.${name}` : name;

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><Globe className="h-5 w-5" /> Branding & Identity</CardTitle>
                <CardDescription>Customize the visual presence and identity.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-4">
                        <InputField
                            name={getName("name")}
                            label="Branding Name"
                            placeholder="e.g. Acme Corp"
                            required
                        />
                        <InputField
                            name={getName("tagline")}
                            label="Tagline"
                            placeholder="e.g. Quality you can trust"
                        />
                        <InputField
                            name={getName("description")}
                            label="Description"
                            isMultiline
                            placeholder="Tell customers about your business..."
                        />
                    </div>
                    <div className="space-y-4">
                        <InputField
                            name={getName("logoUrl")}
                            label="Logo URL"
                            placeholder="https://..."
                        />
                        <InputField
                            name={getName("bannerUrl")}
                            label="Banner URL"
                            placeholder="https://..."
                        />
                        <InputField
                            name={getName("faviconUrl")}
                            label="Favicon URL"
                            placeholder="https://..."
                        />
                    </div>
                </div>

                <div className="pt-6 border-t">
                    <h3 className="text-sm font-medium mb-4 flex items-center gap-2"><Palette className="h-4 w-4 text-primary" /> Visual Theme Settings</h3>
                    <div className="grid gap-4 md:grid-cols-4">
                        <ThemeColorField name={getName("theme.primaryColor")} label="Primary Color" />
                        <ThemeColorField name={getName("theme.secondaryColor")} label="Secondary Color" />
                        <ThemeColorField name={getName("theme.accentColor")} label="Accent Color" />

                        <FormField
                            control={control}
                            name={getName("theme.fontFamily")}
                            render={({ field }) => (
                                <FormItem>
                                    <Label>Font Family</Label>
                                    <Select onValueChange={field.onChange} defaultValue={field.value || "Inter"}>
                                        <FormControl>
                                            <SelectTrigger><SelectValue /></SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="Inter">Inter</SelectItem>
                                            <SelectItem value="Roboto">Roboto</SelectItem>
                                            <SelectItem value="Open Sans">Open Sans</SelectItem>
                                            <SelectItem value="Poppins">Poppins</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </FormItem>
                            )}
                        />
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

function ThemeColorField({ name, label }: { name: string; label: string }) {
    const { control } = useFormContext();
    return (
        <FormField
            control={control}
            name={name}
            render={({ field }) => (
                <FormItem>
                    <Label>{label}</Label>
                    <div className="flex gap-2">
                        <FormControl>
                            <input
                                type="color"
                                {...field}
                                className="w-12 h-10 p-1 rounded-md border bg-background cursor-pointer"
                            />
                        </FormControl>
                        <FormControl>
                            <input
                                type="text"
                                {...field}
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            />
                        </FormControl>
                    </div>
                </FormItem>
            )}
        />
    );
}
