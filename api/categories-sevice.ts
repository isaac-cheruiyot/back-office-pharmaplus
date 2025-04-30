import apiClient from '@/lib/api';
import { CategoriesResponse, FlattenedCategory, TopCategory } from '@/types/category';

export class CategoryService {
  private static BASE_URL = '/read_categories_tier';

  /**
   * Fetch all categories with their hierarchy
   */
  static async fetchCategories(): Promise<CategoriesResponse> {
    try {
      const response = await apiClient.get(`${this.BASE_URL}/fetch`);
      console.log(response.data)
      return response.data;
    } catch (error:any) {
      console.error('Failed to fetch categories:', error.message);
      throw error;
    }
  }

  /**
 * Fetch top categories by popularity
 */
  static async fetchTopCategories(): Promise<TopCategory[]> {
    try {
      const response = await apiClient.get('/read_top_categories/fetch');
      return response.data;
    } catch (error) {
      console.error('Failed to fetch top categories:', error);
      throw error;
    }
  }

  /**
   * Get a flattened list of all categories for easier navigation
   */
  static async getFlattenedCategories(): Promise<FlattenedCategory[]> {
    const categories = await this.fetchCategories();
    return this.flattenCategories(categories);
  }

  /**
   * Helper method to flatten the category hierarchy
   */
  private static flattenCategories(
    categories: CategoriesResponse,
    parentPath: string[] = [],
    level = 0
  ): FlattenedCategory[] {
    let result: FlattenedCategory[] = [];

    for (const [key, value] of Object.entries(categories)) {
      const currentPath = [...parentPath, key];
      const id = currentPath.join('->');

      // Add the main category
      result.push({
        id,
        name: value.category,
        path: currentPath,
        level,
        imageUrl: value.lowResImageUrl || value.highResImageUrl || null
      });

      // Process children recursively
      if (value.children) {
        result = [
          ...result,
          ...this.flattenChildCategories(value.children, currentPath, level + 1, id)
        ];
      }
    }

    return result;
  }

  private static flattenChildCategories(
    children: Record<string, any>,
    parentPath: string[],
    level: number,
    parentId: string
  ): FlattenedCategory[] {
    let result: FlattenedCategory[] = [];

    for (const [childKey, childValue] of Object.entries(children)) {
      const currentPath = [...parentPath, childKey];
      const id = currentPath.join('->');

      if (childValue.name) {
        // It's a leaf node (CategoryItem)
        result.push({
          id,
          name: childValue.name,
          path: currentPath,
          level,
          parent: parentId,
          imageUrl: childValue.lowResImageUrl || null
        });
      } else {
        // It's another tier (CategoryTier)
        result.push({
          id,
          name: childKey,
          path: currentPath,
          level,
          parent: parentId,
          imageUrl: null
        });

        // Recurse deeper
        result = [
          ...result,
          ...this.flattenChildCategories(childValue, currentPath, level + 1, id)
        ];
      }
    }

    return result;
  }

  /**
   * Get breadcrumb paths for a specific category
   */
  static async getBreadcrumbs(categoryPath: string[]): Promise<Array<{ name: string; path: string[] }>> {
    const categories = await this.fetchCategories();
    const breadcrumbs: Array<{ name: string; path: string[] }> = [];
    
    let currentLevel: any = categories;
    let currentPath: string[] = [];
    
    for (const segment of categoryPath) {
      if (!currentLevel[segment]) break;
      
      currentPath.push(segment);
      const current = currentLevel[segment];
      
      breadcrumbs.push({
        name: current.category || segment,
        path: [...currentPath]
      });
      
      if (current.children) {
        currentLevel = current.children;
      } else {
        break;
      }
    }
    
    return breadcrumbs;
  }
}

export default CategoryService;