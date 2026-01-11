"use client";

import InputField from "@/components/forms/InputField";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Contact, Share2 } from "lucide-react";

interface ContactFieldsProps {
    prefix?: string; // e.g. "contact"
}

export function ContactFields({ prefix = "" }: ContactFieldsProps) {
    const getName = (name: string) => prefix ? `${prefix}.${name}` : name;

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><Contact className="h-5 w-5" /> Contact Channels</CardTitle>
                <CardDescription>How customers and teams reach this entity.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2">
                    <InputField
                        name={getName("email")}
                        label="Business Email"
                        type="email"
                        placeholder="contact@example.com"
                        required
                    />
                    <InputField
                        name={getName("phone")}
                        label="Business Phone"
                        placeholder="+880..."
                        required
                    />
                    <InputField
                        name={getName("supportPhone")}
                        label="Support Phone"
                        placeholder="Optional"
                    />
                    <InputField
                        name={getName("website")}
                        label="Official Website"
                        placeholder="https://..."
                    />
                </div>

                <div className="pt-6 border-t">
                    <h3 className="text-sm font-medium mb-4 flex items-center gap-2"><Share2 className="h-4 w-4 text-primary" /> Social Media Presence</h3>
                    <div className="grid gap-4 md:grid-cols-3">
                        <InputField name={getName("socialMedia.facebook")} label="Facebook" placeholder="https://..." />
                        <InputField name={getName("socialMedia.instagram")} label="Instagram" placeholder="https://..." />
                        <InputField name={getName("socialMedia.linkedin")} label="LinkedIn" placeholder="https://..." />
                        <InputField name={getName("socialMedia.twitter")} label="Twitter (X)" placeholder="https://..." />
                        <InputField name={getName("socialMedia.youtube")} label="YouTube" placeholder="https://..." />
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
