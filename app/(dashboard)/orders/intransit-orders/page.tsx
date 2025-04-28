'use client'

import React, { useEffect, useState } from "react"
import { Eye, Package, EyeClosed, User2, Download, Filter } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card"
import { useOrderManager } from "@/context/OrderContext"

import OrderTracker from "@/components/orders/order-tracker"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface ProductDetail {
  name: string;
  quantity: number;
  price: number;
}

const orderSteps = [
  { id: 1, title: "In Transit" },
  { id: 2, title: "In Warehouse" },
  { id: 3, title: "On the Way for Delivery" },
  { id: 4, title: "Delivered" },
  { id: 5, title: "Cancelled by Customer" }
];

export default function InTransitOrders() {
  const { inTransitOrders, cancelInTransitOrder, loading, error, fetchInTransitOrders } = useOrderManager()
  const [isInitialLoad, setIsInitialLoad] = useState(true)
  const [expandedOrders, setExpandedOrders] = useState<Record<string, boolean>>({})

  useEffect(() => {
    if (isInitialLoad) {
      fetchInTransitOrders()
      setIsInitialLoad(false)
    }
  }, [isInitialLoad, fetchInTransitOrders])

  const toggleOrder = (orderId: string) => {
    setExpandedOrders((prev) => ({
      ...prev,
      [orderId]: !prev[orderId],
    }))
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Received":
        return "bg-gray-300 text-gray-800"
      case "Acknowledged – Awaiting Processing":
        return "bg-yellow-100 text-yellow-700"
      case "Processing Completed":
        return "bg-green-100 text-green-700"
      case "Cancelled by Customer":
        return "bg-red-100 text-red-700"
      case "Rerouted":
        return "bg-blue-100 text-blue-700"
      default:
        return "bg-muted text-muted-foreground"
    }
  }
  const handleCancelOrder = (orderId: number) => {

    const result = cancelInTransitOrder(orderId)
    alert(result)

  };




  const renderOrderDetails = (order: any) => {
    // Parse product details string to an object
    const parsedProductDetails: Record<string, ProductDetail> = JSON.parse(order.product_details);

    return (
      <div className="overflow-x-scroll">
        <div className={`p-4 rounded-t-lg mb-4 ${getStatusColor(order.order_status)}`}>
          <h3 className="text-lg font-semibold">{order.order_status}</h3>
          <p className="text-sm ">Order #{order.id}</p>
        </div>

        {/* order details */}
        <div className="grid grid-cols-6">
          {/* track orders */}
          <div>
            <OrderTracker order={order} steps={orderSteps}/>
          </div>

          {/* order details */}
        <div className="p-2 col-span-5">
          {/* Order Details */}
          <div className="p-4 border space-y-1 bg-white rounded-lg mb-4">
            <h4 className="font-medium text-sm text-gray-500">Order Details</h4>
            <hr />
            <div className="text-gray-500 gap-2 flex items-center font-medium text-sm">
              <User2 />
              <p>{order.user_id}</p>
            </div>
            <p className="text-sm text-gray-500">
              <strong>Order Date:</strong> {new Date(order.created_on).toLocaleDateString()}
            </p>
          </div>

          {/* Items Section (Optional) */}
          <div className="p-4 border bg-white rounded-lg mb-4">
            <h4 className="font-medium text-sm text-gray-500">Items</h4>
            <hr />
            <p className="text-sm text-gray-800">
              {/* <strong>Store Processing order:</strong> TODO: Add dynamic value */}
            </p>
            <ul className="list-inside mt-2 space-y-2">
              {Object.entries(parsedProductDetails).map(([key, product], index) => (
                <li key={index} className="flex justify-between">
                  <p className="font-semibold text-gray-700">{product.name}</p>
                  <p className="font-semibold text-gray-700"><span className="text-xs">Qty</span> : {product.quantity} - <span className="text-xs">Unit Price</span> Kes {product.price}</p>
                  <p className="font-semibold text-gray-700">Kes {product.price * product.quantity}</p>
                </li>
              ))}
            </ul>
          </div>

          {/* Payment Section */}
          <div className="p-4 border text-gray-800 space-y-1 bg-white rounded-lg">
            <h4 className="font-medium text-sm text-gray-500">Payment</h4>
            <hr />
            <div className="flex items-center text-sm justify-between">
              <p className="font-semibold">Status:</p>
              <p>{order.created_on}</p>
            </div>
            <div className="flex items-center text-sm justify-between">
              <p className="font-semibold">Order Time:</p>
              <p>{order.created_on}</p>
            </div>
            <div className="flex items-center text-sm justify-between">
              <p className="font-semibold">Days since Ordered:</p>
              <p>{order.days_since_order}</p>
            </div>
            <div className="flex items-center text-sm justify-between">
              <p className="font-semibold">Payment mode:</p>
              <p>{order.payment_mode}</p>
            </div>
            <div className="flex items-center text-sm justify-between">
              <p className="font-semibold">Total Paid:</p>
              <p>KSh {order?.amount_paid}</p>
            </div>
          </div>
        </div>
        </div>
      </div>
    )
  }


  const renderOrders = () => {
    if (loading && isInitialLoad) {
      return <p className="text-sm text-muted-foreground">Loading in-transit orders...</p>
    }

    if (error) {
      return <p className="text-sm text-red-600">Error: {error}</p>
    }

    if (inTransitOrders.length === 0) {
      return <p className="text-sm text-muted-foreground">No in-transit orders found.</p>
    }

    return (
      <div className="space-y-4">
        {inTransitOrders.map((order) => {
          const orderId = order.id.toString()
          const isOpen = expandedOrders[orderId] || false

          return (
            <div key={order.id} className="rounded-lg border">

              <div
                key={order.id}
                className="md:flex grid items-center justify-between rounded-lg border p-4"
              >
                <div className="md:flex grid items-center gap-4">
                  <div className="rounded-full bg-primary p-2">
                    <Package className="h-4 w-4 text-primary-foreground" />
                  </div>
                  <div>
                    <div className="font-medium">#{order.id}</div>
                    <div className="text-sm text-muted-foreground">
                      {new Date(order.created_on).toLocaleDateString()}
                    </div>
                  </div>
                </div>
                <div className="md:flex grid items-center gap-4">
                  <Badge
                    variant="outline"
                    className={getStatusColor(order.order_status)}
                  >
                    {order.order_status}
                  </Badge>
                  <div className="font-medium">
                    KSh {order.amount_paid.toFixed(2)}
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => toggleOrder(orderId)}>
                    {isOpen ? <EyeClosed className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                  <Button
                    variant="destructive"
                    className="ml-2"
                    onClick={() => handleCancelOrder(order.id)}
                    disabled={order.order_status === "DELIVERED" || order.order_status === "CANCELLED BY CUSTOMER"}
                  >
                    Cancel Order
                  </Button>

                </div>
              </div>
              {isOpen && <CardContent className="border-t pt-4">{renderOrderDetails(order)}</CardContent>}
            </div>
          )
        })}
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Cancelled & Returned Orders</h1>
          <p className="text-muted-foreground">View and manage cancelled and returned orders.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline">
            <Filter className="mr-2 h-4 w-4" />
            Filter
          </Button>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>
       

       {/* rendered orders */}
       <div className="space-y-4 p-6 border rounded-md">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <CardTitle>Intransit Orders</CardTitle>
              <CardDescription>Showing {inTransitOrders.length} Intransit orders</CardDescription>
            </div>
            <div className="flex gap-2">
              <Select defaultValue="all">
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                  <SelectItem value="returned">Returned</SelectItem>
                </SelectContent>
              </Select>
              <Input placeholder="Search orders..." className="w-[200px]" />
            </div>
            </div>
      {renderOrders()}
      </div>
    </div>
  )
}
