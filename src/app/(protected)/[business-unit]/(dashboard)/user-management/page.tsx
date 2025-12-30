// app/(protected)/[business-unit]/[role]/(dashboard)/user-management/page.tsx
"use client"
import { useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"

export default function UserManagementPage() {
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    // Redirect to business-users per default
    // We use the last part of path replacement or just append based on current logic
    // Using string replacement to ensure we stay relative
    router.replace(`${pathname}/business-users`)
  }, [pathname, router])

  return null
}
