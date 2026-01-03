"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Minus, Plus, Search, ShoppingCart, Trash2, X, CheckCircle, Printer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";
import { CreateOrderPayload } from "./order.types";
import { useCurrentBusinessUnit } from "@/hooks/useCurrentBusinessUnit";
import { useGetProductsQuery } from "@/redux/api/catalog/productApi";
import { useGetAllUsersQuery } from "@/redux/api/iam/userApi";
import { useCreateOrderMutation } from "@/redux/api/sales/orderApi";
import { useAuth } from "@/hooks/useAuth";
import { useGetBusinessUnitsQuery } from "@/redux/api/organization/businessUnitApi";
import { useGetOutletsQuery } from "@/redux/api/organization/outletApi";
import { usePermissions } from "@/hooks/usePermissions";
import { PAYMENT_METHOD, PAYMENT_METHOD_OPTIONS } from "@/constant/order.constant";

// Types for POS
interface Product {
    _id: string;
    name: string;
    sku?: string;
    unit?: any;
    pricing: {
        salePrice?: number;
        basePrice: number;
    };
    inventory: {
        inventory: {
            stock: number;
        }
    };
    details: {
        images: string[];
    };
}

interface CartItem {
    product: Product;
    quantity: number;
    price: number;
    total: number;
}

export default function CreateOrder() {
    const router = useRouter();
    const { user } = useAuth();
    const { currentBusinessUnit: paramBusinessUnitObj } = useCurrentBusinessUnit();
    const { isSuperAdmin } = usePermissions();

    // SA Business Unit Selection
    const [selectedBusinessUnitId, setSelectedBusinessUnitId] = useState<string>("");
    const { data: businessUnits = [] } = useGetBusinessUnitsQuery({ limit: 100 }, { skip: !isSuperAdmin });

    // Determine effective Business Unit ID
    // If paramBusinessUnitObj exists (Scoped Context), use it.
    // Otherwise allow Manual Selection (Global Context).
    // Determine effective Business Unit ID
    // If paramBusinessUnitObj exists (Scoped Context), use it.
    // Otherwise allow Manual Selection (Global Context).
    const contextBusinessUnitId = paramBusinessUnitObj?._id || paramBusinessUnitObj?.id;
    const businessUnitId = contextBusinessUnitId || selectedBusinessUnitId;

    // Outlet Selection
    const [selectedOutletId, setSelectedOutletId] = useState<string>("");
    const { data: outlets = [] } = useGetOutletsQuery({ businessUnit: businessUnitId }, { skip: !businessUnitId });

    // Auto-select single outlet
    useEffect(() => {
        if (outlets.length === 1 && !selectedOutletId) {
            setSelectedOutletId(outlets[0]._id);
        }
    }, [outlets, selectedOutletId]);

    const [searchQuery, setSearchQuery] = useState("");
    const [cart, setCart] = useState<CartItem[]>([]);

    // API Hooks
    // Fetch products filtered by Business Unit?
    // Usually POS/Order creation is per outlet/BU.
    // If SA selects a BU, we should ideally filter products by that BU.
    // "useGetProductsQuery" supports businessUnit param in our previous refactor of ProductList.
    // Let's pass it here too.
    const { data: rawProducts = [], isLoading: isLoadingProducts } = useGetProductsQuery({
        search: searchQuery,
        limit: 20,
        businessUnit: businessUnitId // Explicitly use the effective BU ID (scoped or selected)
    }, {
        // Only skip if IS Super Admin AND NO BU selected (Global context without selection)
        // If in Scoped context, businessUnitId will be set, so it won't skip.
        skip: isSuperAdmin && !businessUnitId
    });

    // Normalize products data structure
    const products: Product[] = useMemo(() => {
        if (Array.isArray(rawProducts)) return rawProducts;
        if (rawProducts?.results && Array.isArray(rawProducts.results)) return rawProducts.results;
        return [];
    }, [rawProducts]);

    // Fetch all users for customer selection
    const { data: rawUsers = [] } = useGetAllUsersQuery({});

    // Filter customers
    const customers = useMemo(() => {
        let allUsers: any[] = [];
        if (Array.isArray(rawUsers)) {
            allUsers = rawUsers;
        } else if (rawUsers?.data && Array.isArray(rawUsers.data)) {
            allUsers = rawUsers.data;
        } else if (rawUsers?.result && Array.isArray(rawUsers.result)) {
            allUsers = rawUsers.result;
        }

        return allUsers.filter((u: any) =>
            u.roles?.some((r: any) => {
                const roleName = typeof r === 'string' ? r : r.name;
                return roleName === 'customer';
            })
        );
    }, [rawUsers]);

    const [createOrder, { isLoading: isSubmitting }] = useCreateOrderMutation();

    // Order State
    const [selectedCustomerId, setSelectedCustomerId] = useState<string>("");
    const [paymentMethod, setPaymentMethod] = useState("cash");
    const [paidAmount, setPaidAmount] = useState<string>("");

    const addToCart = (product: Product) => {
        setCart(prev => {
            const existing = prev.find(item => item.product._id === product._id);
            const price = product.pricing.salePrice || product.pricing.basePrice;

            if (existing) {
                return prev.map(item =>
                    item.product._id === product._id
                        ? { ...item, quantity: item.quantity + 1, total: (item.quantity + 1) * price }
                        : item
                );
            }

            return [...prev, {
                product,
                quantity: 1,
                price: price,
                total: price
            }];
        });
    };

    const updateQuantity = (productId: string, delta: number) => {
        setCart(prev => {
            return prev.map(item => {
                if (item.product._id === productId) {
                    const newQty = Math.max(1, item.quantity + delta);
                    return { ...item, quantity: newQty, total: newQty * item.price };
                }
                return item;
            });
        });
    };

    const removeFromCart = (productId: string) => {
        setCart(prev => prev.filter(item => item.product._id !== productId));
    };

    const calculateTotals = () => {
        const subTotal = cart.reduce((acc, item) => acc + item.total, 0);
        const tax = 0;
        const totalAmount = subTotal + tax;
        return { subTotal, tax, totalAmount };
    };

    const [orderSuccess, setOrderSuccess] = useState<any>(null);

    const handleCheckout = async () => {
        if (cart.length === 0) {
            toast.error("Cart is empty");
            return;
        }

        if (!selectedCustomerId) {
            toast.error("Please select a customer");
            return;
        }

        if (!businessUnitId) {
            toast.error("No business unit selected/detected");
            return;
        }

        if (!selectedOutletId) {
            toast.error("Please select an outlet"); // Ensure outlet is selected
            return;
        }

        const totals = calculateTotals();
        const payment = parseFloat(paidAmount || "0");

        const payload: CreateOrderPayload = {
            items: cart.map(item => ({
                product: item.product._id,
                quantity: item.quantity,
                price: item.price,
                total: item.total
            })),
            businessUnit: businessUnitId,
            subTotal: totals.subTotal,
            totalAmount: totals.totalAmount,
            paidAmount: payment,
            paymentMethod: paymentMethod as any,
            customer: selectedCustomerId,
            outlet: "" // Todo: Add Outlet Selection to CreateOrder or infer from context
        };

        try {
            const res = await createOrder(payload).unwrap();
            if (res.success) {
                toast.success("Order created successfully");
                setOrderSuccess(res.data);
            }
        } catch (error: any) {
            console.error("Checkout Error Full Object:", error);
            const resData = error.data || error;
            console.log("Error Response Data:", resData);

            let errorMessage = "Checkout failed";

            if (resData) {
                if (resData.errorSources && Array.isArray(resData.errorSources) && resData.errorSources.length > 0) {
                    errorMessage = resData.errorSources.map((e: any) => e.message).join('. ');
                }
                else if (resData.message && resData.message !== "Something went wrong!" && resData.message !== "Validation Error") {
                    errorMessage = resData.message;
                }
                else if (typeof resData.error === 'string') {
                    errorMessage = resData.error;
                }
                else if (typeof resData.error === 'object' && resData.error?.message) {
                    errorMessage = resData.error.message;
                }
                else if (resData.message) {
                    errorMessage = resData.message;
                }
            } else if (error.message) {
                errorMessage = error.message;
            }

            toast.error(errorMessage);
        }
    };

    const handleNewSale = () => {
        setCart([]);
        setPaidAmount("");
        setSelectedCustomerId("");
        setOrderSuccess(null);
        toast.info("Ready for new sale");
    }

    const { totalAmount } = calculateTotals();

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-[calc(100vh-100px)]">
            <div className="md:col-span-2 flex flex-col gap-4">
                {isSuperAdmin && (
                    <Card className="p-4 border-dashed border-2 bg-muted/20">
                        <div className="flex items-center gap-4">
                            <label className="text-sm font-medium whitespace-nowrap">Select Store Context:</label>
                            <Select
                                value={businessUnitId}
                                onValueChange={setSelectedBusinessUnitId}
                                disabled={!!contextBusinessUnitId}
                            >
                                <SelectTrigger className="w-[300px]">
                                    <SelectValue placeholder="Select Business Unit" />
                                </SelectTrigger>
                                <SelectContent>
                                    {businessUnits.map((bu: any) => (
                                        <SelectItem key={bu._id} value={bu._id}>{bu.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="flex items-center gap-4 mt-2">
                            <label className="text-sm font-medium whitespace-nowrap">Select Outlet Context:</label>
                            <Select
                                value={selectedOutletId}
                                onValueChange={setSelectedOutletId}
                                disabled={!businessUnitId}
                            >
                                <SelectTrigger className="w-[300px]">
                                    <SelectValue placeholder="Select Outlet" />
                                </SelectTrigger>
                                <SelectContent>
                                    {outlets.map((outlet: any) => (
                                        <SelectItem key={outlet._id} value={outlet._id}>{outlet.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </Card>
                )}

                {/* For non-super admins (scoped), we still might need to select outlet if they have multiple? 
                    Usually standard users are assigned to specific outlets or just one BU. 
                    If they are in a BU context, show outlet selector if not already shown above (isSuperAdmin check handles global SA).
                    But wait, isSuperAdmin check wraps the entire card. Scoped users won't see this.
                    We should probably expose Outlet selector for Scoped users too if they have multiple options, 
                    or if we want to enforce selection. 
                    For now, let's keep it simple: Add a separate Outlet selector card for everyone if not set? 
                    Or just piggyback on the SA card? 
                    The safer bet is to always show Outlet selector if businessUnitId is present but outlet isn't auto-selected.
                */}
                {!isSuperAdmin && businessUnitId && (
                    <Card className="p-4 border-dashed border-2 bg-muted/20">
                        <div className="flex items-center gap-4">
                            <label className="text-sm font-medium whitespace-nowrap">Select Outlet:</label>
                            <Select
                                value={selectedOutletId}
                                onValueChange={setSelectedOutletId}
                            >
                                <SelectTrigger className="w-[300px]">
                                    <SelectValue placeholder="Select Outlet" />
                                </SelectTrigger>
                                <SelectContent>
                                    {outlets.map((outlet: any) => (
                                        <SelectItem key={outlet._id} value={outlet._id}>{outlet.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </Card>
                )}

                <Card className="flex-1 flex flex-col overflow-hidden">
                    <CardHeader className="py-4">
                        <div className="relative">
                            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search products..."
                                className="pl-8"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </CardHeader>
                    <CardContent className="flex-1 overflow-auto p-4">
                        {(isSuperAdmin && !selectedBusinessUnitId) ? (
                            <div className="flex flex-col items-center justify-center h-40 text-muted-foreground">
                                <ShoppingCart className="h-10 w-10 mb-2 opacity-20" />
                                <p>Please select a business unit to start selling.</p>
                            </div>
                        ) : isLoadingProducts ? (
                            <div className="flex justify-center items-center h-40">Loading products...</div>
                        ) : (
                            <div className="rounded-md border">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead className="w-[60px]">Image</TableHead>
                                            <TableHead>Product</TableHead>
                                            <TableHead>Price</TableHead>
                                            <TableHead>Stock</TableHead>
                                            <TableHead className="text-right">Action</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {products.length === 0 ? (
                                            <TableRow>
                                                <TableCell colSpan={5} className="text-center py-10 text-muted-foreground">
                                                    No products found.
                                                </TableCell>
                                            </TableRow>
                                        ) : (
                                            products.map((product) => (
                                                <TableRow
                                                    key={product._id}
                                                    className="cursor-pointer hover:bg-muted/50"
                                                    onClick={() => addToCart(product)}
                                                >
                                                    <TableCell>
                                                        <div className="h-10 w-10 bg-muted rounded overflow-hidden flex items-center justify-center">
                                                            {product.details?.images?.[0] ? (
                                                                <img
                                                                    src={product.details.images[0]}
                                                                    alt={product.name}
                                                                    className="h-full w-full object-cover"
                                                                />
                                                            ) : (
                                                                <span className="text-[10px] text-muted-foreground">No img</span>
                                                            )}
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className="font-medium text-sm">{product.name}</div>
                                                        <div className="text-xs text-muted-foreground">SKU: {product.sku || 'N/A'}</div>
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className="font-bold text-primary">
                                                            {product.pricing.salePrice || product.pricing.basePrice} BDT
                                                            {product.unit && (
                                                                <span className="text-xs font-normal text-muted-foreground ml-1">
                                                                    / {typeof product.unit === 'object' ? (product.unit as any).name || (product.unit as any).symbol : product.unit}
                                                                </span>
                                                            )}
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Badge
                                                            variant={product.inventory?.inventory?.stock > 10 ? "secondary" : "destructive"}
                                                            className="whitespace-nowrap"
                                                        >
                                                            {product.inventory?.inventory?.stock || 0} in stock
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell className="text-right">
                                                        <Button size="sm" variant="outline" onClick={(e) => {
                                                            e.stopPropagation();
                                                            addToCart(product);
                                                        }}>
                                                            Add
                                                        </Button>
                                                    </TableCell>
                                                </TableRow>
                                            ))
                                        )}
                                    </TableBody>
                                </Table>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Cart Section */}
            <div className="flex flex-col gap-4 h-full">
                <Card className="flex-1 flex flex-col h-full border-primary/20 shadow-lg">
                    <CardHeader className="bg-primary/5 py-4 border-b">
                        <CardTitle className="flex items-center gap-2 text-lg">
                            <ShoppingCart className="h-5 w-5" /> Current Order
                        </CardTitle>
                    </CardHeader>

                    <ScrollArea className="flex-1 p-4">
                        <div className="space-y-4">
                            {cart.length === 0 ? (
                                <div className="text-center text-muted-foreground py-10 flex flex-col items-center">
                                    <ShoppingCart className="h-10 w-10 mb-2 opacity-20" />
                                    <p>Cart is empty</p>
                                    <p className="text-xs">Select products to add</p>
                                </div>
                            ) : (
                                cart.map(item => (
                                    <div key={item.product._id} className="flex gap-3 items-start border-b pb-3 last:border-0 animation-fade-in">
                                        <div className="flex-1">
                                            <p className="font-medium text-sm line-clamp-1">{item.product.name}</p>
                                            <p className="text-xs text-muted-foreground">{item.price} BDT/unit</p>
                                        </div>

                                        <div className="flex flex-col items-end gap-1">
                                            <div className="flex items-center gap-2">
                                                <Button size="icon" variant="outline" className="h-6 w-6" onClick={() => updateQuantity(item.product._id, -1)}>
                                                    <Minus className="h-3 w-3" />
                                                </Button>
                                                <span className="w-4 text-center text-sm font-medium">{item.quantity}</span>
                                                <Button size="icon" variant="outline" className="h-6 w-6" onClick={() => updateQuantity(item.product._id, 1)}>
                                                    <Plus className="h-3 w-3" />
                                                </Button>
                                            </div>
                                            <p className="font-bold text-sm">{item.total} BDT</p>
                                        </div>

                                        <Button size="icon" variant="ghost" className="h-6 w-6 text-destructive hover:bg-destructive/10" onClick={() => removeFromCart(item.product._id)}>
                                            <Trash2 className="h-3 w-3" />
                                        </Button>
                                    </div>
                                ))
                            )}
                        </div>
                    </ScrollArea>

                    <div className="p-4 bg-muted/20 border-t space-y-4">
                        <div className="space-y-2">
                            <div className="flex justify-between font-bold text-lg">
                                <span>Total</span>
                                <span>{totalAmount} BDT</span>
                            </div>
                        </div>

                        <div className="space-y-3 pt-2">
                            <div>
                                <label className="text-xs font-medium mb-1 block">Customer</label>
                                <Select value={selectedCustomerId} onValueChange={setSelectedCustomerId}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select Customer" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {customers.map((c: any) => (
                                            <SelectItem key={c._id} value={c._id}>
                                                {c.name?.firstName} {c.name?.lastName} ({c.phone || c.email})
                                            </SelectItem>
                                        ))}
                                        {customers.length === 0 && <div className="p-2 text-sm text-muted-foreground text-center">No customers found</div>}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div>
                                <label className="text-xs font-medium mb-1 block">Payment Method</label>
                                <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {PAYMENT_METHOD_OPTIONS.map((option) => (
                                            <SelectItem key={option.value} value={option.value}>
                                                {option.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div>
                                <label className="text-xs font-medium mb-1 block">Amount Paid</label>
                                <Input
                                    type="number"
                                    value={paidAmount}
                                    onChange={e => setPaidAmount(e.target.value)}
                                    placeholder="Enter amount..."
                                />
                            </div>
                        </div>

                        <Button className="w-full" size="lg" disabled={cart.length === 0 || isSubmitting} onClick={handleCheckout}>
                            {isSubmitting ? "Processing..." : `Complete Order (${totalAmount} BDT)`}
                        </Button>
                    </div>
                </Card>
            </div>

            {/* Success Dialog */}
            <Dialog open={!!orderSuccess} onOpenChange={(open) => !open && handleNewSale()}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2 text-green-600">
                            <CheckCircle className="h-6 w-6" />
                            Order Successful
                        </DialogTitle>
                        <DialogDescription>
                            Order <strong>{orderSuccess?.orderId}</strong> has been created.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="bg-muted/50 p-4 rounded-lg space-y-2">
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-muted-foreground">Total Amount:</span>
                                <span className="font-bold text-lg">{orderSuccess?.totalAmount} BDT</span>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-muted-foreground">Paid Amount:</span>
                                <span>{orderSuccess?.paidAmount} BDT</span>
                            </div>
                            <div className="flex justify-between items-center text-sm border-t pt-2 mt-2">
                                <span className="text-muted-foreground">Due Amount:</span>
                                <span className="font-medium text-destructive">{orderSuccess?.dueAmount} BDT</span>
                            </div>
                        </div>
                    </div>
                    <DialogFooter className="flex-col sm:flex-row gap-2">
                        <Button variant="outline" className="flex-1" onClick={() => router.back()}>
                            Go to List
                        </Button>
                        <Button variant="secondary" className="flex-1" onClick={() => toast.info("Printing not implemented yet")}>
                            <Printer className="mr-2 h-4 w-4" /> Print
                        </Button>
                        <Button className="flex-1" onClick={handleNewSale}>
                            New Sale
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}

