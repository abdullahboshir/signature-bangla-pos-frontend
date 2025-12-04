"use client"

import { useParams } from "next/navigation"
import { useAuth } from "./useAuth"

export function useCurrentBusinessUnit() {
  const params = useParams()
  const { user, isLoading: authLoading } = useAuth()
  // Loading state
  if (authLoading) {
    return {
      currentBusinessUnit: null,
      userBusinessUnits: [],
      hasUnitAccess: false,
      isLoading: true,
    };
  }
  console.log("cccccccccccccccc", user, authLoading)

  // User not found yet
  if (!user) {
    return {
      currentBusinessUnit: null,
      userBusinessUnits: [],
      hasUnitAccess: false,
      isLoading: true,
    };
  }

  const currentBusinessUnit = (params["business-unit"] || params.businessUnit) as string | undefined
  const userBusinessUnits = user?.businessUnits?.map((unit: any) => unit?.name.toLowerCase()) || []

  const hasUnitAccess = currentBusinessUnit ? userBusinessUnits.includes(currentBusinessUnit.toLowerCase()) : false

  console.log("currentBusinessUnit", currentBusinessUnit)
  console.log("userBusinessUnits", userBusinessUnits)
  console.log("hasUnitAccess", hasUnitAccess)



  return {
    currentBusinessUnit: currentBusinessUnit || null,
    userBusinessUnits,
    hasUnitAccess,
    isLoading: false, // finally loaded
  }
}
