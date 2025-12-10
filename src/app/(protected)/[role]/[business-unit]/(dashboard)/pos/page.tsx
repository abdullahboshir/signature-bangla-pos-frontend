"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, ShoppingCart, User, CreditCard } from "lucide-react"
import { Badge } from "@/components/ui/badge"

const MOCK_PRODUCTS = [
    { id: 1, name: "Premium T-Shirt", price: 25.00, stock: 50 },
    { id: 2, name: "Denim Jeans", price: 45.00, stock: 30 },
    { id: 3, name: "Sneakers", price: 80.00, stock: 15 },
    { id: 4, name: "Cap", price: 15.00, stock: 100 },
    { id: 5, name: "Socks (Pack)", price: 10.00, stock: 200 },
]

export default function PosPage() {
    return (
        <div className="h-[calc(100vh-theme(spacing.20))] flex gap-4 p-4">
            {/* Product Selection Area */}
            <div className="flex-1 flex flex-col gap-4">
                <div className="flex items-center gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input className="pl-9" placeholder="Search products..." />
                    </div>
                    <Button variant="outline">Scan Barcode</Button>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 overflow-y-auto pr-2">
                    {MOCK_PRODUCTS.map((product) => (
                        <Card key={product.id} className="cursor-pointer hover:border-primary transition-colors">
                            <CardContent className="p-4 flex flex-col gap-2">
                                <div className="aspect-square bg-muted rounded-md flex items-center justify-center text-muted-foreground">
                                    IMG
                                </div>
                                <div className="font-medium text-sm truncate">{product.name}</div>
                                <div className="flex items-center justify-between text-sm">
                                    <span className="font-bold">${product.price.toFixed(2)}</span>
                                    <Badge variant="secondary" className="text-xs">{product.stock}</Badge>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>

            {/* Cart / Checkout Area */}
            <div className="w-[400px] flex flex-col gap-4">
                <Card className="flex-1 flex flex-col">
                    <CardHeader className="pb-3 border-b">
                        <div className="flex items-center justify-between">
                            <CardTitle>Current Order</CardTitle>
                            <Button variant="ghost" size="icon"><User className="h-4 w-4" /></Button>
                        </div>
                    </CardHeader>
                    <CardContent className="flex-1 overflow-y-auto p-0">
                        <div className="flex flex-col items-center justify-center h-full text-muted-foreground text-sm">
                            <ShoppingCart className="h-10 w-10 mb-2 opacity-50" />
                            No items in cart
                        </div>
                    </CardContent>
                    <div className="p-4 bg-muted/20 border-t space-y-4">
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span>Subtotal</span>
                                <span>$0.00</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Tax</span>
                                <span>$0.00</span>
                            </div>
                            <div className="flex justify-between font-bold text-lg">
                                <span>Total</span>
                                <span>$0.00</span>
                            </div>
                        </div>
                        <Button className="w-full" size="lg">
                            <CreditCard className="mr-2 h-4 w-4" />
                            Checkout
                        </Button>
                    </div>
                </Card>
            </div>
        </div>
    )
}
