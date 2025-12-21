// app/(protected)/[business-unit]/layout.tsx

import { AppLayout } from "@/components/layouts/AppLayout";
import ProtectedLayout from "../layout";

interface BusinessUnitLayoutProps {
  children: React.ReactNode;
  params: Promise<{
    role: string;
  }>;
}

export default async function BusinessUnitLayout({
  children,
  params,
}: BusinessUnitLayoutProps) {




  return (
    <>
      {children}
    </>
  );
}
