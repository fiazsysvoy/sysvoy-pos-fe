"use client";

import { useEffect, useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Search, ChevronLeft, ChevronRight } from "lucide-react";
import CategoryCards from "@/app-components/category-cards";
import MenuTable from "@/app-components/menu-table";
import SingleProductSidebar from "@/app-components/single-product-sidebar";
import { LowStockAlert } from "@/app-components/low-stock-alert";
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

  // Pagination states
  const [pageIndex, setPageIndex] = useState(0);
  const pageSize = 10; // Fixed at 10 rows per page
  const [total, setTotal] = useState(0);
  const [pageCount, setPageCount] = useState(0);
  const isInitialMount = useRef(true);

  // Fetch products
  const fetchProducts = async (searchQuery?: string, newPageIndex?: number, newPageSize?: number) => {
    try {
      setLoadingProducts(true);
      const params = new URLSearchParams();
      if (searchQuery) {
        params.append("search", searchQuery);
      }
      const currentPageIndex = newPageIndex !== undefined ? newPageIndex : pageIndex;
      const currentPageSize = newPageSize !== undefined ? newPageSize : pageSize;
      
      params.append("pageIndex", currentPageIndex.toString());
      params.append("pageSize", currentPageSize.toString());
      
      const res = await api.get(`/api/products?${params.toString()}`);
      console.log(res.data);
      
      setProducts(res.data.data || []);
      
      // Update pagination metadata
      if (res.data.meta) {
        setTotal(res.data.meta.total || 0);
        setPageCount(res.data.meta.pageCount || 0);
        setPageIndex(res.data.meta.pageIndex || 0);
      }
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

  // Initial fetch on mount
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      fetchCategories();
      fetchProducts();
      return;
    }
  }, []);

  // Effect for product search with debounce
  useEffect(() => {
    // Skip debounce on initial mount
    if (isInitialMount.current) {
      return;
    }
    
    // Reset to first page when search changes
    const timeoutId = setTimeout(
      () => {
        setPageIndex(0);
        fetchProducts(productSearch || undefined, 0, pageSize);
      },
      productSearch ? 500 : 0,
    ); // No debounce when clearing search, 500ms when typing

    return () => clearTimeout(timeoutId);
  }, [productSearch]);


  return (
    <>
      <div className="p-6 space-y-6 text-white">
        {/* Low Stock Alert */}
        <LowStockAlert />
        
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
            await fetchProducts(productSearch || undefined, pageIndex, pageSize);
          }}
        />

        {/* Pagination Controls */}
        {total > 0 && (
          <div className="flex items-center justify-between mt-4">
            <div className="flex items-center gap-2 text-sm text-black dark:text-zinc-400">
              <span>Showing</span>
              <span className="font-medium">
                {pageIndex * pageSize + 1} - {Math.min((pageIndex + 1) * pageSize, total)}
              </span>
              <span>of</span>
              <span className="font-medium">{total}</span>
              <span>products</span>
            </div>

            <div className="flex items-center gap-2">
                <span className="text-sm text-black dark:text-zinc-400">
                  Page {pageIndex + 1} of {pageCount || 1}
                </span>
                <div className="flex gap-1">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const newPageIndex = Math.max(0, pageIndex - 1);
                      setPageIndex(newPageIndex);
                      fetchProducts(productSearch || undefined, newPageIndex, pageSize);
                    }}
                    disabled={pageIndex === 0 || loadingProducts}
                    className="bg-card border-border text-card-foreground hover:bg-accent"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const newPageIndex = Math.min(pageCount - 1, pageIndex + 1);
                      setPageIndex(newPageIndex);
                      fetchProducts(productSearch || undefined, newPageIndex, pageSize);
                    }}
                    disabled={pageIndex >= pageCount - 1 || loadingProducts}
                    className="bg-card border-border text-card-foreground hover:bg-accent"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
          </div>
        )}
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
            fetchProducts(productSearch || undefined, pageIndex, pageSize);
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
            await fetchProducts(productSearch || undefined, pageIndex, pageSize);
          }}
        />
      )}
    </>
  );
}
