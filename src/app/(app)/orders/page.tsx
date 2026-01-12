"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { Search, Pencil, Trash2, CheckCircle2, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"
import axios from "axios"

interface OrderItem {
  id: string
  productId: string
  quantity: number
  price: number
  product: {
    id: string
    name: string
    price: number
  }
}

interface Order {
  id: string
  totalAmount: number
  createdAt: string
  items: OrderItem[]
  createdBy?: {
    id: string
    name: string | null
    email: string
  } | null
}

type OrderStatus = "all" | "in_process" | "completed" | "cancelled"

export default function OrdersPage() {
  const router = useRouter()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(false)
  const [selectedFilter, setSelectedFilter] = useState<OrderStatus>("all")
  const [searchQuery, setSearchQuery] = useState("")

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true)
      const apiUrl = process.env.NEXT_PUBLIC_API_URL
      
      if (typeof window === "undefined") return
      const token = localStorage.getItem("token")

      if (!token) {
        toast.error("Please login to view orders")
        return
      }

      const res = await axios.get(`${apiUrl}api/orders`, {
        headers: { Authorization: `Bearer ${token}` },
        params: {
          pageIndex: 0,
          pageSize: 100,
        },
      })

      setOrders(res.data.data.data || [])
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to fetch orders")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchOrders()
  }, [fetchOrders])

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
    
    const dayName = days[date.getDay()]
    const day = date.getDate()
    const month = months[date.getMonth()]
    const year = date.getFullYear()
    
    const hours = date.getHours()
    const minutes = date.getMinutes()
    const ampm = hours >= 12 ? "PM" : "AM"
    const displayHours = hours % 12 || 12
    const displayMinutes = minutes.toString().padStart(2, "0")
    
    return {
      date: `${dayName}, ${day}, ${year}`,
      time: `${displayHours}:${displayMinutes} ${ampm}`
    }
  }

  const getOrderStatus = (order: Order): { status: string; color: string; icon: any; subStatus?: string } => {
    // For now, we'll use a simple logic based on order age or other factors
    // In a real app, this would come from the order model
    const orderDate = new Date(order.createdAt)
    const now = new Date()
    const diffHours = (now.getTime() - orderDate.getTime()) / (1000 * 60 * 60)

    // Mock status logic - you can replace this with actual status from backend
    if (diffHours > 24) {
      return { status: "Completed", color: "bg-blue-500", icon: CheckCircle2 }
    } else if (diffHours > 2) {
      return { status: "Ready", color: "bg-green-500", icon: CheckCircle2, subStatus: "Ready to serve" }
    } else if (diffHours > 1) {
      return { status: "In Process", color: "bg-yellow-500", icon: Clock, subStatus: "Cooking Now" }
    } else {
      return { status: "In Process", color: "bg-pink-500", icon: Clock, subStatus: "In the Kitchen" }
    }
  }

  const filteredOrders = orders.filter((order) => {
    // Filter by status
    if (selectedFilter !== "all") {
      const orderStatus = getOrderStatus(order)
      if (selectedFilter === "in_process") {
        // Show orders that are "In Process" or "Ready"
        if (orderStatus.status !== "In Process" && orderStatus.status !== "Ready") {
          return false
        }
      } else if (selectedFilter === "completed") {
        if (orderStatus.status !== "Completed") {
          return false
        }
      } else if (selectedFilter === "cancelled") {
        if (orderStatus.status !== "Cancelled") {
          return false
        }
      }
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      const customerName = (order.createdBy?.name || order.createdBy?.email || "").toLowerCase()
      const orderId = order.id.toLowerCase()
      const productNames = order.items.map(item => item.product.name.toLowerCase()).join(" ")
      
      if (!customerName.includes(query) && !orderId.includes(query) && !productNames.includes(query)) {
        return false
      }
    }

    return true
  })

  const handleDeleteOrder = async (orderId: string) => {
    if (typeof window === "undefined") return
    if (!confirm("Are you sure you want to delete this order?")) return

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL
      const token = localStorage.getItem("token")

      if (!token) {
        toast.error("Please login to delete orders")
        return
      }

      await axios.delete(`${apiUrl}api/orders/${orderId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      
      toast.success("Order deleted successfully")
      
      // Refresh the orders list to show remaining orders
      await fetchOrders()
    } catch (err: any) {
      toast.error(err.response?.data?.message || err.response?.data?.errors?.[0] || "Failed to delete order")
      console.error(err)
    }
  }

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] bg-[#1f2326] text-white overflow-hidden">
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col p-6 overflow-hidden">
        {/* Filter Tabs and Actions */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex gap-2">
            <Button
              variant="ghost"
              className={`${
                selectedFilter === "all"
                  ? "bg-pink-500 text-white hover:bg-pink-600"
                  : "text-gray-400 hover:text-white hover:bg-gray-700"
              }`}
              onClick={() => setSelectedFilter("all")}
            >
              All
            </Button>
            <Button
              variant="ghost"
              className={`${
                selectedFilter === "in_process"
                  ? "bg-pink-500 text-white hover:bg-pink-600"
                  : "text-gray-400 hover:text-white hover:bg-gray-700"
              }`}
              onClick={() => setSelectedFilter("in_process")}
            >
              In Process
            </Button>
            <Button
              variant="ghost"
              className={`${
                selectedFilter === "completed"
                  ? "bg-pink-500 text-white hover:bg-pink-600"
                  : "text-gray-400 hover:text-white hover:bg-gray-700"
              }`}
              onClick={() => setSelectedFilter("completed")}
            >
              Completed
            </Button>
            <Button
              variant="ghost"
              className={`${
                selectedFilter === "cancelled"
                  ? "bg-pink-500 text-white hover:bg-pink-600"
                  : "text-gray-400 hover:text-white hover:bg-gray-700"
              }`}
              onClick={() => setSelectedFilter("cancelled")}
            >
              Cancelled
            </Button>
          </div>

          <div className="flex items-center gap-4">
            <Button
              className="bg-pink-500 hover:bg-pink-600 text-white"
              onClick={() => router.push("/orders/new")}
            >
              Add New Order
            </Button>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search a name, order or etc"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 w-64 bg-[#2a2e32] border-gray-700 text-white placeholder:text-gray-400"
              />
            </div>
          </div>
        </div>

        {/* Orders Grid */}
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-400">Loading orders...</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-6 overflow-y-auto flex-1 pr-2">
            {filteredOrders.map((order, index) => {
              const { date, time } = formatDate(order.createdAt)
              const orderStatus = getOrderStatus(order)
              const StatusIcon = orderStatus.icon

              return (
                <Card key={order.id} className="bg-[#2a2e32] border-gray-700 p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <div className="bg-pink-500 text-white font-bold text-xl px-4 py-2 rounded">
                        {String(index + 1).padStart(2, "0")}
                      </div>
                      <div>
                        <p className="font-semibold text-lg">
                          {order.createdBy?.name || order.createdBy?.email || "Guest Customer"}
                        </p>
                        <p className="text-sm text-gray-400">Order # {order.id.slice(0, 8)}</p>
                      </div>
                    </div>
                  </div>

                  <div className="mb-4">
                    <p className="text-sm text-gray-400">{date}</p>
                    <p className="text-sm text-gray-400">{time}</p>
                  </div>

                  {/* Order Items */}
                  <div className="mb-4 space-y-2">
                    <div className="grid grid-cols-3 gap-2 text-sm text-gray-400 mb-2">
                      <span>Qty</span>
                      <span>Items</span>
                      <span className="text-right">Price</span>
                    </div>
                    {order.items.slice(0, 4).map((item, idx) => (
                      <div key={item.id} className="grid grid-cols-3 gap-2 text-sm">
                        <span className="text-gray-300">{String(item.quantity).padStart(2, "0")}</span>
                        <span className="text-gray-300">{item.product.name}</span>
                        <span className="text-right font-semibold">${(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                    {order.items.length > 4 && (
                      <p className="text-xs text-gray-500">+{order.items.length - 4} more items</p>
                    )}
                  </div>

                  <div className="mb-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">SubTotal</span>
                      <span className="font-semibold">${order.totalAmount.toFixed(2)}</span>
                    </div>
                  </div>

                  {/* Status Badge */}
                  <div className="mb-4">
                    <div className={`inline-flex items-center gap-2 px-3 py-1 rounded ${orderStatus.color} text-white text-sm font-semibold mb-2`}>
                      <StatusIcon className="h-4 w-4" />
                      {orderStatus.status}
                    </div>
                    {orderStatus.subStatus && (
                      <div className="flex items-center gap-2 mt-2">
                        <div className={`h-2 w-2 rounded-full ${orderStatus.color.replace("bg-", "bg-")}`}></div>
                        <span className="text-sm text-gray-400">{orderStatus.subStatus}</span>
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-10 w-10 text-white hover:bg-gray-700"
                      onClick={() => router.push(`/orders/edit/${order.id}`)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-10 w-10 text-white hover:bg-gray-700"
                      onClick={() => handleDeleteOrder(order.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                    <Button className="flex-1 bg-pink-500 hover:bg-pink-600 text-white">
                      Pay Bill
                    </Button>
                  </div>
                </Card>
              )
            })}
          </div>
        )}

        {!loading && filteredOrders.length === 0 && (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-400">No orders found</p>
          </div>
        )}
      </div>
    </div>
  )
}
