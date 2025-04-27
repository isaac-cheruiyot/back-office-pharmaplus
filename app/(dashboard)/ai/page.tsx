import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Bot, BrainCircuit, ChevronRight, LineChart, MessageSquare, Settings, Sparkles, Zap } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Switch } from "@/components/ui/switch"

export default function AIPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">AI Assistant</h1>
        <Button variant="outline" size="icon">
          <Settings className="h-4 w-4" />
        </Button>
      </div>

      <Tabs defaultValue="assistant" className="w-full">
        <TabsList>
          <TabsTrigger value="assistant">AI Assistant</TabsTrigger>
          <TabsTrigger value="insights">Insights</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="assistant" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-4">
              <Card className="h-[600px] flex flex-col">
                <CardHeader className="pb-3">
                  <CardTitle>PharmaPlus AI Assistant</CardTitle>
                  <CardDescription>Ask questions about inventory, sales, or get recommendations.</CardDescription>
                </CardHeader>
                <CardContent className="flex-1 overflow-auto border rounded-md mb-4 p-4 space-y-4">
                  {/* AI Chat Messages */}
                  <div className="flex gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src="/placeholder.svg?height=32&width=32" />
                      <AvatarFallback>AI</AvatarFallback>
                    </Avatar>
                    <div className="bg-muted rounded-lg p-3 flex-1">
                      <p className="text-sm">Hello! I'm your PharmaPlus AI assistant. How can I help you today?</p>
                    </div>
                  </div>

                  <div className="flex gap-3 justify-end">
                    <div className="bg-primary text-primary-foreground rounded-lg p-3 max-w-[80%]">
                      <p className="text-sm">What are our top selling products this month?</p>
                    </div>
                    <Avatar className="h-8 w-8">
                      <AvatarImage src="/placeholder.svg?height=32&width=32" />
                      <AvatarFallback>U</AvatarFallback>
                    </Avatar>
                  </div>

                  <div className="flex gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src="/placeholder.svg?height=32&width=32" />
                      <AvatarFallback>AI</AvatarFallback>
                    </Avatar>
                    <div className="bg-muted rounded-lg p-3 flex-1">
                      <p className="text-sm">Based on the current month's data, your top selling products are:</p>
                      <ol className="list-decimal list-inside mt-2 space-y-1 text-sm">
                        <li>Vitamin C Complex (1,245 units)</li>
                        <li>Omega-3 Fish Oil (982 units)</li>
                        <li>Multivitamin Complete (876 units)</li>
                        <li>Probiotic Daily (754 units)</li>
                        <li>Vitamin D3 Drops (698 units)</li>
                      </ol>
                      <p className="text-sm mt-2">Would you like to see a detailed sales report for these products?</p>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="pt-0">
                  <div className="flex items-center w-full gap-2">
                    <Input placeholder="Ask a question..." className="flex-1" />
                    <Button>
                      <MessageSquare className="mr-2 h-4 w-4" />
                      Send
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            </div>

            <div className="space-y-4">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle>Suggested Queries</CardTitle>
                  <CardDescription>Try asking these questions to get started.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button variant="outline" className="w-full justify-between">
                    <span>Show inventory alerts</span>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" className="w-full justify-between">
                    <span>Analyze sales trends</span>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" className="w-full justify-between">
                    <span>Predict stock needs</span>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" className="w-full justify-between">
                    <span>Summarize customer feedback</span>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle>AI Features</CardTitle>
                  <CardDescription>Explore what our AI can do for you.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="bg-primary/10 p-2 rounded-full">
                      <BrainCircuit className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="text-sm font-medium">Predictive Analytics</h4>
                      <p className="text-xs text-muted-foreground">Forecast sales and inventory needs</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="bg-primary/10 p-2 rounded-full">
                      <LineChart className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="text-sm font-medium">Trend Analysis</h4>
                      <p className="text-xs text-muted-foreground">Identify patterns in your data</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="bg-primary/10 p-2 rounded-full">
                      <Sparkles className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="text-sm font-medium">Smart Recommendations</h4>
                      <p className="text-xs text-muted-foreground">Get product and pricing suggestions</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="bg-primary/10 p-2 rounded-full">
                      <Bot className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="text-sm font-medium">Natural Language Queries</h4>
                      <p className="text-xs text-muted-foreground">Ask questions in plain English</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="insights" className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>AI-Generated Insights</CardTitle>
              <CardDescription>Automatically generated insights based on your store data.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base">Inventory Alert</CardTitle>
                      <Badge>High Priority</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm">
                      5 products are predicted to run out of stock within the next 7 days based on current sales
                      velocity.
                    </p>
                  </CardContent>
                  <CardFooter className="pt-0">
                    <Button variant="outline" size="sm" className="w-full">
                      View Details
                    </Button>
                  </CardFooter>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base">Sales Opportunity</CardTitle>
                      <Badge variant="secondary">Recommendation</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm">
                      Customers who buy Vitamin C often also purchase Zinc supplements. Consider creating a bundle.
                    </p>
                  </CardContent>
                  <CardFooter className="pt-0">
                    <Button variant="outline" size="sm" className="w-full">
                      Create Bundle
                    </Button>
                  </CardFooter>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base">Trend Alert</CardTitle>
                      <Badge variant="secondary">New</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm">Searches for "immune support" have increased by 43% in the last 30 days.</p>
                  </CardContent>
                  <CardFooter className="pt-0">
                    <Button variant="outline" size="sm" className="w-full">
                      Explore Trend
                    </Button>
                  </CardFooter>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base">Customer Insight</CardTitle>
                      <Badge variant="outline">Analysis</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm">Customers aged 25-34 are showing increased interest in prenatal vitamins.</p>
                  </CardContent>
                  <CardFooter className="pt-0">
                    <Button variant="outline" size="sm" className="w-full">
                      View Demographics
                    </Button>
                  </CardFooter>
                </Card>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Generate Custom Insight</CardTitle>
              <CardDescription>Ask our AI to analyze specific aspects of your business.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="insight-type">Insight Type</Label>
                <Select defaultValue="sales">
                  <SelectTrigger>
                    <SelectValue placeholder="Select insight type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sales">Sales Analysis</SelectItem>
                    <SelectItem value="inventory">Inventory Optimization</SelectItem>
                    <SelectItem value="customer">Customer Behavior</SelectItem>
                    <SelectItem value="pricing">Pricing Strategy</SelectItem>
                    <SelectItem value="marketing">Marketing Effectiveness</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="insight-query">What would you like to know?</Label>
                <Textarea
                  id="insight-query"
                  placeholder="E.g., Which products have the highest profit margin but lowest sales volume?"
                  className="min-h-[100px]"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="time-period">Time Period</Label>
                <Select defaultValue="30days">
                  <SelectTrigger>
                    <SelectValue placeholder="Select time period" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="7days">Last 7 days</SelectItem>
                    <SelectItem value="30days">Last 30 days</SelectItem>
                    <SelectItem value="90days">Last 90 days</SelectItem>
                    <SelectItem value="6months">Last 6 months</SelectItem>
                    <SelectItem value="1year">Last year</SelectItem>
                    <SelectItem value="custom">Custom range</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button className="w-full">
                <Zap className="mr-2 h-4 w-4" />
                Generate Insight
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>AI Settings</CardTitle>
              <CardDescription>Configure how the AI assistant works for your business.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="ai-model">AI Model</Label>
                <Select defaultValue="gpt4">
                  <SelectTrigger>
                    <SelectValue placeholder="Select AI model" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="gpt4">GPT-4 (Recommended)</SelectItem>
                    <SelectItem value="gpt35">GPT-3.5 Turbo</SelectItem>
                    <SelectItem value="claude">Claude 2</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="data-sources">Data Sources</Label>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="inventory" defaultChecked />
                    <Label htmlFor="inventory">Inventory Data</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="sales" defaultChecked />
                    <Label htmlFor="sales">Sales Data</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="customers" defaultChecked />
                    <Label htmlFor="customers">Customer Data</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="marketing" defaultChecked />
                    <Label htmlFor="marketing">Marketing Data</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="website" />
                    <Label htmlFor="website">Website Analytics</Label>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="update-frequency">Data Update Frequency</Label>
                <Select defaultValue="daily">
                  <SelectTrigger>
                    <SelectValue placeholder="Select update frequency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="realtime">Real-time</SelectItem>
                    <SelectItem value="hourly">Hourly</SelectItem>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="auto-insights">Automatic Insights</Label>
                  <Switch id="auto-insights" defaultChecked />
                </div>
                <p className="text-sm text-muted-foreground">
                  Allow the AI to generate insights automatically based on your data.
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="notifications">AI Notifications</Label>
                  <Switch id="notifications" defaultChecked />
                </div>
                <p className="text-sm text-muted-foreground">
                  Receive notifications when the AI detects important trends or issues.
                </p>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="ml-auto">Save Settings</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}


