"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Building2, Save, ArrowLeft, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Swal from "sweetalert2";
import { useCreateBusinessUnitMutation } from "@/redux/api/businessUnitApi";

export default function SuperAdminAddBusinessUnitPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    // Form state
    const [name, setName] = useState("");
    const [type, setType] = useState("general");
    const [status, setStatus] = useState("published");
    const [address, setAddress] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [description, setDescription] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        setLoading(true);

        try {
            // Generate a slug and id
            const generatedSlug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
            const generatedId = `BU-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`;

            // Payload based on creation requirements
            const payload = {
                name: name,
                id: generatedId,
                slug: generatedSlug,
                branding: {
                    name: name,
                    description: description || `Business unit for ${name}`
                },
                contact: {
                    email: email,
                    phone: phone
                },
                location: {
                    address: address || ""
                },
                status: status,
                primaryCategory: "675000000000000000000001",
                categories: ["675000000000000000000001"], // Required array
                businessUnitType: type,
                seo: {
                    metaTitle: name || "Business Unit",
                    metaDescription: description || `Business unit for ${name}`
                }
            };

            // API Call - Using RTK Mutation
            const result = await createBusinessUnit(payload).unwrap();

            if (result.success) {
                Swal.fire({
                    icon: "success",
                    title: "Success",
                    text: "Business Unit created successfully!",
                    timer: 1500,
                    showConfirmButton: false,
                });
                router.push("/super-admin/business-units");
            } else {
                throw new Error(result.message || "Failed to create");
            }
        } catch (error: any) {
            console.error("Failed to create business unit:", error);
            Swal.fire({
                icon: "error",
                title: "Failed",
                text: error?.data?.message || error?.message || "Could not create business unit."
            });
        } finally {
            setLoading(false); // Reset local loading state
        }
    };

    return (
        <div className="container mx-auto py-6 space-y-6">
            <div className="flex items-center space-x-4">
                <Button variant="ghost" size="icon" onClick={() => router.back()}>
                    <ArrowLeft className="h-4 w-4" />
                </Button>
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Add New Business Unit</h2>
                    <p className="text-muted-foreground">
                        Create a new business unit to expand your system.
                    </p>
                </div>
            </div>

            <div className="grid gap-4 max-w-2xl mt-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Unit Details</CardTitle>
                        <CardDescription>Enter the information about the new business unit.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid gap-2">
                                <Label htmlFor="name">Unit Name</Label>
                                <Input
                                    id="name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="e.g., North End Branch"
                                    required
                                />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="desc">Description</Label>
                                <Input
                                    id="desc"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    placeholder="Short description"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="type">Unit Type</Label>
                                    <Select value={type} onValueChange={setType}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select type" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="general">General</SelectItem>
                                            <SelectItem value="boutique">Boutique</SelectItem>
                                            <SelectItem value="brand">Brand</SelectItem>
                                            <SelectItem value="marketplace">Marketplace</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="status">Status</Label>
                                    <Select value={status} onValueChange={setStatus}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select status" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="published">Active</SelectItem>
                                            <SelectItem value="draft">Setup Phase</SelectItem>
                                            <SelectItem value="suspended">Inactive</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="address">Address</Label>
                                <Textarea
                                    id="address"
                                    value={address}
                                    onChange={(e) => setAddress(e.target.value)}
                                    placeholder="123 Main St, City, Country"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="email">Contact Email</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="branch@example.com"
                                        required
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="phone">Contact Phone</Label>
                                    <Input
                                        id="phone"
                                        type="tel"
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value)}
                                        placeholder="+880..."
                                        required
                                    />
                                </div>
                            </div>

                            <div className="flex justify-end gap-2 pt-4">
                                <Button type="button" variant="outline" onClick={() => router.back()}>Cancel</Button>
                                <Button type="submit" disabled={loading}>
                                    {loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Creating...</> : "Create Unit"}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
