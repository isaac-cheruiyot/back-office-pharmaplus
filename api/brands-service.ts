import { BrandList, TopBrandsList } from '@/types/brand';
import apiClient from '@/lib/api';


export default class BrandService {
  static async fetchBrands(): Promise<BrandList> {
    try {
      const response = await apiClient.get(`/read_brand_info/fetch`);
      
      if (!response) {
        throw new Error(`An error occured please try again.`);
      }
      
      const data: BrandList = response.data;
      
      // Filter out any null or invalid entries if needed
      return data.filter(brand => brand.title && brand.title !== 'Null');
    } catch (error) {
      console.error('Error fetching brands:', error);
      throw error;
    }
  }

  static async fetchTopBrands(): Promise<TopBrandsList> {
    try {
      const response = await apiClient.get(`/read_top_brands/fetch`);
      
      if (!response) {
        throw new Error(`An error occured please try again.`);
      }
      
      const data: TopBrandsList = response.data.content;
      
      // Filter out any null or invalid entries if needed
      return data.filter(brand => brand.brand && brand.brand !== 'Null');
    } catch (error) {
      console.error('Error fetching top brands:', error);
      throw error;
    }
  }

  // You can add more brand-related methods here as needed
  // For example:
  static async searchBrands(searchTerm: string): Promise<BrandList> {
    try {
      const brands = await this.fetchBrands();
      return brands.filter(brand => 
        brand.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    } catch (error) {
      console.error('Error searching brands:', error);
      throw error;
    }
  }
}