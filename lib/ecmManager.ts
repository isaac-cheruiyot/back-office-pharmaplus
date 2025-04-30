import axios from "axios";
import axiosInstance from "./axios"
import { Brand, Topic, Condition, Product } from "@/types/ecm"

export const fetchBrands = async (): Promise<Brand[]> => {
  try {
    const { data } = await axiosInstance.post("/read_brand_info/fetch");
    console.log("API Response Data:", data); // log the response data
    return data?.data || [];
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Error response:", error.response);
      console.error("Error status:", error.response?.status);
      console.error("Error message:", error.message);
    } else {
      console.error("Unknown error:", error);
    }
    return [];
  }
};

// export const fetchConditions = async (): Promise<Condition[]> => {
//   const { data } = await axiosInstance.post("/read_conditions_info/fetch")
//   return data?.data || []
// }

// export const fetchTopics = async (): Promise<Topic[]> => {
//   const { data } = await axiosInstance.post("/read_blog_topic/fetch")
//   return data?.content || []
// }

// export const fetchProducts = async (): Promise<Product[]> => {
//   const { data } = await axiosInstance.post("/read_products/fetch")
//   return data?.data || []
// }
