// app/(protected)/[business-unit]/[role]/(dashboard)/settings/page.tsx
"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Settings, User, Bell, Shield, Store, Palette } from "lucide-react"
import { useParams } from "next/navigation"
import { useState } from "react"
import { useThemeSettings } from "@/lib/providers/ThemeSettingsProvider"

export default function SettingsPage() {
  const params = useParams()
  const businessUnit = params["business-unit"] as string
  const role = params.role as string
  const { theme, isLoading: themeLoading, isSaving, updateTheme } = useThemeSettings()

  const [primary, setPrimary] = useState(theme.primary || "")
  const [secondary, setSecondary] = useState(theme.secondary || "")
  const [radius, setRadius] = useState(theme.radius ?? 10)
  const [fontScale, setFontScale] = useState(theme.fontScale ?? 1)

  const handleThemeSave = async () => {
    await updateTheme({
      primary,
      secondary,
      radius,
      fontScale,
    })
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">
          Manage your account settings and preferences
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Profile Settings */}
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-2">
              <User className="h-5 w-5" />
              <CardTitle>Profile Settings</CardTitle>
            </div>
            <CardDescription>Update your profile information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" placeholder="John Doe" defaultValue="John Doe" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="john@example.com" defaultValue="john@example.com" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input id="phone" type="tel" placeholder="+880 1234 567890" />
            </div>
            <Button className="w-full">Save Changes</Button>
          </CardContent>
        </Card>

        {/* Business Unit Settings */}
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-2">
              <Store className="h-5 w-5" />
              <CardTitle>Business Unit</CardTitle>
            </div>
            <CardDescription>Manage business unit settings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="businessName">Business Name</Label>
              <Input 
                id="businessName" 
                placeholder="Business Name" 
                defaultValue={businessUnit ? businessUnit.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase()) : ''} 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Input id="address" placeholder="Business Address" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="timezone">Timezone</Label>
              <Input id="timezone" placeholder="UTC+6" defaultValue="UTC+6" />
            </div>
            <Button className="w-full">Update Business Unit</Button>
          </CardContent>
        </Card>

        {/* Notification Settings */}
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-2">
              <Bell className="h-5 w-5" />
              <CardTitle>Notifications</CardTitle>
            </div>
            <CardDescription>Configure your notification preferences</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Email Notifications</Label>
                <p className="text-sm text-muted-foreground">Receive email updates</p>
              </div>
              <Button variant="outline" size="sm">Enable</Button>
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Low Stock Alerts</Label>
                <p className="text-sm text-muted-foreground">Get notified about low stock</p>
              </div>
              <Button variant="outline" size="sm">Enable</Button>
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Order Notifications</Label>
                <p className="text-sm text-muted-foreground">Notify on new orders</p>
              </div>
              <Button variant="outline" size="sm">Enable</Button>
            </div>
          </CardContent>
        </Card>

        {/* Security Settings */}
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-2">
              <Shield className="h-5 w-5" />
              <CardTitle>Security</CardTitle>
            </div>
            <CardDescription>Manage your account security</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="currentPassword">Current Password</Label>
              <Input id="currentPassword" type="password" placeholder="••••••••" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="newPassword">New Password</Label>
              <Input id="newPassword" type="password" placeholder="••••••••" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm New Password</Label>
              <Input id="confirmPassword" type="password" placeholder="••••••••" />
            </div>
            <Button className="w-full">Update Password</Button>
          </CardContent>
        </Card>
      </div>

      {/* System / Theme settings - only super-admin can see */}
      {role === "super-admin" && (
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-2">
              <Palette className="h-5 w-5" />
              <CardTitle>Appearance & Theme</CardTitle>
            </div>
            <CardDescription>
              Configure global colors and typography for your POS dashboard
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="primaryColor">Primary color (oklch or CSS color)</Label>
                <Input
                  id="primaryColor"
                  placeholder="e.g. oklch(0.205 0 0) or #111827"
                  value={primary}
                  onChange={(e) => setPrimary(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="secondaryColor">Secondary color</Label>
                <Input
                  id="secondaryColor"
                  placeholder="e.g. oklch(0.97 0 0)"
                  value={secondary}
                  onChange={(e) => setSecondary(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="radius">Corner radius (px)</Label>
                <Input
                  id="radius"
                  type="number"
                  min={0}
                  max={24}
                  value={radius}
                  onChange={(e) => setRadius(Number(e.target.value) || 0)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="fontScale">Text size (scale)</Label>
                <Input
                  id="fontScale"
                  type="number"
                  step={0.05}
                  min={0.8}
                  max={1.4}
                  value={fontScale}
                  onChange={(e) => setFontScale(Number(e.target.value) || 1)}
                />
                <p className="text-xs text-muted-foreground">
                  1 = default, 0.9 = smaller, 1.1 = slightly larger
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <p className="text-xs text-muted-foreground">
                Changes apply immediately and are saved with your account settings.
              </p>
              <Button
                onClick={handleThemeSave}
                disabled={themeLoading || isSaving}
              >
                {isSaving ? "Saving..." : "Save Theme"}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Role-specific settings */}
      {role === "super-admin" && (
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-2">
              <Settings className="h-5 w-5" />
              <CardTitle>System Settings</CardTitle>
            </div>
            <CardDescription>Advanced system configuration</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Maintenance Mode</Label>
                <p className="text-sm text-muted-foreground">Enable maintenance mode</p>
              </div>
              <Button variant="outline" size="sm">Disabled</Button>
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>API Access</Label>
                <p className="text-sm text-muted-foreground">Manage API keys</p>
              </div>
              <Button variant="outline" size="sm">Manage</Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

