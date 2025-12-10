import { axiosInstance } from "@/lib/axios/axiosInstance";
import { ProductFormValues } from "@/components/modules/catalog/product/product.schema";

export const productService = {
  // Create Product
  create: async (data: ProductFormValues) => {
    const response = await axiosInstance.post(`/products`, data);
    return response.data;
  },

  // Get All Products (with filters)
  getAll: async (params?: any) => {
    const response = await axiosInstance.get(`/products`, { params });
    // Handle different response structures gracefully
    return response.data?.data?.result || response.data?.data || [];
  },

  // Get Single Product
  getById: async (id: string) => {
    const response = await axiosInstance.get(`/products/${id}`);
    return response.data?.data;
  },

  // Update Product
  update: async (id: string, data: Partial<ProductFormValues>) => {
    const response = await axiosInstance.patch(`/products/${id}`, data);
    return response.data;
  },

  // Delete Product
  delete: async (id: string) => {
    const response = await axiosInstance.delete(`/products/${id}`);
    return response.data;
  },

  // Get Categories (Simple fetch for dropdowns)
  getCategories: async () => {
    const response = await axiosInstance.get(`/category?limit=100`);
    return response.data?.data?.result || response.data?.data || [];
  },

  // Get Brands
  getBrands: async () => {
    // Assuming /brands endpoint exists, otherwise return empty
    try {
        const response = await axiosInstance.get(`/brands?limit=100`);
        return response.data?.data?.result || [];
    } catch {
        return [];
    }
  },

  // Get Business Units (if needed for selection)
  getBusinessUnits: async () => {
    const response = await axiosInstance.get(`/business-unit`);
    return response.data?.data || [];
  }
};
