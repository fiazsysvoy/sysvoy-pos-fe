"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { ChevronLeft, Minus, Plus, Pencil, ScanLine } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"
import axios from "axios"

interface Category {
  id: string
  name: string
  itemsCount?: number
  imageUrl?: string
}

interface Product {
  id: string
  name: string
  price: number
  categoryId: string
  images?: { url: string; publicId: string }[]
}

interface CartItem {
  id: string
  name: string
  price: number
  quantity: number
  productId: string
}

export default function EditOrderPage() {
  const router = useRouter()
  const params = useParams()
  const orderId = params.id as string

  const [categories, setCategories] = useState<Category[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [quantities, setQuantities] = useState<{ [key: string]: number }>({})
  const [cart, setCart] = useState<CartItem[]>([])
  const [customerName, setCustomerName] = useState("Watson Joyce")
  const [tableNumber, setTableNumber] = useState("01")
  const [loading, setLoading] = useState(false)
  const [loadingProducts, setLoadingProducts] = useState(false)
  const [loadingOrder, setLoadingOrder] = useState(false)

  const fetchCategories = async () => {
    try {
      setLoading(true)
      const apiUrl = process.env.NEXT_PUBLIC_API_URL
      const token = localStorage.getItem("token")

      const res = await axios.get(`${apiUrl}api/categories`, {
        headers: { Authorization: `Bearer ${token}` },
        params: {
          pageIndex: 0,
          pageSize: 100,
        },
      })

      const data: Category[] = res.data.data.map((cat: any) => ({
        id: cat.id,
        name: cat.name,
        itemsCount: cat.itemsCount || 0,
        imageUrl: cat.imageUrl,
      }))

      setCategories(data)
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to fetch categories")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const fetchProducts = async () => {
    try {
      setLoadingProducts(true)
      const apiUrl = process.env.NEXT_PUBLIC_API_URL
      const token = localStorage.getItem("token")

      const res = await axios.get(`${apiUrl}api/products`, {
        headers: { Authorization: `Bearer ${token}` },
        params: {
          pageIndex: 0,
          pageSize: 100,
        },
      })

      setProducts(res.data.data || [])
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to fetch products")
      console.error(err)
    } finally {
      setLoadingProducts(false)
    }
  }

  const fetchOrder = async () => {
    try {
      setLoadingOrder(true)
      const apiUrl = process.env.NEXT_PUBLIC_API_URL
      const token = localStorage.getItem("token")

      const res = await axios.get(`${apiUrl}api/orders/${orderId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })

      const order = res.data.data
      if (order) {
        // Populate cart with existing order items
        const orderItems: CartItem[] = order.items.map((item: any) => ({
          id: item.id,
          name: item.product.name,
          price: item.price,
          quantity: item.quantity,
          productId: item.productId,
        }))
        setCart(orderItems)
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to fetch order")
      console.error(err)
    } finally {
      setLoadingOrder(false)
    }
  }

  useEffect(() => {
    fetchCategories()
    fetchProducts()
    if (orderId) {
      fetchOrder()
    }
  }, [orderId])

  const filteredProducts = selectedCategory
    ? products.filter((p) => p.categoryId === selectedCategory)
    : products

  const updateQuantity = (productId: string, change: number) => {
    setQuantities((prev) => ({
      ...prev,
      [productId]: Math.max(0, (prev[productId] || 1) + change),
    }))
  }

  const addToCart = (product: Product) => {
    const quantity = quantities[product.id] || 1
    if (quantity === 0) return

    const existingItem = cart.find((item) => item.productId === product.id)
    if (existingItem) {
      setCart((prev) =>
        prev.map((item) =>
          item.productId === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        )
      )
    } else {
      setCart((prev) => [
        ...prev,
        {
          id: product.id,
          name: product.name,
          price: product.price,
          quantity,
          productId: product.id,
        },
      ])
    }

    setQuantities((prev) => ({ ...prev, [product.id]: 1 }))
    toast.success(`${product.name} added to cart`)
  }

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.productId !== productId))
  }

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const tax = subtotal * 0.05
  const total = subtotal + tax

  const handleUpdateOrder = async () => {
    if (cart.length === 0) {
      toast.error("Please add items to the order")
      return
    }

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL
      const token = localStorage.getItem("token")

      // Note: You may need to add an UPDATE endpoint in your backend
      // For now, we'll create a new order and delete the old one, or use PUT if available
      const orderData = {
        items: cart.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
        })),
      }

      // If PUT endpoint exists, use it. Otherwise, show a message
      toast.info("Update order functionality - backend endpoint needed")
      // await axios.put(`${apiUrl}api/orders/${orderId}`, orderData, {
      //   headers: { Authorization: `Bearer ${token}` },
      // })

      // toast.success("Order updated successfully")
      // router.push("/orders")
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to update order")
      console.error(err)
    }
  }

  return (
    <div className="flex h-[calc(100vh-4rem)] bg-background text-foreground">
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col p-6 overflow-hidden">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant="ghost"
            size="icon"
            className="text-foreground hover:bg-accent"
            onClick={() => router.push("/orders")}
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-semibold">Edit Order</h1>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-4 gap-6 mb-6">
          {loading ? (
            <p className="text-muted-foreground">Loading categories...</p>
          ) : (
            categories.map((category) => (
              <Card
                key={category.id}
                className={`bg-card border-0 cursor-pointer hover:bg-accent transition-colors h-[170px] flex flex-col ${
                  selectedCategory === category.id ? "ring-2 ring-[#FAC1D9]" : ""
                }`}
                onClick={() => setSelectedCategory(category.id)}
              >
                <div className="p-4 flex flex-col items-center justify-center h-full">
                  <div className="mb-3 p-3 rounded-full bg-[#FAC1D9]/20 flex-shrink-0">
                    {category.imageUrl ? (
                      <img
                        src={category.imageUrl}
                        alt={category.name}
                        className="h-10 w-10 object-cover rounded"
                      />
                    ) : (
                      <div className="h-10 w-10 bg-[#FAC1D9] rounded" />
                    )}
                  </div>
                  <div className="flex-1 flex flex-col justify-end w-full">
                    <h3 className="text-sm font-semibold mb-0.5 text-card-foreground text-left w-full">{category.name}</h3>
                    <p className="text-xs text-muted-foreground text-left w-full">
                      {products.filter((p) => p.categoryId === category.id).length} items
                    </p>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>

        {/* Product Items Grid */}
        <div className="grid grid-cols-4 gap-6 overflow-y-auto flex-1">
          {loadingProducts ? (
            <p className="text-muted-foreground">Loading products...</p>
          ) : (
            filteredProducts.map((product) => {
              const quantity = quantities[product.id] || 1
              return (
                <Card key={product.id} className="bg-card border-0 h-[170px] flex flex-col overflow-hidden">
                  <div className="p-3 flex flex-col h-full justify-between">
                    <div className="flex-1">
                      <div className="text-[10px] text-card-foreground mb-1.5">Order → Kitchen</div>
                      <h3 className="text-sm font-semibold mb-1.5 text-card-foreground line-clamp-2 leading-tight">{product.name}</h3>
                      <p className="text-base font-bold text-card-foreground">
                        ${product.price.toFixed(2)}
                      </p>
                    </div>
                    <div className="flex items-center justify-between mt-3">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-card-foreground hover:bg-accent flex-shrink-0 rounded-full"
                        onClick={() => updateQuantity(product.id, -1)}
                      >
                        <Minus className="h-3.5 w-3.5" />
                      </Button>
                      <span className="text-card-foreground font-semibold text-sm">
                        {String(quantity).padStart(2, "0")}
                      </span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-card-foreground hover:bg-accent flex-shrink-0 rounded-full bg-accent/50"
                        onClick={() => updateQuantity(product.id, 1)}
                      >
                        <Plus className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                </Card>
              )
            })
          )}
        </div>
      </div>

      {/* Right Sidebar - Order Summary */}
      <div className="w-96 bg-card border-l border-border flex flex-col h-full">
        <div className="p-6 border-b border-border">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-2xl font-bold text-card-foreground">Table {tableNumber}</h2>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-card-foreground hover:bg-accent"
              onClick={() => {
                const newTable = prompt("Enter table number:", tableNumber)
                if (newTable) setTableNumber(newTable)
              }}
            >
              <Pencil className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <p className="text-muted-foreground">{customerName}</p>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 text-card-foreground hover:bg-accent"
              onClick={() => {
                const newName = prompt("Enter customer name:", customerName)
                if (newName) setCustomerName(newName)
              }}
            >
              <Pencil className="h-3 w-3" />
            </Button>
          </div>
        </div>

        {/* Ordered Items List */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="space-y-4">
            {cart.map((item, index) => (
              <div key={item.id} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="bg-[#FAC1D9] text-black rounded-full w-6 h-6 flex items-center justify-center text-xs font-semibold">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <p className="font-semibold text-card-foreground">
                      {item.name} x {item.quantity}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <p className="font-semibold text-card-foreground">${(item.price * item.quantity).toFixed(2)}</p>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 text-card-foreground hover:bg-accent"
                    onClick={() => removeFromCart(item.productId)}
                  >
                    <Minus className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            ))}
            {cart.length === 0 && (
              <p className="text-muted-foreground text-center py-8">No items in cart</p>
            )}
          </div>
        </div>

        {/* Bill Summary */}
        <div className="p-6 border-t border-border space-y-3">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Subtotal</span>
            <span className="font-semibold text-card-foreground">${subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Tax 5%</span>
            <span className="font-semibold text-card-foreground">${tax.toFixed(2)}</span>
          </div>
          <div className="border-t border-dashed border-border my-3"></div>
          <div className="flex justify-between text-xl">
            <span className="font-bold text-card-foreground">Total</span>
            <span className="font-bold text-card-foreground">${total.toFixed(2)}</span>
          </div>
        </div>

        {/* Payment Method */}
        <div className="p-6 border-t border-border">
          <h3 className="text-lg font-semibold mb-4 text-card-foreground">Payment Method</h3>
          <div className="flex flex-col items-center justify-center bg-background p-6 rounded-lg mb-4 border border-border">
            <div className="h-32 w-32 bg-muted rounded-lg flex items-center justify-center mb-2">
              <ScanLine className="h-16 w-16 text-muted-foreground" />
            </div>
            <p className="text-foreground mt-2 font-semibold">Scan QR Code</p>
          </div>
        </div>

        {/* Update Order Button */}
        <div className="p-6 border-t border-border">
          <Button
            className="w-full bg-[#FAC1D9] hover:bg-[#FAC1D9]/80 text-black font-semibold py-6 text-lg"
            onClick={handleUpdateOrder}
          >
            Update Order
          </Button>
        </div>
      </div>
    </div>
  )
}

