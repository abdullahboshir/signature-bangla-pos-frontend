// lib/auth/token-manager.ts
"use client"

import { decodedToken } from "@/utils/jwt"
import { authKey } from "@/constant/authKey"

/**
 * Get token from cookies (client-side)
 */
export function getToken(): string | null {
  if (typeof document === "undefined") {
    return null
  }

  const cookies = document.cookie.split(";")
  const tokenCookie = cookies.find((cookie) => cookie.trim().startsWith(`${authKey}=`))
  
  if (!tokenCookie) {
    return null
  }

  return tokenCookie.split("=")[1]?.trim() || null
}

/**
 * Remove token from cookies (client-side)
 */
export function removeToken(): void {
  if (typeof document === "undefined") {
    return
  }

  document.cookie = `${authKey}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`
}

/**
 * Verify if the current token is valid
 */
export async function verifyToken(): Promise<boolean> {
  try {
    const token = getToken();

    if (!token) {
      return false
    }

    const decoded = decodedToken(token) as { exp?: number }
    
    if (!decoded) {
      return false
    }

    // Check if token is expired
    if (decoded.exp && decoded.exp * 1000 < Date.now()) {
      removeToken()
      return false
    }

    return true
  } catch (error) {
    console.error("Token verification failed:", error)
    return false
  }
}

/**
 * Get token expiration time
 */
export function getTokenExpiration(): Date | null {
  try {
    const token = getToken();
    
    if (!token) {
      return null
    }

    const decoded = decodedToken(token) as { exp?: number }
    
    if (!decoded || !decoded.exp) {
      return null
    }

    return new Date(decoded.exp * 1000)
  } catch (error) {
    console.error("Failed to get token expiration:", error)
    return null
  }
}

