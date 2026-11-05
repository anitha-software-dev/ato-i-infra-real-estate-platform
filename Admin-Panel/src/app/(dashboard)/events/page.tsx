"use client"

import * as React from "react"
import { Search, Plus, Filter, CalendarDays, Edit, Trash2, Loader2, Users } from "lucide-react"
import * as z from "zod"
import { useForm } from "react-hook-form"
import toast from "react-hot-toast"
import { zodResolver } from "@hookform/resolvers/zod"
import Flatpickr from "react-flatpickr"
import "flatpickr/dist/themes/light.css"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
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
import { useEvents, useUserRole, api } from "@/hooks/useData"

const formSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters."),
  slug: z.string().optional(),
  type: z.string().min(1, "Type is required."),
  status: z.string().min(1, "Status is required."),
  mode: z.string().min(1, "Mode is required."),
  city: z.string().min(1, "City is required."),
  startDate: z.string().min(1, "Start Date is required."),
  coverImage: z.string().optional(),
  attendees: z.number().min(0).optional(),
})

const getTodayDateStr = () => {
  const d = new Date()
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

const formatDateForInput = (rawDate: any): string => {
  if (!rawDate) return getTodayDateStr()
  if (typeof rawDate === 'string') {
    return rawDate.split('T')[0]
  }
  const d = new Date(rawDate)
  if (isNaN(d.getTime())) return getTodayDateStr()
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export default function EventsPage() {
  const { data: events, isLoading, createItem, updateItem, deleteItem } = useEvents()
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
      title: "",
      slug: "",
      type: "Expo",
      status: "Upcoming",
      mode: "In_person",
      city: "",
      startDate: getTodayDateStr(),
      coverImage: "",
      attendees: 100,
    },
  })

  const handleAdd = () => {
    setEditingId(null)
    form.reset({
      title: "",
      slug: "",
      type: "Expo",
      status: "Upcoming",
      mode: "In_person",
      city: "",
      startDate: getTodayDateStr(),
      coverImage: "",
      attendees: 100,
    })
    setOpen(true)
  }

  const handleEdit = (evt: any) => {
    setEditingId(evt.id)
    form.reset({
      title: evt.title,
      slug: evt.slug,
      type: evt.type,
      status: evt.status,
      mode: evt.mode,
      city: evt.city,
      startDate: formatDateForInput(evt.startDate),
      coverImage: evt.coverImage || "",
      attendees: evt.attendees ?? 0,
    })
    setOpen(true)
  }

  const handleDelete = async () => {
    if (!deleteId) return;
    setIsDeleting(true);
    try {
      await deleteItem(deleteId)
      toast.success("Successfully deleted!")
      setDeleteId(null)
    } catch (err) {
      toast.error("Failed to delete event")
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
      const generatedSlug = values.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
      const payload = {
        ...values,
        attendees: Number(values.attendees) || 0,
        slug: generatedSlug,
        tagline: "Join us for this exciting event",
        description: "Event description goes here.",
        endDate: `${values.startDate}T23:59:59.000Z`,
        startDate: `${values.startDate}T00:00:00.000Z`,
        time: "10:00 AM - 05:00 PM",
        venueName: "Convention Center",
        address: "Main Street",
        galleryImages: [],
        speakers: [],
        highlights: []
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
      toast.error("Failed to save event")
    } finally {
      setIsSubmitting(false)
    }
  }

  const filteredEvents = React.useMemo(() => {
    let result = events || []
    if (filterStatus) {
      result = result.filter((evt: any) => evt.status === filterStatus)
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      result = result.filter((item: any) => Object.values(item).some(val => String(val).toLowerCase().includes(q)))
    }
    return result
  }, [events, filterStatus, searchQuery])

  return (
    <div className="flex flex-1 flex-col gap-6 min-w-0 max-w-full">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">Events</h2>
          <p className="text-muted-foreground mt-2">Manage events, expos, and attendee registrations.</p>
        </div>
        <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 w-full md:w-auto">
          <div className="relative w-full sm:w-auto">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input 
              type="search"
              placeholder="Search events..." 
              className="w-full sm:w-64 rounded-full bg-background pl-9 shadow-sm" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2 flex-1 sm:flex-none">
            <Select value={filterStatus || "All Status"} onValueChange={(val) => setFilterStatus(val === "All Status" ? null : val)}>
              <SelectTrigger className="w-full md:w-[150px] rounded-full shadow-sm">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All Status">All Status</SelectItem>
                <SelectItem value="Upcoming">Upcoming</SelectItem>
                <SelectItem value="Ongoing">Ongoing</SelectItem>
                <SelectItem value="Past">Past</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="icon" className="rounded-full shadow-sm" onClick={() => { setSearchQuery(""); setFilterStatus(null) }}>
               <Filter className="h-4 w-4" />
            </Button>
          </div>
          {isAdmin && (
            <Button onClick={handleAdd} className="rounded-full shadow-md hover:shadow-lg transition-all">
              <Plus className="mr-2 h-4 w-4" /> Add Event
            </Button>
          )}
        </div>
      </div>

      {isAdmin && (
        <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingId ? "Edit Event" : "Add Event"}</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem className="col-span-1 lg:col-span-2">
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter title" className="rounded-lg" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="startDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Start Date</FormLabel>
                      <FormControl>
                        <Flatpickr
                          value={field.value}
                          onChange={(selectedDates, dateStr) => {
                            if (dateStr) {
                              field.onChange(dateStr)
                            } else if (selectedDates && selectedDates.length > 0) {
                              const d = selectedDates[0]
                              const year = d.getFullYear()
                              const month = String(d.getMonth() + 1).padStart(2, '0')
                              const day = String(d.getDate()).padStart(2, '0')
                              field.onChange(`${year}-${month}-${day}`)
                            }
                          }}
                          options={{ dateFormat: "Y-m-d" }}
                          className="flex h-9 w-full min-w-0 rounded-lg border border-input bg-transparent px-2.5 py-1 text-base transition-colors outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 md:text-sm"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Type</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value || ""}>
                        <FormControl>
                          <SelectTrigger className="w-full rounded-lg">
                            <SelectValue placeholder="Select type">{field.value ? field.value.replace(/_/g, ' ') : "Select type"}</SelectValue>
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Expo">Expo</SelectItem>
                          <SelectItem value="Webinar">Webinar</SelectItem>
                          <SelectItem value="Seminar">Seminar</SelectItem>
                          <SelectItem value="Workshop">Workshop</SelectItem>
                          <SelectItem value="Property_Tour">Property Tour</SelectItem>
                          <SelectItem value="Networking">Networking</SelectItem>
                          <SelectItem value="Launch">Launch</SelectItem>
                          {field.value && !["Expo", "Webinar", "Seminar", "Workshop", "Property_Tour", "Networking", "Launch"].includes(field.value) && (
                            <SelectItem value={field.value}>{field.value.replace(/_/g, ' ')}</SelectItem>
                          )}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="mode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Mode</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value || ""}>
                        <FormControl>
                          <SelectTrigger className="w-full rounded-lg">
                            <SelectValue placeholder="Select mode">{field.value ? field.value.replace(/_/g, ' ') : "Select mode"}</SelectValue>
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="In_person">In Person</SelectItem>
                          <SelectItem value="Online">Online</SelectItem>
                          <SelectItem value="Hybrid">Hybrid</SelectItem>
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
                          <SelectItem value="Bangalore">Bangalore</SelectItem>
                          <SelectItem value="Mumbai">Mumbai</SelectItem>
                          <SelectItem value="Pune">Pune</SelectItem>
                          <SelectItem value="Noida">Noida</SelectItem>
                          <SelectItem value="Greater Noida">Greater Noida</SelectItem>
                          <SelectItem value="Delhi NCR">Delhi NCR</SelectItem>
                          <SelectItem value="Gurugram">Gurugram</SelectItem>
                          <SelectItem value="Hyderabad">Hyderabad</SelectItem>
                          <SelectItem value="Chennai">Chennai</SelectItem>
                          <SelectItem value="Kolkata">Kolkata</SelectItem>
                          <SelectItem value="Global">Global (Online)</SelectItem>
                          {field.value && !["Bangalore", "Mumbai", "Pune", "Noida", "Greater Noida", "Delhi NCR", "Gurugram", "Hyderabad", "Chennai", "Kolkata", "Global"].includes(field.value) && (
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
                          <SelectItem value="Upcoming">Upcoming</SelectItem>
                          <SelectItem value="Ongoing">Ongoing</SelectItem>
                          <SelectItem value="Past">Past</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="attendees"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Attendees / Registrations</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          min="0"
                          placeholder="e.g. 250" 
                          className="rounded-lg" 
                          value={field.value ?? 0}
                          onChange={(e) => field.onChange(Number(e.target.value) || 0)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="col-span-1 lg:col-span-2 space-y-2">
                  <FormLabel>Cover Image</FormLabel>
                  <div className="flex items-center gap-4">
                    <Input type="file" accept="image/*" onChange={handleImageUpload} disabled={uploadingImage} />
                    {uploadingImage && <Loader2 className="h-4 w-4 animate-spin" />}
                  </div>
                  {form.watch('coverImage') && (
                    <img src={form.watch('coverImage')} alt="Preview" className="h-32 rounded-md object-cover mt-2 w-full" />
                  )}
                </div>
                
                <DialogFooter className="col-span-1 lg:col-span-2 mt-4">
                  <Button type="submit" disabled={isSubmitting || uploadingImage} className="rounded-full px-8 w-fit mx-auto sm:mx-0">
                    {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {editingId ? "Update Event" : "Save Event"}
                  </Button>
                </DialogFooter>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
      )}

      <Card className="modern-card mb-10">
        <CardHeader className="pb-4">
          <CardTitle className="text-xl">All Events</CardTitle>
          <CardDescription>
            Showing {filteredEvents.length} upcoming and past events.
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
                    <TableHead>Event Title</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Mode / Location</TableHead>
                    <TableHead>Attendees</TableHead>
                    <TableHead>Status</TableHead>
                    {isAdmin && <TableHead className="text-right">Actions</TableHead>}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredEvents.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={isAdmin ? 8 : 7} className="h-24 text-center">
                        No results.
                      </TableCell>
                    </TableRow>
                  )}
                  {filteredEvents.map((evt: any, idx: number) => (
                    <TableRow key={evt.id}>
                      <TableCell className="font-medium text-muted-foreground">{idx + 1}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="flex aspect-square size-10 items-center justify-center rounded-md bg-secondary text-secondary-foreground overflow-hidden">
                            {evt.coverImage ? (
                               <img src={evt.coverImage} alt={evt.title} className="object-cover size-full" />
                            ) : (
                               <CalendarDays className="size-4" />
                            )}
                          </div>
                          <div className="flex flex-col">
                            <span className="font-medium">{evt.title}</span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{evt.type?.replace(/_/g, ' ')}</TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span>
                            {(() => {
                              const raw = typeof evt.startDate === 'string' ? evt.startDate.split('T')[0] : '';
                              if (raw && raw.includes('-')) {
                                const [y, m, d] = raw.split('-');
                                const dateObj = new Date(Number(y), Number(m) - 1, Number(d));
                                return dateObj.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
                              }
                              return evt.startDate ? new Date(evt.startDate).toLocaleDateString() : 'N/A';
                            })()}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                         <div className="flex flex-col">
                           <span>{evt.mode?.replace(/_/g, ' ')}</span>
                           {evt.mode !== 'Online' && (
                             <span className="text-xs text-muted-foreground">{evt.city}</span>
                           )}
                         </div>
                      </TableCell>
                      <TableCell>
                        <span className="inline-flex items-center gap-1 font-medium">
                          <Users className="size-3.5 text-muted-foreground" />
                          {(evt.attendees ?? 0).toLocaleString()}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Badge variant={evt.status === 'Upcoming' ? 'default' : 'secondary'}>
                          {evt.status}
                        </Badge>
                      </TableCell>
                      {isAdmin && (
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button variant="ghost" size="icon" onClick={() => handleEdit(evt)} className="h-8 w-8 text-muted-foreground hover:text-primary">
                              <Edit className="h-4 w-4" />
                              <span className="sr-only">Edit Event</span>
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => setDeleteId(evt.id)} className="h-8 w-8 text-muted-foreground hover:text-destructive">
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
