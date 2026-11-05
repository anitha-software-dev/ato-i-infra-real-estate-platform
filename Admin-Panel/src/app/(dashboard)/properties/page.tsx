"use client"

import * as React from "react"
import { Search, MoreHorizontal, Plus, Filter, Building2, Eye, Edit, Trash2, Loader2 } from "lucide-react"
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
import { useProperties, useDevelopers, useUserRole, api } from "@/hooks/useData"

const PROPERTY_CITIES = [
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

const PRICE_OPTIONS = [
  "Under ₹50 Lac",
  "₹50 Lac - 1 Cr",
  "₹1 Cr - 3 Cr",
  "₹3 Cr - 5 Cr",
  "₹5 Cr+",
  "Lease Only",
  "Price on Request",
]

const POPULAR_LOCATIONS = [
  "Sector 150",
  "Yamuna Expressway",
  "Sector 62",
  "Noida Expressway",
  "Whitefield",
  "Electronic City",
  "Kanakapura Road",
  "Indiranagar",
  "Hebbal",
  "Worli",
  "Bandra West",
  "Powai",
  "Andheri",
  "Hinjawadi",
  "Koregaon Park",
  "Cyber City",
  "Golf Course Road",
]

const CONFIGURATION_PRESETS = [
  "1 BHK",
  "2 BHK",
  "3 BHK",
  "4 BHK",
  "5 BHK",
  "Penthouse",
  "Villa",
  "Studio",
  "Plot",
  "Office Space",
  "Retail Shop",
  "Showroom",
  "Warehouse",
  "Factory Unit",
]

const formSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters."),
  developerId: z.string().min(1, "Developer is required."),
  type: z.string().min(2, "Property type is required."),
  city: z.string().min(2, "City is required."),
  location: z.string().min(2, "Location is required."),
  priceRange: z.string().min(1, "Price range is required."),
  configurations: z.string().min(1, "Configuration is required (e.g. 2 BHK, 3 BHK, Plot)."),
  status: z.string().min(1, "Status is required."),
  coverImage: z.string().optional(),
})

export default function PropertiesPage() {
  const { data: properties, isLoading, createItem, updateItem, deleteItem } = useProperties()
  const { data: developers } = useDevelopers()
  const { isAdmin } = useUserRole()
  
  const [filterType, setFilterType] = React.useState<string | null>(null)
  const [open, setOpen] = React.useState(false)
  const [searchQuery, setSearchQuery] = React.useState("")
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [editingId, setEditingId] = React.useState<string | null>(null)
  const [uploadingImage, setUploadingImage] = React.useState(false)
  const [deleteId, setDeleteId] = React.useState<string | null>(null)
  const [isDeleting, setIsDeleting] = React.useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      developerId: "",
      type: "Residential",
      city: "",
      location: "",
      priceRange: "",
      configurations: "2 BHK, 3 BHK",
      status: "Ready_to_Move",
      coverImage: "",
    },
  })

  // Open Add Dialog
  const handleAdd = () => {
    setEditingId(null)
    form.reset({
      name: "",
      developerId: "",
      type: "Residential",
      city: "",
      location: "",
      priceRange: "",
      configurations: "2 BHK, 3 BHK",
      status: "Ready_to_Move",
      coverImage: ""
    })
    setOpen(true)
  }

  // Open Edit Dialog
  const handleEdit = (prop: any) => {
    setEditingId(prop.id)
    const configsStr = Array.isArray(prop.configurations)
      ? prop.configurations.join(', ')
      : (prop.configurations || "")
    form.reset({
      name: prop.name,
      developerId: prop.developerId,
      type: prop.type,
      city: prop.city,
      location: prop.location,
      priceRange: prop.priceRange,
      configurations: configsStr,
      status: prop.status,
      coverImage: prop.coverImage || "",
    })
    setOpen(true)
  }

  // Confirm Delete
  const handleConfirmDelete = async () => {
    if (!deleteId) return;
    setIsDeleting(true)
    try {
      await deleteItem(deleteId)
      toast.success("Successfully deleted!")
      setDeleteId(null)
    } catch (err) {
      toast.error("Failed to delete property")
    } finally {
      setIsDeleting(false)
    }
  }

  // Handle Image Upload
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
      form.setValue('coverImage', res.data.fileUrl)
    } catch (err) {
      toast.error("Failed to upload image")
    } finally {
      setUploadingImage(false)
    }
  }

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true)
    try {
      const generatedSlug = values.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
      const configArray = values.configurations
        ? values.configurations.split(',').map((s) => s.trim()).filter(Boolean)
        : ["2 BHK", "3 BHK"]

      const existingProp = editingId ? properties?.find((p: any) => p.id === editingId) : null

      const payload = {
        ...values,
        slug: generatedSlug,
        areaRangeSqFt: existingProp?.areaRangeSqFt || "1000 - 2000 sq.ft",
        configurations: configArray.length > 0 ? configArray : ["2 BHK", "3 BHK"],
        amenities: existingProp?.amenities || ["Security", "Parking"],
        highlights: existingProp?.highlights || ["Great Location"],
        description: existingProp?.description || "A wonderful property for you.",
        galleryImages: existingProp?.galleryImages || []
      }

      if (editingId) {
        await updateItem(editingId, payload)
        toast.success("Successfully updated!")
      } else {
        await createItem(payload)
        toast.success("Successfully created!")
      }
      setOpen(false)
    } catch (err) {
      toast.error("Error saving property")
      console.error(err)
    } finally {
      setIsSubmitting(false)
    }
  }

  const filteredProperties = React.useMemo(() => {
    let result = properties
    if (filterType) {
      result = result.filter((prop: any) => prop.type === filterType)
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      result = result.filter((item: any) => Object.values(item).some(val => String(val).toLowerCase().includes(q)))
    }
    return result
  }, [properties, filterType, searchQuery])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Ready_to_Move': return 'bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20'
      case 'Under_Construction': return 'bg-amber-500/10 text-amber-500 hover:bg-amber-500/20'
      case 'New_Launch': return 'bg-blue-500/10 text-blue-500 hover:bg-blue-500/20'
      default: return 'bg-secondary text-secondary-foreground'
    }
  }

  return (
    <div className="flex flex-1 flex-col gap-6 min-w-0 max-w-full">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">Properties</h2>
          <p className="text-muted-foreground mt-2">
            Manage your real estate listings across all locations.
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
                {filterType ? `Type: ${filterType}` : "Filters"}
              </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Filter by Type</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setFilterType(null)}>All Properties</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterType('Residential')}>Residential</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterType('Luxury')}>Luxury</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterType('Commercial')}>Commercial</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterType('Industries')}>Industries</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterType('Land')}>Plots & Land</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {isAdmin && (
            <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger render={<Button onClick={handleAdd} className="rounded-full shadow-md hover:shadow-lg transition-all" />}>
                <Plus className="mr-2 h-4 w-4" />
                Add Property
              </DialogTrigger>
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{editingId ? "Edit Property" : "Add New Property"}</DialogTitle>
                <DialogDescription>
                  {editingId ? "Update the details of the property." : "Enter the details of the new property listing."}
                </DialogDescription>
              </DialogHeader>

              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="grid grid-cols-1 lg:grid-cols-2 gap-4 py-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem className="col-span-1 lg:col-span-2">
                        <FormLabel>Property Name</FormLabel>
                        <FormControl>
                          <Input placeholder="E.g. Prestige Falcon City" className="rounded-lg" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="developerId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Developer</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value || ""}>
                          <FormControl>
                            <SelectTrigger className="w-full rounded-lg">
                              <SelectValue placeholder="Select developer">
                                {field.value ? developers?.find((d: any) => d.id === field.value)?.name || field.value : "Select developer"}
                              </SelectValue>
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {developers?.map((dev: any) => (
                              <SelectItem key={dev.id} value={dev.id}>{dev.name}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="priceRange"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Price Range</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value || ""}>
                          <FormControl>
                            <SelectTrigger className="w-full rounded-lg">
                              <SelectValue placeholder="Select price range">{field.value ? field.value.replace(/_/g, ' ') : "Select price range"}</SelectValue>
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {PRICE_OPTIONS.map((pr) => (
                              <SelectItem key={pr} value={pr}>{pr}</SelectItem>
                            ))}
                            {field.value && !PRICE_OPTIONS.includes(field.value) && (
                              <SelectItem value={field.value}>{field.value}</SelectItem>
                            )}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Property Type</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value || ""}>
                          <FormControl>
                            <SelectTrigger className="w-full rounded-lg">
                              <SelectValue placeholder="Select type">{field.value ? field.value.replace(/_/g, ' ') : "Select type"}</SelectValue>
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Residential">Residential</SelectItem>
                            <SelectItem value="Luxury">Luxury</SelectItem>
                            <SelectItem value="Commercial">Commercial</SelectItem>
                            <SelectItem value="Industries">Industries</SelectItem>
                            <SelectItem value="Land">Plots & Land</SelectItem>
                            {field.value && !["Residential", "Luxury", "Commercial", "Industries", "Land"].includes(field.value) && (
                              <SelectItem value={field.value}>{field.value}</SelectItem>
                            )}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Status</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value || ""}>
                          <FormControl>
                            <SelectTrigger className="w-full rounded-lg">
                              <SelectValue placeholder="Select status">{field.value ? field.value.replace(/_/g, ' ') : "Select status"}</SelectValue>
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Ready_to_Move">Ready to Move</SelectItem>
                            <SelectItem value="Under_Construction">Under Construction</SelectItem>
                            <SelectItem value="New_Launch">New Launch</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="city"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>City</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value || ""}>
                          <FormControl>
                            <SelectTrigger className="w-full rounded-lg">
                              <SelectValue placeholder="Select city">{field.value ? field.value.replace(/_/g, ' ') : "Select city"}</SelectValue>
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {PROPERTY_CITIES.map((c) => (
                              <SelectItem key={c} value={c}>{c}</SelectItem>
                            ))}
                            {field.value && !PROPERTY_CITIES.includes(field.value) && (
                              <SelectItem value={field.value}>{field.value}</SelectItem>
                            )}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="location"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Location / Locality</FormLabel>
                        <FormControl>
                          <Input 
                            list="property-locations-list" 
                            placeholder="E.g. Sector 150, Whitefield, Worli..." 
                            className="rounded-lg" 
                            {...field} 
                          />
                        </FormControl>
                        <datalist id="property-locations-list">
                          {POPULAR_LOCATIONS.map((loc) => (
                            <option key={loc} value={loc} />
                          ))}
                        </datalist>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="configurations"
                    render={({ field }) => {
                      const selectedConfigs = (field.value || "")
                        .split(",")
                        .map((s: string) => s.trim())
                        .filter(Boolean)

                      const togglePreset = (preset: string) => {
                        let newConfigs: string[]
                        if (selectedConfigs.includes(preset)) {
                          newConfigs = selectedConfigs.filter((c: string) => c !== preset)
                        } else {
                          newConfigs = [...selectedConfigs, preset]
                        }
                        field.onChange(newConfigs.join(", "))
                      }

                      return (
                        <FormItem className="col-span-1 lg:col-span-2 space-y-2">
                          <FormLabel>Configurations / Unit Types</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="E.g. 2 BHK, 3 BHK, 4 BHK or Plot, Office Space"
                              className="rounded-lg"
                              {...field}
                            />
                          </FormControl>
                          <div className="flex flex-wrap items-center gap-1.5 pt-1">
                            <span className="text-[11px] text-muted-foreground mr-1 font-medium">Quick Select:</span>
                            {CONFIGURATION_PRESETS.map((preset) => {
                              const isSelected = selectedConfigs.includes(preset)
                              return (
                                <button
                                  type="button"
                                  key={preset}
                                  onClick={() => togglePreset(preset)}
                                  className={`text-[11px] px-2.5 py-0.5 rounded-full border transition-all cursor-pointer ${
                                    isSelected
                                      ? "bg-primary text-primary-foreground border-primary font-medium shadow-xs"
                                      : "bg-muted/40 text-muted-foreground border-border hover:bg-muted hover:text-foreground"
                                  }`}
                                >
                                  {isSelected ? `✓ ${preset}` : `+ ${preset}`}
                                </button>
                              )
                            })}
                          </div>
                          <p className="text-[11px] text-muted-foreground">
                            Click presets to toggle or enter comma-separated unit types (e.g. 2 BHK, 3 BHK, Plot).
                          </p>
                          <FormMessage />
                        </FormItem>
                      )
                    }}
                  />
                  <div className="col-span-1 lg:col-span-2 space-y-2">
                    <FormLabel>Cover Image</FormLabel>
                    <div className="flex items-center gap-4">
                      <Input type="file" accept="image/*" onChange={handleImageUpload} disabled={uploadingImage} />
                      {uploadingImage && <Loader2 className="h-4 w-4 animate-spin" />}
                    </div>
                    {form.watch('coverImage') && (
                      <img src={form.watch('coverImage')} alt="Preview" className="h-20 rounded-md object-cover mt-2" />
                    )}
                  </div>
                  
                  <DialogFooter className="col-span-1 lg:col-span-2 mt-4">
                    <Button type="submit" disabled={isSubmitting || uploadingImage} className="rounded-full px-8 w-fit mx-auto sm:mx-0">
                      {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      {editingId ? "Update Property" : "Save Property"}
                    </Button>
                  </DialogFooter>
                </form>
              </Form>

            </DialogContent>
          </Dialog>
          )}

          {/* Delete Confirmation Dialog */}
          {isAdmin && (
            <Dialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Delete Property</DialogTitle>
                <DialogDescription>
                  Are you sure you want to delete this property? This action cannot be undone.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter className="mt-4 flex sm:justify-end gap-2">
                <Button variant="outline" onClick={() => setDeleteId(null)} disabled={isDeleting} className="rounded-full">Cancel</Button>
                <Button variant="destructive" onClick={handleConfirmDelete} disabled={isDeleting} className="rounded-full">
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
          <CardTitle className="text-xl">All Properties</CardTitle>
          <CardDescription>
            Showing {filteredProperties.length} active listings.
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
                    <TableHead>Property</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Price Range</TableHead>
                    <TableHead>Status</TableHead>
                    {isAdmin && <TableHead className="text-right">Actions</TableHead>}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredProperties.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={isAdmin ? 7 : 6} className="h-24 text-center">
                        No results.
                      </TableCell>
                    </TableRow>
                  )}
                  {filteredProperties.map((prop: any, idx: number) => (
                    <TableRow key={prop.id}>
                      <TableCell className="font-medium text-muted-foreground">{idx + 1}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="flex aspect-square size-10 items-center justify-center rounded-md bg-secondary text-secondary-foreground overflow-hidden">
                            <PropertyImage src={prop.coverImage} alt={prop.name} />
                          </div>
                          <div className="flex flex-col">
                            <span className="font-medium">{prop.name}</span>
                            <span className="text-xs text-muted-foreground">
                              {Array.isArray(prop.configurations) && prop.configurations.length > 0
                                ? prop.configurations.join(', ')
                                : (prop.configurations || '—')}
                            </span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{prop.type}</TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span>{prop.city}</span>
                          <span className="text-xs text-muted-foreground">{prop.location}</span>
                        </div>
                      </TableCell>
                      <TableCell>{prop.priceRange}</TableCell>
                      <TableCell>
                        <Badge variant="secondary" className={getStatusColor(prop.status)}>
                          {prop.status?.replace(/_/g, ' ')}
                        </Badge>
                      </TableCell>
                      {isAdmin && (
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button variant="ghost" size="icon" onClick={() => handleEdit(prop)} className="h-8 w-8 text-muted-foreground hover:text-primary">
                              <Edit className="h-4 w-4" />
                              <span className="sr-only">Edit Details</span>
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => setDeleteId(prop.id)} className="h-8 w-8 text-muted-foreground hover:text-destructive">
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

function PropertyImage({ src, alt }: { src?: string; alt: string }) {
  const [error, setError] = React.useState(false)
  if (!src || error) return <Building2 className="size-4" />
  return <img src={src} alt={alt} className="object-cover size-full" onError={() => setError(true)} />
}


