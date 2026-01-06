"use client"

import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState, useEffect } from "react"
import { useUpdateIntegrationMutation } from "@/redux/api/platform/integrationApi"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"

interface IntegrationDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    integration: any
}

export function IntegrationDialog({ open, onOpenChange, integration }: IntegrationDialogProps) {
    const [apiKey, setApiKey] = useState("")
    const [apiSecret, setApiSecret] = useState("")
    const [baseUrl, setBaseUrl] = useState("")

    const [updateIntegration, { isLoading }] = useUpdateIntegrationMutation()

    useEffect(() => {
        if (integration) {
            setApiKey(integration.credentials?.apiKey || "")
            setApiSecret(integration.credentials?.apiSecret || "")
            setBaseUrl(integration.baseUrl || "")
        }
    }, [integration])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            await updateIntegration({
                id: integration._id,
                body: {
                    credentials: {
                        apiKey,
                        apiSecret
                    },
                    baseUrl
                }
            }).unwrap()
            toast.success("Configuration saved")
            onOpenChange(false)
        } catch (error) {
            toast.error("Failed to save configuration")
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Configure {integration?.provider}</DialogTitle>
                    <DialogDescription>
                        Enter the API credentials for {integration?.provider}.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="apiKey" className="text-right">
                            API Key
                        </Label>
                        <Input
                            id="apiKey"
                            value={apiKey}
                            onChange={(e) => setApiKey(e.target.value)}
                            className="col-span-3"
                            type="password"
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="apiSecret" className="text-right">
                            Secret
                        </Label>
                        <Input
                            id="apiSecret"
                            value={apiSecret}
                            onChange={(e) => setApiSecret(e.target.value)}
                            className="col-span-3"
                            type="password"
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="baseUrl" className="text-right">
                            Base URL
                        </Label>
                        <Input
                            id="baseUrl"
                            value={baseUrl}
                            onChange={(e) => setBaseUrl(e.target.value)}
                            className="col-span-3"
                            placeholder="https://api.example.com"
                        />
                    </div>
                    <DialogFooter>
                        <Button type="submit" disabled={isLoading}>
                            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Save Changes
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
