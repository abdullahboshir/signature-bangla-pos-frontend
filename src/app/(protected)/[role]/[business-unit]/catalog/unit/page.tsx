"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
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

interface Unit {
    _id: string;
    name: string;
    symbol: string;
    status: string;
}

export default function UnitsPage() {
    const router = useRouter();
    const [searchTerm, setSearchTerm] = useState("");
    const [units, setUnits] = useState<Unit[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchUnits = async () => {
        try {
            setIsLoading(true);
            const response: any = await axiosInstance.get('/super-admin/units');

            if (response?.success && Array.isArray(response?.data)) {
                setUnits(response.data);
            } else if (response?.data?.data && Array.isArray(response.data.data)) {
                setUnits(response.data.data);
            } else {
                setUnits([]);
            }
        } catch (error) {
            console.error("Failed to fetch units", error);
            Swal.fire({
                icon: "error",
                title: "Connection Error",
                text: "Could not retrieve units.",
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
        fetchUnits();
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
                const res: any = await axiosInstance.delete(`/super-admin/units/${id}`);
                if (res?.success) {
                    Swal.fire({
                        title: "Deleted!",
                        text: "Unit has been deleted.",
                        icon: "success",
                        timer: 2000,
                        showConfirmButton: false
                    });
                    setUnits(prev => prev.filter(unit => unit._id !== id));
                }
            } catch (error) {
                console.error("Delete failed", error);
                Swal.fire("Error!", "Failed to delete unit.", "error");
            }
        }
    };

    const filteredUnits = units.filter((unit) =>
        unit.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        unit.symbol.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (isLoading) {
        return <div className="flex h-screen items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
    }

    return (
        <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
            <div className="flex items-center justify-between space-y-2">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Measurement Units</h2>
                    <p className="text-muted-foreground">
                        Manage product measurement units (e.g., kg, pcs).
                    </p>
                </div>
                <div className="flex items-center space-x-2">
                    <Button onClick={() => router.push("unit/add")}>
                        <Plus className="mr-2 h-4 w-4" /> Add Measurement Unit
                    </Button>
                </div>
            </div>

            {/* Compact Statistics */}
            <div className="flex flex-wrap gap-3 py-2">
                <div className="flex items-center gap-2 px-4 py-2 bg-card rounded-md border shadow-sm">
                    <span className="text-sm font-medium text-muted-foreground">Total Units</span>
                    <span className="text-lg font-bold">{units.length}</span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-card rounded-md border shadow-sm">
                    <div className="h-2 w-2 rounded-full bg-green-500" />
                    <span className="text-sm font-medium text-muted-foreground">Active Units</span>
                    <span className="text-lg font-bold">{units.filter(u => u.status === 'active').length}</span>
                </div>
                <Button variant="outline" size="sm" onClick={fetchUnits} className="ml-auto">
                    <RefreshCw className="mr-2 h-4 w-4" /> Refresh
                </Button>
            </div>

            <div className="flex items-center py-4">
                <Input
                    placeholder="Search units..."
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
                            <TableHead>Symbol</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredUnits.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={4} className="h-24 text-center">
                                    No units found.
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredUnits.map((unit) => (
                                <TableRow key={unit._id}>
                                    <TableCell className="font-medium">{unit.name}</TableCell>
                                    <TableCell>{unit.symbol}</TableCell>
                                    <TableCell>
                                        <Badge variant={unit.status === "active" ? "default" : "secondary"}>
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
                                                <DropdownMenuItem onClick={() => router.push(`unit/${unit._id}/edit`)}>
                                                    <Edit className="mr-2 h-4 w-4" /> Edit Unit
                                                </DropdownMenuItem>
                                                <DropdownMenuItem
                                                    className="text-destructive focus:text-destructive"
                                                    onClick={() => handleDelete(unit._id)}
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
