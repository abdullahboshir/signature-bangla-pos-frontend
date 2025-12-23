import { AppLayout } from "@/components/layouts/AppLayout"

interface InventoryLayoutProps {
    children: React.ReactNode
    params: Promise<{
        role: string
    }>
}

export default async function InventoryLayout({
    children,
    params,
}: InventoryLayoutProps) {
    const { role } = await params

    return (

        { children }
    )
}
