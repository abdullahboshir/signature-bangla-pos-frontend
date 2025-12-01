// src/hooks/useCurrentBusinessUnit.ts
"use client"

import { useParams } from "next/navigation"
import { useAuth } from "./useAuth"

export function useCurrentBusinessUnit() {
  const params = useParams()
  const { user, isLoading: authLoading } = useAuth()
  

  
  const currentBusinessUnit = (params["business-unit"] || params.businessUnit) as string | undefined
  const userBusinessUnits = user?.businessUnits?.map((unit: any) => unit?.name.toLowerCase()) || []
  
  const hasUnitAccess = currentBusinessUnit ? userBusinessUnits.includes(currentBusinessUnit) : false
 
  return {
    currentBusinessUnit: currentBusinessUnit || null,
    userBusinessUnits,
    hasUnitAccess,
    isLoading: authLoading || !user,
  }
}