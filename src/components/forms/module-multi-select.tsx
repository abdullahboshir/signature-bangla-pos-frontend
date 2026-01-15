import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command";
import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { MODULE_OPTIONS, getModuleOptions, ModuleType } from "@/constant/modules";
import { cn } from "@/lib/utils";
import { Check, ChevronsUpDown, X } from "lucide-react";
import React from "react";
import { useFormContext } from "react-hook-form";

interface ModuleMultiSelectProps {
    name?: string;
    label?: string;
    placeholder?: string;
    exclude?: ModuleType[];
    include?: ModuleType[];
    className?: string;
    value?: string[];
    onChange?: (value: string[]) => void;
    disabled?: boolean;
}

export const ModuleMultiSelect = ({
    name = "availableModules",
    label = "Available Modules",
    placeholder = "Select modules...",
    exclude = [],
    include,
    className,
    value: controlledValue,
    onChange: controlledOnChange,
    disabled = false,
}: ModuleMultiSelectProps) => {
    const formContext = useFormContext();
    const [open, setOpen] = React.useState(false);
    const options = getModuleOptions(exclude).filter(opt =>
        include ? include.includes(opt.value) : true
    );

    // Render function for the inner content to avoid code duplication
    const renderSelect = (value: string[], onChange: (val: string[]) => void) => {
        const handleSelect = (val: string) => {
            if (value.includes(val)) {
                onChange(value.filter((v) => v !== val));
            } else {
                onChange([...value, val]);
            }
        };

        const handleRemove = (val: string, e: React.MouseEvent) => {
            e.stopPropagation();
            if (disabled) return;
            onChange(value.filter((v) => v !== val));
        };

        return (
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        role="combobox"
                        disabled={disabled}
                        className={cn(
                            "w-full justify-between h-auto min-h-[40px]",
                            !value.length && "text-muted-foreground",
                            className
                        )}
                    >
                        <div className="flex flex-wrap gap-1">
                            {value.length === 0 && placeholder}
                            {value.map((val) => {
                                const option = options.find((o) => o.value === val);
                                return (
                                    <Badge key={val} variant="secondary" className="mr-1">
                                        {option?.label || val}
                                        <div
                                            className="ml-1 ring-offset-background rounded-full outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 cursor-pointer"
                                            onMouseDown={(e) => {
                                                e.preventDefault();
                                                e.stopPropagation();
                                            }}
                                            onClick={(e) => handleRemove(val, e)}
                                        >
                                            <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                                        </div>
                                    </Badge>
                                );
                            })}
                        </div>
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
                    <Command>
                        <CommandInput placeholder="Search modules..." />
                        <CommandList>
                            <CommandEmpty>No module found.</CommandEmpty>
                            <CommandGroup>
                                <CommandItem
                                    onSelect={() => {
                                        if (value.length === options.length) {
                                            onChange([]);
                                        } else {
                                            onChange(options.map((o) => o.value));
                                        }
                                    }}
                                    className="font-medium border-b mb-1"
                                >
                                    <div
                                        className={cn(
                                            "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                                            value.length === options.length
                                                ? "bg-primary text-primary-foreground"
                                                : "opacity-50 [&_svg]:invisible"
                                        )}
                                    >
                                        <Check className={cn("h-4 w-4")} />
                                    </div>
                                    <span>Select All</span>
                                </CommandItem>

                                {options.map((option) => {
                                    const isSelected = value.includes(option.value);
                                    return (
                                        <CommandItem
                                            key={option.value}
                                            value={option.label}
                                            onSelect={() => handleSelect(option.value)}
                                        >
                                            <div
                                                className={cn(
                                                    "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                                                    isSelected
                                                        ? "bg-primary text-primary-foreground"
                                                        : "opacity-50 [&_svg]:invisible"
                                                )}
                                            >
                                                <Check className={cn("h-4 w-4")} />
                                            </div>
                                            <span>{option.label}</span>
                                        </CommandItem>
                                    );
                                })}
                            </CommandGroup>
                        </CommandList>
                    </Command>
                </PopoverContent>
            </Popover>
        );
    };

    // Controlled Mode (No FormContext)
    if (controlledValue !== undefined && controlledOnChange !== undefined) {
        return (
            <div className={cn("w-full", className)}>
                {label && <Label className="mb-2 block text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">{label}</Label>}
                {renderSelect(controlledValue, controlledOnChange)}
            </div>
        );
    }

    // Form Context Mode
    if (formContext) {
        return (
            <FormField
                control={formContext.control}
                name={name}
                render={({ field }) => (
                    <FormItem className={cn("w-full", className)}>
                        <FormLabel>{label}</FormLabel>
                        <FormControl>
                            {renderSelect(Array.isArray(field.value) ? field.value : [], field.onChange)}
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
        );
    }

    return <div>Error: ModuleMultiSelect requires either value/onChange or FormContext.</div>;
};
