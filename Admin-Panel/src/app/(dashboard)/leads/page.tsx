"use client"

import * as React from "react"
import {
  Search,
  Plus,
  Filter,
  Edit,
  Trash2,
  Loader2,
  FileSpreadsheet,
  Eye,
  Globe,
  Calculator,
  Building2,
  Calendar,
  Mail,
  UserCheck,
  User,
  Users,
  ChevronDown,
  Phone,
  MapPin,
  MessageSquare,
} from "lucide-react"
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
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
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
import { useLeads, useProperties, useEvents, useUserRole } from "@/hooks/useData"
import { Lead } from "@/lib/mockData"

const INTEREST_OPTIONS = [
  "1 BHK Apartment",
  "2 BHK Apartment",
  "3 BHK Apartment",
  "4 BHK Apartment",
  "Luxury Penthouse",
  "Studio Apartment",
  "Villa / Duplex",
  "Residential Plot / Land",
  "Commercial Office",
  "Retail / Commercial Shop",
  "General Enquiry",
]

const POPULAR_LOCATIONS = [
  // Mumbai Micro-Markets
  "Worli, Mumbai",
  "Bandra, Mumbai",
  "Andheri, Mumbai",
  "Powai, Mumbai",
  "Lower Parel, Mumbai",
  "Juhu, Mumbai",
  "Thane, Mumbai",
  "Navi Mumbai",

  // Bangalore Micro-Markets
  "Whitefield, Bangalore",
  "Devanahalli, Bangalore",
  "Peenya, Bangalore",
  "Indiranagar, Bangalore",
  "Koramangala, Bangalore",
  "Sarjapur Road, Bangalore",
  "Hebbal, Bangalore",

  // Pune Micro-Markets
  "Kalyani Nagar, Pune",
  "Koregaon Park, Pune",
  "Hinjewadi, Pune",
  "Baner, Pune",
  "Viman Nagar, Pune",
  "Wakad, Pune",

  // Delhi NCR / Noida / Gurugram
  "Sector 150, Noida",
  "Sector 62, Noida",
  "Noida Expressway, Noida",
  "Yamuna Expressway, Greater Noida",
  "Golf Course Road, Gurugram",
  "Cyber City, Gurugram",
  "Sohna Road, Gurugram",
  "South Delhi, Delhi NCR",

  // Other Major Markets
  "Alibaug, Maharashtra",
  "Hitec City, Hyderabad",
  "Adyar, Chennai",
  "Salt Lake Sector V, Kolkata",
  "Satellite, Ahmedabad",

  // Major Cities
  "Mumbai",
  "Bangalore",
  "Pune",
  "Noida",
  "Delhi NCR",
  "Gurugram",
  "Hyderabad",
  "Chennai",
  "Other / Flexible",
]

const BUDGET_OPTIONS = [
  "Under ₹ 50 Lakhs",
  "₹ 50 Lakhs - ₹ 1 Crore",
  "₹ 1 Crore - ₹ 1.5 Crore",
  "₹ 1.5 Crore - ₹ 2.5 Crore",
  "₹ 2.5 Crore - ₹ 5 Crore",
  "₹ 5 Crore - ₹ 10 Crore",
  "Above ₹ 10 Crore",
  "Budget Flexible",
]

const getTodayDateStr = () => {
  const d = new Date()
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  email: z.string().email("Invalid email address.").optional().or(z.literal("")),
  phone: z.string().min(10, "Phone number must be at least 10 characters."),
  source: z.string().min(1, "Source is required."),
  status: z.string().min(1, "Status is required."),
  createdAt: z.string().min(1, "Date is required."),
  propertyId: z.string().optional().nullable(),
  eventId: z.string().optional().nullable(),
  interest: z.string().optional().nullable(),
  purpose: z.string().optional().nullable(),
  location: z.string().optional().nullable(),
  budget: z.string().optional().nullable(),
  message: z.string().optional().nullable(),
})

const SOURCE_OPTIONS = [
  { value: "Website", label: "Website Form" },
  { value: "Free_Consultation", label: "Advisory / EMI" },
  { value: "Property_Enquiry", label: "Property Enquiry" },
  { value: "Event_Registration", label: "Event Expo" },
  { value: "Contact_Form", label: "Contact Page" },
  { value: "Manual", label: "Manual Entry" },
]

const getSourceLabel = (val?: string | null): string => {
  if (!val) return ""
  const match = SOURCE_OPTIONS.find((opt) => opt.value === val)
  return match ? match.label : val.replace(/_/g, " ")
}

function LeadsPageContent() {
  const { data: leads = [], isLoading, createItem, updateItem, deleteItem } = useLeads()
  const { data: properties = [] } = useProperties()
  const { data: events = [] } = useEvents()
  const { isAdmin } = useUserRole()

  const [filterStatus, setFilterStatus] = React.useState<string>("all")
  const [filterSource, setFilterSource] = React.useState<string>("all")
  const [searchQuery, setSearchQuery] = React.useState("")
  const [open, setOpen] = React.useState(false)
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [editingId, setEditingId] = React.useState<string | null>(null)
  const [deleteId, setDeleteId] = React.useState<string | null>(null)
  const [isDeleting, setIsDeleting] = React.useState(false)
  const [viewLead, setViewLead] = React.useState<Lead | null>(null)

  const allLocationOptions = React.useMemo(() => {
    const set = new Set<string>()
    properties.forEach((p) => {
      const locStr = [p.location, p.city].filter(Boolean).join(", ")
      if (locStr) set.add(locStr)
      if (p.city) set.add(p.city)
    })
    POPULAR_LOCATIONS.forEach((loc) => set.add(loc))
    return Array.from(set)
  }, [properties])

  // Map leads to clean numeric IDs (e.g. 1001, 1002, ...) ordered chronologically
  const leadIdNumberMap = React.useMemo(() => {
    const map = new Map<string, number>()
    if (!Array.isArray(leads)) return map

    // Sort chronologically ascending (oldest lead gets 1001, then 1002, etc.)
    const sorted = [...leads].sort((a, b) => {
      const timeA = a.createdAt ? new Date(a.createdAt).getTime() : 0
      const timeB = b.createdAt ? new Date(b.createdAt).getTime() : 0
      if (timeA !== timeB) return timeA - timeB
      return (a.id || "").localeCompare(b.id || "")
    })

    sorted.forEach((l, index) => {
      if (l.id) {
        map.set(l.id, 1001 + index)
      }
    })

    return map
  }, [leads])

  const getLeadNumber = React.useCallback(
    (lead?: Lead | null): number => {
      if (!lead) return 1001
      if (typeof lead.id === "number") return lead.id
      if (typeof lead.id === "string" && /^\d+$/.test(lead.id)) return parseInt(lead.id, 10)

      if (lead.id && leadIdNumberMap.has(lead.id)) {
        return leadIdNumberMap.get(lead.id)!
      }

      // Stable numeric fallback derived from ID hash (always a 4-digit number between 1001 and 9999)
      let hash = 0
      const str = lead.id || ""
      for (let i = 0; i < str.length; i++) {
        hash = (hash << 5) - hash + str.charCodeAt(i)
        hash |= 0
      }
      return 1001 + (Math.abs(hash) % 8999)
    },
    [leadIdNumberMap]
  )

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      source: "Manual",
      status: "New",
      createdAt: getTodayDateStr(),
      propertyId: "none",
      eventId: "none",
      interest: "",
      purpose: "",
      location: "",
      budget: "",
      message: "",
    },
  })

  const handleAdd = () => {
    setEditingId(null)
    form.reset({
      name: "",
      email: "",
      phone: "",
      source: "Manual",
      status: "New",
      createdAt: getTodayDateStr(),
      propertyId: "none",
      eventId: "none",
      interest: "",
      purpose: "",
      location: "",
      budget: "",
      message: "",
    })
    setOpen(true)
  }

  const handleEdit = (lead: Lead) => {
    setEditingId(lead.id)
    let leadDate = getTodayDateStr()
    if (lead.createdAt) {
      leadDate = lead.createdAt.includes("T") ? lead.createdAt.split("T")[0] : lead.createdAt
    }
    form.reset({
      name: lead.name,
      email: lead.email || "",
      phone: lead.phone,
      source: lead.source,
      status: lead.status,
      createdAt: leadDate,
      propertyId: lead.propertyId || (lead.property as any)?.id || "none",
      eventId: lead.eventId || (lead.event as any)?.id || "none",
      interest: lead.interest || "",
      purpose: lead.purpose || "",
      location: lead.location || "",
      budget: lead.budget || "",
      message: lead.message || "",
    })
    setOpen(true)
  }

  const handleDelete = async () => {
    if (!deleteId) return
    setIsDeleting(true)
    try {
      await deleteItem(deleteId)
      toast.success("Lead successfully deleted")
      setDeleteId(null)
    } catch {
      toast.error("Failed to delete lead")
    } finally {
      setIsDeleting(false)
    }
  }

  const handleStatusUpdate = async (leadId: string, newStatus: string) => {
    try {
      await updateItem(leadId, { status: newStatus })
      toast.success(`Status updated to ${newStatus}`)
    } catch {
      toast.error("Failed to update status")
    }
  }

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true)
    try {
      const selectedDate = values.createdAt ? new Date(values.createdAt) : new Date()
      const payload = {
        ...values,
        createdAt: selectedDate.toISOString(),
        date: selectedDate.toISOString(),
        propertyId: values.propertyId && values.propertyId !== "none" ? values.propertyId : null,
        eventId: values.eventId && values.eventId !== "none" ? values.eventId : null,
        message: values.message !== undefined && values.message !== null ? values.message.trim() : (editingId ? undefined : "Logged via CRM."),
      }

      if (editingId) {
        await updateItem(editingId, payload)
        toast.success("Lead updated successfully!")
      } else {
        await createItem(payload)
        toast.success("Lead created successfully!")
      }
      setOpen(false)
    } catch (err) {
      toast.error("Error saving lead")
      console.error(err)
    } finally {
      setIsSubmitting(false)
    }
  }

  const exportToExcel = async () => {
    if (filteredLeads.length === 0) {
      toast.error("No leads to export")
      return
    }
    try {
      const XLSX = await import("xlsx")
      const headers = [
        "S.No.",
        "Date",
        "Lead Name",
        "Phone Number",
        "Email Address",
        "Lead Source",
        "Status",
        "Requirement",
        "Purpose",
        "Preferred Location",
        "Budget Range",
        "Inquiry Message / Customer Notes",
      ]

      const data = [
        headers,
        ...filteredLeads.map((l, index) => [
          index + 1,
          l.createdAt
            ? new Date(l.createdAt).toLocaleDateString()
            : "",
          l.name || "",
          (l.phone || "").trim(),
          l.email || "",
          getSourceLabel(l.source),
          l.status || "",
          l.property?.name || l.interest || "General Enquiry",
          l.purpose || "-",
          l.location || "-",
          (l.budget || "").replace(/₹\s*/g, "₹ ").trim() || "-",
          l.message || "-",
        ]),
      ]

      const ws = XLSX.utils.aoa_to_sheet(data)

      // Set explicit wide column widths so all data is clearly visible without cutoff
      ws["!cols"] = [
        { wch: 8 },  // S.No.
        { wch: 16 }, // Date
        { wch: 26 }, // Lead Name
        { wch: 18 }, // Phone Number
        { wch: 30 }, // Email Address
        { wch: 20 }, // Lead Source
        { wch: 14 }, // Status
        { wch: 32 }, // Requirement
        { wch: 12 }, // Purpose
        { wch: 22 }, // Location
        { wch: 20 }, // Budget
        { wch: 50 }, // Customer Message / Notes
      ]

      // Format Phone cells as text type so Excel/WPS never formats as scientific notation
      const range = XLSX.utils.decode_range(ws["!ref"] || "A1:L1")
      for (let R = 1; R <= range.e.r; ++R) {
        const phoneRef = XLSX.utils.encode_cell({ c: 3, r: R }) // col index 3 is Phone Number
        if (ws[phoneRef]) {
          ws[phoneRef].t = "s"
          ws[phoneRef].z = "@"
        }
      }

      const wb = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(wb, ws, "Leads")

      // Use binary array buffer and standard Blob for 100% reliable cross-browser download
      const wbout = XLSX.write(wb, { bookType: "xlsx", type: "array" })
      const blob = new Blob([wbout], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8",
      })
      const url = URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = url
      link.download = `atoi_infra_leads_${new Date().toISOString().slice(0, 10)}.xlsx`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)

      toast.success("Exported leads to Excel (.xlsx) successfully!")
    } catch (err) {
      console.error("Excel export error:", err)
      toast.error("Failed to export Excel file")
    }
  }

  const filteredLeads = React.useMemo(() => {
    return leads.filter((lead: Lead) => {
      const matchesStatus = filterStatus === "all" || lead.status === filterStatus
      const matchesSource = filterSource === "all" || lead.source === filterSource

      const q = searchQuery.toLowerCase().trim()
      const cleanNum = q.replace(/^#/, "")
      const leadNum = getLeadNumber(lead).toString()
      const matchesSearch =
        !q ||
        (cleanNum && leadNum.includes(cleanNum)) ||
        (lead.name && lead.name.toLowerCase().includes(q)) ||
        (lead.email && lead.email.toLowerCase().includes(q)) ||
        (lead.phone && lead.phone.includes(q)) ||
        (lead.location && lead.location.toLowerCase().includes(q)) ||
        (lead.interest && lead.interest.toLowerCase().includes(q)) ||
        (lead.purpose && lead.purpose.toLowerCase().includes(q)) ||
        (lead.message && lead.message.toLowerCase().includes(q)) ||
        (lead.property?.name && lead.property.name.toLowerCase().includes(q))

      return matchesStatus && matchesSource && matchesSearch
    })
  }, [leads, filterStatus, filterSource, searchQuery, getLeadNumber])

  const renderPurposeBadge = (purpose?: string | null) => {
    if (!purpose) return null
    const p = purpose.toLowerCase()
    let colorClass = "bg-muted text-muted-foreground border-border"
    if (p.includes("buy")) {
      colorClass = "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
    } else if (p.includes("sell")) {
      colorClass = "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20"
    } else if (p.includes("rent") || p.includes("lease")) {
      colorClass = "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20"
    } else if (p.includes("invest")) {
      colorClass = "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20"
    }
    return (
      <Badge variant="outline" className={`text-[11px] font-semibold uppercase tracking-wider py-0 px-1.5 ${colorClass}`}>
        {purpose}
      </Badge>
    )
  }

  const renderSourceBadge = (source: string) => {
    const s = source?.toLowerCase() || ""
    if (s.includes("website")) {
      return (
        <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 text-xs gap-1 font-medium">
          <Globe className="h-3 w-3" /> Website
        </Badge>
      )
    }
    if (s.includes("consultation") || s.includes("emi")) {
      return (
        <Badge className="bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20 text-xs gap-1 font-medium">
          <Calculator className="h-3 w-3" /> Advisory / EMI
        </Badge>
      )
    }
    if (s.includes("property")) {
      return (
        <Badge className="bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20 text-xs gap-1 font-medium">
          <Building2 className="h-3 w-3" /> Property Enquiry
        </Badge>
      )
    }
    if (s.includes("event")) {
      return (
        <Badge className="bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20 text-xs gap-1 font-medium">
          <Calendar className="h-3 w-3" /> Expo / Event
        </Badge>
      )
    }
    if (s.includes("contact")) {
      return (
        <Badge className="bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20 text-xs gap-1 font-medium">
          <Mail className="h-3 w-3" /> Contact Us
        </Badge>
      )
    }
    return (
      <Badge variant="outline" className="text-muted-foreground text-xs gap-1 font-medium">
        <UserCheck className="h-3 w-3" /> {source?.replace(/_/g, " ") || "Direct"}
      </Badge>
    )
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "New":
        return "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20"
      case "Contacted":
        return "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20"
      case "Qualified":
        return "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20"
      case "Converted":
        return "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
      case "Dropped":
        return "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  const totalLeads = leads.length
  const newLeads = leads.filter((l) => l.status === "New").length
  const convertedLeads = leads.filter((l) => l.status === "Converted").length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl">Customer Leads</h1>
          <p className="text-muted-foreground">
            Manage customer inquiries from website forms, EMI calculator, and property pages.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={exportToExcel}
            className="rounded-full shadow-sm border-emerald-500/30 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-500/10 hover:text-emerald-800 transition-all font-medium"
          >
            <FileSpreadsheet className="mr-2 h-4 w-4 text-emerald-600 dark:text-emerald-400" />
            Export Excel
          </Button>
          <Button onClick={handleAdd} className="rounded-full shadow-sm">
            <Plus className="mr-2 h-4 w-4" />
            Add Lead
          </Button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="modern-card">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Leads</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{isLoading ? "..." : totalLeads}</div>
            <p className="text-xs text-muted-foreground">All inquiries received</p>
          </CardContent>
        </Card>

        <Card className="modern-card">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">New Leads</CardTitle>
            <Badge className="bg-blue-500/10 text-blue-600 border-blue-500/20">Pending</Badge>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{isLoading ? "..." : newLeads}</div>
            <p className="text-xs text-muted-foreground">Waiting for response</p>
          </CardContent>
        </Card>

        <Card className="modern-card">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Closed Deals</CardTitle>
            <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20">Completed</Badge>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-600">{isLoading ? "..." : convertedLeads}</div>
            <p className="text-xs text-muted-foreground">Successfully closed</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters Bar */}
      <Card className="modern-card">
        <CardHeader className="pb-3">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div className="relative w-full lg:w-72">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search name, phone, email, location..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 h-9"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {/* Status Filter */}
              <Select value={filterStatus} onValueChange={(val) => setFilterStatus(val || "all")}>
                <SelectTrigger className="w-32 h-9">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="New">New</SelectItem>
                  <SelectItem value="Contacted">Contacted</SelectItem>
                  <SelectItem value="Qualified">Qualified</SelectItem>
                  <SelectItem value="Converted">Converted</SelectItem>
                  <SelectItem value="Dropped">Dropped</SelectItem>
                </SelectContent>
              </Select>

              {/* Source Filter */}
              <Select value={filterSource} onValueChange={(val) => setFilterSource(val || "all")}>
                <SelectTrigger className="w-40 h-9">
                  <SelectValue placeholder="Lead Source">
                    {filterSource === "all" ? "All Sources" : getSourceLabel(filterSource)}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Sources</SelectItem>
                  {SOURCE_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-14">S.No.</TableHead>
                  <TableHead>Lead Name</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Lead Source</TableHead>
                  <TableHead>Requirement</TableHead>
                  <TableHead>Purpose</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  Array.from({ length: 4 }).map((_, i) => (
                    <TableRow key={i}>
                      <TableCell><Skeleton className="h-6 w-8" /></TableCell>
                      <TableCell><Skeleton className="h-6 w-32" /></TableCell>
                      <TableCell><Skeleton className="h-10 w-28" /></TableCell>
                      <TableCell><Skeleton className="h-6 w-24" /></TableCell>
                      <TableCell><Skeleton className="h-10 w-36" /></TableCell>
                      <TableCell><Skeleton className="h-6 w-16" /></TableCell>
                      <TableCell><Skeleton className="h-6 w-24" /></TableCell>
                      <TableCell><Skeleton className="h-6 w-20" /></TableCell>
                      <TableCell><Skeleton className="h-8 w-24 ml-auto" /></TableCell>
                    </TableRow>
                  ))
                ) : filteredLeads.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} className="h-32 text-center text-muted-foreground">
                      No leads found matching your filters.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredLeads.map((lead: Lead, idx: number) => (
                    <TableRow key={lead.id}>
                      <TableCell className="font-medium text-muted-foreground">{idx + 1}</TableCell>
                      <TableCell className="font-semibold text-foreground">
                        <div
                          className="flex items-center gap-2 cursor-pointer group"
                          onClick={() => setViewLead(lead)}
                          title="Click to view lead details & message"
                        >
                          <span className="group-hover:text-primary transition-colors underline-offset-2 group-hover:underline">
                            {lead.name}
                          </span>
                        </div>
                        {lead.createdAt && (
                          <div className="text-xs text-muted-foreground font-normal">
                            {new Date(lead.createdAt).toLocaleDateString()}
                          </div>
                        )}
                      </TableCell>

                      <TableCell className="min-w-[170px]">
                        <div className="flex flex-col text-xs gap-0.5">
                          <a
                            href={`tel:${lead.phone}`}
                            className="font-medium text-foreground hover:text-primary transition-colors flex items-center gap-1"
                          >
                            <Phone className="h-3 w-3 text-muted-foreground" />
                            {lead.phone}
                          </a>
                          {lead.email ? (
                            <a
                              href={`mailto:${lead.email}`}
                              className="text-muted-foreground hover:text-primary transition-colors break-all flex items-center gap-1"
                            >
                              <Mail className="h-3 w-3 shrink-0" />
                              {lead.email}
                            </a>
                          ) : (
                            <span className="text-muted-foreground/50 italic text-[11px]">No email provided</span>
                          )}
                        </div>
                      </TableCell>

                      <TableCell>
                        {renderSourceBadge(lead.source)}
                      </TableCell>

                      <TableCell className="min-w-[170px]">
                        <div className="flex flex-col text-xs gap-0.5">
                          <span className="font-semibold text-foreground">
                            {lead.property?.name || lead.interest || "General Enquiry"}
                          </span>
                          {lead.budget && (
                            <span className="text-muted-foreground text-[11px]">
                              {lead.budget.replace(/₹\s*/g, "₹ ").trim()}
                            </span>
                          )}
                        </div>
                      </TableCell>

                      <TableCell className="whitespace-nowrap">
                        {lead.purpose ? renderPurposeBadge(lead.purpose) : <span className="text-xs text-muted-foreground/50 italic">—</span>}
                      </TableCell>

                      <TableCell className="min-w-[130px]">
                        {lead.location ? (
                          <div className="flex items-center gap-1.5 text-xs text-foreground font-medium">
                            <MapPin className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                            <span>{lead.location}</span>
                          </div>
                        ) : (
                          <span className="text-xs text-muted-foreground/50 italic">Flexible</span>
                        )}
                      </TableCell>

                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger render={<button className="outline-none border-none bg-transparent p-0" />}>
                            <Badge className={`cursor-pointer ${getStatusColor(lead.status)} gap-1`}>
                              {lead.status}
                              <ChevronDown className="h-3 w-3 opacity-60" />
                            </Badge>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent>
                            <DropdownMenuLabel>Change Status</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => handleStatusUpdate(lead.id, "New")}>New</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleStatusUpdate(lead.id, "Contacted")}>Contacted</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleStatusUpdate(lead.id, "Qualified")}>Qualified</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleStatusUpdate(lead.id, "Converted")}>Converted</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleStatusUpdate(lead.id, "Dropped")}>Dropped</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>

                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            title="View Lead Details & Message"
                            onClick={() => setViewLead(lead)}
                            className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            title="Edit Lead"
                            onClick={() => handleEdit(lead)}
                            className="h-8 w-8 p-0"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          {isAdmin && (
                            <Button
                              variant="ghost"
                              size="sm"
                              title="Delete Lead"
                              onClick={() => setDeleteId(lead.id)}
                              className="h-8 w-8 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
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

      {/* Add / Edit Lead Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[560px]">
          <DialogHeader>
            <DialogTitle>{editingId ? "Edit Lead Information" : "Add Lead"}</DialogTitle>
            <DialogDescription>
              {editingId ? "Update lead requirement, source, and status." : "Record a customer inquiry manually."}
            </DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-3">
              <div className="grid grid-cols-2 gap-3">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name *</FormLabel>
                      <FormControl>
                        <Input placeholder="Client name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number *</FormLabel>
                      <FormControl>
                        <Input placeholder="+91 98765 43210" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email Address</FormLabel>
                      <FormControl>
                        <Input placeholder="client@example.com" {...field} value={field.value || ""} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="createdAt"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Date</FormLabel>
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
                          className="flex h-9 w-full min-w-0 rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-1 focus-visible:ring-ring md:text-sm"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <FormField
                  control={form.control}
                  name="source"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Lead Source</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select Source">
                              {field.value ? getSourceLabel(field.value) : "Select Source"}
                            </SelectValue>
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {SOURCE_OPTIONS.map((opt) => (
                            <SelectItem key={opt.value} value={opt.value}>
                              {opt.label}
                            </SelectItem>
                          ))}
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
                      <Select onValueChange={field.onChange} value={field.value || "New"}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select Status">
                              {field.value || "Select Status"}
                            </SelectValue>
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="New">New</SelectItem>
                          <SelectItem value="Contacted">Contacted</SelectItem>
                          <SelectItem value="Qualified">Qualified</SelectItem>
                          <SelectItem value="Converted">Converted</SelectItem>
                          <SelectItem value="Dropped">Dropped</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <FormField
                  control={form.control}
                  name="propertyId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Associated Property</FormLabel>
                      <Select
                        onValueChange={(val) => {
                          field.onChange(val)
                          if (val && val !== "none") {
                            const selectedProp = properties.find((p) => p.id === val)
                            if (selectedProp) {
                              const propLoc = [selectedProp.location, selectedProp.city].filter(Boolean).join(", ")
                              if (propLoc) {
                                form.setValue("location", propLoc, { shouldValidate: true })
                              }
                              if (!form.getValues("interest") || form.getValues("interest") === "General Enquiry") {
                                form.setValue("interest", selectedProp.name, { shouldValidate: true })
                              }
                              if (selectedProp.priceRange && !form.getValues("budget")) {
                                form.setValue("budget", selectedProp.priceRange, { shouldValidate: true })
                              }
                            }
                          }
                        }}
                        value={field.value || "none"}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select Property">
                              {field.value && field.value !== "none"
                                ? properties.find((p) => p.id === field.value)?.name || "Select Property"
                                : "None / General Enquiry"}
                            </SelectValue>
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="none">None / General Enquiry</SelectItem>
                          {properties.map((p) => (
                            <SelectItem key={p.id} value={p.id}>
                              {p.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="eventId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Associated Event</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value || "none"}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select Event">
                              {field.value && field.value !== "none"
                                ? events.find((e) => e.id === field.value)?.title || "Select Event"
                                : "None / Not Applicable"}
                            </SelectValue>
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="none">None / Not Applicable</SelectItem>
                          {events.map((e) => (
                            <SelectItem key={e.id} value={e.id}>
                              {e.title}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <FormField
                  control={form.control}
                  name="interest"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Interest</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value || ""}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select interest">
                              {field.value || "Select interest"}
                            </SelectValue>
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {INTEREST_OPTIONS.map((opt) => (
                            <SelectItem key={opt} value={opt}>
                              {opt}
                            </SelectItem>
                          ))}
                          {field.value && !INTEREST_OPTIONS.includes(field.value) && (
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
                      <FormLabel>Preferred Location (Area, City)</FormLabel>
                      <FormControl>
                        <Input
                          list="lead-locations-list"
                          placeholder="E.g. Worli, Mumbai or Whitefield, Bangalore"
                          {...field}
                          value={field.value || ""}
                        />
                      </FormControl>
                      <datalist id="lead-locations-list">
                        {allLocationOptions.map((loc) => (
                          <option key={loc} value={loc} />
                        ))}
                      </datalist>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <FormField
                  control={form.control}
                  name="purpose"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Purpose</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value || ""}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select purpose">
                              {field.value || "Select purpose"}
                            </SelectValue>
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Buy">Buy</SelectItem>
                          <SelectItem value="Sell">Sell</SelectItem>
                          <SelectItem value="Rent">Rent</SelectItem>
                          <SelectItem value="Investment">Investment</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="budget"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Budget Range</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value || ""}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select budget">
                              {field.value || "Select budget"}
                            </SelectValue>
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {BUDGET_OPTIONS.map((bg) => (
                            <SelectItem key={bg} value={bg}>
                              {bg}
                            </SelectItem>
                          ))}
                          {field.value && !BUDGET_OPTIONS.includes(field.value) && (
                            <SelectItem value={field.value}>{field.value}</SelectItem>
                          )}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="message"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Customer Message / Inquiry Notes</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Inquiry details, specific requirements, EMI details, etc."
                        className="min-h-20 text-xs"
                        {...field}
                        value={field.value || ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter className="pt-2">
                <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : editingId ? (
                    "Save Changes"
                  ) : (
                    "Create Lead"
                  )}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* View Lead Details Dialog */}
      <Dialog open={!!viewLead} onOpenChange={(isOpen) => !isOpen && setViewLead(null)}>
        <DialogContent className="sm:max-w-[620px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-center justify-between pr-4">
              <DialogTitle className="text-xl font-bold flex items-center gap-2">
                Lead Details
                {viewLead && (
                  <Badge className={`${getStatusColor(viewLead.status)} text-xs ml-1`}>
                    {viewLead.status}
                  </Badge>
                )}
              </DialogTitle>
            </div>
            <DialogDescription>
              Complete customer submission and requirement details.
            </DialogDescription>
          </DialogHeader>

          {viewLead && (
            <div className="space-y-4 py-2">
              {/* Contact Information Card */}
              <div className="bg-muted/40 p-4 rounded-xl border space-y-3">
                <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Contact Information
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="text-xs text-muted-foreground block">Full Name</span>
                    <span className="font-semibold text-foreground">{viewLead.name}</span>
                  </div>
                  <div>
                    <span className="text-xs text-muted-foreground block">Phone</span>
                    <a
                      href={`tel:${viewLead.phone}`}
                      className="font-medium text-primary hover:underline flex items-center gap-1"
                    >
                      <Phone className="h-3 w-3" />
                      {viewLead.phone}
                    </a>
                  </div>
                  <div>
                    <span className="text-xs text-muted-foreground block">Email</span>
                    {viewLead.email ? (
                      <a
                        href={`mailto:${viewLead.email}`}
                        className="font-medium text-primary hover:underline flex items-center gap-1 break-all"
                      >
                        <Mail className="h-3 w-3 shrink-0" />
                        {viewLead.email}
                      </a>
                    ) : (
                      <span className="text-muted-foreground/60 italic text-xs">Not provided</span>
                    )}
                  </div>
                  <div>
                    <span className="text-xs text-muted-foreground block">Lead Source</span>
                    <div className="mt-0.5">{renderSourceBadge(viewLead.source)}</div>
                  </div>
                </div>
              </div>

              {/* Requirement & Preferences Card */}
              <div className="bg-muted/40 p-4 rounded-xl border space-y-3">
                <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Property Requirement & Budget
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="text-xs text-muted-foreground block">Requirement / Interest</span>
                    <span className="font-medium text-foreground">
                      {viewLead.interest || "General Enquiry"}
                    </span>
                  </div>
                  {viewLead.property?.name && (
                    <div>
                      <span className="text-xs text-muted-foreground block">Associated Property</span>
                      <span className="font-semibold text-primary flex items-center gap-1">
                        <Building2 className="h-3 w-3" />
                        {viewLead.property.name}
                      </span>
                    </div>
                  )}
                  {viewLead.event?.title && (
                    <div>
                      <span className="text-xs text-muted-foreground block">Associated Event</span>
                      <span className="font-semibold text-purple-600 dark:text-purple-400 flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {viewLead.event.title}
                      </span>
                    </div>
                  )}
                  <div>
                    <span className="text-xs text-muted-foreground block">Purpose</span>
                    <div className="mt-0.5">
                      {viewLead.purpose ? renderPurposeBadge(viewLead.purpose) : <span className="text-xs text-muted-foreground italic">Not specified</span>}
                    </div>
                  </div>
                  <div>
                    <span className="text-xs text-muted-foreground block">Preferred Location</span>
                    <span className="font-medium text-foreground flex items-center gap-1">
                      <MapPin className="h-3 w-3 text-muted-foreground" />
                      {viewLead.location || "Flexible"}
                    </span>
                  </div>
                  <div>
                    <span className="text-xs text-muted-foreground block">Budget</span>
                    <span className="font-semibold text-foreground">
                      {viewLead.budget || "Budget flexible"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Customer Message / Inquiry Note Card */}
              <div className="bg-muted/40 p-4 rounded-xl border space-y-2">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  <MessageSquare className="h-3.5 w-3.5 text-primary" />
                  Inquiry Message / Customer Notes
                </div>
                {viewLead.message ? (
                  <div className="bg-background p-3.5 rounded-lg border text-sm text-foreground whitespace-pre-wrap leading-relaxed">
                    {viewLead.message}
                  </div>
                ) : (
                  <div className="text-xs text-muted-foreground/60 italic py-1">
                    No additional message submitted with this lead.
                  </div>
                )}
              </div>

              {/* Metadata */}
              <div className="flex items-center text-xs text-muted-foreground pt-1 px-1">
                <span>Received: {viewLead.createdAt ? new Date(viewLead.createdAt).toLocaleDateString() : "Unknown"}</span>
              </div>
            </div>
          )}

          <DialogFooter className="pt-2 flex sm:justify-between items-center gap-2">
            <Button
              variant="outline"
              onClick={() => {
                const leadToEdit = viewLead
                setViewLead(null)
                if (leadToEdit) handleEdit(leadToEdit)
              }}
            >
              <Edit className="mr-2 h-4 w-4" />
              Edit Lead
            </Button>
            <Button onClick={() => setViewLead(null)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!deleteId} onOpenChange={(isOpen) => !isOpen && setDeleteId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Lead</DialogTitle>
            <DialogDescription>
              Are you sure you want to permanently delete this lead? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-4 flex sm:justify-end gap-2">
            <Button variant="outline" onClick={() => setDeleteId(null)} disabled={isDeleting}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete} disabled={isDeleting}>
              {isDeleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Delete Lead
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default function LeadsPage() {
  return <LeadsPageContent />
}
