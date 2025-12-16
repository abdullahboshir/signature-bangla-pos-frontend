import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Printer } from "lucide-react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { OrderService } from "./OrderService";
import { IOrder } from "./order.types";
import { toast } from "sonner";

export default function OrderDetails() {
    const params = useParams();
    const router = useRouter();
    const [order, setOrder] = useState<IOrder | null>(null);
    const [loading, setLoading] = useState(true);

    const id = params?.id as string;

    useEffect(() => {
        if (id) {
            fetchOrder();
        }
    }, [id]);

    const fetchOrder = async () => {
        try {
            setLoading(true);
            const res = await OrderService.getOrderById(id);
            if (res.success) {
                setOrder(res.data);
            }
        } catch (error) {
            console.error(error);
            toast.error("Failed to load order details");
        } finally {
            setLoading(false);
        }
    };

    const updateStatus = async (newStatus: string) => {
        if (!order) return;
        try {
            const res = await OrderService.updateStatus(id, newStatus);
            if (res.success) {
                toast.success("Order status updated");
                setOrder({ ...order, status: newStatus as any });
            }
        } catch (error) {
            console.error(error);
            toast.error("Failed to update status");
        }
    };

    if (loading) return <div className="p-8 text-center">Loading order details...</div>;
    if (!order) return <div className="p-8 text-center text-destructive">Order not found</div>;

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Button variant="outline" size="icon" onClick={() => router.back()}>
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight">Order {order.orderId}</h2>
                        <p className="text-sm text-muted-foreground">
                            Placed on {format(new Date(order.createdAt), "PPP p")}
                        </p>
                    </div>
                </div>
                <Button variant="outline" onClick={() => window.print()}>
                    <Printer className="mr-2 h-4 w-4" /> Print Invoice
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2 space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Order Items</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {order.items.map((item, idx) => (
                                    <div key={idx} className="flex justify-between items-center py-2 border-b last:border-0">
                                        <div className="flex items-center gap-4">
                                            {/* Could add image here */}
                                            <div>
                                                <p className="font-medium">{item.product?.name || "Unknown Product"}</p>
                                                {item.variant && <p className="text-sm text-muted-foreground">{item.variant}</p>}
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm font-medium">{item.price} x {item.quantity}</p>
                                            <p className="font-bold">{item.total} BDT</p>
                                        </div>
                                    </div>
                                ))}

                                <div className="space-y-2 pt-4">
                                    <div className="flex justify-between text-sm">
                                        <span>Subtotal</span>
                                        <span>{order.subTotal} BDT</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span>Discount</span>
                                        <span>- {order.discount} BDT</span>
                                    </div>

                                    <Separator className="my-2" />
                                    <div className="flex justify-between font-bold text-lg">
                                        <span>Total</span>
                                        <span>{order.totalAmount} BDT</span>
                                    </div>
                                    <div className="flex justify-between text-sm text-muted-foreground">
                                        <span>Paid</span>
                                        <span>{order.paidAmount} BDT</span>
                                    </div>
                                    <div className="flex justify-between text-sm text-red-500 font-medium">
                                        <span>Due</span>
                                        <span>{order.dueAmount} BDT</span>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Customer Details</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <h4 className="font-semibold text-sm">Customer</h4>
                                <p className="text-sm">{order.customer?.name || "Guest / Walk-in"}</p>
                                {order.customer?.phone && <p className="text-sm text-muted-foreground">{order.customer.phone}</p>}
                                {order.customer?.email && <p className="text-sm text-muted-foreground">{order.customer.email}</p>}
                            </div>
                            <Separator />
                            <div>
                                <h4 className="font-semibold text-sm">Shipping Address</h4>
                                {order.shippingAddress ? (
                                    <div className="text-sm text-muted-foreground">
                                        <p>{order.shippingAddress.street}</p>
                                        <p>{order.shippingAddress.city}, {order.shippingAddress.postalCode}</p>
                                        <p>{order.shippingAddress.country}</p>
                                    </div>
                                ) : (
                                    <p className="text-sm text-muted-foreground">No shipping address provided</p>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Order Status</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Order Status</label>
                                <select
                                    className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                    value={order.status}
                                    onChange={(e) => updateStatus(e.target.value)}
                                >
                                    {["pending", "confirmed", "processing", "shipped", "delivered", "cancelled", "returned"].map(s => (
                                        <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm font-medium">Payment Status</span>
                                <Badge variant={order.paymentStatus === 'paid' ? "default" : "outline"}>
                                    {order.paymentStatus}
                                </Badge>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm font-medium">Payment Method</span>
                                <span className="text-sm capitalize">{order.paymentMethod?.replace("_", " ")}</span>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
