"use client";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

const chartConfig = {
  revenue: {
    label: "Revenue",
    color: "hsl(var(--chart-accent))",
  },
} as const;

interface ChartDataPoint {
  month?: string;
  date?: string;
  time?: string;
  revenue: number;
  desktop?: number;
}

const CustomChart = ({ data }: { data: ChartDataPoint[] }) => {
  // Transform data to match chart format
  const chartData = data.map((item) => ({
    label: item.month || item.date || item.time || "",
    revenue: item.revenue || item.desktop || 0,
  }));

  // If no data, show empty chart with placeholder
  if (!chartData || chartData.length === 0) {
    return (
      <div className="flex items-center justify-center h-32 w-full text-muted-foreground text-xs">
        No data available
      </div>
    );
  }

  // Calculate max value for better scaling
  const maxValue = Math.max(...chartData.map((d) => d.revenue), 1);
  const yAxisDomain = [0, maxValue * 1.1]; // Add 10% padding at top

  return (
    <div className="w-full h-32">
      <ChartContainer config={chartConfig} className="h-32 w-full">
        <BarChart
          data={chartData}
          margin={{ top: 8, right: 8, left: 0, bottom: 4 }}
          barCategoryGap="15%"
        >
          <defs>
            <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
              <stop
                offset="0%"
                stopColor="hsl(var(--chart-accent))"
                stopOpacity={0.9}
              />
              <stop
                offset="100%"
                stopColor="hsl(var(--chart-accent))"
                stopOpacity={0.6}
              />
            </linearGradient>
          </defs>
          <CartesianGrid
            vertical={false}
            stroke="hsl(var(--card-foreground) / 0.08)"
            strokeDasharray="3 3"
          />
          <XAxis
            dataKey="label"
            tickLine={false}
            axisLine={false}
            tick={{
              fill: "hsl(var(--card-foreground) / 0.6)",
              fontSize: 9,
              fontWeight: 500,
            }}
            interval={chartData.length > 7 ? 1 : 0}
            angle={chartData.length > 5 ? -35 : 0}
            textAnchor={chartData.length > 5 ? "end" : "middle"}
            height={chartData.length > 5 ? 45 : 25}
          />
          <YAxis hide={true} domain={yAxisDomain} />
          <ChartTooltip
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                const value = payload[0].value as number;
                return (
                  <div className="rounded-lg border bg-background/95 backdrop-blur-sm p-2 shadow-lg">
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-xs font-medium text-muted-foreground">
                        Revenue
                      </span>
                      <span className="font-bold text-sm text-foreground">
                        ${value?.toFixed(2) || "0.00"}
                      </span>
                    </div>
                  </div>
                );
              }
              return null;
            }}
            cursor={{ fill: "hsl(var(--chart-accent) / 0.1)" }}
          />
          <Bar
            dataKey="revenue"
            fill="url(#barGradient)"
            radius={[6, 6, 0, 0]}
            stroke="hsl(var(--chart-accent))"
            strokeWidth={0.5}
            animationDuration={800}
          />
        </BarChart>
      </ChartContainer>
    </div>
  );
};

export default CustomChart;
