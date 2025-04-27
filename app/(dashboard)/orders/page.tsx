"use client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Filter, Download, MoreHorizontal, Check, Clock, Truck, AlertCircle } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { LazyTable } from "@/components/lazy-table"

export default function OrdersPage() {
  // Generate a larger dataset for demonstration
  const generateOrders = (count: number) => {
    const statuses = ["delivered", "processing", "pending"]
    const locations = ["Nairobi CBD", "Westlands", "Mombasa", "Kisumu", "Nakuru", "Eldoret", "Thika"]
    const payments = ["M-Pesa", "Card", "Cash on Delivery"]

    return Array.from({ length: count }, (_, i) => {
      const id = `ORD-${String(i + 1).padStart(3, "0")}`
      const randomStatus = statuses[Math.floor(Math.random() * statuses.length)]
      const randomLocation = locations[Math.floor(Math.random() * locations.length)]
      const randomPayment = payments[Math.floor(Math.random() * payments.length)]
      const items = Math.floor(Math.random() * 10) + 1
      const total = `KSh ${(Math.floor(Math.random() * 5000) + 500).toLocaleString()}`

      // Generate a date within the last 30 days
      const date = new Date()
      date.setDate(date.getDate() - Math.floor(Math.random() * 30))
      const formattedDate = date.toISOString().split("T")[0]

      return {
        id,
        customer: `Customer ${i + 1}`,
        status: randomStatus,
        date: formattedDate,
        total,
        items,
        location: randomLocation,
        payment: randomPayment,
      }
    })
  }

  const orders = generateOrders(100)

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "delivered":
        return <Check className="mr-1 h-3 w-3" />
      case "processing":
        return <Clock className="mr-1 h-3 w-3" />
      case "pending":
        return <AlertCircle className="mr-1 h-3 w-3" />
      default:
        return null
    }
  }

  const getStatusClass = (status: string) => {
    switch (status) {
      case "delivered":
        return "border-green-600 bg-green-50 text-green-700"
      case "processing":
        return "border-blue-500 bg-blue-50 text-blue-700"
      case "pending":
        return "border-yellow-500 bg-yellow-50 text-yellow-700"
      default:
        return ""
    }
  }

  const columns = [
    { header: "Order ID", accessorKey: "id", className: "w-[100px]" },
    { header: "Customer", accessorKey: "customer" },
    {
      header: "Status",
      accessorKey: (order: any) => (
        <Badge variant="outline" className={getStatusClass(order.status)}>
          {getStatusIcon(order.status)}
          {order.status}
        </Badge>
      ),
    },
    { header: "Date", accessorKey: "date" },
    { header: "Location", accessorKey: "location" },
    { header: "Payment", accessorKey: "payment" },
    { header: "Items", accessorKey: "items" },
    { header: "Amount", accessorKey: "total", className: "text-right" },
    {
      header: "",
      accessorKey: () => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreHorizontal className="h-4 w-4" />
              <span className="sr-only">Open menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem>View details</DropdownMenuItem>
            <DropdownMenuItem>Update status</DropdownMenuItem>
            <DropdownMenuItem>Print invoice</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-red-600">Cancel order</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
      className: "w-[50px]",
    },
  ]
  

  return (
    <div className="space-y-6">
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

      <Tabs defaultValue="all">
        <TabsList className="grid w-full grid-cols-4 md:w-fit">
          <TabsTrigger value="all">All Orders</TabsTrigger>
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="processing">Processing</TabsTrigger>
          <TabsTrigger value="delivered">Delivered</TabsTrigger>
        </TabsList>
        <TabsContent value="all" className="mt-4">
          <Card>
            <CardHeader className="pb-2">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <CardTitle>All Orders</CardTitle>
                  <CardDescription>Showing {orders.length} orders from the last 30 days</CardDescription>
                </div>
                <div className="flex gap-2">
                  <Select defaultValue="all">
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
                  <Select defaultValue="all">
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
            <CardContent>
              <LazyTable data={orders} columns={columns} />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="pending" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Pending Orders</CardTitle>
              <CardDescription>Orders awaiting processing or confirmation</CardDescription>
            </CardHeader>
            <CardContent>
              <LazyTable data={orders.filter((order) => order.status === "pending")} columns={columns} />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="processing" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Processing Orders</CardTitle>
              <CardDescription>Orders currently being processed or prepared for delivery</CardDescription>
            </CardHeader>
            <CardContent>
              <LazyTable data={orders.filter((order) => order.status === "processing")} columns={columns} />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="delivered" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Delivered Orders</CardTitle>
              <CardDescription>Orders that have been successfully delivered to customers</CardDescription>
            </CardHeader>
            <CardContent>
              <LazyTable data={orders.filter((order) => order.status === "delivered")} columns={columns} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
