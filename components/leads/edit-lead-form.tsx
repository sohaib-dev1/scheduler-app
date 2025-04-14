"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"
import { useAppDispatch, useAppSelector } from "@/lib/hooks"
import { selectLeadById, updateLead } from "@/lib/features/leads/leadsSlice"

const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  company: z.string().min(2, { message: "Company must be at least 2 characters" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  phone: z.string().min(10, { message: "Please enter a valid phone number" }),
  source: z.string().min(1, { message: "Please select a lead source" }),
  callDate: z.date({ required_error: "Please select a date for the call" }),
  callTime: z.string().min(1, { message: "Please select a time for the call" }),
  duration: z.string().min(1, { message: "Please select a duration for the call" }),
  notes: z.string().optional(),
  status: z.string().min(1, { message: "Please select a status" }),
  stage: z.string().min(1, { message: "Please select a stage" }),
})

const rescheduleSchema = z.object({
  callDate: z.date({ required_error: "Please select a date for the call" }),
  callTime: z.string().min(1, { message: "Please select a time for the call" }),
  duration: z.string().min(1, { message: "Please select a duration for the call" }),
  reason: z.string().min(1, { message: "Please provide a reason for rescheduling" }),
})

export function EditLeadForm({ id }: { id: string }) {
  const router = useRouter()
  const { toast } = useToast()
  const dispatch = useAppDispatch()
  const lead = useAppSelector((state) => selectLeadById(state, id))
  const [isLoading, setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState("details")

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      company: "",
      email: "",
      phone: "",
      source: "",
      callTime: "",
      duration: "",
      notes: "",
      status: "",
      stage: "",
    },
  })

  const rescheduleForm = useForm<z.infer<typeof rescheduleSchema>>({
    resolver: zodResolver(rescheduleSchema),
    defaultValues: {
      callDate: new Date(),
      callTime: "",
      duration: "30",
      reason: "",
    },
  })

  useEffect(() => {
    if (lead) {
      form.reset({
        name: lead.name,
        company: lead.company,
        email: lead.email,
        phone: lead.phone,
        source: lead.source,
        callDate: new Date(lead.callDate),
        callTime: lead.callTime,
        duration: lead.duration,
        notes: lead.notes || "",
        status: lead.status,
        stage: lead.stage,
      })

      rescheduleForm.reset({
        callDate: new Date(),
        callTime: "",
        duration: lead.duration,
        reason: "",
      })
    } else {
      // If lead not found, redirect to leads page
      router.push("/leads")
    }
  }, [lead, form, rescheduleForm, router])

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!lead) return

    setIsLoading(true)

    try {
      // In a real app, you would make an API call here
      // For demo purposes, we'll simulate a successful update
      await new Promise((resolve) => setTimeout(resolve, 1000))

      dispatch(
        updateLead({
          id,
          changes: {
            name: values.name,
            company: values.company,
            email: values.email,
            phone: values.phone,
            source: values.source,
            callDate: values.callDate.toISOString(),
            callTime: values.callTime,
            duration: values.duration,
            notes: values.notes || "",
            status: values.status as any,
            stage: values.stage as any,
          },
        }),
      )

      toast({
        title: "Lead updated",
        description: "The lead has been updated successfully.",
      })

      router.push("/leads")
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

  async function onReschedule(values: z.infer<typeof rescheduleSchema>) {
    if (!lead) return

    setIsLoading(true)

    try {
      // In a real app, you would make an API call here
      // For demo purposes, we'll simulate a successful update
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const updatedNotes = `${lead.notes}\n\n[${format(new Date(), "PPP")}] Rescheduled: ${values.reason}`

      dispatch(
        updateLead({
          id,
          changes: {
            callDate: values.callDate.toISOString(),
            callTime: values.callTime,
            duration: values.duration,
            notes: updatedNotes,
            status: "rescheduled",
          },
        }),
      )

      toast({
        title: "Call rescheduled",
        description: "The call has been rescheduled successfully.",
      })

      router.push("/leads")
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

  async function updateStage(newStage: "initial" | "technical" | "final") {
    if (!lead) return

    setIsLoading(true)

    try {
      // In a real app, you would make an API call here
      // For demo purposes, we'll simulate a successful update
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const updatedNotes = `${lead.notes}\n\n[${format(new Date(), "PPP")}] Stage updated from ${lead.stage} to ${newStage}`

      dispatch(
        updateLead({
          id,
          changes: {
            stage: newStage,
            notes: updatedNotes,
          },
        }),
      )

      form.setValue("stage", newStage)

      toast({
        title: "Stage updated",
        description: `The lead has been moved to the ${newStage} stage.`,
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

  if (!lead) {
    return <div>Loading...</div>
  }

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="details">Lead Details</TabsTrigger>
          <TabsTrigger value="stage">Update Stage</TabsTrigger>
          <TabsTrigger value="reschedule">Reschedule Call</TabsTrigger>
        </TabsList>
        <TabsContent value="details" className="mt-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Lead Name</FormLabel>
                      <FormControl>
                        <Input placeholder="John Doe" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="company"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Company</FormLabel>
                      <FormControl>
                        <Input placeholder="Acme Inc." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="john@example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl>
                        <Input placeholder="+1 (555) 123-4567" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="source"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Lead Source</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select lead source" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="website">Website</SelectItem>
                          <SelectItem value="referral">Referral</SelectItem>
                          <SelectItem value="social">Social Media</SelectItem>
                          <SelectItem value="email">Email Campaign</SelectItem>
                          <SelectItem value="event">Event</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="scheduled">Scheduled</SelectItem>
                          <SelectItem value="completed">Completed</SelectItem>
                          <SelectItem value="cancelled">Cancelled</SelectItem>
                          <SelectItem value="rescheduled">Rescheduled</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="stage"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Stage</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select stage" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="initial">Initial Call</SelectItem>
                          <SelectItem value="technical">Technical Call</SelectItem>
                          <SelectItem value="final">Final Call</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="callDate"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Call Date</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={"outline"}
                                className={cn(
                                  "w-full pl-3 text-left font-normal",
                                  !field.value && "text-muted-foreground",
                                )}
                              >
                                {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="callTime"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Call Time</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select time" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="09:00">9:00 AM</SelectItem>
                            <SelectItem value="09:30">9:30 AM</SelectItem>
                            <SelectItem value="10:00">10:00 AM</SelectItem>
                            <SelectItem value="10:30">10:30 AM</SelectItem>
                            <SelectItem value="11:00">11:00 AM</SelectItem>
                            <SelectItem value="11:30">11:30 AM</SelectItem>
                            <SelectItem value="12:00">12:00 PM</SelectItem>
                            <SelectItem value="12:30">12:30 PM</SelectItem>
                            <SelectItem value="13:00">1:00 PM</SelectItem>
                            <SelectItem value="13:30">1:30 PM</SelectItem>
                            <SelectItem value="14:00">2:00 PM</SelectItem>
                            <SelectItem value="14:30">2:30 PM</SelectItem>
                            <SelectItem value="15:00">3:00 PM</SelectItem>
                            <SelectItem value="15:30">3:30 PM</SelectItem>
                            <SelectItem value="16:00">4:00 PM</SelectItem>
                            <SelectItem value="16:30">4:30 PM</SelectItem>
                            <SelectItem value="17:00">5:00 PM</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="duration"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Duration (minutes)</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select duration" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="15">15 minutes</SelectItem>
                          <SelectItem value="30">30 minutes</SelectItem>
                          <SelectItem value="45">45 minutes</SelectItem>
                          <SelectItem value="60">1 hour</SelectItem>
                          <SelectItem value="90">1.5 hours</SelectItem>
                          <SelectItem value="120">2 hours</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Notes</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Add any additional information about the lead"
                        className="min-h-[150px]"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Include any relevant details that might help the developer prepare for the call.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => router.push("/leads")}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </form>
          </Form>
        </TabsContent>

        <TabsContent value="stage" className="mt-6">
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className={cn(lead.stage === "initial" && "border-primary")}>
                <CardHeader>
                  <CardTitle>Initial Call</CardTitle>
                  <CardDescription>First contact with the lead</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm mb-4">
                    This is the first stage where we introduce our services and understand the lead's requirements.
                  </p>
                  <Button
                    onClick={() => updateStage("initial")}
                    disabled={lead.stage === "initial" || isLoading}
                    className="w-full"
                    variant={lead.stage === "initial" ? "default" : "outline"}
                  >
                    {lead.stage === "initial" ? "Current Stage" : "Move to Initial Call"}
                  </Button>
                </CardContent>
              </Card>

              <Card className={cn(lead.stage === "technical" && "border-primary")}>
                <CardHeader>
                  <CardTitle>Technical Call</CardTitle>
                  <CardDescription>Detailed technical discussion</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm mb-4">
                    In this stage, our technical team discusses specific requirements and solutions with the lead.
                  </p>
                  <Button
                    onClick={() => updateStage("technical")}
                    disabled={lead.stage === "technical" || isLoading}
                    className="w-full"
                    variant={lead.stage === "technical" ? "default" : "outline"}
                  >
                    {lead.stage === "technical" ? "Current Stage" : "Move to Technical Call"}
                  </Button>
                </CardContent>
              </Card>

              <Card className={cn(lead.stage === "final" && "border-primary")}>
                <CardHeader>
                  <CardTitle>Final Call</CardTitle>
                  <CardDescription>Closing discussion and next steps</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm mb-4">
                    The final stage where we discuss pricing, timeline, and finalize the agreement with the lead.
                  </p>
                  <Button
                    onClick={() => updateStage("final")}
                    disabled={lead.stage === "final" || isLoading}
                    className="w-full"
                    variant={lead.stage === "final" ? "default" : "outline"}
                  >
                    {lead.stage === "final" ? "Current Stage" : "Move to Final Call"}
                  </Button>
                </CardContent>
              </Card>
            </div>

            <div className="flex justify-end">
              <Button variant="outline" onClick={() => router.push("/leads")}>
                Back to Leads
              </Button>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="reschedule" className="mt-6">
          <Form {...rescheduleForm}>
            <form onSubmit={rescheduleForm.handleSubmit(onReschedule)} className="space-y-6">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <FormField
                  control={rescheduleForm.control}
                  name="callDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>New Call Date</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-full pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground",
                              )}
                            >
                              {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) => date < new Date()}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={rescheduleForm.control}
                  name="callTime"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>New Call Time</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select time" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="09:00">9:00 AM</SelectItem>
                          <SelectItem value="09:30">9:30 AM</SelectItem>
                          <SelectItem value="10:00">10:00 AM</SelectItem>
                          <SelectItem value="10:30">10:30 AM</SelectItem>
                          <SelectItem value="11:00">11:00 AM</SelectItem>
                          <SelectItem value="11:30">11:30 AM</SelectItem>
                          <SelectItem value="12:00">12:00 PM</SelectItem>
                          <SelectItem value="12:30">12:30 PM</SelectItem>
                          <SelectItem value="13:00">1:00 PM</SelectItem>
                          <SelectItem value="13:30">1:30 PM</SelectItem>
                          <SelectItem value="14:00">2:00 PM</SelectItem>
                          <SelectItem value="14:30">2:30 PM</SelectItem>
                          <SelectItem value="15:00">3:00 PM</SelectItem>
                          <SelectItem value="15:30">3:30 PM</SelectItem>
                          <SelectItem value="16:00">4:00 PM</SelectItem>
                          <SelectItem value="16:30">4:30 PM</SelectItem>
                          <SelectItem value="17:00">5:00 PM</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={rescheduleForm.control}
                  name="duration"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Duration (minutes)</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select duration" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="15">15 minutes</SelectItem>
                          <SelectItem value="30">30 minutes</SelectItem>
                          <SelectItem value="45">45 minutes</SelectItem>
                          <SelectItem value="60">1 hour</SelectItem>
                          <SelectItem value="90">1.5 hours</SelectItem>
                          <SelectItem value="120">2 hours</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={rescheduleForm.control}
                name="reason"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Reason for Rescheduling</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Explain why the call needs to be rescheduled"
                        className="min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>This will be added to the lead's notes for future reference.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => router.push("/leads")}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? "Rescheduling..." : "Reschedule Call"}
                </Button>
              </div>
            </form>
          </Form>
        </TabsContent>
      </Tabs>
    </div>
  )
}
