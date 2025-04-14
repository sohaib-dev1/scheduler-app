"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { CalendarDays, Home, Phone, PlusCircle, Users } from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "@/components/ui/sidebar"
import { useAppSelector } from "@/lib/hooks"
import { selectUser } from "@/lib/features/auth/authSlice"

export default function AppSidebar() {
  const pathname = usePathname()
  const user = useAppSelector(selectUser)

  const isActive = (path: string) => {
    return pathname === path
  }

  return (
    <Sidebar>
      <SidebarHeader className="flex h-16 items-center border-b px-4 py-5">
        <Link href="/dashboard" className="flex items-center gap-2 font-semibold">
          <Phone className="h-6 w-6" />
          <span>Employee Dashboard</span>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={isActive("/dashboard")}>
              <Link href="/dashboard">
                <Home className="h-4 w-4" />
                <span>Dashboard</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>

          {user?.role === "sales" && (
            <>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={isActive("/sales")}>
                  <Link href="/sales">
                    <PlusCircle className="h-4 w-4" />
                    <span>Add Lead</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={isActive("/leads")}>
                  <Link href="/leads">
                    <Users className="h-4 w-4" />
                    <span>Leads</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </>
          )}

          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={isActive("/calendar")}>
              <Link href="/calendar">
                <CalendarDays className="h-4 w-4" />
                <span>Calendar</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>

          {user?.role === "developer" && (
            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={isActive("/team")}>
                <Link href="/team">
                  <Users className="h-4 w-4" />
                  <span>Team</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          )}
        </SidebarMenu>
      </SidebarContent>
      <SidebarSeparator />
      <SidebarFooter>
        <div className="p-4 text-xs text-muted-foreground">
          <p>© 2025 Company Inc.</p>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}
