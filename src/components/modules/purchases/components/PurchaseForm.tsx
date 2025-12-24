"use client"

import { useForm, useFieldArray, Controller } from "react-hook-form";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { PurchaseItemsField } from "./PurchaseItemsField";
import { useGetSuppliersQuery } from "@/redux/api/supplierApi";
import { useGetBusinessUnitsQuery } from "@/redux/api/businessUnitApi";
import { useGetAllOutletsQuery } from "@/redux/api/outletApi";
import { useAuth } from "@/hooks/useAuth";
import { Separator } from "@/components/ui/separator";
import { Loader2 } from "lucide-react";

interface PurchaseFormProps {
    initialValues?: any;
    onSubmit: (values: any) => void;
    isSuperAdmin?: boolean;
    businessUnits?: any[];
    contextBUId?: string;
    isSubmitting?: boolean;
}

export const PurchaseForm = ({
    initialValues,
    onSubmit,
    isSuperAdmin,
    businessUnits = [],
    contextBUId,
    isSubmitting
}: PurchaseFormProps) => {
    // Queries
    const form = useForm({
        defaultValues: initialValues || {
            status: "pending",
            items: [],
            purchaseDate: new Date().toISOString().split("T")[0],
            discount: 0,
            tax: 0,
            shippingCost: 0,
            paidAmount: 0
        }
    });

    const selectedBU = form.watch("businessUnit") || contextBUId;

    const { data: suppliersResponse } = useGetSuppliersQuery(
        selectedBU ? { businessUnits: selectedBU } : {},
        { refetchOnMountOrArgChange: true }
    );
    const suppliers = suppliersResponse || [];

    const { data: outlets = [] } = useGetAllOutletsQuery({
        businessUnit: selectedBU
    }, {
        skip: !selectedBU
    });

    const handleSubmit = async (values: any) => {
        // Calculate totals logic (redundant safeguard)
        if (values.items && Array.isArray(values.items)) {
            values.subTotal = values.items.reduce((acc: number, item: any) => acc + (item.total || 0), 0);
            values.grandTotal = Math.max(0, values.subTotal + (Number(values.tax) || 0) + (Number(values.shippingCost) || 0) - (Number(values.discount) || 0));
            values.dueAmount = Math.max(0, values.grandTotal - (Number(values.paidAmount) || 0));

            if (values.paidAmount >= values.grandTotal) {
                values.paymentStatus = 'paid';
            } else if (values.paidAmount > 0) {
                values.paymentStatus = 'partial';
            } else {
                values.paymentStatus = 'pending';
            }
        }

        await onSubmit(values);
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
                <div className="grid gap-6 md:grid-cols-2">
                    {/* General Information Card */}
                    <Card className="md:col-span-2">
                        <CardHeader>
                            <CardTitle>Details</CardTitle>
                            <CardDescription>Basic purchase information</CardDescription>
                        </CardHeader>
                        <CardContent className="grid gap-6 md:grid-cols-3">
                            {/* Business Unit (only for SA in global or if editable) */}
                            {isSuperAdmin && !contextBUId && (
                                <FormField
                                    control={form.control}
                                    name="businessUnit"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Business Unit</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select Business Unit" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {businessUnits.map((bu: any) => (
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
                                rules={{ required: "Supplier is required" }}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Supplier</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select Supplier" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {suppliers.length > 0 ? (
                                                    suppliers.map((s: any) => (
                                                        <SelectItem key={s._id || s.id} value={s._id || s.id}>{s.name}</SelectItem>
                                                    ))
                                                ) : (
                                                    <div className="p-2 text-sm text-muted-foreground text-center">
                                                        No suppliers found for business unit.
                                                        <br />
                                                        Ensure suppliers are assigned.
                                                    </div>
                                                )}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="outlet"
                                rules={{ required: "Outlet is required" }}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Outlet</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value} disabled={!selectedBU && !contextBUId}>
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
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="purchaseDate"
                                rules={{ required: "Date is required" }}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Purchase Date</FormLabel>
                                        <FormControl>
                                            <Input type="date" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="status"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Status</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select Status" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="pending">Pending</SelectItem>
                                                <SelectItem value="ordered">Ordered</SelectItem>
                                                <SelectItem value="received">Received</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="referenceNo"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Reference No</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Optional REF-123" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </CardContent>
                    </Card>

                    {/* Items Card */}
                    <Card className="md:col-span-2">
                        <CardHeader>
                            <CardTitle>Items</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <PurchaseItemsField control={form.control} name="items" />
                        </CardContent>
                    </Card>

                    <div className="md:col-span-2 grid gap-6 md:grid-cols-2">
                        {/* Financials Inputs */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Financials & Payment</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <FormField
                                        control={form.control}
                                        name="discount"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Discount (-)</FormLabel>
                                                <FormControl>
                                                    <Input type="number" {...field} onChange={e => field.onChange(Number(e.target.value))} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="shippingCost"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Shipping (+)</FormLabel>
                                                <FormControl>
                                                    <Input type="number" {...field} onChange={e => field.onChange(Number(e.target.value))} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="tax"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Tax (+)</FormLabel>
                                                <FormControl>
                                                    <Input type="number" {...field} onChange={e => field.onChange(Number(e.target.value))} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="paidAmount"
                                        render={({ field }) => {
                                            // Calculate Grand Total live for validation
                                            const itemsTotal = (form.watch('items') || []).reduce((acc: number, item: any) => acc + (item.total || 0), 0);
                                            const discount = Number(form.watch('discount')) || 0;
                                            const tax = Number(form.watch('tax')) || 0;
                                            const shipping = Number(form.watch('shippingCost')) || 0;
                                            const grandTotal = Math.max(0, itemsTotal - discount + tax + shipping);

                                            const isExcess = (Number(field.value) || 0) > grandTotal;

                                            return (
                                                <FormItem>
                                                    <FormLabel className={isExcess ? "text-destructive" : ""}>
                                                        Paid Amount
                                                    </FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            type="number"
                                                            {...field}
                                                            onChange={e => {
                                                                // Allow typing, but warn
                                                                field.onChange(Number(e.target.value));
                                                            }}
                                                            className={isExcess ? "border-destructive focus-visible:ring-destructive" : ""}
                                                        />
                                                    </FormControl>
                                                    {isExcess && (
                                                        <p className="text-[0.8rem] font-medium text-destructive">
                                                            Paid amount cannot exceed Total ({grandTotal.toFixed(2)})
                                                        </p>
                                                    )}
                                                    <FormMessage />
                                                </FormItem>
                                            );
                                        }}
                                    />
                                </div>

                                <Separator />

                                <div className="grid grid-cols-1 gap-4">
                                    <FormField
                                        control={form.control}
                                        name="paymentMethod"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Payment Method</FormLabel>
                                                <Select onValueChange={field.onChange} defaultValue={field.value}>
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
                                                        <SelectItem value="credit">Credit</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="notes"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Notes</FormLabel>
                                                <FormControl>
                                                    <Textarea {...field} placeholder="Any additional notes..." />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </CardContent>
                        </Card>

                        {/* Order Summary Calculation */}
                        <Card className="h-fit bg-muted/20">
                            <CardHeader>
                                <CardTitle>Order Summary</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Subtotal ({form.watch('items')?.length || 0} items)</span>
                                    <span>
                                        {((form.watch('items') || []).reduce((acc: number, item: any) => acc + (item.total || 0), 0)).toFixed(2)}
                                    </span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Discount</span>
                                    <span className="text-red-500">- {Number(form.watch('discount') || 0).toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Shipping Cost</span>
                                    <span>+ {Number(form.watch('shippingCost') || 0).toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Tax</span>
                                    <span>+ {Number(form.watch('tax') || 0).toFixed(2)}</span>
                                </div>

                                <Separator className="my-2" />

                                <div className="flex justify-between font-bold text-lg">
                                    <span>Grand Total</span>
                                    <span>
                                        {(
                                            Math.max(0,
                                                ((form.watch('items') || []).reduce((acc: number, item: any) => acc + (item.total || 0), 0))
                                                - (Number(form.watch('discount')) || 0)
                                                + (Number(form.watch('tax')) || 0)
                                                + (Number(form.watch('shippingCost')) || 0)
                                            )
                                        ).toFixed(2)}
                                    </span>
                                </div>

                                <div className="flex justify-between text-sm mt-2 pt-2 border-t border-dashed">
                                    <span className="text-muted-foreground">Paid</span>
                                    <span>{Number(form.watch('paidAmount') || 0).toFixed(2)}</span>
                                </div>

                                <div className={`flex justify-between font-medium ${(
                                    Math.max(0,
                                        ((form.watch('items') || []).reduce((acc: number, item: any) => acc + (item.total || 0), 0))
                                        - (Number(form.watch('discount')) || 0)
                                        + (Number(form.watch('tax')) || 0)
                                        + (Number(form.watch('shippingCost')) || 0)
                                    ) - (Number(form.watch('paidAmount')) || 0)
                                ) > 0 ? "text-destructive" : "text-green-600"
                                    }`}>
                                    <span>Due Amount</span>
                                    <span>
                                        {(
                                            Math.max(0,
                                                (
                                                    Math.max(0,
                                                        ((form.watch('items') || []).reduce((acc: number, item: any) => acc + (item.total || 0), 0))
                                                        - (Number(form.watch('discount')) || 0)
                                                        + (Number(form.watch('tax')) || 0)
                                                        + (Number(form.watch('shippingCost')) || 0)
                                                    )
                                                ) - (Number(form.watch('paidAmount')) || 0)
                                            )
                                        ).toFixed(2)}
                                    </span>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>

                <div className="flex justify-end gap-4">
                    <Button type="button" variant="outline" onClick={() => window.history.back()}>
                        Cancel
                    </Button>
                    <Button type="submit" disabled={isSubmitting}>
                        {isSubmitting ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Saving...
                            </>
                        ) : (
                            "Create Purchase"
                        )}
                    </Button>
                </div>
            </form>
        </Form>
    );
};
