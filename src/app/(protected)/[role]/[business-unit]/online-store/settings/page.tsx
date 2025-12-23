"use client";

import React, { useEffect } from "react";
import { useParams } from "next/navigation";
import { useGetStoreConfigQuery, useUpdateStoreConfigMutation } from "@/redux/api/storefrontApi";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Loader2, Save } from "lucide-react";
import { toast } from "sonner";
import { useForm } from "react-hook-form";

export default function StoreSettingsPage() {
    const params = useParams();
    const businessUnitId = params["business-unit"] as string;

    const { data: configData, isLoading } = useGetStoreConfigQuery(businessUnitId);
    const [updateConfig, { isLoading: isSaving }] = useUpdateStoreConfigMutation();

    const { register, handleSubmit, setValue, watch, control, reset } = useForm({
        defaultValues: {
            theme: {
                primaryColor: "#f85606",
                secondaryColor: "#1a1a1a",
                backgroundColor: "#f5f5f5",
                fontFamily: "Inter"
            },
            navbar: {
                logo: "",
                showSearch: true,
                showCart: true,
                links: []
            },
            footer: {
                description: "",
                copyrightText: "",
                socialLinks: { facebook: "", twitter: "", instagram: "", youtube: "" }
            }
        }
    });

    useEffect(() => {
        if (configData?.data) {
            reset(configData.data);
        }
    }, [configData, reset]);

    const onSubmit = async (data: any) => {
        try {
            await updateConfig({ businessUnitId, data }).unwrap();
            toast.success("Store settings updated successfully");
        } catch (error) {
            toast.error("Failed to update settings");
            console.error(error);
        }
    };

    if (isLoading) return <div className="flex h-screen items-center justify-center"><Loader2 className="animate-spin" /></div>;

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold">Store Settings</h1>
                    <p className="text-gray-500">Manage your online store's appearance and global configuration.</p>
                </div>
                <Button onClick={handleSubmit(onSubmit)} disabled={isSaving}>
                    {isSaving ? <Loader2 className="animate-spin w-4 h-4 mr-2" /> : <Save className="w-4 h-4 mr-2" />}
                    Save Changes
                </Button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <Tabs defaultValue="theme" className="w-full">
                    <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="theme">Theme & Branding</TabsTrigger>
                        <TabsTrigger value="navbar">Navigation Bar</TabsTrigger>
                        <TabsTrigger value="footer">Footer</TabsTrigger>
                    </TabsList>

                    {/* THEME TAB */}
                    <TabsContent value="theme">
                        <Card>
                            <CardHeader>
                                <CardTitle>Theme Configuration</CardTitle>
                                <CardDescription>Customize colors and fonts.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label>Primary Color</Label>
                                        <div className="flex gap-2">
                                            <Input type="color" className="w-12 h-10 p-1" {...register("theme.primaryColor")} />
                                            <Input type="text" {...register("theme.primaryColor")} />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Secondary Color</Label>
                                        <div className="flex gap-2">
                                            <Input type="color" className="w-12 h-10 p-1" {...register("theme.secondaryColor")} />
                                            <Input type="text" {...register("theme.secondaryColor")} />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Background Color</Label>
                                        <div className="flex gap-2">
                                            <Input type="color" className="w-12 h-10 p-1" {...register("theme.backgroundColor")} />
                                            <Input type="text" {...register("theme.backgroundColor")} />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Font Family</Label>
                                        <Input placeholder="Inter, Roboto, sans-serif" {...register("theme.fontFamily")} />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* NAVBAR TAB */}
                    <TabsContent value="navbar">
                        <Card>
                            <CardHeader>
                                <CardTitle>Navbar Settings</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label>Logo URL</Label>
                                    <Input placeholder="https://example.com/logo.png" {...register("navbar.logo")} />
                                </div>
                                <div className="flex items-center justify-between border p-4 rounded-lg">
                                    <Label>Show Search Bar</Label>
                                    <Switch
                                        checked={watch("navbar.showSearch")}
                                        onCheckedChange={(val) => setValue("navbar.showSearch", val)}
                                    />
                                </div>
                                <div className="flex items-center justify-between border p-4 rounded-lg">
                                    <Label>Show Cart Icon</Label>
                                    <Switch
                                        checked={watch("navbar.showCart")}
                                        onCheckedChange={(val) => setValue("navbar.showCart", val)}
                                    />
                                </div>
                                {/* Future: Dynamic Link builder */}
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* FOOTER TAB */}
                    <TabsContent value="footer">
                        <Card>
                            <CardHeader>
                                <CardTitle>Footer Settings</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label>About Description</Label>
                                    <Input placeholder="Short description about your store..." {...register("footer.description")} />
                                </div>
                                <div className="space-y-2">
                                    <Label>Copyright Text</Label>
                                    <Input placeholder="© 2024 Signature Bangla..." {...register("footer.copyrightText")} />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label>Facebook URL</Label>
                                        <Input placeholder="https://facebook.com/..." {...register("footer.socialLinks.facebook")} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Instagram URL</Label>
                                        <Input placeholder="https://instagram.com/..." {...register("footer.socialLinks.instagram")} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>YouTube URL</Label>
                                        <Input placeholder="https://youtube.com/..." {...register("footer.socialLinks.youtube")} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Twitter URL</Label>
                                        <Input placeholder="https://twitter.com/..." {...register("footer.socialLinks.twitter")} />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </form>
        </div>
    );
}
