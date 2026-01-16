"use client"

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

const data = [
  { month: "JAN", sales: 2800, revenue: 2000 },
  { month: "FEB", sales: 3500, revenue: 2200 },
  { month: "MAR", sales: 2400, revenue: 2600 },
  { month: "APR", sales: 3200, revenue: 1900 },
  { month: "MAY", sales: 4200, revenue: 3000 },
  { month: "JUN", sales: 3800, revenue: 3300 },
  { month: "JUL", sales: 4100, revenue: 3100 },
  { month: "AUG", sales: 3900, revenue: 3400 },
  { month: "SEP", sales: 3600, revenue: 3000 },
  { month: "OCT", sales: 3300, revenue: 3200 },
  { month: "NOV", sales: 2600, revenue: 2100 },
  { month: "DEC", sales: 4500, revenue: 2800 },
]

export function OverviewChart() {
  return (
    <Card className="bg-card text-card-foreground border-none">
      <CardHeader className="flex flex-row items-center justify-between">
        <h2 className="text-xl font-semibold">Overview</h2>

        <div className="flex items-center gap-2">
          <Button variant="secondary" className="bg-chart-accent text-black">
            Monthly
          </Button>
          <Button variant="ghost">Daily</Button>
          <Button variant="ghost">Weekly</Button>
        </div>
      </CardHeader>

      <CardContent className="h-[350px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
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
              tickFormatter={(v) => `${v / 1000}k`}
            />

            <Tooltip
              cursor={{ stroke: `hsl(var(--sidebar-accent))`, strokeWidth: 1 }}
              contentStyle={{
                backgroundColor: `hsl(var(--card))`,
                color: `hsl(var(--card-foreground))`,
                borderRadius: "8px",
                border: "none",
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
      </CardContent>
    </Card>
  )
}
