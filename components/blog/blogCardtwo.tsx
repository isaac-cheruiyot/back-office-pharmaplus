import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BlogPost } from "@/types/blog";

interface BlogCardtwoProps {
  blog: BlogPost;
  
}

export const BlogCardtwo: React.FC<BlogCardtwoProps> = ({ blog }) => {

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">{blog.title}</CardTitle>
        <CardDescription className="text-muted-foreground">{blog.tags.join(", ")}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <p>{blog.content}</p>
          <div className="flex justify-between mt-4">
            <Button variant="outline" onClick={() => onEdit(blog)}>
              Edit
            </Button>
            <Button variant="destructive" onClick={() => onDelete(blog.id)}>
              Delete
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
