// app/(protected)/[business-unit]/[role]/(dashboard)/layout.tsx
import { AppLayout } from "@/components/layouts/AppLayout"

interface DashboardLayoutProps {
  children: React.ReactNode
  params: Promise<{
    "business-unit": string
    roles: string
  }>
}

export default async function DashboardLayout({
  children,
  params,
}: DashboardLayoutProps) {
  const { "business-unit": businessUnit, roles } = await params
  
  return <div>{children}</div>
}


