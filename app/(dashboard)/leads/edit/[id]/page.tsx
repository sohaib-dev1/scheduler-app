import type { Metadata } from "next"
import { EditLeadForm } from "@/components/leads/edit-lead-form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export const metadata: Metadata = {
  title: "Edit Lead - Employee Dashboard",
  description: "Edit lead information",
}

export default function EditLead({ params }: { params: { id: string } }) {
  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="mb-6">
        <Button variant="outline" size="sm" asChild>
          <Link href="/leads">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Leads
          </Link>
        </Button>
      </div>
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Edit Lead</CardTitle>
          <CardDescription>Update the lead information and call details.</CardDescription>
        </CardHeader>
        <CardContent>
          <EditLeadForm id={params.id} />
        </CardContent>
      </Card>
    </div>
  )
}
