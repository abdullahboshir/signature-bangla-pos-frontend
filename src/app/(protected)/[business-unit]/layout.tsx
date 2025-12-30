import { AppLayout } from "@/components/layouts/AppLayout"

interface DashboardLayoutProps {
    children: React.ReactNode
    params: Promise<{
        "business-unit": string
    }>
}

export default async function DashboardLayout({
    children,
    params,
}: DashboardLayoutProps) {
    const { "business-unit": businessUnit } = await params

    return (
        <AppLayout>
            {children}
        </AppLayout>
    )
}
