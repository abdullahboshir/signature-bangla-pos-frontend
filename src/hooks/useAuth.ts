// src/hooks/useAuth.ts
"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { decodedToken } from "@/utils/jwt"
import { getFromLocalStorage, removeFromLocalStorage } from "@/utils/localStorage"

export interface User {
  id: string
  name: string
  email: string
  role: string
  avatar?: string
  accessibleBusinessUnits?: string[]
  permissions?: string[]
}

interface UseAuthReturn {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  logout: () => Promise<void>
  login: (token: string, userData?: User) => void
}

export function useAuth(): UseAuthReturn {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const initializeAuth = () => {
      try {
        // Check if we're in browser environment
        if (typeof window === "undefined") {
          setIsLoading(false)
          return
        }

        const token = getFromLocalStorage()
        
        if (!token) {
          setIsLoading(false)
          return
        }

        // Decode token to get user info
        const decoded = decodedToken(token) as {
          id?: string
          userId?: string
          email?: string
          role?: string
          name?: string
          accessibleBusinessUnits?: string[]
          permissions?: string[]
          exp?: number
        }

        // Check if token is expired
        if (decoded.exp && decoded.exp * 1000 < Date.now()) {
          removeFromLocalStorage()
          setIsLoading(false)
          return
        }

        // Create user object from token
        const userData: User = {
          id: decoded.id || decoded.userId || "",
          name: decoded.name || decoded.email || "",
          email: decoded.email || "",
          role: decoded.role || "",
          accessibleBusinessUnits: decoded.accessibleBusinessUnits || [],
          permissions: decoded.permissions || [],
        }

        setUser(userData)
      } catch (error) {
        console.error("Auth initialization error:", error)
        removeFromLocalStorage()
        setUser(null)
      } finally {
        setIsLoading(false)
      }
    }

    initializeAuth()
  }, [])

  const login = (token: string, userData?: User) => {
    // Token should already be stored by login service
    // Just decode and set user if provided
    if (userData) {
      setUser(userData)
    } else {
      const decoded = decodedToken(token) as {
        id?: string
        userId?: string
        email?: string
        role?: string
        name?: string
        accessibleBusinessUnits?: string[]
        permissions?: string[]
      }

      setUser({
        id: decoded.id || decoded.userId || "",
        name: decoded.name || decoded.email || "",
        email: decoded.email || "",
        role: decoded.role || "",
        accessibleBusinessUnits: decoded.accessibleBusinessUnits || [],
        permissions: decoded.permissions || [],
      })
    }
  }

  const logout = async () => {
    removeFromLocalStorage()
    setUser(null)
    if (typeof window !== "undefined") {
      router.push("/auth/login")
    }
  }

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    logout,
    login,
  }
}

