"use client";

import { useEffect } from "react";
import { useForm, Controller, FieldValues, Path, FormProvider } from "react-hook-form";
import { Loader2, ChevronsUpDown, Check, X } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
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
import { Textarea } from "@/components/ui/textarea";
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
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

import { format } from "date-fns";
import { Calendar as CalendarIcon, UploadCloud } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";

import { AutoFormModalProps } from "@/types/auto-form";

export function AutoFormModal<T extends FieldValues>({
    open,
    onOpenChange,
    title,
    description,
    fields,
    onSubmit,
    isLoading = false,
    defaultValues,
    submitLabel = "Save",
    className
}: AutoFormModalProps<T>) {
    const methods = useForm<T>({
        defaultValues: defaultValues as any,
    });

    const {
        register,
        handleSubmit,
        control,
        reset,
        formState: { errors },
    } = methods;

    useEffect(() => {
        if (open && defaultValues) {
            reset(defaultValues as any);
        } else if (open) {
            reset();
        }
    }, [open, defaultValues, reset]);

    const handleFormSubmit = async (data: T) => {
        await onSubmit(data);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className={cn("sm:max-w-[525px] max-h-[90vh] overflow-hidden flex flex-col", className)}>
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                    {description && <DialogDescription>{description}</DialogDescription>}
                </DialogHeader>

                <div className="flex-1 overflow-y-auto pr-2">
                    <FormProvider {...methods}>
                        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4 py-4">
                            {fields.map((field) => (
                                <div key={field.name} className="space-y-2">
                                    <Label htmlFor={field.name}>
                                        {field.label} {field.required && <span className="text-destructive">*</span>}
                                    </Label>

                                    {field.type === "multi-select" ? (
                                        <Controller
                                            name={field.name}
                                            control={control}
                                            render={({ field: { onChange, value } }) => {
                                                const selected = (value as string[]) || [];
                                                return (
                                                    <div className="space-y-3">
                                                        <Popover>
                                                            <PopoverTrigger asChild>
                                                                <Button
                                                                    variant="outline"
                                                                    role="combobox"
                                                                    className="w-full justify-between"
                                                                    disabled={field.disabled}
                                                                >
                                                                    {selected.length > 0
                                                                        ? `${selected.length} selected`
                                                                        : field.placeholder || "Select options"}
                                                                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                                                </Button>
                                                            </PopoverTrigger>
                                                            <PopoverContent className="w-full p-0">
                                                                <Command>
                                                                    <CommandInput placeholder="Search..." />
                                                                    <CommandList>
                                                                        <CommandEmpty>No item found.</CommandEmpty>
                                                                        <CommandGroup>
                                                                            {field.options?.map((opt) => (
                                                                                <CommandItem
                                                                                    key={opt.value}
                                                                                    value={opt.value}
                                                                                    onSelect={() => {
                                                                                        const current = selected;
                                                                                        if (current.includes(opt.value)) {
                                                                                            onChange(current.filter((i) => i !== opt.value));
                                                                                        } else {
                                                                                            onChange([...current, opt.value]);
                                                                                        }
                                                                                    }}
                                                                                >
                                                                                    <Check
                                                                                        className={cn(
                                                                                            "mr-2 h-4 w-4",
                                                                                            selected.includes(opt.value)
                                                                                                ? "opacity-100"
                                                                                                : "opacity-0"
                                                                                        )}
                                                                                    />
                                                                                    {opt.label}
                                                                                </CommandItem>
                                                                            ))}
                                                                        </CommandGroup>
                                                                    </CommandList>
                                                                </Command>
                                                            </PopoverContent>
                                                        </Popover>
                                                        <div className="flex flex-wrap gap-2">
                                                            {selected.map((item) => {
                                                                const option = field.options?.find(opt => opt.value === item);
                                                                return (
                                                                    <Badge key={item} variant="secondary">
                                                                        {option ? option.label : item}
                                                                        <button
                                                                            type="button"
                                                                            className="ml-1 ring-offset-background rounded-full outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                                                                            onClick={() => onChange(selected.filter((i) => i !== item))}
                                                                        >
                                                                            <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                                                                        </button>
                                                                    </Badge>
                                                                );
                                                            })}
                                                        </div>
                                                    </div>
                                                );
                                            }}
                                        />
                                    ) : field.type === "select" ? (
                                        <Controller
                                            name={field.name}
                                            control={control}
                                            rules={{ required: field.required ? `${field.label} is required` : false }}
                                            render={({ field: { onChange, value } }) => (
                                                <Select
                                                    onValueChange={onChange}
                                                    value={value as string}
                                                    disabled={field.disabled}
                                                >
                                                    <SelectTrigger>
                                                        <SelectValue placeholder={field.placeholder || "Select option"} />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {field.options?.map((opt) => (
                                                            <SelectItem key={opt.value} value={opt.value}>
                                                                {opt.label}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            )}
                                        />
                                    ) : field.type === "date" ? (
                                        <Controller
                                            name={field.name}
                                            control={control}
                                            render={({ field: { value, onChange } }) => (
                                                <Popover>
                                                    <PopoverTrigger asChild>
                                                        <Button
                                                            variant={"outline"}
                                                            className={cn(
                                                                "w-full pl-3 text-left font-normal",
                                                                !value && "text-muted-foreground"
                                                            )}
                                                            disabled={field.disabled}
                                                        >
                                                            {value ? (
                                                                format(new Date(value), "PPP")
                                                            ) : (
                                                                <span>{field.placeholder || "Pick a date"}</span>
                                                            )}
                                                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                        </Button>
                                                    </PopoverTrigger>
                                                    <PopoverContent className="w-auto p-0" align="start">
                                                        <Calendar
                                                            mode="single"
                                                            selected={value ? new Date(value) : undefined}
                                                            onSelect={onChange}
                                                            disabled={(date) =>
                                                                date < new Date("1900-01-01")
                                                            }
                                                            initialFocus
                                                        />
                                                    </PopoverContent>
                                                </Popover>
                                            )}
                                        />
                                    ) : field.type === "file" ? (
                                        /* FILE UPLOAD */
                                        <Controller
                                            name={field.name}
                                            control={control}
                                            render={({ field: { onChange, value, ...fieldProps } }) => (
                                                <div className="flex items-center justify-center w-full">
                                                    <label
                                                        htmlFor={field.name}
                                                        className={cn(
                                                            "flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600 transition-colors",
                                                            field.disabled && "opacity-50 cursor-not-allowed"
                                                        )}
                                                    >
                                                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                                            <UploadCloud className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400" />
                                                            <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                                                                <span className="font-semibold">{(value as any) instanceof File ? (value as any).name : "Click to upload"}</span>
                                                            </p>
                                                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                                                {(value as any) instanceof File ? (
                                                                    <span className="text-green-500">File selected</span>
                                                                ) : (
                                                                    field.placeholder || "SVG, PNG, JPG or GIF"
                                                                )}
                                                            </p>
                                                        </div>
                                                        <Input
                                                            id={field.name}
                                                            type="file"
                                                            className="hidden"
                                                            accept={field.accept}
                                                            disabled={field.disabled}
                                                            onChange={(e) => {
                                                                const file = e.target.files?.[0];
                                                                if (file) onChange(file);
                                                            }}
                                                            {...fieldProps}
                                                        />
                                                    </label>
                                                </div>
                                            )}
                                        />
                                    ) : field.type === "textarea" ? (
                                        <Textarea
                                            id={field.name}
                                            placeholder={field.placeholder}
                                            disabled={field.disabled}
                                            {...register(field.name, { required: field.required ? `${field.label} is required` : false })}
                                        />
                                    ) : field.type === "custom" && field.render ? (
                                        <div className="w-full">
                                            {field.render({ control, name: field.name })}
                                        </div>
                                    ) : (
                                        <Input
                                            id={field.name}
                                            type={field.type}
                                            placeholder={field.placeholder}
                                            disabled={field.disabled}
                                            {...register(field.name, { required: field.required ? `${field.label} is required` : false })}
                                        />
                                    )}

                                    {errors[field.name] && (
                                        <p className="text-sm text-destructive">
                                            {errors[field.name]?.message as string}
                                        </p>
                                    )}
                                </div>
                            ))}
                        </form>
                    </FormProvider>
                </div>

                <DialogFooter>
                    <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                        Cancel
                    </Button>
                    <Button type="submit" onClick={handleSubmit(handleFormSubmit)} disabled={isLoading}>
                        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        {submitLabel}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
