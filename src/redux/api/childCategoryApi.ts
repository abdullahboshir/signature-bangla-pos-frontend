import { tagTypes } from "../tag-types";
import { baseApi } from "./base/baseApi";

const childCategoryApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    createChildCategory: build.mutation({
      query: (data: unknown) => ({
        url: "/childCategory/createChildCategory",
        method: "POST",
        contentType: "application/json",
        data,
      }),
      invalidatesTags: [tagTypes.childCategory],
    }),
    getChildCategories: build.query({
      query: (subCategoryId: string) => ({
        url: `/childCategory/${subCategoryId}/getChildCategories`,
        method: "GET",
      }),
      providesTags: [tagTypes.childCategory],
    }),
    getChildCategory: build.query({
      query: (id: string) => ({
        url: `/childCategory/${id}`,
        method: "GET",
      }),
      providesTags: [tagTypes.childCategory],
    }),
    updateChildCategory: build.mutation({
      query: (data: { id: string; body: unknown }) => ({
        url: `/childCategory/${data?.id}`,
        method: "PATCH",
        contentType: "application/json",
        data: data.body,
      }),
      invalidatesTags: [tagTypes.childCategory],
    }),
    deleteChildCategory: build.mutation({
      query: (id: string) => ({
        url: `/childCategory/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [tagTypes.childCategory],
    }),
  }),
});

export const { 
  useCreateChildCategoryMutation, 
  useGetChildCategoriesQuery,
  useGetChildCategoryQuery,
  useUpdateChildCategoryMutation,
  useDeleteChildCategoryMutation
} = childCategoryApi;
