export interface CategoryItem {
  name: string;
  lowResImageUrl: string | null;
}

export interface CategoryGroup {
  category: string;
  // optionally include items if needed:
  items?: CategoryItem[];
}

// Changed from object map to array
export type CategoryTier = CategoryGroup[];
