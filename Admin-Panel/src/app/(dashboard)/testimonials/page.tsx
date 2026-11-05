"use client"

import * as React from "react"
import {
  MessageSquareQuote,
  Star,
  Plus,
  Search,
  CheckCircle2,
  Trash2,
  Edit,
  Loader2,
  Building,
  MapPin,
  Sparkles,
  Upload,
  UploadCloud,
  X,
  Users,
  Image as ImageIcon,
} from "lucide-react"
import toast from "react-hot-toast"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
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
import { useTestimonials, useUserRole, api } from "@/hooks/useData"
import { Testimonial } from "@/lib/mockData"

export default function TestimonialsPage() {
  const { data: testimonials, isLoading, createItem, updateItem, deleteItem } = useTestimonials()
  const { isAdmin } = useUserRole()

  const [activeTab, setActiveTab] = React.useState<"all" | "client" | "employee">("all")
  const [searchQuery, setSearchQuery] = React.useState("")
  const [filterRating, setFilterRating] = React.useState<string>("all")
  const [openModal, setOpenModal] = React.useState(false)
  const [editingItem, setEditingItem] = React.useState<Testimonial | null>(null)
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  // Form Fields
  const [reviewType, setReviewType] = React.useState<"CLIENT" | "EMPLOYEE">("CLIENT")
  const [clientName, setClientName] = React.useState("")
  const [clientRole, setClientRole] = React.useState("")
  const [clientAvatar, setClientAvatar] = React.useState("")
  const [avatarPreview, setAvatarPreview] = React.useState("")
  const [isUploadingPhoto, setIsUploadingPhoto] = React.useState(false)
  const [isDragging, setIsDragging] = React.useState(false)
  const [showUrlOption, setShowUrlOption] = React.useState(false)
  const fileInputRef = React.useRef<HTMLInputElement | null>(null)

  const [rating, setRating] = React.useState<number>(5)
  const [quote, setQuote] = React.useState("")
  const [propertyName, setPropertyName] = React.useState("")
  const [location, setLocation] = React.useState("")
  const [isFeatured, setIsFeatured] = React.useState(false)
  const [status, setStatus] = React.useState<"Active" | "Inactive">("Active")

  const handleOpenAdd = () => {
    setEditingItem(null)
    setReviewType(activeTab === "employee" ? "EMPLOYEE" : "CLIENT")
    setClientName("")
    setClientRole("")
    setClientAvatar("")
    setAvatarPreview("")
    setShowUrlOption(false)
    setRating(5)
    setQuote("")
    setPropertyName("")
    setLocation("")
    setIsFeatured(false)
    setStatus("Active")
    setOpenModal(true)
  }

  const handleOpenEdit = (t: Testimonial) => {
    setEditingItem(t)
    setReviewType(t.type === "EMPLOYEE" ? "EMPLOYEE" : "CLIENT")
    setClientName(t.clientName)
    setClientRole(t.clientRole || "")
    setClientAvatar(t.clientAvatar || "")
    setAvatarPreview(t.clientAvatar || "")
    setShowUrlOption(false)
    setRating(t.rating || 5)
    setQuote(t.quote)
    setPropertyName(t.propertyName || "")
    setLocation(t.location || "")
    setIsFeatured(Boolean(t.isFeatured))
    setStatus(t.status || "Active")
    setOpenModal(true)
  }

  const handleUploadFile = async (file: File) => {
    if (!file) return

    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file (PNG, JPG, WEBP)")
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image file size should be less than 5MB")
      return
    }

    // Set immediate preview
    const localUrl = URL.createObjectURL(file)
    setAvatarPreview(localUrl)

    const formData = new FormData()
    formData.append("image", file)
    formData.append("file", file)

    setIsUploadingPhoto(true)
    try {
      const res = await api.post("/upload/image", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      const uploadedUrl = res.data?.data?.url || res.data?.fileUrl || res.data?.url
      if (uploadedUrl) {
        setClientAvatar(uploadedUrl)
        setAvatarPreview(uploadedUrl)
        toast.success("Photo uploaded successfully")
      } else {
        // Fallback to base64
        const reader = new FileReader()
        reader.onload = () => {
          const base64 = reader.result as string
          setClientAvatar(base64)
        }
        reader.readAsDataURL(file)
        toast.success("Photo selected")
      }
    } catch (err: any) {
      console.error("Upload error:", err)
      // Reliable fallback: store as base64 so user's image is not lost
      const reader = new FileReader()
      reader.onload = () => {
        const base64 = reader.result as string
        setClientAvatar(base64)
        setAvatarPreview(base64)
      }
      reader.readAsDataURL(file)
      toast.success("Photo selected")
    } finally {
      setIsUploadingPhoto(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    }
  }

  const handleRemovePhoto = () => {
    setClientAvatar("")
    setAvatarPreview("")
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const payload = {
        clientName,
        clientRole: clientRole || undefined,
        clientAvatar: clientAvatar || undefined,
        rating: Number(rating) || 5,
        quote,
        propertyName: reviewType === "CLIENT" ? (propertyName || undefined) : undefined,
        location: reviewType === "CLIENT" ? (location || undefined) : undefined,
        isFeatured: reviewType === "CLIENT" ? Boolean(isFeatured) : Boolean(isFeatured),
        status,
        type: reviewType,
      }

      if (editingItem) {
        await updateItem(editingItem.id, payload)
        toast.success(
          reviewType === "EMPLOYEE"
            ? "Team culture quote updated successfully"
            : "Customer review updated successfully"
        )
      } else {
        await createItem(payload)
        toast.success(
          reviewType === "EMPLOYEE"
            ? "Team culture quote published successfully"
            : "Customer review published successfully"
        )
      }
      setOpenModal(false)
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Operation failed")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete the quote/review from "${name}"?`)) {
      try {
        await deleteItem(id)
        toast.success("Review removed")
      } catch (err: any) {
        toast.error("Failed to delete review")
      }
    }
  }

  const toggleFeatured = async (t: Testimonial) => {
    try {
      await updateItem(t.id, { isFeatured: !t.isFeatured })
      toast.success(t.isFeatured ? "Removed from featured" : "Featured successfully!")
    } catch (err: any) {
      toast.error("Failed to update feature status")
    }
  }

  const filteredTestimonials = React.useMemo(() => {
    return testimonials.filter((t) => {
      const isEmployee = t.type === "EMPLOYEE"
      if (activeTab === "client" && isEmployee) return false
      if (activeTab === "employee" && !isEmployee) return false

      const matchesSearch =
        t.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (t.clientRole && t.clientRole.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (t.propertyName && t.propertyName.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (t.quote && t.quote.toLowerCase().includes(searchQuery.toLowerCase()))
      const matchesRating = filterRating === "all" || String(t.rating) === filterRating
      return matchesSearch && matchesRating
    })
  }, [testimonials, searchQuery, filterRating, activeTab])

  const totalReviews = testimonials.length
  const clientCount = testimonials.filter((t) => t.type !== "EMPLOYEE").length
  const employeeCount = testimonials.filter((t) => t.type === "EMPLOYEE").length
  const featuredCount = testimonials.filter((t) => t.isFeatured).length

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl">Reviews & Testimonials</h1>
          <p className="text-muted-foreground">
            Manage customer client reviews and team culture quotes displayed across the website.
          </p>
        </div>
        {isAdmin && (
          <Button onClick={handleOpenAdd} className="rounded-full shadow-sm">
            <Plus className="mr-2 h-4 w-4" />
            {activeTab === "employee" ? "Add Team Quote" : "Add Review"}
          </Button>
        )}
      </div>

      {/* Metrics Row */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="modern-card">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Entries</CardTitle>
            <MessageSquareQuote className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{isLoading ? "..." : totalReviews}</div>
            <p className="text-xs text-muted-foreground">All client and team reviews</p>
          </CardContent>
        </Card>

        <Card className="modern-card">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Client Reviews</CardTitle>
            <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-600">{isLoading ? "..." : clientCount}</div>
            <p className="text-xs text-muted-foreground">Home & Success Stories</p>
          </CardContent>
        </Card>

        <Card className="modern-card">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Team & Culture</CardTitle>
            <Users className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{isLoading ? "..." : employeeCount}</div>
            <p className="text-xs text-muted-foreground">Our Culture &quot;Hear From the Team&quot;</p>
          </CardContent>
        </Card>

        <Card className="modern-card">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Featured</CardTitle>
            <Sparkles className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{isLoading ? "..." : featuredCount}</div>
            <p className="text-xs text-muted-foreground">Spotlight highlighted</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs and Filters Row */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-3">
          {/* Tab Filter Buttons */}
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant={activeTab === "all" ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveTab("all")}
              className="rounded-full text-xs h-8"
            >
              All ({totalReviews})
            </Button>
            <Button
              type="button"
              variant={activeTab === "client" ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveTab("client")}
              className="rounded-full text-xs h-8"
            >
              Client Reviews ({clientCount})
            </Button>
            <Button
              type="button"
              variant={activeTab === "employee" ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveTab("employee")}
              className="rounded-full text-xs h-8"
            >
              Team Culture ({employeeCount})
            </Button>
          </div>

          {/* Search & Rating */}
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-64">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, role, quote..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 h-8 text-xs"
              />
            </div>

            <Select value={filterRating} onValueChange={(val) => setFilterRating(val || "all")}>
              <SelectTrigger className="w-36 h-8 text-xs">
                <SelectValue placeholder="Rating">
                  {filterRating === "all" ? "All Ratings" : `${filterRating} Stars only`}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Ratings</SelectItem>
                <SelectItem value="5">5 Stars only</SelectItem>
                <SelectItem value="4">4 Stars only</SelectItem>
                <SelectItem value="3">3 Stars only</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Testimonials Grid */}
      {isLoading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Card key={i} className="modern-card">
              <CardContent className="p-6 space-y-4">
                <Skeleton className="h-6 w-32" />
                <Skeleton className="h-20 w-full" />
                <Skeleton className="h-10 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : filteredTestimonials.length === 0 ? (
        <Card className="modern-card">
          <CardContent className="flex flex-col items-center justify-center p-12 text-center text-muted-foreground">
            <MessageSquareQuote className="h-12 w-12 text-muted-foreground/40 mb-3" />
            <h3 className="text-base font-semibold text-foreground">No reviews found</h3>
            <p className="text-sm mt-1 max-w-sm">
              {activeTab === "employee"
                ? "No team culture quotes found. Add a team quote to show it on the /our-culture page."
                : "No reviews found for the current selection."}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredTestimonials.map((t) => {
            const isEmployee = t.type === "EMPLOYEE"
            return (
              <Card key={t.id} className="modern-card flex flex-col justify-between hover:shadow-lg transition-all">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-3">
                      <img
                        src={t.clientAvatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(t.clientName)}&background=0F172A&color=fff`}
                        alt={t.clientName}
                        className="h-11 w-11 rounded-full object-cover border border-border"
                      />
                      <div>
                        <h4 className="font-semibold text-foreground leading-tight">{t.clientName}</h4>
                        <p className="text-xs text-muted-foreground">{t.clientRole || (isEmployee ? "Team Member" : "Client")}</p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      {isEmployee ? (
                        <Badge className="bg-purple-500/10 text-purple-700 dark:text-purple-400 border-purple-500/20 text-[10px]">
                          Team Culture
                        </Badge>
                      ) : (
                        <Badge className="bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20 text-[10px]">
                          Client Review
                        </Badge>
                      )}
                      {t.isFeatured && (
                        <Badge className="bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20 text-[10px]">
                          Featured
                        </Badge>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-1 mt-2">
                    {Array.from({ length: 5 }).map((_, idx) => (
                      <Star
                        key={idx}
                        className={`h-3.5 w-3.5 ${
                          idx < (t.rating || 5)
                            ? "text-amber-400 fill-amber-400"
                            : "text-muted-foreground/30"
                        }`}
                      />
                    ))}
                    <span className="text-[11px] text-muted-foreground ml-1.5">
                      {t.status === "Active" ? "Active" : "Hidden"}
                    </span>
                  </div>
                </CardHeader>

                <CardContent className="space-y-3 flex-1 pb-4">
                  <p className="text-sm text-foreground/90 italic leading-relaxed line-clamp-4">
                    &ldquo;{t.quote}&rdquo;
                  </p>

                  {isEmployee ? (
                    <div className="rounded-lg bg-purple-50/60 dark:bg-purple-950/20 border border-purple-100 dark:border-purple-900/30 p-2 text-xs text-purple-700 dark:text-purple-300 flex items-center gap-1.5">
                      <Users className="h-3.5 w-3.5 shrink-0" />
                      <span>Shown on Our Culture page (&quot;Hear From the Team&quot;)</span>
                    </div>
                  ) : (
                    (t.propertyName || t.location) && (
                      <div className="rounded-lg bg-muted/50 p-2 text-xs text-muted-foreground flex items-center justify-between">
                        {t.propertyName && (
                          <div className="flex items-center gap-1 font-medium text-foreground truncate">
                            <Building className="h-3 w-3 text-primary shrink-0" />
                            <span className="truncate">{t.propertyName}</span>
                          </div>
                        )}
                        {t.location && (
                          <div className="flex items-center gap-1 shrink-0 text-muted-foreground">
                            <MapPin className="h-3 w-3" />
                            <span>{t.location}</span>
                          </div>
                        )}
                      </div>
                    )
                  )}
                </CardContent>

                {isAdmin && (
                  <div className="border-t border-border/60 px-6 py-3 flex items-center justify-between bg-muted/20">
                    <button
                      type="button"
                      onClick={() => toggleFeatured(t)}
                      className={`text-xs font-medium flex items-center gap-1 hover:underline ${
                        t.isFeatured ? "text-amber-600" : "text-muted-foreground"
                      }`}
                    >
                      <Sparkles className="h-3.5 w-3.5" />
                      {t.isFeatured ? "Featured" : "Feature"}
                    </button>

                    <div className="flex items-center gap-1">
                      <Button variant="ghost" size="sm" onClick={() => handleOpenEdit(t)} className="h-8 w-8 p-0">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(t.id, t.clientName)}
                        className="h-8 w-8 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </Card>
            )
          })}
        </div>
      )}

      {/* Add / Edit Testimonial Dialog */}
      {isAdmin && (
        <Dialog open={openModal} onOpenChange={setOpenModal}>
        <DialogContent className="sm:max-w-[580px] p-5">
          <form onSubmit={handleSubmit}>
            <DialogHeader className="pb-1">
              <DialogTitle>
                {editingItem
                  ? reviewType === "EMPLOYEE"
                    ? "Edit Team Culture Quote"
                    : "Edit Customer Review"
                  : reviewType === "EMPLOYEE"
                  ? "Add Team Culture Quote"
                  : "Add Customer Review"}
              </DialogTitle>
              <DialogDescription className="text-xs">
                {reviewType === "EMPLOYEE"
                  ? "Manage direct quotes from team members displayed on the Life at A to I Infra culture page."
                  : "Add a customer review and rating to showcase client satisfaction on the website."}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-3 py-2">
              {/* Type Selector Tabs */}
              <div className="flex items-center p-1 bg-muted/60 rounded-lg border border-border/60">
                <button
                  type="button"
                  onClick={() => setReviewType("CLIENT")}
                  className={`flex-1 text-xs py-1.5 px-3 rounded-md font-medium transition-all ${
                    reviewType === "CLIENT"
                      ? "bg-background text-foreground shadow-xs font-semibold"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Client Testimonial
                </button>
                <button
                  type="button"
                  onClick={() => setReviewType("EMPLOYEE")}
                  className={`flex-1 text-xs py-1.5 px-3 rounded-md font-medium transition-all ${
                    reviewType === "EMPLOYEE"
                      ? "bg-background text-foreground shadow-xs font-semibold"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Team / Culture Quote
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label htmlFor="clientName" className="text-xs font-semibold">
                    {reviewType === "EMPLOYEE" ? "Team Member Name *" : "Customer Name *"}
                  </Label>
                  <Input
                    id="clientName"
                    placeholder={reviewType === "EMPLOYEE" ? "e.g. Vikram Malhotra" : "e.g. Rahul Verma"}
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    className="h-8.5 text-xs"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="clientRole" className="text-xs font-semibold">
                    {reviewType === "EMPLOYEE" ? "Designation / Role *" : "Job Title or Role"}
                  </Label>
                  <Input
                    id="clientRole"
                    placeholder={reviewType === "EMPLOYEE" ? "e.g. Associate Director" : "e.g. Homebuyer, Investor"}
                    value={clientRole}
                    onChange={(e) => setClientRole(e.target.value)}
                    className="h-8.5 text-xs"
                  />
                </div>
              </div>

              {/* Photo Upload Section */}
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <Label className="text-xs font-semibold">
                    {reviewType === "EMPLOYEE" ? "Team Member Photo" : "Customer Photo"}
                  </Label>
                  <button
                    type="button"
                    onClick={() => setShowUrlOption(!showUrlOption)}
                    className="text-[11px] text-muted-foreground hover:text-foreground hover:underline"
                  >
                    {showUrlOption ? "Hide link" : "Or enter photo link"}
                  </button>
                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0]
                    if (file) handleUploadFile(file)
                  }}
                />

                {avatarPreview ? (
                  <div className="flex items-center gap-3 p-2 rounded-lg border border-border bg-muted/40">
                    <div className="relative h-10 w-10 rounded-full overflow-hidden border border-primary/20 shrink-0 bg-background shadow-xs">
                      <img
                        src={avatarPreview}
                        alt="Preview"
                        className="h-full w-full object-cover"
                      />
                      {isUploadingPhoto && (
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                          <Loader2 className="h-3.5 w-3.5 animate-spin text-white" />
                        </div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0 flex items-center justify-between gap-2">
                      <div>
                        <p className="text-xs font-medium text-foreground truncate">
                          {isUploadingPhoto ? "Uploading photo..." : "Photo selected"}
                        </p>
                        <p className="text-[10px] text-muted-foreground">Appears alongside the review</p>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="h-6 text-[11px] rounded px-2"
                          onClick={() => fileInputRef.current?.click()}
                          disabled={isUploadingPhoto}
                        >
                          <Upload className="h-3 w-3 mr-1" />
                          Change
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="h-6 text-[11px] text-destructive hover:text-destructive hover:bg-destructive/10 rounded px-1.5"
                          onClick={handleRemovePhoto}
                          disabled={isUploadingPhoto}
                        >
                          <X className="h-3 w-3 mr-1" />
                          Remove
                        </Button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    onDragOver={(e) => {
                      e.preventDefault()
                      setIsDragging(true)
                    }}
                    onDragLeave={() => setIsDragging(false)}
                    onDrop={(e) => {
                      e.preventDefault()
                      setIsDragging(false)
                      const file = e.dataTransfer.files?.[0]
                      if (file) handleUploadFile(file)
                    }}
                    className={`cursor-pointer border border-dashed rounded-lg px-3 py-2 flex items-center justify-center gap-2.5 transition-colors ${
                      isDragging
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/60 hover:bg-muted/40"
                    }`}
                  >
                    <div className="h-7 w-7 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                      {isUploadingPhoto ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      ) : (
                        <UploadCloud className="h-3.5 w-3.5" />
                      )}
                    </div>
                    <div className="text-left flex items-center gap-2">
                      <span className="text-xs font-medium text-foreground">
                        {isUploadingPhoto ? "Uploading..." : "Click to upload photo"}
                      </span>
                      <span className="text-[10px] text-muted-foreground">
                        (PNG, JPG or WEBP up to 5MB)
                      </span>
                    </div>
                  </div>
                )}

                {showUrlOption && (
                  <div className="pt-1">
                    <Input
                      placeholder="Or paste photo link (https://...)"
                      value={clientAvatar}
                      onChange={(e) => {
                        setClientAvatar(e.target.value)
                        setAvatarPreview(e.target.value)
                      }}
                      className="h-7 text-xs"
                    />
                  </div>
                )}
              </div>

              {/* Property & Location (Only relevant for Client reviews) */}
              {reviewType === "CLIENT" && (
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label htmlFor="propertyName" className="text-xs font-semibold">Property Name</Label>
                    <Input
                      id="propertyName"
                      list="testimonial-properties-list"
                      placeholder="e.g. Godrej Woods"
                      value={propertyName}
                      onChange={(e) => setPropertyName(e.target.value)}
                      className="h-8.5 text-xs"
                    />
                    <datalist id="testimonial-properties-list">
                      <option value="Godrej Woods" />
                      <option value="Prestige Falcon City" />
                      <option value="DLF Camellias" />
                      <option value="Sobha City" />
                      <option value="Brigade Gateway" />
                      <option value="Lodha Park" />
                      <option value="ATS Knightsbridge" />
                      <option value="M3M Golfestate" />
                    </datalist>
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="location" className="text-xs font-semibold">City</Label>
                    <Input
                      id="location"
                      list="testimonial-cities-list"
                      placeholder="e.g. Noida / Bangalore"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className="h-8.5 text-xs"
                    />
                    <datalist id="testimonial-cities-list">
                      <option value="Noida" />
                      <option value="Greater Noida" />
                      <option value="Delhi NCR" />
                      <option value="Gurugram" />
                      <option value="Bangalore" />
                      <option value="Mumbai" />
                      <option value="Pune" />
                      <option value="Hyderabad" />
                      <option value="Chennai" />
                      <option value="Kolkata" />
                      <option value="Lucknow" />
                      <option value="Yamuna Expressway" />
                    </datalist>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label className="text-xs font-semibold">Rating</Label>
                  <Select value={String(rating)} onValueChange={(val) => setRating(Number(val))}>
                    <SelectTrigger className="h-8.5 text-xs">
                      <SelectValue placeholder="Rating">
                        {rating ? `${rating} Stars - ${rating === 5 ? "Excellent" : rating === 4 ? "Very Good" : rating === 3 ? "Good" : rating === 2 ? "Fair" : "Poor"}` : "Rating"}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="5">5 Stars - Excellent</SelectItem>
                      <SelectItem value="4">4 Stars - Very Good</SelectItem>
                      <SelectItem value="3">3 Stars - Good</SelectItem>
                      <SelectItem value="2">2 Stars - Fair</SelectItem>
                      <SelectItem value="1">1 Star - Poor</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1">
                  <Label className="text-xs font-semibold">Status</Label>
                  <Select value={status} onValueChange={(val: any) => setStatus(val)}>
                    <SelectTrigger className="h-8.5 text-xs">
                      <SelectValue placeholder="Status">
                        {status === "Active" ? "Show on website (Active)" : "Hide from website (Hidden)"}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Active">Show on website (Active)</SelectItem>
                      <SelectItem value="Inactive">Hide from website (Hidden)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-1">
                <Label htmlFor="quote" className="text-xs font-semibold">
                  {reviewType === "EMPLOYEE" ? "Team Member Quote / Experience *" : "Customer Review *"}
                </Label>
                <Textarea
                  id="quote"
                  placeholder={
                    reviewType === "EMPLOYEE"
                      ? "Share the team member's quote describing their growth journey and experience at A to I Infra..."
                      : "What did the customer say about their experience with A to I Infra?"
                  }
                  value={quote}
                  onChange={(e) => setQuote(e.target.value)}
                  rows={3}
                  className="resize-none text-xs min-h-[72px]"
                  required
                />
              </div>

              <div className="flex items-center gap-2 pt-0.5">
                <input
                  type="checkbox"
                  id="isFeatured"
                  checked={isFeatured}
                  onChange={(e) => setIsFeatured(e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary cursor-pointer"
                />
                <Label htmlFor="isFeatured" className="cursor-pointer text-xs font-medium">
                  {reviewType === "EMPLOYEE"
                    ? "Featured Quote (Prioritize at front of culture slider)"
                    : "Show on Homepage (Featured review)"}
                </Label>
              </div>
            </div>

            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" onClick={() => setOpenModal(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting || isUploadingPhoto}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : editingItem ? (
                  "Save Changes"
                ) : (
                  "Publish Review"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      )}
    </div>
  )
}
