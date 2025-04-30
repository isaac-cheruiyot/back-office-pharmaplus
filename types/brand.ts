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