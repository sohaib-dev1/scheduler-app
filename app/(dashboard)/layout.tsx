import type React from "react"
import type { Metadata } from "next"
import Header from "@/components/layout/header"
import Sidebar from "@/components/layout/sidebar"
import { SidebarProvider } from "@/components/ui/sidebar"

export const metadata: Metadata = {
  title: "Dashboard - Employee Dashboard",
  description: "Employee Dashboard",
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-background">
      <SidebarProvider>
        <Sidebar />
        <div className="flex flex-col min-h-screen w-full">
          <Header />
          <main className="flex-1 w-full p-6">{children}</main>
        </div>
      </SidebarProvider>
    </div>
  )
}
