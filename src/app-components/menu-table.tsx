"use client"

import { Pencil, Trash2 } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"
import axios from "axios"
import { useEffect, useState } from "react"
import { toast } from "sonner"
import ConfirmModal from "./ConfirmModal"

interface ProductImage {
  publicId: string
  url: string
}

interface Product {
  id: string
  name: string
  description?: string
  images: ProductImage[]
  stock: number
  category?: {
    name: string
  }
  price: number
  available: boolean
}

export default function MenuTable() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(false)

  const [showConfirm, setShowConfirm] = useState(false)
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true)

        const apiUrl = process.env.NEXT_PUBLIC_API_URL
        const token = localStorage.getItem("token")

        const res = await axios.get(`${apiUrl}api/products`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        console.log(res.data)
        setProducts(res.data.data)
      } catch (err) {
        toast.error("Failed to fetch products")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  const deleteProduct = async () => {
    if (!selectedProductId) return

    try {
      setDeleting(true)
      const apiUrl = process.env.NEXT_PUBLIC_API_URL
      const token = localStorage.getItem("token")

      await axios.delete(`${apiUrl}api/products/${selectedProductId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      setProducts((prev) =>
        prev.filter((p) => p.id !== selectedProductId)
      )

      toast.success("Product deleted successfully")
      setShowConfirm(false)
      setSelectedProductId(null)
    } catch (err) {
      toast.error("Failed to delete product")
      console.error(err)
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div className="bg-zinc-900 rounded-xl overflow-hidden">
      {/* Header */}
      <div className="grid grid-cols-6 px-4 py-3 text-sm text-black dark:text-zinc-400 bg-zinc-400 dark:bg-zinc-800">
        {/* <span></span> */}
        <span>Product</span>
        <span className="col-span-1">Product Name</span>
        {/* <span>Item ID</span> */}
        <span>Stock</span>
        <span>Category</span>
        <span>Price</span>
        <span>Availability</span>
      </div>

      {loading ? (
        <p className="p-4 text-center text-black dark:text-zinc-400">Loading products...</p>
      ) : (
        products.map((product) => (
          <div
            key={product.id}
            className="
              grid grid-cols-6 items-center px-4 py-4
              text-black dark:text-white
              border-t border-zinc-200
              bg-zinc-200 dark:bg-black 
              dark:border-white/5
              dark:hover:bg-zinc-800
            "
          >
            {/* <Checkbox /> */}
            <img
              src={product.images?.[0]?.url}
              alt={product.name}
              className="h-8 w-8 object-cover rounded"
            />
            <div className="col-span-1 min-w-0">
              <p className="font-medium truncate">
                {product.name}
              </p>

              <p className="text-sm text-zinc-400 truncate">
                {product.description}
              </p>
            </div>

            {/* <span>#{product.id}</span> */}
            <span>{product.stock} items</span>
            <span>{product.category?.name || "-"}</span>
            <span>${product.price.toFixed(2)}</span>

            <div className="flex items-center justify-between">
              <span
                className={`text-sm font-bold ${product.available ? "text-green-400" : "text-red-400"
                  }`}
              >
                {product.stock > 0 ? "In Stock" : "Out of Stock"}
              </span>

              <div className="flex gap-3 items-center">
                <Pencil className="h-4 w-4 cursor-pointer" />
                <Trash2
                  className="h-4 w-4 text-red-500 cursor-pointer"
                  onClick={() => {
                    setSelectedProductId(product.id)
                    setShowConfirm(true)
                  }}
                />

                <ConfirmModal
                  open={showConfirm}
                  title="Delete Product?"
                  description="Are you sure you want to delete this product? This action cannot be undone."
                  confirmText="Yes"
                  loading={deleting}
                  onCancel={() => {
                    setShowConfirm(false)
                    setSelectedProductId(null)
                  }}
                  onConfirm={deleteProduct}
                />
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  )
}
