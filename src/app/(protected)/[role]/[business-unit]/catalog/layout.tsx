
import { AppLayout } from "@/components/layouts/AppLayout"

interface CatalogLayoutProps {
    children: React.ReactNode
}

export default function CatalogLayout({
    children,
}: CatalogLayoutProps) {
    return (
        <AppLayout>
            {children}
        </AppLayout>
    )
}
