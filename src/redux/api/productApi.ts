import { tagTypes } from "../tag-types";
import { baseApi } from "./base/baseApi";

export const productApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    createProduct: build.mutation({
      query: (data) => ({
        url: "/super-admin/products/create",
        method: "POST",
        data: data,
      }),
      invalidatesTags: [tagTypes.product],
    }),

    getProducts: build.query({
      query: (params) => ({
        url: "/super-admin/products",
        method: "GET",
        params,
      }),
      providesTags: [tagTypes.product],
      transformResponse: (response: any) => response.data?.data?.result || response.data?.data || response.data?.result || response.data || [],
    }),

    getProduct: build.query({
      query: (id: string) => ({
        url: `/super-admin/products/${id}`,
        method: "GET",
      }),
      providesTags: (result, error, id) => [{ type: tagTypes.product, id }],
      transformResponse: (response: any) => response.data?.data || response.data,
    }),

    updateProduct: build.mutation({
      query: (data) => ({
        url: `/super-admin/products/${data.id}`,
        method: "PATCH",
        data: data.body,
      }),
      invalidatesTags: [tagTypes.product],
    }),

    deleteProduct: build.mutation({
      query: (id: string) => ({
        url: `/super-admin/products/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [tagTypes.product],
    }),

    // Helper endpoints currently in productService



  }),
});

export const {
  useCreateProductMutation,
  useGetProductsQuery,
  useGetProductQuery,
  useUpdateProductMutation,
  useDeleteProductMutation,

} = productApi;
