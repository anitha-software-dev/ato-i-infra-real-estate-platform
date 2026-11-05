"use client"

import * as React from "react"
import {
  Home,
  CheckCircle2,
  Clock,
  AlertCircle,
  Search,
  Filter,
  ArrowRight,
  Phone,
  Mail,
  MapPin,
  Tag,
  FileCheck2,
  Trash2,
  Building2,
  Loader2,
  Edit,
  ExternalLink,
} from "lucide-react"
import toast from "react-hot-toast"
import axios from "axios"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
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
import { usePropertySubmissions, useDevelopers, API_URL, api } from "@/hooks/useData"
import { PropertySubmission } from "@/lib/mockData"
import { AdminGuard } from "@/components/admin-guard"

export default function OwnerSubmissionsPage() {
  const { data: submissions, isLoading, updateItem, deleteItem, refetch } = usePropertySubmissions()
  const { data: developers } = useDevelopers()

  const [searchQuery, setSearchQuery] = React.useState("")
  const [filterStatus, setFilterStatus] = React.useState<string>("all")
  const [filterType, setFilterType] = React.useState<string>("all")

  // Selected Submission Details / Edit Modal
  const [selectedItem, setSelectedItem] = React.useState<PropertySubmission | null>(null)
  const [notes, setNotes] = React.useState("")
  const [status, setStatus] = React.useState<string>("Pending_Review")
  const [isSaving, setIsSaving] = React.useState(false)

  // Convert to Live Property Modal
  const [convertItem, setConvertItem] = React.useState<PropertySubmission | null>(null)
  const [developerId, setDeveloperId] = React.useState("")
  const [propertyName, setPropertyName] = React.useState("")
  const [priceRange, setPriceRange] = React.useState("")
  const [isConverting, setIsConverting] = React.useState(false)

  const handleOpenDetails = (item: PropertySubmission) => {
    setSelectedItem(item)
    setNotes(item.notes || "")
    setStatus(item.status)
  }

  const handleSaveDetails = async () => {
    if (!selectedItem) return
    setIsSaving(true)
    try {
      await updateItem(selectedItem.id, { notes, status })
      toast.success("Submission updated successfully")
      setSelectedItem(null)
    } catch (err: any) {
      toast.error("Failed to update submission")
    } finally {
      setIsSaving(false)
    }
  }

  const handleOpenConvert = (item: PropertySubmission) => {
    setConvertItem(item)
    setPropertyName(`${item.propertyType} at ${item.location}`)
    setPriceRange(item.expectedPrice || "₹ 1 Cr - 2 Cr")
    if (developers.length > 0) {
      setDeveloperId(developers[0].id)
    }
  }

  const handleExecuteConvert = async () => {
    if (!convertItem) return
    setIsConverting(true)
    try {
      const res = await api.post(`/property-submissions/${convertItem.id}/convert`, {
        developerId,
        name: propertyName,
        priceRange,
      })
      if (res.data.success) {
        toast.success("Property converted and published to live catalog!")
        setConvertItem(null)
        await refetch()
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Conversion failed")
    } finally {
      setIsConverting(false)
    }
  }

  const handleDelete = async (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete submission from "${name}"?`)) {
      try {
        await deleteItem(id)
        toast.success("Submission deleted")
      } catch (err) {
        toast.error("Failed to delete")
      }
    }
  }

  const filteredSubmissions = React.useMemo(() => {
    return submissions.filter((sub) => {
      const matchesSearch =
        sub.ownerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        sub.ownerPhone.includes(searchQuery) ||
        (sub.ownerEmail && sub.ownerEmail.toLowerCase().includes(searchQuery.toLowerCase())) ||
        sub.location.toLowerCase().includes(searchQuery.toLowerCase())

      const matchesStatus = filterStatus === "all" || sub.status === filterStatus
      const matchesType = filterType === "all" || sub.propertyType === filterType

      return matchesSearch && matchesStatus && matchesType
    })
  }, [submissions, searchQuery, filterStatus, filterType])

  const pendingCount = submissions.filter((s) => s.status === "Pending_Review").length
  const verifiedCount = submissions.filter((s) => s.status === "Verified").length
  const listedCount = submissions.filter((s) => s.status === "Listed").length

  return (
    <AdminGuard>
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl">Property Owner Submissions</h1>
          <p className="text-muted-foreground">
            Review property listings submitted by owners via the website&apos;s &ldquo;List Your Property&rdquo; portal.
          </p>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="modern-card">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Submissions</CardTitle>
            <Home className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{isLoading ? "..." : submissions.length}</div>
            <p className="text-xs text-muted-foreground">From online registration</p>
          </CardContent>
        </Card>

        <Card className="modern-card">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Pending Review</CardTitle>
            <Clock className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-600">{isLoading ? "..." : pendingCount}</div>
            <p className="text-xs text-muted-foreground">Require initial inspection</p>
          </CardContent>
        </Card>

        <Card className="modern-card">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Verified by Team</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{isLoading ? "..." : verifiedCount}</div>
            <p className="text-xs text-muted-foreground">Title & docs cleared</p>
          </CardContent>
        </Card>

        <Card className="modern-card">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Published / Listed</CardTitle>
            <Building2 className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-600">{isLoading ? "..." : listedCount}</div>
            <p className="text-xs text-muted-foreground">Live on public portal</p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card className="modern-card">
        <CardHeader className="pb-3">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="relative w-full md:w-80">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search owner, phone, location..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 h-9"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <Select value={filterStatus} onValueChange={(val) => setFilterStatus(val || "all")}>
                <SelectTrigger className="w-36 h-9">
                  <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="Pending_Review">Pending Review</SelectItem>
                  <SelectItem value="Verified">Verified</SelectItem>
                  <SelectItem value="Listed">Listed</SelectItem>
                  <SelectItem value="Rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filterType} onValueChange={(val) => setFilterType(val || "all")}>
                <SelectTrigger className="w-36 h-9">
                  <SelectValue placeholder="All Types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="Residential">Residential</SelectItem>
                  <SelectItem value="Commercial">Commercial</SelectItem>
                  <SelectItem value="Land">Land / Plots</SelectItem>
                  <SelectItem value="Luxury">Luxury</SelectItem>
                  <SelectItem value="Industries">Industrial</SelectItem>
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
                  <TableHead className="w-16">S.No.</TableHead>
                  <TableHead>Owner Contact</TableHead>
                  <TableHead>Property Specs</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Expected Price</TableHead>
                  <TableHead>Review Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  Array.from({ length: 3 }).map((_, i) => (
                    <TableRow key={i}>
                      <TableCell><Skeleton className="h-6 w-8" /></TableCell>
                      <TableCell><Skeleton className="h-10 w-36" /></TableCell>
                      <TableCell><Skeleton className="h-8 w-28" /></TableCell>
                      <TableCell><Skeleton className="h-6 w-24" /></TableCell>
                      <TableCell><Skeleton className="h-6 w-20" /></TableCell>
                      <TableCell><Skeleton className="h-6 w-24" /></TableCell>
                      <TableCell><Skeleton className="h-8 w-24 ml-auto" /></TableCell>
                    </TableRow>
                  ))
                ) : filteredSubmissions.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="h-32 text-center text-muted-foreground">
                      No owner property submissions found.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredSubmissions.map((sub, idx) => (
                    <TableRow key={sub.id}>
                      <TableCell className="font-medium text-muted-foreground">{idx + 1}</TableCell>
                      <TableCell>
                        <div className="font-medium text-foreground">{sub.ownerName}</div>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground mt-0.5">
                          <Phone className="h-3 w-3" />
                          <a href={`tel:${sub.ownerPhone}`} className="hover:underline">{sub.ownerPhone}</a>
                        </div>
                        {sub.ownerEmail && (
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Mail className="h-3 w-3" />
                            <span className="truncate max-w-[150px]">{sub.ownerEmail}</span>
                          </div>
                        )}
                      </TableCell>

                      <TableCell>
                        <Badge variant="outline" className="font-semibold text-xs">
                          {sub.propertyType}
                        </Badge>
                        <div className="text-xs text-muted-foreground mt-1">
                          Purpose: <span className="font-medium text-foreground">{sub.purpose || "Sell"}</span>
                          {sub.areaSqFt && ` • ${sub.areaSqFt}`}
                        </div>
                      </TableCell>

                      <TableCell>
                        <div className="flex items-center gap-1 text-sm font-medium">
                          <MapPin className="h-3.5 w-3.5 text-primary shrink-0" />
                          <span>{sub.location}</span>
                        </div>
                        {sub.city && <div className="text-xs text-muted-foreground ml-4">{sub.city}</div>}
                      </TableCell>

                      <TableCell className="font-semibold text-foreground">
                        {sub.expectedPrice || "On Request"}
                      </TableCell>

                      <TableCell>
                        {sub.status === "Pending_Review" && (
                          <Badge className="bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20">
                            Pending Review
                          </Badge>
                        )}
                        {sub.status === "Verified" && (
                          <Badge className="bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20">
                            Verified
                          </Badge>
                        )}
                        {sub.status === "Listed" && (
                          <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20">
                            Listed & Live
                          </Badge>
                        )}
                        {sub.status === "Rejected" && (
                          <Badge variant="destructive">
                            Rejected
                          </Badge>
                        )}
                      </TableCell>

                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {sub.status !== "Listed" && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleOpenConvert(sub)}
                              className="h-8 text-xs font-medium text-emerald-600 border-emerald-500/30 hover:bg-emerald-500/10"
                            >
                              <FileCheck2 className="mr-1 h-3.5 w-3.5" />
                              Convert
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleOpenDetails(sub)}
                            className="h-8 w-8 p-0"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(sub.id, sub.ownerName)}
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

      {/* Review Details & Notes Modal */}
      <Dialog open={!!selectedItem} onOpenChange={(open) => !open && setSelectedItem(null)}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Submission Review & Internal Notes</DialogTitle>
            <DialogDescription>
              Update verification stage and log internal property notes.
            </DialogDescription>
          </DialogHeader>

          {selectedItem && (
            <div className="space-y-4 py-3">
              <div className="rounded-lg bg-muted/50 p-3 space-y-1.5 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Owner:</span>
                  <span className="font-semibold text-foreground">{selectedItem.ownerName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Phone:</span>
                  <span className="font-semibold text-foreground">{selectedItem.ownerPhone}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Property:</span>
                  <span className="font-medium text-foreground">{selectedItem.propertyType} ({selectedItem.purpose})</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Location:</span>
                  <span className="font-medium text-foreground">{selectedItem.location}</span>
                </div>
                {selectedItem.description && (
                  <div className="pt-2 border-t border-border/50 text-xs text-muted-foreground">
                    <span className="font-medium text-foreground">Remarks from owner: </span>
                    {selectedItem.description}
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label>Review Status</Label>
                <Select value={status} onValueChange={(val) => val && setStatus(val)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Pending_Review">Pending Review</SelectItem>
                    <SelectItem value="Verified">Verified by Team</SelectItem>
                    <SelectItem value="Listed">Listed on Portal</SelectItem>
                    <SelectItem value="Rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Internal Team Notes & Verification Checklist</Label>
                <Textarea
                  id="notes"
                  placeholder="Record property title verification, owner call summary, or inspection schedule..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={4}
                />
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedItem(null)}>
              Cancel
            </Button>
            <Button onClick={handleSaveDetails} disabled={isSaving}>
              {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Convert to Live Property Modal */}
      <Dialog open={!!convertItem} onOpenChange={(open) => !open && setConvertItem(null)}>
        <DialogContent className="sm:max-w-[480px]">
          <DialogHeader>
            <DialogTitle>Convert & Publish Live Property</DialogTitle>
            <DialogDescription>
              Create an official listing from this verified owner submission in your Properties inventory.
            </DialogDescription>
          </DialogHeader>

          {convertItem && (
            <div className="space-y-4 py-3">
              <div className="space-y-2">
                <Label htmlFor="propName">Listing Title</Label>
                <Input
                  id="propName"
                  value={propertyName}
                  onChange={(e) => setPropertyName(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>Developer / Builder Partner</Label>
                <Select value={developerId} onValueChange={(val) => val && setDeveloperId(val)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select builder" />
                  </SelectTrigger>
                  <SelectContent>
                    {developers.map((dev) => (
                      <SelectItem key={dev.id} value={dev.id}>
                        {dev.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="priceRange">Listing Price / Price Range</Label>
                <Input
                  id="priceRange"
                  value={priceRange}
                  onChange={(e) => setPriceRange(e.target.value)}
                  placeholder="e.g. ₹ 1.5 Cr - 2.5 Cr"
                />
              </div>

              <div className="rounded-lg bg-emerald-500/10 p-3 text-xs text-emerald-800 dark:text-emerald-300">
                This will automatically add the property to your active properties catalog and mark this submission as &ldquo;Listed&rdquo;.
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setConvertItem(null)}>
              Cancel
            </Button>
            <Button
              onClick={handleExecuteConvert}
              disabled={isConverting}
              className="bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              {isConverting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Publishing...
                </>
              ) : (
                "Publish Live Property"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
    </AdminGuard>
  )
}
