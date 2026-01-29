"use client";

import { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import api from "@/lib/axios";
import { toast } from "sonner";
import { Calendar, ChevronLeft, Download } from "lucide-react";

interface ProductRow {
  sNo: string;
  productId: string;
  productName: string;
  category: string;
  revenue: number;
  quantity: number;
  profit: number;
  profitMargin: number;
}

function getLastWeekRange(): [string, string] {
  const to = new Date();
  const from = new Date();
  from.setDate(from.getDate() - 6);
  return [from.toISOString().split("T")[0], to.toISOString().split("T")[0]];
}

function getLastMonthRange(): [string, string] {
  const to = new Date();
  const from = new Date();
  from.setDate(from.getDate() - 29);
  return [from.toISOString().split("T")[0], to.toISOString().split("T")[0]];
}

function escapeCsvCell(val: string | number): string {
  const s = String(val);
  if (/[,"\n\r]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
  return s;
}

function exportToCsv(products: ProductRow[], fromDate: string, toDate: string) {
  const headers = [
    "S.No",
    "Product",
    "Category",
    "Quantity Sold",
    "Sell Price",
    "Profit",
    "Profit Margin (%)",
    "Total Revenue",
  ];
  const rows = products.map((p) => {
    const sellPrice = p.quantity > 0 ? p.revenue / p.quantity : 0;
    return [
      p.sNo,
      p.productName,
      p.category,
      p.quantity,
      sellPrice.toFixed(2),
      p.profit.toFixed(2),
      p.profitMargin.toFixed(2),
      p.revenue.toFixed(2),
    ].map(escapeCsvCell);
  });
  const csv = [headers.map(escapeCsvCell).join(","), ...rows.map((r) => r.join(","))].join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `products-report-${fromDate}-to-${toDate}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

export default function ViewAllProductsPage() {
  const searchParams = useSearchParams();
  const fromQuery = searchParams.get("fromDate");
  const toQuery = searchParams.get("toDate");

  const [fromDate, setFromDate] = useState(() => {
    if (fromQuery) return fromQuery;
    const d = new Date();
    d.setDate(d.getDate() - 6);
    return d.toISOString().split("T")[0];
  });
  const [toDate, setToDate] = useState(() => {
    if (toQuery) return toQuery;
    return new Date().toISOString().split("T")[0];
  });
  const [filterPreset, setFilterPreset] = useState<"custom" | "lastWeek" | "lastMonth">("custom");
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState<ProductRow[]>([]);

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({ fromDate, toDate });
      const res = await api.get(`/api/financial/products?${params.toString()}`);
      setProducts(res.data.data ?? []);
    } catch (err: any) {
      toast.error(
        err.response?.data?.message || "Failed to fetch products report",
      );
      console.error(err);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [fromDate, toDate]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const applyLastWeek = () => {
    const [from, to] = getLastWeekRange();
    setFromDate(from);
    setToDate(to);
    setFilterPreset("lastWeek");
  };

  const applyLastMonth = () => {
    const [from, to] = getLastMonthRange();
    setFromDate(from);
    setToDate(to);
    setFilterPreset("lastMonth");
  };

  const handleExportCsv = () => {
    if (products.length === 0) {
      toast.error("No data to export");
      return;
    }
    exportToCsv(products, fromDate, toDate);
    toast.success("CSV downloaded");
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/financial">
              <ChevronLeft className="h-5 w-5" />
            </Link>
          </Button>
          <h1 className="text-2xl font-bold">View All Products</h1>
        </div>
      </div>

      <Card className="p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap items-center gap-3">
            <Button
              variant={filterPreset === "lastWeek" ? "default" : "outline"}
              size="sm"
              onClick={applyLastWeek}
              className={filterPreset === "lastWeek" ? "bg-[#FAC1D9] text-black" : ""}
            >
              Last week
            </Button>
            <Button
              variant={filterPreset === "lastMonth" ? "default" : "outline"}
              size="sm"
              onClick={applyLastMonth}
              className={filterPreset === "lastMonth" ? "bg-[#FAC1D9] text-black" : ""}
            >
              Last month
            </Button>
            <div
              className={`flex items-center gap-2 ${filterPreset === "custom" ? "ring-2 ring-[#FAC1D9] rounded-md px-2" : ""}`}
            >
              <Calendar className="w-4 h-4 text-muted-foreground" />
              <Input
                type="date"
                value={fromDate}
                onChange={(e) => {
                  setFromDate(e.target.value);
                  setFilterPreset("custom");
                }}
                className="w-36"
              />
              <span className="text-muted-foreground">–</span>
              <Input
                type="date"
                value={toDate}
                onChange={(e) => {
                  setToDate(e.target.value);
                  setFilterPreset("custom");
                }}
                className="w-36"
              />
            </div>
          </div>
          <Button
            onClick={handleExportCsv}
            disabled={loading || products.length === 0}
            variant="outline"
            className="gap-2"
          >
            <Download className="h-4 w-4" />
            Export to CSV
          </Button>
        </div>

        <h3 className="text-lg font-semibold mt-6 mb-4">
          Showing products for {fromDate} – {toDate}
        </h3>

        {loading ? (
          <div className="py-12 text-center text-muted-foreground">
            Loading...
          </div>
        ) : (
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
                {products.map((p) => (
                  <tr key={p.productId} className="border-b">
                    <td className="p-2 text-left">{p.sNo}</td>
                    <td className="p-2 text-left">{p.productName}</td>
                    <td className="p-2 text-center">{p.quantity}</td>
                    <td className="p-2 text-right">
                      ${(p.quantity > 0 ? p.revenue / p.quantity : 0).toFixed(2)}
                    </td>
                    <td className="p-2 text-right">${p.profit.toFixed(2)}</td>
                    <td className="p-2 text-right">
                      {p.profitMargin.toFixed(2)}%
                    </td>
                    <td className="p-2 text-right">
                      ${p.revenue.toLocaleString()}
                    </td>
                  </tr>
                ))}
                {products.length === 0 && (
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
        )}
      </Card>
    </div>
  );
}
