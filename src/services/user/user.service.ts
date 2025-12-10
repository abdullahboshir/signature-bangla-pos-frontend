import { axiosInstance } from "@/lib/axios/axiosInstance";

export const userService = {
  // Get all users
  getAll: async (params?: any) => {
    const res = await axiosInstance.get("/super-admin/users", { params });
    return res?.data?.data || [];
  },

  // Get single user
  getById: async (id: string) => {
    const res = await axiosInstance.get(`/super-admin/users/${id}`);
    return res?.data?.data || null;
  },

  // Create user
  create: async (userData: any) => {
    const res = await axiosInstance.post("/super-admin/users/create", userData);
    return res?.data || null;
  },

  // Update user
  update: async (id: string, userData: any) => {
    const res = await axiosInstance.patch(`/super-admin/users/${id}`, userData);
    return res?.data || null;
  },

  // Delete user
  delete: async (id: string) => {
    const res = await axiosInstance.delete(`/super-admin/users/${id}`);
    return res?.data || null;
  }
};

export const roleService = {
  // Get all roles
  getAll: async (params?: any) => {
    const res = await axiosInstance.get("/super-admin/role", { params });
    return res?.data?.data || [];
  },

  // Get single role
  getById: async (id: string) => {
    const res = await axiosInstance.get(`/super-admin/role/${id}`);
    return res?.data?.data || null;
  }
};
