import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CheckCircle, Eye, Filter, Search, XCircle } from "lucide-react"
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
import { Textarea } from "@/components/ui/textarea"

// Sample feedback data
const feedback = [
  {
    id: "1",
    customer: "John Smith",
    customerEmail: "john.smith@example.com",
    type: "suggestion",
    subject: "Website Navigation Improvement",
    message:
      "I find it difficult to navigate between product categories. It would be helpful if there was a dropdown menu that showed all categories at once.",
    status: "new",
    date: "2023-04-15",
  },
  {
    id: "2",
    customer: "Sarah Johnson",
    customerEmail: "sarah.j@example.com",
    type: "complaint",
    subject: "Shipping Delay",
    message:
      "My order #12345 was supposed to arrive yesterday but I still haven't received it. This is urgent as I need the medication.",
    status: "in-progress",
    date: "2023-04-12",
  },
  {
    id: "3",
    customer: "Michael Brown",
    customerEmail: "m.brown@example.com",
    type: "question",
    subject: "Product Compatibility",
    message:
      "Can I take your Vitamin C supplement with your Zinc tablets? Are there any interactions I should be aware of?",
    status: "new",
    date: "2023-04-10",
  },
  {
    id: "4",
    customer: "Emily Davis",
    customerEmail: "emily.d@example.com",
    type: "praise",
    subject: "Excellent Customer Service",
    message:
      "I just wanted to thank your customer service team, especially Alex, who helped me resolve an issue with my recent order. The service was exceptional!",
    status: "resolved",
    date: "2023-04-08",
  },
  {
    id: "5",
    customer: "Robert Wilson",
    customerEmail: "r.wilson@example.com",
    type: "complaint",
    subject: "Wrong Product Received",
    message:
      "I ordered the 100mg tablets but received the 50mg ones instead. Order #67890. Please advise on how to return and get the correct product.",
    status: "in-progress",
    date: "2023-04-05",
  },
  {
    id: "6",
    customer: "Jennifer Lee",
    customerEmail: "j.lee@example.com",
    type: "suggestion",
    subject: "Loyalty Program",
    message:
      "Have you considered implementing a loyalty program? I order regularly and would appreciate some kind of rewards system for frequent customers.",
    status: "new",
    date: "2023-04-03",
  },
  {
    id: "7",
    customer: "David Miller",
    customerEmail: "d.miller@example.com",
    type: "complaint",
    subject: "Website Error",
    message:
      "I keep getting an error when trying to check out. It happens after I enter my payment information. This has been happening for two days now.",
    status: "resolved",
    date: "2023-04-01",
  },
  {
    id: "8",
    customer: "Lisa Garcia",
    customerEmail: "l.garcia@example.com",
    type: "question",
    subject: "Prescription Refill",
    message:
      "How do I set up automatic refills for my monthly prescription? I couldn't find this option in my account settings.",
    status: "in-progress",
    date: "2023-03-28",
  },
]

// Column definition for the feedback table
const columns = [
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
    header: "Type",
    accessorKey: "type",
    cell: ({ row }: any) => {
      const type = row.original.type
      let badgeVariant = "outline"

      if (type === "complaint") {
        badgeVariant = "destructive"
      } else if (type === "suggestion") {
        badgeVariant = "default"
      } else if (type === "question") {
        badgeVariant = "destructive"
      } else if (type === "praise") {
        badgeVariant = "outline"
      }

      return <Badge variant={badgeVariant as any}>{type}</Badge>
    },
  },
  {
    header: "Subject",
    accessorKey: "subject",
    cell: ({ row }: any) => <div className="font-medium">{row.original.subject}</div>,
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

      if (status === "new") {
        badgeVariant = "default"
      } else if (status === "in-progress") {
        badgeVariant = "destructive"
      } else if (status === "resolved") {
        badgeVariant = "outline"
      }

      return <Badge variant={badgeVariant as any}>{status}</Badge>
    },
  },
  {
    header: "Actions",
    cell: ({ row }: any) => (
      <div className="flex items-center gap-2">
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="ghost" size="icon">
              <Eye className="h-4 w-4" />
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Feedback Details</DialogTitle>
              <DialogDescription>{row.original.subject}</DialogDescription>
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

              <div className="flex items-center gap-2">
                <Badge
                  variant={
                    row.original.type === "complaint"
                      ? "destructive"
                      : row.original.type === "suggestion"
                        ? "default"
                        : row.original.type === "question"
                          ? "destructive"
                          : "outline"
                  }
                >
                  {row.original.type}
                </Badge>

                <Badge
                  variant={
                    row.original.status === "new"
                      ? "default"
                      : row.original.status === "in-progress"
                        ? "destructive"
                        : "outline"
                  }
                >
                  {row.original.status}
                </Badge>
              </div>

              <div>
                <h4 className="text-sm font-medium mb-1">Message:</h4>
                <p className="text-sm border rounded-md p-3 bg-muted/50">{row.original.message}</p>
              </div>

              {row.original.status !== "resolved" && (
                <div className="space-y-2 pt-2">
                  <h4 className="text-sm font-medium">Response:</h4>
                  <Textarea placeholder="Type your response here..." className="min-h-[100px]" />

                  <div className="flex items-center justify-end gap-2 pt-2">
                    <Button variant="outline" size="sm">
                      <XCircle className="mr-2 h-4 w-4" />
                      Mark as Spam
                    </Button>
                    <Button variant="default" size="sm">
                      <CheckCircle className="mr-2 h-4 w-4" />
                      Resolve & Send
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>

        {row.original.status !== "resolved" && (
          <Button variant="ghost" size="icon">
            <CheckCircle className="h-4 w-4" />
          </Button>
        )}
      </div>
    ),
  },
]

export default function CustomerFeedbackPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Customer Feedback</h1>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList>
          <TabsTrigger value="all">All Feedback</TabsTrigger>
          <TabsTrigger value="new">New</TabsTrigger>
          <TabsTrigger value="in-progress">In Progress</TabsTrigger>
          <TabsTrigger value="resolved">Resolved</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>All Customer Feedback</CardTitle>
              <CardDescription>View and manage customer feedback, suggestions, and complaints.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2 w-full max-w-sm">
                  <Search className="h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Search feedback..." className="h-9" />
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
                      <SelectItem value="type">By Type</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <LazyTable columns={columns} data={feedback} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="new" className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>New Feedback</CardTitle>
              <CardDescription>Recently received feedback that needs attention.</CardDescription>
            </CardHeader>
            <CardContent>
              <LazyTable columns={columns} data={feedback.filter((item) => item.status === "new")} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="in-progress" className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>In Progress</CardTitle>
              <CardDescription>Feedback currently being addressed by the team.</CardDescription>
            </CardHeader>
            <CardContent>
              <LazyTable columns={columns} data={feedback.filter((item) => item.status === "in-progress")} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="resolved" className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Resolved Feedback</CardTitle>
              <CardDescription>Feedback that has been addressed and resolved.</CardDescription>
            </CardHeader>
            <CardContent>
              <LazyTable columns={columns} data={feedback.filter((item) => item.status === "resolved")} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
