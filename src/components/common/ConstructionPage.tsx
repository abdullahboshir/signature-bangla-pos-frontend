"use client";

import { Construction } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

interface ConstructionPageProps {
    title: string;
    message?: string;
}

export default function ConstructionPage({ title, message }: ConstructionPageProps) {
    const router = useRouter();

    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-4">
            <div className="bg-muted p-6 rounded-full mb-6">
                <Construction className="h-12 w-12 text-muted-foreground" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight mb-2">{title}</h1>
            <p className="text-muted-foreground max-w-md mb-8">
                {message || "This module is currently under development. Please check back later."}
            </p>
            <Button variant="outline" onClick={() => router.back()}>
                Go Back
            </Button>
        </div>
    );
}
