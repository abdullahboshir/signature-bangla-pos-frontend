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

  // User not found yet
  if (!user) {
    return {
      currentBusinessUnit: null,
      userBusinessUnits: [],
      hasUnitAccess: false,
      isLoading: false,
    };
  }

  // Get the business unit ID/slug from URL
  const currentBusinessUnitSlug = (params["business-unit"] || params.businessUnit) as string | undefined
  
  // Get user's assigned business units (now objects with id, name, _id)
  // We use the 'id' field (custom slug) for matching with URL
  const userBusinessUnits = user?.businessUnits || []
  
  // Check for Super Admin role using the correct property 'roles' (array of objects)
  // Fallback to 'role' property if 'roles' is missing (handling backend inconsistency)
  const isSuperAdmin = 
      (user?.roles && Array.isArray(user.roles) && user.roles.some((r: any) => r.name === "super-admin")) ||
      (user && (user as any).role && Array.isArray((user as any).role) && (user as any).role.includes("super-admin"));

  // Check access: does the URL slug match any of the user's assigned business unit IDs?
  // Check id, slug, name, or _id
  // OR is the user a super-admin?
  const hasUnitAccess = currentBusinessUnitSlug 
    ? (isSuperAdmin || userBusinessUnits.some((unit: any) => 
        unit.id === currentBusinessUnitSlug ||
        unit.slug === currentBusinessUnitSlug ||
        (unit.name && unit.name.toLowerCase().replace(/ /g, '-') === currentBusinessUnitSlug) ||
        (unit._id && unit._id.toString() === currentBusinessUnitSlug)
      ))
    : false

  // Find the full business unit object if it exists
  const currentBusinessUnit = currentBusinessUnitSlug 
    ? userBusinessUnits.find((unit: any) => 
        unit.id === currentBusinessUnitSlug ||
        unit.slug === currentBusinessUnitSlug ||
        (unit.name && unit.name.toLowerCase().replace(/ /g, '-') === currentBusinessUnitSlug) ||
        (unit._id && unit._id.toString() === currentBusinessUnitSlug)
      )
    : null

  return {
    currentBusinessUnit, // The full object { _id, name, id }
    userBusinessUnits,   // List of all assigned units
    hasUnitAccess,
    isLoading: false,
  }
}
