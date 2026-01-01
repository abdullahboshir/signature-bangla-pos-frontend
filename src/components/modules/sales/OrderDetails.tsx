"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { format } from "date-fns";
import { ArrowLeft, Printer, ShoppingBag, User, MapPin, CreditCard, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { useGetOrderQuery, useUpdateOrderMutation } from "@/redux/api/sales/orderApi";
import { IOrder } from "./order.types";
import { InvoicePrint } from "./InvoicePrint";

const ORDER_STATUSES = [
    { value: "pending", label: "Pending" },
    { value: "confirmed", label: "Confirmed" },
    { value: "processing", label: "Processing" },
    { value: "shipped", label: "Shipped" },
    { value: "delivered", label: "Delivered" },
    { value: "cancelled", label: "Cancelled" },
    { value: "returned", label: "Returned" }
];

export default function OrderDetails() {
    const router = useRouter();
    const params = useParams();
    const [order, setOrder] = useState<IOrder | null>(null);
    const { data: orderData, isLoading: loading } = useGetOrderQuery(params.id as string, {
        skip: !params.id
    });

    const [updateStatus, { isLoading: updating }] = useUpdateOrderMutation();

    useEffect(() => {
        if (orderData) {
            setOrder(orderData);
        }
    }, [orderData]);

    const handleStatusChange = async (newStatus: string) => {
        if (!order) return;
        try {
            await updateStatus({ id: order._id, status: newStatus }).unwrap();
            toast.success(`Order updated to ${newStatus}`);
        } catch (error: any) {
            console.error("Failed to update status:", error);
            toast.error("Failed to update status");
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case "confirmed": return "bg-blue-100 text-blue-800";
            case "processing": return "bg-purple-100 text-purple-800";
            case "shipped": return "bg-indigo-100 text-indigo-800";
            case "delivered": return "bg-green-100 text-green-800";
            case "cancelled": return "bg-red-100 text-red-800";
            case "returned": return "bg-orange-100 text-orange-800";
            case "pending": return "bg-yellow-100 text-yellow-800";
            default: return "bg-gray-100 text-gray-800";
        }
    };

    const handlePrint = () => {
        window.print();
    };

    if (loading) return <div className="flex justify-center items-center h-96">Loading order details...</div>;
    if (!order) return <div className="flex justify-center items-center h-96">Order not found</div>;

    return (
        <>
            {/* Screen View */}
            <div className="space-y-6 max-w-5xl mx-auto pb-10 print:hidden">

                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    {/* ... (existing header content) ... */}
                    <div className="flex items-center gap-2">
                        <Button variant="ghost" size="icon" onClick={() => router.back()}>
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                        <div>
                            <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
                                Order {order.orderId}
                                <Badge className={getStatusColor(order.status)} variant="secondary">
                                    {order.status}
                                </Badge>
                            </h1>
                            <p className="text-sm text-muted-foreground">
                                Placed on {format(new Date(order.createdAt), "MMMM dd, yyyy 'at' h:mm a")}
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-[180px]">
                            <Select
                                disabled={updating}
                                value={order.status}
                                onValueChange={handleStatusChange}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Status" />
                                </SelectTrigger>
                                <SelectContent>
                                    {ORDER_STATUSES.map(s => (
                                        <SelectItem key={s.value} value={s.value}>
                                            {s.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <Button variant="outline" onClick={handlePrint}>
                            <Printer className="mr-2 h-4 w-4" /> Print Invoice
                        </Button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Main Content - Items */}
                    <div className="md:col-span-2 space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <ShoppingBag className="h-5 w-5 text-muted-foreground" />
                                    Order Items
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-0">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Product</TableHead>
                                            <TableHead className="text-right">Price</TableHead>
                                            <TableHead className="text-center">Qty</TableHead>
                                            <TableHead className="text-right">Total</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {order.items.map((item, i) => (
                                            <TableRow key={i}>
                                                <TableCell>
                                                    <div className="font-medium">
                                                        {(item.product as any)?.name || 'Unknown Product'}
                                                    </div>
                                                    <div className="text-xs text-muted-foreground">
                                                        SKU: {(item.product as any)?.sku || 'N/A'}
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-right">{item.price} BDT</TableCell>
                                                <TableCell className="text-center">{item.quantity}</TableCell>
                                                <TableCell className="text-right font-bold">{item.total} BDT</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>

                        {/* Order Summary */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Order Summary</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Subtotal</span>
                                    <span>{order.subTotal} BDT</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Tax</span>
                                    <span>{order.tax} BDT</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Discount</span>
                                    <span>- {order.discount} BDT</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Shipping</span>
                                    <span>{order.shippingCost} BDT</span>
                                </div>
                                <div className="border-t pt-2 mt-2 flex justify-between font-bold text-lg">
                                    <span>Total</span>
                                    <span>{order.totalAmount} BDT</span>
                                </div>
                                <div className="bg-muted/30 p-3 rounded-lg mt-4 space-y-1">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-muted-foreground">Paid Amount</span>
                                        <span className="font-medium text-green-600">{order.paidAmount} BDT</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-muted-foreground">Due Amount</span>
                                        <span className="font-medium text-destructive">{order.dueAmount} BDT</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Sidebar - Customer & Payment */}
                    <div className="space-y-6">
                        {/* Customer Info */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-base">
                                    <User className="h-4 w-4 text-muted-foreground" />
                                    Customer Details
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 bg-primary/10 rounded-full flex items-center justify-center text-primary font-bold">
                                        {(order.customer as any)?.name?.firstName?.[0] || 'G'}
                                    </div>
                                    <div>
                                        <div className="font-medium">
                                            {(order.customer as any)?.name?.firstName || 'Walk-in'} {(order.customer as any)?.name?.lastName || 'Customer'}
                                        </div>
                                        <div className="text-xs text-muted-foreground">
                                            {(order.customer as any)?.email}
                                        </div>
                                        <div className="text-xs text-muted-foreground">
                                            {(order.customer as any)?.phone}
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Payment Info */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-base">
                                    <CreditCard className="h-4 w-4 text-muted-foreground" />
                                    Payment Info
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Method</span>
                                    <Badge variant="outline" className="capitalize">{order.paymentMethod.replace('_', ' ')}</Badge>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Status</span>
                                    <Badge variant={order.paymentStatus === 'paid' ? 'default' : 'secondary'} className="capitalize">
                                        {order.paymentStatus}
                                    </Badge>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Shipping Address */}
                        {order.shippingAddress && (
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2 text-base">
                                        <MapPin className="h-4 w-4 text-muted-foreground" />
                                        Shipping Address
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="text-sm text-muted-foreground">
                                    <p>{order.shippingAddress.street}</p>
                                    <p>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}</p>
                                    <p>{order.shippingAddress.country}</p>
                                </CardContent>
                            </Card>
                        )}
                    </div>
                </div>
            </div>

            {/* Print View */}
            <div className="hidden print:block">
                <InvoicePrint order={order} />
            </div>
        </>
    );
}

