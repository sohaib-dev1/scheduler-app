import type { Metadata } from "next"
import { LeadForm } from "@/components/sales/lead-form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export const metadata: Metadata = {
  title: "Sales - Employee Dashboard",
  description: "Add new leads and manage sales",
}

export default function Sales() {
  return (
    <div className="max-w-4xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Add New Lead</CardTitle>
          <CardDescription>
            Enter the details of the potential lead and schedule a call with the development team.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <LeadForm />
        </CardContent>
      </Card>
    </div>
  )
}
