"use client"

import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

const data = [
  { name: "Jan", leads: 40, calls: 24, conversions: 18 },
  { name: "Feb", leads: 30, calls: 20, conversions: 15 },
  { name: "Mar", leads: 45, calls: 30, conversions: 22 },
  { name: "Apr", leads: 50, calls: 32, conversions: 25 },
  { name: "May", leads: 65, calls: 40, conversions: 30 },
  { name: "Jun", leads: 75, calls: 45, conversions: 35 },
  { name: "Jul", leads: 85, calls: 50, conversions: 40 },
  { name: "Aug", leads: 90, calls: 55, conversions: 42 },
  { name: "Sep", leads: 80, calls: 48, conversions: 38 },
  { name: "Oct", leads: 95, calls: 60, conversions: 45 },
  { name: "Nov", leads: 100, calls: 65, conversions: 50 },
  { name: "Dec", leads: 120, calls: 70, conversions: 55 },
]

export function Overview() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Performance Overview</CardTitle>
        <CardDescription>Monthly leads, calls, and conversions for the current year.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="leads" fill="#8884d8" name="Leads" />
              <Bar dataKey="calls" fill="#82ca9d" name="Calls" />
              <Bar dataKey="conversions" fill="#ffc658" name="Conversions" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
