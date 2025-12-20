"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Building2, Save, ArrowLeft, Loader2, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import Swal from "sweetalert2";
import { useCreateOutletMutation } from "@/redux/api/outletApi";

export default function AddOutletPage() {
    const router = useRouter();
    const params = useParams();
    const businessUnitId = params["business-unit"] as string;

    const [createOutlet, { isLoading: isCreating }] = useCreateOutletMutation();

    // Form state
    const [name, setName] = useState("");
    const [code, setCode] = useState("");
    const [phone, setPhone] = useState("");
    const [email, setEmail] = useState("");
    const [address, setAddress] = useState("");
    const [city, setCity] = useState("");
    const [country, setCountry] = useState("Bangladesh");
    const [isActive, setIsActive] = useState(true);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const payload = {
                name,
                code: code.toUpperCase(),
                phone,
                email,
                address,
                city,
                country,
                businessUnit: businessUnitId,
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
            console.error("Creation error", error);
            Swal.fire({
                icon: "error",
                title: "Failed",
                text: error?.message || error?.data?.message || "Could not create outlet."
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
