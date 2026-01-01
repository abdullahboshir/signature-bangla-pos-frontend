import { tagTypes } from "../../tag-types";
import { baseApi } from "../base/baseApi";

const categoryApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    createCategory: build.mutation({
      query: (data: any) => ({
        url: "/super-admin/categories/create",
        method: "POST",
        // Don't set contentType - let browser set multipart/form-data for FormData
        data,
      }),
      invalidatesTags: [tagTypes.category],
    }),
    getCategories: build.query({
      query: (params: any) => ({
        url: `/super-admin/categories`,
        method: "GET",
        params,
      }),
      // ApiResponse format: { success, statusCode, message, data, pagination?, timestamp }
      transformResponse: (response: any) => {
        // Extract data from ApiResponse wrapper
        return response?.data || [];
      },
      providesTags: [tagTypes.category],
    }),
    getCategory: build.query({
      query: (id: string) => ({
        url: `/super-admin/categories/${id}`,
        method: "GET",
      }),
      transformResponse: (response: any) => response.data?.data || response.data,
      providesTags: [tagTypes.category],
    }),
    updateCategory: build.mutation({
      query: (data: { id: string; body: any }) => ({
        url: `/super-admin/categories/${data.id}`,
        method: "PATCH",
        // Don't set contentType for FormData
        data: data.body,
      }),
      invalidatesTags: [tagTypes.category],
    }),
    deleteCategory: build.mutation({
      query: (id: string) => ({
        url: `/super-admin/categories/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [tagTypes.category],
    }),
  }),
});

export const { 
  useCreateCategoryMutation, 
  useGetCategoriesQuery,
  useGetCategoryQuery,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation
} = categoryApi;

