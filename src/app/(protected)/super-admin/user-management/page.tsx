"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";

export default function UserManagementPage() {
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        router.replace(`${pathname}/all-users`);
    }, [pathname, router]);

    return null;
}
