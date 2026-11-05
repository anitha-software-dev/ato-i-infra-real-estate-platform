"use client"

import * as React from "react"
import { Search, MoreHorizontal, Plus, Filter, CalendarDays, Eye, Edit, Trash2, Loader2, FileText } from "lucide-react"
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
import { useContent, useUserRole, api } from "@/hooks/useData"

const CONTENT_CATEGORIES = [
  "Market",
  "Policy",
  "Investment",
  "Luxury",
  "Commercial",
  "Residential",
  "Lifestyle",
  "Finance",
  "Legal",
  "Awards",
]

const getTodayDateStr = () => {
  const d = new Date()
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

const formSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters."),
  slug: z.string().optional(),
  type: z.string().min(1, "Type is required."),
  category: z.string().optional(),
  status: z.string().min(1, "Status is required."),
  author: z.string().min(2, "Author is required."),
  readTime: z.string().min(1, "Read time is required."),
  publishDate: z.string().min(1, "Published date is required."),
  excerpt: z.string().optional(),
  featuredImage: z.string().optional(),
})

export default function ContentPage() {
  const { data: contents, isLoading, createItem, updateItem, deleteItem } = useContent()
  const { isAdmin } = useUserRole()
  
  const [filterType, setFilterType] = React.useState<string | null>(null)
  const [filterCategory, setFilterCategory] = React.useState<string | null>(null)
  const [open, setOpen] = React.useState(false)
  const [searchQuery, setSearchQuery] = React.useState("")
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [editingId, setEditingId] = React.useState<string | null>(null)
  const [deleteId, setDeleteId] = React.useState<string | null>(null)
  const [isDeleting, setIsDeleting] = React.useState(false)
  const [uploadingImage, setUploadingImage] = React.useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      slug: "",
      type: "Blog",
      category: "Market",
      status: "Draft",
      author: "",
      readTime: "5 min",
      publishDate: getTodayDateStr(),
      excerpt: "",
      featuredImage: "",
    },
  })

  const handleAdd = () => {
    setEditingId(null)
    form.reset({
      title: "",
      slug: "",
      type: "Blog",
      category: "Market",
      status: "Draft",
      author: "",
      readTime: "5 min",
      publishDate: getTodayDateStr(),
      excerpt: "",
      featuredImage: ""
    })
    setOpen(true)
  }

  const handleEdit = (content: any) => {
    setEditingId(content.id)
    let pDate = getTodayDateStr()
    if (content.publishDate) {
      pDate = content.publishDate.includes("T")
        ? content.publishDate.split("T")[0]
        : content.publishDate
    } else if (content.createdAt) {
      pDate = content.createdAt.includes("T")
        ? content.createdAt.split("T")[0]
        : content.createdAt
    }
    form.reset({
      title: content.title,
      slug: content.slug,
      type: content.type,
      category: content.category || "Market",
      status: content.status,
      author: content.author,
      readTime: content.readTime,
      publishDate: pDate,
      excerpt: content.excerpt,
      featuredImage: content.featuredImage || "",
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
      toast.error("Failed to delete article")
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
      form.setValue('featuredImage', res.data.fileUrl)
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
      const finalSlug = values.slug ? values.slug : generatedSlug;
      const payload = {
        ...values,
        slug: finalSlug,
        content: "Full article content goes here...",
        publishDate: values.publishDate ? new Date(values.publishDate).toISOString() : new Date().toISOString(),
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
      toast.error("Failed to save article")
    } finally {
      setIsSubmitting(false)
    }
  }

  const filteredContents = React.useMemo(() => {
    let result = contents || []
    if (filterType) {
      result = result.filter((content: any) => content.type === filterType)
    }
    if (filterCategory) {
      result = result.filter((content: any) => content.category === filterCategory)
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      result = result.filter((item: any) => Object.values(item).some(val => String(val).toLowerCase().includes(q)))
    }
    return result
  }, [contents, filterType, filterCategory, searchQuery])

  return (
    <div className="flex flex-1 flex-col gap-6 min-w-0 max-w-full">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">Content</h2>
          <p className="text-muted-foreground mt-2">Manage articles, blogs, and news.</p>
        </div>
        <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 w-full md:w-auto">
          <div className="relative w-full sm:w-auto">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input 
              type="search"
              placeholder="Search content..." 
              className="w-full sm:w-64 rounded-full bg-background pl-9 shadow-sm" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2 w-full md:w-auto">
            <Select value={filterType || "All Types"} onValueChange={(val) => setFilterType(val === "All Types" ? null : val)}>
              <SelectTrigger className="w-full md:w-[130px] rounded-full shadow-sm">
                <SelectValue placeholder="All Types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All Types">All Types</SelectItem>
                <SelectItem value="Blog">Blog</SelectItem>
                <SelectItem value="News">News</SelectItem>
                <SelectItem value="Press_Release">Press Release</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterCategory || "All Categories"} onValueChange={(val) => setFilterCategory(val === "All Categories" ? null : val)}>
              <SelectTrigger className="w-full md:w-[150px] rounded-full shadow-sm">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All Categories">All Categories</SelectItem>
                {CONTENT_CATEGORIES.map((cat) => (
                  <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button variant="outline" size="icon" className="rounded-full shadow-sm" onClick={() => { setSearchQuery(""); setFilterType(null); setFilterCategory(null) }}>
               <Filter className="h-4 w-4" />
            </Button>
          </div>
          {isAdmin && (
            <Button onClick={handleAdd} className="rounded-full shadow-md hover:shadow-lg transition-all">
              <Plus className="mr-2 h-4 w-4" /> Add Article
            </Button>
          )}
        </div>
      </div>

      {isAdmin && (
        <>
          <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{editingId ? "Edit Article" : "Add Article"}</DialogTitle>
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
                  name="author"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Author Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Author Name" className="rounded-lg" {...field} />
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
                      <FormLabel>Content Type</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value || ""}>
                        <FormControl>
                          <SelectTrigger className="w-full rounded-lg">
                            <SelectValue placeholder="Select type">{field.value ? field.value.replace(/_/g, ' ') : "Select type"}</SelectValue>
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Blog">Blog</SelectItem>
                          <SelectItem value="News">News</SelectItem>
                          <SelectItem value="Press_Release">Press Release</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value || "Market"}>
                        <FormControl>
                          <SelectTrigger className="w-full rounded-lg">
                            <SelectValue placeholder="Select category">{field.value || "Select category"}</SelectValue>
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {CONTENT_CATEGORIES.map((cat) => (
                            <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                          ))}
                          {field.value && !CONTENT_CATEGORIES.includes(field.value) && (
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
                          <SelectItem value="Draft">Draft</SelectItem>
                          <SelectItem value="Published">Published</SelectItem>
                          <SelectItem value="Archived">Archived</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="readTime"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Read Time</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value || ""}>
                        <FormControl>
                          <SelectTrigger className="w-full rounded-lg">
                            <SelectValue placeholder="Select read time">{field.value ? field.value.replace(/_/g, ' ') : "Select read time"}</SelectValue>
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="3 min">3 min</SelectItem>
                          <SelectItem value="5 min">5 min</SelectItem>
                          <SelectItem value="7 min">7 min</SelectItem>
                          <SelectItem value="10 min">10 min</SelectItem>
                          <SelectItem value="15 min">15 min</SelectItem>
                          <SelectItem value="20 min+">20 min+</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="publishDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Published Date</FormLabel>
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
                  name="excerpt"
                  render={({ field }) => (
                    <FormItem className="col-span-1 lg:col-span-2">
                      <FormLabel>Summary</FormLabel>
                      <FormControl>
                        <Input placeholder="A brief summary..." className="rounded-lg" {...field} />
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
                  {form.watch('featuredImage') && (
                    <img src={form.watch('featuredImage')} alt="Preview" className="h-32 rounded-md object-cover mt-2 w-full" />
                  )}
                </div>
                
                <DialogFooter className="col-span-1 lg:col-span-2 mt-4">
                  <Button type="submit" disabled={isSubmitting || uploadingImage} className="rounded-full px-8 w-fit mx-auto sm:mx-0">
                    {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {editingId ? "Update Article" : "Save Article"}
                  </Button>
                </DialogFooter>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <Dialog open={!!deleteId} onOpenChange={(isOpen) => !isOpen && setDeleteId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you absolutely sure?</DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete this article.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteId(null)} disabled={isDeleting}>Cancel</Button>
            <Button variant="destructive" onClick={handleDelete} disabled={isDeleting}>
              {isDeleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      </>
      )}

      <Card className="modern-card mb-10">
        <CardHeader className="pb-4">
          <CardTitle className="text-xl">Published Content</CardTitle>
          <CardDescription>
            Showing {filteredContents.length} articles and updates.
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
                    <TableHead>Title</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Author</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                    {isAdmin && <TableHead className="text-right">Actions</TableHead>}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredContents.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={isAdmin ? 8 : 7} className="h-24 text-center">
                        No results.
                      </TableCell>
                    </TableRow>
                  )}
                  {filteredContents.map((content: any, idx: number) => (
                    <TableRow key={content.id}>
                      <TableCell className="font-medium text-muted-foreground">{idx + 1}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="flex aspect-square size-10 items-center justify-center rounded-md bg-secondary text-secondary-foreground overflow-hidden">
                            {content.featuredImage ? (
                               <img 
                                 src={content.featuredImage} 
                                 alt={content.title} 
                                 className="object-cover size-full"
                                 onError={(e) => {
                                   (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=800&h=600&fit=crop";
                                 }}
                               />
                            ) : (
                               <FileText className="size-4" />
                            )}
                          </div>
                          <div className="flex flex-col">
                            <span className="font-medium">{content.title}</span>
                            <span className="text-xs text-muted-foreground">{content.readTime} read</span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{content.type?.replace(/_/g, ' ')}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="font-semibold text-xs">
                          {content.category || "General"}
                        </Badge>
                      </TableCell>
                      <TableCell>{content.author}</TableCell>
                      <TableCell>
                        <Badge variant={content.status === 'Published' ? 'default' : 'secondary'}>
                          {content.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {content.publishDate
                          ? new Date(content.publishDate).toLocaleDateString()
                          : content.createdAt
                          ? new Date(content.createdAt).toLocaleDateString()
                          : "—"}
                      </TableCell>
                      {isAdmin && (
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button variant="ghost" size="icon" onClick={() => handleEdit(content)} className="h-8 w-8 text-muted-foreground hover:text-primary">
                              <Edit className="h-4 w-4" />
                              <span className="sr-only">Edit Article</span>
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => setDeleteId(content.id)} className="h-8 w-8 text-muted-foreground hover:text-destructive">
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



