import { tagTypes } from "../tag-types";
import { baseApi } from "./base/baseApi";

export const taxApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    createTax: build.mutation({
      query: (data) => ({
        url: "/super-admin/taxes",
        method: "POST",
        data,
      }),
      invalidatesTags: [tagTypes.tax],
    }),
    getTaxes: build.query({
      query: (params) => ({
        url: "/super-admin/taxes",
        method: "GET",
        params,
      }),
      providesTags: [tagTypes.tax],
      transformResponse: (response: any) => response.data?.data?.result || response.data?.data || response.data?.result || response.data || [],
    }),
    getTax: build.query({
      query: (id: string) => ({
        url: `/super-admin/taxes/${id}`,
        method: "GET",
      }),
      
      providesTags: (result, error, id) => [{ type: tagTypes.tax, id }],
      transformResponse: (response: any) => response.data?.data || response.data,
    }),
    updateTax: build.mutation({
      query: (data) => ({
        url: `/super-admin/taxes/${data.id}`,
        method: "PATCH",
        data: data.body,
      }),
      invalidatesTags: [tagTypes.tax],
    }),
    deleteTax: build.mutation({
      query: (id: string) => ({
        url: `/super-admin/taxes/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [tagTypes.tax],
    }),
  }),
});

export const {
  useCreateTaxMutation,
  useGetTaxesQuery,
  useGetTaxQuery,
  useUpdateTaxMutation,
  useDeleteTaxMutation,
} = taxApi;
