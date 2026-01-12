"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import CategoryCards from "@/app-components/category-cards"
import MenuTabs from "@/app-components/menu-tabs"
import MenuTable from "@/app-components/menu-table"
import SingleProductSidebar from "@/app-components/single-product-sidebar"
import { toast } from "sonner"
import axios from "axios"
import CategorySidebar from "@/app-components/category-sidebar"

interface Product {
  id: string
  name: string
  description?: string
  images: { publicId: string; url: string }[]
  stock: number
  categoryId: string
  category?: { id: string; name: string }
  price: number
  available: boolean
}

interface Category {
  id: string;
  name: string;
  description?: string;
  itemsCount?: number;
  imageUrl?: string;
}

export default function MenuPage() {
  const [openProductMenu, setOpenProductMenu] = useState(false);
  const [openCategorySidebar, setOpenCategorySidebar] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | undefined>();

  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [products, setProducts] = useState<Product[]>([])

  const fetchProducts = async () => {
    try {
      setLoadingCategories(true)
      const apiUrl = process.env.NEXT_PUBLIC_API_URL
      const token = localStorage.getItem("token")

      const res = await axios.get(`${apiUrl}api/products`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      setProducts(res.data.data)
    } catch (err) {
      toast.error("Failed to fetch products")
      console.error(err)
    } finally {
      setLoadingCategories(false)
    }
  }

  const handleCategorySelect = (category: Category) => {
    setSelectedCategory(category);
    setOpenCategorySidebar(true);
  };

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
        description: cat.description || "",
        itemsCount: cat.itemsCount || 0,
        imageUrl: cat.imageUrl || "",
      }));

      const totalItems = res.data.meta.total;

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

  useEffect(() => {
    fetchCategories();
    fetchProducts();
  }, []);

  return (
    <>
      <div className="p-6 space-y-6 text-white">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="text-xl font-semibold text-black dark:text-white">Categories</div>
          <Button
            className="bg-pink-300 text-black hover:bg-pink-400"
            onClick={() => setOpenCategorySidebar(true)}
          >
            Add New Category
          </Button>
        </div>

        <div className="text-black overflow-auto max-w-full">
          <CategoryCards onSelect={handleCategorySelect}
            categories={categories} loading={loading} />
        </div>
        <Separator className="bg-white/10" />

        {/* Menu Section */}
        <div className="flex items-center justify-between">
          <div className="text-xl font-semibold text-black dark:text-white">Products</div>
          <Button className="bg-pink-300 text-black hover:bg-pink-400"
            onClick={() => setOpenProductMenu(true)}>
            Add Menu Item
          </Button>
        </div>

        {/* <MenuTabs /> */}
        <MenuTable
          categories={categories}
          products={products}
          setProducts={setProducts}
          loading={loadingCategories}
          fetchProducts={fetchProducts} />
      </div>

      {/* Sidebar for adding/editing category*/}
      {openCategorySidebar && (
        <CategorySidebar
          onClose={() => {
            setOpenCategorySidebar(false);
            setSelectedCategory(undefined);
          }}
          category={selectedCategory}
          onSuccess={fetchCategories}
        />
      )}

      {/* sidebar for adding product */}
      {openProductMenu && (
        <SingleProductSidebar categories={categories} onClose={() => setOpenProductMenu(false)} fetchProducts={fetchProducts} />
      )}
    </>
  )
}
