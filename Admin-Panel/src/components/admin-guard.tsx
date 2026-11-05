"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { ShieldAlert, ArrowLeft, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { api } from "@/hooks/useData"

interface AdminGuardProps {
  children: React.ReactNode
}

export function AdminGuard({ children }: AdminGuardProps) {
  const router = useRouter()
  const [role, setRole] = React.useState<string | null>(null)
  const [isChecking, setIsChecking] = React.useState(true)

  React.useEffect(() => {
    // 1. Immediate read from localStorage
    try {
      const stored = localStorage.getItem("user")
      if (stored) {
        const u = JSON.parse(stored)
        setRole(u.role || null)
      }
    } catch (e) {
      console.error("Error parsing stored user:", e)
    }

    // 2. Fresh verification with backend
    const verifyAdmin = async () => {
      try {
        const token = localStorage.getItem("token")
        if (!token) {
          router.replace("/login")
          return
        }
        const res = await api.get("/auth/me")
        if (res.data?.success && res.data?.data) {
          const userRole = res.data.data.role
          setRole(userRole)
          localStorage.setItem("user", JSON.stringify(res.data.data))
        }
      } catch (err) {
        console.error("Error verifying admin role:", err)
      } finally {
        setIsChecking(false)
      }
    }

    verifyAdmin()
  }, [router])

  // While checking without cached role
  if (isChecking && !role) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  // Not an Admin: Show clear restriction message
  if (role !== "ADMIN") {
    return (
      <div className="flex min-h-[70vh] items-center justify-center p-4">
        <Card className="w-full max-w-md modern-card text-center border-destructive/20 shadow-xl">
          <CardHeader className="space-y-3 pb-4">
            <div className="mx-auto w-14 h-14 bg-destructive/10 rounded-full flex items-center justify-center text-destructive">
              <ShieldAlert className="w-8 h-8" />
            </div>
            <CardTitle className="text-xl font-bold tracking-tight text-foreground">
              Restricted: Admin use only.
            </CardTitle>
            <CardDescription className="text-sm text-muted-foreground">
              Restricted: Admin use only. Please contact your administrator.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground bg-muted/50 p-3 rounded-lg border border-border/50">
              Your account does not have administrator privileges to view this section.
            </p>
          </CardContent>
          <CardFooter className="flex justify-center pt-2">
            <Button onClick={() => router.push("/")} className="rounded-full gap-2">
              <ArrowLeft className="h-4 w-4" />
              Return to Dashboard
            </Button>
          </CardFooter>
        </Card>
      </div>
    )
  }

  // Authenticated Admin: Render child content
  return <>{children}</>
}
