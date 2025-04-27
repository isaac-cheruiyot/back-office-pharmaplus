"use client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { MoreHorizontal, UserPlus, Download, Filter } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Image from "next/image"
import { LazyTable } from "@/components/lazy-table"

export default function UsersPage() {
  // Generate a larger dataset for demonstration
  const generateUsers = (count: number) => {
    const roles = ["Customer", "Admin", "Staff"]
    const statuses = ["active", "inactive", "blocked"]

    return Array.from({ length: count }, (_, i) => {
      const id = `USR-${String(i + 1).padStart(3, "0")}`

      // Determine role with appropriate distribution
      let role
      const roleRandom = Math.random()
      if (roleRandom > 0.95) {
        role = "Admin"
      } else if (roleRandom > 0.85) {
        role = "Staff"
      } else {
        role = "Customer"
      }

      // Determine status with appropriate distribution
      let status
      const statusRandom = Math.random()
      if (statusRandom > 0.9) {
        status = "blocked"
      } else if (statusRandom > 0.8) {
        status = "inactive"
      } else {
        status = "active"
      }

      const orders = role === "Customer" ? Math.floor(Math.random() * 10) : 0

      // Generate a join date within the last year
      const date = new Date()
      date.setDate(date.getDate() - Math.floor(Math.random() * 365))
      const formattedDate = date.toISOString().split("T")[0]

      return {
        id,
        name: `User ${i + 1}`,
        email: `user${i + 1}@example.com`,
        role,
        status,
        orders,
        joined: formattedDate,
      }
    })
  }

  const users = generateUsers(100)

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-600">Active</Badge>
      case "inactive":
        return (
          <Badge variant="outline" className="border-gray-500 bg-gray-50 text-gray-700">
            Inactive
          </Badge>
        )
      case "blocked":
        return (
          <Badge variant="outline" className="border-red-500 bg-red-50 text-red-700">
            Blocked
          </Badge>
        )
      default:
        return null
    }
  }

  const getRoleBadge = (role: string) => {
    return (
      <Badge
        variant="outline"
        className={
          role === "Admin"
            ? "border-purple-500 bg-purple-50 text-purple-700"
            : role === "Staff"
              ? "border-blue-500 bg-blue-50 text-blue-700"
              : "border-gray-500 bg-gray-50 text-gray-700"
        }
      >
        {role}
      </Badge>
    )
  }

  const columns = [
    {
      header: "Avatar",
      accessorKey: () => (
        <Image src="/placeholder.svg?height=40&width=40" width={40} height={40} alt="User" className="rounded-full" />
      ),
      className: "w-[80px]",
    },
    { header: "ID", accessorKey: "id", className: "w-[100px]" },
    { header: "Name", accessorKey: "name" },
    { header: "Email", accessorKey: "email" },
    {
      header: "Role",
      accessorKey: (user: any) => getRoleBadge(user.role),
    },
    {
      header: "Status",
      accessorKey: (user: any) => getStatusBadge(user.status),
    },
    { header: "Orders", accessorKey: "orders" },
    { header: "Joined", accessorKey: "joined" },
    {
      header: "",
      accessorKey: (user: any) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreHorizontal className="h-4 w-4" />
              <span className="sr-only">Open menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem>View profile</DropdownMenuItem>
            <DropdownMenuItem>Edit user</DropdownMenuItem>
            <DropdownMenuItem>View orders</DropdownMenuItem>
            <DropdownMenuSeparator />
            {user.status === "active" ? (
              <DropdownMenuItem className="text-amber-600">Deactivate account</DropdownMenuItem>
            ) : user.status === "inactive" ? (
              <DropdownMenuItem className="text-green-600">Activate account</DropdownMenuItem>
            ) : (
              <DropdownMenuItem className="text-green-600">Unblock account</DropdownMenuItem>
            )}
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
          <h1 className="text-3xl font-bold tracking-tight">User & Access Management</h1>
          <p className="text-muted-foreground">Manage user accounts, roles, and permissions.</p>
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
            <UserPlus className="mr-2 h-4 w-4" />
            Add User
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <CardTitle>User Accounts</CardTitle>
              <CardDescription>Showing {users.length} user accounts</CardDescription>
            </div>
            <div className="flex gap-2">
              <Select defaultValue="all">
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="staff">Staff</SelectItem>
                  <SelectItem value="customer">Customer</SelectItem>
                </SelectContent>
              </Select>
              <Select defaultValue="all">
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="blocked">Blocked</SelectItem>
                </SelectContent>
              </Select>
              <Input placeholder="Search users..." className="w-[200px]" />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <LazyTable data={users} columns={columns} />
        </CardContent>
      </Card>
    </div>
  )
}
