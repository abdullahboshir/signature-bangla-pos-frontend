import { tagTypes } from "../tag-types";
import { baseApi } from "./base/baseApi";

const categoryApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    createCategory: build.mutation({
      query: (data: unknown) => ({
        url: "/category/createCategory",
        method: "POST",
        contentType: "application/json",
        data,
      }),
      invalidatesTags: [tagTypes.category],
    }),
    getCategories: build.query({
      query: (departmentId: string) => ({
        url: `/category/${departmentId}/getCategories`,
        method: "GET",
      }),
      providesTags: [tagTypes.category],
    }),
    getCategory: build.query({
      query: (id: string) => ({
        url: `/category/${id}`,
        method: "GET",
      }),
      providesTags: [tagTypes.category],
    }),
    updateCategory: build.mutation({
      query: (data: { id: string; body: unknown }) => ({
        url: `/category/${data?.id}`,
        method: "PATCH",
        contentType: "application/json",
        data: data.body,
      }),
      invalidatesTags: [tagTypes.category],
    }),
    deleteCategory: build.mutation({
      query: (id: string) => ({
        url: `/category/${id}`,
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
