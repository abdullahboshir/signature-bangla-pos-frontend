"use client"

import { useLoadingStore } from "@/store/loadingStore"
import { CenteredLoading } from "./CenteredLoading"

/**
 * Global loading overlay component
 * Shows loading state that persists across route changes
 */
export function GlobalLoadingOverlay() {
    const { isLoading, message } = useLoadingStore()

    if (!isLoading) return null

    return <CenteredLoading fullScreen message={message} size="lg" />
}
