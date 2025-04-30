"use client";

import Image from "next/image";
import Link from "next/link";
import { Calendar, User } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BlogPost } from "@/types/blog";

interface BlogCardProps {
  blog: BlogPost;
  onDelete?: (id: number) => void;
  onEdit?: (blog: BlogPost) => void;
  onView?: () => void; // <-- Add this
}


export function BlogCard({ blog, onEdit,onView, onDelete }: BlogCardProps) {
  // Extract image URL from content if it exists
  const imageUrlMatch = blog.content.match(
    /https:\/\/[^\s]+\.(png|jpg|jpeg|gif)/i
  );
  const imageUrl = blog.image_urls || (imageUrlMatch ? imageUrlMatch[0] : null);

  // Truncate content for preview (remove image URLs)
  const contentPreview = blog.content
    .replace(/https:\/\/[^\s]+\.(png|jpg|jpeg|gif)/gi, "")
    .substring(0, 120)
    .trim();


    // Slugify function
const slugify = (text: string) =>
    text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");
  
  // Full slug with ID
  const fullSlug = `${slugify(blog.title)}-${blog.id}`;
  

  return (
    <Card className="h-full flex flex-col overflow-hidden">
      <CardHeader className="p-0">
        {imageUrl && (
          <div className="relative h-48 w-full">
            <Image
              src={blog.image_urls}
              alt={blog.title || "Blog image"}
              fill
              className="object-cover"
            />
          </div>
        )}
      </CardHeader>
      <CardContent className="flex-1 p-4">
        <div className="flex items-center gap-2 mb-2">
          <Badge variant="outline" className="bg-primary/10 text-primary">
            {blog.product_group}
          </Badge>
          {blog.tags.slice(0, 2).map((tag) => (
            <Badge key={tag} variant="secondary" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>

        <h3 className="text-lg font-bold mb-2 line-clamp-2">{blog.title}</h3>

        <div className="flex items-center text-sm text-muted-foreground mb-3">
          <User className="h-3 w-3 mr-1" />
          <span className="mr-3">{blog.author.name}</span>
          {blog.created_on && (
            <>
              <Calendar className="h-3 w-3 mr-1" />
              <span>{new Date(blog.created_on).toLocaleDateString()}</span>
            </>
          )}
        </div>

        <p className="text-sm text-muted-foreground line-clamp-3">
          {contentPreview}
          {contentPreview.length >= 120 ? "..." : ""}
        </p>

        {blog.conditions.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-3">
            {blog.conditions.map((condition) => (
              <Badge key={condition} variant="outline" className="text-xs">
                {condition.replace("_", " ")}
              </Badge>
            ))}
          </div>
        )}
      </CardContent>

      <CardFooter className="p-4 pt-0 flex justify-between">
        <Button onClick={()=>onView()} size="sm" asChild>
        <Link href={`/blog/${blog.id}`}>View Details</Link>
        </Button>

        <div className="flex gap-2">
          {onEdit && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => blog.id && onEdit(blog)}
            >
              Edit
            </Button>
          )}
          {onDelete && (
            <Button
              variant="ghost"
              size="sm"
              className="text-red-500 hover:text-red-700"
              onClick={() => blog.id && onDelete(blog.id)}
            >
              Delete
            </Button>
          )}
        </div>
      </CardFooter>
    </Card>
  );
}
