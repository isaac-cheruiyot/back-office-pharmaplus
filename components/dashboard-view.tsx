"use client"

import { useState } from "react"
import {
  BarChart3,
  Calendar,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  LayoutDashboard,
  Menu,
  Package,
  Search,
  ShoppingCart,
  Users,
  X,
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Sheet, SheetContent } from "@/components/ui/sheet"
import { RecentOrdersTable } from "@/components/recent-orders-table"
import { SalesChart } from "@/components/sales-chart"
import { TopSellingProducts } from "@/components/top-selling-products"
import { StatsCards } from "@/components/stats-cards"

export function DashboardView() {
  

  return (
    <div className="flex min-h-screen w-full flex-col">
    

      {/* Main content */}
      <div className={`flex flex-1 flex-col `}>

        {/* Dashboard content */}
        <main className="flex-1 space-y-6 p-6">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
              <p className="text-muted-foreground">Welcome to PharmaPlus dashboard, your pharmacy management hub.</p>
            </div>
            <div className="flex items-center gap-2">
              <Button className="bg-red-500 hover:bg-red-600">
                <Package className="mr-2 h-4 w-4" />
                Add Product
              </Button>
            </div>
          </div>

          <StatsCards />

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
            <Card className="lg:col-span-4">
              <CardHeader>
                <CardTitle>Sales Overview</CardTitle>
                <CardDescription>View your sales performance over the last 30 days</CardDescription>
              </CardHeader>
              <CardContent>
                <SalesChart />
              </CardContent>
            </Card>
            <Card className="lg:col-span-3">
              <CardHeader>
                <CardTitle>Top Selling Products</CardTitle>
                <CardDescription>Your best performing products this month</CardDescription>
              </CardHeader>
              <CardContent>
                <TopSellingProducts />
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Recent Orders</CardTitle>
              <CardDescription>Manage your recent customer orders</CardDescription>
            </CardHeader>
            <CardContent>
              <RecentOrdersTable />
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  )
}
