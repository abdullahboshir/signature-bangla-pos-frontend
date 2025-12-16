import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { Eye, Plus } from "lucide-react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table";
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { OrderService } from "./OrderService";
import { IOrder } from "./order.types";
import { toast } from "sonner";

interface OrderListProps {
    initialTab?: "all" | "shipping" | "delivery" | "returns";
}

export default function OrderList({ initialTab = "all" }: OrderListProps) {
    const router = useRouter();
    const pathname = usePathname();
    const [orders, setOrders] = useState<IOrder[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            setLoading(true);
            const res = await OrderService.getAllOrders();
            if (res.success) {
                setOrders(res.data);
            }
        } catch (error: any) {
            console.error("Failed to fetch orders:", error);
            toast.error(`Failed to load orders: ${error.message || "Unknown error"}`);
        } finally {
            setLoading(false);
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

    const filterOrders = (category: string) => {
        switch (category) {
            case "shipping":
                return orders.filter(o => ["confirmed", "processing", "shipped"].includes(o.status));
            case "delivery":
                return orders.filter(o => o.status === "delivered");
            case "returns":
                return orders.filter(o => ["cancelled", "returned"].includes(o.status));
            default:
                return orders;
        }
    };

    const OrdersTable = ({ data }: { data: IOrder[] }) => (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Order ID</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Payment</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {loading ? (
                    <TableRow>
                        <TableCell colSpan={7} className="text-center py-8">Loading...</TableCell>
                    </TableRow>
                ) : data.length === 0 ? (
                    <TableRow>
                        <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">No orders found</TableCell>
                    </TableRow>
                ) : (
                    data.map((order) => (
                        <TableRow key={order._id}>
                            <TableCell className="font-medium">{order.orderId}</TableCell>
                            <TableCell>{format(new Date(order.createdAt), "dd MMM yyyy")}</TableCell>
                            <TableCell>{order.customer?.name || "Walk-in Customer"}</TableCell>
                            <TableCell>{order.totalAmount} BDT</TableCell>
                            <TableCell>
                                <Badge variant="outline" className="capitalize">{order.paymentStatus}</Badge>
                            </TableCell>
                            <TableCell>
                                <Badge className={getStatusColor(order.status)} variant="secondary">
                                    {order.status}
                                </Badge>
                            </TableCell>
                            <TableCell className="text-right">
                                <Button variant="ghost" size="icon" asChild>
                                    <Link href={`./sales/${order._id}`}>
                                        <Eye className="h-4 w-4" />
                                    </Link>
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))
                )}
            </TableBody>
        </Table>
    );

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Orders Dashboard</h2>
                    <p className="text-muted-foreground">Manage and track your sales performance.</p>
                </div>
                <Button onClick={() => router.push(`${pathname}/create`)}>
                    <Plus className="mr-2 h-4 w-4" /> Create Order
                </Button>
            </div>

            <Tabs defaultValue={initialTab} className="space-y-4">
                <TabsList>
                    <TabsTrigger value="all">All Orders</TabsTrigger>
                    <TabsTrigger value="shipping">Shipping & Processing</TabsTrigger>
                    <TabsTrigger value="delivery">Delivered</TabsTrigger>
                    <TabsTrigger value="returns">Returns & Cancelled</TabsTrigger>
                </TabsList>

                <TabsContent value="all">
                    <Card>
                        <CardHeader>
                            <CardTitle>All Orders</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <OrdersTable data={orders} />
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="shipping">
                    <Card>
                        <CardHeader>
                            <CardTitle>Shipping & Processing</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <OrdersTable data={filterOrders("shipping")} />
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="delivery">
                    <Card>
                        <CardHeader>
                            <CardTitle>Completed Deliveries</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <OrdersTable data={filterOrders("delivery")} />
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="returns">
                    <Card>
                        <CardHeader>
                            <CardTitle>Returns & Cancellations</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <OrdersTable data={filterOrders("returns")} />
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
