import { baseApi } from "./base/baseApi";
import { tagTypes } from "../tag-types";

export const supplierApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    createSupplier: build.mutation({
      query: (data) => ({
        url: "/super-admin/suppliers/create",
        method: "POST",
        data,
      }),
      invalidatesTags: [tagTypes.supplier],
    }),
    getSuppliers: build.query({
      query: (arg) => ({
        url: "/super-admin/suppliers",
        method: "GET",
        params: arg,
      }),
      providesTags: [tagTypes.supplier],
      transformResponse: (response: any) => response.data,
    }),
    getSupplier: build.query({
      query: (id) => ({
        url: `/super-admin/suppliers/${id}`,
        method: "GET",
      }),
      providesTags: [tagTypes.supplier],
      transformResponse: (response: any) => response.data,
    }),
    updateSupplier: build.mutation({
      query: (data) => ({
        url: `/super-admin/suppliers/${data.id}`,
        method: "PATCH",
        data: data.body,
      }),
      invalidatesTags: [tagTypes.supplier],
    }),
    deleteSupplier: build.mutation({
      query: (id) => ({
        url: `/super-admin/suppliers/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [tagTypes.supplier],
    }),
  }),
});

export const {
  useCreateSupplierMutation,
  useGetSuppliersQuery,
  useGetSupplierQuery,
  useUpdateSupplierMutation,
  useDeleteSupplierMutation,
} = supplierApi;
