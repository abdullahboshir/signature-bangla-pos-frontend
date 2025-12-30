"use client";
import { DataPageLayout } from "@/components/shared/DataPageLayout";
import { Card, CardContent } from "@/components/ui/card";

export default function NewBusinessUnitPage() {
    return (
        <DataPageLayout title="New Business Unit" description="Create a new business unit structure.">
            <Card>
                <CardContent className="p-6 text-center text-muted-foreground">
                    Business Unit Creation Wizard is under development.
                </CardContent>
            </Card>
        </DataPageLayout>
    );
}
