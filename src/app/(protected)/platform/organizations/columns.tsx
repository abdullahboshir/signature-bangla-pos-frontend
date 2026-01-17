
"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { ArrowUpDown, MoreHorizontal, Building2, ShieldCheck } from "lucide-react"
import { cn } from "@/lib/utils"

import { CellAction } from "./CellAction"


export type OrganizationColumn = {
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
    legalRepresentative?: {
        name: string
        email: string
        contactPhone: string
        designation: string
    }
    contact: {
        email: string
        phone: string
        website?: string
    }
    location: {
        city: string
        country: string
        address: string
    }
    businessType: string
    createdAt: string

    // Additional Details
    numberOfEmployees?: number
    establishedDate?: string
    capital?: {
        authorizedCapital: number
        paidUpCapital: number
        currency: string
    }
    shareholders?: {
        name: string
        sharePercentage: number
    }[]
    directors?: {
        name: string
        designation: string
        isManagingDirector: boolean
    }[]
    subscription?: {
        planName: string
        status: 'active' | 'expired' | 'revoked' | 'inactive'
        expiresAt: string
        key?: string
    }
}

export const columns: ColumnDef<OrganizationColumn>[] = [
    {
        accessorKey: "name",
        header: "Organization",
        cell: ({ row }) => (
            <div className="flex items-center gap-3">
                <div className="p-2.5 bg-primary/10 rounded-xl">
                    <Building2 className="h-5 w-5 text-primary" />
                </div>
                <div>
                    <p className="font-medium text-sm text-foreground">{row.original.name}</p>
                    <p className="text-xs text-muted-foreground capitalize">{row.original.businessType?.replace(/_/g, " ")}</p>
                </div>
            </div>
        )
    },
    {
        accessorKey: "legalRepresentative.name", // Accessing nested property for sorting might require custom accessorFn
        header: "Owner / Rep",
        cell: ({ row }) => {
            const rep = row.original.legalRepresentative;
            if (!rep) return <span className="text-muted-foreground text-xs">-</span>;

            return (
                <div className="flex flex-col">
                    <span className="text-sm font-medium">{rep.name}</span>
                    <span className="text-xs text-muted-foreground">{rep.email}</span>
                </div>
            );
        }
    },
    {
        accessorKey: "contact.phone",
        header: "Contact",
        cell: ({ row }) => (
            <div className="flex flex-col gap-1">
                <span className="text-xs">{row.original.contact?.phone || row.original.legalRepresentative?.contactPhone}</span>
                {row.original.location?.city && (
                    <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                        {row.original.location.city}, {row.original.location.country}
                    </span>
                )}
            </div>
        )
    },
    {
        accessorKey: "activeModules",
        header: "Modules",
        cell: ({ row }) => {
            const modules = row.original.activeModules || {};
            const activeList = Object.entries(modules).filter(([_, v]) => v).map(([k]) => k.toUpperCase());

            return (
                <div className="flex flex-wrap gap-1 max-w-[180px]">
                    {activeList.includes('POS') && <Badge variant="outline" className="text-[10px] px-1 py-0 h-5">POS</Badge>}
                    {activeList.includes('ERP') && <Badge variant="outline" className="text-[10px] px-1 py-0 h-5">ERP</Badge>}
                    {activeList.includes('GOVERNANCE') && (
                        <Badge variant="secondary" className="text-[10px] px-1 py-0 h-5 bg-blue-50 text-blue-700 border-blue-100">
                            GOV
                        </Badge>
                    )}
                    {activeList.length > 3 && <Badge variant="outline" className="text-[10px] px-1 py-0 h-5">+{activeList.length - 3}</Badge>}
                </div>
            )
        }
    },
    {
        accessorKey: "subscription.planName",
        header: "Plan",
        cell: ({ row }) => {
            const sub = row.original.subscription;
            if (!sub || sub.status === 'inactive') return <Badge variant="outline" className="text-[10px] text-muted-foreground border-dashed">No Plan</Badge>;

            const isExpired = sub.status === 'expired' || (sub.expiresAt && new Date(sub.expiresAt) < new Date());

            return (
                <div className="flex flex-col gap-1">
                    <span className="font-medium text-xs">{sub.planName}</span>
                    <Badge variant={isExpired ? "destructive" : "secondary"} className={cn("w-fit text-[10px] px-1 h-5", isExpired ? "" : "bg-indigo-50 text-indigo-700 border-indigo-100")}>
                        {isExpired ? "Expired" : "Active"}
                    </Badge>
                </div>
            )
        }
    },
    {
        accessorKey: "isActive",
        header: "Status",
        cell: ({ row }) => (
            <Badge variant={row.original.isActive ? "default" : "secondary"} className={row.original.isActive ? "bg-emerald-600 hover:bg-emerald-700" : "bg-gray-200 text-gray-600 hover:bg-gray-300"}>
                {row.original.isActive ? "Active" : "Inactive"}
            </Badge>
        )
    },
    {
        accessorKey: "createdAt",
        header: "Joined",
        cell: ({ row }) => (
            <span className="text-xs text-muted-foreground whitespace-nowrap">
                {new Date(row.original.createdAt).toLocaleDateString()}
            </span>
        )
    },
    {
        id: "actions",
        cell: ({ row }) => <CellAction data={row.original} />
    },
]
