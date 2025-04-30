'use client'

import { useEffect, useState } from "react"
import { Download, Eye, Filter, Package, ShoppingBag, Truck, User2 } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useOrderManager } from "@/context/OrderContext"
import OrderTracker from "@/components/orders/order-tracker"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function DashboardOrders() {
  const { orderManager, fetchOrders, loading, error } = useOrderManager()
  const orders = orderManager.getAllHeaders()

  const [paginatedOrders, setPaginatedOrders] = useState<any[]>([]);
  const [isModalOpen, setModalOpen] = useState(false)
  const [cancelError, setCancelError] = useState<string | null>(null)
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null)
  const [orderToCancel, setOrderToCancel] = useState<number | null>(null)
  const [paymentMethod, setPaymentMethod] = useState("all")
  const [location, setLocation] = useState("all")
  const [page, setPage] = useState(1);
const [hasMore, setHasMore] = useState(true);

useEffect(() => {
  fetchOrders();
}, []);

  

  useEffect(() => {
    const handleScroll = () => {
      const nearBottom =
        window.innerHeight + window.scrollY >= document.body.offsetHeight - 100;
  
      if (nearBottom && hasMore && !loading) {
        setPage(prev => prev + 1);
      }
    };
  
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [hasMore, loading]);
  

  const handleCancelOrder = (orderId: number) => {
    const order = orders.find(o => o.id === orderId)
    if (order && (order.status_description === "Delivered" || order.status_description === "Received")) {
      setCancelError("This order cannot be cancelled because it is already delivered or received.")
    } else {
      setCancelError(null)
      setSelectedOrder(null)
      setOrderToCancel(orderId)
      setModalOpen(true)
    }
  }

  const confirmCancellation = () => {
    if (orderToCancel !== null) {
      orderManager.cancelOrder(orderToCancel)
      setModalOpen(false)
      fetchOrders()
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Received":
        return "bg-green-900 text-white"
      case "Acknowledged – Awaiting Processing":
        return "bg-yellow-700 text-white"
      case "Processing Completed":
        return "bg-green-500 text-white"
      case "Delivered":
        return "bg-blue-500 text-white"
      case "Cancelled by Customer":
        return "bg-red-500 text-white"
      default:
        return "bg-gray-400 text-muted-foreground"
    }
  }

  const filteredOrders = orders.filter(order => {
    const payment = orderManager.getPaymentByOrderId(order.id)
    if (paymentMethod !== "all" && payment?.payment_type !== paymentMethod) return false
    if (location !== "all" && order.store_id !== location) return false
    return true
  })

  const groupedOrders = {
    all: filteredOrders.sort((a, b) => new Date(b.created).getTime() - new Date(a.created).getTime()),
    received: filteredOrders.filter((o) => o.status_description.includes("Received")),
    processing: filteredOrders.filter((o) => o.status_description.includes("Processing")),
    delivered: filteredOrders.filter((o) => o.status_description === "Delivered"),
  }

 

  const renderOrders = (list: typeof orders) => {
    if (!list.length)
      return <p className="text-sm text-muted-foreground">No orders found.</p>

    return (
      <div className="space-y-4">
        {list.map((order) => {
          const details = orderManager.getDetailsByOrderId(order.id)
          const payment = orderManager.getPaymentByOrderId(order.id)
          const isExpanded = selectedOrder?.id === order.id

          return (
            <Card key={order.id} className="overflow-hidden">
              <div className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="rounded-full bg-primary p-2">
                      <Package className="h-4 w-4 text-primary-foreground" />
                    </div>
                    <div>
                      <div className="font-medium">#{order.id}</div>
                      <div className="text-sm text-muted-foreground">
                        {new Date(order.created).toLocaleDateString()} •{" "}
                        {Array.isArray(details) ? details.length : 0} items
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <Badge
                      variant="outline"
                      className={getStatusColor(order.status_description)}
                    >
                      {order.status_description}
                    </Badge>
                    <div className="font-medium">
                      KSh {order.grand_total.toFixed(2)}
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setSelectedOrder(isExpanded ? null : {
                          id: order.id,
                          header: order,
                          details,
                          payment
                        })}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => handleCancelOrder(order.id)}
                        disabled={order.status_description === "Delivered" || order.status_description === "Received"}
                      >
                        Cancel Order
                      </Button>
                    </div>
                  </div>
                </div>

                {isExpanded && (
                  <div className="mt-4 pt-4 border-t">
                    <div className="grid grid-cols-6">
                      <OrderTracker order={selectedOrder} steps={steps} />

                      <div className="p-2 col-span-5">
                        <div className="p-4 border space-y-1 bg-white rounded-lg mb-4">
                          <h4 className="font-medium text-sm text-gray-500">Order Details</h4>
                          <hr />
                          <div className="text-gray-500 gap-2 flex items-center font-medium text-sm">
                            <p><User2 /> </p>
                            <p>{order.user_id} </p>
                          </div>
                          <p className="text-sm text-gray-500">
                            <strong>Order Date:</strong> {new Date(order.created).toLocaleDateString()}
                          </p>
                        </div>

                        <div className="p-4 border bg-white rounded-lg mb-4">
                          <h4 className="font-medium text-sm text-gray-500">Items</h4>
                          <hr />
                          <p className="text-sm text-gray-800">
                            <strong>Store Processing order:</strong> {order.store_processing_order}
                          </p>
                          <ul className="list-inside mt-2 space-y-2">
                            {details?.map((item: any, index: number) => (
                              <li key={index} className="grid md:grid-cols-5 p-2 bg-gray-100 rounded item-center justify-between">
                                <p>{item.product_id} </p>
                                <p className="font-semibold md:col-span-2 text-gray-700">{item.item_name}</p>
                                <div className="flex gap-2 ">
                                  <p><strong>Unit price</strong>: Ksh{item.unit_price} </p> *
                                  <p>{item.qty}</p>
                                </div>
                                <p className="font-bold text-end text-lg float-end"> Ksh {item.sub_total}</p>
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div className="p-4 border text-gray-800 space-y-1 bg-white rounded-lg">
                          <h4 className="font-medium text-sm text-gray-500">Payment</h4>
                          <hr />
                          <div className="flex items-center text-sm justify-between">
                            <p className="font-semibold">Status:</p>
                            <p>{payment?.payment_status}</p>
                          </div>
                          <div className="flex items-center text-sm justify-between">
                            <p className="font-semibold">Order Time:</p>
                            <p>{order.created}</p>
                          </div>
                          <div className="flex items-center text-sm justify-between">
                            <p className="font-semibold">Payment Time:</p>
                            <p>{order.received}</p>
                          </div>
                          <div className="flex items-center text-sm justify-between">
                            <p className="font-semibold">Delivery Charges:</p>
                            <p>KSh {payment?.delivery_charges}</p>
                          </div>
                          <div className="flex items-center text-sm justify-between">
                            <p className="font-semibold">Promotional Discount:</p>
                            <p>KSh {payment?.promotional_discount}</p>
                          </div>
                          <div className="flex items-center text-sm justify-between">
                            <p className="font-semibold">Total Paid:</p>
                            <p>KSh {payment?.total_order_amount}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </Card>
          )
        })}

        {loading && <p className="text-center text-gray-500">Loading more orders...</p>}
        {!hasMore && <p className="text-center text-gray-400">No more orders to load.</p>}
        {isModalOpen && <Modal onClose={() => setModalOpen(false)} />}
      </div>
    )
  }

  const steps = [
    { id: 1, title: "Received" },
    { id: 2, title: "Acknowledged – Awaiting Processing" },
    { id: 3, title: "Processing Completed" },
    { id: 4, title: "Delivered" },
  ]

  const Modal = ({ onClose }: { onClose: () => void }) => (
    <div className="fixed inset-0 z-999 bg-gray-200 bg-opacity-50 flex justify-center items-center">
      <div className="bg-white border p-6 rounded-lg w-96">
        <h3 className="text-xl font-semibold">Confirm Cancellation</h3>
        {cancelError ? (
          <p className="text-red-500 mt-4">{cancelError}</p>
        ) : (
          <p className="mt-4">Are you sure you want to cancel this order?</p>
        )}
        <div className="mt-4 flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>Close</Button>
          {!cancelError && (
            <Button variant="destructive" onClick={confirmCancellation}>
              Confirm Cancellation
            </Button>
          )}
        </div>
      </div>
    </div>
  )

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Order Management</h1>
          <p className="text-muted-foreground">View and manage all customer orders in one place.</p>
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
          <Button className="bg-green-600 hover:bg-green-700">
            <Truck className="mr-2 h-4 w-4" />
            Update Status
          </Button>
        </div>
      </div>

      {loading ? (
        <p className="text-sm text-muted-foreground">Loading orders...</p>
      ) : error ? (
        <p className="text-sm text-red-500">{error}</p>
      ) : (
        <Tabs defaultValue="all" className="space-y-4">
          <TabsList className="grid w-full grid-cols-4 md:w-fit">
            <TabsTrigger value="all">All Orders</TabsTrigger>
            <TabsTrigger value="received">Received</TabsTrigger>
            <TabsTrigger value="processing">Processing Complete</TabsTrigger>
            <TabsTrigger value="delivered">Delivered</TabsTrigger>
          </TabsList>

          <TabsContent value="all">
            <Card>
              <CardHeader className="pb-2">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <CardTitle>All Orders</CardTitle>
                    <CardDescription>Showing {orders.length} orders from the last 30 days</CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Select defaultValue="all" onValueChange={setPaymentMethod}>
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Payment Method" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Methods</SelectItem>
                        <SelectItem value="mpesa">M-Pesa</SelectItem>
                        <SelectItem value="card">Card</SelectItem>
                        <SelectItem value="cod">Cash on Delivery</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select defaultValue="all" onValueChange={setLocation}>
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Location" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Locations</SelectItem>
                        <SelectItem value="nairobi">Nairobi</SelectItem>
                        <SelectItem value="mombasa">Mombasa</SelectItem>
                        <SelectItem value="kisumu">Kisumu</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardHeader>
              <CardContent>{renderOrders(groupedOrders.all)}</CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="received">
            <Card>
              <CardHeader className="pb-2">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <CardTitle>Received Orders</CardTitle>
                    <CardDescription>Showing {groupedOrders.received.length} received orders</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>{renderOrders(groupedOrders.received)}</CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="processing">
            <Card>
              <CardHeader className="pb-2">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <CardTitle>Processing Complete</CardTitle>
                    <CardDescription>Showing {groupedOrders.processing.length} completed orders</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>{renderOrders(groupedOrders.processing)}</CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="delivered">
            <Card>
              <CardHeader className="pb-2">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <CardTitle>Delivered Orders</CardTitle>
                    <CardDescription>Showing {groupedOrders.delivered.length} delivered orders</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>{renderOrders(groupedOrders.delivered)}</CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        
        
      )}
    </div>
  )
}


