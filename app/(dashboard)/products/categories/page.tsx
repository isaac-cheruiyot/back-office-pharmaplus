import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Plus, MoreHorizontal } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Image from "next/image"

export default function CategoriesPage() {
  const categories = [
    {
      id: "CAT-001",
      name: "Pain Relief",
      products: 24,
      description: "Medications for pain management",
    },
    {
      id: "CAT-002",
      name: "Antibiotics",
      products: 18,
      description: "Medications to treat bacterial infections",
    },
    {
      id: "CAT-003",
      name: "Vitamins",
      products: 32,
      description: "Nutritional supplements",
    },
    {
      id: "CAT-004",
      name: "First Aid",
      products: 15,
      description: "Products for emergency treatment",
    },
    {
      id: "CAT-005",
      name: "Devices",
      products: 10,
      description: "Medical and health monitoring devices",
    },
    {
      id: "CAT-006",
      name: "Skincare",
      products: 28,
      description: "Products for skin health and treatment",
    },
    {
      id: "CAT-007",
      name: "Baby Care",
      products: 22,
      description: "Products for infant health and care",
    },
    {
      id: "CAT-008",
      name: "Digestive Health",
      products: 16,
      description: "Products for digestive system health",
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Category Manager</h1>
          <p className="text-muted-foreground">Manage product categories and their images.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button className="bg-green-600 hover:bg-green-700">
            <Plus className="mr-2 h-4 w-4" />
            Add Category
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <CardTitle>Product Categories</CardTitle>
              <CardDescription>Showing {categories.length} categories in your catalog</CardDescription>
            </div>
            <div className="flex gap-2">
              <Input placeholder="Search categories..." className="w-[250px]" />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[80px]">Image</TableHead>
                  <TableHead className="w-[100px]">ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Products</TableHead>
                  <TableHead className="w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {categories.map((category) => (
                  <TableRow key={category.id}>
                    <TableCell>
                      <Image
                        src="/placeholder.svg?height=40&width=40"
                        width={40}
                        height={40}
                        alt={category.name}
                        className="rounded-md"
                      />
                    </TableCell>
                    <TableCell className="font-medium">{category.id}</TableCell>
                    <TableCell>{category.name}</TableCell>
                    <TableCell>{category.description}</TableCell>
                    <TableCell>{category.products}</TableCell>
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
                          <DropdownMenuItem>View products</DropdownMenuItem>
                          <DropdownMenuItem>Edit category</DropdownMenuItem>
                          <DropdownMenuItem>Update image</DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-red-600">Delete category</DropdownMenuItem>
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
