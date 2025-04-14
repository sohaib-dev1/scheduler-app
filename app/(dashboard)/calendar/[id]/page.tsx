import type { Metadata } from "next"
import { CallDetails } from "@/components/calendar/call-details"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export const metadata: Metadata = {
  title: "Call Details - Employee Dashboard",
  description: "View call details and add notes",
}

export default function CallDetailsPage({ params }: { params: { id: string } }) {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <Button variant="outline" size="sm" asChild>
          <Link href="/calendar">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Calendar
          </Link>
        </Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Call Details</CardTitle>
          <CardDescription>View the details of the scheduled call and add notes.</CardDescription>
        </CardHeader>
        <CardContent>
          <CallDetails id={params.id} />
        </CardContent>
      </Card>
    </div>
  )
}
