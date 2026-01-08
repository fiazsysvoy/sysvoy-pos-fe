"use client"

import Image from "next/image"
import { Pencil, Trash2 } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"
import axios from "axios"
import { useEffect, useState } from "react"
import { toast } from "sonner"

interface Product {
  id: string
  name: string
  description?: string
  imageUrl?: string
  stock: number
  category?: { name: string }
  price: number
  available: boolean
}

export default function MenuTable() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(false)

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

  return (
    <div className="bg-zinc-900 rounded-xl overflow-hidden">
      {/* Header */}
      <div className="grid grid-cols-9 px-4 py-3 text-sm text-zinc-400">
        <span></span>
        <span>Product</span>
        <span className="col-span-2">Product Name</span>
        <span>Item ID</span>
        <span>Stock</span>
        <span>Category</span>
        <span>Price</span>
        <span>Availability</span>
      </div>

      {loading ? (
        <p className="p-4 text-center text-zinc-400">Loading products...</p>
      ) : (
        products.map((product) => (
          <div
            key={product.id}
            className="grid grid-cols-9 items-center px-4 py-4 border-t border-white/5 hover:bg-white/5"
          >
            <Checkbox />

            <Image
              src={product.imageUrl || "/placeholder.png"}
              alt={product.name}
              width={50}
              height={50}
              className="rounded-md object-cover"
            />

            <div className="col-span-2">
              <p className="font-medium">{product.name}</p>
              <p className="text-sm text-zinc-400 truncate max-w-xs">
                {product.description}
              </p>
            </div>

            <span>#{product.id}</span>
            <span>{product.stock} items</span>
            <span>{product.category?.name || "-"}</span>
            <span>${product.price.toFixed(2)}</span>

            <div className="flex items-center justify-between">
              <span
                className={`text-sm ${
                  product.available ? "text-green-400" : "text-red-400"
                }`}
              >
                {product.stock>0 ? "In Stock" : "Out of Stock"}
              </span>

              <div className="flex gap-3">
                <Pencil className="h-4 w-4 cursor-pointer" />
                <Trash2 className="h-4 w-4 text-red-500 cursor-pointer" />
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  )
}
