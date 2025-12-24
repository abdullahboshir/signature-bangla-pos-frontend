import { baseApi } from "./base/baseApi";
import { tagTypes } from "../tag-types";

export const purchaseApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    createPurchase: build.mutation({
      query: (data) => ({
        url: "/super-admin/purchases/create",
        method: "POST",
        data,
      }),
      invalidatesTags: [tagTypes.purchase, tagTypes.product],
    }),
    getPurchases: build.query({
      query: (arg) => ({
        url: "/super-admin/purchases",
        method: "GET",
        params: arg,
      }),
      providesTags: [tagTypes.purchase],
    }),
    getPurchase: build.query({
      query: (id) => ({
        url: `/super-admin/purchases/${id}`,
        method: "GET",
      }),
      providesTags: [tagTypes.purchase],
    }),
    updatePurchase: build.mutation({
      query: (data) => ({
        url: `/super-admin/purchases/${data.id}`,
        method: "PATCH",
        data: data.body,
      }),
      invalidatesTags: [tagTypes.purchase, tagTypes.product],
    }),
    deletePurchase: build.mutation({
      query: (id) => ({
        url: `/super-admin/purchases/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [tagTypes.purchase, tagTypes.product],
    }),
  }),
});

export const {
  useCreatePurchaseMutation,
  useGetPurchasesQuery,
  useGetPurchaseQuery,
  useUpdatePurchaseMutation,
  useDeletePurchaseMutation,
} = purchaseApi;
