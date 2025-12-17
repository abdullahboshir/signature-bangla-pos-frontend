import { tagTypes } from "../tag-types";
import { baseApi } from "./base/baseApi";

const childCategoryApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    createChildCategory: build.mutation({
      query: (data: any) => ({
        url: "/super-admin/categories/child/create",
        method: "POST",
        contentType: "application/json",
        data,
      }),
      transformResponse: (response: any) => response.data,
      invalidatesTags: [tagTypes.childCategory],
    }),
    getChildCategories: build.query({
      query: (params: any) => ({
        url: `/super-admin/categories/child`,
        method: "GET",
        params,
      }),
      transformResponse: (response: any) => response.data,
      providesTags: [tagTypes.childCategory],
    }),
    getChildCategoriesByParent: build.query({
      query: (subCategoryId: string) => ({
        url: `/super-admin/categories/child/${subCategoryId}/getChildCategories`,
        method: "GET",
      }),
      transformResponse: (response: any) => response.data,
      providesTags: [tagTypes.childCategory],
    }),
    getChildCategory: build.query({
      query: (id: string) => ({
        url: `/super-admin/categories/child/${id}`,
        method: "GET",
      }),
      transformResponse: (response: any) => response.data,
      providesTags: [tagTypes.childCategory],
    }),
    updateChildCategory: build.mutation({
      query: (data: { id: string; body: any }) => ({
        url: `/super-admin/categories/child/${data.id}`,
        method: "PATCH",
        contentType: "application/json",
        data: data.body,
      }),
      transformResponse: (response: any) => response.data,
      invalidatesTags: [tagTypes.childCategory],
    }),
    deleteChildCategory: build.mutation({
      query: (id: string) => ({
        url: `/super-admin/categories/child/${id}`,
        method: "DELETE",
      }),
      transformResponse: (response: any) => response.data,
      invalidatesTags: [tagTypes.childCategory],
    }),
  }),
});

export const { 
  useCreateChildCategoryMutation, 
  useGetChildCategoriesQuery,
  useGetChildCategoriesByParentQuery,
  useGetChildCategoryQuery,
  useUpdateChildCategoryMutation,
  useDeleteChildCategoryMutation
} = childCategoryApi;
