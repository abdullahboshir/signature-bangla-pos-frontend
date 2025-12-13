
import { axiosInstance } from "@/lib/axios/axiosInstance";

export const unitService = {
  getAll: async (params?: any) => {
    try {
        const response = await axiosInstance.get(`/super-admin/units`, { params });
        return response.data?.data?.result || response.data?.data || [];
    } catch {
        return [];
    }
  },
};
