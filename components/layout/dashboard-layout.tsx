"use client"

import type React from "react"

import { useState, useEffect } from "react"
import {
  BarChart3,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  CreditCard,
  LayoutDashboard,
  Menu,
  Package,
  Search,
  ShoppingCart,
  Users,
  X,
  FileText,
  BookOpen,
  MessageSquare,
  Brain,
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Sheet, SheetContent } from "@/components/ui/sheet"
import { ThemeToggle } from "@/components/theme-toggle"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false)
  const [collapsed, setCollapsed] = useState(false)
  const pathname = usePathname()
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({})

  const navigation = [
    {
      name: "Dashboard",
      href: "/",
      icon: LayoutDashboard,
    },
    {
      name: "Orders",
      href: "/orders",
      icon: ShoppingCart,
      children: [
        { name: "All Orders", href: "/orders" },
        { name: "In Transt Orders", href: "/orders/intransit-orders" },
        { name: "Cancelled", href: "/orders/cancelled" },
      ],
    },
    {
      name: "Products",
      href: "/products",
      icon: Package,
      children: [
        { name: "Product Catalog", href: "/products" },
        { name: "Categories", href: "/products/categories" },
        { name: "Brands", href: "/products/brands" },
        { name: "Inventory", href: "/products/inventory" },
        { name: "Expected Stock", href: "/products/expected" },
        { name: "Price Lists", href: "/products/prices" },
        { name: "Product Reviews", href: "/products/reviews" },
      ],
    },
    {
      name: "Payments",
      href: "/payments",
      icon: CreditCard,
      children: [
        { name: "Payment Status", href: "/payments" },
        { name: "Delivery Charges", href: "/payments/delivery" },
        { name: "Discounts", href: "/payments/discounts" },
      ],
    },
   
    {
      name: "Prescriptions",
      href: "/prescriptions",
      icon: FileText,
    },
    {
      name: "Blog",
      href: "/blog",
      icon: BookOpen,
      children: [
        { name: "All Posts", href: "/blog" },
        { name: "Add New Post", href: "/blog/new" },
        { name: "Topics", href: "/blog/topics" },
      ],
    },
    {
      name: "Analytics",
      href: "/analytics",
      icon: BarChart3,
      children: [
        { name: "Overview", href: "/analytics" },
        { name: "Top Sellers", href: "/analytics/top-sellers" },
        { name: "Search Trends", href: "/analytics/search-trends" },
        { name: "Most Viewed", href: "/analytics/most-viewed" },
      ],
    },
    {
      name: "AI Insights",
      href: "/ai",
      icon: Brain,
    },
    {
      name: "Users",
      href: "/users",
      icon: Users,
      children: [
        { name: "User Accounts", href: "/users" },
        { name: "Addresses", href: "/users/addresses" },
        { name: "Feedback Log", href: "/users/feedback" },
      ],
    },
   
  ]

  // Initialize expanded items based on current path
  useEffect(() => {
    const newExpandedItems: Record<string, boolean> = {}
    navigation.forEach((item) => {
      if (item.children && (pathname === item.href || pathname.startsWith(`${item.href}/`))) {
        newExpandedItems[item.name] = true
      }
    })
    setExpandedItems(newExpandedItems)
  }, [pathname])

  const isActive = (href: string) => {
    return pathname === href || pathname.startsWith(`${href}/`)
  }

  const toggleExpand = (name: string) => {
    setExpandedItems((prev) => ({
      ...prev,
      [name]: !prev[name],
    }))
  }

  return (
    <div className="flex min-h-screen w-full flex-col">
      {/* Mobile sidebar */}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="left" className="bg-background p-0 border-r border-border">
          <div className="flex flex-col">
            <div className="flex h-14 items-center border-b border-border px-4">
              <Link href="/dashboard" className="flex items-center gap-2 font-semibold">
                <Image
                  src="/logo/logo-min.svg"
                  width={32}
                  height={32}
                  alt="PharmaPlus Logo"
                  className="rounded-full bg-green-600 p-1"
                />
                <span>PharmaPlus</span>
              </Link>
              <Button variant="ghost" size="icon" className="ml-auto" onClick={() => setOpen(false)}>
                <X className="h-5 w-5" />
              </Button>
            </div>
            <nav className="grid gap-1 md:gap-2 px-2 py-4  overflow-y-auto max-h-[calc(100vh-3.5rem)]">
              {navigation.map((item) => (
                <div key={item.name}>
                  {item.children ? (
                    <>
                      <button
                        onClick={() => toggleExpand(item.name)}
                        className={`flex w-full items-center justify-between gap-3 rounded-lg px-3 py-2 transition-all hover:bg-muted ${
                          isActive(item.href) ? "bg-primary text-primary-foreground hover:bg-primary/90" : ""
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <item.icon
                            className={`h-5 w-5 ${isActive(item.href) ? "text-primary-foreground" : "text-red-500"}`}
                          />
                          {item.name}
                        </div>
                        {expandedItems[item.name] ? (
                          <ChevronUp className="h-4 w-4" />
                        ) : (
                          <ChevronDown className="h-4 w-4" />
                        )}
                      </button>
                      {expandedItems[item.name] && (
                        <div className="ml-6 mt-1 space-y-1">
                          {item.children.map((child) => (
                            <Link
                              key={child.name}
                              href={child.href}
                              className={`flex items-center gap-3 rounded-lg px-3 py-1.5 text-sm transition-all hover:bg-muted ${
                                isActive(child.href) ? "bg-primary text-primary-foreground hover:bg-primary/90" : ""
                              }`}
                              onClick={() => setOpen(false)}
                            >
                              {child.name}
                            </Link>
                          ))}
                        </div>
                      )}
                    </>
                  ) : (
                    <Link
                      href={item.href}
                      className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:bg-muted ${
                        isActive(item.href) ? "bg-primary text-primary-foreground hover:bg-primary/90" : ""
                      }`}
                      onClick={() => setOpen(false)}
                    >
                      <item.icon
                        className={`h-5 w-5 ${isActive(item.href) ? "text-primary-foreground" : "text-red-500"}`}
                      />
                      {item.name}
                    </Link>
                  )}
                </div>
              ))}
            </nav>
          </div>
        </SheetContent>
      </Sheet>

      {/* Desktop sidebar */}
      <TooltipProvider delayDuration={300}>
        <div
          className={`hidden border-r border-border bg-background transition-all duration-300 lg:fixed lg:inset-y-0 lg:flex lg:flex-col ${
            collapsed ? "lg:w-16" : "lg:w-56"
          }`}
        >
          <div className="flex h-full flex-col">
            <div className="flex h-14 items-center border-b border-border px-4">
              <Link href="/dashboard" className="flex items-center gap-2 font-semibold">
              {!collapsed ?(
                <Image
                  src="/logo/logo-light.svg"
                  width={182}
                  height={62}
                  alt="PharmaPlus Logo"
                  className=" "
                />
                ):(
                  <Image
                  src="/logo/logo-mini.svg"
                  width={182}
                  height={62}
                  alt="PharmaPlus Logo"
                  className=" "
                />
                )}
                
              </Link>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="absolute -right-3 top-20 z-10 flex h-6 w-6 items-center justify-center rounded-full border bg-background text-green-600 shadow-sm"
              onClick={() => setCollapsed(!collapsed)}
            >
              {collapsed ? <ChevronRight className="h-3 w-3" /> : <ChevronLeft className="h-3 w-3" />}
            </Button>
            <nav className="flex-1 space-y-2 overflow-y-auto py-4 px-2">
              {navigation.map((item) => (
                <div key={item.name}>
                  {item.children && !collapsed ? (
                    <>
                      <button
                        onClick={() => toggleExpand(item.name)}
                        className={`flex w-full items-center justify-between gap-3 rounded-lg px-3 py-2 transition-all hover:bg-muted ${
                          isActive(item.href) ? "bg-primary text-primary-foreground hover:bg-primary/90" : ""
                        }`}
                      >
                        <div className={`flex text-md t ${isActive(item.href)?("font-medium"):(" font-light")}  items-center gap-3`}>
                          <item.icon
                            className={`h-6 w-6 ${isActive(item.href) ? "text-primary-foreground" : "text-red-500"}`}
                          />
                          {item.name}
                        </div>
                        {expandedItems[item.name] ? (
                          <ChevronUp className="h-4 w-4" />
                        ) : (
                          <ChevronDown className="h-4 w-4" />
                        )}
                      </button>
                      {expandedItems[item.name] && (
                        <div className="ml-6 mt-1 space-y-1">
                          {item.children.map((child) => (
                            <Link
                              key={child.name}
                              href={child.href}
                              className={`flex items-center gap-3 rounded-lg px-3 py-1.5 text-sm transition-all hover:bg-muted ${
                                isActive(child.href) ? "bg-primary text-primary-foreground hover:bg-primary/90" : ""
                              }`}
                            >
                              {child.name}
                            </Link>
                          ))}
                        </div>
                      )}
                    </>
                  ) : (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Link
                          href={item.href}
                          className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:bg-muted ${
                            isActive(item.href) ? "bg-primary text-primary-foreground hover:bg-primary/90" : ""
                          }`}
                        >
                          <item.icon
                            className={`h-6 w-6 ${isActive(item.href) ? "text-primary-foreground" : "text-red-500"}`}
                          />
                          {!collapsed && item.name}
                        </Link>
                      </TooltipTrigger>
                      {collapsed && <TooltipContent side="right">{item.name}</TooltipContent>}
                    </Tooltip>
                  )}
                </div>
              ))}
            </nav>
          </div>
        </div>
      </TooltipProvider>

      {/* Main content */}
      <div className={`flex flex-1 flex-col ${collapsed ? "lg:pl-16" : "lg:pl-56"} transition-all duration-300`}>
        {/* Top navigation */}
        <header className="sticky top-0 z-10 flex h-14 items-center gap-4 border-b border-border bg-background px-4 sm:px-6">
          <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setOpen(true)}>
            <Menu className="h-6 w-6" />
            <span className="sr-only">Toggle navigation menu</span>
          </Button>
          <div className="w-full flex-1">
            <form>
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search products, orders, customers..."
                  className="w-full bg-background pl-8 md:w-2/3 lg:w-1/3"
                />
              </div>
            </form>
          </div>
          <ThemeToggle />
          <Button variant="outline" size="sm" className="ml-2 gap-1">
            Admin <ChevronDown className="h-4 w-4" />
          </Button>
        </header>

        {/* Page content */}
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  )
}
