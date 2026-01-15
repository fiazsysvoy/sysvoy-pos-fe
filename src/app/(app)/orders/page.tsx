"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { Search, Pencil, Trash2, CheckCircle2, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"
import axios from "axios"
import api from "@/lib/axios"

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
  status: "IN_PROCESS" | "COMPLETED" | "CANCELLED"
  completedAt?: string | null
  cancelledAt?: string | null
  items: OrderItem[]
  createdBy?: {
    id: string
    name: string | null
    email: string
  } | null
}

type OrderFilterStatus = "all" | "in_process" | "completed" | "cancelled"

export default function OrdersPage() {
  const router = useRouter()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(false)
  const [selectedFilter, setSelectedFilter] = useState<OrderFilterStatus>("all")
  const [searchQuery, setSearchQuery] = useState("")

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true)
      if (typeof window === "undefined") return

      const res = await api.get(`/api/orders`)

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
    
    const dayName = days[date.getDay()]
    const day = date.getDate()
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

  const getOrderStatus = (
    order: Order,
  ): { status: string; color: string; icon: any; subStatus?: string } => {
    switch (order.status) {
      case "COMPLETED":
        return { status: "Completed", color: "bg-[#B2E8FF]", icon: CheckCircle2 }
      case "CANCELLED":
        return {
          status: "Cancelled",
          color: "bg-[#FFEBDE]",
          icon: Clock,
          subStatus: "Cancelled",
        }
      case "IN_PROCESS":
      default:
        return {
          status: "In Process",
          color: "bg-[#FFEBDE]",
          icon: Clock,
          subStatus: "In the Kitchen",
        }
    }
  }

  const filteredOrders = orders.filter((order) => {
    // Filter by status
    if (selectedFilter !== "all") {
      if (selectedFilter === "in_process") {
        if (order.status !== "IN_PROCESS") return false
      } else if (selectedFilter === "completed") {
        if (order.status !== "COMPLETED") return false
      } else if (selectedFilter === "cancelled") {
        if (order.status !== "CANCELLED") return false
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

  const handleCancelOrder = async (orderId: string) => {
    if (typeof window === "undefined") return
    if (!confirm("Are you sure you want to cancel this order?")) return

    try {
      await api.patch(`/api/orders/${orderId}`, { status: "CANCELLED" })
      
      toast.success("Order cancelled successfully")
      
      // Refresh the orders list to reflect updated status
      await fetchOrders()
    } catch (err: any) {
      toast.error(
        err.response?.data?.message ||
          err.response?.data?.errors?.[0] ||
          "Failed to cancel order",
      )
      console.error(err)
    }
  }

  const handleCompleteOrder = async (orderId: string) => {
    if (typeof window === "undefined") return

    try {
      await api.patch(`/api/orders/${orderId}`, { status: "COMPLETED" })

      toast.success("Order marked as completed")

      await fetchOrders()
    } catch (err: any) {
      toast.error(
        err.response?.data?.message ||
          err.response?.data?.errors?.[0] ||
          "Failed to complete order",
      )
      console.error(err)
    }
  }

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] bg-background text-foreground overflow-hidden">
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col p-6 overflow-hidden">
        {/* Filter Tabs and Actions */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex gap-2">
            <Button
              variant="ghost"
              className={`${
                selectedFilter === "all"
                  ? "bg-[#FAC1D9] text-black hover:bg-[#FAC1D9]/80"
                  : "text-muted-foreground hover:text-foreground hover:bg-accent"
              }`}
              onClick={() => setSelectedFilter("all")}
            >
              All
            </Button>
            <Button
              variant="ghost"
              className={`${
                selectedFilter === "in_process"
                  ? "bg-[#FAC1D9] text-black hover:bg-[#FAC1D9]/80"
                  : "text-muted-foreground hover:text-foreground hover:bg-accent"
              }`}
              onClick={() => setSelectedFilter("in_process")}
            >
              In Process
            </Button>
            <Button
              variant="ghost"
              className={`${
                selectedFilter === "completed"
                  ? "bg-[#FAC1D9] text-black hover:bg-[#FAC1D9]/80"
                  : "text-muted-foreground hover:text-foreground hover:bg-accent"
              }`}
              onClick={() => setSelectedFilter("completed")}
            >
              Completed
            </Button>
            <Button
              variant="ghost"
              className={`${
                selectedFilter === "cancelled"
                  ? "bg-[#FAC1D9] text-black hover:bg-[#FAC1D9]/80"
                  : "text-muted-foreground hover:text-foreground hover:bg-accent"
              }`}
              onClick={() => setSelectedFilter("cancelled")}
            >
              Cancelled
            </Button>
          </div>

          <div className="flex items-center gap-4">
            <Button
              className="bg-[#FAC1D9] hover:bg-[#FAC1D9]/80 text-black"
              onClick={() => router.push("/orders/new")}
            >
              Add New Order
            </Button>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search a name, order or etc"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 w-64 bg-card border-border text-card-foreground placeholder:text-muted-foreground"
              />
            </div>
          </div>
        </div>

        {/* Orders Grid */}
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-muted-foreground">Loading orders...</p>
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-6 overflow-y-auto flex-1 pr-2 auto-rows-min">
            {filteredOrders.map((order, index) => {
              // Choose the appropriate timestamp and label based on status
              let referenceDate: string = order.createdAt
              let statusTimeLabel = "Created at"

              if (order.status === "COMPLETED" && order.completedAt) {
                referenceDate = order.completedAt
                statusTimeLabel = "Completed at"
              } else if (order.status === "CANCELLED" && order.cancelledAt) {
                referenceDate = order.cancelledAt
                statusTimeLabel = "Cancelled at"
              } else if (order.status === "CANCELLED") {
                statusTimeLabel = "Cancelled at"
              }

              const { date, time } = formatDate(referenceDate)
              const orderStatus = getOrderStatus(order)
              const StatusIcon = orderStatus.icon

              // Determine status colors based on status type
              let statusBgColor = "bg-[#E3FFE4]"
              let statusDotColor = "bg-green-500"
              let statusTextColor = "text-black"
              if (orderStatus.status === "Completed") {
                statusBgColor = "bg-[#B2E8FF]"
                statusDotColor = "bg-blue-500"
                statusTextColor = "text-black"
              } else if (orderStatus.status === "Ready") {
                statusBgColor = "bg-[#E3FFE4]"
                statusDotColor = "bg-green-500"
                statusTextColor = "text-black"
              } else if (orderStatus.status === "In Process") {
                statusBgColor = "bg-[#FFEBDE]"
                statusTextColor = "text-black"
                if (orderStatus.subStatus === "Cooking Now") {
                  statusDotColor = "bg-yellow-500"
                } else {
                  statusDotColor = "bg-red-500"
                }
              }

              return (
                <Card key={order.id} className="bg-card border-border p-6 flex flex-col h-auto w-full">
                  {/* Header with Order Number and Customer Info */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-4 flex-1">
                      {/* Pink Order Number Badge */}
                      <div className="bg-[#FAC1D9] text-black text-2xl w-12 h-12 flex items-center justify-center rounded flex-shrink-0">
                        {String(index + 1).padStart(2, "0")}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-base whitespace-nowrap overflow-hidden text-ellipsis text-card-foreground">
                          {order.createdBy?.name || order.createdBy?.email || "Watson Joyce"}
                        </p>
                        <p className="text-sm text-muted-foreground">Order # {order.id.slice(-3).padStart(3, "0")}</p>
                      </div>
                    </div>
                    {/* Status Badge Top Right */}
                    <div className="flex flex-col items-end flex-shrink-0">
                      <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md ${statusBgColor} ${statusTextColor} text-xs  mb-1`}>
                        <StatusIcon className="h-3.5 w-3.5" />
                        {orderStatus.status}
                      </div>
                      {orderStatus.subStatus && (
                        <div className="flex items-center gap-1.5">
                          <div className={`h-2 w-2 rounded-full ${statusDotColor}`}></div>
                          <span className="text-xs text-muted-foreground">{orderStatus.subStatus}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Date and Time (based on status) */}
                  <div className="mb-4 flex justify-between">
                    <p className="text-sm text-muted-foreground">
                      {statusTimeLabel}: {date}
                    </p>
                    <p className="text-sm text-muted-foreground">{time}</p>
                  </div>

                  {/* Order Items Table */}
                  <div className="mb-4 flex-1">
                    <div className="grid grid-cols-3 gap-2 text-xs text-muted-foreground mb-2 pb-1 border-b border-border">
                      <span>Qty</span>
                      <span>Items</span>
                      <span className="text-right">Price</span>
                    </div>
                    <div className="space-y-1.5 mt-2">
                      {order.items.slice(0, 4).map((item) => (
                        <div key={item.id} className="grid grid-cols-3 gap-2 text-sm">
                          <span className="text-card-foreground">{String(item.quantity).padStart(2, "0")}</span>
                          <span className="text-card-foreground text-sm">{item.product.name}</span>
                          <span className="text-right font-semibold text-card-foreground">${(item.price * item.quantity).toFixed(2)}</span>
                        </div>
                      ))}
                      {order.items.length > 4 && (
                        <p className="text-xs text-muted-foreground mt-2">+{order.items.length - 4} more items</p>
                      )}
                    </div>
                  </div>

                  {/* SubTotal */}
                  <div className="mb-4 pt-2 border-t border-border">
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground text-sm">SubTotal</span>
                      <span className="font-semibold text-base text-card-foreground">${order.totalAmount.toFixed(2)}</span>
                    </div>
                  </div>

                  {/* Action Buttons (only for IN_PROCESS orders) */}
                  {order.status === "IN_PROCESS" && (
                    <div className="flex items-center gap-2 mt-auto">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-10 w-10 bg-accent border border-[#FAC1D9] p-5 text-[#FAC1D9] hover:bg-accent/80 flex-shrink-0"
                        onClick={() => router.push(`/orders/edit/${order.id}`)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-10 w-10 bg-accent border border-[#FAC1D9] p-5 text-[#FAC1D9] hover:bg-accent/80 flex-shrink-0 "
                        onClick={() => handleCancelOrder(order.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                      <Button
                        className="flex-1 bg-[#FAC1D9] hover:bg-[#FAC1D9]/80 text-black  h-10"
                        onClick={() => handleCompleteOrder(order.id)}
                      >
                        Pay Bill
                      </Button>
                    </div>
                  )}
                </Card>
              )
            })}
          </div>
        )}

        {!loading && filteredOrders.length === 0 && (
          <div className="flex items-center justify-center h-full">
            <p className="text-muted-foreground">No orders found</p>
          </div>
        )}
      </div>
    </div>
  )
}
