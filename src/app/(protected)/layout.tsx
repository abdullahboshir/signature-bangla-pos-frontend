"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { UserMenu } from "@/components/layouts/header/UserMenu";

interface ProtectedLayoutProps {
  children: React.ReactNode;
}

export default function ProtectedLayout({ children }: ProtectedLayoutProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, isLoading: authLoading } = useAuth();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Defensive check: If we are on an auth URL, render children directly
  if (pathname.startsWith("/auth") || pathname.startsWith("/home")) {
    return <>{children}</>;
  }

  // Handle loading state
  if (!mounted || authLoading) {
    return <LoadingSpinner />;
  }

  // If not authenticated, the AuthProvider/useAuth should handle redirect, 
  // but we can return null here to avoid flashing content or errors.
  if (!user) {
    return null;
  }

  // Map user data to the format expected by UserMenu
  const userData = {
    fullName: user.name || "User",
    profileImg: user.avatar,
    designation: "Staff", // Placeholder as it's not in the User interface
    role: user.roles?.[0] || "staff",
    businessUnit: user.businessUnits?.map((bu: any) => bu.name || bu.slug || bu) || []
  };

  return (
    <div className="min-h-screen bg-background">
      {children}
    </div>
  );
}
