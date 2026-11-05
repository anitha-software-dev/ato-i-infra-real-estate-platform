"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Building2, Loader2, Lock, Mail, User, Eye, EyeOff, ShieldAlert, ArrowLeft } from "lucide-react"
import axios from "axios"
import toast from "react-hot-toast"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export default function SignUpPage() {
  const router = useRouter()
  const [adminExists, setAdminExists] = useState<boolean | null>(null)
  const [isCheckingSetup, setIsCheckingSetup] = useState(true)

  // Form State
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1'

  useEffect(() => {
    const checkSetupStatus = async () => {
      try {
        const response = await axios.get(`${API_URL}/auth/setup-status`)
        if (response.data?.success && response.data?.data) {
          setAdminExists(response.data.data.adminExists)
        } else {
          setAdminExists(true)
        }
      } catch (err) {
        // Default to adminExists: true to protect security on error
        setAdminExists(true)
      } finally {
        setIsCheckingSetup(false)
      }
    }

    checkSetupStatus()
  }, [API_URL])

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters")
      return
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match")
      return
    }

    setIsLoading(true)

    try {
      const response = await axios.post(`${API_URL}/auth/register`, { 
        name: name.trim(), 
        email: email.trim().toLowerCase(), 
        password,
        role: 'ADMIN'
      })
      
      if (response.data.success) {
        toast.success("Initial Super Admin account created successfully! Please sign in.")
        router.push("/login")
      }
    } catch (error: any) {
      if (error.response?.status === 403) {
        toast.error("Restricted: Admin use only. Please contact your administrator.")
        setAdminExists(true)
      } else if (!error.response) {
        toast.error("Cannot connect to backend server. Make sure port 5000 is running.")
      } else {
        toast.error(error.response?.data?.message || "Registration failed. Please try again.")
      }
    } finally {
      setIsLoading(false)
    }
  }

  // 1. Loading check
  if (isCheckingSetup) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  // 2. Restricted: Admin already exists
  if (adminExists) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary/10 blur-[120px] pointer-events-none" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-primary/10 blur-[120px] pointer-events-none" />
        
        <Card className="w-full max-w-md modern-card relative z-10 border-destructive/20 shadow-2xl text-center">
          <CardHeader className="space-y-3 pb-4">
            <div className="mx-auto w-14 h-14 bg-destructive/10 rounded-full flex items-center justify-center mb-1 text-destructive">
              <ShieldAlert className="w-8 h-8" />
            </div>
            <CardTitle className="text-2xl font-bold tracking-tight text-foreground">
              Restricted: Admin use only.
            </CardTitle>
            <CardDescription className="text-sm font-medium text-muted-foreground">
              Restricted: Admin use only. Please contact your administrator.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-muted/50 p-4 rounded-xl border border-border/50 text-xs text-muted-foreground leading-relaxed text-left space-y-2">
              <p>
                Public sign-up is permanently disabled. Staff and coordinator accounts are provisioned exclusively by authorized administrators.
              </p>
              <p className="font-semibold text-foreground">
                To request access, please contact your organization administrator.
              </p>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-3 pt-2 border-t border-border/50">
            <Button onClick={() => router.push("/login")} className="w-full rounded-full gap-2">
              <ArrowLeft className="w-4 h-4" />
              Return to Login
            </Button>
            <p className="text-xs text-muted-foreground">
              A to I Infra Admin Portal &copy; {new Date().getFullYear()}
            </p>
          </CardFooter>
        </Card>
      </div>
    )
  }

  // 3. Initial Setup: Create first Super Admin
  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-primary/10 blur-[120px] pointer-events-none" />
      
      <Card className="w-full max-w-md modern-card relative z-10 border-primary/30 shadow-2xl">
        <CardHeader className="space-y-3 pb-6 text-center">
          <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-2">
            <Building2 className="w-6 h-6 text-primary" />
          </div>
          <CardTitle className="text-2xl font-bold tracking-tight">Initial Admin Setup</CardTitle>
          <CardDescription>
            No administrator detected. Register the initial Super Admin account to initialize the system.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSignUp} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input 
                  id="name" 
                  type="text" 
                  placeholder="Enter full name" 
                  className="pl-10"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
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
              <Label htmlFor="password">Password</Label>
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
                  minLength={6}
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

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input 
                  id="confirmPassword" 
                  type={showConfirmPassword ? "text" : "password"} 
                  placeholder="Confirm password" 
                  className="pl-10 pr-10"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  minLength={6}
                />
                <button 
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                >
                  {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <Button type="submit" className="w-full rounded-full mt-2" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating Super Admin...
                </>
              ) : (
                "Create Super Admin Account"
              )}
            </Button>

            <div className="text-center text-sm text-muted-foreground pt-2">
              Already have credentials?{" "}
              <Link href="/login" className="font-semibold text-primary hover:underline transition-colors">
                Sign In
              </Link>
            </div>
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
