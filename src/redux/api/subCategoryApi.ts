import { tagTypes } from "../tag-types";
import { baseApi } from "./base/baseApi";

const subCategoryApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    createSubCategory: build.mutation({
      query: (data: any) => ({
        url: "/super-admin/categories/sub/create",
        method: "POST",
        contentType: "application/json",
        data,
      }),
      transformResponse: (response: any) => response.data,
      invalidatesTags: [tagTypes.subCategory],
    }),
    getSubCategories: build.query({
      query: (params: any) => ({
        url: `/super-admin/categories/sub`,
        method: "GET",
        params,
      }),
      transformResponse: (response: any) => response.data?.data?.result || response.data?.data || response.data?.result || response.data || [],
      providesTags: [tagTypes.subCategory],
    }),
    getSubCategoriesByParent: build.query({
      query: (categoryId: string) => ({
        url: `/super-admin/categories/sub/${categoryId}/getSubCategories`,
        method: "GET",
      }),
      transformResponse: (response: any) => response.data?.data?.result || response.data?.data || response.data?.result || response.data || [],
      providesTags: [tagTypes.subCategory],
    }),
    getSubCategory: build.query({
      query: (id: string) => ({
        url: `/super-admin/categories/sub/${id}`,
        method: "GET",
      }),
      transformResponse: (response: any) => response.data,
      providesTags: [tagTypes.subCategory],
    }),
    updateSubCategory: build.mutation({
      query: (data: { id: string; body: any }) => ({
        url: `/super-admin/categories/sub/${data.id}`,
        method: "PATCH",
        contentType: "application/json",
        data: data.body,
      }),
      transformResponse: (response: any) => response.data,
      invalidatesTags: [tagTypes.subCategory],
    }),
    deleteSubCategory: build.mutation({
      query: (id: string) => ({
        url: `/super-admin/categories/sub/${id}`,
        method: "DELETE",
      }),
      transformResponse: (response: any) => response.data,
      invalidatesTags: [tagTypes.subCategory],
    }),
  }),
});

export const { 
  useCreateSubCategoryMutation, 
  useGetSubCategoriesQuery,
  useGetSubCategoriesByParentQuery,
  useGetSubCategoryQuery,
  useUpdateSubCategoryMutation,
  useDeleteSubCategoryMutation
} = subCategoryApi;
