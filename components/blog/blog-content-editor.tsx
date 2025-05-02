"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { useState, useEffect, useCallback } from "react"
import type { UseFormReturn } from "react-hook-form"
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import type { BlogFormValues } from "./blog-post-form"
import { useToast } from "@/hooks/use-toast"

// Direct imports instead of using the index file
import { useEditor, EditorContent } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import Link from "@tiptap/extension-link"
import Image from "@tiptap/extension-image"
import Placeholder from "@tiptap/extension-placeholder"
import { Bold, Italic, LinkIcon, List, ListOrdered, ImageIcon, Save } from "lucide-react"
import { Button } from "@/components/ui/button"

// Debounce function to limit how often we save to localStorage
function debounce<T extends (...args: any[]) => any>(func: T, wait: number): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout> | null = null

  return (...args: Parameters<T>) => {
    const later = () => {
      timeout = null
      func(...args)
    }

    if (timeout !== null) {
      clearTimeout(timeout)
    }
    timeout = setTimeout(later, wait)
  }
}

const STORAGE_KEY = "blog-post-draft"

export function BlogContentEditor({
  form,
}: {
  form: UseFormReturn<BlogFormValues>
}) {
  const { toast } = useToast()
  const [content, setContent] = useState(form.getValues().content || "")
  const [ready, setReady] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [urlType, setUrlType] = useState<"link" | "image">("link")
  const [urlInput, setUrlInput] = useState("")
  const [lastSaved, setLastSaved] = useState<Date | null>(null)

  // Save form data to localStorage
  const saveToLocalStorage = useCallback(() => {
    try {
      const formData = form.getValues()
      localStorage.setItem(STORAGE_KEY, JSON.stringify(formData))
      setLastSaved(new Date())
    } catch (error) {
      console.error("Failed to save to localStorage:", error)
    }
  }, [form])

  // Debounced version of saveToLocalStorage
  const debouncedSave = useCallback(
    debounce(() => saveToLocalStorage(), 1000),
    [saveToLocalStorage],
  )

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const savedData = localStorage.getItem(STORAGE_KEY)
      if (savedData) {
        const parsedData = JSON.parse(savedData) as BlogFormValues

        // Only restore if the form is empty or matches the saved data
        if (!form.getValues().title && !form.getValues().content) {
          form.reset(parsedData)
          setContent(parsedData.content || "")
          toast({
            title: "Draft restored",
            description: "Your previous draft has been loaded",
          })
        }
      }
    } catch (error) {
      console.error("Failed to load from localStorage:", error)
    }
  }, [form, toast])

  // Save to localStorage when content changes
  useEffect(() => {
    if (content) {
      debouncedSave()
    }
  }, [content, debouncedSave])

  // Manual save function
  const handleManualSave = () => {
    saveToLocalStorage()
    toast({
      title: "Draft saved",
      description: "Your draft has been saved locally",
    })
  }

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
      setContent(html)
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
    setUrlInput(previousUrl || "")
    setUrlType("link")
    setModalOpen(true)
  }

  const handleImageClick = () => {
    setUrlInput("")
    setUrlType("image")
    setModalOpen(true)
  }

  // Format the last saved time
  const formatLastSaved = () => {
    if (!lastSaved) return ""

    const now = new Date()
    const diffMs = now.getTime() - lastSaved.getTime()
    const diffSec = Math.floor(diffMs / 1000)

    if (diffSec < 60) return "just now"
    if (diffSec < 3600) return `${Math.floor(diffSec / 60)} min ago`

    return lastSaved.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  return (
    <div className="space-y-4">
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{urlType === "image" ? "Insert Image URL" : "Insert Link URL"}</DialogTitle>
          </DialogHeader>
          <Input value={urlInput} onChange={(e) => setUrlInput(e.target.value)} placeholder="https://example.com" />
          <DialogFooter>
            <Button
              onClick={() => {
                if (!editor) return
                if (!urlInput.trim()) {
                  setModalOpen(false)
                  return
                }

                if (urlType === "image") {
                  editor.chain().focus().setImage({ src: urlInput }).run()
                } else {
                  editor.chain().focus().extendMarkRange("link").setLink({ href: urlInput }).run()
                }

                setModalOpen(false)
              }}
            >
              Insert
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* form */}
      <FormField
        control={form.control}
        name="title"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Title</FormLabel>
            <FormControl>
              <Input
                placeholder="Enter blog title"
                {...field}
                onChange={(e) => {
                  field.onChange(e)
                  debouncedSave()
                }}
              />
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
            <div className="flex justify-between items-center">
              <FormLabel>Content</FormLabel>
              <div className="flex items-center gap-2">
                {lastSaved && <span className="text-xs text-muted-foreground">Last saved: {formatLastSaved()}</span>}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleManualSave}
                  className="flex items-center gap-1"
                >
                  <Save className="h-3.5 w-3.5" />
                  <span>Save draft</span>
                </Button>
              </div>
            </div>
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
            <div className="flex flex-col gap-1 mt-2">
              <p className="text-sm text-muted-foreground">
                Tip: Any link that ends with an image extension (.jpg, .png, etc.) will be automatically rendered as an
                image.
              </p>
              <p className="text-sm text-muted-foreground">Your draft is automatically saved as you type.</p>
            </div>
          </FormItem>
        )}
      />
    </div>
  )
}
