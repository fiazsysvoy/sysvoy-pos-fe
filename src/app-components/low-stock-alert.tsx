"use client";

import { useEffect, useState } from "react";
import { AlertTriangle, X } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import api from "@/lib/axios";
import { toast } from "sonner";
import Link from "next/link";

import { usePathname } from "next/navigation";

interface LowStockProduct {
  id: string;
  name: string;
  stock: number;
  category: {
    id: string;
    name: string;
  };
}

interface LowStockData {
  threshold: number;
  count: number;
  products: LowStockProduct[];
}

export function LowStockAlert() {
  const [lowStockData, setLowStockData] = useState<LowStockData | null>(null);
  const [loading, setLoading] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    fetchLowStockProducts();
  }, []);

  const fetchLowStockProducts = async () => {
    try {
      setLoading(true);
      const res = await api.get("/api/products/low-stock");
      if (res.data.success) {
        setLowStockData(res.data.data);
      }
    } catch (err: any) {
      console.error("Failed to fetch low stock products:", err);
    } finally {
      setLoading(false);
    }
  };

  if (dismissed || loading || !lowStockData || lowStockData.count === 0) {
    return null;
  }
  const pathname = usePathname();

  return (
    <Card className="bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800 p-4 mb-4">
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3 flex-1">
          <AlertTriangle className="h-5 w-5 text-yellow-600 dark:text-yellow-400 mt-0.5 flex-shrink-0" />
          <div className="flex-1">
            <h3 className="font-semibold text-yellow-900 dark:text-yellow-100 mb-1">
              Low Stock Alert
            </h3>
            <p className="text-sm text-yellow-800 dark:text-yellow-200 mb-2">
              {lowStockData.count} product{lowStockData.count !== 1 ? "s" : ""}{" "}
              {lowStockData.count === 1 ? "is" : "are"} running low (threshold:{" "}
              {lowStockData.threshold})
            </p>
            {lowStockData.products.length > 0 && (
              <div className="mt-2 space-y-1">
                {lowStockData.products.slice(0, 5).map((product) => (
                  <div
                    key={product.id}
                    className="text-sm text-yellow-800 dark:text-yellow-200"
                  >
                    <span className="font-medium">{product.name}</span> - Stock:{" "}
                    <span className="font-semibold">{product.stock}</span>
                  </div>
                ))}
                {lowStockData.products.length > 5 && (
                  <p className="text-xs text-yellow-700 dark:text-yellow-300 italic">
                    +{lowStockData.products.length - 5} more products
                  </p>
                )}
              </div>
            )}
            <div className="mt-3">
              {pathname !== "/inventory" && (
                <Button
                  asChild
                  size="sm"
                  className="bg-yellow-600 hover:bg-yellow-700 text-white"
                >
                  <Link href="/inventory">View Inventory</Link>
                </Button>
              )}
            </div>
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6 text-yellow-600 dark:text-yellow-400 hover:bg-yellow-100 dark:hover:bg-yellow-800"
          onClick={() => setDismissed(true)}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    </Card>
  );
}
