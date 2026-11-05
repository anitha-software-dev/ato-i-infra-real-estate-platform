"use client"

import * as React from "react"
import {
  UserPlus,
  Search,
  Trash2,
  Edit,
  Loader2,
  Mail,
  Phone,
  Lock,
  User as UserIcon,
} from "lucide-react"
import toast from "react-hot-toast"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import { useUsers } from "@/hooks/useData"
import { AdminUser } from "@/lib/mockData"
import { AdminGuard } from "@/components/admin-guard"

function UsersPageContent() {
  const { data: users, isLoading: usersLoading, createItem, updateItem, deleteItem } = useUsers()

  const [searchQuery, setSearchQuery] = React.useState("")
  const [openModal, setOpenModal] = React.useState(false)
  const [editingUser, setEditingUser] = React.useState<AdminUser | null>(null)
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  // Form State
  const [name, setName] = React.useState("")
  const [email, setEmail] = React.useState("")
  const [password, setPassword] = React.useState("")
  const [role, setRole] = React.useState<string>("ADMIN")
  const [status, setStatus] = React.useState<"Active" | "Inactive">("Active")
  const [phone, setPhone] = React.useState("")

  const handleOpenAdd = () => {
    setEditingUser(null)
    setName("")
    setEmail("")
    setPassword("")
    setRole("ADMIN")
    setStatus("Active")
    setPhone("")
    setOpenModal(true)
  }

  const handleOpenEdit = (user: AdminUser) => {
    setEditingUser(user)
    setName(user.name)
    setEmail(user.email)
    setPassword("")
    setRole(user.role)
    setStatus(user.status || "Active")
    setPhone(user.phone || "")
    setOpenModal(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      if (editingUser) {
        const payload: any = { name, role, status, phone }
        if (password) payload.password = password
        await updateItem(editingUser.id, payload)
        toast.success("User updated successfully")
      } else {
        if (!password || password.length < 6) {
          toast.error("Password must be at least 6 characters")
          setIsSubmitting(false)
          return
        }
        await createItem({ name, email, password, role, status, phone })
        toast.success("New user created successfully")
      }
      setOpenModal(false)
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Operation failed")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async (id: string, userName: string) => {
    if (confirm(`Are you sure you want to remove user "${userName}"?`)) {
      try {
        await deleteItem(id)
        toast.success("User removed successfully")
      } catch (err: any) {
        toast.error("Failed to delete user")
      }
    }
  }

  const filteredUsers = React.useMemo(() => {
    return users.filter(
      (u) =>
        u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (u.phone && u.phone.includes(searchQuery))
    )
  }, [users, searchQuery])

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl">Users Management</h1>
          <p className="text-muted-foreground">
            Manage administrative users and view access permissions.
          </p>
        </div>
        <Button onClick={handleOpenAdd} className="rounded-full shadow-sm">
          <UserPlus className="mr-2 h-4 w-4" />
          Add User
        </Button>
      </div>

      {/* Administrative Users Table */}
      <Card className="modern-card">
        <CardHeader className="pb-3">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <CardTitle className="text-lg">Administrative Users</CardTitle>
              <CardDescription>Accounts authorized to access the A to I Infra admin panel.</CardDescription>
            </div>
            <div className="relative w-full md:w-64">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 h-9"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-16">S.No.</TableHead>
                  <TableHead>User / Admin</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {usersLoading ? (
                  Array.from({ length: 3 }).map((_, i) => (
                    <TableRow key={i}>
                      <TableCell><Skeleton className="h-6 w-8" /></TableCell>
                      <TableCell><Skeleton className="h-10 w-40" /></TableCell>
                      <TableCell><Skeleton className="h-6 w-16" /></TableCell>
                      <TableCell><Skeleton className="h-6 w-20" /></TableCell>
                      <TableCell><Skeleton className="h-8 w-16 ml-auto" /></TableCell>
                    </TableRow>
                  ))
                ) : filteredUsers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="h-32 text-center text-muted-foreground">
                      No users found matching your search.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredUsers.map((user, idx) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium text-muted-foreground">{idx + 1}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 font-bold text-primary text-sm">
                            {user.name.slice(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <div className="font-medium text-foreground">{user.name}</div>
                            <div className="text-xs text-muted-foreground">{user.email}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={user.role === "ADMIN" ? "default" : "secondary"}>
                          {user.role}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {new Date(user.createdAt).toLocaleDateString("en-IN", { month: "short", day: "numeric", year: "numeric" })}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleOpenEdit(user)}
                            className="h-8 w-8 p-0"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(user.id, user.name)}
                            className="h-8 w-8 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Add / Edit User Modal */}
      <Dialog open={openModal} onOpenChange={setOpenModal}>
        <DialogContent className="sm:max-w-[480px]">
          <form onSubmit={handleSubmit}>
            <DialogHeader>
              <DialogTitle>{editingUser ? "Edit User" : "Add New User"}</DialogTitle>
              <DialogDescription>
                {editingUser
                  ? "Update roles, access privileges, or contact information."
                  : "Create an administrator account with dashboard access."}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="userName">Full Name</Label>
                <div className="relative">
                  <UserIcon className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="userName"
                    placeholder="Enter full name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="userEmail">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="userEmail"
                    type="email"
                    placeholder="admin@atoiinfra.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10"
                    required
                    disabled={!!editingUser}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="userPhone">Phone Number</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="userPhone"
                    placeholder="+91 98765 43210"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="userPassword">
                  {editingUser ? "New Password (leave blank to keep current)" : "Password"}
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="userPassword"
                    type="password"
                    placeholder={editingUser ? "••••••••" : "Minimum 6 characters"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10"
                    required={!editingUser}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Role</Label>
                  <Select value={role} onValueChange={(val: any) => val && setRole(val)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select role">
                        {role === "ADMIN" ? "Admin (Full Access)" : role === "STAFF" ? "Staff (Operations)" : role === "USER" ? "User (Standard)" : role || "Select role"}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ADMIN">Admin (Full Access)</SelectItem>
                      <SelectItem value="STAFF">Staff (Operations)</SelectItem>
                      <SelectItem value="USER">User (Standard)</SelectItem>
                      {role && !["ADMIN", "STAFF", "USER"].includes(role) && (
                        <SelectItem value={role}>{role}</SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Account Status</Label>
                  <Select value={status} onValueChange={(val: any) => val && setStatus(val)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status">
                        {status || "Select status"}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Active">Active</SelectItem>
                      <SelectItem value="Inactive">Inactive</SelectItem>
                      {status && !["Active", "Inactive"].includes(status) && (
                        <SelectItem value={status}>{status}</SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setOpenModal(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : editingUser ? (
                  "Save Changes"
                ) : (
                  "Add User"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default function UsersPage() {
  return (
    <AdminGuard>
      <UsersPageContent />
    </AdminGuard>
  )
}
