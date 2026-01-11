"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState, useEffect } from "react"
import { useThemeSettings } from "@/lib/providers/ThemeSettingsProvider"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface BrandingSettingsProps {
    data: any;
    onChange: (section: string, ...rest: any[]) => void;
    context: 'platform' | 'company' | 'business' | 'outlet';
}

export default function BrandingSettings({ data, onChange, context }: BrandingSettingsProps) {
    const { theme, updateTheme, previewTheme } = useThemeSettings()

    // Local theme state for preview
    const [primary, setPrimary] = useState(theme.primary || "#0F172A")
    const [secondary, setSecondary] = useState(theme.secondary || "#334155")
    const [radius, setRadius] = useState(theme.radius ?? 0.5)

    useEffect(() => {
        if (data?.theme) {
            setPrimary(data.theme.primaryColor || theme.primary)
            setSecondary(data.theme.secondaryColor || theme.secondary)
        }
    }, [data])

    const handleThemeChange = (key: string, val: string) => {
        if (key === 'primaryColor') {
            setPrimary(val);
            previewTheme({ primary: val });
        }
        if (key === 'secondaryColor') {
            setSecondary(val);
            previewTheme({ secondary: val });
        }

        // Propagate to parent state - using 4-argument depth 2 update
        onChange('branding', 'theme', key, val);
    }

    return (
        <div className="space-y-4">
            <Card>
                <CardHeader>
                    <CardTitle>
                        {context === 'platform' ? 'Platform Identity' :
                            context === 'outlet' ? 'Outlet Identity' : 'Company Brand'}
                    </CardTitle>
                    <CardDescription>Customize the visual identity and presentation.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                            <Label>Brand Name</Label>
                            <Input
                                value={data?.name || ""}
                                onChange={(e) => onChange('branding', 'name', e.target.value)}
                                placeholder={context === 'platform' ? "Signature Bangla" : "Acme Corp"}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Brand Tagline</Label>
                            <Input
                                value={data?.tagline || ""}
                                onChange={(e) => onChange('branding', 'tagline', e.target.value)}
                                placeholder="Precision. Performance. Prosperity."
                            />
                        </div>
                        <div className="space-y-2 md:col-span-2">
                            <Label>Brand Description</Label>
                            <Input
                                value={data?.description || ""}
                                onChange={(e) => onChange('branding', 'description', e.target.value)}
                                placeholder="A brief overview of your business identity..."
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Logo URL (Dark)</Label>
                            <Input
                                value={data?.logoUrl || ""}
                                onChange={(e) => onChange('branding', 'logoUrl', e.target.value)}
                                placeholder="https://..."
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Favicon URL</Label>
                            <Input
                                value={data?.faviconUrl || ""}
                                onChange={(e) => onChange('branding', 'faviconUrl', e.target.value)}
                                placeholder="https://..."
                            />
                        </div>
                        <div className="space-y-2 md:col-span-2">
                            <Label>Brand Banner Image URL</Label>
                            <Input
                                value={data?.bannerUrl || ""}
                                onChange={(e) => onChange('branding', 'bannerUrl', e.target.value)}
                                placeholder="https://..."
                            />
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Theme Design System</CardTitle>
                    <CardDescription>Primary, secondary, and accent color definitions for UI generation.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-3">
                        <div className="space-y-2">
                            <Label>Primary Color</Label>
                            <div className="flex gap-2">
                                <Input
                                    type="color"
                                    value={primary}
                                    onChange={(e) => handleThemeChange('primaryColor', e.target.value)}
                                    className="w-12 p-1 cursor-pointer h-10"
                                />
                                <Input value={primary} readOnly className="font-mono uppercase text-xs" />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label>Secondary Color</Label>
                            <div className="flex gap-2">
                                <Input
                                    type="color"
                                    value={secondary}
                                    onChange={(e) => handleThemeChange('secondaryColor', e.target.value)}
                                    className="w-12 p-1 cursor-pointer h-10"
                                />
                                <Input value={secondary} readOnly className="font-mono uppercase text-xs" />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label>Accent Color</Label>
                            <div className="flex gap-2">
                                <Input
                                    type="color"
                                    value={data?.theme?.accentColor || "#F59E0B"}
                                    onChange={(e) => onChange('branding', 'theme', 'accentColor', e.target.value)}
                                    className="w-12 p-1 cursor-pointer h-10"
                                />
                                <Input value={data?.theme?.accentColor || "#F59E0B"} readOnly className="font-mono uppercase text-xs" />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label>Typography Font Family</Label>
                            <Select
                                value={data?.theme?.fontFamily || "Inter"}
                                onValueChange={(v) => onChange('branding', 'theme', 'fontFamily', v)}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select font" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Inter">Inter (Industrial Modern)</SelectItem>
                                    <SelectItem value="Roboto">Roboto (Clean System)</SelectItem>
                                    <SelectItem value="Outfit">Outfit (Product Slab)</SelectItem>
                                    <SelectItem value="system-ui">System Default</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
