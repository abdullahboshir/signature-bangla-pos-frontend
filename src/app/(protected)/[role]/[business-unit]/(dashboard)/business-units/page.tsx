"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Plus, MoreHorizontal, Building2, MapPin, Phone, User as UserIcon, Loader2, Trash2, Edit, Eye, RefreshCw, Search, CheckCircle, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { axiosInstance } from "@/lib/axios/axiosInstance";
import Swal from "sweetalert2";
import { DataTable } from "@/components/shared/DataTable";
import { DataPageLayout } from "@/components/shared/DataPageLayout";
import { ColumnDef } from "@tanstack/react-table";
import { StatCard } from "@/components/shared/StatCard";
import { TabsContent } from "@/components/ui/tabs";

interface BusinessUnit {
    _id: string;
    id: string;
    branding: {
        name: string;
    };
    contact: {
        email: string;
        phone: string;
    };
    location: {
        city: string;
        country: string;
    };
    status: string;
    statistics: {
        totalRevenue: number;
    };
    category?: string;
}

export default function BusinessUnitsPage() {
    const router = useRouter();
    const pathname = usePathname();
    const [searchTerm, setSearchTerm] = useState("");
    const [businessUnits, setBusinessUnits] = useState<BusinessUnit[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("all");

    const fetchBusinessUnits = async () => {
        try {
            setIsLoading(true);
            const response: any = await axiosInstance.get('/super-admin/business-unit');
            console.log("Business Units API Response:", response);

            if (response?.success && Array.isArray(response?.data)) {
                setBusinessUnits(response.data);
            } else if (Array.isArray(response)) {
                setBusinessUnits(response);
            } else if (response?.data?.data && Array.isArray(response.data.data)) {
                setBusinessUnits(response.data.data);
            } else {
                setBusinessUnits([]);
            }
        } catch (error) {
            console.error("Failed to fetch business units", error);
            Swal.fire({
                icon: "error",
                title: "Connection Error",
                text: "Could not retrieve business units.",
                toast: true,
                position: "top-end",
                showConfirmButton: false,
                timer: 3000,
            });
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchBusinessUnits();
    }, []);

    const handleDelete = async (id: string) => {
        const result = await Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!"
        });

        if (result.isConfirmed) {
            try {
                const res: any = await axiosInstance.delete(`/super-admin/business-unit/${id}`);
                if (res?.success) {
                    Swal.fire({
                        title: "Deleted!",
                        text: "Business unit has been deleted.",
                        icon: "success",
                        timer: 2000,
                        showConfirmButton: false
                    });
                    setBusinessUnits(prev => prev.filter(unit => unit._id !== id));
                }
            } catch (error) {
                console.error("Delete failed", error);
                Swal.fire("Error!", "Failed to delete business unit.", "error");
            }
        }
    };

    const filterUnits = (status: string) => {
        let filtered = businessUnits;

        if (searchTerm) {
            const lower = searchTerm.toLowerCase();
            filtered = filtered.filter(u =>
                u.branding?.name.toLowerCase().includes(lower) ||
                u.contact?.email.toLowerCase().includes(lower)
            );
        }

        if (status === "all") return filtered;
        if (status === "active") return filtered.filter(u => u.status === 'published' || u.status === 'active');
        if (status === "inactive") return filtered.filter(u => u.status !== 'published' && u.status !== 'active');

        return filtered;
    };

    // Define Columns
    const columns: ColumnDef<BusinessUnit>[] = [
        {
            accessorKey: "branding.name",
            header: "Name",
            cell: ({ row }) => <span className="font-medium">{row.original.branding?.name}</span>,
        },
        {
            accessorKey: "location",
            header: "Location",
            cell: ({ row }) => (
                <div className="flex items-center gap-1 text-muted-foreground">
                    <MapPin className="h-3 w-3" /> {row.original.location?.city || 'N/A'}, {row.original.location?.country || 'N/A'}
                </div>
            ),
        },
        {
            accessorKey: "contact",
            header: "Contact",
            cell: ({ row }) => (
                <div className="flex flex-col text-sm">
                    <span className="flex items-center gap-1"><UserIcon className="h-3 w-3" /> {row.original.contact?.email}</span>
                    <span className="flex items-center gap-1"><Phone className="h-3 w-3" /> {row.original.contact?.phone}</span>
                </div>
            ),
        },
        {
            accessorKey: "statistics.totalRevenue",
            header: "Revenue",
            cell: ({ row }) => `BDT ${row.original.statistics?.totalRevenue || 0}`,
        },
        {
            accessorKey: "status",
            header: "Status",
            cell: ({ row }) => (
                <Badge variant={row.original.status === "published" || row.original.status === "active" ? "default" : "secondary"}>
                    {row.original.status}
                </Badge>
            ),
        },
        {
            id: "actions",
            header: "Actions",
            cell: ({ row }) => (
                <div className="flex justify-end gap-2">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem onClick={() => router.push(`business-units/${row.original._id}`)}>
                                <Eye className="mr-2 h-4 w-4" /> View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => router.push(`business-units/${row.original._id}/edit`)}>
                                <Edit className="mr-2 h-4 w-4" /> Edit Unit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                className="text-destructive focus:text-destructive"
                                onClick={() => handleDelete(row.original._id)}
                            >
                                <Trash2 className="mr-2 h-4 w-4" /> Delete
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            ),
        },
    ];

    if (isLoading) {
        return <div className="flex h-screen items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
    }

    return (
        <DataPageLayout
            title="Business Units"
            createAction={{
                label: "Add New Unit",
                onClick: () => router.push("business-units/new")
            }}
            extraFilters={
                <div className="relative flex-1 max-w-sm ml-auto">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search units..."
                        className="pl-8"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            }
            stats={
                <div className="flex flex-row gap-4">
                    <StatCard
                        title="Total Units"
                        icon={Building2}
                        value={businessUnits.length}
                    />
                    <StatCard
                        title="Active Units"
                        icon={CheckCircle}
                        value={businessUnits.filter(u => u.status === 'published' || u.status === 'active').length}
                    />
                    <StatCard
                        title="Inactive Units"
                        icon={XCircle}
                        value={businessUnits.filter(u => u.status !== 'published' && u.status !== 'active').length}
                    />
                </div>
            }
            tabs={[
                { value: "all", label: "All Units" },
                { value: "active", label: "Active" },
                { value: "inactive", label: "Inactive" },
            ]}
            activeTab={activeTab}
            onTabChange={setActiveTab}
        >
            <TabsContent value="all" className="mt-0">
                <DataTable columns={columns} data={filterUnits("all")} isLoading={isLoading} />
            </TabsContent>
            <TabsContent value="active" className="mt-0">
                <DataTable columns={columns} data={filterUnits("active")} isLoading={isLoading} />
            </TabsContent>
            <TabsContent value="inactive" className="mt-0">
                <DataTable columns={columns} data={filterUnits("inactive")} isLoading={isLoading} />
            </TabsContent>
        </DataPageLayout>
    );
}
