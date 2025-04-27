import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Eye, Filter, Search, Star } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { LazyTable } from "@/components/lazy-table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

// Sample review data
const reviews = [
  {
    id: "1",
    productName: "Vitamin C Complex",
    productId: "P1001",
    customer: "John Smith",
    customerEmail: "john.smith@example.com",
    rating: 5,
    review:
      "This vitamin C supplement has really helped boost my immune system. I've been taking it for a month and feel much better overall.",
    status: "approved",
    date: "2023-04-15",
  },
  {
    id: "2",
    productName: "Omega-3 Fish Oil",
    productId: "P1002",
    customer: "Sarah Johnson",
    customerEmail: "sarah.j@example.com",
    rating: 4,
    review: "Good quality fish oil with no aftertaste. I've noticed improvement in my joint pain after regular use.",
    status: "approved",
    date: "2023-04-12",
  },
  {
    id: "3",
    productName: "Melatonin Sleep Aid",
    productId: "P1003",
    customer: "Michael Brown",
    customerEmail: "m.brown@example.com",
    rating: 2,
    review: "Didn't work well for me. I still had trouble falling asleep and felt groggy in the morning.",
    status: "pending",
    date: "2023-04-10",
  },
  {
    id: "4",
    productName: "Probiotic Daily",
    productId: "P1004",
    customer: "Emily Davis",
    customerEmail: "emily.d@example.com",
    rating: 5,
    review: "Excellent product! Has really helped with my digestive issues. Will definitely purchase again.",
    status: "approved",
    date: "2023-04-08",
  },
  {
    id: "5",
    productName: "Multivitamin Complete",
    productId: "P1005",
    customer: "Robert Wilson",
    customerEmail: "r.wilson@example.com",
    rating: 3,
    review: "Average multivitamin. Nothing special but does the job. The pills are a bit large and hard to swallow.",
    status: "pending",
    date: "2023-04-05",
  },
  {
    id: "6",
    productName: "Vitamin D3 Drops",
    productId: "P1006",
    customer: "Jennifer Lee",
    customerEmail: "j.lee@example.com",
    rating: 5,
    review: "Love these drops! Easy to add to drinks and tasteless. My vitamin D levels have improved significantly.",
    status: "approved",
    date: "2023-04-03",
  },
  {
    id: "7",
    productName: "Calcium Magnesium Zinc",
    productId: "P1007",
    customer: "David Miller",
    customerEmail: "d.miller@example.com",
    rating: 1,
    review: "Terrible product. Caused stomach upset and the tablets smell awful. Would not recommend.",
    status: "rejected",
    date: "2023-04-01",
  },
  {
    id: "8",
    productName: "Iron Supplement",
    productId: "P1008",
    customer: "Lisa Garcia",
    customerEmail: "l.garcia@example.com",
    rating: 4,
    review: "Good iron supplement that doesn't cause constipation like others I've tried. Has helped with my anemia.",
    status: "approved",
    date: "2023-03-28",
  },
]

// Function to render star rating
const StarRating = ({ rating }: { rating: number }) => {
  return (
    <div className="flex items-center">
      {[...Array(5)].map((_, i) => (
        <Star key={i} className={`h-4 w-4 ${i < rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`} />
      ))}
    </div>
  )
}

// Column definition for the reviews table
const columns = [
  {
    header: "Product",
    accessorKey: "productName",
    cell: ({ row }: any) => (
      <div>
        <div className="font-medium">{row.original.productName}</div>
        <div className="text-xs text-muted-foreground">ID: {row.original.productId}</div>
      </div>
    ),
  },
  {
    header: "Customer",
    accessorKey: "customer",
    cell: ({ row }: any) => (
      <div className="flex items-center gap-2">
        <Avatar className="h-8 w-8">
          <AvatarImage src={`/placeholder.svg?height=32&width=32`} alt={row.original.customer} />
          <AvatarFallback>{row.original.customer.charAt(0)}</AvatarFallback>
        </Avatar>
        <div>
          <div className="font-medium">{row.original.customer}</div>
          <div className="text-xs text-muted-foreground">{row.original.customerEmail}</div>
        </div>
      </div>
    ),
  },
  {
    header: "Rating",
    accessorKey: "rating",
    cell: ({ row }: any) => <StarRating rating={row.original.rating} />,
  },
  {
    header: "Date",
    accessorKey: "date",
  },
  {
    header: "Status",
    accessorKey: "status",
    cell: ({ row }: any) => {
      const status = row.original.status
      let badgeVariant = "outline"

      if (status === "approved") {
        badgeVariant = "success"
      } else if (status === "pending") {
        badgeVariant = "secondary"
      } else if (status === "rejected") {
        badgeVariant = "destructive"
      }

      return <Badge variant={badgeVariant as any}>{status}</Badge>
    },
  },
  {
    header: "Actions",
    cell: ({ row }: any) => (
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="ghost" size="icon">
            <Eye className="h-4 w-4" />
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Review Details</DialogTitle>
            <DialogDescription>Review for {row.original.productName}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={`/placeholder.svg?height=40&width=40`} alt={row.original.customer} />
                  <AvatarFallback>{row.original.customer.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-medium">{row.original.customer}</div>
                  <div className="text-sm text-muted-foreground">{row.original.customerEmail}</div>
                </div>
              </div>
              <div className="text-sm text-muted-foreground">{row.original.date}</div>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-2">
                <StarRating rating={row.original.rating} />
                <span className="text-sm font-medium">{row.original.rating}/5</span>
              </div>
              <p className="text-sm">{row.original.review}</p>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <Badge
                variant={
                  row.original.status === "approved"
                    ? "success"
                    : row.original.status === "pending"
                      ? "secondary"
                      : "destructive"
                }
              >
                {row.original.status}
              </Badge>
            </div>

            {row.original.status === "pending" && (
              <div className="flex items-center justify-end gap-2 pt-2">
                <Button variant="destructive" size="sm">
                  Reject
                </Button>
                <Button variant="default" size="sm">
                  Approve
                </Button>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    ),
  },
]

export default function ProductReviewsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Product Reviews</h1>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList>
          <TabsTrigger value="all">All Reviews</TabsTrigger>
          <TabsTrigger value="approved">Approved</TabsTrigger>
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="rejected">Rejected</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>All Product Reviews</CardTitle>
              <CardDescription>Manage customer reviews for all products.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2 w-full max-w-sm">
                  <Search className="h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Search reviews..." className="h-9" />
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm">
                    <Filter className="mr-2 h-4 w-4" />
                    Filter
                  </Button>
                  <Select defaultValue="newest">
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="newest">Newest First</SelectItem>
                      <SelectItem value="oldest">Oldest First</SelectItem>
                      <SelectItem value="highest">Highest Rated</SelectItem>
                      <SelectItem value="lowest">Lowest Rated</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <LazyTable columns={columns} data={reviews} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="approved" className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Approved Reviews</CardTitle>
              <CardDescription>Reviews that have been approved and are visible to customers.</CardDescription>
            </CardHeader>
            <CardContent>
              <LazyTable columns={columns} data={reviews.filter((review) => review.status === "approved")} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pending" className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Pending Reviews</CardTitle>
              <CardDescription>Reviews awaiting moderation before being published.</CardDescription>
            </CardHeader>
            <CardContent>
              <LazyTable columns={columns} data={reviews.filter((review) => review.status === "pending")} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="rejected" className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Rejected Reviews</CardTitle>
              <CardDescription>Reviews that have been rejected and are not visible to customers.</CardDescription>
            </CardHeader>
            <CardContent>
              <LazyTable columns={columns} data={reviews.filter((review) => review.status === "rejected")} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
