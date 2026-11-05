"use client"

import {
  Building2,
  CalendarDays,
  LayoutDashboard,
  Users,
  BriefcaseBusiness,
  FileText,
  Inbox,
  MessageSquareQuote,
  ShieldCheck,
  Settings,
} from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  useSidebar
} from "@/components/ui/sidebar"

import * as React from "react"
import { api } from "@/hooks/useData"

const navGroups = [
  {
    label: "Main",
    items: [
      {
        title: "Overview",
        url: "/",
        icon: LayoutDashboard,
      },
      {
        title: "Leads",
        url: "/leads",
        icon: Inbox,
      },
    ],
  },
  {
    label: "Inventory",
    items: [
      {
        title: "Properties",
        url: "/properties",
        icon: Building2,
      },
      {
        title: "Developers",
        url: "/developers",
        icon: Users,
      },
      {
        title: "Events",
        url: "/events",
        icon: CalendarDays,
      },
    ],
  },
  {
    label: "Content",
    items: [
      {
        title: "Testimonials",
        url: "/testimonials",
        icon: MessageSquareQuote,
      },
      {
        title: "Content & Blogs",
        url: "/content",
        icon: FileText,
      },
      {
        title: "Careers",
        url: "/careers",
        icon: BriefcaseBusiness,
      },
    ],
  },
  {
    label: "Admin",
    items: [
      {
        title: "Users",
        url: "/users",
        icon: ShieldCheck,
      },
      {
        title: "Settings",
        url: "/settings",
        icon: Settings,
      },
    ],
  },
]

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname()
  const { setOpenMobile } = useSidebar()
  const [role, setRole] = React.useState<string | null>(null)

  React.useEffect(() => {
    // 1. Immediate read from localStorage
    try {
      const stored = localStorage.getItem("user")
      if (stored) {
        const u = JSON.parse(stored)
        setRole(u.role || null)
      }
    } catch (e) {}

    // 2. Fetch fresh user role
    const fetchUserRole = async () => {
      try {
        const token = localStorage.getItem("token")
        if (!token) return
        const res = await api.get("/auth/me")
        if (res.data?.success && res.data?.data) {
          setRole(res.data.data.role)
        }
      } catch (err) {}
    }

    fetchUserRole()
  }, [])

  // Filter out Users menu for non-admin accounts (e.g. Sam)
  const filteredNavGroups = React.useMemo(() => {
    const isAdmin = role === "ADMIN"
    return navGroups
      .map((group) => ({
        ...group,
        items: group.items.filter((item) => {
          if (!isAdmin && item.url === "/users") {
            return false
          }
          return true
        }),
      }))
      .filter((group) => group.items.length > 0)
  }, [role])

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader className="pb-6 pt-4">
        <div className="flex items-center gap-2 px-4 py-2">
          <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Building2 className="size-4" />
          </div>
          <div className="flex flex-col gap-0.5 leading-none group-data-[collapsible=icon]:hidden">
            <span className="font-semibold tracking-tight">A to I Infra</span>
            <span className="text-xs text-muted-foreground">Admin Panel</span>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent className="hide-scrollbar [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
        {filteredNavGroups.map((group) => (
          <SidebarGroup key={group.label} className="py-1">
            <SidebarGroupLabel className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/70">
              {group.label}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu className="gap-1">
                {group.items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton 
                      onClick={() => setOpenMobile(false)}
                      render={<Link href={item.url} />} 
                      isActive={pathname === item.url || (pathname.startsWith(item.url + '/') && item.url !== '/')}
                    >
                      <item.icon />
                      <span>{item.title}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  )
}
