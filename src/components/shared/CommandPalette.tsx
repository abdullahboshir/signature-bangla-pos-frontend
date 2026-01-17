"use client"

import { useState, useEffect, useMemo } from "react"
import { useRouter, useParams, usePathname } from "next/navigation"
import {
    Dialog,
    DialogContent,
    DialogTitle,
} from "@/components/ui/dialog"
import { VisuallyHidden } from "@radix-ui/react-visually-hidden"
import { Input } from "@/components/ui/input"
import {
    Search,
    Package,
    ShoppingCart,
    Users,
    FileText,
    ArrowRight,
    Hash,
    Shield
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useGetProductsQuery } from "@/redux/api/catalog/productApi"
import { useCurrentRole } from "@/hooks/useCurrentRole";
import { USER_ROLES, isSuperAdmin } from "@/config/auth-constants"

interface CommandPaletteProps {
    open: boolean
    onOpenChange: (open: boolean) => void
}

export function CommandPalette({ open, onOpenChange }: CommandPaletteProps) {
    const router = useRouter()
    const params = useParams()
    const pathname = usePathname()
    const [search, setSearch] = useState("")
    const [selectedIndex, setSelectedIndex] = useState(0)
    const { currentRole } = useCurrentRole();

    // Extract role and businessUnit from params OR pathname
    let businessUnit = params["business-unit"] as string
    let role = currentRole as string

    // Fallback: Extract from pathname if params are undefined
    if (!role || !businessUnit) {
        const pathParts = pathname.split('/')
        if (pathParts.length >= 3) {
            role = role || pathParts[1]
            businessUnit = businessUnit || pathParts[2]
        }
    }

    // Fetch products for search
    const { data: productsData } = useGetProductsQuery(
        { limit: 50, search },
        { skip: !search || search.length < 2 }
    )

    const products = productsData?.data || []

    // Quick Navigation Routes
    const quickRoutes = useMemo(() => {
        const routes: any[] = []

        // Check if we're in super-admin context (no business unit)
        const isSuperAdminContext = isSuperAdmin(role) && !businessUnit

        if (isSuperAdminContext) {
            // Super Admin Routes - Global Access
            routes.push(
                { title: "Super Admin Dashboard", icon: Hash, path: `/platform`, description: "Main dashboard" },
                { title: "All Business Units", icon: Package, path: `/platform/business-units`, description: "Manage all business units" },
                { title: "All Outlets", icon: Package, path: `/platform/outlets`, description: "View all outlets across units" },
                { title: "All Products", icon: Package, path: `/platform/products`, description: "Global product catalog" },
                { title: "User Management", icon: Users, path: `/platform/user-management`, description: "Manage system users" },
                { title: "Roles & Permissions", icon: Shield, path: `/platform/user-management/roles-permissions`, description: "Configure access control" }
            )
        } else if (businessUnit) {
            // Business Unit Scoped Routes
            routes.push(
                { title: "Dashboard", icon: Hash, path: `/${businessUnit}/overview`, description: "Go to main dashboard" },
                { title: "All Products", icon: Package, path: `/${businessUnit}/catalog/product`, description: "Manage products" },
                { title: "Create Product", icon: Package, path: `/${businessUnit}/catalog/product/new`, description: "Add new product" },
                { title: "Orders", icon: ShoppingCart, path: `/${businessUnit}/sales`, description: "View all orders" },
                { title: "Customers", icon: Users, path: `/${businessUnit}/customers`, description: "Manage customers" },
                { title: "Sales", icon: FileText, path: `/${businessUnit}/sales`, description: "View sales reports" }
            )
        } else {
            // Fallback: Show general navigation
            routes.push({ title: "Dashboard", icon: Hash, path: pathname || '/', description: "Current page" })
        }

        return [{
            category: isSuperAdminContext ? "Global Navigation" : "Quick Access",
            items: routes
        }]
    }, [role, businessUnit, pathname])

    // Handle search input
    const handleSearchChange = (value: string) => setSearch(value)

    // Combine all search results
    const searchResults = useMemo(() => {
        const results: any[] = []

        // Add routes if search matches
        if (search) {
            const matchingRoutes = quickRoutes[0].items.filter((route: any) =>
                route.title.toLowerCase().includes(search.toLowerCase()) ||
                route.description.toLowerCase().includes(search.toLowerCase())
            )
            if (matchingRoutes.length > 0) results.push({ category: "Pages", items: matchingRoutes })
        } else {
            if (quickRoutes[0].items.length > 0) results.push(quickRoutes[0])
        }

        // Add products
        if (products.length > 0) {
            results.push({
                category: "Products",
                items: products.slice(0, 5).map((product: any) => ({
                    title: product.name,
                    icon: Package,
                    path: `/${businessUnit}/catalog/product/${product._id}`,
                    description: `SKU: ${product.sku || 'N/A'} • Stock: ${product.stock || 0}`,
                    image: product.media?.[0]?.url
                }))
            })
        }

        return results
    }, [search, products, quickRoutes, role, businessUnit])

    // Flatten results for keyboard navigation
    const flatResults = useMemo(() => searchResults.flatMap(group => group.items), [searchResults])

    // Handle keyboard navigation
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (!open) return
            if (e.key === "ArrowDown") {
                e.preventDefault()
                setSelectedIndex(prev => (prev + 1) % flatResults.length)
            } else if (e.key === "ArrowUp") {
                e.preventDefault()
                setSelectedIndex(prev => (prev - 1 + flatResults.length) % flatResults.length)
            } else if (e.key === "Enter") {
                e.preventDefault()
                const selected = flatResults[selectedIndex]
                if (selected?.path) {
                    router.push(selected.path)
                    onOpenChange(false)
                    setSearch("")
                }
            }
        }
        window.addEventListener("keydown", handleKeyDown)
        return () => window.removeEventListener("keydown", handleKeyDown)
    }, [open, selectedIndex, flatResults, router, onOpenChange])

    // Reset on close
    useEffect(() => {
        if (!open) {
            setSearch("")
            setSelectedIndex(0)
        }
    }, [open])

    const handleClick = (path: string) => {
        router.push(path)
        onOpenChange(false)
        setSearch("")
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl p-0 gap-0 overflow-hidden" showCloseButton={false}>
                <VisuallyHidden><DialogTitle>Search</DialogTitle></VisuallyHidden>
                <div className="flex items-center border-b px-4 py-3">
                    <Search className="h-5 w-5 text-muted-foreground shrink-0" />
                    <Input
                        placeholder="Search products, SKU, barcode, pages..."
                        value={search}
                        onChange={(e) => handleSearchChange(e.target.value)}
                        className="flex-1 mx-3 border-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-base"
                        autoFocus
                    />
                    <kbd className="hidden sm:inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground shrink-0">ESC</kbd>
                </div>

                <div className="max-h-[400px] overflow-y-auto p-2">
                    {searchResults.length === 0 ? (
                        <div className="py-12 text-center text-sm text-muted-foreground">No results found</div>
                    ) : (
                        searchResults.map((group, groupIndex) => (
                            <div key={groupIndex} className="mb-4 last:mb-0">
                                <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">{group.category}</div>
                                {group.items.map((item: any, itemIndex: number) => {
                                    const flatIndex = searchResults.slice(0, groupIndex).reduce((acc, g) => acc + g.items.length, 0) + itemIndex
                                    return (
                                        <button
                                            key={itemIndex}
                                            onClick={() => handleClick(item.path)}
                                            className={cn("w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm transition-colors", "hover:bg-accent", flatIndex === selectedIndex && "bg-accent")}
                                        >
                                            {item.image ? (
                                                <img src={item.image} alt={item.title} className="h-10 w-10 object-cover rounded border" />
                                            ) : (
                                                <div className="h-10 w-10 flex items-center justify-center rounded bg-muted"><item.icon className="h-5 w-5 text-muted-foreground" /></div>
                                            )}
                                            <div className="flex-1 text-left overflow-hidden">
                                                <div className="font-medium truncate">{item.title}</div>
                                                {item.description && <div className="text-xs text-muted-foreground truncate">{item.description}</div>}
                                            </div>
                                            <ArrowRight className="h-4 w-4 text-muted-foreground shrink-0" />
                                        </button>
                                    )
                                })}
                            </div>
                        ))
                    )}
                </div>

                <div className="border-t px-4 py-2 flex items-center justify-between text-xs text-muted-foreground">
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1"><kbd className="px-1.5 py-0.5 bg-muted rounded text-[10px]">↑↓</kbd><span>Navigate</span></div>
                        <div className="flex items-center gap-1"><kbd className="px-1.5 py-0.5 bg-muted rounded text-[10px]">Enter</kbd><span>Select</span></div>
                    </div>
                    <div className="text-[10px]">Press <kbd className="px-1 bg-muted rounded">Ctrl+K</kbd> to open</div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
