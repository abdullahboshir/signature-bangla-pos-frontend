"use client";

import { StatCard } from "@/components/shared/StatCard";
import { filterDataByDate } from "@/lib/dateFilterUtils";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { Eye, Plus, DollarSign, ShoppingBag, Clock, CheckCircle, FilePenLine, Search } from "lucide-react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { DateRange } from "react-day-picker";
import { DataTable } from "@/components/shared/DataTable";
import { DataPageLayout } from "@/components/shared/DataPageLayout";
import { ColumnDef } from "@tanstack/react-table";

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

    // Search State
    const [searchTerm, setSearchTerm] = useState("");

    // Tab State
    const [activeTab, setActiveTab] = useState<string>(initialTab);

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

        if (searchTerm) {
            const lower = searchTerm.toLowerCase();
            filtered = filtered.filter(o =>
                o.orderId.toLowerCase().includes(lower) ||
                o.customer?.name?.toLowerCase().includes(lower)
            );
        }

        if (status === "all") return filtered;
        return filtered.filter(o => o.status === status);
    };

    // Define Columns
    const columns: ColumnDef<IOrder>[] = [
        {
            accessorKey: "orderId",
            header: "Order ID",
            cell: ({ row }) => <span className="font-medium">{row.original.orderId}</span>,
        },
        {
            accessorKey: "createdAt",
            header: "Date",
            cell: ({ row }) => format(new Date(row.original.createdAt), "dd MMM yyyy"),
        },
        {
            accessorKey: "customer.name",
            header: "Customer",
            cell: ({ row }) => row.original.customer?.name || "Walk-in Customer",
        },
        {
            accessorKey: "totalAmount",
            header: "Total",
            cell: ({ row }) => `${row.original.totalAmount} BDT`,
        },
        {
            accessorKey: "paymentStatus",
            header: "Payment",
            cell: ({ row }) => (
                <Badge variant="outline" className="capitalize">
                    {row.original.paymentStatus}
                </Badge>
            ),
        },
        {
            accessorKey: "status",
            header: "Status",
            cell: ({ row }) => (
                <Badge className={getStatusColor(row.original.status)} variant="secondary">
                    {row.original.status}
                </Badge>
            ),
        },
        {
            id: "actions",
            header: "Actions",
            cell: ({ row }) => (
                <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="icon" onClick={() => openQuickUpdate(row.original)}>
                        <FilePenLine className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" asChild>
                        <Link href={`${pathname}/${row.original._id}`}>
                            <Eye className="h-4 w-4" />
                        </Link>
                    </Button>
                </div>
            ),
        },
    ];

    return (
        <>
            <DataPageLayout
                title="Orders"
                createAction={{
                    label: "Create Order",
                    onClick: () => router.push(`${pathname}/create`)
                }}
                extraFilters={
                    <div className="relative flex-1 max-w-sm ml-auto">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search orders..."
                            className="pl-8"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                }
                stats={
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
                }
                tabs={[
                    { value: "all", label: "All" },
                    ...ORDER_STATUSES.map(s => ({ value: s.value, label: s.label }))
                ]}
                activeTab={activeTab}
                onTabChange={setActiveTab}
                dateFilter={{
                    dateFilter,
                    setDateFilter,
                    dateRange,
                    setDateRange,
                    isCalendarOpen,
                    setIsCalendarOpen
                }}
            >
                <TabsContent value="all" className="mt-0">
                    <DataTable columns={columns} data={filterOrders("all")} isLoading={loading} />
                </TabsContent>
                {ORDER_STATUSES.map(status => (
                    <TabsContent key={status.value} value={status.value} className="mt-0">
                        <DataTable columns={columns} data={filterOrders(status.value)} isLoading={loading} />
                    </TabsContent>
                ))}
            </DataPageLayout>

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
        </>
    );
}
