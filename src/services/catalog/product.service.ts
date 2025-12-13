import { axiosInstance } from "@/lib/axios/axiosInstance";
import { ProductFormValues } from "@/components/modules/catalog/product/product.schema";

export const productService = {
  // Create Product
  create: async (data: ProductFormValues) => {
    const response = await axiosInstance.post(`/super-admin/products`, data);
    return response.data;
  },

  // Get All Products (with filters)
  getAll: async (params?: any) => {
    const response = await axiosInstance.get(`/super-admin/products`, { params });
    // Handle different response structures gracefully
    return response.data?.data?.result || response.data?.data || [];
  },

  // Get Single Product
  getById: async (id: string) => {
    const response = await axiosInstance.get(`/super-admin/products/${id}`);
    return response.data?.data;
  },

  // Update Product
  update: async (id: string, data: Partial<ProductFormValues>) => {
    const response = await axiosInstance.patch(`/super-admin/products/${id}`, data);
    return response.data;
  },

  // Delete Product
  delete: async (id: string) => {
    const response = await axiosInstance.delete(`/super-admin/products/${id}`);
    return response.data;
  },

  getCategories: async () => {
    const response = await axiosInstance.get(`/super-admin/categories?limit=100`);
    return response.data?.data?.result || response.data?.data || [];
  },

  getSubCategories: async () => {
    try {
        const response = await axiosInstance.get(`/super-admin/categories/sub?limit=100`);
        return response.data?.data?.result || response.data?.data || [];
    } catch { return []; }
  },

  getChildCategories: async () => {
      try {
        const response = await axiosInstance.get(`/super-admin/categories/child?limit=100`);
        return response.data?.data?.result || response.data?.data || [];
      } catch { return []; }
  },

  // Get Brands
  getBrands: async () => {
    // Assuming /brands endpoint exists, otherwise return empty
    try {
        const response = await axiosInstance.get(`/super-admin/brands?limit=100`);
        return response.data?.data?.result || response.data?.data || [];
    } catch {
        return [];
    }
  },

  // Get Business Units (if needed for selection)
  getBusinessUnits: async () => {
    const response = await axiosInstance.get(`/super-admin/business-unit`);
    return response.data?.data || [];
  },

  // Get Taxes
  getTaxes: async () => {
    try {
        const response = await axiosInstance.get(`/super-admin/taxes?limit=100`);
        return response.data?.data?.result || response.data?.data || [];
    } catch {
        return [];
    }
  }
};
