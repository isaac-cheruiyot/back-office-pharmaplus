import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowUpRight, Download, TrendingUp } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"

// Sample top sellers data
const topProducts = [
  {
    id: "1",
    name: "Vitamin C Complex",
    category: "Vitamins",
    sales: 1245,
    revenue: 24900,
    growth: 12.5,
    image: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "2",
    name: "Omega-3 Fish Oil",
    category: "Supplements",
    sales: 982,
    revenue: 19640,
    growth: 8.3,
    image: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "3",
    name: "Multivitamin Complete",
    category: "Vitamins",
    sales: 876,
    revenue: 17520,
    growth: 5.7,
    image: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "4",
    name: "Probiotic Daily",
    category: "Digestive Health",
    sales: 754,
    revenue: 15080,
    growth: 15.2,
    image: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "5",
    name: "Vitamin D3 Drops",
    category: "Vitamins",
    sales: 698,
    revenue: 13960,
    growth: 9.8,
    image: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "6",
    name: "Calcium Magnesium Zinc",
    category: "Minerals",
    sales: 645,
    revenue: 12900,
    growth: 3.2,
    image: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "7",
    name: "Iron Supplement",
    category: "Minerals",
    sales: 612,
    revenue: 12240,
    growth: -2.1,
    image: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "8",
    name: "Melatonin Sleep Aid",
    category: "Sleep & Stress",
    sales: 589,
    revenue: 11780,
    growth: 7.5,
    image: "/placeholder.svg?height=40&width=40",
  },
]

// Sample top categories data
const topCategories = [
  {
    id: "1",
    name: "Vitamins",
    sales: 3245,
    revenue: 64900,
    growth: 9.5,
    percentage: 32,
  },
  {
    id: "2",
    name: "Supplements",
    sales: 2182,
    revenue: 43640,
    growth: 7.8,
    percentage: 22,
  },
  {
    id: "3",
    name: "Minerals",
    sales: 1876,
    revenue: 37520,
    growth: 4.2,
    percentage: 19,
  },
  {
    id: "4",
    name: "Digestive Health",
    sales: 1254,
    revenue: 25080,
    growth: 12.3,
    percentage: 13,
  },
  {
    id: "5",
    name: "Sleep & Stress",
    sales: 998,
    revenue: 19960,
    growth: 6.7,
    percentage: 10,
  },
  {
    id: "6",
    name: "Pain Relief",
    sales: 445,
    revenue: 8900,
    growth: -1.2,
    percentage: 4,
  },
]

export default function TopSellersPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Top Sellers Dashboard</h1>
        <Button variant="outline">
          <Download className="mr-2 h-4 w-4" />
          Export Report
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">$156,240</div>
              <Badge variant="success" className="flex items-center">
                <ArrowUpRight className="mr-1 h-3 w-3" />
                8.2%
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground mt-1">Compared to $144,385 last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Units Sold</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">7,842</div>
              <Badge variant="success" className="flex items-center">
                <ArrowUpRight className="mr-1 h-3 w-3" />
                5.3%
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground mt-1">Compared to 7,445 last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Average Order Value</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">$42.85</div>
              <Badge variant="success" className="flex items-center">
                <ArrowUpRight className="mr-1 h-3 w-3" />
                2.7%
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground mt-1">Compared to $41.72 last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">3.42%</div>
              <Badge variant="success" className="flex items-center">
                <ArrowUpRight className="mr-1 h-3 w-3" />
                0.5%
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground mt-1">Compared to 3.40% last month</p>
          </CardContent>
        </Card>
      </div>

      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Performance Analysis</h2>
        <div className="flex items-center gap-2">
          <Select defaultValue="30days">
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7days">Last 7 days</SelectItem>
              <SelectItem value="30days">Last 30 days</SelectItem>
              <SelectItem value="90days">Last 90 days</SelectItem>
              <SelectItem value="year">This year</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Tabs defaultValue="products" className="w-full">
        <TabsList>
          <TabsTrigger value="products">Top Products</TabsTrigger>
          <TabsTrigger value="categories">Top Categories</TabsTrigger>
        </TabsList>

        <TabsContent value="products" className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Best Selling Products</CardTitle>
              <CardDescription>Your top performing products by sales volume.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {topProducts.map((product) => (
                  <div key={product.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10 rounded-md">
                        <AvatarImage src={product.image || "/placeholder.svg"} alt={product.name} />
                        <AvatarFallback>{product.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{product.name}</div>
                        <div className="text-xs text-muted-foreground">{product.category}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="font-medium">{product.sales.toLocaleString()} units</div>
                        <div className="text-xs text-muted-foreground">${product.revenue.toLocaleString()}</div>
                      </div>
                      <div className="w-16 text-right">
                        <Badge
                          variant={product.growth >= 0 ? "success" : "destructive"}
                          className="flex items-center justify-center"
                        >
                          {product.growth >= 0 ? <TrendingUp className="mr-1 h-3 w-3" /> : null}
                          {product.growth}%
                        </Badge>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="categories" className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Top Product Categories</CardTitle>
              <CardDescription>Your best performing product categories by sales volume.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {topCategories.map((category) => (
                  <div key={category.id} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">{category.name}</div>
                        <div className="text-xs text-muted-foreground">
                          {category.sales.toLocaleString()} units · ${category.revenue.toLocaleString()}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="text-sm font-medium">{category.percentage}%</div>
                        <Badge variant={category.growth >= 0 ? "success" : "destructive"} className="flex items-center">
                          {category.growth >= 0 ? <TrendingUp className="mr-1 h-3 w-3" /> : null}
                          {category.growth}%
                        </Badge>
                      </div>
                    </div>
                    <Progress value={category.percentage} className="h-2" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle>Sales Trends</CardTitle>
            <CardDescription>Monthly sales trends for top products.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] flex items-center justify-center bg-muted/50 rounded-md">
              <p className="text-sm text-muted-foreground">Sales trend chart will appear here</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle>Regional Performance</CardTitle>
            <CardDescription>Sales distribution by geographic region.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] flex items-center justify-center bg-muted/50 rounded-md">
              <p className="text-sm text-muted-foreground">Regional sales map will appear here</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
