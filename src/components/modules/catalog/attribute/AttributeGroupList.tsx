"use client"

import { useState } from "react";
import { Plus, Edit, Trash2, LayoutGrid, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import { toast } from "sonner";
import { useParams } from "next/navigation";

import { 
    useGetAttributeGroupsQuery, 
    useCreateAttributeGroupMutation, 
    useUpdateAttributeGroupMutation, 
    useDeleteAttributeGroupMutation 
} from "@/redux/api/catalog/attributeGroupApi";
import { useGetBusinessUnitsQuery } from "@/redux/api/organization/businessUnitApi";
import { DataTable } from "@/components/shared/DataTable";
import { DataPageLayout } from "@/components/shared/DataPageLayout";
import { StatCard } from "@/components/shared/StatCard";
import { AutoFormModal } from "@/components/shared/AutoFormModal";
import { usePermissions } from "@/hooks/usePermissions";
import { PERMISSION_KEYS } from "@/config/permission-keys";
import { ColumnDef } from "@tanstack/react-table";

import { useFieldArray, useFormContext } from "react-hook-form";
import { PlusCircle, Trash, GripVertical } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface IAttributeField {
    key: string;
    label: string;
    type: 'text' | 'number' | 'date' | 'select' | 'boolean' | 'textarea';
    required: boolean;
    options?: string[];
    placeholder?: string;
}

interface IAttributeGroup {
    _id: string;
    id: string;
    name: string;
    code: string;
    description?: string;
    availableModules: string[];
    fields: IAttributeField[];
    sortOrder: number;
    isActive: boolean;
}

const FieldsBuilder = () => {
    const { control, register, watch, setValue, getValues } = useFormContext();
    const { fields, append, remove } = useFieldArray({
        control,
        name: "fields"
    });

    // Using global slugify defined below

    return (
        <div className="space-y-4 border p-4 rounded-lg bg-muted/30">
            <div className="flex items-center justify-between">
                <h4 className="text-sm font-semibold">Schema Definition (Fields)</h4>
                <Button 
                    type="button" 
                    variant="outline" 
                    size="sm"
                    onClick={() => append({ key: "", label: "", type: "text", required: false })}
                >
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add Field
                </Button>
            </div>

            {fields.map((item, index) => {
                const fieldType = watch(`fields.${index}.type`);
                return (
                    <div key={item.id} className="grid grid-cols-12 gap-2 items-start bg-background p-3 rounded border shadow-sm relative group">
                        <div className="col-span-1 py-3 text-muted-foreground flex justify-center">
                            <span className="text-xs font-mono">{index + 1}</span>
                        </div>
                        
                        <div className="col-span-3 space-y-1">
                            <Label className="text-[10px] uppercase">Label</Label>
                            <Input 
                                {...register(`fields.${index}.label` as const)} 
                                placeholder="Attribute Name"
                                onChange={(e) => {
                                    const value = e.target.value;
                                    const prevLabel = getValues(`fields.${index}.label`);
                                    const currentKey = getValues(`fields.${index}.key`);
                                    
                                    setValue(`fields.${index}.label`, value);
                                    
                                    const isEdit = !!getValues("_id");
                                    // Only auto-slugify if the group is new OR the specific field key is empty/synced
                                    if (!isEdit || !currentKey) {
                                        if (!currentKey || currentKey === slugify(prevLabel || "")) {
                                            setValue(`fields.${index}.key`, slugify(value));
                                        }
                                    }
                                }}
                            />
                        </div>

                        <div className="col-span-3 space-y-1">
                            <Label className="text-[10px] uppercase">Key (System Name)</Label>
                            <Input 
                                {...register(`fields.${index}.key` as const)} 
                                placeholder="system_key" 
                                disabled={!!getValues("_id")}
                                className={!!getValues("_id") ? "bg-muted/50" : ""}
                                onChange={(e) => {
                                    if (!getValues("_id")) {
                                        setValue(`fields.${index}.key`, slugify(e.target.value));
                                    }
                                }}
                            />
                        </div>

                        <div className="col-span-2 space-y-1">
                            <Label className="text-[10px] uppercase">Type</Label>
                            <select 
                                {...register(`fields.${index}.type` as const)}
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                <option value="text">Text</option>
                                <option value="number">Number</option>
                                <option value="date">Date</option>
                                <option value="select">Select</option>
                                <option value="boolean">Boolean</option>
                                <option value="textarea">TextArea</option>
                            </select>
                        </div>

                        <div className="col-span-1 flex flex-col items-center justify-center space-y-2 py-2">
                             <Label className="text-[10px] uppercase">Req.</Label>
                             <input 
                                type="checkbox" 
                                {...register(`fields.${index}.required` as const)}
                                className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                             />
                        </div>

                        <div className="col-span-2 py-6 flex justify-end">
                            <Button 
                                type="button" 
                                variant="ghost" 
                                size="sm" 
                                className="text-destructive hover:bg-destructive/10"
                                onClick={() => remove(index)}
                            >
                                <Trash className="h-4 w-4" />
                            </Button>
                        </div>

                        {fieldType === 'select' && (
                            <div className="col-span-12 mt-2 pt-2 border-t">
                                <Label className="text-[10px] uppercase">Options (Comma separated)</Label>
                                <Input 
                                    placeholder="Option 1, Option 2, Option 3"
                                    {...register(`fields.${index}.optionsString` as const)}
                                />
                            </div>
                        )}
                    </div>
                );
            })}

            {fields.length === 0 && (
                <div className="text-center py-8 border-2 border-dashed rounded-lg text-muted-foreground">
                    No fields defined. Click "Add Field" to start building your attribute group schema.
                </div>
            )}
        </div>
    );
};

const slugify = (text: string) => {
    return text
        .toString()
        .toLowerCase()
        .trim()
        .replace(/\s+/g, "_")
        .replace(/[^\w-]+/g, "")
        .replace(/--+/g, "_");
};

const GroupNameField = ({ name }: { name: string }) => {
    const { setValue, getValues, register } = useFormContext();
    const isEdit = !!getValues("_id");

    return (
        <div className="space-y-2">
            <Input 
                {...register("name")}
                placeholder="e.g. Technical Specs"
                onChange={(e) => {
                    const val = e.target.value;
                    const prevName = getValues("name");
                    const currentCode = getValues("code");
                    
                    setValue("name", val);
                    if (!isEdit) {
                        if (!currentCode || currentCode === slugify(prevName || "")) {
                            setValue("code", slugify(val));
                        }
                    }
                }}
            />
        </div>
    );
};

const InternalCodeField = ({ name }: { name: string }) => {
    const { setValue, register, getValues } = useFormContext();
    const isEdit = !!getValues("_id");

    return (
        <div className="space-y-2">
            <Input   
                {...register("code")}
                placeholder="e.g. tech_specs"
                disabled={isEdit}
                className={isEdit ? "bg-muted cursor-not-allowed" : ""}
                onChange={(e) => {
                    if (!isEdit) {
                        setValue("code", slugify(e.target.value));
                    }
                }}
            />
            {isEdit && <p className="text-[10px] text-muted-foreground italic">Code cannot be changed as it is used for system references.</p>}
        </div>
    );
};

export default function AttributeGroupList() {
    const params = useParams();
    const paramBusinessUnit = params["business-unit"] as string;
    const { hasPermission, isSuperAdmin } = usePermissions();

    const [createModalOpen, setCreateModalOpen] = useState(false);
    const [editingGroup, setEditingGroup] = useState<IAttributeGroup | null>(null);

    // RTK Query Hooks
    const { data: groupsResponse, isLoading } = useGetAttributeGroupsQuery({ businessUnit: paramBusinessUnit });
    const { data: businessUnits = [] } = useGetBusinessUnitsQuery({ limit: 100 }, { skip: !isSuperAdmin });

    const [createGroup, { isLoading: isCreating }] = useCreateAttributeGroupMutation();
    const [updateGroup, { isLoading: isUpdating }] = useUpdateAttributeGroupMutation();
    const [deleteGroup] = useDeleteAttributeGroupMutation();

    const groups = groupsResponse?.result || groupsResponse || [];

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this group?")) return;
        try {
            await deleteGroup(id).unwrap();
            toast.success("Attribute group deleted successfully");
        } catch (error: any) {
            toast.error(error?.data?.message || "Failed to delete group");
        }
    };

    const handleEdit = (group: IAttributeGroup) => {
        // Prepare options string for editing
        const groupWithFormattedFields = {
            ...group,
            fields: group.fields?.map(f => ({
                ...f,
                optionsString: f.options?.join(', ') || ''
            })) || []
        };
        setEditingGroup(groupWithFormattedFields as any);
        setCreateModalOpen(true);
    };

    const handleSubmit = async (data: any) => {
        try {
            let submissionData = { ...data };

            // Format fields options
            if (submissionData.fields) {
                submissionData.fields = submissionData.fields.map((f: any) => {
                    const { optionsString, ...rest } = f;
                    if (f.type === 'select' && optionsString) {
                        return { 
                            ...rest, 
                            options: optionsString.split(',').map((s: string) => s.trim()).filter(Boolean) 
                        };
                    }
                    return rest;
                });
            }

            // BU Logic
            let targetBU = "";
            if (isSuperAdmin && data.businessUnit) {
                targetBU = data.businessUnit;
            } else if (paramBusinessUnit) {
                const matched = (businessUnits as any[]).find((b: any) => b.slug === paramBusinessUnit || b._id === paramBusinessUnit || b.id === paramBusinessUnit);
                targetBU = matched ? matched._id : paramBusinessUnit;
            }

            if (targetBU === 'global') targetBU = "";
            if (targetBU) {
                submissionData.businessUnit = targetBU;
            } else {
                submissionData.businessUnit = null;
            }

            if (editingGroup) {
                await updateGroup({ id: editingGroup._id, body: submissionData }).unwrap();
                toast.success("Attribute group updated successfully");
            } else {
                await createGroup(submissionData).unwrap();
                toast.success("Attribute group created successfully");
            }
            setCreateModalOpen(false);
            setEditingGroup(null);
        } catch (error: any) {
            toast.error(error?.data?.message || "Operation failed");
        }
    };

    const columns: ColumnDef<IAttributeGroup>[] = [
        {
            accessorKey: "name",
            header: "Name",
        },
        {
            accessorKey: "code",
            header: "Code",
            cell: ({ row }) => <code className="text-xs bg-muted px-1 rounded">{row.original.code}</code>
        },
        {
            accessorKey: "fields",
            header: "Fields",
            cell: ({ row }) => (
                <Badge variant="outline">
                    {row.original.fields?.length || 0} Fields
                </Badge>
            ),
        },
        {
            accessorKey: "sortOrder",
            header: "Order",
        },
        {

            id: "actions",
            header: "Actions",
            cell: ({ row }) => (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        {hasPermission(PERMISSION_KEYS.ATTRIBUTE_GROUP.UPDATE) && (
                            <DropdownMenuItem onClick={() => handleEdit(row.original)}>
                                <Edit className="mr-2 h-4 w-4" /> Edit Group
                            </DropdownMenuItem>
                        )}
                        {hasPermission(PERMISSION_KEYS.ATTRIBUTE_GROUP.DELETE) && (
                            <DropdownMenuItem onClick={() => handleDelete(row.original._id)} className="text-red-600">
                                <Trash2 className="mr-2 h-4 w-4" /> Delete
                            </DropdownMenuItem>
                        )}
                    </DropdownMenuContent>
                </DropdownMenu>
            ),
        },
    ];

    const getFields = () => {
        const fields: any[] = [
            { 
                name: "name", 
                label: "Group Name", 
                type: "custom", 
                required: true, 
                render: ({ name }: any) => <GroupNameField name={name} />
            },
            { 
                name: "code", 
                label: "Internal Code", 
                type: "custom", 
                required: true, 
                render: ({ name }: any) => <InternalCodeField name={name} />
            },
            { name: "description", label: "Description", type: "textarea", placeholder: "Description" },
            { name: "sortOrder", label: "Sort Order", type: "number", placeholder: "0" },
            {

                name: "fields",
                label: "Attribute Fields",
                type: "custom",
                render: () => <FieldsBuilder />
            }
        ];

        if (isSuperAdmin) {
            let options = [
                { label: "Global (No Business Unit)", value: "global" },
                ...(businessUnits as any[]).map((bu: any) => ({
                    label: bu.name,
                    value: bu._id
                }))
            ];

            let isBusinessUnitDisabled = false;
            if (paramBusinessUnit) {
                const currentBU = (businessUnits as any[]).find((b: any) =>
                    b.id === paramBusinessUnit ||
                    b._id === paramBusinessUnit ||
                    b.slug === paramBusinessUnit
                );
                if (currentBU) {
                    options = [
                        { label: "Global (No Business Unit)", value: "global" },
                        { label: currentBU.name, value: currentBU._id }
                    ];
                    isBusinessUnitDisabled = true;
                }
            }

            fields.push({
                name: "businessUnit",
                label: "Business Unit",
                type: "select",
                options: options,
                placeholder: "Select Business Unit",
                disabled: isBusinessUnitDisabled
            });
        }

        return fields;
    };

    return (
        <>
            <DataPageLayout
                title="Attribute Groups"
                description="Manage groups of product attributes and specifications."
                createAction={hasPermission(PERMISSION_KEYS.ATTRIBUTE_GROUP.CREATE) ? {
                    label: "Add Group",
                    onClick: () => {
                        setEditingGroup(null);
                        setCreateModalOpen(true);
                    }
                } : undefined}
                stats={
                    <div className="flex gap-4">
                        <StatCard title="Total Groups" value={(groups as any[]).length} icon={LayoutGrid} />
                        <StatCard title="Active Modules" value={7} icon={CheckCircle} />
                    </div>
                }
            >
                <DataTable columns={columns} data={groups as any[]} isLoading={isLoading} searchKey="name" />
            </DataPageLayout>

            <AutoFormModal
                open={createModalOpen}
                onOpenChange={setCreateModalOpen}
                title={editingGroup ? "Edit Attribute Group" : "Create Attribute Group"}
                description="Define attribute group and its dynamic fields."
                fields={getFields()}
                className="sm:max-w-4xl"
                defaultValues={editingGroup ? {
                    ...editingGroup,
                    businessUnit: (editingGroup as any).businessUnit?._id || (editingGroup as any).businessUnit || "global"
                } : {
                    fields: [],
                    sortOrder: 0,

                    businessUnit: isSuperAdmin ? (paramBusinessUnit ? (businessUnits as any[]).find((b: any) => b.slug === paramBusinessUnit || b._id === paramBusinessUnit)?._id : "global") : "global"
                }}
                onSubmit={handleSubmit}
                isLoading={isCreating || isUpdating}
                submitLabel={editingGroup ? "Update Group" : "Create Group"}
            />
        </>
    );
}


