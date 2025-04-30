export type TopicItem = {
    id: number;
    productGroup: string;
    topic: string;
    tags: string[];
  };
  
  export type TopicPage = {
    size: number;
    number: number;
    totalElements: number;
    totalPages: number;
  };
  
  export type TopicResponse = {
    content: TopicItem[];
    page: TopicPage;
  };
  