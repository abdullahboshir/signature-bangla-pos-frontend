"use client";

import { useState, useRef } from "react";
import { useForm, Controller, useWatch } from "react-hook-form";
import { FormItem, FormLabel, FormDescription } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Mail, Phone, Truck, MoreHorizontal, Search, Trash, Edit, Building } from "lucide-react";
import { DataTable } from "@/components/shared/DataTable";
import { DataPageLayout } from "@/components/shared/DataPageLayout";
import { StatCard } from "@/components/shared/StatCard";
import { ColumnDef } from "@tanstack/react-table";
import { Input } from "@/components/ui/input";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import { cn } from "@/lib/utils";
import { Check, ChevronsUpDown, X } from "lucide-react";
import { AutoFormModal } from "@/components/shared/AutoFormModal";
import { FieldConfig } from "@/types/auto-form";
import {
    useGetSuppliersQuery,
    useCreateSupplierMutation,
    useUpdateSupplierMutation,
    useDeleteSupplierMutation
} from "@/redux/api/supplierApi";
import { toast } from "sonner";
import { useCurrentBusinessUnit } from "@/hooks/useCurrentBusinessUnit";
import { useAuth } from "@/hooks/useAuth";
import { useParams } from "next/navigation";
import { useGetBusinessUnitsQuery } from "@/redux/api/businessUnitApi";
import { Badge } from "@/components/ui/badge";
import { usePermissions } from "@/hooks/usePermissions";
import { PERMISSION_KEYS } from "@/config/permission-keys";

export const SupplierList = () => {
    // Auth & Context
    const { user: currentUser } = useAuth();
    const params = useParams();
    const paramBusinessUnit = params?.["business-unit"] as string;
    const isSuperAdmin = currentUser?.roles?.some((r: any) => (typeof r === 'string' ? r : r.name) === 'super-admin');

    const { currentBusinessUnit: contextBusinessUnit } = useCurrentBusinessUnit();
    const contextBUId = contextBusinessUnit?._id || contextBusinessUnit?.id;
    const isScoped = !!paramBusinessUnit;
    const { hasPermission } = usePermissions();

    // Fallback for non-super admins or explicit scoping
    const effectiveBusinessUnitId = isSuperAdmin ? undefined : contextBUId;

    // RTK Query Hooks
    // If we have a paramBusinessUnit (meaning we are in a scoped route), we should filter by the resolved Business Unit ID.
    // contextBusinessUnit is populated by the layout/hook based on the param.
    // We strictly use the ID for filtering.
    const queryFilter = isScoped ? contextBUId : undefined;

    const queryParams: any = {};
    if (queryFilter) {
        queryParams.businessUnits = queryFilter;
    }

    const { data: suppliersResponse, isLoading: isSuppliersLoading } = useGetSuppliersQuery(
        queryParams,
        { skip: !!paramBusinessUnit && !queryFilter } // Skip if scoped but ID not yet resolved
    );

    const { data: businessUnits = [] } = useGetBusinessUnitsQuery({ limit: 100 }, { skip: !isSuperAdmin });

    const [createSupplier] = useCreateSupplierMutation();
    const [updateSupplier] = useUpdateSupplierMutation();
    const [deleteSupplier] = useDeleteSupplierMutation();


    // Derived state from RTK Query data
    const suppliers = suppliersResponse || [];
    const loading = isSuppliersLoading;
    const [searchTerm, setSearchTerm] = useState("");

    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedSupplier, setSelectedSupplier] = useState<any>(null);
    const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
    const editingIdRef = useRef<string | null>(null);

    const handleCreate = () => {
        // If scoped, pre-fill businessUnits
        if (isScoped && contextBUId) {
            setSelectedSupplier({ businessUnits: [contextBUId] });
        } else {
            setSelectedSupplier(null);
        }
        editingIdRef.current = null;
        setModalMode('create');
        setIsModalOpen(true);
    };

    const handleEdit = (supplier: any) => {
        // Resolve MongoDB _id
        let mongoId = supplier._id;

        // Fallback: If _id is missing, try lookup in suppliers list via custom id
        if (!mongoId && supplier.id) {
            console.warn("Edit: _id missing on row object, attempting lookup by custom id:", supplier.id);
            const found = suppliers.find((s: any) => s.id === supplier.id);
            if (found) {
                mongoId = found._id;
            }
        }

        if (!mongoId) {
            console.error("Critical: Could not resolve MongoDB _id for supplier:", supplier);
            toast.error("Error: Could not determine distinct Supplier ID. Please refresh the page.");
            return;
        }

        // Store the correct MongoDB _id in ref
        editingIdRef.current = mongoId;
        console.log("Edit Mode Initialized. Ref ID set to:", editingIdRef.current);

        const formValues = { ...supplier };

        // Handle businessUnits: transform objects to IDs for the multi-select
        if (formValues.businessUnits && Array.isArray(formValues.businessUnits)) {
            if (formValues.businessUnits.length === 0) {
                formValues.isGlobal = true;
            } else {
                formValues.isGlobal = false;
                formValues.businessUnits = formValues.businessUnits.map((bu: any) =>
                    typeof bu === 'object' ? bu._id : bu
                );
            }
        } else {
            formValues.businessUnits = [];
            formValues.isGlobal = true;
        }

        setSelectedSupplier(formValues);
        setModalMode('edit');
        setIsModalOpen(true);
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this supplier?")) return;
        try {
            const res = await deleteSupplier(id).unwrap();
            if (res.success || res.data) {
                toast.success("Supplier deleted successfully");
            }
        } catch (error) {
            toast.error("Failed to delete supplier");
        }
    };

    const handleSubmit = async (values: any) => {
        console.log("Submit Values:", values);
        try {
            // Processing Business Units
            let targetBusinessUnits: string[] = [];

            // PRIORITY 1: Scoped View (Super Admin viewing a BU, or Business Admin)
            // If we are in a scoped URL and have a valid context BU ID, ONLY assign that BU.
            // This overrides any form values which might be missing (disabled field) or manipulated.
            if (isScoped && contextBUId) {
                targetBusinessUnits = [contextBUId];
            }
            // PRIORITY 2: Super Admin Global View
            // If NOT scoped, checking for global flag or manual selection
            else if (isSuperAdmin) {
                if (values.isGlobal) {
                    // Global Access: Assign ALL available BUs
                    if (businessUnits.length > 0) {
                        targetBusinessUnits = businessUnits.map((bu: any) => bu._id);
                    }
                } else if (values.businessUnits) {
                    // Specific Selection
                    targetBusinessUnits = Array.isArray(values.businessUnits) ? values.businessUnits : [values.businessUnits];
                }
            }
            // PRIORITY 3: Fallback (Legacy/Safety)
            else if (effectiveBusinessUnitId) {
                targetBusinessUnits = [effectiveBusinessUnitId];
            }

            // Ideally update payload to include businessUnits if backend logic requires it explicitly in list
            values.businessUnits = targetBusinessUnits;
            delete values.isGlobal; // Remove auxiliary field

            if (modalMode === 'create') {
                const res = await createSupplier(values).unwrap();
                if (res.success || res.data) {
                    toast.success("Supplier created successfully");
                }
            } else {
                // Retrieve ID from ref
                const idToUpdate = editingIdRef.current;

                if (!idToUpdate) {
                    console.error("Critical: ID missing from ref", { editingIdRef, values });
                    throw new Error("Missing Supplier MongoDB ID (_id) for update. Please refresh and try again.");
                }

                const res = await updateSupplier({ id: idToUpdate, body: values }).unwrap();
                if (res.success || res.data) {
                    toast.success("Supplier updated successfully");
                }
            }
            setIsModalOpen(false);
        } catch (error: any) {
            console.error(error);
            toast.error(error?.data?.message || error.message || `Failed to ${modalMode} supplier`);
        }
    };


    // If we are in a scoped view (paramBusinessUnit exists), we want to lock the creation to this BU.
    // Even for Super Admin.

    const supplierFields: FieldConfig[] = [
        ...(isSuperAdmin ? [
            // Only show Global toggle if NOT scoped
            ...(!isScoped ? [{
                name: "isGlobal",
                label: "Global Access (All Business Units)",
                type: "custom",
                render: ({ control, name }: any) => (
                    <Controller
                        name={name}
                        control={control}
                        defaultValue={false}
                        render={({ field: { value, onChange } }) => (
                            <div className="flex items-center space-x-2 border p-3 rounded-md bg-muted/20">
                                <input
                                    type="checkbox"
                                    id="global-access"
                                    checked={value}
                                    onChange={(e) => {
                                        onChange(e.target.checked);
                                    }}
                                    className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                                />
                                <div className="grid gap-1.5 leading-none">
                                    <label
                                        htmlFor="global-access"
                                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                    >
                                        Global Access
                                    </label>
                                    <p className="text-[0.8rem] text-muted-foreground">
                                        If checked, this supplier will be available to all Business Units.
                                    </p>
                                </div>
                            </div>
                        )}
                    />
                )
            } as FieldConfig] : []),
            {
                name: "businessUnits",
                label: "Business Unit Access",
                type: "custom",
                render: ({ control, name }: any) => {
                    // eslint-disable-next-line
                    const isGlobal = useWatch({ control, name: "isGlobal" });

                    return (
                        <Controller
                            name={name}
                            control={control}
                            render={({ field }) => {
                                // If globally set, disable this input
                                const disabled = isGlobal || isScoped;
                                return (
                                    <FormItem>
                                        <FormLabel>Business Unit Access</FormLabel>
                                        <div className={disabled ? "opacity-50 pointer-events-none" : ""}>
                                            <MultiSelectInput
                                                options={businessUnits.map((bu: any) => ({ label: bu.name, value: bu._id }))}
                                                value={field.value}
                                                onChange={field.onChange}
                                                disabled={disabled}
                                            />
                                        </div>
                                        {disabled && isGlobal && <FormDescription>Disabled because Global Access is selected.</FormDescription>}
                                        {disabled && isScoped && <FormDescription>Disabled because you are in a scoped Business Unit view.</FormDescription>}
                                    </FormItem>
                                );
                            }}
                        />
                    );
                }
            } as FieldConfig
        ] : []),
        {
            name: "id",
            label: "Supplier ID (Optional)",
            type: "text",
            placeholder: "Leave empty for auto-generate",
        },

        {
            name: "name",
            label: "Supplier Name",
            type: "text",
            required: true,
        },
        {
            name: "contactPerson",
            label: "Contact Person",
            type: "text",
        },
        {
            name: "email",
            label: "Email",
            type: "email",
        },
        {
            name: "phone",
            label: "Phone",
            type: "text",
        },
        {
            name: "address.street",
            label: "Street Address",
            type: "text",
        },
        {
            name: "address.city",
            label: "City",
            type: "text",
        },
        {
            name: "address.country",
            label: "Country",
            type: "text",
        },
        {
            name: "status",
            label: "Status",
            type: "select",
            options: [
                { label: "Active", value: "active" },
                { label: "Inactive", value: "inactive" }
            ],
            defaultValue: "active"
        }
    ];

    const columns: ColumnDef<any>[] = [
        {
            accessorKey: "name",
            header: "Name",
            cell: ({ row }) => <span className="font-medium">{row.original.name}</span>,
        },
        {
            accessorKey: "contactPerson",
            header: "Contact Person",
        },
        {
            accessorKey: "businessUnits",
            header: "Business Unit",
            cell: ({ row }) => {
                if (!row.original.businessUnits || row.original.businessUnits.length === 0) return <span className="text-xs text-muted-foreground">Global</span>;
                return <div className="flex flex-wrap gap-1">
                    {row.original.businessUnits.slice(0, 2).map((bu: any) => {
                        let buName = 'Unknown BU';
                        const buId = typeof bu === 'string' ? bu : bu._id;

                        if (typeof bu === 'object' && bu.name) {
                            buName = bu.name;
                        } else {
                            // Try lookup in the businessUnits list (available to super-admin)
                            const found = businessUnits.find((b: any) => b._id === buId);
                            if (found) {
                                buName = found.name;
                            } else if (contextBusinessUnit && (contextBusinessUnit._id === buId || contextBusinessUnit.id === buId)) {
                                // Fallback to context if in scoped view
                                buName = contextBusinessUnit.name;
                            }
                        }

                        return (
                            <Badge variant="outline" className="text-[10px]" key={buId}>
                                {buName}
                            </Badge>
                        );
                    })}
                    {row.original.businessUnits.length > 2 && <span className="text-xs">+{row.original.businessUnits.length - 2}</span>}
                </div>
            },
        },
        {
            accessorKey: "email",
            header: "Email",
            cell: ({ row }) => (
                <div className="flex items-center gap-2">
                    <Mail className="h-3 w-3 text-muted-foreground" />
                    <span>{row.original.email}</span>
                </div>
            ),
        },
        {
            accessorKey: "phone",
            header: "Phone",
            cell: ({ row }) => (
                <div className="flex items-center gap-2">
                    <Phone className="h-3 w-3 text-muted-foreground" />
                    <span>{row.original.phone}</span>
                </div>
            ),
        },
        {
            id: "actions",
            header: "Actions",
            cell: ({ row }) => (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        {hasPermission(PERMISSION_KEYS.SUPPLIER.UPDATE) && (
                            <DropdownMenuItem onClick={() => handleEdit(row.original)}>
                                <Edit className="mr-2 h-4 w-4" /> Edit
                            </DropdownMenuItem>
                        )}
                        {hasPermission(PERMISSION_KEYS.SUPPLIER.DELETE) && (
                            <DropdownMenuItem onClick={() => handleDelete(row.original._id)} className="text-red-600">
                                <Trash className="mr-2 h-4 w-4" /> Delete
                            </DropdownMenuItem>
                        )}
                    </DropdownMenuContent>
                </DropdownMenu>
            ),
        },
    ];

    const filteredSuppliers = suppliers.filter((s: any) =>
        s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (s.email && s.email.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    return (
        <DataPageLayout
            title="Suppliers"
            description="Manage supplier relationships."
            createAction={hasPermission(PERMISSION_KEYS.SUPPLIER.CREATE) ? {
                label: "Add Supplier",
                onClick: handleCreate
            } : undefined}
            stats={
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <StatCard
                        title="Total Suppliers"
                        value={suppliers.length}
                        icon={Truck}
                    />
                </div>
            }
            extraFilters={
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search suppliers..."
                        className="pl-8"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            }
        >
            <DataTable columns={columns} data={filteredSuppliers} isLoading={loading} />

            <AutoFormModal
                open={isModalOpen}
                onOpenChange={setIsModalOpen}
                title={modalMode === 'create' ? "Add Supplier" : "Edit Supplier"}
                fields={supplierFields}
                onSubmit={handleSubmit}
                defaultValues={selectedSupplier}
                submitLabel={modalMode === 'create' ? "Create Supplier" : "Update Supplier"}
            />
        </DataPageLayout>
    );
}

// Helper Component for MultiSelect
const MultiSelectInput = ({ options, value, onChange, disabled }: { options: { label: string, value: string }[], value: string[], onChange: (val: string[]) => void, disabled?: boolean }) => {
    const [open, setOpen] = useState(false);
    const selected = value || [];

    const handleUnselect = (item: string) => {
        onChange(selected.filter((i) => i !== item));
    };

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className={`w-full justify-between h-auto min-h-10 ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
                    disabled={disabled}
                >
                    <div className="flex gap-1 flex-wrap">
                        {selected.length > 0 ? (
                            selected.map((item) => (
                                <Badge variant="secondary" key={item} className="mr-1 mb-1" onClick={(e) => {
                                    e.stopPropagation();
                                    if (!disabled) handleUnselect(item);
                                }}>
                                    {options.find((o) => o.value === item)?.label || item}
                                    {!disabled && (
                                        <div
                                            className="ml-1 ring-offset-background rounded-full outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                                            onKeyDown={(e) => {
                                                if (e.key === "Enter") {
                                                    handleUnselect(item);
                                                }
                                            }}
                                            onMouseDown={(e) => {
                                                e.preventDefault();
                                                e.stopPropagation();
                                            }}
                                            onClick={(e) => {
                                                e.preventDefault();
                                                e.stopPropagation();
                                                handleUnselect(item);
                                            }}
                                        >
                                            <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                                        </div>
                                    )}
                                </Badge>
                            ))
                        ) : (
                            <span className="text-muted-foreground font-normal">Select items...</span>
                        )}
                    </div>
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[400px] p-0">
                <Command>
                    <CommandInput placeholder="Search business unit..." />
                    <CommandList>
                        <CommandEmpty>No business unit found.</CommandEmpty>
                        <CommandGroup className="max-h-64 overflow-auto">
                            {options.map((option) => (
                                <CommandItem
                                    key={option.value}
                                    onSelect={() => {
                                        const isSelected = selected.includes(option.value);
                                        if (isSelected) {
                                            onChange(selected.filter((i) => i !== option.value));
                                        } else {
                                            onChange([...selected, option.value]);
                                        }
                                    }}
                                >
                                    <Check
                                        className={cn(
                                            "mr-2 h-4 w-4",
                                            selected.includes(option.value)
                                                ? "opacity-100"
                                                : "opacity-0"
                                        )}
                                    />
                                    {option.label}
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
};
