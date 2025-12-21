"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Swal from "sweetalert2";
import { useCreateOutletMutation } from "@/redux/api/outletApi";
import { useGetBusinessUnitsQuery } from "@/redux/api/businessUnitApi";

interface OutletFormProps {
    preSelectedSlug?: string;
}

export function OutletForm({ preSelectedSlug }: OutletFormProps) {
    const router = useRouter();

    // API
    const [createOutlet, { isLoading: isCreating }] = useCreateOutletMutation();
    const { data: businessUnitsData, isLoading: isLoadingBUs } = useGetBusinessUnitsQuery(undefined);

    // Handle BU data safely
    const businessUnits = Array.isArray(businessUnitsData) ? businessUnitsData :
        (businessUnitsData?.data || businessUnitsData || []);

    // Form state
    const [name, setName] = useState("");
    const [code, setCode] = useState("");
    const [phone, setPhone] = useState("");
    const [email, setEmail] = useState("");
    const [address, setAddress] = useState("");
    const [city, setCity] = useState("");
    const [country, setCountry] = useState("Bangladesh");
    const [businessUnitId, setBusinessUnitId] = useState("");
    const [isActive, setIsActive] = useState(true);

    // Initial Load Logic for Scoped Context
    useEffect(() => {
        if (preSelectedSlug && businessUnits.length > 0) {
            // Try to find BU by slug or ID match
            // Try to find BU by slug or ID match (case insensitive for slug)
            const matchedBU = businessUnits.find((bu: any) =>
                (bu.slug && bu.slug.toLowerCase() === preSelectedSlug.toLowerCase()) ||
                bu.id === preSelectedSlug ||
                bu._id === preSelectedSlug
            );

            if (matchedBU) {
                setBusinessUnitId(matchedBU.id || matchedBU._id);
            } else if (preSelectedSlug) {
                // Fallback: If no match found (e.g. list empty or mismatch), use slug directly.
                // This ensures the backend (which supports slug) receives a valid identifier.
                setBusinessUnitId(preSelectedSlug);
            }
        } else if (preSelectedSlug && businessUnits.length === 0 && !isLoadingBUs) {
            // Case where list failed to load but we have a slug
            setBusinessUnitId(preSelectedSlug);
        }
    }, [preSelectedSlug, businessUnits]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // If scoped, we might rely on preSelectedSlug logic if state isn't set yet? 
        // Better to enforce selection state.
        const finalBU = businessUnitId;

        if (!finalBU) {
            Swal.fire("Error", "Please select a Business Unit", "error");
            return;
        }

        try {
            const payload = {
                name,
                code: code.toUpperCase(),
                phone,
                email,
                address,
                city,
                country,
                businessUnit: finalBU,
                isActive
            };

            const res: any = await createOutlet(payload).unwrap();

            if (res?.success) {
                Swal.fire({
                    icon: "success",
                    title: "Success",
                    text: "Outlet created successfully!",
                    timer: 1500,
                    showConfirmButton: false,
                });
                router.back();
            }
        } catch (error: any) {
            console.error("Creation error:", error);
            Swal.fire({
                icon: "error",
                title: "Failed",
                text: error?.message || error?.data?.message || JSON.stringify(error?.data) || "Could not create outlet."
            });
        }
    };

    return (
        <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
            <div className="flex items-center space-x-4">
                <Button variant="ghost" size="icon" onClick={() => router.back()}>
                    <ArrowLeft className="h-4 w-4" />
                </Button>
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Add New Outlet</h2>
                    <p className="text-muted-foreground">
                        Create a physical store location.
                    </p>
                </div>
            </div>

            <div className="grid gap-4 max-w-2xl mt-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Outlet Details</CardTitle>
                        <CardDescription>Enter information for the new physical outlet.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">

                            {/* Business Unit Selector - Locked if scoped */}
                            <div className="grid gap-2">
                                <Label htmlFor="bu">Business Unit</Label>
                                <Select
                                    value={businessUnitId}
                                    onValueChange={setBusinessUnitId}
                                    disabled={!!preSelectedSlug} // Always disable if in scoped mode
                                    required
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select Business Unit" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {isLoadingBUs ? (
                                            <div className="p-2 text-sm text-center">Loading...</div>
                                        ) : (
                                            businessUnits.map((bu: any) => (
                                                <SelectItem key={bu.id || bu._id} value={bu.id || bu._id}>
                                                    {bu.name}
                                                </SelectItem>
                                            ))
                                        )}
                                    </SelectContent>
                                </Select>
                                {preSelectedSlug && (
                                    <p className="text-xs text-muted-foreground">
                                        * Business Unit is locked to the current dashboard context.
                                    </p>
                                )}
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="name">Outlet Name</Label>
                                    <Input
                                        id="name"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        placeholder="e.g. Dhanmondi Branch"
                                        required
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="code">Outlet Code</Label>
                                    <Input
                                        id="code"
                                        value={code}
                                        onChange={(e) => setCode(e.target.value)}
                                        placeholder="e.g. DHM-01"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="phone">Phone</Label>
                                    <Input
                                        id="phone"
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value)}
                                        placeholder="Contact number"
                                        required
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="email">Email (Optional)</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="branch@example.com"
                                    />
                                </div>
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="address">Address</Label>
                                <Textarea
                                    id="address"
                                    value={address}
                                    onChange={(e) => setAddress(e.target.value)}
                                    placeholder="Full address"
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="city">City</Label>
                                    <Input
                                        id="city"
                                        value={city}
                                        onChange={(e) => setCity(e.target.value)}
                                        placeholder="City"
                                        required
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="country">Country</Label>
                                    <Input
                                        id="country"
                                        value={country}
                                        onChange={(e) => setCountry(e.target.value)}
                                        placeholder="Country"
                                    />
                                </div>
                            </div>

                            <div className="flex items-center space-x-2 pt-2">
                                <Switch
                                    id="active"
                                    checked={isActive}
                                    onCheckedChange={setIsActive}
                                />
                                <Label htmlFor="active">Active Status</Label>
                            </div>

                            <div className="flex justify-end gap-2 pt-4">
                                <Button type="button" variant="outline" onClick={() => router.back()}>Cancel</Button>
                                <Button type="submit" disabled={isCreating}>
                                    {isCreating ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Creating...</> : "Create Outlet"}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
