"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Save } from "lucide-react"
import axios from "axios" // Import axios

import { Button } from "@/components/ui/button"
import { Form } from "@/components/ui/form"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "@/hooks/use-toast"
import { BlogContentEditor } from "./blog-content-editor"
import { TopicSelector } from "./topic-selector"
import { ProductSelector } from "./product-selector"
import { BrandSelector } from "./brand-selector"
import { ConditionSelector } from "./condition-selector"
import { BlogPreview } from "./blog-preview"

const authorSchema = z.object({
  id: z.number().min(1, { message: "Author ID is required" }),
  name: z.string().min(3, { message: "Name must be at least 3 characters" }),
  user_type: z.string(),
  profession: z.string(),
})

const formSchema = z.object({
  title: z.string().min(5, {
    message: "Title must be at least 5 characters.",
  }),
  content: z.string().min(50, {
    message: "Content must be at least 50 characters.",
  }),
  topic_id: z.number().min(1, { message: "Topic ID is required" }),
  topic: z.string(),
  productGroup: z.string(),
  tags: z.array(z.number()),
  author: authorSchema,
  product_codes: z.array(z.string()),
  brands: z.array(z.string()),
  conditions: z.array(z.string()),
})

export type BlogFormValues = z.infer<typeof formSchema>

export function BlogPostForm() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("edit")

  const form = useForm<BlogFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      content: "",
      topic_id: 0, // Default value for topic_id
      topic: "",
      productGroup: "",
      tags: [],
      author: {
        id: 0, // Default value for author.id
        name: "",
        user_type: "",
        profession: "",
      },
      product_codes: [],
      brands: [],
      conditions: [],
    },
  })

  const { watch, setValue } = form
  const formValues = watch()

  const basicUser = process.env.NEXT_PUBLIC_BASIC_AUTH_USER!
  const basicPass = process.env.NEXT_PUBLIC_BASIC_AUTH_PASS!
  const authHeader = `Basic ${btoa(`${basicUser}:${basicPass}`)}`

  async function onSubmit(data: BlogFormValues) {
    try {
      // Send data to the API using Axios
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/write_blog_likes/create_or_update`, 
        data,
        {
          headers: {
            Authorization: authHeader,
          },
        }
      )

      // Simulate successful API response
      if (response.status === 200) {
        toast({
          title: "Blog post created",
          description: "Your blog post has been successfully created.",
        })

        // Redirect to blog list
        router.push("/blog")
      } else {
        throw new Error("Failed to create blog post")
      }
    } catch (error) {
      console.error("Error submitting form:", error)
      toast({
        title: "Error",
        description: "There was an error creating your blog post. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
      <div className="flex justify-between items-center">
        <TabsList>
          <TabsTrigger value="edit">Edit</TabsTrigger>
          <TabsTrigger value="preview">Preview</TabsTrigger>
        </TabsList>
        <Button type="submit" onClick={form.handleSubmit(onSubmit)} className="gap-2">
          <Save className="h-4 w-4" />
          Save Blog Post
        </Button>
      </div>

      <TabsContent value="edit" className="space-y-4">
        <Form {...form}>
          <form className="space-y-8">
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-6">
                <BlogContentEditor form={form} />
              </div>
              <div className="space-y-6">
                <TopicSelector form={form} />
                <ProductSelector form={form} />
                <BrandSelector form={form} />
                <ConditionSelector form={form} />
              </div>
            </div>
          </form>
        </Form>
      </TabsContent>

      <TabsContent value="preview">
        <BlogPreview blogData={formValues} />
      </TabsContent>
    </Tabs>
  )
}
