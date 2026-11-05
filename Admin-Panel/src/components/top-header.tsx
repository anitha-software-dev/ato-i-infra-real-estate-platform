"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { ChevronDown } from "lucide-react"

import { ModeToggle } from "@/components/mode-toggle"
import { SidebarTrigger } from "@/components/ui/sidebar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { api } from "@/hooks/useData"

interface UserProfile {
  id?: string
  name?: string
  email?: string
  role?: string
}

export function TopHeader() {
  const router = useRouter()
  const [user, setUser] = React.useState<UserProfile | null>(null)

  React.useEffect(() => {
    // 1. Load cached user from localStorage immediately (no flicker)
    try {
      const stored = localStorage.getItem("user")
      if (stored) {
        setUser(JSON.parse(stored))
      }
    } catch (e) {
      console.warn("Error reading stored user:", e)
    }

    // 2. Fetch fresh user details from backend /auth/me
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token")
        if (!token) return
        const res = await api.get("/auth/me")
        if (res.data?.success && res.data?.data) {
          setUser(res.data.data)
          localStorage.setItem("user", JSON.stringify(res.data.data))
        }
      } catch (err: any) {
        if (err?.code !== "ERR_NETWORK" && err?.response?.status !== 401) {
          console.warn("Could not refresh user in TopHeader:", err?.message || err)
        }
      }
    }

    fetchUser()
  }, [])

  const getInitials = (name?: string) => {
    if (!name || !name.trim()) return "AD"
    const parts = name.trim().split(/\s+/)
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase()
    }
    return parts[0].slice(0, 2).toUpperCase()
  }

  const roleName = user?.role || "ADMIN"
  const displayName = user?.name || (roleName === "ADMIN" ? "Super Admin" : "User")

  return (
    <header className="sticky top-0 z-30 flex h-20 shrink-0 items-center gap-4 border-b border-border bg-background/60 backdrop-blur-2xl px-4 md:px-8">
      <div className="flex items-center gap-2">
        <SidebarTrigger className="-ml-1" />
      </div>

      <div className="flex flex-1 items-center justify-end gap-4">
        <div className="flex items-center gap-3 md:gap-4">
          <ModeToggle />

          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <Button
                  variant="ghost"
                  className="flex items-center gap-2.5 rounded-full p-1.5 sm:px-3 sm:py-1.5 h-auto hover:bg-muted/60 transition-colors cursor-pointer border border-transparent hover:border-border/60"
                />
              }
            >
              <Avatar className="h-9 w-9 border border-border">
                <AvatarFallback className="bg-primary/10 text-primary font-bold text-xs">
                  {getInitials(displayName)}
                </AvatarFallback>
              </Avatar>

              <div className="hidden sm:flex flex-col items-start text-left">
                <div className="flex items-center gap-1.5">
                  <span className="text-sm font-semibold text-foreground leading-none max-w-[130px] truncate">
                    {displayName}
                  </span>
                  <Badge
                    variant={roleName === "ADMIN" ? "default" : "secondary"}
                    className="text-[10px] h-4 px-1.5 py-0 font-bold uppercase tracking-wider"
                  >
                    {roleName}
                  </Badge>
                </div>
              </div>

              <ChevronDown className="h-3.5 w-3.5 text-muted-foreground hidden sm:block ml-0.5" />
              <span className="sr-only">Toggle user menu</span>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel className="font-normal p-3">
                <div className="flex flex-col space-y-1.5">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-sm font-bold text-foreground truncate">
                      {displayName}
                    </span>
                    <Badge
                      variant={roleName === "ADMIN" ? "default" : "secondary"}
                      className="text-[10px] font-bold px-1.5 py-0 uppercase tracking-wider"
                    >
                      {roleName}
                    </Badge>
                  </div>
                  {user?.email && (
                    <span className="text-xs text-muted-foreground truncate">
                      {user.email}
                    </span>
                  )}
                </div>
              </DropdownMenuLabel>

              <DropdownMenuSeparator />

              <DropdownMenuItem
                onClick={() => router.push("/settings")}
                className="cursor-pointer"
              >
                Settings
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              <DropdownMenuItem
                onClick={() => {
                  localStorage.removeItem("token")
                  localStorage.removeItem("user")
                  window.location.href = "/login"
                }}
                className="cursor-pointer text-destructive focus:bg-destructive/10 focus:text-destructive"
              >
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
