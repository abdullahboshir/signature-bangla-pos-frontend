"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { useLoadingStore } from "@/store/loadingStore";

/**
 * Component to clear global loading on route changes
 * Place this in layouts to auto-clear loading when page loads
 */
export function LoadingClearer() {
    const pathname = usePathname();
    const { setLoading } = useLoadingStore();

    useEffect(() => {
        // Clear global loading when route changes
        setLoading(false);
    }, [pathname, setLoading]);

    return null;
}
