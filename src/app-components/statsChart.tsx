"use client"
import { Bar, BarChart, CartesianGrid } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
const chartData = [
  { month: "January", desktop: 186, mobile: 80 },
  { month: "February", desktop: 305, mobile: 200 },
  { month: "March", desktop: 237, mobile: 120 },
  { month: "April", desktop: 73, mobile: 190 },
  { month: "May", desktop: 209, mobile: 130 },
  { month: "June", desktop: 214, mobile: 140 },
]
const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "#1e376eff",
  },
  mobile: {
    label: "Mobile",
    color: "#60a5fa",
  },
} as const
const CustomChart = ({data}: {data: typeof chartData}) =>{
    return(
<div className="flex gap-4 w-full max-w-xs sm:max-w-sm md:max-w-md h-20">
    <ChartContainer config={chartConfig} className="h-20 w-full bg-transparent text-card-foreground">
  <BarChart accessibilityLayer data={data}>
    <CartesianGrid vertical={false} strokeOpacity={0.06} />
    <Bar dataKey="desktop" fill="var(--color-desktop)" radius={4} />
    <Bar dataKey="mobile" fill="var(--color-mobile)" radius={4} />
  </BarChart>
</ChartContainer>
</div>
    )
}
export default CustomChart
