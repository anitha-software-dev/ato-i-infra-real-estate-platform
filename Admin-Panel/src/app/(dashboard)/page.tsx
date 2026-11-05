"use client"

import * as React from "react"
import { Building2, CalendarDays, BriefcaseBusiness, Users } from "lucide-react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useDashboardData } from "@/hooks/useDashboardData"
import { Skeleton } from "@/components/ui/skeleton"
import { CartesianGrid, Line, LineChart, XAxis, Bar, BarChart, Tooltip, ResponsiveContainer } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

const chartData = [
  { month: "January", enquiries: 186, registrations: 80 },
  { month: "February", enquiries: 305, registrations: 200 },
  { month: "March", enquiries: 237, registrations: 120 },
  { month: "April", enquiries: 73, registrations: 190 },
  { month: "May", enquiries: 209, registrations: 130 },
  { month: "June", enquiries: 214, registrations: 140 },
]

const chartConfig = {
  enquiries: {
    label: "Enquiries",
    color: "hsl(var(--chart-1))",
  },
  registrations: {
    label: "Registrations",
    color: "hsl(var(--chart-2))",
  },
}

export default function Dashboard() {
  const { metrics, isLoading } = useDashboardData()

  return (
    <div className="flex flex-1 flex-col gap-4 min-w-0 max-w-full">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-2 gap-4">
        <h2 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">Overview</h2>
      </div>
      
      {isLoading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map(i => (
            <Card key={i} className="modern-card">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-4 w-4" />
              </CardHeader>
              <CardContent className="flex flex-col items-center justify-center text-center">
                <Skeleton className="h-8 w-1/3 mb-2" />
                <Skeleton className="h-3 w-3/4" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="modern-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Properties
              </CardTitle>
              <Building2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent className="text-center">
              <div className="text-2xl font-bold text-center">{metrics?.totalProperties}</div>
              <p className="text-xs text-muted-foreground text-center">
                +12 since last month
              </p>
            </CardContent>
          </Card>
          <Card className="modern-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Developers
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent className="text-center">
              <div className="text-2xl font-bold text-center">{metrics?.totalDevelopers}</div>
              <p className="text-xs text-muted-foreground text-center">
                +3 new partners this quarter
              </p>
            </CardContent>
          </Card>
          <Card className="modern-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Upcoming Events</CardTitle>
              <CalendarDays className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent className="text-center">
              <div className="text-2xl font-bold text-center">{metrics?.upcomingEvents}</div>
              <p className="text-xs text-muted-foreground text-center">
                1 mega expo next month
              </p>
            </CardContent>
          </Card>
          <Card className="modern-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Open Job Listings
              </CardTitle>
              <BriefcaseBusiness className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent className="text-center">
              <div className="text-2xl font-bold text-center">{metrics?.openJobListings}</div>
              <p className="text-xs text-muted-foreground text-center">
                Active hiring across 3 cities
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7 mt-2">
        <Card className="col-span-1 md:col-span-2 lg:col-span-4 modern-card">
          <CardHeader>
            <CardTitle>Lead Analytics</CardTitle>
            <CardDescription>
              Enquiries and event registrations over time.
            </CardDescription>
          </CardHeader>
          <CardContent className="pl-0 sm:pl-2">
            <div className="overflow-x-auto pb-4 max-w-full">
              <div className="min-w-[500px]">
                <ChartContainer config={chartConfig} className="h-[300px] w-full">
                  <BarChart accessibilityLayer data={chartData}>
                    <CartesianGrid vertical={false} />
                    <XAxis
                      dataKey="month"
                      tickLine={false}
                      tickMargin={10}
                      axisLine={false}
                      tickFormatter={(value) => value.slice(0, 3)}
                    />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="enquiries" fill="hsl(var(--chart-1))" radius={4} />
                    <Bar dataKey="registrations" fill="hsl(var(--chart-2))" radius={4} />
                  </BarChart>
                </ChartContainer>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="col-span-1 md:col-span-2 lg:col-span-3 modern-card">
          <CardHeader>
            <CardTitle>Popular Properties</CardTitle>
            <CardDescription>
              Most enquired properties this month.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-8">
              <div className="flex items-center">
                <div className="ml-4 space-y-1">
                  <p className="text-sm font-medium leading-none">Prestige Falcon City</p>
                  <p className="text-sm text-muted-foreground">
                    Residential • Bangalore
                  </p>
                </div>
                <div className="ml-auto font-medium">+142 Leads</div>
              </div>
              <div className="flex items-center">
                <div className="ml-4 space-y-1">
                  <p className="text-sm font-medium leading-none">Sobha Dream Acres</p>
                  <p className="text-sm text-muted-foreground">
                    Residential • Bangalore
                  </p>
                </div>
                <div className="ml-auto font-medium">+89 Leads</div>
              </div>
              <div className="flex items-center">
                <div className="ml-4 space-y-1">
                  <p className="text-sm font-medium leading-none">Brigade Tech Gardens</p>
                  <p className="text-sm text-muted-foreground">
                    Commercial • Bangalore
                  </p>
                </div>
                <div className="ml-auto font-medium">+45 Leads</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
