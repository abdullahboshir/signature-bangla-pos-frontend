// app/(protected)/[business-unit]/[role]/(dashboard)/settings/page.tsx
"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Settings, User, Bell, Shield, Store, Palette } from "lucide-react"
import { useParams } from "next/navigation"
import { useState, useEffect } from "react"
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
  const [buttonScale, setButtonScale] = useState(theme.buttonScale ?? 1)
  const [tableRowHeight, setTableRowHeight] = useState(theme.tableRowHeight ?? 56) // State for row height

  useEffect(() => {
    if (!themeLoading) {
      setPrimary(theme.primary || "")
      setSecondary(theme.secondary || "")
      setRadius(theme.radius ?? 10)
      setFontScale(theme.fontScale ?? 1)
      setButtonScale(theme.buttonScale ?? 1)
      setTableRowHeight(theme.tableRowHeight ?? 56)
    }
  }, [theme, themeLoading])

  const handleThemeSave = async (overrides?: Partial<typeof theme>) => {
    await updateTheme({
      primary: overrides?.primary ?? primary,
      secondary: overrides?.secondary ?? secondary,
      radius: overrides?.radius ?? radius,
      fontScale: overrides?.fontScale ?? fontScale,
      buttonScale: overrides?.buttonScale ?? buttonScale,
      tableRowHeight: overrides?.tableRowHeight ?? tableRowHeight,
    })
  }

  const handleReset = async () => {
    setPrimary("")
    setSecondary("")
    setRadius(10)
    setFontScale(1)
    setButtonScale(1)
    setTableRowHeight(56)

    await handleThemeSave({
      primary: "",
      secondary: "",
      radius: 10,
      fontScale: 1,
      buttonScale: 1,
      tableRowHeight: 56,
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
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Color Palette</Label>
                <div className="flex flex-wrap gap-2">
                  {[
                    { name: "Default", primary: "", secondary: "" },
                    { name: "Blue", primary: "oklch(0.623 0.214 259.815)", secondary: "oklch(0.96 0.01 260)" },
                    { name: "Green", primary: "oklch(0.627 0.194 149.214)", secondary: "oklch(0.96 0.01 150)" },
                    { name: "Red", primary: "oklch(0.637 0.237 25.331)", secondary: "oklch(0.96 0.01 25)" },
                    { name: "Orange", primary: "oklch(0.705 0.213 47.604)", secondary: "oklch(0.96 0.01 48)" },
                    { name: "Purple", primary: "oklch(0.558 0.288 302.321)", secondary: "oklch(0.96 0.01 300)" },
                  ].map((color) => (
                    <button
                      key={color.name}
                      className={`h-8 w-8 rounded-full border-2 ${primary === color.primary ? "border-primary" : "border-transparent"
                        }`}
                      style={{ backgroundColor: color.primary || "oklch(0.205 0 0)" }}
                      onClick={() => {
                        setPrimary(color.primary)
                        setSecondary(color.secondary)
                      }}
                      title={color.name}
                    />
                  ))}
                </div>
              </div>

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
              </div>
            </div>

            <Separator />

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="radius">Corner radius (px)</Label>
                <div className="flex items-center gap-4">
                  <Input
                    id="radius"
                    type="number"
                    min={0}
                    max={24}
                    value={radius}
                    onChange={(e) => setRadius(Number(e.target.value) || 0)}
                    className="w-24"
                  />
                  <div className="flex-1">
                    <input
                      type="range"
                      min="0"
                      max="24"
                      value={radius}
                      onChange={(e) => setRadius(Number(e.target.value))}
                      className="w-full accent-primary"
                    />
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="fontScale">Text size (scale)</Label>
                <div className="flex items-center gap-4">
                  <Input
                    id="fontScale"
                    type="number"
                    step={0.05}
                    min={0.8}
                    max={1.4}
                    value={fontScale}
                    onChange={(e) => setFontScale(Number(e.target.value) || 1)}
                    className="w-24"
                  />
                  <div className="flex-1">
                    <input
                      type="range"
                      min="0.8"
                      max="1.4"
                      step="0.05"
                      value={fontScale}
                      onChange={(e) => setFontScale(Number(e.target.value))}
                      className="w-full accent-primary"
                    />
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="buttonScale">Button Size (scale)</Label>
                <div className="flex items-center gap-4">
                  <Input
                    id="buttonScale"
                    type="number"
                    step={0.05}
                    min={0.8}
                    max={1.5}
                    value={buttonScale}
                    onChange={(e) => setButtonScale(Number(e.target.value) || 1)}
                    className="w-24"
                  />
                  <div className="flex-1">
                    <input
                      type="range"
                      min="0.8"
                      max="1.5"
                      step="0.05"
                      value={buttonScale}
                      onChange={(e) => setButtonScale(Number(e.target.value))}
                      className="w-full accent-primary"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="tableRowHeight">Table Row Height (px)</Label>
                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-2">
                    <Button
                      variant={tableRowHeight === 40 ? "default" : "outline"}
                      size="sm"
                      onClick={() => setTableRowHeight(40)}
                    >
                      Compact
                    </Button>
                    <Button
                      variant={tableRowHeight === 56 ? "default" : "outline"}
                      size="sm"
                      onClick={() => setTableRowHeight(56)}
                    >
                      Comfortable
                    </Button>
                    <Button
                      variant={tableRowHeight === 72 ? "default" : "outline"}
                      size="sm"
                      onClick={() => setTableRowHeight(72)}
                    >
                      Spacious
                    </Button>
                  </div>
                  <div className="flex items-center gap-4">
                    <Input
                      id="tableRowHeight"
                      type="number"
                      min={30}
                      max={100}
                      value={tableRowHeight}
                      onChange={(e) => setTableRowHeight(Number(e.target.value) || 56)}
                      className="w-24"
                    />
                    <div className="flex-1">
                      <input
                        type="range"
                        min="30"
                        max="100"
                        value={tableRowHeight}
                        onChange={(e) => setTableRowHeight(Number(e.target.value))}
                        className="w-full accent-primary"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <p className="text-xs text-muted-foreground">
                Changes apply immediately and are saved with your account settings.
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={handleReset}
                  disabled={themeLoading || isSaving}
                >
                  Reset Defaults
                </Button>
                <Button
                  onClick={() => handleThemeSave()}
                  disabled={themeLoading || isSaving}
                >
                  {isSaving ? "Saving..." : "Save Theme"}
                </Button>
              </div>
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

