import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Filter, Download, MoreHorizontal, XCircle, RotateCcw } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function CancelledOrdersPage() {
  const cancelledOrders = [
    {
      id: "ORD-009",
      customer: "James Maina",
      status: "cancelled",
      reason: "Customer changed mind",
      date: "2023-04-15",
      total: "KSh 1,850",
      items: 2,
      location: "Nairobi CBD",
    },
    {
      id: "ORD-010",
      customer: "Lucy Njeri",
      status: "returned",
      reason: "Damaged product",
      date: "2023-04-14",
      total: "KSh 3,200",
      items: 1,
      location: "Westlands",
    },
    {
      id: "ORD-011",
      customer: "Robert Kimani",
      status: "cancelled",
      reason: "Out of stock",
      date: "2023-04-13",
      total: "KSh 950",
      items: 3,
      location: "Mombasa",
    },
    {
      id: "ORD-012",
      customer: "Jane Akinyi",
      status: "returned",
      reason: "Wrong product",
      date: "2023-04-12",
      total: "KSh 1,450",
      items: 2,
      location: "Kisumu",
    },
    {
      id: "ORD-013",
      customer: "Thomas Odhiambo",
      status: "cancelled",
      reason: "Payment issues",
      date: "2023-04-11",
      total: "KSh 2,750",
      items: 4,
      location: "Nakuru",
    },
  ]

  return (
    <div className="space-y-6">
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

      <Card>
        <CardHeader className="pb-2">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <CardTitle>Cancelled & Returned Orders</CardTitle>
              <CardDescription>Showing {cancelledOrders.length} cancelled or returned orders</CardDescription>
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
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">Order ID</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Reason</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Items</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {cancelledOrders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-medium">{order.id}</TableCell>
                    <TableCell>{order.customer}</TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={
                          order.status === "cancelled"
                            ? "border-red-500 bg-red-50 text-red-700"
                            : "border-amber-500 bg-amber-50 text-amber-700"
                        }
                      >
                        {order.status === "cancelled" ? (
                          <XCircle className="mr-1 h-3 w-3" />
                        ) : (
                          <RotateCcw className="mr-1 h-3 w-3" />
                        )}
                        {order.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{order.reason}</TableCell>
                    <TableCell>{order.date}</TableCell>
                    <TableCell>{order.location}</TableCell>
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
                          <DropdownMenuItem>View details</DropdownMenuItem>
                          <DropdownMenuItem>Contact customer</DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem>Restore order</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
