import { axiosInstance } from "@/lib/axios/axiosInstance";
import { CreateOrderPayload, IOrder } from "./order.types";

export const OrderService = {
    getAllOrders: async (query: any = {}) => {
        const response = await axiosInstance.get("/super-admin/orders", { params: query });
        return response as any;
    },

    getOrderById: async (id: string) => {
        const response = await axiosInstance.get(`/super-admin/orders/${id}`);
        return response as any;
    },

    createOrder: async (data: CreateOrderPayload) => {
        const response = await axiosInstance.post("/super-admin/orders/create", data);
        return response as any;
    },

    updateStatus: async (id: string, status: string) => {
        const response = await axiosInstance.patch(`/super-admin/orders/${id}/status`, { status });
        return response as any;
    }
};
