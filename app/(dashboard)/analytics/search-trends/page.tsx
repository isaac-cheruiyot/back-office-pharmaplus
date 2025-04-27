import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowUpRight, Download } from "lucide-react"
import { Badge } from "@/components/ui/badge"

// Sample search trends data
const topSearches = [
  {
    id: "1",
    term: "vitamin c",
    count: 1245,
    growth: 12.5,
    conversion: 3.8,
  },
  {
    id: "2",
    term: "immune support",
    count: 982,
    growth: 28.3,
    conversion: 4.2,
  },
  {
    id: "3",
    term: "omega 3",
    count: 876,
    growth: 5.7,
    conversion: 3.5,
  },
  {
    id: "4",
    term: "probiotics",
    count: 754,
    growth: 15.2,
    conversion: 4.7,
  },
  {
    id: "5",
    term: "vitamin d3",
    count: 698,
    growth: 9.8,
    conversion: 3.9,
  },
  {
    id: "6",
    term: "multivitamin",
    count: 645,
    growth: 3.2,
    conversion: 3.1,
  },
  {
    id: "7",
    term: "sleep aid",
    count: 612,
    growth: 17.5,
    conversion: 5.2,
  },
  {
    id: "8",
    term: "joint pain",
    count: 589,
    growth: 7.5,
    conversion: 4.1,
  },
]

// Sample zero results searches
const zeroResultSearches = [
  {
    id: "1",
    term: "collagen peptides",
    count: 245,
    growth: 32.5,
  },
  {
    id: "2",
    term: "ashwagandha",
    count: 182,
    growth: 48.3,
  },
  {
    id: "3",
    term: "elderberry gummies",
    count: 176,
    growth: 25.7,
  },
  {
    id: "4",
    term: "mushroom complex",
    count: 154,
    growth: 55.2,
  },
  {
    id: "5",
    term: "prenatal dha",
    count: 98,
    growth: 19.8,
  },
]

// Sample rising trends
const risingTrends = [
  {
    id: "1",
    term: "immune support",
    growth: 28.3,
    volume: "High",
  },
  {
    id: "2",
    term: "sleep aid",
    growth: 17.5,
    volume: "Medium",
  },
  {
    id: "3",
    term: "mushroom complex",
    growth: 55.2,
    volume: "Low",
  },
  {
    id: "4",
    term: "ashwagandha",
    growth: 48.3,
    volume: "Low",
  },
  {
    id: "5",
    term: "elderberry gummies",
    growth: 25.7,
    volume: "Medium",
  },
]

export default function SearchTrendsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Search Trends</h1>
        <Button variant="outline">
          <Download className="mr-2 h-4 w-4" />
          Export Report
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Searches</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">12,456</div>
              <Badge variant="default" className="flex items-center">
                <ArrowUpRight className="mr-1 h-3 w-3" />
                8.2%
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Top Searches</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {topSearches.map((search) => (
                <li key={search.id} className="flex justify-between items-center">
                  <span>{search.term}</span>
                  <span className="text-sm text-gray-500">({search.count} searches)</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Zero Result Searches</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {zeroResultSearches.map((search) => (
                <li key={search.id} className="flex justify-between items-center">
                  <span>{search.term}</span>
                  <span className="text-sm text-gray-500">({search.count} searches)</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Rising Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {risingTrends.map((trend) => (
                <li key={trend.id} className="flex justify-between items-center">
                  <span>{trend.term}</span>
                  <div className="text-sm text-gray-500">
                    <Badge variant="outline" className="mr-2">{trend.volume}</Badge>
                    {trend.growth}% growth
                  </div>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
