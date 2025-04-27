"use client"

import { MoreHorizontal, ChevronDown, Check } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"

const orders = [
  {
    id: "ORD-001",
    customer: "John Kamau",
    status: "delivered",
    date: "2023-04-23",
    total: "KSh 2,450",
    items: 3,
  },
  {
    id: "ORD-002",
    customer: "Mary Wanjiku",
    status: "processing",
    date: "2023-04-22",
    total: "KSh 1,890",
    items: 2,
  },
  {
    id: "ORD-003",
    customer: "David Ochieng",
    status: "delivered",
    date: "2023-04-21",
    total: "KSh 3,200",
    items: 4,
  },
  {
    id: "ORD-004",
    customer: "Sarah Auma",
    status: "pending",
    date: "2023-04-20",
    total: "KSh 750",
    items: 1,
  },
  {
    id: "ORD-005",
    customer: "Michael Njoroge",
    status: "delivered",
    date: "2023-04-19",
    total: "KSh 4,100",
    items: 5,
  },
]

export function RecentOrdersTable() {
  return (
    <div className="w-full overflow-auto">
      <div className="flex items-center justify-between py-4">
        <Select defaultValue="all">
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Orders</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="processing">Processing</SelectItem>
            <SelectItem value="delivered">Delivered</SelectItem>
          </SelectContent>
        </Select>
        <Button variant="outline" size="sm" className="ml-auto">
          <ChevronDown className="mr-2 h-4 w-4" />
          Export
        </Button>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Order ID</TableHead>
            <TableHead>Customer</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Items</TableHead>
            <TableHead className="text-right">Amount</TableHead>
            <TableHead className="w-[50px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map((order) => (
            <TableRow key={order.id}>
              <TableCell className="font-medium">{order.id}</TableCell>
              <TableCell>{order.customer}</TableCell>
              <TableCell>
                <Badge
                  variant="outline"
                  className={
                    order.status === "delivered"
                      ? "border-green-600 bg-green-50 text-green-700"
                      : order.status === "processing"
                        ? "border-blue-500 bg-blue-50 text-blue-700"
                        : "border-yellow-500 bg-yellow-50 text-yellow-700"
                  }
                >
                  {order.status === "delivered" && <Check className="mr-1 h-3 w-3" />}
                  {order.status}
                </Badge>
              </TableCell>
              <TableCell>{order.date}</TableCell>
              <TableCell>{order.items}</TableCell>
              <TableCell className="text-right">{order.total}</TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                      <span className="sr-only">Open menu</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuItem>View order details</DropdownMenuItem>
                    <DropdownMenuItem>Update status</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-red-600">Cancel order</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
