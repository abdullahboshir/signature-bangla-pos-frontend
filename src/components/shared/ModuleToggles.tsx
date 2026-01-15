"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Package, ShoppingCart, Users, Globe, TrendingUp, Truck, DollarSign, Megaphone, Plug, Shield, CreditCard } from "lucide-react"

interface ModuleTogglesData {
    pos?: boolean
    erp?: boolean
    hrm?: boolean
    ecommerce?: boolean
    crm?: boolean
    logistics?: boolean
    finance?: boolean
    marketing?: boolean
    integrations?: boolean
    governance?: boolean
    saas?: boolean
}

interface ModuleTogglesProps {
    value: ModuleTogglesData
    onChange: (modules: ModuleTogglesData) => void
    disabledModules?: string[]
    compact?: boolean
}

const MODULES = [
    { key: "pos", label: "POS (Point of Sale)", icon: ShoppingCart, description: "Point of sale systems and retail operations", color: "text-blue-500" },
    { key: "erp", label: "ERP Core & Master Data", icon: Package, description: "Shared business entities, workflows & master data framework", color: "text-purple-500" },
    { key: "hrm", label: "HRM (Human Resource Management)", icon: Users, description: "Employee management and payroll systems", color: "text-green-500" },
    { key: "ecommerce", label: "E-Commerce", icon: Globe, description: "Online store and digital marketplace", color: "text-orange-500" },
    { key: "crm", label: "CRM (Customer Relationship)", icon: TrendingUp, description: "Customer data and relationship management", color: "text-pink-500" },
    { key: "logistics", label: "Logistics & Supply Chain", icon: Truck, description: "Inventory, shipping, and warehouse management", color: "text-yellow-600" },
    { key: "finance", label: "Finance & Accounting", icon: DollarSign, description: "Financial reporting and accounting tools", color: "text-emerald-500" },
    { key: "marketing", label: "Marketing Automation", icon: Megaphone, description: "Campaigns, analytics, and customer engagement", color: "text-red-500" },
    { key: "integrations", label: "Third-Party Integrations", icon: Plug, description: "API connections and external service integrations", color: "text-indigo-500" },
    { key: "governance", label: "Governance & Elite Policy", icon: Shield, description: "Board-level management, shareholder voting & enterprise compliance", color: "text-gray-600" },
    { key: "saas", label: "SaaS Ecosystem", icon: CreditCard, description: "Multi-tenant subscription management, licensing & billing orchestration", color: "text-cyan-500" },
]

export function ModuleToggles({ value, onChange, disabledModules = [], hiddenModules = [], compact = false }: ModuleTogglesProps & { hiddenModules?: string[] }) {
    const handleToggle = (key: string, checked: boolean) => {
        onChange({ ...value, [key]: checked })
    }

    const enabledCount = Object.values(value).filter(Boolean).length

    // Filter modules based on visibility
    const visibleModules = MODULES.filter(m => !hiddenModules.includes(m.key));

    if (compact) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                        <span className="flex items-center gap-2">
                            <Package className="h-5 w-5 text-blue-500" />
                            Active Modules
                        </span>
                        <span className="text-sm font-normal text-muted-foreground">
                            {enabledCount}/{MODULES.length} enabled
                        </span>
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {visibleModules.map((module) => {
                            const Icon = module.icon
                            const isDisabled = disabledModules.includes(module.key)
                            return (
                                <div
                                    key={module.key}
                                    className="flex items-center justify-between p-3 border rounded-lg bg-background"
                                >
                                    <div className="flex items-center gap-2">
                                        <Icon className={`h-4 w-4 ${module.color}`} />
                                        <Label
                                            htmlFor={`module-${module.key}`}
                                            className={`text-sm cursor-pointer ${isDisabled ? 'opacity-50' : ''}`}
                                        >
                                            {module.label.split(' ')[0]}
                                        </Label>
                                    </div>
                                    <Switch
                                        id={`module-${module.key}`}
                                        checked={value[module.key as keyof ModuleTogglesData] || false}
                                        onCheckedChange={(checked) => handleToggle(module.key, checked)}
                                        disabled={isDisabled}
                                    />
                                </div>
                            )
                        })}
                    </div>
                </CardContent>
            </Card>
        )
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center justify-between">
                    <span className="flex items-center gap-2">
                        <Package className="h-5 w-5 text-blue-500" />
                        Module Selection
                    </span>
                    <span className="text-sm font-normal text-muted-foreground">
                        {enabledCount}/{MODULES.length} enabled
                    </span>
                </CardTitle>
                <CardDescription>
                    Enable or disable specific modules for this entity. Enabled modules will be accessible to users.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
                {visibleModules.map((module) => {
                    const Icon = module.icon
                    const isErp = module.key === 'erp'
                    const isDisabled = disabledModules.includes(module.key) || isErp

                    return (
                                <div
                                    key={module.key}
                                    className={`flex items-center justify-between p-4 border rounded-lg bg-background transition-all ${value[module.key as keyof ModuleTogglesData] || isErp ? 'border-primary bg-primary/5' : ''
                                        } ${isDisabled ? 'opacity-50' : ''}`}
                                >
                                    <div className="flex items-start gap-3 flex-1">
                                        <Icon className={`h-5 w-5 mt-0.5 ${module.color}`} />
                                        <div className="flex-1">
                                            <Label
                                                htmlFor={`module-${module.key}`}
                                                className="font-semibold cursor-pointer"
                                            >
                                                {module.label}
                                                {isErp && (
                                                    <span className="ml-2 text-[10px] bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded border border-blue-200 uppercase font-bold tracking-wide">
                                                        Core
                                                    </span>
                                                )}
                                            </Label>
                                            <p className="text-sm text-muted-foreground mt-0.5">
                                                {module.description}
                                            </p>
                                            {isDisabled && !isErp && (
                                                <p className="text-xs text-orange-600 mt-1">
                                                    ⚠️ Disabled by parent settings
                                                </p>
                                            )}
                                            {isErp && (
                                                <p className="text-xs text-blue-600 mt-1 font-medium">
                                                    included by default
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                    <Switch
                                        id={`module-${module.key}`}
                                        checked={isErp ? true : (value[module.key as keyof ModuleTogglesData] || false)}
                                        onCheckedChange={(checked) => handleToggle(module.key, checked)}
                                        disabled={isDisabled}
                                    />
                                </div>
                            )
                })}
            </CardContent>
        </Card>
    )
}
