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
import { useCreateOutletMutation, useUpdateOutletMutation } from "@/redux/api/organization/outletApi";
import { useGetBusinessUnitsQuery } from "@/redux/api/organization/businessUnitApi";
import { useCurrentBusinessUnit } from "@/hooks/useCurrentBusinessUnit";

interface OutletFormProps {
    preSelectedSlug?: string;
    initialData?: any;
    isEditMode?: boolean;
}

export function OutletForm({ preSelectedSlug, initialData, isEditMode = false }: OutletFormProps) {
    const router = useRouter();

    // API
    const [createOutlet, { isLoading: isCreating }] = useCreateOutletMutation();
    const [updateOutlet, { isLoading: isUpdating }] = useUpdateOutletMutation();
    const { data: businessUnitsData, isLoading: isLoadingBUs } = useGetBusinessUnitsQuery(undefined);

    // Handle BU data safely
    const businessUnits = Array.isArray(businessUnitsData) ? businessUnitsData :
        ((businessUnitsData as any)?.data || businessUnitsData || []);

    // Form state - Initialize with initialData if available
    const [name, setName] = useState(initialData?.name || "");
    const [code, setCode] = useState(initialData?.code || "");
    const [phone, setPhone] = useState(initialData?.phone || "");
    const [email, setEmail] = useState(initialData?.email || "");
    const [address, setAddress] = useState(initialData?.address || "");
    const [city, setCity] = useState(initialData?.city || "");
    const [country, setCountry] = useState(initialData?.country || "Bangladesh");

    // For BU ID: 
    // If Editing, use initialData.businessUnit 
    // (Ensure to handle if it's an object { id, name } or string ID)
    const initialBuId = initialData?.businessUnit
        ? (typeof initialData.businessUnit === 'object' ? (initialData.businessUnit._id || initialData.businessUnit.id) : initialData.businessUnit)
        : "";

    const [businessUnitId, setBusinessUnitId] = useState(initialBuId || "");
    const [isActive, setIsActive] = useState(initialData !== undefined ? initialData.isActive : true);

    const { currentBusinessUnit } = useCurrentBusinessUnit();

    // Initial Load Logic for Scoped Context
    useEffect(() => {
        if (preSelectedSlug) {
            const slugLower = preSelectedSlug.toLowerCase();

            // Priority 1: Use Context if available and matches slug (Case Insensitive)
            if (currentBusinessUnit) {
                const currentSlug = (currentBusinessUnit.slug || "").toLowerCase();
                // Check matching slug or direct ID key
                if (currentSlug === slugLower || currentBusinessUnit.id === preSelectedSlug || currentBusinessUnit._id === preSelectedSlug) {
                    setBusinessUnitId(currentBusinessUnit.id || currentBusinessUnit._id);
                    return;
                }
            }

            // Priority 2: Use List if loaded
            if (businessUnits.length > 0) {
                const matchedBU = businessUnits.find((bu: any) =>
                    (bu.slug && bu.slug.toLowerCase() === slugLower) ||
                    bu.id === preSelectedSlug ||
                    bu._id === preSelectedSlug
                );
                if (matchedBU) {
                    setBusinessUnitId(matchedBU.id || matchedBU._id);
                    return;
                }
            }

            // Priority 3: Fallback to slug if nothing else found
            // Logic: If state is empty OR state matches the slug (re-enforcing)
            // But we must be careful not to overwrite a valid ID with a slug if we re-run
            // Simple check: If we are here, we didn't match ID above.
            setBusinessUnitId(preSelectedSlug);
        }
    }, [preSelectedSlug, businessUnits, currentBusinessUnit]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // If scoped, we might rely on preSelectedSlug logic if state isn't set yet? 
        // Better to enforce selection state.
        const finalBU = businessUnitId || preSelectedSlug; // Absolute fallback for submission

        if (!finalBU && !isEditMode) {
            console.log("Validation Failed: FinalBU is empty", { businessUnitId, preSelectedSlug });
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
                businessUnit: finalBU, // This can be ID or Slug
                isActive
            };

            let res: any;

            if (isEditMode && initialData?._id) {
                // Update Logic
                res = await updateOutlet({ id: initialData._id, body: payload }).unwrap();
            } else {
                // Create Logic
                res = await createOutlet(payload).unwrap();
            }

            if (res) {
                Swal.fire({
                    icon: "success",
                    title: "Success",
                    text: isEditMode ? "Outlet updated successfully!" : "Outlet created successfully!",
                    timer: 1500,
                    showConfirmButton: false,
                });
                router.back();
            }
        } catch (error: any) {
            console.error(isEditMode ? "Update error:" : "Creation error:", error);
            Swal.fire({
                icon: "error",
                title: "Failed",
                text: error?.message || error?.data?.message || JSON.stringify(error?.data) || (isEditMode ? "Could not update outlet." : "Could not create outlet.")
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
                    <h2 className="text-3xl font-bold tracking-tight">{isEditMode ? "Edit Outlet" : "Add New Outlet"}</h2>
                    <p className="text-muted-foreground">
                        {isEditMode ? "Update outlet details." : "Create a physical store location."}
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
                                        {isLoadingBUs && businessUnits.length === 0 ? (
                                            <div className="p-2 text-sm text-center">Loading...</div>
                                        ) : (
                                            // Merge list with currentBU if needed, AND add fallback slug option if currently selected is just a slug
                                            (() => {
                                                const uniqueBUs = [...businessUnits];

                                                // Add Current BU if missing
                                                if (currentBusinessUnit && !uniqueBUs.find(b => (b.id || b._id) === (currentBusinessUnit.id || currentBusinessUnit._id))) {
                                                    uniqueBUs.push(currentBusinessUnit);
                                                }

                                                const options = uniqueBUs.map((bu: any) => (
                                                    <SelectItem key={bu.id || bu._id} value={bu.id || bu._id}>
                                                        {bu.name}
                                                    </SelectItem>
                                                ));

                                                // Critical Fallback: If selected value is the slug (no ID match), render it as an option so Select displays it
                                                if (preSelectedSlug && businessUnitId === preSelectedSlug) {
                                                    // Check if an ID option already exists that resolves this? No, if we are here, we are using slug value
                                                    options.push(
                                                        <SelectItem key="fallback-slug" value={preSelectedSlug}>
                                                            {/* Try to display a nice name if we can match it loosely, else slug */}
                                                            {currentBusinessUnit?.slug === preSelectedSlug ? currentBusinessUnit.name : (preSelectedSlug.charAt(0).toUpperCase() + preSelectedSlug.slice(1))}
                                                        </SelectItem>
                                                    );
                                                }

                                                return options;
                                            })()

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
                                    <Label htmlFor="code">Outlet Code (Optional)</Label>
                                    <Input
                                        id="code"
                                        value={code}
                                        onChange={(e) => setCode(e.target.value)}
                                        placeholder="e.g. DHM-01 (Auto-generated if empty)"
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
                                <Button type="submit" disabled={isCreating || isUpdating}>
                                    {isCreating || isUpdating ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> {isEditMode ? "Updating..." : "Creating..."}</> : (isEditMode ? "Save Changes" : "Create Outlet")}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

