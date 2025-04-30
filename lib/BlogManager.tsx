// lib/BlogManager.ts
import { BlogPost } from '@/types/blog';

export class BlogManager {
  private blogs: BlogPost[];

  constructor(blogs: BlogPost[]) {
    this.blogs = blogs;
  }

  getAll(): BlogPost[] {
    return this.blogs;
  }

  getById(id: string): BlogPost | undefined {
    return this.blogs.find(blog => blog.id === Number(id));
  }
  

  getByProductCode(code: string): BlogPost[] {
    return this.blogs.filter(blog => blog.product_code === code);
  }

  getByBrand(brand: string): BlogPost[] {
    return this.blogs.filter(blog => blog.product_brand === brand);
  }

  getByTopic(topic: string): BlogPost[] {
    return this.blogs.filter(blog => blog.topic?.toLowerCase() === topic.toLowerCase());
  }

  getByCondition(condition: string): BlogPost[] {
    return this.blogs.filter(blog =>
      blog.conditions?.some(c => c.toLowerCase().includes(condition.toLowerCase()))
    );
  }
  
  getByDateRange(start: string, end: string): BlogPost[] {
    const startDate = new Date(start);
    const endDate = new Date(end);
    return this.blogs.filter(blog => {
      const blogDate = new Date(blog.created_on);
      return blogDate >= startDate && blogDate <= endDate;
    });
  }
}
