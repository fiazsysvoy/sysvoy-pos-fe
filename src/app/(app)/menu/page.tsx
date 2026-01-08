"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import CategoryCards from "@/app-components/category-cards"
import MenuTabs from "@/app-components/menu-tabs"
import MenuTable from "@/app-components/menu-table"
import AddCategorySidebar from "@/app-components/add-category-sidebar"
import AddProductSidebar from "@/app-components/add-product-sidebar"
import { toast } from "sonner"
import axios from "axios"

interface Category {
  id: string;
  name: string;
  itemsCount?: number;
  imageUrl?: string;
}

export default function MenuPage() {
  const [open, setOpen] = useState(false)
  const [openProductMenu, setOpenProductMenu] = useState(false)

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

        const data: Category[] = res.data.data.map((cat: any) => ({
          id: cat.id,
          name: cat.name,
          itemsCount: cat.items?.length || 0,
          imageUrl: cat.imageUrl || "",
        }));

        const totalItems = data.reduce(
          (sum, cat) => sum + (cat.itemsCount || 0),
          0
        );

        const allCategory: Category = {
          id: "all",
          name: "All",
          itemsCount: totalItems,
        };

        setCategories([allCategory, ...data]);
      } catch (err: any) {
        toast.error(err.response?.data?.message || "Failed to fetch categories");
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return (
    <>
      <div className="p-6 space-y-6 text-white">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold">Categories</h1>
          <Button
            className="bg-pink-300 text-black hover:bg-pink-400"
            onClick={() => setOpen(true)}
          >
            Add New Category
          </Button>
        </div>

        <CategoryCards categories={categories} loading={loading} />
        <Separator className="bg-white/10" />

        {/* Menu Section */}
        <div className="flex items-center justify-between">
          <div className="text-xl font-semibold text-black">Products</div>
          <Button className="bg-pink-300 text-black hover:bg-pink-400"
          onClick={()=> setOpenProductMenu(true)}>
            Add Menu Item
          </Button>
        </div>

        {/* <MenuTabs /> */}
        <MenuTable />
      </div>

      {/* Sidebar */}
      {open && (
        <AddCategorySidebar onClose={() => setOpen(false)} />
      )}

      {/* sidebar for adding product */}
      {openProductMenu && (
        <AddProductSidebar categories={categories} onClose={() => setOpenProductMenu(false)} />
      )}
    </>
  )
}
