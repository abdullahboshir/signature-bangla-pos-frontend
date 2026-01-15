import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { MODULE_OPTIONS, getModuleOptions, ModuleType } from "@/constant/modules";
import { cn } from "@/lib/utils";
import { useFormContext } from "react-hook-form";

interface ModuleSelectProps {
    name?: string;
    label?: string;
    placeholder?: string;
    exclude?: ModuleType[];
    include?: (ModuleType | string)[];
    className?: string;
    disabled?: boolean;
}

export const ModuleSelect = ({
    name = "module",
    label = "Module",
    placeholder = "Select a module",
    exclude = [],
    include,
    className,
    disabled
}: ModuleSelectProps) => {
    const { control } = useFormContext();
    let options = getModuleOptions(exclude);

    if (include && include.length > 0) {
        options = options.filter(opt => include.includes(opt.value));
    }

    return (
        <FormField
            control={control}
            name={name}
            render={({ field }) => (
                <FormItem className={cn("w-full", className)}>
                    <FormLabel>{label}</FormLabel>
                    <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        value={field.value}
                        disabled={disabled}
                    >
                        <FormControl>
                            <SelectTrigger>
                                <SelectValue placeholder={placeholder} />
                            </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                            {options.map((option) => (
                                <SelectItem key={option.value} value={option.value}>
                                    {option.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <FormMessage />
                </FormItem>
            )}
        />
    );
};
