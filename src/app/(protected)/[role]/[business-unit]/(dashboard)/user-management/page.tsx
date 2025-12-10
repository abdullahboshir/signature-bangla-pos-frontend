// app/(protected)/[business-unit]/[role]/(dashboard)/user-management/page.tsx
"use client"
import { useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"

export default function UserManagementPage() {
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    // Redirect to all-users per default
    router.replace(`${pathname}/all-users`)
  }, [pathname, router])

  return null
}
