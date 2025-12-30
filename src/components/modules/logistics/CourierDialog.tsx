"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { useCreateCourierMutation, useUpdateCourierMutation } from "@/redux/api/logistics/logisticsApi"
import { toast } from "sonner"
import { Eye, EyeOff } from "lucide-react"

const courierSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    providerId: z.string().min(2, "Provider ID is required"),
    apiKey: z.string().optional(),
    apiSecret: z.string().optional(),
    baseUrl: z.string().optional(),
    isActive: z.boolean(),
})

type CourierFormValues = z.infer<typeof courierSchema>

interface CourierDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    courier?: any
}

export function CourierDialog({ open, onOpenChange, courier }: CourierDialogProps) {
    const [showKey, setShowKey] = useState(false)
    const [showSecret, setShowSecret] = useState(false)
    const [createCourier, { isLoading: isCreating }] = useCreateCourierMutation()
    const [updateCourier, { isLoading: isUpdating }] = useUpdateCourierMutation()

    const form = useForm<CourierFormValues>({
        resolver: zodResolver(courierSchema),
        defaultValues: {
            name: "",
            providerId: "",
            apiKey: "",
            apiSecret: "",
            baseUrl: "",
            isActive: true, // This is now strictly boolean
        },
    })

    useEffect(() => {
        if (courier) {
            form.reset({
                name: courier.name,
                providerId: courier.providerId,
                apiKey: "", // Don't show existing keys for security, let them overwrite
                apiSecret: "",
                baseUrl: courier.baseUrl || "",
                isActive: courier.isActive,
            })
        } else {
            form.reset({
                name: "",
                providerId: "",
                apiKey: "",
                apiSecret: "",
                baseUrl: "",
                isActive: true,
            })
        }
    }, [courier, form, open])

    async function onSubmit(data: CourierFormValues) {
        try {
            if (courier) {
                // Update
                const payload: any = { ...data };
                // Only send keys if they are provided (to avoid overwriting with empty strings)
                if (!payload.apiKey) delete payload.apiKey;
                if (!payload.apiSecret) delete payload.apiSecret;

                await updateCourier({ id: courier._id, data: payload }).unwrap()
                toast.success("Courier updated successfully")
            } else {
                // Create
                await createCourier(data).unwrap()
                toast.success("Courier created successfully")
            }
            onOpenChange(false)
        } catch (error: any) {
            toast.error(error?.data?.message || "Something went wrong")
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>{courier ? "Edit Courier" : "Add New Courier"}</DialogTitle>
                    <DialogDescription>
                        Configure your courier partner integration details here.
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Courier Name</FormLabel>
                                        <FormControl>
                                            <Input placeholder="e.g. Steadfast" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="providerId"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Provider Config ID</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select Provider" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="steadfast">Steadfast</SelectItem>
                                                <SelectItem value="pathao">Pathao</SelectItem>
                                                <SelectItem value="redx">RedX</SelectItem>
                                                <SelectItem value="paperfly">Paperfly</SelectItem>
                                                <SelectItem value="other">Other</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormDescription className="text-xs">
                                            Used for API logic mapping
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <FormField
                            control={form.control}
                            name="baseUrl"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Base URL <span className="text-xs text-muted-foreground">(Optional)</span></FormLabel>
                                    <FormControl>
                                        <Input placeholder="https://portal.steadfast.com.bd/api/v1" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="grid grid-cols-1 gap-4">
                            <FormField
                                control={form.control}
                                name="apiKey"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>API Key</FormLabel>
                                        <div className="relative">
                                            <FormControl>
                                                <Input type={showKey ? "text" : "password"} placeholder={courier ? "Leave blank to keep unchanged" : "Enter API Key"} {...field} />
                                            </FormControl>
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="sm"
                                                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                                onClick={() => setShowKey(!showKey)}
                                            >
                                                {showKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                            </Button>
                                        </div>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="apiSecret"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>API Secret</FormLabel>
                                        <div className="relative">
                                            <FormControl>
                                                <Input type={showSecret ? "text" : "password"} placeholder={courier ? "Leave blank to keep unchanged" : "Enter Secret Key"} {...field} />
                                            </FormControl>
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="sm"
                                                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                                onClick={() => setShowSecret(!showSecret)}
                                            >
                                                {showSecret ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                            </Button>
                                        </div>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <FormField
                            control={form.control}
                            name="isActive"
                            render={({ field }) => (
                                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                    <div className="space-y-0.5">
                                        <FormLabel className="text-base">Active Status</FormLabel>
                                        <DialogDescription>
                                            Enable or disable this courier integration.
                                        </DialogDescription>
                                    </div>
                                    <FormControl>
                                        <Switch
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        />

                        <DialogFooter>
                            <Button type="submit" disabled={isCreating || isUpdating}>
                                {isCreating || isUpdating ? "Saving..." : "Save Configuration"}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}

