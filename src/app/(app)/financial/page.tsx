"use client";

import { useEffect, useState, useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import api from "@/lib/axios";
import { toast } from "sonner";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import Link from "next/link";
import { Calendar, TrendingUp, DollarSign, Info, ChevronRight } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface FinancialStats {
  summary: {
    totalRevenue: number;
    totalOrders: number;
    totalCosts: number;
    completedOrders: number;
    cancelledOrders: number;
    inProcessOrders: number;
    averageOrderValue: number;
    netRevenue: number;
    refundsAmount: number;
    refundsCount: number;
    cancelledRevenue: number;
    inProcessRevenue: number;
  };
  statusBreakdown: {
    COMPLETED: { revenue: number; orders: number; percentage: number };
    CANCELLED: { revenue: number; orders: number; percentage: number };
    IN_PROCESS: { revenue: number; orders: number; percentage: number };
  };
  paymentMethodBreakdown: {
    CASH: { revenue: number; orders: number; percentage: number };
    JAZZCASH: { revenue: number; orders: number; percentage: number };
    EASYPAISA: { revenue: number; orders: number; percentage: number };
  };
  timeSeriesData: Array<{
    date: string;
    revenue: number;
    orders: number;
    refunds: number;
    completedRevenue: number;
    cancelledRevenue: number;
    inProcessRevenue: number;
  }>;
  topProducts: Array<{
    sNo: string;
    productId: string;
    productName: string;
    category: string;
    revenue: number;
    quantity: number;
    profit: number;
    profitMargin: number;
  }>;
  comparison: {
    previousPeriodRevenue: number;
    previousPeriodOrders: number;
    revenueGrowthPercentage: number;
    ordersGrowthPercentage: number;
    sameWeekLastMonthRevenue: number;
    sameWeekLastMonthOrders: number;
    revenueVsLastMonthPercentage: number;
    ordersVsLastMonthPercentage: number;
  };
}

const COLORS = ["#ec4899", "#f472b6", "#f9a8d4", "#fbcfe8"]; // Pink shades

export default function FinancialPage() {
  const [fromDate, setFromDate] = useState(() => {
    const date = new Date();
    date.setDate(date.getDate() - 7); // Default to last 7 days
    return date.toISOString().split("T")[0];
  });
  const [toDate, setToDate] = useState(() => {
    return new Date().toISOString().split("T")[0];
  });
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState<FinancialStats | null>(null);
  const [selectedStatusTab, setSelectedStatusTab] = useState<
    "COMPLETED" | "CANCELLED" | "IN_PROCESS"
  >("COMPLETED");

  const fetchFinancialStats = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        fromDate,
        toDate,
        groupBy: "day",
      });
      const res = await api.get(`/api/financial/stats?${params.toString()}`);
      setStats(res.data.data);
    } catch (err: any) {
      toast.error(
        err.response?.data?.message || "Failed to fetch financial stats",
      );
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFinancialStats();
  }, []);

  const handleGenerateReport = () => {
    fetchFinancialStats();
  };

  // Prepare donut chart data
  const donutChartData = useMemo(() => {
    if (!stats) return [];
    return [
      {
        name: "Completed",
        value: stats.statusBreakdown.COMPLETED.revenue,
        orders: stats.statusBreakdown.COMPLETED.orders,
      },
      {
        name: "Cancelled",
        value: stats.statusBreakdown.CANCELLED.revenue,
        orders: stats.statusBreakdown.CANCELLED.orders,
      },
      {
        name: "In Process",
        value: stats.statusBreakdown.IN_PROCESS.revenue,
        orders: stats.statusBreakdown.IN_PROCESS.orders,
      },
    ];
  }, [stats]);

  // Prepare line chart data based on selected status
  const lineChartData = useMemo(() => {
    if (!stats) return [];
    return stats.timeSeriesData.map((item) => {
      let revenue = 0;
      if (selectedStatusTab === "COMPLETED") {
        revenue = item.completedRevenue;
      } else if (selectedStatusTab === "CANCELLED") {
        revenue = item.cancelledRevenue;
      } else if (selectedStatusTab === "IN_PROCESS") {
        revenue = item.inProcessRevenue;
      }
      // Format date for display
      let displayDate = item.date;
      if (item.date.includes("T")) {
        const date = new Date(item.date);
        displayDate = date.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        });
      } else if (item.date.match(/^\d{4}-\d{2}-\d{2}$/)) {
        const date = new Date(item.date);
        displayDate = date.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        });
      }
      return {
        date: displayDate,
        revenue: revenue,
        orders: item.orders,
      };
    });
  }, [stats, selectedStatusTab]);

  const totalRevenue = stats?.summary.totalRevenue || 0;
  const totalOrders = stats?.summary.totalOrders || 0;

  // Calculate date range for comparison labels
  const dateRangeDays = useMemo(() => {
    const from = new Date(fromDate);
    const to = new Date(toDate);
    const diffTime = Math.abs(to.getTime() - from.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  }, [fromDate, toDate]);

  // Format dates for tooltip
  const formatDateForTooltip = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  // Check if previous period had data (edge case handling)
  const hasPreviousPeriodData =
    stats?.comparison.previousPeriodRevenue !== undefined &&
    stats.comparison.previousPeriodRevenue > 0 &&
    stats.comparison.previousPeriodOrders > 0;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Reports</h1>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            <Input
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              className="w-40"
            />
            <span>—</span>
            <Input
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              className="w-40"
            />
          </div>
          <Button
            onClick={handleGenerateReport}
            disabled={loading}
            className="bg-[#FAC1D9] text-black"
          >
            Generate Report
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="revenue" className="w-full">
        <TabsList>
          <TabsTrigger value="revenue">Revenue Report</TabsTrigger>
        </TabsList>

        <TabsContent value="revenue" className="space-y-6">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <p>Loading...</p>
            </div>
          ) : stats ? (
            <>
              {/* Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Total Revenue
                      </p>
                      <p className="text-2xl font-bold">
                        ${totalRevenue.toFixed(2)}
                      </p>
                    </div>
                    <DollarSign className="w-8 h-8 text-pink-500" />
                  </div>
                </Card>
                <Card className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Total Costs
                      </p>
                      <p className="text-2xl font-bold">
                        ${(stats?.summary.totalCosts ?? 0).toFixed(2)}
                      </p>
                    </div>
                    <DollarSign className="w-8 h-8 text-pink-500" />
                  </div>
                </Card>
                <Card className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Net Revenue
                      </p>
                      <p className="text-2xl font-bold">
                        $
                        {(
                          (totalRevenue ?? 0) - (stats?.summary.totalCosts ?? 0)
                        ).toFixed(2)}
                      </p>
                    </div>
                    <DollarSign className="w-8 h-8 text-pink-500" />
                  </div>
                </Card>
                <Card className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Total Orders
                      </p>
                      <p className="text-2xl font-bold">{totalOrders}</p>
                    </div>
                    <TrendingUp className="w-8 h-8 text-pink-500" />
                  </div>
                </Card>
              </div>

              {/* Charts Row */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Donut Chart */}
                <Card className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Total Revenue</h3>
                  <div className="flex items-center justify-center">
                    <div className="relative">
                      <PieChart width={300} height={300}>
                        <Pie
                          data={donutChartData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={100}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          {donutChartData.map((entry, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={COLORS[index % COLORS.length]}
                            />
                          ))}
                        </Pie>
                        <RechartsTooltip />
                        <text
                          x="50%"
                          y="45%"
                          textAnchor="middle"
                          dominantBaseline="middle"
                          className="text-2xl font-bold fill-current"
                        >
                          Total
                        </text>
                        <text
                          x="50%"
                          y="55%"
                          textAnchor="middle"
                          dominantBaseline="middle"
                          className="text-lg fill-current"
                        >
                          ${totalRevenue.toFixed(0)}
                        </text>
                      </PieChart>
                    </div>
                    <div className="ml-6 space-y-2">
                      {donutChartData.map((item, index) => (
                        <div
                          key={item.name}
                          className="flex items-center gap-2"
                        >
                          <div
                            className="w-4 h-4 rounded"
                            style={{
                              backgroundColor: COLORS[index % COLORS.length],
                            }}
                          />
                          <span className="text-sm">{item.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </Card>

                {/* Line Chart */}
                <Card className="p-6">
                  <div className="flex flex-col gap-2 mb-4">
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-semibold">Revenue Trend</h3>
                      <div className="flex gap-2">
                        <Button
                          variant={
                            selectedStatusTab === "COMPLETED"
                              ? "default"
                              : "outline"
                          }
                          size="sm"
                          onClick={() => setSelectedStatusTab("COMPLETED")}
                        >
                          Completed
                        </Button>
                        <Button
                          variant={
                            selectedStatusTab === "CANCELLED"
                              ? "default"
                              : "outline"
                          }
                          size="sm"
                          onClick={() => setSelectedStatusTab("CANCELLED")}
                        >
                          Cancelled
                        </Button>
                        <Button
                          variant={
                            selectedStatusTab === "IN_PROCESS"
                              ? "default"
                              : "outline"
                          }
                          size="sm"
                          onClick={() => setSelectedStatusTab("IN_PROCESS")}
                        >
                          In Process
                        </Button>
                      </div>
                    </div>
                    {stats.comparison && (
                      <div className="flex flex-wrap items-center gap-2 text-[10px] md:text-xs pb-3 border-b">
                        <span className="text-muted-foreground whitespace-nowrap">
                          vs previous {dateRangeDays} day
                          {dateRangeDays !== 1 ? "s" : ""}:
                        </span>
                        {hasPreviousPeriodData &&
                        !isNaN(stats.comparison.revenueGrowthPercentage) ? (
                          <span
                            className={`font-semibold flex items-center gap-1 whitespace-nowrap ${
                              stats.comparison.revenueGrowthPercentage >= 0
                                ? "text-green-500"
                                : "text-red-500"
                            }`}
                          >
                            Revenue{" "}
                            {stats.comparison.revenueGrowthPercentage >= 0 ? (
                              <span>↑</span>
                            ) : (
                              <span>↓</span>
                            )}{" "}
                            {Math.abs(
                              stats.comparison.revenueGrowthPercentage,
                            ).toFixed(1)}
                            %
                          </span>
                        ) : (
                          <span className="text-muted-foreground text-[10px] md:text-xs whitespace-nowrap">
                            Revenue: N/A
                          </span>
                        )}
                        {hasPreviousPeriodData &&
                        !isNaN(stats.comparison.ordersGrowthPercentage) ? (
                          <span
                            className={`font-semibold flex items-center gap-1 whitespace-nowrap ${
                              stats.comparison.ordersGrowthPercentage >= 0
                                ? "text-green-500"
                                : "text-red-500"
                            }`}
                          >
                            Orders{" "}
                            {stats.comparison.ordersGrowthPercentage >= 0 ? (
                              <span>↑</span>
                            ) : (
                              <span>↓</span>
                            )}{" "}
                            {Math.abs(
                              stats.comparison.ordersGrowthPercentage,
                            ).toFixed(1)}
                            %
                          </span>
                        ) : (
                          <span className="text-muted-foreground text-[10px] md:text-xs whitespace-nowrap">
                            Orders: N/A
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={lineChartData}>
                      <CartesianGrid
                        strokeDasharray="3 3"
                        stroke="rgba(255, 255, 255, 0.1)"
                      />
                      <XAxis
                        dataKey="date"
                        tick={{ fontSize: 12 }}
                        angle={-45}
                        textAnchor="end"
                        height={80}
                      />
                      <YAxis tick={{ fontSize: 12 }} />
                      <RechartsTooltip />
                      <Line
                        type="monotone"
                        dataKey="revenue"
                        stroke="#ec4899"
                        strokeWidth={2}
                        dot={{ r: 4 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </Card>
              </div>

              {/* Top Products Table */}
              <Card className="p-6">
                <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                  <h3 className="text-lg font-semibold">
                    Showing top products for {fromDate} – {toDate}
                  </h3>
                  <Button variant="outline" size="sm" className="gap-1" asChild>
                    <Link
                      href={`/financial/products?fromDate=${fromDate}&toDate=${toDate}`}
                    >
                      View All
                      <ChevronRight className="h-4 w-4" />
                    </Link>
                  </Button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full table-fixed">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-2">S.No</th>
                        <th className="text-left p-2">Top Selling Food</th>
                        <th className="text-center p-2">Quantity Sold</th>
                        <th className="text-right p-2">Sell Price</th>
                        <th className="text-right p-2">Profit</th>
                        <th className="text-right p-2">Profit Margin</th>
                        <th className="text-right p-2">Total Revenue</th>
                      </tr>
                    </thead>

                    <tbody>
                      {stats.topProducts.map((product) => (
                        <tr key={product.productId} className="border-b">
                          <td className="p-2 text-left">{product.sNo}</td>
                          <td className="p-2 text-left">
                            {product.productName}
                          </td>

                          {/* CENTER */}
                          <td className="p-2 text-center">
                            {product.quantity}
                          </td>

                          {/* RIGHT */}
                          <td className="p-2 text-right">
                            ${(product.revenue / product.quantity).toFixed(2)}
                          </td>

                          {/* Profit */}
                          <td className="p-2 text-right">
                            ${product.profit.toFixed(2)}
                          </td>

                          {/* Profit Margin */}
                          <td className="p-2 text-right">
                            {product.profitMargin.toFixed(2)}%
                          </td>

                          {/* RIGHT – fixes extra right spacing visually */}
                          <td className="p-2 text-right">
                            ${product.revenue.toLocaleString()}
                          </td>
                        </tr>
                      ))}

                      {stats.topProducts.length === 0 && (
                        <tr>
                          <td
                            colSpan={7}
                            className="p-4 text-center text-muted-foreground"
                          >
                            No products found
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </Card>
            </>
          ) : (
            <div className="flex items-center justify-center h-64">
              <p className="text-muted-foreground">No data available</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
