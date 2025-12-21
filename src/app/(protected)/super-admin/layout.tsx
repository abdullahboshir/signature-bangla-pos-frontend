import { AppLayout } from "@/components/layouts/AppLayout";
import { SuperAdminGuard } from "@/components/auth/SuperAdminGuard";

export default function SuperAdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <SuperAdminGuard>
            <AppLayout>{children}</AppLayout>
        </SuperAdminGuard>
    );
}
