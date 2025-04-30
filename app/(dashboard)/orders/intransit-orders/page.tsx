'use client'

import React, { useEffect, useState } from "react"
import { Eye, Package, EyeClosed, User2, Download, Filter } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useOrderManager } from "@/context/OrderContext"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import OrderTracker from "@/components/orders/order-tracker"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import * as XLSX from 'xlsx';
// Add these imports at the top with your other imports
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu"
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { jsPDF as JsPDFType } from "jspdf"; // for typing

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
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
 
  type OrderStatus = 'all' | 'intransit' | 'inwarehouse' | 'outfordelivery' | 'delivered' | 'cancelled';

// Update your state definition to use the new type
const [activeTab, setActiveTab] = useState<OrderStatus>('all');

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
      case "In Transit":
        return "bg-yellow-100 text-yellow-700"
      case "In Warehouse":
        return "bg-blue-100 text-blue-700"
      case "On the Way for Delivery":
        return "bg-purple-100 text-purple-700"
      case "Delivered":
        return "bg-green-100 text-green-700"
      case "Cancelled by Customer":
        return "bg-red-100 text-red-700"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  const handleCancelOrder = (orderId: number) => {
    const result = cancelInTransitOrder(orderId)
    alert(result)
  }

  const renderOrderDetails = (order: any) => {
    const parsedProductDetails: Record<string, ProductDetail> = JSON.parse(order.product_details);

    return (
      <div className="overflow-x-scroll">
        <div className={`p-4 rounded-t-lg mb-4 ${getStatusColor(order.order_status)}`}>
          <h3 className="text-lg font-semibold">{order.order_status}</h3>
          <p className="text-sm">Order #{order.id}</p>
        </div>

        <div className="grid grid-cols-6">
          <div>
            <OrderTracker order={order} steps={orderSteps}/>
          </div>

          <div className="p-2 col-span-5">
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

            <div className="p-4 border bg-white rounded-lg mb-4">
              <h4 className="font-medium text-sm text-gray-500">Items</h4>
              <hr />
              <ul className="list-inside mt-2 space-y-2">
                {Object.entries(parsedProductDetails).map(([key, product], index) => (
                  <li key={index} className="flex justify-between">
                    <p className="font-semibold text-gray-700">{product.name}</p>
                    <p className="font-semibold text-gray-700">
                      <span className="text-xs">Qty</span> : {product.quantity} - 
                      <span className="text-xs">Unit Price</span> Kes {product.price}
                    </p>
                    <p className="font-semibold text-gray-700">Kes {product.price * product.quantity}</p>
                  </li>
                ))}
              </ul>
            </div>

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

  const groupedOrders = {
    all: inTransitOrders,
    intransit: inTransitOrders.filter((o) => o.order_status === "Intransit"),
    inwarehouse: inTransitOrders.filter((o) => o.order_status === "InWarehouse"),
    outfordelivery: inTransitOrders.filter((o) => o.order_status === "On the Way for Delivery"),
    delivered: inTransitOrders.filter((o) => o.order_status === "Delivered"),
    cancelled: inTransitOrders.filter((o) => o.order_status === "Cancelled by Customer")
  }

  const renderOrdersList = (orders: any[]) => {
    if (loading && isInitialLoad) {
      return <p className="text-sm text-muted-foreground">Loading orders...</p>
    }

    if (error) {
      return <p className="text-sm text-red-600">Error: {error}</p>
    }

    if (orders.length === 0) {
      return <p className="text-sm text-muted-foreground">No orders found.</p>
    }

    return (
      <div className="space-y-4">
        {orders.map((order) => {
          const orderId = order.id.toString()
          const isOpen = expandedOrders[orderId] || false

          return (
            <div key={order.id} className="rounded-lg border">
              <div className="md:flex grid items-center justify-between rounded-lg border p-4">
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
                    disabled={order.order_status === "Delivered" || order.order_status === "Cancelled by Customer"}
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

  const exportToExcel = (orders: any[], status: string) => {
    // Prepare the data for export
    const exportData = orders.map(order => {
      const productDetails = JSON.parse(order.product_details);
      return {
        'Order ID': order.id,
        'Status': order.order_status,
        'Order Date': new Date(order.created_on).toLocaleDateString(),
        'Customer ID': order.user_id,
        'Payment Mode': order.payment_mode,
        'Total Amount': `KSh ${order.amount_paid}`,
        'Days Since Order': order.days_since_order,
        'Number of Items': Object.keys(productDetails).length
      };
    });

    // Create workbook and worksheet
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(exportData);

    // Add worksheet to workbook
    XLSX.utils.book_append_sheet(wb, ws, `${status} Orders`);

    // Save the file
    XLSX.writeFile(wb, `intransit_orders_${status.toLowerCase()}_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  const exportToPDF = (orders: any[], status: string) => {
    // Create new document
    const doc = new jsPDF();
    
    // Add title
    doc.setFontSize(16);
    doc.text(`${status} Orders Report`, 14, 15);
    doc.setFontSize(10);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 25);

    // Prepare the data for the table
    const tableData = orders.map(order => {
      const productDetails = JSON.parse(order.product_details);
      return [
        order.id,
        order.order_status,
        new Date(order.created_on).toLocaleDateString(),
        order.user_id,
        order.payment_mode,
        `KSh ${order.amount_paid}`,
        order.days_since_order,
        Object.keys(productDetails).length
      ];
    });

    // Add the table using autoTable
    autoTable(doc, {
      head: [['Order ID', 'Status', 'Order Date', 'Customer ID', 'Payment Mode', 'Total Amount', 'Days Since Order', 'Items']],
      body: tableData,
      startY: 35,
      styles: { fontSize: 8 },
      headStyles: { fillColor: [41, 128, 185] },
    });

    // Save the PDF
    doc.save(`intransit_orders_${status.toLowerCase()}_${new Date().toISOString().split('T')[0]}.pdf`);
  };

  const ExportButton = ({ orders, status }: { orders: any[], status: string }) => {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>Choose format</DropdownMenuLabel>
          <DropdownMenuItem onClick={() => exportToExcel(orders, status)}>
            Export to Excel
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => exportToPDF(orders, status)}>
            Export to PDF
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Intransit Orders</h1>
          <p className="text-muted-foreground">View and manage intransit orders.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline">
            <Filter className="mr-2 h-4 w-4" />
            Filter
          </Button>
          <ExportButton 
            orders={groupedOrders[activeTab] || groupedOrders.all} 
            status={activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} 
          />
        </div>
      </div>

      <Tabs defaultValue="all" className="space-y-4">
        <TabsList className="grid w-full grid-cols-6 md:w-fit">
          <TabsTrigger value="all">All Orders</TabsTrigger>
          <TabsTrigger value="intransit">In Transit</TabsTrigger>
          <TabsTrigger value="inwarehouse">In Warehouse</TabsTrigger>
          <TabsTrigger value="outfordelivery">Out for Delivery</TabsTrigger>
          <TabsTrigger value="delivered">Delivered</TabsTrigger>
          <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
        </TabsList>

        {Object.entries(groupedOrders).map(([status, orders]) => (
          <TabsContent key={status} value={status}>
            <Card className="space-y-4 p-6 border rounded-md">
              <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <CardTitle>
                    {status === 'all' ? 'All Orders' : 
                     status === 'intransit' ? 'In Transit Orders' :
                     status === 'inwarehouse' ? 'In Warehouse Orders' :
                     status === 'outfordelivery' ? 'Out for Delivery Orders' :
                     status === 'delivered' ? 'Delivered Orders' : 'Cancelled Orders'}
                  </CardTitle>
                  <CardDescription>
                    Showing {orders.length} orders
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  <Select 
                    value={statusFilter} 
                    onValueChange={setStatusFilter}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                      <SelectItem value="returned">Returned</SelectItem>
                    </SelectContent>
                  </Select>
                  <Input 
                    placeholder="Search orders..." 
                    className="w-[200px]"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </CardHeader>
              <CardContent>
                {renderOrdersList(orders)}
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}
