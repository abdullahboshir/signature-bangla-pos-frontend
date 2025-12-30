"use client";
import { DataPageLayout } from "@/components/shared/DataPageLayout";
import { Card, CardContent } from "@/components/ui/card";

export default function NewOutletPage() {
    return (
        <DataPageLayout title="New Outlet" description="Register a new outlet branch.">
            <Card>
                <CardContent className="p-6 text-center text-muted-foreground">
                    Outlet Creation Form is under development.
                </CardContent>
            </Card>
        </DataPageLayout>
    );
}
