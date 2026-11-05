"use client"

import * as React from "react"
import { Search, Plus, Filter, Users, Edit, Trash2, Loader2, ChevronDown, Check, X } from "lucide-react"
import * as z from "zod"
import { useForm } from "react-hook-form"
import toast from "react-hot-toast"
import { zodResolver } from "@hookform/resolvers/zod"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useDevelopers, useUserRole, api } from "@/hooks/useData"
import { cn } from "@/lib/utils"

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  hqCity: z.string().min(2, "HQ City is required."),
  operatingCities: z.any().optional(),
  experienceYears: z.coerce.number().min(0, "Experience must be 0 or more."),
  completedProjects: z.coerce.number().min(0, "Completed projects must be 0 or more."),
  rating: z.coerce.number().min(0).max(5, "Rating must be between 0 and 5."),
  reviewCount: z.coerce.number().min(0, "Review count must be 0 or more.").optional(),
  status: z.string().min(1, "Status is required."),
  logoUrl: z.string().optional(),
})

const CITIES = [
  "Bangalore",
  "Noida",
  "Greater Noida",
  "Delhi NCR",
  "Gurugram",
  "Mumbai",
  "Pune",
  "Hyderabad",
  "Chennai",
  "Kolkata",
  "Ahmedabad",
  "Kochi",
  "Goa",
]

function MultiSelectCities({
  value = [],
  onChange,
  options = CITIES,
  placeholder = "Select operating cities...",
}: {
  value: string[] | any
  onChange: (cities: string[]) => void
  options?: string[]
  placeholder?: string
}) {
  const [open, setOpen] = React.useState(false)
  const [search, setSearch] = React.useState("")
  const containerRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const currentValues: string[] = Array.isArray(value)
    ? value
    : typeof value === "string" && value
    ? (value as string).split(",").map((s) => s.trim()).filter(Boolean)
    : []

  const toggleCity = (city: string) => {
    if (currentValues.includes(city)) {
      onChange(currentValues.filter((c) => c !== city))
    } else {
      onChange([...currentValues, city])
    }
  }

  const selectAll = () => {
    onChange(Array.from(new Set([...options, ...currentValues])))
  }

  const clearAll = () => {
    onChange([])
  }

  const allOptions = React.useMemo(() => {
    return Array.from(new Set([...options, ...currentValues]))
  }, [options, currentValues])

  const filteredOptions = allOptions.filter((city) =>
    city.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="relative w-full" ref={containerRef}>
      <div
        onClick={() => setOpen(!open)}
        className={cn(
          "flex min-h-[38px] w-full items-center justify-between rounded-lg border border-input bg-background px-3 py-1.5 text-sm cursor-pointer shadow-xs transition-colors hover:border-primary/50",
          open && "ring-2 ring-ring ring-offset-background border-primary"
        )}
      >
        <div className="flex flex-wrap gap-1 items-center flex-1 mr-2">
          {currentValues.length === 0 ? (
            <span className="text-muted-foreground text-xs">{placeholder}</span>
          ) : (
            currentValues.map((city) => (
              <span
                key={city}
                className="inline-flex items-center gap-1 bg-secondary text-secondary-foreground text-xs font-medium px-2 py-0.5 rounded-md"
              >
                <span>{city}</span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    toggleCity(city)
                  }}
                  className="text-muted-foreground hover:text-destructive text-[11px] leading-none ml-0.5 cursor-pointer"
                >
                  ✕
                </button>
              </span>
            ))
          )}
        </div>
        <ChevronDown
          className={cn(
            "h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200",
            open && "rotate-180"
          )}
        />
      </div>

      {open && (
        <div className="absolute top-full left-0 mt-1 z-50 w-full rounded-lg border border-border bg-popover text-popover-foreground shadow-lg p-1.5 max-h-60 overflow-hidden flex flex-col">
          <div className="p-1 mb-1 border-b border-border/50">
            <input
              type="text"
              placeholder="Search cities..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onClick={(e) => e.stopPropagation()}
              className="w-full bg-muted/40 border border-border/60 rounded px-2 py-1 text-xs outline-none focus:border-primary transition-colors text-foreground"
            />
          </div>
          <div className="flex items-center justify-between px-2 py-1 border-b border-border/50 text-xs text-muted-foreground mb-1">
            <span>{currentValues.length} selected</span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  selectAll()
                }}
                className="text-primary hover:underline font-medium text-xs"
              >
                Select All
              </button>
              <span>•</span>
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  clearAll()
                }}
                className="text-muted-foreground hover:text-destructive font-medium text-xs"
              >
                Clear
              </button>
            </div>
          </div>
          <div className="space-y-0.5 max-h-40 overflow-y-auto pr-1">
            {filteredOptions.length === 0 && (
              <div className="px-2 py-2 text-xs text-muted-foreground text-center">
                No cities found
              </div>
            )}
            {filteredOptions.map((city) => {
              const checked = currentValues.includes(city)
              return (
                <div
                  key={city}
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    toggleCity(city)
                  }}
                  className={cn(
                    "flex items-center justify-between px-2.5 py-1.5 rounded-md text-xs cursor-pointer select-none transition-colors",
                    checked
                      ? "bg-primary/10 text-primary font-medium"
                      : "hover:bg-accent hover:text-accent-foreground text-foreground"
                  )}
                >
                  <div className="flex items-center gap-2">
                    <div
                      className={cn(
                        "size-3.5 rounded border flex items-center justify-center transition-colors",
                        checked
                          ? "bg-primary border-primary text-primary-foreground"
                          : "border-muted-foreground/40 bg-background"
                      )}
                    >
                      {checked && <Check className="size-2.5 stroke-[3]" />}
                    </div>
                    <span>{city}</span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

export default function DevelopersPage() {
  const { data: developers, isLoading, createItem, updateItem, deleteItem } = useDevelopers()
  const { isAdmin } = useUserRole()
  
  const [filterStatus, setFilterStatus] = React.useState<string | null>(null)
  const [open, setOpen] = React.useState(false)
  const [searchQuery, setSearchQuery] = React.useState("")
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [editingId, setEditingId] = React.useState<string | null>(null)
  const [deleteId, setDeleteId] = React.useState<string | null>(null)
  const [isDeleting, setIsDeleting] = React.useState(false)
  const [uploadingImage, setUploadingImage] = React.useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema) as any,
    defaultValues: {
      name: "",
      hqCity: "Bangalore",
      operatingCities: ["Bangalore"],
      experienceYears: 0,
      completedProjects: 0,
      rating: 4.5,
      reviewCount: 0,
      status: "Active",
      logoUrl: "",
    },
  })

  const handleAdd = () => {
    setEditingId(null)
    form.reset({
      name: "",
      hqCity: "Bangalore",
      operatingCities: ["Bangalore"],
      experienceYears: 0,
      completedProjects: 0,
      rating: 5.0,
      reviewCount: 0,
      status: "Active",
      logoUrl: "",
    })
    setOpen(true)
  }

  const handleEdit = (dev: any) => {
    setEditingId(dev.id)
    const devOperatingCities: string[] = Array.isArray(dev.operatingCities)
      ? dev.operatingCities
      : Array.isArray(dev.cities)
      ? dev.cities
      : typeof dev.operatingCities === "string" && dev.operatingCities
      ? dev.operatingCities.split(",").map((s: string) => s.trim()).filter(Boolean)
      : dev.hqCity
      ? [dev.hqCity]
      : ["Bangalore"]

    form.reset({
      name: dev.name || "",
      hqCity: dev.hqCity || "",
      operatingCities: devOperatingCities,
      experienceYears: dev.experienceYears ?? 0,
      completedProjects: dev.completedProjects ?? 0,
      rating: dev.rating ?? 4.5,
      reviewCount: dev.reviewCount ?? 0,
      status: dev.status || "Active",
      logoUrl: dev.logoUrl || "",
    })
    setOpen(true)
  }

  const handleDelete = async () => {
    if (!deleteId) return
    setIsDeleting(true)
    try {
      await deleteItem(deleteId)
      toast.success("Successfully deleted!")
      setDeleteId(null)
    } catch (err) {
      toast.error("Failed to delete developer")
    } finally {
      setIsDeleting(false)
    }
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const formData = new FormData()
    formData.append('file', file)
    
    try {
      setUploadingImage(true)
      const res = await api.post('/upload/image', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      form.setValue('logoUrl', res.data.fileUrl)
    } catch (err) {
      toast.error("Failed to upload image")
    } finally {
      setUploadingImage(false)
    }
  }

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true)
    try {
      const generatedSlug = values.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')
      let parsedOperatingCities: string[] = []
      if (Array.isArray(values.operatingCities)) {
        parsedOperatingCities = values.operatingCities.filter(Boolean)
      } else if (typeof values.operatingCities === "string" && values.operatingCities) {
        parsedOperatingCities = values.operatingCities.split(',').map((s: string) => s.trim()).filter(Boolean)
      }
      if (parsedOperatingCities.length === 0) {
        parsedOperatingCities = [values.hqCity]
      }
      
      if (editingId) {
        const payload: any = {
          name: values.name,
          slug: generatedSlug,
          hqCity: values.hqCity,
          operatingCities: parsedOperatingCities.length > 0 ? parsedOperatingCities : [values.hqCity],
          experienceYears: values.experienceYears,
          completedProjects: values.completedProjects,
          rating: values.rating,
          reviewCount: values.reviewCount ?? 0,
          status: values.status,
          logoUrl: values.logoUrl || undefined,
        }
        await updateItem(editingId, payload)
        toast.success("Successfully updated!")
      } else {
        const payload: any = {
          ...values,
          slug: generatedSlug,
          reviewCount: values.reviewCount ?? 0,
          tagline: "Building Dreams",
          about: `${values.name} is a leading real estate developer headquartered in ${values.hqCity}.`,
          foundedYear: new Date().getFullYear() - (values.experienceYears || 10),
          operatingCities: parsedOperatingCities.length > 0 ? parsedOperatingCities : [values.hqCity],
          ongoingProjects: 0,
          totalUnits: 0,
          awards: [],
        }
        if (!payload.logoUrl) delete payload.logoUrl
        await createItem(payload)
        toast.success("Successfully created!")
      }
      setOpen(false)
    } catch (err) {
      toast.error("Error saving developer")
      console.error(err)
    } finally {
      setIsSubmitting(false)
    }
  }

  const filteredDevelopers = React.useMemo(() => {
    let result = developers || []
    if (filterStatus) {
      result = result.filter((dev: any) => dev.status === filterStatus)
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      result = result.filter((item: any) => Object.values(item).some(val => String(val).toLowerCase().includes(q)))
    }
    return result
  }, [developers, filterStatus, searchQuery])

  return (
    <div className="flex flex-1 flex-col gap-6 min-w-0 max-w-full">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">Developers</h2>
          <p className="text-muted-foreground mt-2">
            Manage your partner builders and developers.
          </p>
        </div>
        <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 w-full md:w-auto">
          <div className="relative w-full sm:w-auto">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search..."
              className="w-full sm:w-64 rounded-full bg-background pl-9 shadow-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger render={<Button variant="outline" className="rounded-full shadow-sm" />}>
              <Filter className="mr-2 h-4 w-4" />
              {filterStatus ? `Status: ${filterStatus}` : "Filters"}
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setFilterStatus(null)}>All Statuses</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterStatus('Active')}>Active</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterStatus('Inactive')}>Inactive</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {isAdmin && (
            <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger render={<Button onClick={handleAdd} className="rounded-full shadow-md hover:shadow-lg transition-all" />}>
              <Plus className="mr-2 h-4 w-4" />
              Add Developer
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>{editingId ? "Edit Developer" : "Add New Developer"}</DialogTitle>
                <DialogDescription>
                  Enter the details of the developer partner.
                </DialogDescription>
              </DialogHeader>

              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="grid grid-cols-1 lg:grid-cols-2 gap-4 py-4">
                  {/* Name */}
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem className="col-span-1 lg:col-span-2">
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g. Lodha Group" className="rounded-lg" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Status */}
                  <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Status</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value || "Active"}>
                          <FormControl>
                            <SelectTrigger className="w-full rounded-lg">
                              <SelectValue placeholder="Select status">{field.value ? field.value.replace(/_/g, ' ') : "Select status"}</SelectValue>
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Active">Active</SelectItem>
                            <SelectItem value="Inactive">Inactive</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* HQ City */}
                  <FormField
                    control={form.control}
                    name="hqCity"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>HQ City</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value || ""}>
                          <FormControl>
                            <SelectTrigger className="w-full rounded-lg">
                              <SelectValue placeholder="Select city">{field.value ? field.value.replace(/_/g, ' ') : "Select city"}</SelectValue>
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {CITIES.map((city) => (
                              <SelectItem key={city} value={city}>{city}</SelectItem>
                            ))}
                            {field.value && !CITIES.includes(field.value) && (
                              <SelectItem value={field.value}>{field.value}</SelectItem>
                            )}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Operating Cities */}
                  <FormField
                    control={form.control}
                    name="operatingCities"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Operating Cities</FormLabel>
                        <FormControl>
                          <MultiSelectCities
                            value={field.value || []}
                            onChange={(cities) => field.onChange(cities)}
                            options={CITIES}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Experience */}
                  <FormField
                    control={form.control}
                    name="experienceYears"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Experience (Years)</FormLabel>
                        <FormControl>
                          <Input type="number" min="0" placeholder="15" className="rounded-lg" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Projects Completed */}
                  <FormField
                    control={form.control}
                    name="completedProjects"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Projects (Completed)</FormLabel>
                        <FormControl>
                          <Input type="number" min="0" placeholder="25" className="rounded-lg" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Rating */}
                  <FormField
                    control={form.control}
                    name="rating"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Rating (0.0 - 5.0)</FormLabel>
                        <FormControl>
                          <Input type="number" step="0.1" min="0" max="5" placeholder="4.5" className="rounded-lg" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Review Count */}
                  <FormField
                    control={form.control}
                    name="reviewCount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Review Count</FormLabel>
                        <FormControl>
                          <Input type="number" min="0" placeholder="100" className="rounded-lg" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Logo Image */}
                  <div className="space-y-2 col-span-1 lg:col-span-2">
                    <FormLabel>Logo Image</FormLabel>
                    <div className="flex items-center gap-4">
                      <Input type="file" accept="image/*" onChange={handleImageUpload} disabled={uploadingImage} />
                      {uploadingImage && <Loader2 className="h-4 w-4 animate-spin" />}
                    </div>
                    {form.watch('logoUrl') && (
                      <img src={form.watch('logoUrl')} alt="Preview" className="h-16 rounded-md object-contain mt-2 bg-white p-1 border" />
                    )}
                  </div>
                  
                  <DialogFooter className="col-span-1 lg:col-span-2 mt-4">
                    <Button type="submit" disabled={isSubmitting || uploadingImage} className="rounded-full px-8 w-fit mx-auto sm:mx-0">
                      {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      {editingId ? "Update Developer" : "Save Developer"}
                    </Button>
                  </DialogFooter>
                </form>
              </Form>

            </DialogContent>
          </Dialog>
          )}

          {isAdmin && (
            <Dialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Delete Developer</DialogTitle>
                  <DialogDescription>
                    Are you sure you want to delete this developer? This action cannot be undone.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter className="mt-4 flex sm:justify-end gap-2">
                  <Button variant="outline" onClick={() => setDeleteId(null)} disabled={isDeleting}>Cancel</Button>
                  <Button variant="destructive" onClick={handleDelete} disabled={isDeleting}>
                    {isDeleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Delete
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}

        </div>
      </div>

      <Card className="modern-card mb-10">
        <CardHeader className="pb-4">
          <CardTitle className="text-xl">All Developers</CardTitle>
          <CardDescription>
            Showing {filteredDevelopers.length} developer partners.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              <Skeleton className="h-10 w-full rounded-xl" />
              <Skeleton className="h-12 w-full rounded-xl" />
              <Skeleton className="h-12 w-full rounded-xl" />
            </div>
          ) : (
            <div className="rounded-xl border border-border/50 overflow-auto bg-background/50">
              <Table>
                <TableHeader className="bg-muted/30">
                  <TableRow className="hover:bg-transparent">
                    <TableHead className="w-16">S.No.</TableHead>
                    <TableHead>Developer</TableHead>
                    <TableHead>HQ City</TableHead>
                    <TableHead>Projects (Completed)</TableHead>
                    <TableHead>Rating</TableHead>
                    <TableHead>Status</TableHead>
                    {isAdmin && <TableHead className="text-right">Actions</TableHead>}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredDevelopers.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={isAdmin ? 7 : 6} className="h-24 text-center">
                        No results.
                      </TableCell>
                    </TableRow>
                  )}
                  {filteredDevelopers.map((dev: any, idx: number) => (
                    <TableRow key={dev.id}>
                      <TableCell className="font-medium text-muted-foreground">{idx + 1}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="flex aspect-square size-10 items-center justify-center rounded-md bg-white border overflow-hidden p-1">
                            {dev.logoUrl ? (
                               <img src={dev.logoUrl} alt={dev.name} className="object-contain size-full" />
                            ) : (
                               <Users className="size-4 text-muted-foreground" />
                            )}
                          </div>
                          <div className="flex flex-col">
                            <span className="font-medium">{dev.name}</span>
                            <span className="text-xs text-muted-foreground">{dev.experienceYears} Years Exp</span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="font-medium">{dev.hqCity}</span>
                          {(dev.operatingCities || dev.cities || []).length > 0 && (
                            <span className="text-xs text-muted-foreground">
                              Operates: {(dev.operatingCities || dev.cities || []).join(", ")}
                            </span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>{dev.completedProjects ?? 0}</TableCell>
                      <TableCell>
                         <div className="flex items-center gap-1">
                            <span className="font-medium">{dev.rating ?? 0}</span>
                            <span className="text-xs text-muted-foreground">({dev.reviewCount ?? 0})</span>
                         </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={dev.status === 'Active' ? 'default' : 'secondary'}>
                          {dev.status}
                        </Badge>
                      </TableCell>
                      {isAdmin && (
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button variant="ghost" size="icon" onClick={() => handleEdit(dev)} className="h-8 w-8 text-muted-foreground hover:text-primary">
                              <Edit className="h-4 w-4" />
                              <span className="sr-only">Edit Details</span>
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => setDeleteId(dev.id)} className="h-8 w-8 text-muted-foreground hover:text-destructive">
                              <Trash2 className="h-4 w-4" />
                              <span className="sr-only">Delete</span>
                            </Button>
                          </div>
                        </TableCell>
                      )}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
