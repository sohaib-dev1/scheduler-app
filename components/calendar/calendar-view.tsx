"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isToday, addMonths, subMonths } from "date-fns"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { useAppSelector } from "@/lib/hooks"
import { selectLeads } from "@/lib/features/leads/leadsSlice"

export function CalendarView() {
  const router = useRouter()
  const leads = useAppSelector(selectLeads)
  const [currentMonth, setCurrentMonth] = useState(new Date())

  const days = eachDayOfInterval({
    start: startOfMonth(currentMonth),
    end: endOfMonth(currentMonth),
  })

  const previousMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1))
  }

  const nextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1))
  }

  const getCallsForDay = (date: Date) => {
    return leads.filter((lead) => {
      const callDate = new Date(lead.callDate)
      return isSameDay(callDate, date)
    })
  }

  const handleDayClick = (date: Date, calls: any[]) => {
    if (calls.length > 0) {
      // If there are multiple calls, we could show a modal with a list
      // For simplicity, we'll navigate to the first call's details
      router.push(`/calendar/${calls[0].id}`)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">{format(currentMonth, "MMMM yyyy")}</h2>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="icon" onClick={previousMonth}>
            <ChevronLeft className="h-4 w-4" />
            <span className="sr-only">Previous month</span>
          </Button>
          <Button variant="outline" size="icon" onClick={nextMonth}>
            <ChevronRight className="h-4 w-4" />
            <span className="sr-only">Next month</span>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div key={day} className="py-2 font-medium">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {Array.from({ length: startOfMonth(currentMonth).getDay() }).map((_, i) => (
          <div key={`empty-${i}`} className="h-24 p-1" />
        ))}

        {days.map((day) => {
          const calls = getCallsForDay(day)
          return (
            <Card
              key={day.toString()}
              className={cn(
                "h-24 p-1 overflow-hidden",
                isToday(day) && "border-primary",
                calls.length > 0 && "cursor-pointer hover:bg-muted",
              )}
              onClick={() => handleDayClick(day, calls)}
            >
              <div className="flex flex-col h-full">
                <div className={cn("text-right p-1", isToday(day) && "font-bold text-primary")}>{format(day, "d")}</div>
                <div className="flex-1 overflow-y-auto">
                  {calls.map((call) => (
                    <Badge key={call.id} variant="outline" className="mb-1 w-full justify-start text-xs truncate">
                      {call.callTime} - {call.name}
                    </Badge>
                  ))}
                </div>
              </div>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
