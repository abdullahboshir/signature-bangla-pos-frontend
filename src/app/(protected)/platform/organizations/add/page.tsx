"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { Building2, Contact, Scale, Package, CheckCircle, ArrowLeft, ArrowRight } from "lucide-react"
import { LocationPicker } from "@/components/shared/LocationPicker"
import { StakeholderManager } from "@/components/shared/StakeholderManager"
import { CapitalStructure } from "@/components/shared/CapitalStructure"
import { ModuleToggles } from "@/components/shared/ModuleToggles"
import { toast } from "sonner"
import { useCreateOrganizationMutation } from "@/redux/api/platform/organizationApi"
import { Facebook, Instagram, Twitter, Youtube, Linkedin, Globe } from "lucide-react"

const BUSINESS_TYPES = [
    { value: "proprietorship", label: "Sole Proprietorship" },
    { value: "partnership", label: "Partnership" },
    { value: "private_limited", label: "Private Limited Organization" },
    { value: "public_limited", label: "Public Limited Organization" },
    { value: "ngo", label: "NGO / Non-Profit" },
    { value: "cooperative", label: "Cooperative Society" },
]

const STEPS = [
    { id: 1, title: "Basic Information", icon: Building2 },
    { id: 2, title: "Contact & Location", icon: Contact },
    { id: 3, title: "Legal & Governance", icon: Scale },
    { id: 4, title: "Module Selection", icon: Package },
    { id: 5, title: "Review & Submit", icon: CheckCircle },
]

export default function AddOrganizationPage() {
    const router = useRouter()
    const [currentStep, setCurrentStep] = useState(1)
    const [createOrganization, { isLoading: isSubmitting }] = useCreateOrganizationMutation()

    const [formData, setFormData] = useState({
        // Step 1: Basic
        name: "",
        branding: {
            name: "",
            description: "",
            logoUrl: "",
            bannerUrl: "",
            faviconUrl: "",
            tagline: "",
            theme: {
                primaryColor: "#0F172A",
                secondaryColor: "#334155",
                accentColor: "#F59E0B",
                fontFamily: "Inter"
            }
        },
        registrationNumber: "",
        businessType: "",
        establishedDate: "",
        numberOfEmployees: 0,

        // Step 2: Contact & Location
        contact: {
            email: "",
            phone: "",
            supportPhone: "",
            website: "",
            socialMedia: {
                facebook: "",
                instagram: "",
                twitter: "",
                youtube: "",
                linkedin: ""
            }
        },
        location: {
            address: "",
            city: "",
            state: "",
            postalCode: "",
            country: "BD",
            timezone: "Asia/Dhaka",
            coordinates: { lat: 23.8103, lng: 90.4125 }
        },

        // Step 3: Legal & Governance
        legalRepresentative: { name: "", designation: "", contactPhone: "", email: "", nationalId: "" },
        capital: {
            authorizedCapital: 0,
            paidUpCapital: 0,
            shareCapital: 0,
            currency: "BDT"
        },
        shareholders: [],
        directors: [],

        // Step 4: Modules
        activeModules: {
            pos: true,
            erp: true,
            hrm: false,
            ecommerce: false,
            crm: false,
            logistics: false,
            finance: false,
            marketing: false,
            integrations: false,
            governance: false,
            saas: true
        }
    })

    const updateField = (path: string, value: any) => {
        const keys = path.split(".")
        setFormData(prev => {
            const newData = { ...prev }
            let current: any = newData
            for (let i = 0; i < keys.length - 1; i++) {
                current[keys[i]] = { ...current[keys[i]] }
                current = current[keys[i]]
            }
            current[keys[keys.length - 1]] = value
            return newData
        })
    }

    const handleSubmit = async () => {
        try {
            await createOrganization(formData).unwrap();
            toast.success("Organization created successfully!")
            router.push("/platform/organizations")
        } catch (error: any) {
            toast.error(error?.data?.message || "Failed to create organization")
        }
    }

    const validateStep = () => {
        if (currentStep === 1) {
            if (!formData.branding.name) return "Organization Name is required"
            if (!formData.registrationNumber) return "Registration Number is required"
            if (!formData.businessType) return "Business Type is required"
        }
        if (currentStep === 2) {
            if (!formData.contact.email) return "Primary Email is required"
            if (!formData.contact.phone) return "Primary Phone is required"
            if (!(formData.location as any).address) return "Street Address is required"
            if (!(formData.location as any).city) return "City is required"
            if (!(formData.location as any).country) return "Country is required"
        }
        if (currentStep === 3) {
            if (!formData.legalRepresentative.name) return "Legal Representative Name is required"
            const totalShares = formData.shareholders.reduce((sum: number, s: any) => sum + (s.sharePercentage || 0), 0)
            if (formData.shareholders.length > 0 && totalShares !== 100) return "Share percentages must total 100%"
        }
        return null
    }

    const nextStep = () => {
        const error = validateStep()
        if (error) {
            toast.error(error)
            return
        }
        setCurrentStep(prev => Math.min(STEPS.length, prev + 1))
    }

    const renderStep = () => {
        switch (currentStep) {
            case 1:
                return (
                    <div className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Organization Branding</CardTitle>
                                <CardDescription>Basic organization information and branding</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="organizationName">
                                        Organization Name <span className="text-red-500">*</span>
                                    </Label>
                                    <Input
                                        id="organizationName"
                                        placeholder="Acme Corporation"
                                        value={formData.branding.name}
                                        onChange={(e) => {
                                            updateField("branding.name", e.target.value)
                                            updateField("name", e.target.value)
                                        }}
                                        required
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="registrationNumber">
                                            Registration Number <span className="text-red-500">*</span>
                                        </Label>
                                        <Input
                                            id="registrationNumber"
                                            placeholder="C-123456"
                                            value={formData.registrationNumber}
                                            onChange={(e) => updateField("registrationNumber", e.target.value)}
                                            required
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="businessType">
                                            Business Type <span className="text-red-500">*</span>
                                        </Label>
                                        <Select
                                            value={formData.businessType}
                                            onValueChange={(val) => updateField("businessType", val)}
                                            required
                                        >
                                            <SelectTrigger id="businessType">
                                                <SelectValue placeholder="Select type" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {BUSINESS_TYPES.map((type) => (
                                                    <SelectItem key={type.value} value={type.value}>
                                                        {type.label}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="establishedDate">Date of Incorporation</Label>
                                        <Input
                                            id="establishedDate"
                                            type="date"
                                            value={formData.establishedDate}
                                            onChange={(e) => updateField("establishedDate", e.target.value)}
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="numberOfEmployees">Employee Count</Label>
                                        <Input
                                            id="numberOfEmployees"
                                            type="number"
                                            min="0"
                                            placeholder="e.g. 50"
                                            value={formData.numberOfEmployees}
                                            onChange={(e) => updateField("numberOfEmployees", parseInt(e.target.value) || 0)}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="description">Business Description</Label>
                                    <Input
                                        id="description"
                                        placeholder="Brief overview of the organization's activities..."
                                        value={formData.branding.description}
                                        onChange={(e) => updateField("branding.description", e.target.value)}
                                    />
                                </div>


                                <div className="space-y-2">
                                    <Label htmlFor="tagline">Tagline</Label>
                                    <Input
                                        id="tagline"
                                        placeholder="Your trusted business partner"
                                        value={formData.branding.tagline}
                                        onChange={(e) => updateField("branding.tagline", e.target.value)}
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="logoUrl">Logo URL</Label>
                                        <Input
                                            id="logoUrl"
                                            placeholder="https://..."
                                            value={formData.branding.logoUrl}
                                            onChange={(e) => updateField("branding.logoUrl", e.target.value)}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="bannerUrl">Banner URL</Label>
                                        <Input
                                            id="bannerUrl"
                                            placeholder="https://..."
                                            value={formData.branding.bannerUrl}
                                            onChange={(e) => updateField("branding.bannerUrl", e.target.value)}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="faviconUrl">Favicon URL</Label>
                                        <Input
                                            id="faviconUrl"
                                            placeholder="https://..."
                                            value={formData.branding.faviconUrl}
                                            onChange={(e) => updateField("branding.faviconUrl", e.target.value)}
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t">
                                    <div className="space-y-2">
                                        <Label>Primary Color</Label>
                                        <div className="flex gap-2">
                                            <Input
                                                type="color"
                                                className="w-12 p-1"
                                                value={formData.branding.theme.primaryColor}
                                                onChange={(e) => updateField("branding.theme.primaryColor", e.target.value)}
                                            />
                                            <Input
                                                value={formData.branding.theme.primaryColor}
                                                onChange={(e) => updateField("branding.theme.primaryColor", e.target.value)}
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Secondary Color</Label>
                                        <div className="flex gap-2">
                                            <Input
                                                type="color"
                                                className="w-12 p-1"
                                                value={formData.branding.theme.secondaryColor}
                                                onChange={(e) => updateField("branding.theme.secondaryColor", e.target.value)}
                                            />
                                            <Input
                                                value={formData.branding.theme.secondaryColor}
                                                onChange={(e) => updateField("branding.theme.secondaryColor", e.target.value)}
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Accent Color</Label>
                                        <div className="flex gap-2">
                                            <Input
                                                type="color"
                                                className="w-12 p-1"
                                                value={formData.branding.theme.accentColor}
                                                onChange={(e) => updateField("branding.theme.accentColor", e.target.value)}
                                            />
                                            <Input
                                                value={formData.branding.theme.accentColor}
                                                onChange={(e) => updateField("branding.theme.accentColor", e.target.value)}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div >
                )

            case 2:
                return (
                    <div className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Contact Information</CardTitle>
                                <CardDescription>How to reach your organization</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="email">
                                            Primary Email <span className="text-red-500">*</span>
                                        </Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            placeholder="info@organization.com"
                                            value={formData.contact.email}
                                            onChange={(e) => updateField("contact.email", e.target.value)}
                                            required
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="phone">
                                            Primary Phone <span className="text-red-500">*</span>
                                        </Label>
                                        <Input
                                            id="phone"
                                            type="tel"
                                            placeholder="+880 1234-567890"
                                            value={formData.contact.phone}
                                            onChange={(e) => updateField("contact.phone", e.target.value)}
                                            required
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="supportPhone">Support Phone</Label>
                                        <Input
                                            id="supportPhone"
                                            type="tel"
                                            placeholder="+880 1234-567890"
                                            value={formData.contact.supportPhone}
                                            onChange={(e) => updateField("contact.supportPhone", e.target.value)}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="website">Website</Label>
                                    <Input
                                        id="website"
                                        type="url"
                                        placeholder="https://www.organization.com"
                                        value={formData.contact.website}
                                        onChange={(e) => updateField("contact.website", e.target.value)}
                                    />
                                </div>

                                <div className="pt-4 border-t space-y-4">
                                    <Label className="font-semibold block">Social Media Links</Label>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label className="flex items-center gap-2"><Facebook className="h-4 w-4 text-blue-600" /> Facebook</Label>
                                            <Input
                                                placeholder="https://facebook.com/..."
                                                value={formData.contact.socialMedia.facebook}
                                                onChange={(e) => updateField("contact.socialMedia.facebook", e.target.value)}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="flex items-center gap-2"><Instagram className="h-4 w-4 text-pink-600" /> Instagram</Label>
                                            <Input
                                                placeholder="https://instagram.com/..."
                                                value={formData.contact.socialMedia.instagram}
                                                onChange={(e) => updateField("contact.socialMedia.instagram", e.target.value)}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="flex items-center gap-2"><Twitter className="h-4 w-4 text-sky-500" /> Twitter</Label>
                                            <Input
                                                placeholder="https://twitter.com/..."
                                                value={formData.contact.socialMedia.twitter}
                                                onChange={(e) => updateField("contact.socialMedia.twitter", e.target.value)}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="flex items-center gap-2"><Linkedin className="h-4 w-4 text-blue-700" /> LinkedIn</Label>
                                            <Input
                                                placeholder="https://linkedin.com/..."
                                                value={formData.contact.socialMedia.linkedin}
                                                onChange={(e) => updateField("contact.socialMedia.linkedin", e.target.value)}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <LocationPicker
                            value={formData.location}
                            onChange={(location) => updateField("location", location)}
                            required
                        />
                    </div>
                )

            case 3:
                return (
                    <div className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Legal Representative</CardTitle>
                                <CardDescription>Primary authorized person for legal matters</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="repName">Full Name <span className="text-red-500">*</span></Label>
                                        <Input
                                            id="repName"
                                            placeholder="John Doe"
                                            value={formData.legalRepresentative.name}
                                            onChange={(e) => updateField("legalRepresentative.name", e.target.value)}
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="repDesignation">Designation</Label>
                                        <Input
                                            id="repDesignation"
                                            placeholder="CEO, Managing Director"
                                            value={formData.legalRepresentative.designation}
                                            onChange={(e) => updateField("legalRepresentative.designation", e.target.value)}
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="repPhone">Contact Phone</Label>
                                        <Input
                                            id="repPhone"
                                            placeholder="+880 1234-567890"
                                            value={formData.legalRepresentative.contactPhone}
                                            onChange={(e) => updateField("legalRepresentative.contactPhone", e.target.value)}
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="repEmail">Personal Email (Optional)</Label>
                                        <Input
                                            id="repEmail"
                                            type="email"
                                            placeholder="john.doe@email.com"
                                            value={formData.legalRepresentative.email}
                                            onChange={(e) => updateField("legalRepresentative.email", e.target.value)}
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="repNid">National ID</Label>
                                        <Input
                                            id="repNid"
                                            placeholder="1234567890"
                                            value={formData.legalRepresentative.nationalId}
                                            onChange={(e) => updateField("legalRepresentative.nationalId", e.target.value)}
                                        />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <CapitalStructure
                            value={formData.capital}
                            onChange={(capital) => updateField("capital", capital)}
                        />

                        <StakeholderManager
                            type="shareholders"
                            value={formData.shareholders}
                            onChange={(shareholders) => updateField("shareholders", shareholders)}
                        />

                        <StakeholderManager
                            type="directors"
                            value={formData.directors}
                            onChange={(directors) => updateField("directors", directors)}
                        />
                    </div>
                )

            case 4:
                return (
                    <ModuleToggles
                        value={formData.activeModules}
                        onChange={(modules) => updateField("activeModules", modules)}
                    />
                )

            case 5:
                return (
                    <Card>
                        <CardHeader>
                            <CardTitle>Review Your Information</CardTitle>
                            <CardDescription>Please verify all details before submitting</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div>
                                <h3 className="font-semibold mb-2">Organization Information</h3>
                                <dl className="grid grid-cols-2 gap-2 text-sm">
                                    <dt className="text-muted-foreground">Name:</dt>
                                    <dd className="font-medium">{formData.branding.name}</dd>
                                    <dt className="text-muted-foreground">Registration:</dt>
                                    <dd className="font-medium">{formData.registrationNumber}</dd>
                                    <dt className="text-muted-foreground">Business Type:</dt>
                                    <dd className="font-medium">{BUSINESS_TYPES.find(t => t.value === formData.businessType)?.label}</dd>
                                </dl>
                            </div>

                            <div>
                                <h3 className="font-semibold mb-2">Contact & Location</h3>
                                <dl className="grid grid-cols-2 gap-2 text-sm">
                                    <dt className="text-muted-foreground">Email:</dt>
                                    <dd className="font-medium">{formData.contact.email}</dd>
                                    <dt className="text-muted-foreground">Phone:</dt>
                                    <dd className="font-medium">{formData.contact.phone}</dd>
                                    {formData.contact.supportPhone && (
                                        <>
                                            <dt className="text-muted-foreground">Support:</dt>
                                            <dd className="font-medium">{formData.contact.supportPhone}</dd>
                                        </>
                                    )}
                                    <dt className="text-muted-foreground">City:</dt>
                                    <dd className="font-medium">{(formData.location as any).city}</dd>
                                    <dt className="text-muted-foreground">Timezone:</dt>
                                    <dd className="font-medium">{(formData.location as any).timezone}</dd>
                                </dl>
                            </div>

                            <div>
                                <h3 className="font-semibold mb-2">Stakeholders</h3>
                                <p className="text-sm text-muted-foreground">
                                    {formData.shareholders.length} Shareholders, {formData.directors.length} Directors
                                </p>
                            </div>

                            <div>
                                <h3 className="font-semibold mb-2">Legal Representative</h3>
                                <dl className="grid grid-cols-2 gap-2 text-sm">
                                    <dt className="text-muted-foreground">Name:</dt>
                                    <dd className="font-medium">{formData.legalRepresentative.name}</dd>
                                    <dt className="text-muted-foreground">Designation:</dt>
                                    <dd className="font-medium">{formData.legalRepresentative.designation}</dd>
                                    <dt className="text-muted-foreground">Phone:</dt>
                                    <dd className="font-medium">{formData.legalRepresentative.contactPhone}</dd>
                                </dl>
                            </div>

                            <div>
                                <h3 className="font-semibold mb-2">Active Modules</h3>
                                <div className="flex flex-wrap gap-2">
                                    {Object.entries(formData.activeModules).map(([key, isActive]) => {
                                        if (!isActive) return null
                                        return (
                                            <span key={key} className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-primary text-primary-foreground hover:bg-primary/80 uppercase">
                                                {key}
                                            </span>
                                        )
                                    })}
                                    {Object.values(formData.activeModules).every(v => !v) && (
                                        <span className="text-sm text-muted-foreground italic">No modules selected</span>
                                    )}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                )

            default:
                return null
        }
    }

    const progress = ((currentStep - 1) / (STEPS.length - 1)) * 100

    return (
        <div className="container max-w-5xl mx-auto py-8 space-y-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Create New Organization</h1>
                <p className="text-muted-foreground mt-2">
                    Set up a new organization in your organization structure
                </p>
            </div>

            {/* Progress Steps */}
            <div className="space-y-4">
                <Progress value={progress} className="h-2" />
                <div className="flex justify-between">
                    {STEPS.map((step) => {
                        const Icon = step.icon
                        const isActive = currentStep === step.id
                        const isCompleted = currentStep > step.id

                        return (
                            <div
                                key={step.id}
                                className={`flex flex-col items-center gap-2 ${isActive ? "text-primary" : isCompleted ? "text-green-600" : "text-muted-foreground"
                                    }`}
                            >
                                <div
                                    className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${isActive
                                        ? "border-primary bg-primary text-primary-foreground"
                                        : isCompleted
                                            ? "border-green-600 bg-green-600 text-white"
                                            : "border-muted-foreground bg-background"
                                        }`}
                                >
                                    <Icon className="h-5 w-5" />
                                </div>
                                <span className="text-xs font-medium hidden md:block">{step.title}</span>
                            </div>
                        )
                    })}
                </div>
            </div>

            {/* Step Content */}
            {renderStep()}

            {/* Navigation Buttons */}
            <div className="flex justify-between pt-6 border-t">
                <Button
                    variant="outline"
                    onClick={() => setCurrentStep(prev => Math.max(1, prev - 1))}
                    disabled={currentStep === 1}
                >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Previous
                </Button>

                {currentStep < STEPS.length ? (
                    <Button onClick={nextStep}>
                        Next
                        <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                ) : (
                    <Button onClick={handleSubmit} disabled={isSubmitting}>
                        {isSubmitting ? "Creating..." : "Create Organization"}
                    </Button>
                )}
            </div>
        </div>
    )
}
