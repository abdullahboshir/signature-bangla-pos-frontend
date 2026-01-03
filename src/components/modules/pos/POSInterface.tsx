"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Minus, Plus, Search, ShoppingCart, User, CreditCard, Trash2, X, CheckCircle, Printer, ScanBarcode } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { usePermissions } from "@/hooks/usePermissions";
import { useCurrentBusinessUnit } from "@/hooks/useCurrentBusinessUnit";
import { checkIsSuperAdmin } from "@/lib/iam/permissions";
import { useGetProductsQuery } from "@/redux/api/catalog/productApi";
import { useGetAllUsersQuery } from "@/redux/api/iam/userApi";
import { useCreateOrderMutation } from "@/redux/api/sales/orderApi";
import { useGetBusinessUnitsQuery } from "@/redux/api/organization/businessUnitApi";
import { useGetOutletsQuery } from "@/redux/api/organization/outletApi";
import { CreateOrderPayload } from "@/components/modules/sales/order.types";
import { ReceiptTemplate } from "./ReceiptTemplate";
import { useGetBusinessUnitSettingsQuery } from "@/redux/api/system/settingsApi";

// Reusing types is fine, or define locally if simple
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
        };
        outletStock?: {
            outlet: string;
            stock: number;
            reserved: number;
        }[];
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
    currentStock: number;
}

export default function POSInterface() {
    const router = useRouter();
    const { user } = useAuth();
    const { currentBusinessUnit: paramBusinessUnitObj } = useCurrentBusinessUnit();
    const { isSuperAdmin } = usePermissions();

    // SA Business Unit Selection
    const [selectedBusinessUnitId, setSelectedBusinessUnitId] = useState<string>("");
    const { data: businessUnits = [] } = useGetBusinessUnitsQuery({ limit: 100 }, { skip: !isSuperAdmin });

    // EFFECTIVE BU ID: Prioritize URL Context (paramBusinessUnitObj) over Manual Selection
    // If paramBusinessUnitObj exists, we are in a SCOPED route -> lock to that BU.
    // If not, we are in GLOBAL route -> allow manual selection.
    const contextBusinessUnitId = paramBusinessUnitObj?._id || paramBusinessUnitObj?.id;
    const businessUnitId = contextBusinessUnitId || selectedBusinessUnitId;

    // Outlet Selection
    const [selectedOutletId, setSelectedOutletId] = useState<string>("");
    const { data: outlets = [] } = useGetOutletsQuery({ businessUnit: businessUnitId }, { skip: !businessUnitId });

    // Fetch Settings for Receipt
    const { data: settingsData } = useGetBusinessUnitSettingsQuery(businessUnitId, {
        skip: !businessUnitId
    });

    const handlePrintReceipt = () => {
        window.print();
    };

    // Auto-select single outlet
    useEffect(() => {
        if (outlets.length === 1 && !selectedOutletId) {
            setSelectedOutletId(outlets[0]._id);
        }
    }, [outlets, selectedOutletId]);

    const [searchQuery, setSearchQuery] = useState("");
    const [cart, setCart] = useState<CartItem[]>([]);

    // API Hooks
    const { data: rawProducts = [], isLoading: isLoadingProducts } = useGetProductsQuery({
        search: searchQuery,
        limit: 50, // Higher limit for grid
        businessUnit: businessUnitId
    }, {
        skip: !businessUnitId
    });

    const products: Product[] = useMemo(() => {
        let productList = [];
        if (Array.isArray(rawProducts)) productList = rawProducts;
        else if (rawProducts?.results && Array.isArray(rawProducts.results)) productList = rawProducts.results;

        return productList;
    }, [rawProducts]);

    const getStockForOutlet = (product: Product, outletId: string) => {
        if (!outletId) return 0;
        const outletData = product.inventory?.outletStock?.find((os: any) => os.outlet === outletId || os.outlet?._id === outletId);
        return outletData ? (outletData.stock - (outletData.reserved || 0)) : 0;
    };

    const { data: rawUsers = [] } = useGetAllUsersQuery({});

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
            checkIsSuperAdmin(u) || u.roles?.some((r: any) => {
                const roleName = typeof r === 'string' ? r : r.name;
                return roleName === 'customer';
            })
        );
    }, [rawUsers]);

    const [createOrder, { isLoading: isSubmitting }] = useCreateOrderMutation();

    const [selectedCustomerId, setSelectedCustomerId] = useState<string>("");
    const [paymentMethod, setPaymentMethod] = useState("cash");
    const [paidAmount, setPaidAmount] = useState<string>("");

    // Cart Logic
    const addToCart = (product: Product) => {
        if (!selectedOutletId) {
            toast.error("Please select an outlet first");
            return;
        }

        const currentStock = getStockForOutlet(product, selectedOutletId);

        if (currentStock <= 0) {
            toast.error("Product out of stock at this outlet");
            return;
        }

        setCart(prev => {
            const existing = prev.find(item => item.product._id === product._id);
            const price = product.pricing.salePrice || product.pricing.basePrice;

            if (existing) {
                if (existing.quantity >= currentStock) {
                    toast.error("Insufficient stock");
                    return prev;
                }
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
                total: price,
                currentStock
            }];
        });
        toast.success(`Added ${product.name}`);
    };

    const updateQuantity = (productId: string, delta: number) => {
        setCart(prev => {
            return prev.map(item => {
                if (item.product._id === productId) {
                    const newQty = Math.max(1, item.quantity + delta);

                    // Check stock limit
                    if (delta > 0 && newQty > item.currentStock) {
                        toast.error("Max stock reached");
                        return item;
                    }

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

    const { totalAmount, subTotal, tax } = calculateTotals();
    const [orderSuccess, setOrderSuccess] = useState<any>(null);

    const handleCheckout = async () => {
        if (cart.length === 0) {
            toast.error("Cart is empty");
            return;
        }
        if (!businessUnitId) {
            toast.error("No business unit selected");
            return;
        }
        if (!selectedOutletId) {
            toast.error("No outlet selected");
            return;
        }

        if (!selectedCustomerId) {
            toast.error("Please select a customer");
            return;
        }

        const payment = parseFloat(paidAmount || totalAmount.toString());

        const payload: CreateOrderPayload = {
            items: cart.map(item => ({
                product: item.product._id,
                quantity: item.quantity,
                price: item.price,
                total: item.total
            })),
            businessUnit: businessUnitId,
            outlet: selectedOutletId, // Send Outlet ID
            subTotal: subTotal,
            totalAmount: totalAmount,
            paidAmount: payment,
            paymentMethod: paymentMethod as any,
            customer: selectedCustomerId
        };

        try {
            const res = await createOrder(payload).unwrap();
            if (res.success) {
                toast.success("Order created successfully");
                setOrderSuccess(res.data);
            }
        } catch (error: any) {
            console.error("POS Checkout Error:", error);
            const resData = error.data || error;
            let errorMessage = "Checkout failed";
            if (resData?.message) errorMessage = resData.message;
            toast.error(errorMessage);
        }
    };

    const handleNewSale = () => {
        setCart([]);
        setPaidAmount("");
        setSelectedCustomerId("");
        setOrderSuccess(null);
    }

    return (
        <div className="h-[calc(100vh-100px)] flex gap-4">
            {/* Hidden Receipt Template for Printing */}
            {orderSuccess && settingsData && (
                <ReceiptTemplate
                    data={orderSuccess}
                    settings={settingsData}
                />
            )}

            {/* Product Section */}
            <div className="flex-1 flex flex-col gap-4 min-w-0">
                {/* Filters */}
                <Card className="p-3 bg-muted/20 border-dashed">
                    <div className="flex items-center gap-2">
                        {isSuperAdmin && (
                            <Select
                                value={businessUnitId}
                                onValueChange={setSelectedBusinessUnitId}
                                disabled={!!contextBusinessUnitId}
                            >
                                <SelectTrigger className="w-[200px]">
                                    <SelectValue placeholder="Select Business Unit" />
                                </SelectTrigger>
                                <SelectContent>
                                    {businessUnits.map((bu: any) => (
                                        <SelectItem key={bu._id} value={bu._id}>{bu.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        )}

                        <Select value={selectedOutletId} onValueChange={setSelectedOutletId} disabled={!businessUnitId}>
                            <SelectTrigger className="w-[200px]">
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

                <div className="flex items-center gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            className="pl-9"
                            placeholder="Search products by name or SKU..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            disabled={!selectedOutletId}
                        />
                    </div>
                </div>

                {/* Product Grid */}
                <ScrollArea className="flex-1 pr-4">
                    {isLoadingProducts ? (
                        <div className="flex justify-center items-center h-40">Loading products...</div>
                    ) : (!selectedOutletId) ? (
                        <div className="flex flex-col items-center justify-center h-40 text-muted-foreground">
                            <p>Select an outlet to start.</p>
                        </div>
                    ) : products.length === 0 ? (
                        <div className="text-center py-20 text-muted-foreground">
                            No products found.
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 pb-4">
                            {products.map((product) => {
                                const stock = getStockForOutlet(product, selectedOutletId);
                                return (
                                    <Card
                                        key={product._id}
                                        className={`cursor-pointer transition-all hover:shadow-md group ${stock <= 0 ? 'opacity-60 grayscale' : 'hover:border-primary'}`}
                                        onClick={() => stock > 0 && addToCart(product)}
                                    >
                                        <CardContent className="p-3 flex flex-col gap-2">
                                            <div className="aspect-square bg-muted rounded-md relative overflow-hidden">
                                                {product.details?.images?.[0] ? (
                                                    <img
                                                        src={product.details.images[0]}
                                                        alt={product.name}
                                                        className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                                                    />
                                                ) : (
                                                    <div className="h-full w-full flex items-center justify-center text-muted-foreground text-xs">
                                                        No Image
                                                    </div>
                                                )}
                                            </div>

                                            <div className="space-y-1">
                                                <div className="font-medium text-sm truncate" title={product.name}>{product.name}</div>
                                                <div className="text-[10px] text-muted-foreground truncate">SKU: {product.sku || 'N/A'}</div>
                                                <div className="flex items-center justify-between text-sm">
                                                    <span className="font-bold text-primary">
                                                        {product.pricing.salePrice || product.pricing.basePrice}
                                                    </span>
                                                    <Badge variant={stock > 0 ? "secondary" : "destructive"} className="text-[10px] h-5 px-1">
                                                        {stock}
                                                    </Badge>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                )
                            })}
                        </div>
                    )}
                </ScrollArea>
            </div>

            {/* Cart Sidebar */}
            <div className="w-[400px] flex flex-col gap-4 min-w-0">
                <Card className="flex-1 flex flex-col shadow-lg border-l border-primary/10">
                    <CardHeader className="pb-3 border-b bg-muted/10">
                        <div className="flex items-center justify-between">
                            <CardTitle className="text-lg">Current Order</CardTitle>

                            {/* Customer Select on Top for POS */}
                            <div className="w-[200px]">
                                <Select value={selectedCustomerId} onValueChange={setSelectedCustomerId}>
                                    <SelectTrigger className="h-8 text-xs">
                                        <SelectValue placeholder="Select Customer" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {customers.map((c: any) => (
                                            <SelectItem key={c._id} value={c._id}>
                                                {c.name?.firstName} {c.name?.lastName}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </CardHeader>

                    <CardContent className="flex-1 overflow-hidden p-0 flex flex-col">
                        <ScrollArea className="flex-1 p-4">
                            {cart.length === 0 ? (
                                <div className="flex flex-col items-center justify-center h-full text-muted-foreground text-sm opacity-60">
                                    <ShoppingCart className="h-12 w-12 mb-2" />
                                    <p>Cart is empty</p>
                                    <p className="text-xs mt-1">Select outlet & Scan products to add</p>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {cart.map(item => (
                                        <div key={item.product._id} className="flex gap-3 bg-card p-2 rounded-lg border shadow-sm items-center">
                                            <div className="h-10 w-10 bg-muted rounded overflow-hidden flex-shrink-0">
                                                {item.product.details?.images?.[0] && (
                                                    <img src={item.product.details.images[0]} className="h-full w-full object-cover" />
                                                )}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="font-medium text-sm truncate">{item.product.name}</div>
                                                <div className="text-xs text-muted-foreground">{item.price} x {item.quantity}</div>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <Button size="icon" variant="outline" className="h-6 w-6" onClick={() => updateQuantity(item.product._id, -1)}><Minus className="h-3 w-3" /></Button>
                                                <span className="w-5 text-center text-sm font-medium">{item.quantity}</span>
                                                <Button size="icon" variant="outline" className="h-6 w-6" onClick={() => updateQuantity(item.product._id, 1)}><Plus className="h-3 w-3" /></Button>
                                            </div>
                                            <div className="font-bold text-sm w-16 text-right">
                                                {item.total.toFixed(0)}
                                            </div>
                                            <Button size="icon" variant="ghost" className="h-6 w-6 text-destructive opacity-50 hover:opacity-100" onClick={() => removeFromCart(item.product._id)}>
                                                <Trash2 className="h-3 w-3" />
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </ScrollArea>
                    </CardContent>

                    <div className="p-4 bg-muted/20 border-t space-y-4">
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Subtotal</span>
                                <span>{subTotal.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Tax (0%)</span>
                                <span>{tax.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between font-bold text-lg pt-2 border-t">
                                <span>Total</span>
                                <span>{totalAmount.toFixed(2)} BDT</span>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                            <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Payment" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="cash">Cash</SelectItem>
                                    <SelectItem value="card">Card</SelectItem>
                                    <SelectItem value="mobile_banking">Mobile Banking</SelectItem>
                                </SelectContent>
                            </Select>
                            <Input
                                placeholder="Amount Paid"
                                type="number"
                                value={paidAmount}
                                onChange={(e) => setPaidAmount(e.target.value)}
                            />
                        </div>

                        <Button className="w-full" size="lg" disabled={cart.length === 0 || isSubmitting} onClick={handleCheckout}>
                            <CreditCard className="mr-2 h-4 w-4" />
                            {isSubmitting ? "Processing..." : "Checkout"}
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
                            Order Completed
                        </DialogTitle>
                        <DialogDescription>
                            Ref: {orderSuccess?.orderId}
                        </DialogDescription>
                    </DialogHeader>
                    {/* ... (Reuse success content) */}
                    <div className="flex gap-2 justify-end">
                        <Button variant="outline" onClick={handlePrintReceipt} className="flex gap-2">
                            <Printer className="h-4 w-4" /> Print Receipt
                        </Button>
                        <Button onClick={handleNewSale}>New Sale</Button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}

