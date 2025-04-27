import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CalendarIcon, Edit, Eye, Filter, Plus, Search, Trash2 } from "lucide-react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { LazyTable } from "@/components/lazy-table"

// Sample blog data
const blogs = [
  {
    id: "1",
    title: "Understanding Medication Adherence",
    status: "published",
    author: "Dr. Sarah Johnson",
    topic: "Medication",
    date: "2023-04-15",
    views: 1245,
  },
  {
    id: "2",
    title: "The Benefits of Regular Health Check-ups",
    status: "published",
    author: "Dr. Michael Chen",
    topic: "Wellness",
    date: "2023-04-10",
    views: 987,
  },
  {
    id: "3",
    title: "Managing Chronic Pain: New Approaches",
    status: "draft",
    author: "Dr. Emily Rodriguez",
    topic: "Pain Management",
    date: "2023-04-05",
    views: 0,
  },
  {
    id: "4",
    title: "Nutrition Tips for Seniors",
    status: "published",
    author: "Nutritionist Alex Wong",
    topic: "Nutrition",
    date: "2023-03-28",
    views: 756,
  },
  {
    id: "5",
    title: "Understanding Vaccine Safety",
    status: "review",
    author: "Dr. James Wilson",
    topic: "Vaccines",
    date: "2023-03-22",
    views: 0,
  },
  {
    id: "6",
    title: "Sleep Disorders and Treatment Options",
    status: "published",
    author: "Dr. Lisa Thompson",
    topic: "Sleep Health",
    date: "2023-03-15",
    views: 1102,
  },
  {
    id: "7",
    title: "Managing Diabetes Through Diet",
    status: "draft",
    author: "Dietitian Maria Garcia",
    topic: "Diabetes",
    date: "2023-03-10",
    views: 0,
  },
  {
    id: "8",
    title: "Heart Health: Prevention Strategies",
    status: "published",
    author: "Dr. Robert Kim",
    topic: "Cardiology",
    date: "2023-03-05",
    views: 892,
  },
]

// Column definition for the blog table
const columns = [
  {
    header: "Title",
    accessorKey: "title",
    cell: ({ row }: any) => <div className="font-medium">{row.original.title}</div>,
  },
  {
    header: "Status",
    accessorKey: "status",
    cell: ({ row }: any) => {
      const status = row.original.status
      let badgeVariant = "outline"
      const badgeText = status

      if (status === "published") {
        badgeVariant = "success"
      } else if (status === "draft") {
        badgeVariant = "secondary"
      } else if (status === "review") {
        badgeVariant = "warning"
      }

      return <Badge variant={badgeVariant as any}>{badgeText}</Badge>
    },
  },
  {
    header: "Author",
    accessorKey: "author",
  },
  {
    header: "Topic",
    accessorKey: "topic",
  },
  {
    header: "Date",
    accessorKey: "date",
    cell: ({ row }: any) => (
      <div className="flex items-center gap-2">
        <CalendarIcon className="h-4 w-4 text-muted-foreground" />
        {row.original.date}
      </div>
    ),
  },
  {
    header: "Views",
    accessorKey: "views",
    cell: ({ row }: any) => <div>{row.original.views > 0 ? row.original.views.toLocaleString() : "-"}</div>,
  },
  {
    header: "Actions",
    cell: ({ row }: any) => (
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon">
          <Eye className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon">
          <Edit className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon">
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    ),
  },
]

export default function BlogPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Blog Management</h1>
        <Button asChild>
          <Link href="/dashboard/blog/new">
            <Plus className="mr-2 h-4 w-4" /> New Blog Post
          </Link>
        </Button>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList>
          <TabsTrigger value="all">All Posts</TabsTrigger>
          <TabsTrigger value="published">Published</TabsTrigger>
          <TabsTrigger value="drafts">Drafts</TabsTrigger>
          <TabsTrigger value="review">Under Review</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Blog Posts</CardTitle>
              <CardDescription>Manage all your blog posts, drafts, and scheduled content.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2 w-full max-w-sm">
                  <Search className="h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Search blogs..." className="h-9" />
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
                      <SelectItem value="popular">Most Popular</SelectItem>
                      <SelectItem value="title">Title A-Z</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <LazyTable columns={columns} data={blogs} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="published" className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Published Posts</CardTitle>
              <CardDescription>View and manage your published blog content.</CardDescription>
            </CardHeader>
            <CardContent>
              <LazyTable columns={columns} data={blogs.filter((blog) => blog.status === "published")} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="drafts" className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Draft Posts</CardTitle>
              <CardDescription>Continue working on your draft blog posts.</CardDescription>
            </CardHeader>
            <CardContent>
              <LazyTable columns={columns} data={blogs.filter((blog) => blog.status === "draft")} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="review" className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Posts Under Review</CardTitle>
              <CardDescription>Blog posts awaiting editorial review before publishing.</CardDescription>
            </CardHeader>
            <CardContent>
              <LazyTable columns={columns} data={blogs.filter((blog) => blog.status === "review")} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
