"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Save } from "lucide-react";
import axios from "axios"; // Import axios

import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/hooks/use-toast";
import { BlogContentEditor } from "./blog-content-editor";
import { TopicSelector } from "./topic-selector";
import { ProductSelector } from "./product-selector";
import { BrandSelector } from "./brand-selector";
import { ConditionSelector } from "./condition-selector";
import { BlogPreview } from "./blog-preview";
import { FeatureImage } from "./feature-image";
import { AuthorSelector } from "./author-selector";

const authorSchema = z.object({
  id: z.number().min(1, { message: "Author ID is required" }),
  name: z.string().min(3, { message: "Name must be at least 3 characters" }),
  user_type: z.string(),
  profession: z.string(),
});

const topicSchema = z.object({
  topic_id: z.number().min(1, { message: "Topic is required" }),
  topic: z.string(),
  product_group: z.string(),
  tags: z.array(z.string()),
});

const formSchema = z.object({
  blog_id: z.number().nullable(),
  title: z.string().min(5, { message: "Title must be at least 5 characters." }),
  content: z
    .string()
    .min(50, { message: "Content must be at least 50 characters." }),
  author: authorSchema,
  topic_info: topicSchema,
  product_codes: z.array(z.string().min(1, { message: "Product is Required" })),
  brands: z.array(z.string().min(1, { message: "Brand is required" })),
  conditions: z.array(z.string().min(1, { message: "Condition is required" })),
  files: z.array(z.instanceof(File)).min(1, {message: "Feature image is required"}),
});

export type BlogFormValues = z.infer<typeof formSchema>;

export function BlogPostForm() {
  const [files, setFiles] = useState<File[]>([])
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("edit");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<BlogFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      blog_id: null,
      title: "",
      content: "",
      topic_info: {
        topic: "",
        product_group: "",
        tags: [],
      },
      author: {
        id: 2, // Default value for author.id
        name: "",
        user_type: "",
        profession: "",
      },
      product_codes: [],
      brands: [],
      conditions: [],
      files: [],
    },
  });

  const { watch, setValue } = form;
  const formValues = watch();

  const basicUser = process.env.NEXT_PUBLIC_BASIC_AUTH_USER!;
  const basicPass = process.env.NEXT_PUBLIC_BASIC_AUTH_PASS!;
  const authHeader = `Basic ${btoa(`${basicUser}:${basicPass}`)}`;

  useEffect(() => {
    console.log("Form errors:", form.formState.errors);
  }, [form.formState.errors]);

  async function onSubmit(data: BlogFormValues) {
    setIsSubmitting(true);
  
    try {
      const jsonPayload = {
        blog_id: data.blog_id,
        title: data.title,
        content: data.content,
        author: data.author,
        topic_info: data.topic_info,
        product_codes: data.product_codes,
        brands: data.brands,
        conditions: data.conditions,
      };
  
      const formData = new FormData();
      formData.append(
        "data",
        new Blob([JSON.stringify(jsonPayload)], {
          type: "application/json",
        })
      );
  
      if (!data.files || data.files.length === 0) {
        throw new Error("No file selected.");
      }
  
      data.files.forEach((file) => {
        formData.append("files", file); // Must match backend field name
      });
  
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/write_blogs/create_or_update`,
        {
          method: "POST",
          headers: {
            Authorization: authHeader,
          },
          body: formData,
        }
      );
  
      if (response.ok) {
        toast({
          title: "Blog post created",
          description: "Your blog post has been successfully created.",
        });
        router.push("/blog");
      } else {
        const errorText = await response.text();
        console.error("API error:", errorText);
        throw new Error("Failed to create blog post.");
      }
    } catch (error) {
      console.error("Submission error:", error);
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "An unexpected error occurred.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  }
  

  return (
    <Tabs
      value={activeTab}
      onValueChange={setActiveTab}
      className=" outline-none min-h-[120vh] space-y-4"
    >
      <div className="flex justify-between items-center">
        <TabsList>
          <TabsTrigger value="edit">Edit</TabsTrigger>
          <TabsTrigger value="preview">Preview</TabsTrigger>
        </TabsList>
      </div>

      <TabsContent value="edit" className="space-y-4">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <Button disabled={isSubmitting} className="gap-2">
              {isSubmitting ? (
                "Saving..."
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  Save Blog Post
                </>
              )}
            </Button>

            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-6">
                <BlogContentEditor form={form} />
              </div>
              <div className="space-y-6">
                <TopicSelector form={form} />
                <BrandSelector form={form} />
                <ProductSelector form={form} />
                <ConditionSelector form={form} />
                <AuthorSelector form={form} />
                <FeatureImage form={form} name="files" />
              </div>
            </div>
          </form>
        </Form>
      </TabsContent>

      <TabsContent value="preview">
        <BlogPreview blogData={formValues} />
      </TabsContent>
    </Tabs>
  );
}
