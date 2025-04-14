"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { format } from "date-fns"
import {
  Download,
  FileSpreadsheet,
  FileIcon as FilePdf,
  MoreHorizontal,
  Pencil,
  Trash,
  Plus,
  Search,
  Clock,
} from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { useAppDispatch, useAppSelector } from "@/lib/hooks"
import { selectLeads, removeLead } from "@/lib/features/leads/leadsSlice"

export function LeadsTable() {
  const router = useRouter()
  const { toast } = useToast()
  const dispatch = useAppDispatch()
  const leads = useAppSelector(selectLeads)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string | undefined>(undefined)
  const [stageFilter, setStageFilter] = useState<string | undefined>(undefined)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [leadToDelete, setLeadToDelete] = useState<string | null>(null)

  // Filter leads based on search term, status, and stage
  const filteredLeads = leads.filter((lead) => {
    const matchesSearch =
      searchTerm === "" ||
      lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.email.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = !statusFilter || lead.status === statusFilter
    const matchesStage = !stageFilter || lead.stage === stageFilter

    return matchesSearch && matchesStatus && matchesStage
  })

  const handleDelete = (id: string) => {
    setLeadToDelete(id)
    setDeleteDialogOpen(true)
  }

  const confirmDelete = () => {
    if (leadToDelete) {
      dispatch(removeLead(leadToDelete))
      toast({
        title: "Lead deleted",
        description: "The lead has been deleted successfully.",
      })
      setDeleteDialogOpen(false)
      setLeadToDelete(null)
    }
  }

  const exportToCSV = () => {
    // Create CSV content
    const headers = [
      "Name",
      "Company",
      "Email",
      "Phone",
      "Source",
      "Call Date",
      "Call Time",
      "Duration",
      "Stage",
      "Status",
      "Notes",
    ]
    const csvContent = [
      headers.join(","),
      ...filteredLeads.map((lead) =>
        [
          `"${lead.name}"`,
          `"${lead.company}"`,
          `"${lead.email}"`,
          `"${lead.phone}"`,
          `"${lead.source}"`,
          `"${format(new Date(lead.callDate), "yyyy-MM-dd")}"`,
          `"${lead.callTime}"`,
          `"${lead.duration}"`,
          `"${lead.stage}"`,
          `"${lead.status}"`,
          `"${lead.notes.replace(/"/g, '""')}"`,
        ].join(","),
      ),
    ].join("\n")

    // Create and download the file
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.setAttribute("href", url)
    link.setAttribute("download", `leads-${format(new Date(), "yyyy-MM-dd")}.csv`)
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    toast({
      title: "Export successful",
      description: "Leads have been exported to CSV.",
    })
  }

  const exportToPDF = () => {
    // In a real application, you would use a library like jsPDF
    // For this demo, we'll just show a toast
    toast({
      title: "PDF Export",
      description: "PDF export functionality would be implemented with a library like jsPDF.",
    })
  }

  const getStageBadge = (stage: string) => {
    switch (stage) {
      case "initial":
        return <Badge variant="outline">Initial Call</Badge>
      case "technical":
        return <Badge variant="secondary">Technical Call</Badge>
      case "final":
        return <Badge variant="default">Final Call</Badge>
      default:
        return <Badge variant="outline">{stage}</Badge>
    }
  }

  return (
    <div className="w-full space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search leads..."
              className="pl-8 w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={undefined}>All statuses</SelectItem>
              <SelectItem value="scheduled">Scheduled</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
              <SelectItem value="rescheduled">Rescheduled</SelectItem>
            </SelectContent>
          </Select>
          <Select value={stageFilter} onValueChange={setStageFilter}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Filter by stage" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={undefined}>All stages</SelectItem>
              <SelectItem value="initial">Initial Call</SelectItem>
              <SelectItem value="technical">Technical Call</SelectItem>
              <SelectItem value="final">Final Call</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <Button asChild variant="outline" size="sm">
            <Link href="/sales">
              <Plus className="mr-2 h-4 w-4" />
              Add Lead
            </Link>
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Export Options</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={exportToCSV}>
                <FileSpreadsheet className="mr-2 h-4 w-4" />
                Export as CSV
              </DropdownMenuItem>
              <DropdownMenuItem onClick={exportToPDF}>
                <FilePdf className="mr-2 h-4 w-4" />
                Export as PDF
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="rounded-md border w-full overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Company</TableHead>
              <TableHead>Call Date</TableHead>
              <TableHead>Duration</TableHead>
              <TableHead>Stage</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredLeads.length > 0 ? (
              filteredLeads.map((lead) => (
                <TableRow key={lead.id}>
                  <TableCell className="font-medium">{lead.name}</TableCell>
                  <TableCell>{lead.company}</TableCell>
                  <TableCell>
                    {format(new Date(lead.callDate), "MMM d, yyyy")} at {lead.callTime}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <Clock className="mr-1 h-3 w-3 text-muted-foreground" />
                      {lead.duration} min
                    </div>
                  </TableCell>
                  <TableCell>{getStageBadge(lead.stage)}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        lead.status === "completed"
                          ? "success"
                          : lead.status === "cancelled"
                            ? "destructive"
                            : lead.status === "rescheduled"
                              ? "warning"
                              : "outline"
                      }
                    >
                      {lead.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Open menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => router.push(`/calendar/${lead.id}`)}>
                          View details
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => router.push(`/leads/edit/${lead.id}`)}>
                          <Pencil className="mr-2 h-4 w-4" />
                          Edit lead
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => handleDelete(lead.id)}
                          className="text-destructive focus:text-destructive"
                        >
                          <Trash className="mr-2 h-4 w-4" />
                          Delete lead
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  No leads found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you sure you want to delete this lead?</DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete the lead and remove the data from our servers.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
