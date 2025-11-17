// app/(protected)/[business-unit]/layout.tsx

import { AppLayout } from "@/components/layouts/AppLayout"

interface BusinessUnitLayoutProps {
  children: React.ReactNode
  params: Promise<{
    "business-unit": string
  }>
}

export default async function BusinessUnitLayout({ 
  children, 
  params 
}: BusinessUnitLayoutProps) {
  const { "business-unit": businessUnit } = await params
  
  return <AppLayout>{children}</AppLayout>
}