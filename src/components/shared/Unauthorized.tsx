// components/shared/Unauthorized.tsx
"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AlertTriangle, Home } from "lucide-react"
import { useRouter } from "next/navigation"

interface UnauthorizedProps {
  requiredRole?: string
  requiredBusinessUnit?: string
  userRole?: string
  userBusinessUnits?: string[]
}

export function Unauthorized({
  requiredRole,
  requiredBusinessUnit,
  userRole,
  userBusinessUnits,
}: UnauthorizedProps) {
  const router = useRouter()

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <div className="flex items-center space-x-2">
          <AlertTriangle className="h-5 w-5 text-destructive" />
          <CardTitle>Access Denied</CardTitle>
        </div>
        <CardDescription>
          You don't have permission to access this resource.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {(requiredRole || requiredBusinessUnit) && (
          <div className="space-y-2 text-sm">
            {requiredRole && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Required Role:</span>
                <span className="font-medium capitalize">{requiredRole?.replace("-", " ") || "Unknown"}</span>
              </div>
            )}
            {requiredBusinessUnit && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Required Business Unit:</span>
                <span className="font-medium capitalize">{requiredBusinessUnit?.replace("-", " ") || "Unknown"}</span>
              </div>
            )}
            {userRole && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Your Role:</span>
                <span className="font-medium capitalize">{userRole?.replace("-", " ") || "Unknown"}</span>
              </div>
            )}
          </div>
        )}

        <Button
          onClick={() => router.push("/")}
          className="w-full"
          variant="outline"
        >
          <Home className="mr-2 h-4 w-4" />
          Go to Home
        </Button>
      </CardContent>
    </Card>
  )
}


