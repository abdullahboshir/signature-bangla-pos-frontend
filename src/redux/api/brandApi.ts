
import { tagTypes } from "../tag-types";
import { baseApi } from "./base/baseApi";

const brandApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    createBrand: build.mutation({
      query: (data) => ({
        url: "/super-admin/brands",
        method: "POST",
        contentType: "application/json",
        data,
      }),
      transformResponse: (response: any) => response.data,
      invalidatesTags: [tagTypes.brand],
    }),
    getBrands: build.query({
      query: (params) => ({
        url: "/super-admin/brands",
        method: "GET",
        params,
      }),
      transformResponse: (response: any) => response.data,
      providesTags: [tagTypes.brand],
    }),
    getBrand: build.query({
      query: (id) => ({
        url: `/super-admin/brands/${id}`,
        method: "GET",
      }),
      transformResponse: (response: any) => response.data,
      providesTags: [tagTypes.brand],
    }),
    updateBrand: build.mutation({
      query: (data) => ({
        url: `/super-admin/brands/${data.id}`,
        method: "PATCH",
        contentType: "application/json",
        data: data.body,
      }),
      transformResponse: (response: any) => response.data,
      invalidatesTags: [tagTypes.brand],
    }),
    deleteBrand: build.mutation({
      query: (id) => ({
        url: `/super-admin/brands/${id}`,
        method: "DELETE",
      }),
      transformResponse: (response: any) => response.data,
      invalidatesTags: [tagTypes.brand],
    }),
  }),
});

export const {
  useCreateBrandMutation,
  useGetBrandsQuery,
  useGetBrandQuery,
  useUpdateBrandMutation,
  useDeleteBrandMutation,
} = brandApi;
