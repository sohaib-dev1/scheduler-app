"use client"

import { format } from "date-fns"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useAppSelector } from "@/lib/hooks"
import { selectLeads } from "@/lib/features/leads/leadsSlice"
import Link from "next/link"

export function RecentLeads() {
  const leads = useAppSelector(selectLeads)

  // Sort leads by creation date (newest first) and take the first 10
  const recentLeads = [...leads]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 10)

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Company</TableHead>
            <TableHead>Call Date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Created</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {recentLeads.length > 0 ? (
            recentLeads.map((lead) => (
              <TableRow key={lead.id}>
                <TableCell className="font-medium">{lead.name}</TableCell>
                <TableCell>{lead.company}</TableCell>
                <TableCell>
                  {format(new Date(lead.callDate), "MMM d, yyyy")} at {lead.callTime}
                </TableCell>
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
                <TableCell>{format(new Date(lead.createdAt), "MMM d, yyyy")}</TableCell>
                <TableCell className="text-right">
                  <Button asChild size="sm" variant="outline">
                    <Link href={`/calendar/${lead.id}`}>View</Link>
                  </Button>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={6} className="text-center">
                No leads found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}
