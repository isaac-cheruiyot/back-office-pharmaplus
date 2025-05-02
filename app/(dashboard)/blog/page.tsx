"use client"

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Filter, Plus, Search } from "lucide-react";
import Link from "next/link";
import {BlogCard} from "@/components/blog/blog-card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import {Blog} from '@/types/blog'
import {BlogCardtwo} from "@/components/blog/blogCardtwo"
import axios from "axios";

export default function BlogPage() {
  const { toast } = useToast();
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [filteredBlogs, setFilteredBlogs] = useState<Blog[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBlog, setSelectedBlog] = useState<Blog| null>(null);
  const [isLoading, setIsLoading] = useState(true);


  const username = process.env.NEXT_PUBLIC_BASIC_AUTH_USER || "";
  const password = process.env.NEXT_PUBLIC_BASIC_AUTH_PASS || "";

  // Fetch blogs from API
  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/ecmws/read_blogs/fetch`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Basic ${btoa(`${username}:${password}`)}`,
            },
          }
        )
        .then((response) => {
          if (response.data.content) {
            setBlogs(response.data.content || [])
            setFilteredBlogs(response.data.content || []) // Set the product list
          }
        })
      } catch (error) {
        console.error("Error fetching blogs:", error)
        toast({
          title: "Error",
          description: "Failed to load blog posts. Please try again.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }
  
    fetchBlogs()
  }, [toast])

  // Handle search
  useEffect(() => {
    if (searchTerm) {
      const filtered = blogs.filter(
        (blog) =>
          blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          blog.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
          blog.tags.some((tag: string) => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
      setFilteredBlogs(filtered);
    } else {
      setFilteredBlogs(blogs);
    }
  }, [searchTerm, blogs]);

  // Filter blogs by status (if necessary)
  

  // Handle blog deletion
  const handleDeleteBlog = async (blogId: number) => {
    if (confirm("Are you sure you want to delete this blog post?")) {
      try {
        // Send a request to delete the blog post (ensure your API supports deletion)
        await fetch(`/api/blogs/${blogId}`, { method: "DELETE" });

        // Update state
        const updatedBlogs = blogs.filter((blog) => blog.id !== blogId);
        setBlogs(updatedBlogs);
        setFilteredBlogs(updatedBlogs);

        toast({
          title: "Blog deleted",
          description: "The blog post has been successfully deleted.",
        });
      } catch (error) {
        console.error("Error deleting blog:", error);
        toast({
          title: "Error",
          description: "Failed to delete the blog post. Please try again.",
          variant: "destructive",
        });
      }
    }
  };

  const filterByStatus =()=>{}

  return (
    <div className="space-y-6">
      {selectedBlog  ? (

      <BlogCardtwo  blog={selectedBlog}/>):(
        <div>
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Blog Management</h1>
        <Button asChild>
          <Link href="/dashboard/blog/create">
            <Plus className="mr-2 h-4 w-4" /> New Blog Post
          </Link>
        </Button>
      </div>

      <Tabs defaultValue="all" className="w-full" onValueChange={filterByStatus}>
        <TabsList>
          <TabsTrigger value="all">All Posts</TabsTrigger>
          <TabsTrigger value="published">Published</TabsTrigger>
          <TabsTrigger value="drafts">Drafts</TabsTrigger>
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
                  <Input
                    placeholder="Search blogs..."
                    className="h-9"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
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


              
              {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[1, 2, 3].map((i) => (
                    <Card key={i} className="h-[400px] animate-pulse">
                      <div className="h-48 bg-muted rounded-t-lg" />
                      <CardContent className="p-4 space-y-3">
                        <div className="h-4 bg-muted rounded w-3/4" />
                        <div className="h-4 bg-muted rounded w-1/2" />
                        <div className="h-20 bg-muted rounded" />
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : filteredBlogs.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredBlogs.map((blog) => (
                    <BlogCard
                      key={blog.id}
                      blog={blog}
                      onDelete={handleDeleteBlog}
                      onEdit={(blog) => {
                        // Navigate to edit page
                        window.location.href = `/blog/edit/${blog.id}`;
                      }}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-10">
                  <p className="text-muted-foreground">No blog posts found.</p>
                  {searchTerm && (
                    <p className="text-sm text-muted-foreground mt-2">
                      Try adjusting your search or filters to find what you're looking for.
                    </p>
                  )}
                </div>
              )}
            
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
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredBlogs.map((blog) => (
                  <BlogCard
                    key={blog.id}
                    blog={blog}
                    onDelete={handleDeleteBlog}
                    onEdit={(blog) => {
                      window.location.href = `/dashboard/blog/edit/${blog.id}`;
                    }}
                    onView={() => setSelectedBlog(blog)} // <- Add this
                  />
                ))}
              </div>
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
              <div className="text-center py-10">
                <p className="text-muted-foreground">No draft posts found.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      </div>
      
      )}
    </div>
  );
}
