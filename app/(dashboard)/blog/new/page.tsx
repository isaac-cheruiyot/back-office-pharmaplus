import { BlogPostForm } from "@/components/blog/blog-post-form"

export default function CreateBlogPage() {
  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold mb-6">Create New Blog Post</h1>
      <BlogPostForm />
    </div>
  )
}
