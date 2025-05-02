import { UseFormReturn } from "react-hook-form"
import { BlogFormValues } from "./blog-post-form"
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

type AuthorSelectorProps = {
  form: UseFormReturn<BlogFormValues>
}

export function AuthorSelector({ form }: AuthorSelectorProps) {
  const authors = [
    { id: 1, name: "Jane Doe", user_type: "Editor", profession: "Health Writer" },
    { id: 2, name: "John Smith", user_type: "Contributor", profession: "Pharmacist" },
    { id: 3, name: "Emily Wangari", user_type: "Admin", profession: "Medical Officer" },
  ]

  return (
    <FormField
      control={form.control}
      name="author"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Author</FormLabel>
          <Select
            onValueChange={(val) => {
              const selected = authors.find((a) => a.id.toString() === val)
              if (selected) {
                // Set the entire author object to the form field
                field.onChange(selected)
              }
            }}
            value={field.value?.id?.toString() || ""}
          >
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Choose an author" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {authors.map((author) => (
                <SelectItem key={author.id} value={author.id.toString()}>
                  {author.name} ({author.user_type})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {field.value?.profession && (
            <p className="text-sm text-muted-foreground mt-1">
              <strong>Profession:</strong> {field.value.profession}
            </p>
          )}
          <FormMessage />
        </FormItem>
      )}
    />
  )
}
