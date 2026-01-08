"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import axios, { AxiosError } from "axios";
import {
  Pizza,
  Beef,
  Drumstick,
  Cake,
  Coffee,
  Fish,
  Grid2X2,
} from "lucide-react";
import { toast } from "sonner";

interface Category {
  id: string;
  name: string;
  itemsCount?: number;
  imageUrl?: string; // URL from API
}

const iconMap: Record<string, any> = {
  Pizza: Pizza,
  Burger: Beef,
  Chicken: Drumstick,
  Bakery: Cake,
  Beverage: Coffee,
  Seafood: Fish,
  All: Grid2X2,
};

export default function CategoryCards() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      const token = localStorage.getItem("token");

      try {
        const res = await axios.get(`${apiUrl}api/categories`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log(res);

        // Map API response to expected structure
        const data: Category[] = res.data.data.map((cat: any) => ({
          id: cat.id,
          name: cat.name,
          itemsCount: cat.items?.length || 0, // example if API returns items array
          imageUrl: cat.imageUrl || "", // or map to icon later
        }));
        const allCategory: Category = {
          id: "all",
          name: "All",
          itemsCount: categories.reduce((sum, cat) => sum + (cat.itemsCount || 0), 0),
          imageUrl: "", // optional, could be Grid2X2 icon
        };
        const updatedData = [allCategory, ...data];
        setCategories(updatedData);
      } catch (err: unknown) {
        let message = "Failed to fetch categories!";
        if (axios.isAxiosError(err)) {
          message = err.response?.data?.message || message;
        }
        toast.error(message);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return (
    <div className=" overflow-hidden">
  <div className="flex gap-4 overflow-x-auto scrollbar-none px-2">
    {loading ? (
      <p className="text-white">Loading categories...</p>
    ) : (
      categories.length === 0 ? <div>No category to show</div> :
      categories.map((cat) => {
        const Icon = iconMap[cat.name] || Grid2X2;
        return (
          <Card
            key={cat.id}
            className={`flex-shrink-0 w-32 p-4 flex flex-col items-start gap-3 cursor-pointer border-none
              ${cat.name === "All" ? "bg-pink-200 text-black" : "bg-zinc-800 text-white"}
            `}
          >
            <div className="h-16 w-16 flex items-center">
              {cat.name === "All" ? (
                <Icon className="h-10 w-10 self-start" />
              ) : (
                <img src={cat.imageUrl} alt="img" className="h-12 w-12 object-cover" />
              )}
            </div>
            <div>
              <p className="font-medium truncate w-28" title={cat.name}>
                {cat.name}
              </p>
              <p className="text-sm opacity-70">{cat.itemsCount} items</p>
            </div>
          </Card>
        );
      })
    )}
  </div>
</div>

  );
}
