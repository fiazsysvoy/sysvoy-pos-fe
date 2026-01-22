"use client"

import { useState, useMemo } from "react"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

type TimePeriod = "Monthly" | "Daily" | "Weekly"

interface ChartDataPoint {
  month?: string
  date?: string
  time?: string
  revenue: number
  sales: number
}

interface OverviewChartProps {
  todayData?: Array<{ time: string; revenue: number; sales: number }>
  weekData?: Array<{ date: string; revenue: number; sales: number }>
  monthData?: Array<{ date: string; revenue: number; sales: number }>
  historicalMonthlyData?: Array<{ month: string; revenue: number; sales: number }>
}

export function OverviewChart({ 
  todayData = [], 
  weekData = [], 
  monthData = [],
  historicalMonthlyData = []
}: OverviewChartProps) {
  const [timePeriod, setTimePeriod] = useState<TimePeriod>("Monthly")

  // Transform data based on selected time period
  const chartData = useMemo(() => {
    if (timePeriod === "Monthly") {
      // Use historical monthly data (last 12 months)
      return historicalMonthlyData.map(item => ({
        month: item.month,
        revenue: item.revenue,
        sales: item.sales,
      }))
    } else if (timePeriod === "Weekly") {
      // Use week data (daily breakdown of current week)
      return weekData.map(item => {
        const date = new Date(item.date)
        const dayName = date.toLocaleDateString('en-US', { weekday: 'short' })
        const dayNum = date.getDate()
        return {
          month: `${dayName} ${dayNum}`,
          revenue: item.revenue,
          sales: item.sales,
        }
      })
    } else {
      // Daily - use today's hourly data
      return todayData.map(item => {
        const hour = parseInt(item.time.split(':')[0])
        const label = hour === 0 ? '12 AM' : hour < 12 ? `${hour} AM` : hour === 12 ? '12 PM' : `${hour - 12} PM`
        return {
          month: label,
          revenue: item.revenue,
          sales: item.sales,
        }
      })
    }
  }, [timePeriod, todayData, weekData, historicalMonthlyData])

  // Calculate max value for better Y-axis scaling
  const maxValue = useMemo(() => {
    if (chartData.length === 0) return 1000
    const maxRevenue = Math.max(...chartData.map(d => d.revenue), 0)
    const maxSales = Math.max(...chartData.map(d => d.sales), 0)
    return Math.max(maxRevenue, maxSales * 100) // Scale sales if needed
  }, [chartData])

  return (
    <Card className="bg-card text-card-foreground border-none">
      <CardHeader className="flex flex-row items-center justify-between">
        <h2 className="text-xl font-semibold">Overview</h2>

        <div className="flex items-center gap-2">
          <Button 
            variant={timePeriod === "Monthly" ? "secondary" : "ghost"}
            className={timePeriod === "Monthly" ? "bg-chart-accent text-black" : ""}
            onClick={() => setTimePeriod("Monthly")}
          >
            Monthly
          </Button>
          <Button 
            variant={timePeriod === "Daily" ? "secondary" : "ghost"}
            className={timePeriod === "Daily" ? "bg-chart-accent text-black" : ""}
            onClick={() => setTimePeriod("Daily")}
          >
            Daily
          </Button>
          <Button 
            variant={timePeriod === "Weekly" ? "secondary" : "ghost"}
            className={timePeriod === "Weekly" ? "bg-chart-accent text-black" : ""}
            onClick={() => setTimePeriod("Weekly")}
          >
            Weekly
          </Button>
        </div>
      </CardHeader>

      <CardContent className="h-[350px]">
        {chartData.length === 0 ? (
          <div className="flex items-center justify-center h-full text-muted-foreground">
            No data available
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <defs>
                <linearGradient id="salesGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={`hsl(var(--chart-accent))`} stopOpacity={0.4} />
                  <stop offset="100%" stopColor={`hsl(var(--chart-accent))`} stopOpacity={0} />
                </linearGradient>
              </defs>

              <CartesianGrid
                vertical={false}
                stroke={`hsl(var(--card-foreground) / 0.06)`}
                strokeDasharray="3 3"
              />

              <XAxis
                dataKey="month"
                stroke={`hsl(var(--card-foreground) / 0.6)`}
                tickLine={false}
                axisLine={false}
              />

              <YAxis
                orientation="right"
                stroke={`hsl(var(--card-foreground) / 0.6)`}
                tickLine={false}
                axisLine={false}
                tickFormatter={(v) => {
                  if (timePeriod === "Daily" && v < 1000) {
                    return `${v}`
                  }
                  return `${(v / 1000).toFixed(1)}k`
                }}
                domain={[0, maxValue * 1.1]}
              />

              <Tooltip
                cursor={{ stroke: `hsl(var(--sidebar-accent))`, strokeWidth: 1 }}
                contentStyle={{
                  backgroundColor: `hsl(var(--card))`,
                  color: `hsl(var(--card-foreground))`,
                  borderRadius: "8px",
                  border: "none",
                }}
                formatter={(value: number, name: string) => {
                  if (name === "sales") {
                    return [`${value} orders`, "Sales"]
                  }
                  return [`$${value.toFixed(2)}`, "Revenue"]
                }}
              />

              {/* Revenue Line */}
              <Line
                type="monotone"
                dataKey="revenue"
                stroke={`hsl(var(--card-foreground))`}
                strokeWidth={2}
                dot={false}
              />

              {/* Sales Line */}
              <Line
                type="monotone"
                dataKey="sales"
                stroke={`hsl(var(--chart-accent))`}
                strokeWidth={3}
                dot={false}
                fill="url(#salesGradient)"
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  )
}
