// app/(protected)/[business-unit]/layout.tsx

import { AppLayout } from "@/components/layouts/AppLayout";

interface BusinessUnitLayoutProps {
  children: React.ReactNode;
}

export default async function RoleLayout({
  children,
}: BusinessUnitLayoutProps) {


  return (
    <AppLayout>
      {children}
    </AppLayout>
  );
}
