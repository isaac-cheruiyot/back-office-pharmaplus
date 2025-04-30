// lib/initBlogManager.ts
import { BlogPost } from '@/types/blog';
import { BlogManager } from './BlogManager';

export const initializeBlogManager = (blogs: BlogPost[]): BlogManager => {
  return new BlogManager(blogs);
};
