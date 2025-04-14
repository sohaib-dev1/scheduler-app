"use client"

import { format } from "date-fns"
import Link from "next/link"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { useAppSelector } from "@/lib/hooks"
import { selectLeads } from "@/lib/features/leads/leadsSlice"

export function UpcomingCalls() {
  const leads = useAppSelector(selectLeads)

  // Filter for upcoming calls (scheduled status) and sort by date
  const upcomingCalls = leads
    .filter((lead) => lead.status === "scheduled")
    .sort((a, b) => new Date(a.callDate).getTime() - new Date(b.callDate).getTime())
    .slice(0, 10)

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Company</TableHead>
            <TableHead>Date & Time</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {upcomingCalls.length > 0 ? (
            upcomingCalls.map((call) => (
              <TableRow key={call.id}>
                <TableCell className="font-medium">{call.name}</TableCell>
                <TableCell>{call.company}</TableCell>
                <TableCell>
                  {format(new Date(call.callDate), "MMM d, yyyy")} at {call.callTime}
                </TableCell>
                <TableCell>{call.phone}</TableCell>
                <TableCell className="text-right">
                  <Button asChild size="sm" variant="outline">
                    <Link href={`/calendar/${call.id}`}>View</Link>
                  </Button>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={5} className="text-center">
                No upcoming calls
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}
