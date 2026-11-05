"use client"

import * as React from "react"
import {
  Search,
  Plus,
  Filter,
  Briefcase,
  Edit,
  Trash2,
  Loader2,
  Users,
  FileText,
  ExternalLink,
  Mail,
  Phone,
  Calendar,
  Eye,
  CheckCircle2,
  Clock,
  UserCheck,
} from "lucide-react"
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
import { useCareers, useJobApplications, useUserRole, api } from "@/hooks/useData"
import { JobApplication } from "@/lib/mockData"

const DEPARTMENT_OPTIONS = [
  "Sales",
  "Marketing",
  "Operations",
  "Technology",
  "Finance",
  "HR",
  "Legal",
  "Research",
]

const LOCATION_OPTIONS = [
  "Bangalore",
  "Noida",
  "Greater Noida",
  "Delhi NCR",
  "Gurugram",
  "Mumbai",
  "Pune",
  "Remote",
]

const EXPERIENCE_LEVELS = [
  "0-1 Year",
  "1-3 Years",
  "2-5 Years",
  "3-5 Years",
  "4-6 Years",
  "5-8 Years",
  "8+ Years",
]

const formSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters."),
  slug: z.string().optional(),
  department: z.string().min(2, "Department is required."),
  location: z.string().min(2, "Location is required."),
  type: z.string().min(1, "Type is required."),
  status: z.string().min(1, "Status is required."),
  experienceLevel: z.string().min(1, "Experience is required."),
  salaryRange: z.string().optional(),
  isUrgent: z.boolean().optional(),
})

export default function CareersPage() {
  const { role, isAdmin } = useUserRole()

  const { data: careers, isLoading: isLoadingCareers, createItem, updateItem, deleteItem, refetch: refetchCareers } = useCareers()
  const {
    data: applications,
    isLoading: isLoadingApps,
    updateItem: updateApplication,
    deleteItem: deleteApplication,
    refetch: refetchApplications,
  } = useJobApplications(isAdmin)

  const [activeTab, setActiveTab] = React.useState<"jobs" | "applications">("jobs")

  // Periodic background sync for real-time updates (every 30 seconds when window is active)
  React.useEffect(() => {
    if (!isAdmin) return
    const interval = setInterval(() => {
      if (typeof document !== "undefined" && document.visibilityState === "visible") {
        refetchApplications()
        refetchCareers()
      }
    }, 30000)
    return () => clearInterval(interval)
  }, [isAdmin, refetchApplications, refetchCareers])

  // Ensure non-admins stay on the jobs tab
  React.useEffect(() => {
    if (!isAdmin && activeTab !== "jobs") {
      setActiveTab("jobs")
    }
  }, [isAdmin, activeTab])

  // Careers filters & states
  const [filterDepartment, setFilterDepartment] = React.useState<string | null>(null)
  const [open, setOpen] = React.useState(false)
  const [searchQuery, setSearchQuery] = React.useState("")
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [editingId, setEditingId] = React.useState<string | null>(null)
  const [deleteId, setDeleteId] = React.useState<string | null>(null)
  const [isDeleting, setIsDeleting] = React.useState(false)

  // Applications filters & states
  const [appSearchQuery, setAppSearchQuery] = React.useState("")
  const [appFilterStatus, setAppFilterStatus] = React.useState<string | null>(null)
  const [appFilterJobId, setAppFilterJobId] = React.useState<string | null>(null)
  const [selectedApp, setSelectedApp] = React.useState<JobApplication | null>(null)
  const [deleteAppId, setDeleteAppId] = React.useState<string | null>(null)
  const [isDeletingApp, setIsDeletingApp] = React.useState(false)

  const availableDepartments = React.useMemo(() => {
    const deptsFromCareers = (careers || []).map((c: any) => c.department).filter(Boolean)
    return Array.from(new Set([...DEPARTMENT_OPTIONS, ...deptsFromCareers]))
  }, [careers])

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      slug: "",
      department: "",
      location: "",
      type: "Full_time",
      status: "Open",
      experienceLevel: "2-5 Years",
      salaryRange: "",
      isUrgent: false,
    },
  })

  const handleAdd = () => {
    setEditingId(null)
    form.reset({
      title: "",
      slug: "",
      department: "",
      location: "",
      type: "Full_time",
      status: "Open",
      experienceLevel: "2-5 Years",
      salaryRange: "",
      isUrgent: false,
    })
    setOpen(true)
  }

  const handleEdit = (career: any) => {
    setEditingId(career.id)
    form.reset({
      title: career.title,
      slug: career.slug,
      department: career.department,
      location: career.location,
      type: career.type,
      status: career.status,
      experienceLevel: career.experienceLevel,
      salaryRange: career.salaryRange || "",
      isUrgent: Boolean(career.isUrgent),
    })
    setOpen(true)
  }

  const handleDelete = async () => {
    if (!deleteId) return
    setIsDeleting(true)
    try {
      await deleteItem(deleteId)
      toast.success("Job posting deleted!")
      setDeleteId(null)
    } catch (err) {
      toast.error("Failed to delete job posting")
    } finally {
      setIsDeleting(false)
    }
  }

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true)
    try {
      const generatedSlug = values.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "")
      const payload = {
        ...values,
        slug: generatedSlug,
        salaryRange: values.salaryRange ? values.salaryRange.trim() : null,
        isUrgent: Boolean(values.isUrgent),
        description: `We are looking for an experienced ${values.title} to join our team.`,
        requirements: ["Bachelor's Degree", "Good communication skills"],
        postedDate: new Date().toISOString(),
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
      toast.error("Error saving job posting")
      console.error(err)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleAppStatusChange = async (appId: string, newStatus: string) => {
    try {
      await updateApplication(appId, { status: newStatus })
      toast.success(`Application status updated to ${newStatus}`)
    } catch (err) {
      console.error(err)
      toast.error("Failed to update status")
    }
  }

  const handleDeleteApp = async () => {
    if (!deleteAppId) return
    setIsDeletingApp(true)
    try {
      await deleteApplication(deleteAppId)
      toast.success("Application deleted successfully")
      setDeleteAppId(null)
    } catch (err) {
      console.error(err)
      toast.error("Failed to delete application")
    } finally {
      setIsDeletingApp(false)
    }
  }

  const formatAppDate = (dateVal?: string | Date | null) => {
    if (!dateVal) return "N/A"
    const d = new Date(dateVal)
    if (isNaN(d.getTime())) return "N/A"
    return d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const filteredCareers = React.useMemo(() => {
    let result = careers || []
    if (filterDepartment) {
      result = result.filter((job: any) => job.department === filterDepartment)
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      result = result.filter((item: any) =>
        Object.values(item).some((val) => String(val).toLowerCase().includes(q))
      )
    }
    return result
  }, [careers, filterDepartment, searchQuery])

  const filteredApplications = React.useMemo(() => {
    let result = applications || []
    if (appFilterStatus) {
      result = result.filter((app: any) => app.status === appFilterStatus)
    }
    if (appFilterJobId) {
      result = result.filter((app: any) => app.careerId === appFilterJobId)
    }
    if (appSearchQuery) {
      const q = appSearchQuery.toLowerCase()
      result = result.filter(
        (app: any) =>
          app.name?.toLowerCase().includes(q) ||
          app.email?.toLowerCase().includes(q) ||
          app.phone?.toLowerCase().includes(q) ||
          app.career?.title?.toLowerCase().includes(q)
      )
    }
    return result
  }, [applications, appFilterStatus, appFilterJobId, appSearchQuery])

  // Stats calculation
  const pendingCount = (applications || []).filter((a: any) => a.status === "Pending").length
  const reviewingCount = (applications || []).filter((a: any) => a.status === "Reviewing").length
  const shortlistedCount = (applications || []).filter((a: any) => a.status === "Shortlisted").length
  const hiredCount = (applications || []).filter((a: any) => a.status === "Hired").length

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Pending":
        return <Badge className="bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/30 hover:bg-amber-500/20">Pending</Badge>
      case "Reviewing":
        return <Badge className="bg-blue-500/15 text-blue-700 dark:text-blue-300 border-blue-500/30 hover:bg-blue-500/20">Reviewing</Badge>
      case "Shortlisted":
        return <Badge className="bg-purple-500/15 text-purple-700 dark:text-purple-300 border-purple-500/30 hover:bg-purple-500/20">Shortlisted</Badge>
      case "Hired":
        return <Badge className="bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/30 hover:bg-emerald-500/20">Hired</Badge>
      case "Rejected":
        return <Badge variant="destructive" className="bg-rose-500/15 text-rose-700 dark:text-rose-300 border-rose-500/30 hover:bg-rose-500/20">Rejected</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  return (
    <div className="flex flex-1 flex-col gap-6 min-w-0 max-w-full">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Careers & Recruitment
          </h2>
          <p className="text-muted-foreground mt-2">
            {isAdmin
              ? "Manage job postings and review received candidate applications."
              : "Manage job postings and view active careers."}
          </p>
        </div>

        {/* Tab Switcher - only visible to Admins */}
        {isAdmin && (
          <div className="flex items-center bg-muted/60 p-1 rounded-full border border-border/60">
            <Button
              variant={activeTab === "jobs" ? "default" : "ghost"}
              size="sm"
              onClick={() => setActiveTab("jobs")}
              className="rounded-full px-5 gap-2 text-xs font-semibold"
            >
              <Briefcase className="h-3.5 w-3.5" />
              <span>Job Openings</span>
              <span className="ml-1 text-[11px] opacity-80">({(careers || []).length})</span>
            </Button>
            <Button
              variant={activeTab === "applications" ? "default" : "ghost"}
              size="sm"
              onClick={() => setActiveTab("applications")}
              className="rounded-full px-5 gap-2 text-xs font-semibold"
            >
              <Users className="h-3.5 w-3.5" />
              <span>Applications</span>
              <span className="ml-1 text-[11px] opacity-80">({(applications || []).length})</span>
            </Button>
          </div>
        )}
      </div>

      {/* ======================================================== */}
      {/* TAB 1: JOB OPENINGS                                       */}
      {/* ======================================================== */}
      {activeTab === "jobs" && (
        <>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 w-full sm:w-auto">
              <div className="relative w-full sm:w-auto">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search jobs..."
                  className="w-full sm:w-64 rounded-full bg-background pl-9 shadow-sm"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger render={<Button variant="outline" className="rounded-full shadow-sm" />}>
                  <Filter className="mr-2 h-4 w-4" />
                  {filterDepartment ? `Dept: ${filterDepartment}` : "All Departments"}
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start">
                  <DropdownMenuLabel>Filter by Department</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => setFilterDepartment(null)}>All Departments</DropdownMenuItem>
                  {availableDepartments.map((dept) => (
                    <DropdownMenuItem key={dept} onClick={() => setFilterDepartment(dept)}>
                      {dept}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {isAdmin && (
              <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger render={<Button onClick={handleAdd} className="rounded-full shadow-md hover:shadow-lg transition-all" />}>
                <Plus className="mr-2 h-4 w-4" />
                Post Job
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                  <DialogTitle>{editingId ? "Edit Job" : "Post New Job"}</DialogTitle>
                  <DialogDescription>
                    Enter the details of the job opening.
                  </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                          <FormItem className="col-span-1 lg:col-span-2">
                            <FormLabel>Job Title</FormLabel>
                            <FormControl>
                              <Input placeholder="Sales Executive" className="rounded-lg" {...field} />
                            </FormControl>
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
                                  <SelectValue placeholder="Select status">
                                    {field.value ? field.value.replace(/_/g, " ") : "Select status"}
                                  </SelectValue>
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="Open">Open</SelectItem>
                                <SelectItem value="Closed">Closed</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="department"
                        render={({ field }) => {
                          const currentDeptOptions = field.value && !DEPARTMENT_OPTIONS.includes(field.value)
                            ? [field.value, ...DEPARTMENT_OPTIONS]
                            : DEPARTMENT_OPTIONS

                          return (
                            <FormItem>
                              <FormLabel>Department</FormLabel>
                              <Select onValueChange={field.onChange} value={field.value || ""}>
                                <FormControl>
                                  <SelectTrigger className="w-full rounded-lg">
                                    <SelectValue placeholder="Select department">
                                      {field.value || "Select department"}
                                    </SelectValue>
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {currentDeptOptions.map((dept) => (
                                    <SelectItem key={dept} value={dept}>
                                      {dept}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )
                        }}
                      />
                      <FormField
                        control={form.control}
                        name="location"
                        render={({ field }) => {
                          const currentLocOptions = field.value && !LOCATION_OPTIONS.includes(field.value)
                            ? [field.value, ...LOCATION_OPTIONS]
                            : LOCATION_OPTIONS

                          return (
                            <FormItem>
                              <FormLabel>Location</FormLabel>
                              <Select onValueChange={field.onChange} value={field.value || ""}>
                                <FormControl>
                                  <SelectTrigger className="w-full rounded-lg">
                                    <SelectValue placeholder="Select location">
                                      {field.value ? field.value.replace(/_/g, " ") : "Select location"}
                                    </SelectValue>
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {currentLocOptions.map((loc) => (
                                    <SelectItem key={loc} value={loc}>
                                      {loc}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )
                        }}
                      />

                      <FormField
                        control={form.control}
                        name="type"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Job Type</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value || ""}>
                              <FormControl>
                                <SelectTrigger className="w-full rounded-lg">
                                  <SelectValue placeholder="Select type">
                                    {field.value ? field.value.replace(/_/g, " ") : "Select type"}
                                  </SelectValue>
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="Full_time">Full Time</SelectItem>
                                <SelectItem value="Part_time">Part Time</SelectItem>
                                <SelectItem value="Contract">Contract</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="experienceLevel"
                        render={({ field }) => {
                          const currentExpOptions = field.value && !EXPERIENCE_LEVELS.includes(field.value)
                            ? [field.value, ...EXPERIENCE_LEVELS]
                            : EXPERIENCE_LEVELS

                          return (
                            <FormItem>
                              <FormLabel>Experience</FormLabel>
                              <Select onValueChange={field.onChange} value={field.value || ""}>
                                <FormControl>
                                  <SelectTrigger className="w-full rounded-lg">
                                    <SelectValue placeholder="Select experience">
                                      {field.value ? field.value.replace(/_/g, " ") : "Select experience"}
                                    </SelectValue>
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {currentExpOptions.map((exp) => (
                                    <SelectItem key={exp} value={exp}>
                                      {exp}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )
                        }}
                      />
                      <FormField
                        control={form.control}
                        name="salaryRange"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Salary Range / Compensation</FormLabel>
                            <FormControl>
                              <Input
                                list="career-salary-suggestions"
                                placeholder="e.g. ₹ 6L - 9L or Competitive"
                                className="rounded-lg"
                                {...field}
                                value={field.value || ""}
                              />
                            </FormControl>
                            <datalist id="career-salary-suggestions">
                              <option value="₹ 3L - 5L" />
                              <option value="₹ 5L - 8L" />
                              <option value="₹ 6L - 9L" />
                              <option value="₹ 8L - 12L" />
                              <option value="₹ 10L - 15L" />
                              <option value="₹ 12L - 18L" />
                              <option value="₹ 18L - 25L" />
                              <option value="₹ 25L - 35L" />
                              <option value="Competitive" />
                              <option value="Best in Industry" />
                            </datalist>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="isUrgent"
                        render={({ field }) => (
                          <FormItem className="col-span-1 lg:col-span-2 flex items-center justify-between rounded-lg border border-border/80 p-3 bg-muted/20">
                            <div className="space-y-0.5">
                              <FormLabel className="text-sm font-medium">Urgent Hiring</FormLabel>
                              <p className="text-xs text-muted-foreground">
                                Display an &quot;Urgent&quot; badge to attract top talent faster.
                              </p>
                            </div>
                            <FormControl>
                              <input
                                type="checkbox"
                                checked={Boolean(field.value)}
                                onChange={(e) => field.onChange(e.target.checked)}
                                className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary cursor-pointer accent-primary"
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </div>

                    <DialogFooter className="mt-4">
                      <Button type="submit" disabled={isSubmitting} className="rounded-full px-8 w-fit mx-auto sm:mx-0">
                        {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        {editingId ? "Update Job" : "Post Job"}
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
                  <DialogTitle>Delete Job</DialogTitle>
                  <DialogDescription>
                    Are you sure you want to delete this job posting? This action cannot be undone.
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

          <Card className="modern-card mb-10">
            <CardHeader className="pb-4">
              <CardTitle className="text-xl">Job Openings</CardTitle>
              <CardDescription>
                Showing {filteredCareers.length} active and closed positions.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoadingCareers ? (
                <div className="space-y-4">
                  <Skeleton className="h-10 w-full rounded-xl" />
                  <Skeleton className="h-12 w-full rounded-xl" />
                  <Skeleton className="h-12 w-full rounded-xl" />
                </div>
              ) : (
                <div className="rounded-xl border border-border/50 overflow-hidden bg-background/50">
                  <Table>
                    <TableHeader className="bg-muted/30">
                      <TableRow className="hover:bg-transparent">
                        <TableHead className="w-16">S.No.</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Department</TableHead>
                        <TableHead>Location</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Status</TableHead>
                        {isAdmin && <TableHead>Applications</TableHead>}
                        {isAdmin && <TableHead className="text-right">Actions</TableHead>}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredCareers.length === 0 && (
                        <TableRow>
                          <TableCell colSpan={isAdmin ? 8 : 6} className="h-24 text-center">
                            No job postings found.
                          </TableCell>
                        </TableRow>
                      )}
                      {filteredCareers.map((job: any, idx: number) => {
                        const jobApps = (applications || []).filter((a: any) => a.careerId === job.id)
                        const pendingJobApps = jobApps.filter((a: any) => a.status === "Pending")
                        return (
                          <TableRow key={job.id}>
                            <TableCell className="font-medium text-muted-foreground">{idx + 1}</TableCell>
                            <TableCell>
                              <div className="flex items-center gap-3">
                                <div className="flex aspect-square size-10 items-center justify-center rounded-md bg-secondary text-secondary-foreground">
                                  <Briefcase className="size-4" />
                                </div>
                                <div className="flex flex-col">
                                  <div className="flex items-center gap-2">
                                    <span className="font-medium">{job.title}</span>
                                    {job.isUrgent && (
                                      <Badge variant="destructive" className="text-[10px] h-4 px-1.5 font-bold uppercase tracking-wider">
                                        Urgent
                                      </Badge>
                                    )}
                                  </div>
                                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                    <span>{job.experienceLevel}</span>
                                    {job.salaryRange && (
                                      <>
                                        <span>•</span>
                                        <span className="font-medium text-amber-600 dark:text-amber-400">{job.salaryRange}</span>
                                      </>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>{job.department}</TableCell>
                            <TableCell>{job.location}</TableCell>
                            <TableCell>{job.type?.replace(/_/g, " ")}</TableCell>
                            <TableCell>
                              <Badge variant={job.status === "Open" ? "default" : "secondary"}>
                                {job.status}
                              </Badge>
                            </TableCell>
                            {isAdmin && (
                              <TableCell>
                                {jobApps.length === 0 ? (
                                  <div
                                    className="inline-flex items-center gap-1.5 text-xs text-muted-foreground/60 px-2.5 py-1 rounded-full bg-muted/40 font-normal"
                                    title="No applications received yet"
                                  >
                                    <Users className="h-3 w-3 opacity-40" />
                                    <span>0 applicants</span>
                                  </div>
                                ) : (
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => {
                                      setAppFilterJobId(job.id)
                                      setActiveTab("applications")
                                    }}
                                    className="h-7 text-xs rounded-full gap-1.5 bg-primary/10 text-primary border-primary/25 hover:bg-primary hover:text-primary-foreground font-medium transition-all shadow-xs cursor-pointer"
                                    title="Click to view applicants for this role"
                                  >
                                    <Users className="h-3 w-3" />
                                    <span>
                                      {jobApps.length} {jobApps.length === 1 ? "applicant" : "applicants"}
                                    </span>
                                    {pendingJobApps.length > 0 && (
                                      <span className="ml-0.5 inline-flex items-center px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500 text-white leading-none">
                                        {pendingJobApps.length} new
                                      </span>
                                    )}
                                  </Button>
                                )}
                              </TableCell>
                            )}
                            {isAdmin && (
                              <TableCell className="text-right">
                                <div className="flex items-center justify-end gap-2">
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => handleEdit(job)}
                                    className="h-8 w-8 text-muted-foreground hover:text-primary"
                                  >
                                    <Edit className="h-4 w-4" />
                                    <span className="sr-only">Edit Posting</span>
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => setDeleteId(job.id)}
                                    className="h-8 w-8 text-muted-foreground hover:text-destructive"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                    <span className="sr-only">Delete</span>
                                  </Button>
                                </div>
                              </TableCell>
                            )}
                          </TableRow>
                        )
                      })}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </>
      )}

      {/* ======================================================== */}
      {/* TAB 2: APPLICATIONS (ADMIN ONLY)                          */}
      {/* ======================================================== */}
      {isAdmin && activeTab === "applications" && (
        <div className="space-y-6">
          {/* Quick Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <Card className="modern-card p-4 flex flex-col items-center justify-center text-center gap-2">
              <div className="p-2.5 sm:p-3 bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center">
                <Users className="h-5 w-5" />
              </div>
              <div className="w-full text-center">
                <p className="text-xs text-muted-foreground text-center">Total Applicants</p>
                <p className="text-2xl font-bold text-center mt-0.5">{(applications || []).length}</p>
              </div>
            </Card>

            <Card className="modern-card p-4 flex flex-col items-center justify-center text-center gap-2">
              <div className="p-2.5 sm:p-3 bg-amber-500/10 text-amber-600 dark:text-amber-400 rounded-full flex items-center justify-center">
                <Clock className="h-5 w-5" />
              </div>
              <div className="w-full text-center">
                <p className="text-xs text-muted-foreground text-center">Pending Review</p>
                <p className="text-2xl font-bold text-amber-600 dark:text-amber-400 text-center mt-0.5">{pendingCount}</p>
              </div>
            </Card>

            <Card className="modern-card p-4 flex flex-col items-center justify-center text-center gap-2">
              <div className="p-2.5 sm:p-3 bg-purple-500/10 text-purple-600 dark:text-purple-400 rounded-full flex items-center justify-center">
                <UserCheck className="h-5 w-5" />
              </div>
              <div className="w-full text-center">
                <p className="text-xs text-muted-foreground text-center">Shortlisted</p>
                <p className="text-2xl font-bold text-purple-600 dark:text-purple-400 text-center mt-0.5">{shortlistedCount}</p>
              </div>
            </Card>

            <Card className="modern-card p-4 flex flex-col items-center justify-center text-center gap-2">
              <div className="p-2.5 sm:p-3 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center">
                <CheckCircle2 className="h-5 w-5" />
              </div>
              <div className="w-full text-center">
                <p className="text-xs text-muted-foreground text-center">Hired</p>
                <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 text-center mt-0.5">{hiredCount}</p>
              </div>
            </Card>
          </div>

          {/* Filters & Search */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 w-full sm:w-auto">
              <div className="relative w-full sm:w-auto">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search candidate, email, role..."
                  className="w-full sm:w-64 md:w-72 rounded-full bg-background pl-9 shadow-sm"
                  value={appSearchQuery}
                  onChange={(e) => setAppSearchQuery(e.target.value)}
                />
              </div>

              <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                {/* Status Filter */}
                <DropdownMenu>
                  <DropdownMenuTrigger render={<Button variant="outline" className="rounded-full shadow-sm text-xs" />}>
                    <Filter className="mr-1.5 h-3.5 w-3.5" />
                    {appFilterStatus ? `Status: ${appFilterStatus}` : "All Statuses"}
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start">
                    <DropdownMenuItem onClick={() => setAppFilterStatus(null)}>All Statuses</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => setAppFilterStatus("Pending")}>Pending</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setAppFilterStatus("Reviewing")}>Reviewing</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setAppFilterStatus("Shortlisted")}>Shortlisted</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setAppFilterStatus("Hired")}>Hired</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setAppFilterStatus("Rejected")}>Rejected</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                {/* Job Filter */}
                <DropdownMenu>
                  <DropdownMenuTrigger render={<Button variant="outline" className="rounded-full shadow-sm text-xs" />}>
                    <Briefcase className="mr-1.5 h-3.5 w-3.5" />
                    {appFilterJobId
                      ? `Role: ${(careers || []).find((c: any) => c.id === appFilterJobId)?.title || "Selected"}`
                      : "All Positions"}
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="max-h-60 overflow-y-auto">
                    <DropdownMenuItem onClick={() => setAppFilterJobId(null)}>All Positions</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    {(careers || []).map((job: any) => (
                      <DropdownMenuItem key={job.id} onClick={() => setAppFilterJobId(job.id)}>
                        {job.title}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>

                {(appFilterStatus || appFilterJobId || appSearchQuery) && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setAppFilterStatus(null)
                      setAppFilterJobId(null)
                      setAppSearchQuery("")
                    }}
                    className="text-xs text-muted-foreground hover:text-foreground"
                  >
                    Clear Filters
                  </Button>
                )}
              </div>
            </div>
          </div>

          {/* Applications Table */}
          <Card className="modern-card mb-10">
            <CardHeader className="pb-4">
              <CardTitle className="text-xl">Candidate Applications</CardTitle>
              <CardDescription>
                Showing {filteredApplications.length} candidate applications.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoadingApps ? (
                <div className="space-y-4">
                  <Skeleton className="h-10 w-full rounded-xl" />
                  <Skeleton className="h-12 w-full rounded-xl" />
                  <Skeleton className="h-12 w-full rounded-xl" />
                </div>
              ) : (
                <div className="rounded-xl border border-border/50 overflow-hidden bg-background/50">
                  <Table>
                    <TableHeader className="bg-muted/30">
                      <TableRow className="hover:bg-transparent">
                        <TableHead className="w-16">S.No.</TableHead>
                        <TableHead>Candidate</TableHead>
                        <TableHead>Applied Role</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Resume</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredApplications.length === 0 && (
                        <TableRow>
                          <TableCell colSpan={7} className="h-28 text-center text-muted-foreground">
                            No job applications found matching your criteria.
                          </TableCell>
                        </TableRow>
                      )}
                      {filteredApplications.map((app: any, idx: number) => (
                        <TableRow key={app.id}>
                          <TableCell className="font-medium text-muted-foreground">{idx + 1}</TableCell>
                          <TableCell>
                            <div className="flex flex-col">
                              <span className="font-semibold text-[#0F172A] dark:text-white">{app.name}</span>
                              <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs text-muted-foreground mt-0.5">
                                <a
                                  href={`mailto:${app.email}`}
                                  className="flex items-center gap-1 hover:text-primary transition-colors"
                                >
                                  <Mail className="h-3 w-3" />
                                  <span>{app.email}</span>
                                </a>
                                <a
                                  href={`tel:${app.phone}`}
                                  className="flex items-center gap-1 hover:text-primary transition-colors"
                                >
                                  <Phone className="h-3 w-3" />
                                  <span>{app.phone}</span>
                                </a>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-col">
                              <span className="font-medium">{app.career?.title || "Position"}</span>
                              <span className="text-xs text-muted-foreground">
                                {app.career?.department || "General"} • {app.career?.location || "India"}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell className="text-xs text-muted-foreground whitespace-nowrap">
                            {formatAppDate(app.createdAt || app.appliedAt)}
                          </TableCell>
                          <TableCell>
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-8 text-xs rounded-lg gap-1.5 font-medium hover:bg-primary/10 hover:text-primary hover:border-primary/40 transition-all"
                              onClick={() => window.open(app.resumeUrl, "_blank")}
                            >
                              <FileText className="h-3.5 w-3.5 text-primary" />
                              <span>View Resume</span>
                              <ExternalLink className="h-3 w-3 opacity-60" />
                            </Button>
                          </TableCell>
                          <TableCell>
                            <Select
                              value={app.status}
                              onValueChange={(val) => handleAppStatusChange(app.id, val)}
                            >
                              <SelectTrigger className="w-32 h-8 text-xs rounded-full">
                                <SelectValue>{getStatusBadge(app.status)}</SelectValue>
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Pending">Pending</SelectItem>
                                <SelectItem value="Reviewing">Reviewing</SelectItem>
                                <SelectItem value="Shortlisted">Shortlisted</SelectItem>
                                <SelectItem value="Hired">Hired</SelectItem>
                                <SelectItem value="Rejected">Rejected</SelectItem>
                              </SelectContent>
                            </Select>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-1">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setSelectedApp(app)}
                                className="h-8 w-8 text-muted-foreground hover:text-primary"
                                title="View Candidate Profile"
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setDeleteAppId(app.id)}
                                className="h-8 w-8 text-muted-foreground hover:text-destructive"
                                title="Delete Application"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>

          {/* View Application Details Modal */}
          <Dialog open={!!selectedApp} onOpenChange={(open) => !open && setSelectedApp(null)}>
            <DialogContent className="sm:max-w-[550px]">
              <DialogHeader className="pr-12">
                <div className="flex items-center gap-3">
                  <DialogTitle className="text-lg font-bold">Candidate Details</DialogTitle>
                  {selectedApp && getStatusBadge(selectedApp.status)}
                </div>
                <DialogDescription>
                  Review full candidate application and background note.
                </DialogDescription>
              </DialogHeader>

              {selectedApp && (
                <div className="space-y-4 py-2 text-sm">
                  <div className="bg-muted/40 p-4 rounded-xl space-y-2 border border-border/50">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                      <div>
                        <h4 className="font-bold text-base text-foreground">{selectedApp.name}</h4>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          Applied for{" "}
                          <strong className="text-primary font-semibold">{selectedApp.career?.title || "Position"}</strong>
                        </p>
                      </div>
                      <Button
                        variant="default"
                        size="sm"
                        className="rounded-full text-xs gap-1.5 h-8 w-full sm:w-auto shrink-0"
                        onClick={() => window.open(selectedApp.resumeUrl, "_blank")}
                      >
                        <FileText className="h-3.5 w-3.5" />
                        <span>Download / View Resume</span>
                      </Button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 border-t border-border/40 text-xs">
                      <div className="flex items-center gap-1.5 text-muted-foreground">
                        <Mail className="h-3.5 w-3.5 text-primary" />
                        <a href={`mailto:${selectedApp.email}`} className="hover:underline text-foreground">
                          {selectedApp.email}
                        </a>
                      </div>
                      <div className="flex items-center gap-1.5 text-muted-foreground">
                        <Phone className="h-3.5 w-3.5 text-primary" />
                        <a href={`tel:${selectedApp.phone}`} className="hover:underline text-foreground">
                          {selectedApp.phone}
                        </a>
                      </div>
                      <div className="flex items-center gap-1.5 text-muted-foreground">
                        <Calendar className="h-3.5 w-3.5 text-primary" />
                        <span>{formatAppDate(selectedApp.createdAt || selectedApp.appliedAt)}</span>
                      </div>
                      {selectedApp.linkedin ? (
                        <div className="flex items-center gap-1.5 text-muted-foreground">
                          <ExternalLink className="h-3.5 w-3.5 text-primary" />
                          <a
                            href={selectedApp.linkedin}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary hover:underline font-medium"
                          >
                            LinkedIn Profile
                          </a>
                        </div>
                      ) : (
                        <span className="text-muted-foreground text-xs">No LinkedIn provided</span>
                      )}
                    </div>
                  </div>

                  <div>
                    <h5 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1.5">
                      Cover Note
                    </h5>
                    <div className="bg-background border border-border/60 rounded-xl p-3 text-xs leading-relaxed text-foreground whitespace-pre-line min-h-[80px]">
                      {selectedApp.coverNote || "No cover note provided by candidate."}
                    </div>
                  </div>

                  <div>
                    <h5 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1.5">
                      Change Status
                    </h5>
                    <div className="flex flex-wrap gap-2">
                      {(["Pending", "Reviewing", "Shortlisted", "Hired", "Rejected"] as const).map((st) => (
                        <Button
                          key={st}
                          variant={selectedApp.status === st ? "default" : "outline"}
                          size="sm"
                          className="h-8 text-xs rounded-full"
                          onClick={() => {
                            handleAppStatusChange(selectedApp.id, st)
                            setSelectedApp({ ...selectedApp, status: st })
                          }}
                        >
                          {st}
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              <DialogFooter>
                <Button variant="outline" onClick={() => setSelectedApp(null)} className="rounded-full">
                  Close
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Delete Application Modal */}
          <Dialog open={!!deleteAppId} onOpenChange={(open) => !open && setDeleteAppId(null)}>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Delete Application</DialogTitle>
                <DialogDescription>
                  Are you sure you want to remove this job application? This action cannot be undone.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter className="mt-4 flex sm:justify-end gap-2">
                <Button variant="outline" onClick={() => setDeleteAppId(null)} disabled={isDeletingApp}>
                  Cancel
                </Button>
                <Button variant="destructive" onClick={handleDeleteApp} disabled={isDeletingApp}>
                  {isDeletingApp && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Delete
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      )}
    </div>
  )
}
