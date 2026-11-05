"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Building2, Loader2, Lock, Mail, Eye, EyeOff, ShieldCheck } from "lucide-react"
import axios from "axios"
import toast from "react-hot-toast"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [adminExists, setAdminExists] = useState<boolean | null>(true) // default true for security

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1'

  useEffect(() => {
    const checkSetupStatus = async () => {
      try {
        const response = await axios.get(`${API_URL}/auth/setup-status`)
        if (response.data?.success && response.data?.data) {
          setAdminExists(response.data.data.adminExists)
        }
      } catch (err) {
        // In case of error, assume admin exists to keep signup link hidden
        setAdminExists(true)
      }
    }

    checkSetupStatus()
  }, [API_URL])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await axios.post(`${API_URL}/auth/login`, { email, password })
      
      if (response.data.success) {
        localStorage.setItem("token", response.data.data.token)
        if (response.data.data.user) {
          localStorage.setItem("user", JSON.stringify(response.data.data.user))
        }
        toast.success("Login successful!")
        router.push("/")
      }
    } catch (error: any) {
      if (!error.response) {
        toast.error("Cannot connect to backend server. Make sure port 5000 is running.")
      } else {
        toast.error(error.response?.data?.message || "Invalid credentials")
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-primary/10 blur-[120px] pointer-events-none" />
      
      <Card className="w-full max-w-md modern-card relative z-10 border-border/50 shadow-2xl">
        <CardHeader className="space-y-3 pb-6 text-center">
          <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-2">
            <Building2 className="w-6 h-6 text-primary" />
          </div>
          <CardTitle className="text-2xl font-bold tracking-tight">Admin Login</CardTitle>
          <CardDescription>
            Enter your credentials to access the A to I Infra dashboard.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="Enter email" 
                  className="pl-10"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input 
                  id="password" 
                  type={showPassword ? "text" : "password"} 
                  placeholder="Enter password" 
                  className="pl-10 pr-10"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            <Button type="submit" className="w-full rounded-full mt-2" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Authenticating...
                </>
              ) : (
                "Sign In"
              )}
            </Button>

            {/* Public Signup Navigation Link - Only shown during initial setup before admin exists */}
            {adminExists === false ? (
              <div className="text-center text-sm pt-2 text-primary">
                Initial setup required:{" "}
                <Link href="/signup" className="font-semibold underline hover:text-primary/80 transition-colors">
                  Register Initial Admin
                </Link>
              </div>
            ) : (
              <div className="text-center text-xs text-muted-foreground pt-3 flex items-center justify-center gap-1.5 border-t border-border/40 mt-2">
                <ShieldCheck className="w-3.5 h-3.5 text-primary" />
                <span>Restricted: Admin use only. Authorized personnel only.</span>
              </div>
            )}
          </form>
        </CardContent>
        <CardFooter className="flex justify-center border-t border-border/50 pt-6">
          <p className="text-sm text-muted-foreground">
            A to I Infra Admin Portal &copy; {new Date().getFullYear()}
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}
