import { useEffect, useState } from "react";
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
import { OrderService } from "./OrderService";
import { CreateOrderPayload } from "./order.types";
import { axiosInstance } from "@/lib/axios/axiosInstance";
import { useCurrentBusinessUnit } from "@/hooks/useCurrentBusinessUnit";

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
    }; // simplified structure based on knowing backend
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
    const [products, setProducts] = useState<Product[]>([]);
    const [customers, setCustomers] = useState<any[]>([]); // Use proper type if available
    const [searchQuery, setSearchQuery] = useState("");
    const [cart, setCart] = useState<CartItem[]>([]);
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    // Order State
    const [selectedCustomerId, setSelectedCustomerId] = useState<string>("");
    const [paymentMethod, setPaymentMethod] = useState("cash");
    const [paidAmount, setPaidAmount] = useState<string>("");

    useEffect(() => {
        fetchProducts();
        fetchCustomers();
    }, []);

    const fetchProducts = async (query = "") => {
        try {
            setLoading(true);
            const res = await axiosInstance.get("/super-admin/products", { params: { search: query, limit: 20 } });
            if (res.data?.success) {
                // Handle both array directly or paginated results structure
                const data = res.data.data;
                if (Array.isArray(data)) {
                    setProducts(data);
                } else if (data?.results && Array.isArray(data.results)) {
                    setProducts(data.results);
                } else {
                    setProducts([]);
                }
            }
        } catch (error) {
            console.error(error);
            toast.error("Failed to load products");
        } finally {
            setLoading(false);
        }
    };

    const fetchCustomers = async () => {
        try {
            const res = await axiosInstance.get("/super-admin/users/all-users");
            // Standardized response parsing logic
            const resData = (res as any);
            let allUsers: any[] = [];

            if (resData.data?.success || resData.success) {
                if (Array.isArray(resData.data)) {
                    allUsers = resData.data;
                } else if (resData.data && Array.isArray(resData.data.data)) {
                    allUsers = resData.data.data;
                } else if (resData.data && typeof resData.data === 'object' && Array.isArray(resData.data.result)) {
                    allUsers = resData.data.result;
                } else if (resData.result && Array.isArray(resData.result)) {
                    allUsers = resData.result;
                } else if (resData.data && typeof resData.data === 'object') {
                    const possibleArray = Object.values(resData.data).find(val => Array.isArray(val));
                    if (possibleArray) {
                        allUsers = possibleArray as any[];
                    }
                }

                // Filter for customers
                const customersList = allUsers.filter((u: any) =>
                    // Check if roles array contains 'customer' string or object with name 'customer'
                    u.roles?.some((r: any) => {
                        const roleName = typeof r === 'string' ? r : r.name;
                        return roleName === 'customer';
                    })
                );

                setCustomers(customersList);
            }
        } catch (error) {
            console.error("Failed to load customers", error);
            // toast.error("Failed to load customers"); // Optional: don't block UI if customers fail
        }
    };

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
        const tax = 0; // standard tax logic can be added
        const totalAmount = subTotal + tax;
        return { subTotal, tax, totalAmount };
    };

    const { currentBusinessUnit } = useCurrentBusinessUnit();

    const [orderSuccess, setOrderSuccess] = useState<any>(null); // State for success modal

    // ... (existing helper functions)

    const handleCheckout = async () => {
        if (cart.length === 0) {
            toast.error("Cart is empty");
            return;
        }

        if (!selectedCustomerId) {
            toast.error("Please select a customer");
            return;
        }

        const totals = calculateTotals();
        const payment = parseFloat(paidAmount || "0");

        // Basic validation for business unit simulation
        const businessUnitId = currentBusinessUnit?._id || currentBusinessUnit?.id;

        if (!businessUnitId) {
            toast.error("No business unit selected");
            return;
        }

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
            customer: selectedCustomerId
        };

        try {
            setSubmitting(true);
            const res = await OrderService.createOrder(payload);
            if (res.success) {
                toast.success("Order created successfully");
                setOrderSuccess(res.data); // Open Success Modal with order data
            }
        } catch (error: any) {
            console.error("Checkout Error Full Object:", error);
            const resData = error.response?.data;
            console.log("Error Response Data:", resData);

            let errorMessage = "Checkout failed";

            if (resData) {
                // Priority 1: errorSources (structured errors from Zod, Mongoose, AppError)
                if (resData.errorSources && Array.isArray(resData.errorSources) && resData.errorSources.length > 0) {
                    // Join multiple error messages if needed, or just take the first one
                    errorMessage = resData.errorSources.map((e: any) => e.message).join('. ');
                }
                // Priority 2: message (if it's not the generic "Something went wrong")
                else if (resData.message && resData.message !== "Something went wrong!" && resData.message !== "Validation Error") {
                    errorMessage = resData.message;
                }
                // Priority 3: Fallback to any other error properties
                else if (typeof resData.error === 'string') {
                    errorMessage = resData.error;
                }
                else if (typeof resData.error === 'object' && resData.error?.message) {
                    errorMessage = resData.error.message;
                }
                // Priority 4: Final fallback to "message" even if generic, if nothing else exists
                else if (resData.message) {
                    errorMessage = resData.message;
                }
            } else if (error.message) {
                errorMessage = error.message;
            }

            toast.error(errorMessage);
        } finally {
            setSubmitting(false);
        }
    };

    const handleNewSale = () => {
        setCart([]);
        setPaidAmount("");
        setSelectedCustomerId("");
        setOrderSuccess(null);
        toast.info("Ready for new sale");
    }

    const { subTotal, totalAmount } = calculateTotals();

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-[calc(100vh-100px)]">
            {/* ... (existing Product Section) */}
            <div className="md:col-span-2 flex flex-col gap-4">
                <Card className="flex-1 flex flex-col overflow-hidden">
                    <CardHeader className="py-4">
                        <div className="relative">
                            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search products..."
                                className="pl-8"
                                value={searchQuery}
                                onChange={(e) => {
                                    setSearchQuery(e.target.value);
                                    fetchProducts(e.target.value);
                                }}
                            />
                        </div>
                    </CardHeader>
                    <CardContent className="flex-1 overflow-auto p-4">
                        {loading && products.length === 0 ? (
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
                                        {products.map((product) => (
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
                                        ))}
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
                    {/* ... (existing Cart Header & ScrollArea) */}
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
                        {/* ... (existing Total & Inputs) */}
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
                                        {customers.map((c) => (
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
                                        <SelectItem value="cash">Cash</SelectItem>
                                        <SelectItem value="card">Card</SelectItem>
                                        <SelectItem value="mobile_banking">Mobile Banking</SelectItem>
                                        <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                                        <SelectItem value="credit">Credit</SelectItem>
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

                        <Button className="w-full" size="lg" disabled={cart.length === 0 || submitting} onClick={handleCheckout}>
                            {submitting ? "Processing..." : `Complete Order (${totalAmount} BDT)`}
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
                        <Button variant="outline" className="flex-1" onClick={() => router.push('../')}>
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
