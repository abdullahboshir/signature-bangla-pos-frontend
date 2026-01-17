"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Mail, Phone, Globe, MessageSquare, Facebook, Instagram, Twitter, Youtube, Linkedin } from "lucide-react"

interface ContactData {
    email?: string
    phone?: string
    website?: string
    supportPhone?: string
    socialMedia?: {
        facebook?: string
        instagram?: string
        twitter?: string
        youtube?: string
        linkedin?: string
    }
}

interface ContactSettingsProps {
    data: ContactData
    onChange: (section: string, ...args: any[]) => void
}

export default function ContactSettings({ data, onChange }: ContactSettingsProps) {
    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Mail className="h-5 w-5 text-blue-500" />
                        Direct Communication
                    </CardTitle>
                    <CardDescription>Primary contact methods for business and support inquiries.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Primary Email</Label>
                            <Input
                                value={data.email || ""}
                                onChange={(e) => onChange("contact", "email", e.target.value)}
                                placeholder="tenant@example.com"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Business Phone</Label>
                            <Input
                                value={data.phone || ""}
                                onChange={(e) => onChange("contact", "phone", e.target.value)}
                                placeholder="+8801700000000"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Official Website</Label>
                            <Input
                                value={data.website || ""}
                                onChange={(e) => onChange("contact", "website", e.target.value)}
                                placeholder="https://www.example.com"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Support Hotline</Label>
                            <Input
                                value={data.supportPhone || ""}
                                onChange={(e) => onChange("contact", "supportPhone", e.target.value)}
                                placeholder="+8801800000000"
                            />
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Globe className="h-5 w-5 text-indigo-500" />
                        Social Media Presense
                    </CardTitle>
                    <CardDescription>Configure links to your official social media channels.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label className="flex items-center gap-2"><Facebook className="h-4 w-4" /> Facebook</Label>
                            <Input
                                value={data.socialMedia?.facebook || ""}
                                onChange={(e) => onChange("contact", "socialMedia", "facebook", e.target.value)}
                                placeholder="https://facebook.com/yourpage"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label className="flex items-center gap-2"><Instagram className="h-4 w-4" /> Instagram</Label>
                            <Input
                                value={data.socialMedia?.instagram || ""}
                                onChange={(e) => onChange("contact", "socialMedia", "instagram", e.target.value)}
                                placeholder="https://instagram.com/yourhandle"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label className="flex items-center gap-2"><Twitter className="h-4 w-4" /> Twitter / X</Label>
                            <Input
                                value={data.socialMedia?.twitter || ""}
                                onChange={(e) => onChange("contact", "socialMedia", "twitter", e.target.value)}
                                placeholder="https://twitter.com/yourhandle"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label className="flex items-center gap-2"><Linkedin className="h-4 w-4" /> LinkedIn</Label>
                            <Input
                                value={data.socialMedia?.linkedin || ""}
                                onChange={(e) => onChange("contact", "socialMedia", "linkedin", e.target.value)}
                                placeholder="https://linkedin.com/organization/yourcompany"
                            />
                        </div>
                        <div className="space-y-2 md:col-span-2">
                            <Label className="flex items-center gap-2"><Youtube className="h-4 w-4" /> YouTube</Label>
                            <Input
                                value={data.socialMedia?.youtube || ""}
                                onChange={(e) => onChange("contact", "socialMedia", "youtube", e.target.value)}
                                placeholder="https://youtube.com/c/yourchannel"
                            />
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
