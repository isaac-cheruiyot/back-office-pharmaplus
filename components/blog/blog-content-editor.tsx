"use client"

import { useState } from "react"
import type { UseFormReturn } from "react-hook-form"
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import type { BlogFormValues } from "./blog-post-form"

// Direct imports instead of using the index file
import { useEditor, EditorContent } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import Link from "@tiptap/extension-link"
import Image from "@tiptap/extension-image"
import Placeholder from "@tiptap/extension-placeholder"
import { Bold, Italic, LinkIcon, List, ListOrdered, ImageIcon } from "lucide-react"
import { Button } from "@/components/ui/button"

export function BlogContentEditor({ form }: { form: UseFormReturn<BlogFormValues> }) {
  const [content, setContent] = useState(form.getValues().content || "")

  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "text-primary underline",
        },
      }),
      Image.configure({
        HTMLAttributes: {
          class: "rounded-md my-4 max-w-full",
        },
      }),
      Placeholder.configure({
        placeholder: "Write something...",
      }),
    ],
    content,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML()
      form.setValue("content", html, { shouldValidate: true })
    },
    editorProps: {
      attributes: {
        class: "prose max-w-none focus:outline-none min-h-[150px] p-3",
      },
    },
  })

  const handleLinkClick = () => {
    if (!editor) return

    const previousUrl = editor.getAttributes("link").href
    const url = window.prompt("URL", previousUrl)

    if (url === null) return

    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run()
      return
    }

    // Check if the URL ends with an image extension
    const isImageUrl = /\.(jpg|jpeg|png|gif|webp)$/i.test(url)

    if (isImageUrl) {
      // Insert as image
      editor.chain().focus().setImage({ src: url }).run()
    } else {
      // Insert as link
      editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run()
    }
  }

  const handleImageClick = () => {
    if (!editor) return

    const url = window.prompt("Image URL")

    if (url === null || url === "") return

    editor.chain().focus().setImage({ src: url }).run()
  }

  return (
    <div className="space-y-4">
      <FormField
        control={form.control}
        name="title"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Title</FormLabel>
            <FormControl>
              <Input placeholder="Enter blog title" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="content"
        render={() => (
          <FormItem>
            <FormLabel>Content</FormLabel>
            <FormControl>
              <div className="border rounded-md">
                {editor && (
                  <div className="flex items-center gap-1 p-2 border-b bg-muted/50">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => editor.chain().focus().toggleBold().run()}
                      className={editor.isActive("bold") ? "bg-muted" : ""}
                    >
                      <Bold className="h-4 w-4" />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => editor.chain().focus().toggleItalic().run()}
                      className={editor.isActive("italic") ? "bg-muted" : ""}
                    >
                      <Italic className="h-4 w-4" />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={handleLinkClick}
                      className={editor.isActive("link") ? "bg-muted" : ""}
                    >
                      <LinkIcon className="h-4 w-4" />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={handleImageClick}
                      className={editor.isActive("image") ? "bg-muted" : ""}
                    >
                      <ImageIcon className="h-4 w-4" />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => editor.chain().focus().toggleBulletList().run()}
                      className={editor.isActive("bulletList") ? "bg-muted" : ""}
                    >
                      <List className="h-4 w-4" />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => editor.chain().focus().toggleOrderedList().run()}
                      className={editor.isActive("orderedList") ? "bg-muted" : ""}
                    >
                      <ListOrdered className="h-4 w-4" />
                    </Button>
                  </div>
                )}
                <EditorContent editor={editor} className="p-3" />
              </div>
            </FormControl>
            <FormMessage />
            <p className="text-sm text-muted-foreground mt-2">
              Tip: Any link that ends with an image extension (.jpg, .png, etc.) will be automatically rendered as an
              image.
            </p>
          </FormItem>
        )}
      />
    </div>
  )
}
