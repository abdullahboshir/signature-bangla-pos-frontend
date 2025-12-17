import { StatCard } from "@/components/shared/StatCard";
import { DateRangeFilter } from "@/components/shared/DateRangeFilter";
import { filterDataByDate } from "@/lib/dateFilterUtils";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { Eye, Plus, DollarSign, ShoppingBag, Clock, CheckCircle, FilePenLine } from "lucide-react";
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
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as CalendarIcon } from "lucide-react";
import { DateRange } from "react-day-picker";
import { subDays, startOfDay, endOfDay, startOfMonth, endOfMonth, startOfYear, endOfYear, subMonths, subYears, isWithinInterval } from "date-fns";
import { cn } from "@/lib/utils";

const ORDER_STATUSES = [
    { value: "pending", label: "Pending" },
    { value: "confirmed", label: "Confirmed" },
    { value: "processing", label: "Processing" },
    { value: "shipped", label: "Shipped" },
    { value: "delivered", label: "Delivered" },
    { value: "cancelled", label: "Cancelled" },
    { value: "returned", label: "Returned" }
];

interface OrderListProps {
    initialTab?: "all" | "shipping" | "delivery" | "returns";
}

export default function OrderList({ initialTab = "all" }: OrderListProps) {
    const router = useRouter();
    const pathname = usePathname();
    const [orders, setOrders] = useState<IOrder[]>([]);
    const [loading, setLoading] = useState(true);

    // Quick Update State
    const [updateOpen, setUpdateOpen] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState<IOrder | null>(null);
    const [newStatus, setNewStatus] = useState<string>("");
    const [updating, setUpdating] = useState(false);

    // Date Filter State
    const [dateFilter, setDateFilter] = useState<string>("all");
    const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);
    const [isCalendarOpen, setIsCalendarOpen] = useState(false);

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

    const openQuickUpdate = (order: IOrder) => {
        setSelectedOrder(order);
        setNewStatus(order.status);
        setUpdateOpen(true);
    };

    const handleQuickUpdate = async () => {
        if (!selectedOrder || !newStatus) return;

        try {
            setUpdating(true);
            const res = await OrderService.updateStatus(selectedOrder._id, newStatus);
            if (res.success) {
                toast.success("Order status updated successfully");
                setUpdateOpen(false);
                fetchOrders(); // Refresh list
            }
        } catch (error: any) {
            console.error("Failed to update status:", error);
            toast.error("Failed to update status");
        } finally {
            setUpdating(false);
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


    const filterOrders = (status: string) => {
        let filtered = filterDataByDate(orders, "createdAt", dateFilter, dateRange);
        if (status === "all") return filtered;
        return filtered.filter(o => o.status === status);
    };

    const OrdersTable = ({ data }: { data: IOrder[] }) => (
        <div className="rounded-md border">
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
                                    <Button variant="ghost" size="icon" onClick={() => openQuickUpdate(order)}>
                                        <FilePenLine className="h-4 w-4" />
                                    </Button>
                                    <Button variant="ghost" size="icon" asChild>
                                        <Link href={`${pathname}/${order._id}`}>
                                            <Eye className="h-4 w-4" />
                                        </Link>
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
        </div>
    );

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Orders</h2>
                </div>
                <Button onClick={() => router.push(`${pathname}/create`)}>
                    <Plus className="mr-2 h-4 w-4" /> Create Order
                </Button>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <StatCard
                    title="Total Revenue"
                    icon={DollarSign}
                    value={`${orders
                        .filter(o => o.status === 'delivered')
                        .reduce((acc, order) => acc + (order.totalAmount || 0), 0)
                        .toLocaleString()} BDT`}
                />
                <StatCard
                    title="Total Orders"
                    icon={ShoppingBag}
                    value={orders.filter(o => o.status !== 'cancelled').length}
                />
                <StatCard
                    title="Pending Processing"
                    icon={Clock}
                    value={orders.filter(o => ["pending", "processing", "confirmed"].includes(o.status)).length}
                />
                <StatCard
                    title="Delivered"
                    icon={CheckCircle}
                    value={orders.filter(o => o.status === 'delivered').length}
                />
            </div>

            <Tabs defaultValue={initialTab} className="space-y-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0">
                        <div className="flex items-center gap-2">
                            <div className="overflow-x-auto max-w-[700px]">
                                <TabsList>
                                    <TabsTrigger value="all">All</TabsTrigger>
                                    {ORDER_STATUSES.map(status => (
                                        <TabsTrigger key={status.value} value={status.value}>
                                            {status.label}
                                        </TabsTrigger>
                                    ))}
                                </TabsList>
                            </div>

                            <DateRangeFilter
                                dateFilter={dateFilter}
                                setDateFilter={setDateFilter}
                                dateRange={dateRange}
                                setDateRange={setDateRange}
                                isCalendarOpen={isCalendarOpen}
                                setIsCalendarOpen={setIsCalendarOpen}
                            />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <TabsContent value="all" className="mt-0">
                            <OrdersTable data={filterOrders("all")} />
                        </TabsContent>

                        {ORDER_STATUSES.map(status => (
                            <TabsContent key={status.value} value={status.value} className="mt-0">
                                <OrdersTable data={filterOrders(status.value)} />
                            </TabsContent>
                        ))}
                    </CardContent>
                </Card>
            </Tabs>

            <Dialog open={updateOpen} onOpenChange={setUpdateOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Update Order Status</DialogTitle>
                        <DialogDescription>
                            Change the status for Order #{selectedOrder?.orderId}
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="status" className="text-right">
                                Status
                            </Label>
                            <div className="col-span-3">
                                <Select value={newStatus} onValueChange={setNewStatus}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {ORDER_STATUSES.map((status) => (
                                            <SelectItem key={status.value} value={status.value}>
                                                {status.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setUpdateOpen(false)}>Cancel</Button>
                        <Button onClick={handleQuickUpdate} disabled={updating}>
                            {updating ? "Updating..." : "Update Status"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
