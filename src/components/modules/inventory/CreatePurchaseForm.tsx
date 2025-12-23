"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray } from "react-hook-form";
import * as z from "zod";
import { format } from "date-fns";
import { CalendarIcon, Check, ChevronsUpDown, Loader2, Plus, Trash2, Search, AlertCircle } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { toast } from "sonner";


import { useCreatePurchaseMutation } from "@/redux/api/purchaseApi";
import { useGetSuppliersQuery } from "@/redux/api/supplierApi";
import { useGetAllOutletsQuery } from "@/redux/api/outletApi";
import { useGetBusinessUnitsQuery } from "@/redux/api/businessUnitApi";
import { useGetProductsQuery } from "@/redux/api/productApi";

// Schema
const purchaseSchema = z.object({
    supplier: z.string().min(1, "Supplier is required"),
    referenceNo: z.string().optional(),
    purchaseDate: z.date(),
    dueDate: z.date().optional(),
    businessUnit: z.string().min(1, "Business Unit is required"),
    outlet: z.string().min(1, "Outlet is required"),
    status: z.enum(["pending", "ordered", "received"]),
    items: z.array(z.object({
        product: z.string(),
        productName: z.string(),
        currentStock: z.number().optional(), // For UI reference
        quantity: z.number().min(1, "Qty must be at least 1"),
        unitCost: z.number().min(0, "Cost cannot be negative"),
        total: z.number()
    })).min(1, "At least one item is required"),
    notes: z.string().optional(),
    subTotal: z.number(),
    tax: z.number().optional(),
    shippingCost: z.number().optional(),
    discount: z.number().optional(),
    grandTotal: z.number(),

    // Payment
    paidAmount: z.number().optional(),
    paymentMethod: z.enum(['cash', 'card', 'bank_transfer', 'mobile_banking', 'cheque', 'credit']).optional(),
    paymentStatus: z.enum(['pending', 'partial', 'paid']).optional()
});

type PurchaseFormValues = z.infer<typeof purchaseSchema>;

export function CreatePurchaseForm() {
    const router = useRouter();
    const params = useParams();
    // business-unit might be 'inventory' if we are in global route, or a real slug
    const businessUnitParam = params["business-unit"] as string;
    const role = params["role"] as string;

    const isGlobal = businessUnitParam === 'inventory' || !businessUnitParam || role === 'super-admin' && businessUnitParam === undefined;

    // Queries
    const { data: businessUnitData } = useGetBusinessUnitsQuery({});

    // Determine context
    // If scoped (and not 'inventory' placeholder if that happens), find specific BU
    // If global, currentBU might initially be undefined
    const scopedBU = !isGlobal ? businessUnitData?.find((b: any) => b.slug === businessUnitParam || b._id === businessUnitParam) : null;

    // We need state for selected BU if in global mode
    const [selectedBUSlug, setSelectedBUSlug] = useState<string | null>(scopedBU?._id || null);

    // Effect to set scoped BU
    useEffect(() => {
        if (scopedBU) {
            setSelectedBUSlug(scopedBU._id);
        }
    }, [scopedBU]);


    const businessUnitId = selectedBUSlug || "";

    const { data: suppliersData } = useGetSuppliersQuery({ businessUnit: businessUnitId }, { skip: !businessUnitId });
    const suppliers = suppliersData?.data || [];
    const { data: outlets = [] } = useGetAllOutletsQuery({ businessUnit: businessUnitId }, { skip: !businessUnitId });

    // Product Search
    const [searchQuery, setSearchQuery] = useState("");
    const { data: products = [] } = useGetProductsQuery({
        search: searchQuery,
        businessUnit: businessUnitId,
        limit: 20
    }, { skip: !businessUnitId });

    const [createPurchase, { isLoading }] = useCreatePurchaseMutation();

    // Form
    const form = useForm<PurchaseFormValues>({
        resolver: zodResolver(purchaseSchema),
        defaultValues: {
            purchaseDate: new Date(),
            businessUnit: businessUnitId,
            status: "pending",
            items: [],
            subTotal: 0,
            tax: 0,
            shippingCost: 0,
            discount: 0,
            grandTotal: 0,
            paidAmount: 0,
            paymentMethod: "cash",
            paymentStatus: "pending"
        }
    });

    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: "items"
    });

    useEffect(() => {
        if (businessUnitId) {
            form.setValue("businessUnit", businessUnitId);
        }
    }, [businessUnitId, form]);

    // Calculation Logic
    const calculateTotals = () => {
        const items = form.getValues("items");
        const subTotal = items.reduce((acc, item) => acc + (item.quantity * item.unitCost), 0);
        const tax = form.getValues("tax") || 0;
        const shipping = form.getValues("shippingCost") || 0;
        const discount = form.getValues("discount") || 0;
        const grandTotal = subTotal + tax + shipping - discount;

        form.setValue("subTotal", subTotal);
        form.setValue("grandTotal", grandTotal);

        // Auto update payment status based on paid amount
        const paid = form.getValues("paidAmount") || 0;
        if (paid >= grandTotal && grandTotal > 0) {
            form.setValue("paymentStatus", "paid");
        } else if (paid > 0) {
            form.setValue("paymentStatus", "partial");
        } else {
            form.setValue("paymentStatus", "pending");
        }
    };

    // Watch items/financials
    useEffect(() => {
        const subscription = form.watch((value, { name, type }) => {
            if (name?.startsWith("items") || name === "tax" || name === "shippingCost" || name === "discount" || name === "paidAmount") {
                calculateTotals();
            }
        });
        return () => subscription.unsubscribe();
    }, [form.watch]);


    const handleAddProduct = (product: any) => {
        const currentItems = form.getValues("items");
        const existing = currentItems.find(i => i.product === product._id);

        if (existing) {
            toast.error("Product already added");
            return;
        }

        append({
            product: product._id,
            productName: product.name,
            currentStock: product.inventory?.inventory?.stock || 0,
            quantity: 1,
            unitCost: product.pricing?.costPrice || 0,
            total: product.pricing?.costPrice || 0
        });
        calculateTotals();
        setSearchQuery("");
    };

    const onSubmit = async (data: PurchaseFormValues) => {
        try {
            // Final calculation check
            const subTotal = data.items.reduce((acc, item) => acc + (item.quantity * item.unitCost), 0);
            const grandTotal = subTotal + (data.tax || 0) + (data.shippingCost || 0) - (data.discount || 0);

            const payload = {
                ...data,
                subTotal,
                grandTotal
            };

            await createPurchase(payload).unwrap();
            toast.success("Purchase created successfully");

            // Redirect based on current path logic
            if (businessUnitParam && businessUnitParam !== 'inventory') {
                router.push(`/${role}/${businessUnitParam}/inventory/purchase`);
            } else {
                router.push(`/${role}/inventory/purchase`);
            }

        } catch (error: any) {
            console.error(error);
            toast.error(error?.data?.message || "Failed to create purchase");
        }
    };

    const [openProductSearch, setOpenProductSearch] = useState(false);

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 pb-20">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-3xl font-bold tracking-tight">Create Purchase</h2>
                        <p className="text-muted-foreground">Record a new purchase order or GRN.</p>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" type="button" onClick={() => router.back()}>Cancel</Button>
                        <Button size="lg" type="submit" disabled={isLoading}>
                            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Save Purchase
                        </Button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Column: Details */}
                    <div className="lg:col-span-1 space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Purchase Details</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">

                                {/* Business Unit Selection (Global Only) */}
                                {(!scopedBU) && (
                                    <FormField
                                        control={form.control}
                                        name="businessUnit"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Business Unit</FormLabel>
                                                <Select
                                                    onValueChange={(val) => {
                                                        field.onChange(val);
                                                        setSelectedBUSlug(val);
                                                        // Reset outlet/supplier/items when BU changes
                                                        form.setValue("outlet", "");
                                                        form.setValue("supplier", "");
                                                        form.setValue("items", []);
                                                    }}
                                                    value={field.value}
                                                >
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Select Business Unit" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        {businessUnitData?.map((bu: any) => (
                                                            <SelectItem key={bu._id} value={bu._id}>{bu.name}</SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                )}


                                <FormField
                                    control={form.control}
                                    name="supplier"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Supplier</FormLabel>
                                            <Select onValueChange={field.onChange} value={field.value} disabled={!businessUnitId}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select Supplier" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {suppliers.map((s: any) => (
                                                        <SelectItem key={s._id} value={s._id}>{s.name}</SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="outlet"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Receiving Outlet</FormLabel>
                                            <Select onValueChange={field.onChange} value={field.value} disabled={!businessUnitId}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select Outlet" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {outlets.map((o: any) => (
                                                        <SelectItem key={o._id} value={o._id}>{o.name}</SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <FormDescription className="text-xs">Stock will be added to this outlet.</FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <div className="grid grid-cols-2 gap-4">
                                    <FormField
                                        control={form.control}
                                        name="purchaseDate"
                                        render={({ field }) => (
                                            <FormItem className="flex flex-col">
                                                <FormLabel>Date</FormLabel>
                                                <Popover>
                                                    <PopoverTrigger asChild>
                                                        <FormControl>
                                                            <Button variant={"outline"} className={cn("text-left font-normal pl-3", !field.value && "text-muted-foreground")}>
                                                                {field.value ? format(field.value, "PPP") : <span>Pick date</span>}
                                                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                            </Button>
                                                        </FormControl>
                                                    </PopoverTrigger>
                                                    <PopoverContent className="w-auto p-0" align="start">
                                                        <Calendar mode="single" selected={field.value} onSelect={field.onChange} disabled={(date) => date > new Date()} initialFocus />
                                                    </PopoverContent>
                                                </Popover>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="dueDate"
                                        render={({ field }) => (
                                            <FormItem className="flex flex-col">
                                                <FormLabel>Due Date</FormLabel>
                                                <Popover>
                                                    <PopoverTrigger asChild>
                                                        <FormControl>
                                                            <Button variant={"outline"} className={cn("text-left font-normal pl-3", !field.value && "text-muted-foreground")}>
                                                                {field.value ? format(field.value, "PPP") : <span>No Due Date</span>}
                                                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                            </Button>
                                                        </FormControl>
                                                    </PopoverTrigger>
                                                    <PopoverContent className="w-auto p-0" align="start">
                                                        <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus />
                                                    </PopoverContent>
                                                </Popover>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                                <FormField
                                    control={form.control}
                                    name="referenceNo"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Reference / Invoice No</FormLabel>
                                            <FormControl><Input placeholder="e.g. INV-2024-001" {...field} /></FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="status"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Order Status</FormLabel>
                                            <Select onValueChange={field.onChange} value={field.value}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Status" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectItem value="pending">Pending</SelectItem>
                                                    <SelectItem value="ordered">Ordered</SelectItem>
                                                    <SelectItem value="received">Received</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            {field.value === 'received' && (
                                                <FormDescription className="text-green-600 font-medium text-xs flex items-center gap-1 mt-1">
                                                    <Check className="h-3 w-3" /> Will update stock inventory
                                                </FormDescription>
                                            )}
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </CardContent>
                        </Card>

                        {/* Payment Info Card */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Payment Information</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <FormField
                                    control={form.control}
                                    name="paymentMethod"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Payment Method</FormLabel>
                                            <Select onValueChange={field.onChange} value={field.value}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select Method" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectItem value="cash">Cash</SelectItem>
                                                    <SelectItem value="card">Card</SelectItem>
                                                    <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                                                    <SelectItem value="mobile_banking">Mobile Banking</SelectItem>
                                                    <SelectItem value="cheque">Cheque</SelectItem>
                                                    <SelectItem value="credit">Credit (Due)</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <div className="grid grid-cols-2 gap-4">
                                    <FormField
                                        control={form.control}
                                        name="paidAmount"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Paid Amount</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type="number"
                                                        {...field}
                                                        onChange={e => field.onChange(parseFloat(e.target.value))}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="paymentStatus"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Payment Status</FormLabel>
                                                <Select onValueChange={field.onChange} value={field.value} disabled>
                                                    <FormControl>
                                                        <SelectTrigger className="bg-muted">
                                                            <SelectValue placeholder="Status" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        <SelectItem value="pending">Pending</SelectItem>
                                                        <SelectItem value="partial">Partial</SelectItem>
                                                        <SelectItem value="paid">Paid</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                                <div className="p-3 bg-muted/50 rounded text-sm flex justify-between">
                                    <span>Due Amount:</span>
                                    <span className="font-bold text-destructive">
                                        {(form.watch("grandTotal") - (form.watch("paidAmount") || 0)).toFixed(2)}
                                    </span>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Right Column: Items */}
                    <div className="lg:col-span-2 space-y-6">
                        <Card className="h-full flex flex-col">
                            <CardHeader>
                                <CardTitle>Order Items</CardTitle>
                                <CardDescription>Add products to the purchase list.</CardDescription>
                            </CardHeader>
                            <CardContent className="flex-1 space-y-4">
                                {/* Search */}
                                <Popover open={openProductSearch} onOpenChange={setOpenProductSearch}>
                                    <PopoverTrigger asChild>
                                        <Button variant="outline" role="combobox" aria-expanded={openProductSearch} className="w-full justify-between h-12 text-base" disabled={!businessUnitId}>
                                            <div className="flex items-center gap-2">
                                                <Search className="h-4 w-4" />
                                                {searchQuery ? searchQuery : "Search Products to Add..."}
                                            </div>
                                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-[500px] p-0" align="start">
                                        <Command shouldFilter={false}>
                                            <CommandInput placeholder="Type to search product..." value={searchQuery} onValueChange={setSearchQuery} />
                                            <CommandList>
                                                <CommandEmpty>No product found.</CommandEmpty>
                                                <CommandGroup>
                                                    {products.map((product: any) => (
                                                        <CommandItem
                                                            key={product._id}
                                                            value={product.name}
                                                            onSelect={() => {
                                                                handleAddProduct(product);
                                                                setOpenProductSearch(false);
                                                            }}
                                                            className="flex items-center gap-2 py-3"
                                                        >
                                                            <div className="h-8 w-8 rounded overflow-hidden bg-muted border shrink-0">
                                                                {product.details?.images?.[0] && <img src={product.details.images[0]} className="h-full w-full object-cover" />}
                                                            </div>
                                                            <div className="flex flex-col flex-1">
                                                                <span className="font-medium">{product.name}</span>
                                                                <span className="text-xs text-muted-foreground">SKU: {product.sku}</span>
                                                            </div>
                                                            <div className="text-right text-xs">
                                                                <div className="font-medium">Stock: {product.inventory?.inventory?.stock || 0}</div>
                                                                <div className="text-muted-foreground">Cost: {product.pricing?.costPrice}</div>
                                                            </div>
                                                        </CommandItem>
                                                    ))}
                                                </CommandGroup>
                                            </CommandList>
                                        </Command>
                                    </PopoverContent>
                                </Popover>

                                {/* Items Table */}
                                <div className="border rounded-md overflow-hidden">
                                    <Table>
                                        <TableHeader className="bg-muted/50">
                                            <TableRow>
                                                <TableHead>Product Information</TableHead>
                                                <TableHead className="w-[100px] text-center">Stock</TableHead>
                                                <TableHead className="w-[100px]">Quantity</TableHead>
                                                <TableHead className="w-[120px]">Unit Cost</TableHead>
                                                <TableHead className="text-right">Line Total</TableHead>
                                                <TableHead className="w-[50px]"></TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {fields.length === 0 && (
                                                <TableRow>
                                                    <TableCell colSpan={6} className="text-center h-40 text-muted-foreground">
                                                        <div className="flex flex-col items-center gap-2">
                                                            <AlertCircle className="h-8 w-8 opacity-20" />
                                                            <p>No items added yet.</p>
                                                            <p className="text-xs">Search for products above to begin.</p>
                                                        </div>
                                                    </TableCell>
                                                </TableRow>
                                            )}
                                            {fields.map((item, index) => (
                                                <TableRow key={item.id}>
                                                    <TableCell className="font-medium">
                                                        <div>{item.productName}</div>
                                                    </TableCell>
                                                    <TableCell className="text-center text-xs text-muted-foreground">
                                                        {item.currentStock || 0}
                                                    </TableCell>
                                                    <TableCell>
                                                        <Input
                                                            type="number"
                                                            min={1}
                                                            className="h-8 w-24"
                                                            {...form.register(`items.${index}.quantity`, { valueAsNumber: true })}
                                                            onChange={(e) => {
                                                                form.setValue(`items.${index}.quantity`, parseFloat(e.target.value));
                                                                calculateTotals();
                                                            }}
                                                        />
                                                    </TableCell>
                                                    <TableCell>
                                                        <Input
                                                            type="number"
                                                            min={0}
                                                            step="0.01"
                                                            className="h-8 w-28"
                                                            {...form.register(`items.${index}.unitCost`, { valueAsNumber: true })}
                                                            onChange={(e) => {
                                                                form.setValue(`items.${index}.unitCost`, parseFloat(e.target.value));
                                                                calculateTotals();
                                                            }}
                                                        />
                                                    </TableCell>
                                                    <TableCell className="text-right font-medium">
                                                        {(form.watch(`items.${index}.quantity`) * form.watch(`items.${index}.unitCost`)).toFixed(2)}
                                                    </TableCell>
                                                    <TableCell>
                                                        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive" onClick={() => { remove(index); calculateTotals(); }}>
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </div>

                                {/* Financial Summary */}
                                <div className="flex flex-col md:flex-row gap-8 pt-4">
                                    <div className="flex-1">
                                        <FormField
                                            control={form.control}
                                            name="notes"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Notes / Remarks</FormLabel>
                                                    <FormControl><Textarea className="h-32" placeholder="Start typing notes..." {...field} /></FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                    <div className="w-full md:w-[350px] space-y-3 bg-muted/20 p-4 rounded-lg border">
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="font-medium text-muted-foreground">Subtotal</span>
                                            <span>{form.watch("subTotal").toFixed(2)}</span>
                                        </div>
                                        <div className="flex items-center justify-between gap-4">
                                            <span className="text-sm font-medium text-muted-foreground">Order Tax</span>
                                            <Input
                                                type="number"
                                                className="h-8 w-24 text-right bg-background"
                                                {...form.register("tax", { valueAsNumber: true })}
                                            />
                                        </div>
                                        <div className="flex items-center justify-between gap-4">
                                            <span className="text-sm font-medium text-muted-foreground">Shipping</span>
                                            <Input
                                                type="number"
                                                className="h-8 w-24 text-right bg-background"
                                                {...form.register("shippingCost", { valueAsNumber: true })}
                                            />
                                        </div>
                                        <div className="flex items-center justify-between gap-4">
                                            <span className="text-sm font-medium text-muted-foreground">Discount</span>
                                            <Input
                                                type="number"
                                                className="h-8 w-24 text-right bg-background"
                                                {...form.register("discount", { valueAsNumber: true })}
                                            />
                                        </div>
                                        <div className="flex items-center justify-between border-t border-dashed pt-3 mt-2">
                                            <span className="text-lg font-bold">Grand Total</span>
                                            <span className="text-lg font-bold text-primary">{form.watch("grandTotal").toFixed(2)}</span>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </form>
        </Form>
    );
}
