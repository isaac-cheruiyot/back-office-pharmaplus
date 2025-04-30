"use client";
import React, { useEffect, useState } from 'react'; // Make sure React is imported here
import { useBlogContext } from '@/context/BlogContext';
import { BlogPost } from '@/types/blog';
import { notFound } from 'next/navigation';

interface BlogPageProps {
  params: {
    slug: string;
  }
}

export default function BlogDetailsPage({ params }: BlogPageProps) {
  const { blogManager, loading } = useBlogContext();
  const [blog, setBlog] = useState<BlogPost | null>(null);

  // Extract the slug and id from the `slug-id` pattern
  const { slug } = params;

  // If loading, show loading indicator
  if (loading) {
    return <p>Loading...</p>;
  }

  useEffect(() => {
    // Check if blogSlug and blogId exist and are valid
    if (slug) {
      // Assuming `blogManager.getById` might return a promise
      const fetchBlog = async () => {
        const foundBlog = await blogManager?.getById(slug);

        if (!foundBlog) {
          // If no blog found, trigger the notFound() error
          notFound();
        } else {
          setBlog(foundBlog); // Set the found blog to state
        }
      };

      fetchBlog();
    }
  }, [slug, blogManager]);

  // If the blog is found, display it
  if (blog) {
    return (
      <div className="p-4">
        <h1 className="text-2xl font-bold">{blog.title}</h1>
        <p className="text-sm text-gray-600">{blog.created_on}</p>
        <div className="mt-4" dangerouslySetInnerHTML={{ __html: blog.content }} />
      </div>
    );
  }

  return null;
}
