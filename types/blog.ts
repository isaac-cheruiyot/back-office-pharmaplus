export interface BlogPost {
    id: number;
    topic_id: number;
    topic: string;
    product_group: string;
    tags: string[];
    title: string;
    author: {
      user_type: string;
      name: string;
      id: number;
    };
    content: string;
    product_code: string;
    product_name: string;
    product_brand: string;
    image_urls: string[];
    conditions: string[];
    created_on: string;
    modified_on: string;
    searchable: string;
    comments: any[]; // You can further define a structure if needed for comments
    likes_count: number;
  }
  