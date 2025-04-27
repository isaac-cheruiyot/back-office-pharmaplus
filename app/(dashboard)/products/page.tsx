"use client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Filter, Download, Plus, Edit, Trash2, Eye } from "lucide-react"
import Image from "next/image"
import { LazyTable } from "@/components/lazy-table"

export default function ProductsPage() {
  // Generate a larger dataset for demonstration
  const generateProducts = (count: number) => {
    const categories = ["Pain Relief", "Antibiotics", "Vitamins", "First Aid", "Devices", "Skincare", "Baby Care"]
    const brands = ["Generic", "HealthPlus", "SafeCare", "VitaLife", "MediCorp", "PharmaBest"]
    const statuses = ["in-stock", "low-stock", "out-of-stock"]

    return Array.from({ length: count }, (_, i) => {
      const id = `PRD-${String(i + 1).padStart(3, "0")}`
      const randomCategory = categories[Math.floor(Math.random() * categories.length)]
      const randomBrand = brands[Math.floor(Math.random() * brands.length)]

      // Determine stock and status
      let stock = 0
      let status = ""
      const stockRandom = Math.random()

      if (stockRandom > 0.9) {
        status = "out-of-stock"
        stock = 0
      } else if (stockRandom > 0.7) {
        status = "low-stock"
        stock = Math.floor(Math.random() * 20) + 1
      } else {
        status = "in-stock"
        stock = Math.floor(Math.random() * 300) + 50
      }

      const price = `KSh ${(Math.floor(Math.random() * 5000) + 100).toLocaleString()}`

      return {
        id,
        name: `Product ${i + 1}`,
        category: randomCategory,
        brand: randomBrand,
        stock,
        price,
        status,
      }
    })
  }

  const products = generateProducts(100)

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "in-stock":
        return <Badge className="bg-green-600">In Stock</Badge>
      case "low-stock":
        return <Badge className="bg-amber-500">Low Stock</Badge>
      case "out-of-stock":
        return <Badge className="bg-red-500">Out of Stock</Badge>
      default:
        return null
    }
  }

  const columns = [
    {
      header: "Image",
      accessorKey: () => (
        <Image src="/placeholder.svg?height=40&width=40" width={40} height={40} alt="Product" className="rounded-md" />
      ),
      className: "w-[80px]",
    },
    { header: "ID", accessorKey: "id", className: "w-[100px]" },
    { header: "Name", accessorKey: "name" },
    { header: "Category", accessorKey: "category" },
    { header: "Brand", accessorKey: "brand" },
    { header: "Stock", accessorKey: "stock" },
    {
      header: "Status",
      accessorKey: (product: any) => getStatusBadge(product.status),
    },
    { header: "Price", accessorKey: "price", className: "text-right" },
    {
      header: "Actions",
      accessorKey: () => (
        <div className="flex items-center justify-end gap-2">
          <Button variant="ghost" size="icon">
            <Eye className="h-4 w-4" />
            <span className="sr-only">View</span>
          </Button>
          <Button variant="ghost" size="icon">
            <Edit className="h-4 w-4" />
            <span className="sr-only">Edit</span>
          </Button>
          <Button variant="ghost" size="icon">
            <Trash2 className="h-4 w-4" />
            <span className="sr-only">Delete</span>
          </Button>
        </div>
      ),
      className: "w-[100px]",
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Product Catalog</h1>
          <p className="text-muted-foreground">Manage your product inventory and catalog.</p>
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
            <Plus className="mr-2 h-4 w-4" />
            Add Product
          </Button>
        </div>
      </div>

      <Tabs defaultValue="all">
        <TabsList className="grid w-full grid-cols-4 md:w-fit">
          <TabsTrigger value="all">All Products</TabsTrigger>
          <TabsTrigger value="in-stock">In Stock</TabsTrigger>
          <TabsTrigger value="low-stock">Low Stock</TabsTrigger>
          <TabsTrigger value="out-of-stock">Out of Stock</TabsTrigger>
        </TabsList>
        <TabsContent value="all" className="mt-4">
          <Card>
            <CardHeader className="pb-2">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <CardTitle>All Products</CardTitle>
                  <CardDescription>Showing {products.length} products in your catalog</CardDescription>
                </div>
                <div className="flex gap-2">
                  <Input placeholder="Search products..." className="w-[250px]" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <LazyTable data={products} columns={columns} />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="in-stock" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>In Stock Products</CardTitle>
              <CardDescription>Products currently available in your inventory</CardDescription>
            </CardHeader>
            <CardContent>
              <LazyTable data={products.filter((product) => product.status === "in-stock")} columns={columns} />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="low-stock" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Low Stock Products</CardTitle>
              <CardDescription>Products that need to be restocked soon</CardDescription>
            </CardHeader>
            <CardContent>
              <LazyTable data={products.filter((product) => product.status === "low-stock")} columns={columns} />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="out-of-stock" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Out of Stock Products</CardTitle>
              <CardDescription>Products that need to be restocked immediately</CardDescription>
            </CardHeader>
            <CardContent>
              <LazyTable data={products.filter((product) => product.status === "out-of-stock")} columns={columns} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
