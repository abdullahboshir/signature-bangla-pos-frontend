
"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { ArrowUpDown, MoreHorizontal, Building2, ShieldCheck } from "lucide-react"

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export type CompanyColumn = {
    id: string
    name: string
    contactEmail: string
    registrationNumber: string
    isActive: boolean
    activeModules: {
        pos: boolean
        erp: boolean
        hrm: boolean
        ecommerce: boolean
        governance: boolean
    }
    createdAt: string
}

export const columns: ColumnDef<CompanyColumn>[] = [
    {
        accessorKey: "name",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Company Name
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
        cell: ({ row }) => (
            <div className="flex items-center gap-2">
                <div className="p-2 bg-primary/10 rounded-lg">
                    <Building2 className="h-4 w-4 text-primary" />
                </div>
                <div>
                    <p className="font-semibold">{row.original.name}</p>
                    <p className="text-xs text-muted-foreground">{row.original.registrationNumber}</p>
                </div>
            </div>
        )
    },
    {
        accessorKey: "contactEmail",
        header: "Contact",
    },
    {
        accessorKey: "activeModules",
        header: "Modules",
        cell: ({ row }) => {
            const modules = row.original.activeModules || {};
            const activeList = Object.entries(modules).filter(([_, v]) => v).map(([k]) => k.toUpperCase());

            return (
                <div className="flex flex-wrap gap-1 max-w-[200px]">
                    {activeList.includes('POS') && <Badge variant="outline" className="text-[10px]">POS</Badge>}
                    {activeList.includes('ERP') && <Badge variant="outline" className="text-[10px]">ERP</Badge>}
                    {activeList.includes('GOVERNANCE') && (
                        <Badge variant="secondary" className="text-[10px] bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 border-blue-200">
                            <ShieldCheck className="w-3 h-3 mr-1" /> GOV
                        </Badge>
                    )}
                    {activeList.length > 3 && <Badge variant="outline" className="text-[10px]">+{activeList.length - 3}</Badge>}
                </div>
            )
        }
    },
    {
        accessorKey: "isActive",
        header: "Status",
        cell: ({ row }) => (
            <Badge variant={row.original.isActive ? "default" : "destructive"}>
                {row.original.isActive ? "Active" : "Inactive"}
            </Badge>
        )
    },
    {
        id: "actions",
        cell: ({ row }) => {
            const payment = row.original

            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem
                            onClick={() => navigator.clipboard.writeText(payment.id)}
                        >
                            Copy ID
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>View details</DropdownMenuItem>
                        <DropdownMenuItem>Manage Subscription</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            )
        },
    },
]
