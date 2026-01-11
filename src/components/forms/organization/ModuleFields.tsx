"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Settings2 } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { FormControl, FormField, FormItem } from "@/components/ui/form";
import { useFormContext } from "react-hook-form";
import { MODULE_OPTIONS } from "@/constant/modules";

interface ModuleFieldsProps {
    prefix?: string; // e.g. "activeModules"
}

export function ModuleFields({ prefix = "activeModules" }: ModuleFieldsProps) {
    const { control } = useFormContext();
    const getName = (name: string) => prefix ? `${prefix}.${name}` : name;

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><Settings2 className="h-5 w-5" /> Module Configuration</CardTitle>
                <CardDescription>Enable or disable major business systems for this entity.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {MODULE_OPTIONS.map((module) => (
                    <FormField
                        key={module.value}
                        control={control}
                        name={getName(module.value)}
                        render={({ field }) => (
                            <FormItem className="flex items-center justify-between p-4 rounded-lg border bg-card hover:border-primary/50 transition-all group">
                                <div className="space-y-0.5">
                                    <Label className="capitalize font-semibold group-hover:text-primary transition-colors cursor-pointer" htmlFor={getName(module.value)}>
                                        {module.label}
                                    </Label>
                                    <p className="text-[10px] text-muted-foreground">Toggle {module.value} capabilities</p>
                                </div>
                                <FormControl>
                                    <Switch
                                        id={getName(module.value)}
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                    />
                                </FormControl>
                            </FormItem>
                        )}
                    />
                ))}
            </CardContent>
        </Card>
    );
}
