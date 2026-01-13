"use client";

import { useEffect } from "react";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Settings2 } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { FormControl, FormField, FormItem } from "@/components/ui/form";
import { useFormContext } from "react-hook-form";
import { MODULE_OPTIONS } from "@/constant/modules";

interface ModuleFieldsProps {
    prefix?: string; // e.g. "activeModules"
    allowedModules?: Record<string, boolean>; // Modules enabled in parent level
}

export function ModuleFields({ prefix = "activeModules", allowedModules }: ModuleFieldsProps) {
    const { control, setValue, watch } = useFormContext();
    const getName = (name: string) => prefix ? `${prefix}.${name}` : name;

    // Effect to force-disable modules that are not allowed by parent
    const currentValues = watch(prefix);
    useEffect(() => {
        if (!allowedModules) return;

        Object.keys(currentValues || {}).forEach((key) => {
            // If it's enabled here but NOT explicitly enabled in parent, force off
            if (allowedModules[key] !== true && currentValues?.[key] === true) {
                setValue(getName(key), false);
            }
        });
    }, [allowedModules, currentValues, setValue, prefix]);

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><Settings2 className="h-5 w-5" /> Module Configuration</CardTitle>
                <CardDescription>Enable or disable major business systems for this entity.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {MODULE_OPTIONS.map((module) => {
                    const isAllowed = allowedModules ? allowedModules[module.value] === true : true;

                    return (
                        <FormField
                            key={module.value}
                            control={control}
                            name={getName(module.value)}
                            render={({ field }) => (
                                <FormItem className={cn(
                                    "flex items-center justify-between p-4 rounded-lg border bg-card transition-all group",
                                    !isAllowed ? "opacity-60 bg-muted/50 cursor-not-allowed" : "hover:border-primary/50"
                                )}>
                                    <div className="space-y-0.5">
                                        <div className="flex items-center gap-2">
                                            <Label
                                                className={cn(
                                                    "capitalize font-semibold transition-colors",
                                                    isAllowed ? "group-hover:text-primary cursor-pointer" : "text-muted-foreground"
                                                )}
                                                htmlFor={getName(module.value)}
                                            >
                                                {module.label}
                                            </Label>
                                            {!isAllowed && (
                                                <span className="text-[8px] bg-amber-100 text-amber-700 px-1 rounded font-bold uppercase tracking-wider">
                                                    Locked by Parent
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-[10px] text-muted-foreground">
                                            {!isAllowed ? "Enforce by organization license" : `Toggle ${module.value} capabilities`}
                                        </p>
                                    </div>
                                    <FormControl>
                                        <Switch
                                            id={getName(module.value)}
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                            disabled={!isAllowed}
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                    );
                })}
            </CardContent>
        </Card>
    );
}
