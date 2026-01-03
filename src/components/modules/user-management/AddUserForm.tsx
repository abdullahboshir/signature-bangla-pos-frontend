"use client";

import { useState, useMemo } from "react";
import { useRouter, useParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { usePermissions } from "@/hooks/usePermissions";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { toast } from "sonner";
import { useCreateUserMutation } from "@/redux/api/iam/userApi";
import { useGetRolesQuery } from "@/redux/api/iam/roleApi";
import { useGetBusinessUnitsQuery } from "@/redux/api/organization/businessUnitApi";
import { useAuth } from "@/hooks/useAuth";
import { useCurrentBusinessUnit } from "@/hooks/useCurrentBusinessUnit";
import { DataPageLayout } from "@/components/shared/DataPageLayout";

const userFormSchema = z.object({
    firstName: z.string().min(2, "First name is required"),
    lastName: z.string().optional(),
    email: z.string().email("Invalid email address"),
    phone: z.string().optional(),
    password: z.string().optional(),
    role: z.string().min(1, "Role is required"),
    businessUnit: z.string().optional(),
    status: z.string(), // Removed .default("active") to align types, use defaultValues instead
});

interface AddUserFormProps {
    isPlatformUser?: boolean;
}

export default function AddUserForm({ isPlatformUser = false }: AddUserFormProps) {
    const router = useRouter();
    const params = useParams();
    const { user: currentUser } = useAuth();
    const { currentBusinessUnit } = useCurrentBusinessUnit();
    const { isSuperAdmin } = usePermissions();

    const [createUser, { isLoading }] = useCreateUserMutation();
    const { data: rawRoles = [] } = useGetRolesQuery({});
    const { data: rawBusinessUnits = [] } = useGetBusinessUnitsQuery(undefined, { skip: !isSuperAdmin });

    // Normalize Data
    // Normalize Data
    const rawRolesArray = Array.isArray(rawRoles) ? rawRoles : [];

    // Filter Roles based on Context
    const availableRoles = useMemo(() => {
        return rawRolesArray.filter((role: any) => {
            if (isPlatformUser) {
                // Platform Context: Only Global Roles
                return role.roleScope === 'GLOBAL';
            } else {
                // Business Context: Only Business/Outlet Roles (Not Global)
                return role.roleScope !== 'GLOBAL';
            }
        });
    }, [rawRolesArray, isPlatformUser]);
    const availableBusinessUnits = Array.isArray(rawBusinessUnits) ? rawBusinessUnits : [];
    console.log("availableRoles", rawRoles);
    console.log("availableBusinessUnits", availableBusinessUnits);
    const form = useForm({
        resolver: zodResolver(userFormSchema),
        defaultValues: {
            firstName: "",
            lastName: "",
            email: "",
            phone: "",
            password: "",
            role: "",
            businessUnit: "",
            status: "active",
        },
    });

    const onSubmit = async (values: z.infer<typeof userFormSchema>) => {
        try {
            const businessUnitId = isSuperAdmin
                ? values.businessUnit
                : (currentBusinessUnit?.id || params["business-unit"]);

            const createPayload = {
                firstName: values.firstName,
                lastName: values.lastName,
                name: { firstName: values.firstName, lastName: values.lastName },
                email: values.email,
                phone: values.phone,
                password: values.password || "123456",
                roles: [values.role],
                businessUnits: businessUnitId ? [businessUnitId] : [], // For User Model
                businessUnit: businessUnitId, // For Staff Model
                status: values.status
            };

            await createUser(createPayload).unwrap();
            toast.success("User created successfully");
            router.back();
        } catch (err: any) {
            console.error("Failed to create user", err);

            // Handle Validation Errors from Backend
            if (err?.data?.errorSources) {
                err.data.errorSources.forEach((source: any) => {
                    form.setError(source.path, {
                        type: "manual",
                        message: source.message,
                    });
                });
                toast.error("Please fix the validation errors");
            } else {
                toast.error(err?.data?.message || err?.message || "Failed to create user");
            }
        }
    };

    return (
        <DataPageLayout
            title="Add New User"
            description="Create a new user account with specific roles and permissions."
            action={<Button variant="outline" onClick={() => router.back()}>Back</Button>}
        >
            <Card className="max-w-2xl mx-auto">
                <CardHeader>
                    <CardTitle>User Details</CardTitle>
                    <CardDescription>Enter the basic information for the new user.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                            <div className="grid grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="firstName"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>First Name</FormLabel>
                                            <FormControl>
                                                <Input placeholder="John" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="lastName"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Last Name</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Doe" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Email</FormLabel>
                                        <FormControl>
                                            <Input type="email" placeholder="john.doe@example.com" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="phone"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Phone</FormLabel>
                                        <FormControl>
                                            <Input placeholder="+8801..." {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="password"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Password (Optional)</FormLabel>
                                        <FormControl>
                                            <Input type="password" placeholder="Leave empty for default (123456)" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <div className="grid grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="role"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Role</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select a role" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {availableRoles.map((role: any) => (
                                                        <SelectItem key={role._id} value={role._id}>
                                                            {role.name}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="status"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Status</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select status" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectItem value="active">Active</SelectItem>
                                                    <SelectItem value="inactive">Inactive</SelectItem>
                                                    <SelectItem value="suspended">Suspended</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            {/* Business Unit Selection for Super Admin (Hidden for Platform Users) */}
                            {(isSuperAdmin && !isPlatformUser) && (
                                <FormField
                                    control={form.control}
                                    name="businessUnit"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Business Unit</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Assign to Business Unit (Optional)" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {availableBusinessUnits.map((bu: any) => (
                                                        <SelectItem key={bu.id} value={bu.id}>
                                                            {bu.name}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            )}

                            <div className="flex justify-end gap-2 pt-4">
                                <Button type="button" variant="outline" onClick={() => router.back()}>Cancel</Button>
                                <Button type="submit" disabled={isLoading}>
                                    {isLoading ? "Creating..." : "Create User"}
                                </Button>
                            </div>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </DataPageLayout>
    );
}

