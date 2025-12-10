import { axiosInstance } from "@/lib/axios/axiosInstance";

export const superAdminService = {
  // Dashboard Stats
  getDashboardStats: async () => {
    const res = await axiosInstance.get("/super-admin/dashboard/stats");
    return res?.data?.data || null;
  },

  // Analytics (placeholder for future)
  getAnalytics: async (params?: any) => {
    // TODO: Implement when analytics endpoint is ready
    return { revenue: [], users: [], sales: [] };
  },

  // Reports (placeholder for future)
  generateReport: async (reportType: string, params?: any) => {
    // TODO: Implement report generation
    return null;
  }
};
