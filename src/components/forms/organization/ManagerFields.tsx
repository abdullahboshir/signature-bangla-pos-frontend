"use client";

import InputField from "@/components/forms/InputField";
import { ShieldCheck } from "lucide-react";

interface ManagerFieldsProps {
    prefix?: string; // e.g. "manager"
}

export function ManagerFields({ prefix = "manager" }: ManagerFieldsProps) {
    const getName = (name: string) => prefix ? `${prefix}.${name}` : name;

    return (
        <div className="pt-4 border-t">
            <h3 className="text-sm font-medium mb-3 flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-primary" /> Manager Details (Optional)
            </h3>
            <div className="grid gap-4 md:grid-cols-3">
                <InputField name={getName("name")} label="Manager Name" placeholder="Full Name" />
                <InputField name={getName("phone")} label="Manager Phone" placeholder="Phone" />
                <InputField name={getName("email")} label="Manager Email" type="email" placeholder="Email" />
            </div>
        </div>
    );
}
