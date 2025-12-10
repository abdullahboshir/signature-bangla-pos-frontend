"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Plus, MoreHorizontal, Building2, MapPin, Phone, User as UserIcon, Loader2 } from "lucide-react";
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { axiosInstance } from "@/lib/axios/axiosInstance";
import Swal from "sweetalert2";

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
    const [searchTerm, setSearchTerm] = useState("");
    const [businessUnits, setBusinessUnits] = useState<BusinessUnit[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchBusinessUnits = async () => {
            try {
                // axiosInstance handles baseURL and token injection
                const response = await axiosInstance.get('/super-admin/business-unit');

                // Response is typically the normalized data handling from interceptor
                // If interceptor returns response.data directly, then 'response' here IS the body.
                // Assuming standard backend structure: { success: true, data: [...] }
                const data = (response as any).data || [];
                setBusinessUnits(data);
            } catch (error) {
                console.error("Failed to fetch business units", error);
                Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: "Failed to load business units. Please try again.",
                    toast: true,
                    position: "top-end",
                    showConfirmButton: false,
                    timer: 3000,
                });
            } finally {
                setIsLoading(false);
            }
        };

        fetchBusinessUnits();
    }, []);

    const filteredUnits = businessUnits.filter((unit) =>
        unit.branding?.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (isLoading) {
        return <div className="flex h-screen items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
    }

    return (
        <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
            <div className="flex items-center justify-between space-y-2">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Business Units</h2>
                    <p className="text-muted-foreground">
                        Manage your organization's business units across different locations.
                    </p>
                </div>
                <div className="flex items-center space-x-2">
                    <Button onClick={() => router.push("business-units/analytics")} variant="outline">
                        Analytics
                    </Button>
                    <Button onClick={() => router.push("business-units/new")}>
                        <Plus className="mr-2 h-4 w-4" /> Add New Unit
                    </Button>
                </div>
            </div>

            <div className="flex items-center py-4">
                <Input
                    placeholder="Search units..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="max-w-sm"
                />
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mb-8">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Units</CardTitle>
                        <Building2 className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{businessUnits.length}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Active Units</CardTitle>
                        <div className="h-2 w-2 rounded-full bg-green-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {businessUnits.filter(u => u.status === 'published' || u.status === 'active').length}
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Location</TableHead>
                            <TableHead>Contact</TableHead>
                            <TableHead>Revenue</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredUnits.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="h-24 text-center">
                                    No business units found.
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredUnits.map((unit) => (
                                <TableRow key={unit._id}>
                                    <TableCell className="font-medium">{unit.branding?.name}</TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-1 text-muted-foreground">
                                            <MapPin className="h-3 w-3" /> {unit.location?.city || 'N/A'}, {unit.location?.country || 'N/A'}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex flex-col text-sm">
                                            <span className="flex items-center gap-1"><UserIcon className="h-3 w-3" /> {unit.contact?.email}</span>
                                            <span className="flex items-center gap-1"><Phone className="h-3 w-3" /> {unit.contact?.phone}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>BDT {unit.statistics?.totalRevenue || 0}</TableCell>
                                    <TableCell>
                                        <Badge variant={unit.status === "published" || unit.status === "active" ? "default" : "secondary"}>
                                            {unit.status}
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
                                                <DropdownMenuItem onClick={() => router.push(`business-units/${unit._id}`)}>
                                                    View Details
                                                </DropdownMenuItem>
                                                <DropdownMenuItem>Edit Unit</DropdownMenuItem>
                                                <DropdownMenuItem className="text-destructive">Deactivate</DropdownMenuItem>
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
