"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Plus, MoreHorizontal, Loader2, Trash2, Edit, RefreshCw } from "lucide-react";
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
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { axiosInstance } from "@/lib/axios/axiosInstance";
import Swal from "sweetalert2";

interface Brand {
    _id: string;
    name: string;
    description?: string;
    website?: string;
    status: string;
    createdAt?: string;
}

export default function BrandsPage() {
    const router = useRouter();
    const pathname = usePathname();
    const [searchTerm, setSearchTerm] = useState("");
    const [brands, setBrands] = useState<Brand[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchBrands = async () => {
        try {
            setIsLoading(true);
            const response: any = await axiosInstance.get('/super-admin/brands'); // Adjusted endpoint

            if (response?.success && Array.isArray(response?.data)) {
                setBrands(response.data);
            } else if (response?.data?.data && Array.isArray(response.data.data)) {
                // Handle nested structure if backend uses standard ApiResponse with pagination
                setBrands(response.data.data);
            } else {
                setBrands([]);
            }
        } catch (error) {
            console.error("Failed to fetch brands", error);
            Swal.fire({
                icon: "error",
                title: "Connection Error",
                text: "Could not retrieve brands.",
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
        fetchBrands();
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
                const res: any = await axiosInstance.delete(`/super-admin/brands/${id}`);
                if (res?.success) {
                    Swal.fire({
                        title: "Deleted!",
                        text: "Brand has been deleted.",
                        icon: "success",
                        timer: 2000,
                        showConfirmButton: false
                    });
                    setBrands(prev => prev.filter(brand => brand._id !== id));
                }
            } catch (error) {
                console.error("Delete failed", error);
                Swal.fire("Error!", "Failed to delete brand.", "error");
            }
        }
    };

    const filteredBrands = brands.filter((brand) =>
        brand.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (isLoading) {
        return <div className="flex h-screen items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
    }

    return (
        <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
            <div className="flex items-center justify-between space-y-2">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Brands</h2>
                    <p className="text-muted-foreground">
                        Manage product brands.
                    </p>
                </div>
                <div className="flex items-center space-x-2">
                    <Button onClick={() => router.push(`${pathname}/add`)}>
                        <Plus className="mr-2 h-4 w-4" /> Add New Brand
                    </Button>
                </div>
            </div>

            {/* Compact Statistics */}
            <div className="flex flex-wrap gap-3 py-2">
                <div className="flex items-center gap-2 px-4  bg-card rounded-md border shadow-sm">
                    <span className="text-sm font-medium text-muted-foreground">Total Brands</span>
                    <span className="text-lg font-bold">{brands.length}</span>
                </div>
                <div className="flex items-center gap-2 px-4  bg-card rounded-md border shadow-sm">
                    <div className="h-2 w-2 rounded-full bg-green-500" />
                    <span className="text-sm font-medium text-muted-foreground">Active Brands</span>
                    <span className="text-lg font-bold">{brands.filter(b => b.status === 'active').length}</span>
                </div>
                <Button variant="outline" size="sm" onClick={fetchBrands} className="ml-auto">
                    <RefreshCw className="mr-2 h-4 w-4" /> Refresh
                </Button>
            </div>


            <div className="flex items-center py-4">
                <Input
                    placeholder="Search brands..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="max-w-sm"
                />
            </div>

            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Website</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredBrands.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={4} className="h-24 text-center">
                                    No brands found.
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredBrands.map((brand) => (
                                <TableRow key={brand._id}>
                                    <TableCell className="font-medium">{brand.name}</TableCell>
                                    <TableCell>{brand.website || 'N/A'}</TableCell>
                                    <TableCell>
                                        <Badge variant={brand.status === "active" ? "default" : "secondary"}>
                                            {brand.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" className="h-8 w-8 p-0">
                                                    <span className="sr-only">Open menu</span>
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                <DropdownMenuItem onClick={() => router.push(`${pathname}/${brand._id}/edit`)}>
                                                    <Edit className="mr-2 h-4 w-4" /> Edit Brand
                                                </DropdownMenuItem>
                                                <DropdownMenuItem
                                                    className="text-destructive focus:text-destructive"
                                                    onClick={() => handleDelete(brand._id)}
                                                >
                                                    <Trash2 className="mr-2 h-4 w-4" /> Delete
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
