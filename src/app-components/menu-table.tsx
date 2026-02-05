"use client";

import { Pencil, Trash2, AlertTriangle } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import ConfirmModal from "./ConfirmModal";
import SingleProductSidebar from "./single-product-sidebar";
import api from "@/lib/axios";

interface ProductImage {
  publicId: string;
  url: string;
}

interface Product {
  id: string;
  name: string;
  description?: string;
  images: ProductImage[];
  stock: number;
  categoryId: string;
  category?: {
    id: string;
    name: string;
  };
  price: number;
  cost: number;
  available: boolean;
}

interface Category {
  id: string;
  name: string;
}

interface Props {
  categories: Category[];
  products: Product[];
  loading: boolean;
  onSuccess: () => Promise<void>;
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
}

export default function MenuTable({
  categories,
  loading,
  products,
  setProducts,
  onSuccess,
}: Props) {
  const [showConfirm, setShowConfirm] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(
    null,
  );
  const [deleting, setDeleting] = useState(false);
  const [openProductMenu, setOpenProductMenu] = useState(false);
  const [editProduct, setEditProduct] = useState<null | Product>(null);
  const [lowStockThreshold, setLowStockThreshold] = useState(10);

  useEffect(() => {
    const fetchThreshold = async () => {
      try {
        const res = await api.get("/api/account/organization");
        if (res.data.success && res.data.data) {
          setLowStockThreshold(res.data.data.lowStockThreshold || 10);
        }
      } catch (err) {
        console.error("Failed to fetch threshold:", err);
      }
    };
    fetchThreshold();
  }, []);

  const isLowStock = (stock: number) => stock <= lowStockThreshold;

  const handleEdit = (product: Product) => {
    setEditProduct(product);
    setOpenProductMenu(true);
  };

  const deleteProduct = async () => {
    if (!selectedProductId) return;

    try {
      setDeleting(true);

      await api.delete(`/api/products/${selectedProductId}`);

      setProducts((prev) => prev.filter((p) => p.id !== selectedProductId));

      toast.success("Product deleted successfully");
      setShowConfirm(false);
      setSelectedProductId(null);
      onSuccess();
    } catch (err) {
      toast.error("Failed to delete product");
      console.error(err);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="bg-zinc-900 rounded-xl overflow-hidden">
      {/* Header */}
      <div className="grid grid-cols-7 px-4 py-3 text-sm text-black dark:text-zinc-400 bg-zinc-400 dark:bg-zinc-800">
        {/* <span></span> */}
        <span>Product</span>
        <span className="col-span-1">Product Name</span>
        {/* <span>Item ID</span> */}
        <span>Stock</span>
        <span>Category</span>
        <span>Cost</span>
        <span>Price</span>
        <span>Availability</span>
      </div>

      {loading ? (
        <p className="p-4 text-center text-black dark:text-zinc-400">
          Loading products...
        </p>
      ) : (
        products.map((product) => (
          <div
            key={product.id}
            className={`
              grid grid-cols-7 items-center px-4 py-4
              text-black dark:text-white
              border-t border-zinc-200
              dark:border-white/5
              dark:hover:bg-zinc-800
              ${
                isLowStock(product.stock)
                  ? "bg-yellow-50 dark:bg-yellow-900/10 border-yellow-200 dark:border-yellow-800"
                  : "bg-zinc-200 dark:bg-black"
              }
            `}
          >
            {/* <Checkbox /> */}
            <img
              src={product.images?.[0]?.url}
              alt={product.name}
              className="h-8 w-8 object-cover rounded"
            />
            <div className="col-span-1 min-w-0">
              <p className="font-medium truncate">{product.name}</p>

              <p className="text-sm text-zinc-400 truncate">
                {product.description}
              </p>
            </div>

            {/* <span>#{product.id}</span> */}
            <span className="flex items-center gap-2">
              {product.stock} items
              {isLowStock(product.stock) && (
                <AlertTriangle className="h-4 w-4 text-yellow-500" title="Low stock" />
              )}
            </span>
            <span>{product.category?.name || "-"}</span>
            <span>${product.cost.toFixed(2)}</span>
            <span>${product.price.toFixed(2)}</span>

            <div className="flex items-center justify-between">
              <span
                className={`text-sm font-bold ${
                  product.available ? "text-green-400" : "text-red-400"
                }`}
              >
                {product.stock > 0 ? "In Stock" : "Out of Stock"}
              </span>

              <div className="flex gap-3 items-center">
                <Pencil
                  className="h-4 w-4 cursor-pointer"
                  onClick={() => handleEdit(product)}
                />
                <Trash2
                  className="h-4 w-4 text-red-500 cursor-pointer"
                  onClick={() => {
                    setSelectedProductId(product.id);
                    setShowConfirm(true);
                  }}
                />

                <ConfirmModal
                  open={showConfirm}
                  title="Delete Product?"
                  description="Are you sure you want to delete this product? This action cannot be undone."
                  confirmText="Yes"
                  loading={deleting}
                  onCancel={() => {
                    setShowConfirm(false);
                    setSelectedProductId(null);
                  }}
                  onConfirm={deleteProduct}
                />
              </div>
            </div>
          </div>
        ))
      )}
      {openProductMenu && editProduct && (
        <SingleProductSidebar
          categories={categories}
          onClose={() => setOpenProductMenu(false)}
          product={editProduct}
          onSuccess={onSuccess}
        />
      )}
    </div>
  );
}
