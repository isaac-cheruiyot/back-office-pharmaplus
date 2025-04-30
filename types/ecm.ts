export interface Brand {
    title: string;
    low_res: string | null;
    high_res: string | null;
    description: string | null;
  }
  
  export type BrandList = Brand[];


  export interface TopBrands {
    brand: string;
    popularity: number;
    image_urls: string[];
    percentage_popularity: number;
  }

  export type TopBrandsList = TopBrands[];

  // src/types/condition.ts

export interface Condition {
    title: string;
    low_res: string | null;
    high_res: string | null;
    description: string | null;
  }
  
  export type ConditionList = Condition[];
  
  export interface TopConditionsResponse {
    content: Condition[];
    page: {
      size: number;
      number: number;
      totalElements: number;
      totalPages: number;
    };
  }
  
  // This matches the transformed UI structure used in the ConditionDropdown component
  export type ConditionItem = {
    id: string;
    name: string;
    slug: string;
  };

  export interface Product {
    product_code: string;
    item_name: string;
    price: number;
    in_stock: number;
    product_group: string;
    brand: string;
    category: string;
    category2: string;
    category3: string;
    category4: string;
    conditions: string;
    description: string;
    requires_prescription: boolean;
    image_urls: string[];
    is_saleable: boolean;
    hs_code: string;
    created_at: string;
    tag: string;
    searchable: string;
    is_in_transit: boolean;
    in_transit_quantity: number | null;
    in_transit_days_remaining: number | null;
    in_transit_expected_on: string | null;
    promo_name: string;
    promo_end_min_cart_qty: number | null;
    promo_end_description: string;
    promo_original_value: number | null;
    promo_discounted_value: number | null;
    promo_start_datetime: string | null;
    promo_end_datetime: string | null;
    promo_image_urls: string[] | null;
    is_on_promotion: boolean;
    has_reviews?: boolean;
    is_trending?: boolean;
    is_new_arrival?: boolean;
    is_most_viewed?: boolean;
    is_best_seller?: boolean;
  
    new_arrival_score?: number; // For sorting or filtering
    view_count?: number; // For tracking popularity
    trending_score?: number; // For trending algorithms
    units_sold?: number; // For sales ranking
  
    user_reviews: any; 
    rating_distribution: any; // Rating distribution (e.g., 1-5 stars)
    avg_rating: number | null; // Average rating (e.g., 4.5)
    
    // Derived/computed properties for easier frontend use
    name?: string; // Alias for item_name
    image?: string; // Primary image URL (first from image_urls)
    inStock?: boolean; // Derived from in_stock > 0
    categories?: string[]; // Combined category fields
    collections?: string[]; // Could be derived from tags or other fields
    discount?: number; // Could be calculated from promo fields
    rating?: number; // Future enhancement
    reviews?: number; // Future enhancement
    isNew?: boolean; // Could be derived from created_at
    popularity: number;
    isBestseller?: boolean; // Could be derived from sales data
    tags?: string[]; // Split from tag field
    originalPrice?: number; // Could be promo_original_value
  }
  
  export interface PaginatedProductResponse {
    content: Product[];
    page: {
      size: number;
      number: number;
      totalElements: number;
      totalPages: number;
    };
  }
    
    export interface Brand {
      id: string;
      name: string;
      productCount: number,
      logo: string;
    }
  
    export type SortOption = 'most-popular' | 'most-rated' | 'price-low-high' | 'price-high-low';
  
    export interface ProductGridHeaderProps {
      totalProducts: number;
      shownProducts: number;
      collectionType?: string;
      brandName?: string;
      categoryName?: string;
    }
    
    export interface ProductsResponse {
      products: Array<{
        id: number;
        name: string;
        price: number;
        category: string;
        image: string;
        isNew?: boolean;
      }>;
      total: number;
    }

    // types/ecm.ts

export interface Topic {
    id: number;               
    productGroup: string;     
    topic: string;            // Topic name (e.g., "Being A Weider")
    tags: string[];           // Tags associated with the topic (array of strings)
  }
  