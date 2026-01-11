"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MapPin } from "lucide-react"

interface LocationData {
    address?: string
    city?: string
    state?: string
    postalCode?: string
    country?: string
    coordinates?: {
        lat?: number
        lng?: number
    }
    timezone?: string
}

interface LocationPickerProps {
    value: LocationData
    onChange: (location: LocationData) => void
    required?: boolean
}

const COUNTRIES = [
    { code: "BD", name: "Bangladesh" },
    { code: "IN", name: "India" },
    { code: "PK", name: "Pakistan" },
    { code: "US", name: "United States" },
    { code: "GB", name: "United Kingdom" },
    { code: "CA", name: "Canada" },
    { code: "AU", name: "Australia" },
]

const TIMEZONES = [
    { value: "Asia/Dhaka", label: "Bangladesh (GMT+6)" },
    { value: "Asia/Kolkata", label: "India (GMT+5:30)" },
    { value: "Asia/Karachi", label: "Pakistan (GMT+5)" },
    { value: "UTC", label: "UTC" },
    { value: "America/New_York", label: "New York (GMT-5)" },
    { value: "Europe/London", label: "London (GMT+0)" },
]

export function LocationPicker({ value, onChange, required = false }: LocationPickerProps) {
    const handleChange = (field: any, val: string | number) => {
        if (field === 'latitude' || field === 'longitude') {
            const coordField = field === 'latitude' ? 'lat' : 'lng'
            onChange({
                ...value,
                coordinates: {
                    ...value.coordinates,
                    [coordField]: Number(val)
                }
            })
        } else {
            onChange({ ...value, [field]: val })
        }
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-blue-500" />
                    Location Details
                </CardTitle>
                <CardDescription>
                    Enter the physical address and location coordinates
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="address">
                        Street Address {required && <span className="text-red-500">*</span>}
                    </Label>
                    <Input
                        id="address"
                        placeholder="123 Main Street, Building A"
                        value={value.address || ""}
                        onChange={(e) => handleChange("address", e.target.value)}
                        required={required}
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="city">
                            City {required && <span className="text-red-500">*</span>}
                        </Label>
                        <Input
                            id="city"
                            placeholder="Dhaka"
                            value={value.city || ""}
                            onChange={(e) => handleChange("city", e.target.value)}
                            required={required}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="state">State/Province</Label>
                        <Input
                            id="state"
                            placeholder="Dhaka Division"
                            value={value.state || ""}
                            onChange={(e) => handleChange("state", e.target.value)}
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="postalCode">Postal Code</Label>
                        <Input
                            id="postalCode"
                            placeholder="1200"
                            value={value.postalCode || ""}
                            onChange={(e) => handleChange("postalCode", e.target.value)}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="country">
                            Country {required && <span className="text-red-500">*</span>}
                        </Label>
                        <Select
                            value={value.country || ""}
                            onValueChange={(val) => handleChange("country", val)}
                            required={required}
                        >
                            <SelectTrigger id="country">
                                <SelectValue placeholder="Select country" />
                            </SelectTrigger>
                            <SelectContent>
                                {COUNTRIES.map((country) => (
                                    <SelectItem key={country.code} value={country.code}>
                                        {country.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="timezone">Timezone</Label>
                    <Select
                        value={value.timezone || ""}
                        onValueChange={(val) => handleChange("timezone", val)}
                    >
                        <SelectTrigger id="timezone">
                            <SelectValue placeholder="Select timezone" />
                        </SelectTrigger>
                        <SelectContent>
                            {TIMEZONES.map((tz) => (
                                <SelectItem key={tz.value} value={tz.value}>
                                    {tz.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div className="pt-4 border-t">
                    <Label className="text-sm font-semibold mb-3 block">
                        Coordinates (Optional)
                    </Label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="latitude" className="text-xs text-muted-foreground">
                                Latitude
                            </Label>
                            <Input
                                id="latitude"
                                type="number"
                                step="0.000001"
                                placeholder="23.8103"
                                value={value.coordinates?.lat || ""}
                                onChange={(e) => handleChange("latitude", e.target.value)}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="longitude" className="text-xs text-muted-foreground">
                                Longitude
                            </Label>
                            <Input
                                id="longitude"
                                type="number"
                                step="0.000001"
                                placeholder="90.4125"
                                value={value.coordinates?.lng || ""}
                                onChange={(e) => handleChange("longitude", e.target.value)}
                            />
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
