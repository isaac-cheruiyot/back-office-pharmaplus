// context/BlogContext.tsx
"use client"
import React, { createContext, useContext, useEffect, useState } from 'react';
import { Blog } from '@/types/blog';
import { BlogManager } from '@/lib/BlogManager';
import { initializeBlogManager } from '@/lib/initBlogManager';
import axios from 'axios';

interface BlogContextType {
  blogManager: BlogManager | null;
  loading: boolean;
} 

const BlogContext = createContext<BlogContextType>({
  blogManager: null,
  loading: true,
});

export const useBlogContext = () => useContext(BlogContext);

export const BlogProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [blogManager, setBlogManager] = useState<BlogManager | null>(null);
  const [loading, setLoading] = useState(true);

  const username = process.env.NEXT_PUBLIC_BASIC_AUTH_USER || "";
  const password = process.env.NEXT_PUBLIC_BASIC_AUTH_PASS || "";

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const { data } = await axios.get<Blog[]>( `${process.env.NEXT_PUBLIC_API_BASE_URL}/read_blogs/fetch`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Basic ${btoa(`${username}:${password}`)}`,
          },
        }
      ); // adjust API endpoint as needed
        const manager = initializeBlogManager(data);
        setBlogManager(manager);
      } catch (error) {
        console.error('Failed to load blogs:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  return (
    <BlogContext.Provider value={{ blogManager, loading }}>
      {children}
    </BlogContext.Provider>
  );
};
