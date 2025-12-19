import { tagTypes } from "../tag-types";
import { baseApi } from "./base/baseApi";

export const orderApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    createOrder: build.mutation({
      query: (data) => ({
        url: "/super-admin/orders/create",
        method: "POST",
        data,
      }),
      invalidatesTags: [tagTypes.order],
    }),
    
    getOrders: build.query({
      query: (params) => ({
        url: "/super-admin/orders",
        method: "GET",
        params,
      }),
      providesTags: [tagTypes.order],
      transformResponse: (response: any) => response.data?.data?.result || response.data?.data || response.data?.result || response.data || [],
    }),

    getOrder: build.query({
      query: (id: string) => ({
        url: `/super-admin/orders/${id}`,
        method: "GET",
      }),
      providesTags: (result, error, id) => [{ type: tagTypes.order, id }],
      transformResponse: (response: any) => response.data?.data || response.data,
    }),

    updateOrderStatus: build.mutation({
      query: ({ id, status }) => ({
        url: `/super-admin/orders/${id}/status`,
        method: "PATCH",
        data: { status },
      }),
      invalidatesTags: (result, error, arg) => [{ type: tagTypes.order, id: arg.id }],
    }),
  }),
});

export const {
  useCreateOrderMutation,
  useGetOrdersQuery,
  useGetOrderQuery,
  useUpdateOrderStatusMutation,
} = orderApi;
