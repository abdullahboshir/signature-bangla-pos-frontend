"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { ArrowLeft, Building2, MapPin, Phone, Mail, FileText, Calendar, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { axiosInstance } from "@/lib/axios/axiosInstance";
import { Loader2 } from "lucide-react";
import Swal from "sweetalert2";

export default function BusinessUnitDetailsPage() {
    const router = useRouter();
    const params = useParams();
    const id = params?.id as string;

    const [unit, setUnit] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchUnit = async () => {
            if (!id) return;
            try {
                const response: any = await axiosInstance.get(`/super-admin/business-unit/${id}`);
                if (response?.success && response?.data) {
                    setUnit(response.data);
                } else {
                    console.error("Failed to load unit data", response);
                    Swal.fire("Error", "Could not load business unit details", "error");
                }
            } catch (error) {
                console.error("Fetch error", error);
                Swal.fire("Error", "Failed to fetch business unit details", "error");
            } finally {
                setIsLoading(false);
            }
        };

        fetchUnit();
    }, [id]);

    if (isLoading) {
        return <div className="flex h-screen items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
    }

    if (!unit) {
        return (
            <div className="flex flex-col items-center justify-center h-[50vh] gap-4">
                <p className="text-muted-foreground">Business Unit not found</p>
                <Button variant="outline" onClick={() => router.back()}>Go Back</Button>
            </div>
        );
    }

    return (
        <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                    <Button variant="ghost" size="icon" onClick={() => router.back()}>
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                    <h2 className="text-3xl font-bold tracking-tight">Unit Details</h2>
                </div>
                <Button onClick={() => router.push(`${id}/edit`)}>
                    <Edit className="mr-2 h-4 w-4" /> Edit Unit
                </Button>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-4">
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div className="space-y-1">
                                <CardTitle className="text-2xl">{unit.branding?.name}</CardTitle>
                                <CardDescription>ID: {unit.id}</CardDescription>
                            </div>
                            <Badge variant={unit.status === 'published' || unit.status === 'active' ? 'default' : 'secondary'}>
                                {unit.status}
                            </Badge>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {unit.branding?.banner && (
                            <div className="aspect-video w-full overflow-hidden rounded-md border bg-muted">
                                <img
                                    src={unit.branding.banner}
                                    alt={unit.branding.name}
                                    className="h-full w-full object-cover"
                                />
                            </div>
                        )}

                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="space-y-4">
                                <h4 className="font-semibold flex items-center gap-2">
                                    <Building2 className="h-4 w-4" /> General Info
                                </h4>
                                <Separator />
                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Category:</span>
                                        <span className="font-medium">{unit.category || 'N/A'}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Created At:</span>
                                        <span className="font-medium">{new Date(unit.createdAt).toLocaleDateString()}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <h4 className="font-semibold flex items-center gap-2">
                                    <MapPin className="h-4 w-4" /> Location
                                </h4>
                                <Separator />
                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Street:</span>
                                        <span className="font-medium">{unit.location?.address || 'N/A'}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">City:</span>
                                        <span className="font-medium">{unit.location?.city || 'N/A'}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Country:</span>
                                        <span className="font-medium">{unit.location?.country || 'N/A'}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="space-y-4">
                                <h4 className="font-semibold flex items-center gap-2">
                                    <Phone className="h-4 w-4" /> Contact Info
                                </h4>
                                <Separator />
                                <div className="space-y-2 text-sm">
                                    <div className="flex flex-col gap-1">
                                        <span className="text-muted-foreground text-xs">Email</span>
                                        <div className="flex items-center gap-2 font-medium">
                                            <Mail className="h-3 w-3" /> {unit.contact?.email}
                                        </div>
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        <span className="text-muted-foreground text-xs">Phone</span>
                                        <div className="flex items-center gap-2 font-medium">
                                            <Phone className="h-3 w-3" /> {unit.contact?.phone}
                                        </div>
                                    </div>
                                    {unit.contact?.website && (
                                        <div className="flex flex-col gap-1">
                                            <span className="text-muted-foreground text-xs">Website</span>
                                            <div className="flex items-center gap-2 font-medium text-blue-500">
                                                <a href={unit.contact.website} target="_blank" rel="noreferrer">{unit.contact.website}</a>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="col-span-3">
                    <CardHeader>
                        <CardTitle>Statistics</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between p-4 border rounded-lg bg-card">
                                <div className="space-y-1">
                                    <p className="text-sm font-medium text-muted-foreground">Total Revenue</p>
                                    <p className="text-2xl font-bold">BDT {unit.statistics?.totalRevenue || 0}</p>
                                </div>
                                <div className="h-8 w-8 rounded-full bg-emerald-100 flex items-center justify-center">
                                    <span className="text-emerald-600 font-bold">$</span>
                                </div>
                            </div>
                            {/* Add more stats placeholders as needed */}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
