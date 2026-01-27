"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import CategoryCards from "@/app-components/category-cards";
import MenuTable from "@/app-components/menu-table";
import SingleProductSidebar from "@/app-components/single-product-sidebar";
import { toast } from "sonner";
import api from "@/lib/axios";
import CategorySidebar from "@/app-components/category-sidebar";

interface Product {
  id: string;
  name: string;
  description?: string;
  images: { publicId: string; url: string }[];
  stock: number;
  categoryId: string;
  category?: { id: string; name: string };
  price: number;
  available: boolean;
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
  const [selectedCategory, setSelectedCategory] = useState<
    Category | undefined
  >();

  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(false);

  // Search states
  const [categorySearch, setCategorySearch] = useState("");
  const [productSearch, setProductSearch] = useState("");

  // Fetch products
  const fetchProducts = async (searchQuery?: string) => {
    try {
      setLoadingProducts(true);
      const params = new URLSearchParams();
      if (searchQuery) {
        params.append("search", searchQuery);
      }
      const res = await api.get(`/api/products?${params.toString()}`);
      console.log(res.data.data);
      setProducts(res.data.data);
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to fetch products");
      console.error(err);
    } finally {
      setLoadingProducts(false);
    }
  };

  // Fetch categories
  const fetchCategories = async (searchQuery?: string) => {
    try {
      setLoadingCategories(true);
      const params = new URLSearchParams();
      if (searchQuery) {
        params.append("search", searchQuery);
      }
      const res = await api.get(`/api/categories?${params.toString()}`);

      const data: Category[] = res.data.data.map((cat: any) => ({
        id: cat.id,
        name: cat.name,
        description: cat.description || "",
        itemsCount: cat.itemsCount || 0,
        imageUrl: cat.imageUrl,
      }));

      const totalItems = res.data.meta?.total || 0;

      const allCategory: Category = {
        id: "all",
        name: "All",
        itemsCount: totalItems,
      };

      setCategories([allCategory, ...data]);
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to fetch categories");
    } finally {
      setLoadingCategories(false);
    }
  };

  // When a category is clicked
  const handleCategorySelect = (category: Category) => {
    setSelectedCategory(category);
    setOpenCategorySidebar(true);
  };

  // Effect for category search with debounce
  useEffect(() => {
    const timeoutId = setTimeout(
      () => {
        fetchCategories(categorySearch || undefined);
      },
      categorySearch ? 500 : 0,
    ); // No debounce when clearing search, 500ms when typing

    return () => clearTimeout(timeoutId);
  }, [categorySearch]);

  // Effect for product search with debounce
  useEffect(() => {
    const timeoutId = setTimeout(
      () => {
        fetchProducts(productSearch || undefined);
      },
      productSearch ? 500 : 0,
    ); // No debounce when clearing search, 500ms when typing

    return () => clearTimeout(timeoutId);
  }, [productSearch]);

  return (
    <>
      <div className="p-6 space-y-6 text-white">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="text-xl font-semibold text-black dark:text-white">
            Categories
          </div>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search categories..."
                value={categorySearch}
                onChange={(e) => setCategorySearch(e.target.value)}
                className="pl-10 w-64 bg-card border-border text-card-foreground placeholder:text-muted-foreground"
              />
            </div>
            <Button
              className="bg-pink-300 text-black hover:bg-pink-400"
              onClick={() => setOpenCategorySidebar(true)}
            >
              Add New Category
            </Button>
          </div>
        </div>

        <div className="text-black overflow-auto max-w-full">
          <CategoryCards
            onSelect={handleCategorySelect}
            categories={categories}
            loading={loadingCategories}
          />
        </div>
        <Separator className="bg-white/10" />

        {/* Products Section */}
        <div className="flex items-center justify-between">
          <div className="text-xl font-semibold text-black dark:text-white">
            Products
          </div>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search products..."
                value={productSearch}
                onChange={(e) => setProductSearch(e.target.value)}
                className="pl-10 w-64 bg-card border-border text-card-foreground placeholder:text-muted-foreground"
              />
            </div>
            <Button
              className="bg-pink-300 text-black hover:bg-pink-400"
              onClick={() => setOpenProductMenu(true)}
            >
              Add Menu Item
            </Button>
          </div>
        </div>

        <MenuTable
          categories={categories}
          products={products}
          setProducts={setProducts}
          loading={loadingProducts}
          onSuccess={async () => {
            await fetchCategories(categorySearch || undefined);
            await fetchProducts(productSearch || undefined);
          }}
        />
      </div>

      {/* Category Sidebar */}
      {openCategorySidebar && (
        <CategorySidebar
          onClose={() => {
            setOpenCategorySidebar(false);
            setSelectedCategory(undefined);
          }}
          category={selectedCategory}
          onSuccess={() => {
            fetchCategories(categorySearch || undefined);
            fetchProducts(productSearch || undefined);
          }}
        />
      )}

      {/* Product Sidebar */}
      {openProductMenu && (
        <SingleProductSidebar
          categories={categories}
          onClose={() => setOpenProductMenu(false)}
          onSuccess={async () => {
            await fetchCategories(categorySearch || undefined);
            await fetchProducts(productSearch || undefined);
          }}
        />
      )}
    </>
  );
}
