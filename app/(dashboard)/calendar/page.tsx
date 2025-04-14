import type { Metadata } from "next"
import { CalendarView } from "@/components/calendar/calendar-view"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export const metadata: Metadata = {
  title: "Calendar - Employee Dashboard",
  description: "View and manage scheduled calls",
}

export default function Calendar() {
  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle>Call Schedule</CardTitle>
          <CardDescription>View all scheduled calls and manage your appointments.</CardDescription>
        </CardHeader>
        <CardContent>
          <CalendarView />
        </CardContent>
      </Card>
    </div>
  )
}
