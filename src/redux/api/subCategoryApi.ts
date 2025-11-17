import { tagTypes } from "../tag-types";
import { baseApi } from "./base/baseApi";

const subCategoryApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    createSubCategory: build.mutation({
      query: (data: unknown) => ({
        url: "/subCategory/createSubCategory",
        method: "POST",
        contentType: "application/json",
        data,
      }),
      invalidatesTags: [tagTypes.subCategory],
    }),
    getSubCategories: build.query({
      query: (categoryId: string) => ({
        url: `/subCategory/${categoryId}/getSubCategories`,
        method: "GET",
      }),
      providesTags: [tagTypes.subCategory],
    }),
    getSubCategory: build.query({
      query: (id: string) => ({
        url: `/subCategory/${id}`,
        method: "GET",
      }),
      providesTags: [tagTypes.subCategory],
    }),
    updateSubCategory: build.mutation({
      query: (data: { id: string; body: unknown }) => ({
        url: `/subCategory/${data?.id}`,
        method: "PATCH",
        contentType: "application/json",
        data: data.body,
      }),
      invalidatesTags: [tagTypes.subCategory],
    }),
    deleteSubCategory: build.mutation({
      query: (id: string) => ({
        url: `/subCategory/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [tagTypes.subCategory],
    }),
  }),
});

export const { 
  useCreateSubCategoryMutation, 
  useGetSubCategoriesQuery,
  useGetSubCategoryQuery,
  useUpdateSubCategoryMutation,
  useDeleteSubCategoryMutation
} = subCategoryApi;
