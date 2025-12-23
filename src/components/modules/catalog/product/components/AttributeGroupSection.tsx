
import { UseFormReturn } from "react-hook-form";
import { FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ProductFormValues } from "../product.schema";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

interface AttributeGroupSectionProps {
    form: UseFormReturn<ProductFormValues>;
    attributeGroupData: any;
    dynamicFields: any[];
    availableAttributeGroups?: any[]; // Array of strings or objects
    selectedAttributeGroupId?: string;
    setSelectedAttributeGroupId?: (id: string) => void;
}

export const AttributeGroupSection = ({
    form,
    attributeGroupData,
    dynamicFields,
    availableAttributeGroups = [],
    selectedAttributeGroupId,
    setSelectedAttributeGroupId
}: AttributeGroupSectionProps) => {
    return (
        <Card>
            <CardHeader>
                <CardTitle>{attributeGroupData?.data?.name || "Product Attributes"}</CardTitle>
                <CardDescription>
                    {attributeGroupData?.data?.description || "Specific details for this product type."}
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                {/* Template Selection Dropdown */}
                {availableAttributeGroups.length > 1 && setSelectedAttributeGroupId && (
                    <div className="space-y-2 pb-4 border-b">
                        <FormLabel>Select Attribute Template</FormLabel>
                        <Select
                            value={selectedAttributeGroupId}
                            onValueChange={setSelectedAttributeGroupId}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select template" />
                            </SelectTrigger>
                            <SelectContent>
                                {availableAttributeGroups.map((group: any) => {
                                    const id = typeof group === 'object' ? group._id : group;
                                    const name = typeof group === 'object' ? group.name : `Template ${id.substr(-4)}`;
                                    return (
                                        <SelectItem key={id} value={id}>
                                            {name}
                                        </SelectItem>
                                    );
                                })}
                            </SelectContent>
                        </Select>
                    </div>
                )}
                {dynamicFields.map((field: any) => (
                    <FormField
                        key={field.key}
                        control={form.control}
                        name={`attributes.${field.key}`}
                        render={({ field: formField }) => (
                            <FormItem>
                                <FormLabel>{field.label} {field.required && <span className="text-destructive">*</span>}</FormLabel>
                                <FormControl>
                                    {field.type === 'textarea' ? (
                                        <Textarea placeholder={field.placeholder} {...formField} />
                                    ) : field.type === 'select' ? (
                                        <Select onValueChange={formField.onChange} defaultValue={formField.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder={field.placeholder || "Select option"} />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {field.options?.map((opt: string) => (
                                                    <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    ) : field.type === 'boolean' ? (
                                        <div className="flex items-center space-x-2">
                                            <Switch
                                                checked={formField.value}
                                                onCheckedChange={formField.onChange}
                                            />
                                            <span>{formField.value ? "Yes" : "No"}</span>
                                        </div>
                                    ) : (
                                        <Input
                                            type={field.type === 'number' ? 'number' : field.type === 'date' ? 'date' : 'text'}
                                            placeholder={field.placeholder}
                                            {...formField}
                                        />
                                    )}
                                </FormControl>
                            </FormItem>
                        )}
                    />
                ))}
            </CardContent>
        </Card>
    );
};
