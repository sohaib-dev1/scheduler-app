import type { Metadata } from "next"
import { LeadsTable } from "@/components/leads/leads-table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export const metadata: Metadata = {
  title: "Leads - Employee Dashboard",
  description: "Manage all leads",
}

export default function Leads() {
  return (
    <div className="w-full">
      <Card className="w-full">
        <CardHeader>
          <CardTitle>All Leads</CardTitle>
          <CardDescription>View, edit, and manage all leads. Export data as CSV or PDF.</CardDescription>
        </CardHeader>
        <CardContent>
          <LeadsTable />
        </CardContent>
      </Card>
    </div>
  )
}
