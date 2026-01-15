"use client";

import { useGetBusinessUnitsQuery } from "@/redux/api/organization/businessUnitApi";
import { DataTable } from "@/components/shared/DataTable";
import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Edit, Trash, Store, Eye, MapPin, Building2, Plus, UserPlus } from "lucide-react";
import { useParams, useRouter, useSearchParams, usePathname } from "next/navigation";
import { useCurrentRole } from "@/hooks/useCurrentRole";
import { DataPageLayout } from "@/components/shared/DataPageLayout";

export default function BusinessUnitList() {
    const searchParams = useSearchParams();
    const companyIdFromUrl = searchParams.get("company-admin") || searchParams.get("company");
    const { data: rawUnits, isLoading } = useGetBusinessUnitsQuery(companyIdFromUrl ? { company: companyIdFromUrl } : {}) as any;
    const router = useRouter();
    const pathname = usePathname();
    const params = useParams();
    const { currentRole } = useCurrentRole();
    const role = currentRole as string;

  
    const businessUnits = Array.isArray(rawUnits) ? rawUnits : (rawUnits?.data || rawUnits?.result || []);

    const filteredUnits = Array.isArray(businessUnits) ? businessUnits.filter((unit: any) => {
        if (!companyIdFromUrl) return true;
        const buCompanyId = unit.company?._id || unit.company?.id || unit.company;
        return buCompanyId === companyIdFromUrl;
    }) : [];

    const columns: ColumnDef<any>[] = [
        {
            accessorKey: "name",
            header: "Name & Identity",
            cell: ({ row }) => (
                <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                        <Store className="h-4 w-4 text-primary" />
                        <span className="font-semibold">{row.original.name}</span>
                    </div>
                    <span className="text-xs text-muted-foreground ml-6">{row.original.slug}</span>
                </div>
            )
        },
        {
            accessorKey: "company",
            header: "Company",
            cell: ({ row }) => (
                <div className="flex items-center gap-2">
                    <Building2 className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium text-sm">
                        {row.original.company?.name || <span className="text-red-500 italic">Unlinked</span>}
                    </span>
                </div>
            )
        },
        {
            accessorKey: "operationalModel",
            header: "Model & Industry",
            cell: ({ row }) => (
                <div className="flex flex-col gap-1">
                    <Badge variant="outline" className="w-fit">{row.original.operationalModel || "Retail"}</Badge>
                    <span className="text-xs text-muted-foreground capitalize">{row.original.industry || "General"}</span>
                </div>
            )
        },
        {
            accessorKey: "contact",
            header: "Contact",
            cell: ({ row }) => (
                <div className="flex flex-col text-sm">
                    <span>{row.original.contact?.email}</span>
                    <span className="text-xs text-muted-foreground">{row.original.contact?.phone}</span>
                </div>
            )
        },
        {
            accessorKey: "location",
            header: "Location",
            cell: ({ row }) => (
                <div className="text-sm">
                    {row.original.location?.city ? `${row.original.location.city}, ${row.original.location.country}` : "Global"}
                </div>
            )
        },
        {
            accessorKey: "outlets",
            header: "Outlets",
            cell: ({ row }) => (
                <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="font-normal">
                        {row.original.outlets?.length || 0} Outlets
                    </Badge>
                </div>
            )
        },
        {
            accessorKey: "status",
            header: "Status",
            cell: ({ row }) => {
                const status = row.original.status || "draft";
                const colors: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
                    published: "default",
                    draft: "secondary",
                    suspended: "destructive",
                    archived: "outline"
                };
                return <Badge variant={colors[status]}>{status}</Badge>
            }
        },
        {
            id: "actions",
            cell: ({ row }) => {
                const unit = row.original;
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
                            <DropdownMenuItem onClick={() => {
                                const identifier = unit.slug || unit.id || unit._id;
                                const url = `/${identifier}/overview`;
                                router.push(companyIdFromUrl ? `${url}?company=${companyIdFromUrl}` : url);
                            }}>
                                <Eye className="mr-2 h-4 w-4" /> View Dashboard
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => {
                                const targetCompanyId = companyIdFromUrl || (typeof unit.company === 'object' ? unit.company?._id || unit.company?.id : unit.company);
                                const identifier = unit.slug || unit.id || unit._id;
                                const globalUrl = `/global/business-units/${identifier}/edit`;
                                const companyAdminUrl = `/company-admin/business-units/${identifier}/edit`;
                                
                                // Check if we are in a company admin context (either by URL param or role)
                                if (role === 'company-owner' || role === 'company-admin' || pathname?.includes('/company-admin')) {
                                     const targetUrl = companyIdFromUrl ? `${companyAdminUrl}?company=${companyIdFromUrl}` : companyAdminUrl;
                                     router.push(targetUrl);
                                } else {
                                    router.push(globalUrl);
                                }
                            }}>
                                <Edit className="mr-2 h-4 w-4" /> Edit Details
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => {
                                const identifier = unit.slug || unit.id || unit._id;
                                router.push(`/global/user-management/business-users/add?business-unit=${identifier}`);
                            }}>
                                <Plus className="mr-2 h-4 w-4" /> Add Staff
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => {
                                const identifier = unit.slug || unit.id || unit._id;
                                router.push(`/global/business-units/${identifier}/outlets/new`);
                            }}>
                                <Store className="mr-2 h-4 w-4" /> Add Outlet
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-red-500">
                                <Trash className="mr-2 h-4 w-4" /> Delete Unit
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                )
            }
        }
    ];

    return (
        <DataPageLayout
            title="Business Units"
            description="Manage your business units and subsidiaries."
            createAction={{
                label: "Add Business Unit",
                onClick: () => {
                    const queryString = searchParams.toString();
                    router.push(`/global/business-units/new${queryString ? `?${queryString}` : ''}`);
                }
            }}
        >
            <DataTable
                columns={columns}
                data={filteredUnits}
                isLoading={isLoading}
                renderSubComponent={({ original }: { original: any }) => (
                    <div className="p-4 bg-muted/30 rounded-md">
                        <h4 className="font-semibold mb-3 flex items-center gap-2">
                            <Store className="h-4 w-4" />
                            Outlets ({original.outlets?.length || 0})
                        </h4>
                        {original.outlets && original.outlets.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {original.outlets.map((outlet: any) => (
                                    <div key={outlet._id} className="bg-background p-3 rounded border text-sm">
                                        <div className="font-medium flex items-center gap-2">
                                            <MapPin className="h-3 w-3 text-muted-foreground" />
                                            {outlet.name}
                                            <Badge variant="outline" className="ml-auto text-[10px] h-5">{outlet.code}</Badge>
                                        </div>
                                        <div className="text-muted-foreground text-xs mt-1 pl-5">
                                            <div>{outlet.city}, {outlet.address}</div>
                                            <div className="mt-0.5">{outlet.phone}</div>
                                        </div>
                                        <div className="flex items-center justify-between mt-2 pt-2 border-t">
                                            <div className="text-muted-foreground text-[10px] uppercase tracking-wider font-semibold">Quick Actions</div>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="h-7 w-7 p-0 text-primary hover:text-primary hover:bg-primary/10"
                                                title="Add Staff to this Outlet"
                                                onClick={() => {
                                                    const identifier = original.slug || original.id || original._id;
                                                    router.push(`/global/user-management/business-users/add?business-unit=${identifier}&outlet=${outlet._id}`);
                                                }}
                                            >
                                                <UserPlus className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-muted-foreground text-sm italic">No outlets found for this business unit.</div>
                        )}
                    </div>
                )}
            />
        </DataPageLayout >
    );
}

