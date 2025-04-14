"use client"

import { useState } from "react"
import { format } from "date-fns"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { useAppDispatch, useAppSelector } from "@/lib/hooks"
import { selectLeadById, updateLead } from "@/lib/features/leads/leadsSlice"

export function CallDetails({ id }: { id: string }) {
  const { toast } = useToast()
  const dispatch = useAppDispatch()
  const lead = useAppSelector((state) => selectLeadById(state, id))
  const [notes, setNotes] = useState(lead?.notes || "")
  const [status, setStatus] = useState(lead?.status || "scheduled")
  const [stage, setStage] = useState(lead?.stage || "initial")
  const [isLoading, setIsLoading] = useState(false)

  if (!lead) {
    return <div>Call not found</div>
  }

  const handleSave = async () => {
    setIsLoading(true)

    try {
      // In a real app, you would make an API call here
      // For demo purposes, we'll simulate a successful update
      await new Promise((resolve) => setTimeout(resolve, 1000))

      dispatch(
        updateLead({
          id,
          changes: {
            notes,
            status,
            stage: stage as "initial" | "technical" | "final",
          },
        }),
      )

      toast({
        title: "Call details updated",
        description: "The call details have been updated successfully.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
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
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div>
          <h3 className="text-sm font-medium text-muted-foreground">Lead Information</h3>
          <div className="mt-2 space-y-2">
            <div>
              <span className="font-medium">Name:</span> {lead.name}
            </div>
            <div>
              <span className="font-medium">Company:</span> {lead.company}
            </div>
            <div>
              <span className="font-medium">Email:</span> {lead.email}
            </div>
            <div>
              <span className="font-medium">Phone:</span> {lead.phone}
            </div>
            <div>
              <span className="font-medium">Source:</span> {lead.source}
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-medium text-muted-foreground">Call Information</h3>
          <div className="mt-2 space-y-2">
            <div>
              <span className="font-medium">Date:</span> {format(new Date(lead.callDate), "PPP")}
            </div>
            <div>
              <span className="font-medium">Time:</span> {lead.callTime}
            </div>
            <div>
              <span className="font-medium">Duration:</span> {lead.duration} minutes
            </div>
            <div>
              <span className="font-medium">Created:</span> {format(new Date(lead.createdAt), "PPP")}
            </div>
            <div className="flex items-center gap-2">
              <span className="font-medium">Stage:</span>
              <Select value={stage} onValueChange={setStage}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select stage" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="initial">Initial Call</SelectItem>
                  <SelectItem value="technical">Technical Call</SelectItem>
                  <SelectItem value="final">Final Call</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-medium">Status:</span>
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="scheduled">Scheduled</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                  <SelectItem value="rescheduled">Rescheduled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>

      <div>
        <h3 className="mb-2 text-sm font-medium text-muted-foreground">Notes</h3>
        <Textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Add notes about the call"
          className="min-h-[150px]"
        />
      </div>

      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={isLoading}>
          {isLoading ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </div>
  )
}
