"use client"

import { useEffect, useState } from "react"
import type { BlogFormValues } from "./blog-post-form"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

// Mock data for topics, products, brands, and conditions
import { mockAuthor } from "@/lib/mock-data"

// Function to process content and convert image links to actual images
function processContent(content: string): string {
  if (!content) return ""

  // First, handle standard image tags that might already be in the content
  let processedContent = content

  // Then, replace links that end with image extensions with image tags
  // This regex looks for <a> tags with hrefs ending in image extensions
  processedContent = processedContent.replace(
    /<a\s+(?:[^>]*?\s+)?href="([^"]*\.(jpg|jpeg|png|gif|webp))"[^>]*>(.*?)<\/a>/gi,
    '<img src="$1" alt="$3" class="rounded-md my-4 max-w-full" />',
  )

  // Also handle plain URLs that might be in the text (not in <a> tags)
  processedContent = processedContent.replace(
    /(?<!["'])(https?:\/\/[^\s]+\.(jpg|jpeg|png|gif|webp))(?!["'])/gi,
    '<img src="$1" alt="Image" class="rounded-md my-4 max-w-full" />',
  )

  return processedContent
}

export function BlogPreview({ blogData }: { blogData: BlogFormValues }) {
  const [processedContent, setProcessedContent] = useState("")

  useEffect(() => {
    if (blogData.content) {
      setProcessedContent(processContent(blogData.content))
    }
  }, [blogData.content])

  if (!blogData.title && !blogData.content) {
    return (
      <div className="flex items-center justify-center h-[400px] border rounded-md bg-muted/20">
        <p className="text-muted-foreground">Fill in the blog details to see a preview</p>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="space-y-6">
        {/* Blog Header */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">{blogData.title || "Untitled Blog Post"}</h1>

          <div className="flex items-center space-x-4">
            <Avatar>
              <AvatarImage src={`/placeholder.svg?height=40&width=40`} alt={mockAuthor.name} />
              <AvatarFallback>
                {mockAuthor.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="font-medium">{mockAuthor.name}</div>
              <div className="text-sm text-muted-foreground">{mockAuthor.profession}</div>
            </div>
          </div>
        </div>

        {/* Blog Content */}
        <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: processedContent }} />

        {/* Blog Metadata */}
        <div className="pt-6 border-t space-y-4">
         
          {/* Related Brands */}
          {blogData.brands && blogData.brands.length > 0 && (
            <div>
              <h3 className="text-lg font-medium mb-2">Related Brands</h3>
              <div className="flex flex-wrap gap-2">
                {blogData.brands.map((brand) => (
                  <Badge key={brand} variant="secondary">
                    {brand}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Health Conditions */}
          {blogData.conditions && blogData.conditions.length > 0 && (
            <div>
              <h3 className="text-lg font-medium mb-2">Health Conditions</h3>
              <div className="flex flex-wrap gap-2">
                {blogData.conditions.map((condition) => (
                  <Badge key={condition} variant="outline">
                    {condition.replace("_", " ")}
                  </Badge>
                ))}
              </div>
            </div>
          )}


           {/* Related Products */}
           {blogData.product_codes && blogData.product_codes.length > 0 && (
            <div>
              <h3 className="text-lg font-medium mb-2">Related Products</h3>
              <div className="flex flex-wrap gap-2">
                {blogData.product_codes.map((code) => (
                  <Badge key={code} variant="secondary">
                    Product {code}
                  </Badge>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  )
}
