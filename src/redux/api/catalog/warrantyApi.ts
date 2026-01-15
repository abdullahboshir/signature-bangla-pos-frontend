import { tagTypes } from "@/redux/tag-types";
import { baseApi } from "../base/baseApi";

export const warrantyApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getWarranties: builder.query<any, any>({
      query: (params) => ({
        url: "/super-admin/warranties",
        params,
      }),
      transformResponse: (response: any) => {
        return response.data || response.result || [];
      },
      providesTags: [tagTypes.warranty],
    }),
    getSingleWarranty: builder.query<any, string>({
      query: (id) => `/super-admin/warranties/${id}`,
      transformResponse: (response: any) => {
        return response.data || response;
      },
      providesTags: (result, error, id) => [{ type: tagTypes.warranty, id }],
    }),
    createWarranty: builder.mutation<any, any>({
      query: (data) => ({
        url: "/super-admin/warranties",
        method: "POST",
        data,
      }),
      invalidatesTags: [tagTypes.warranty],
    }),
    updateWarranty: builder.mutation<any, { id: string; body: any }>({
      query: ({ id, body }) => ({
        url: `/super-admin/warranties/${id}`,
        method: "PATCH",
        data: body,
      }),
      invalidatesTags: (result, error, { id }) => [
        tagTypes.warranty,
        { type: tagTypes.warranty, id },
      ],
    }),
    deleteWarranty: builder.mutation<any, string>({
      query: (id) => ({
        url: `/super-admin/warranties/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [tagTypes.warranty],
    }),
  }),
});

export const {
  useGetWarrantiesQuery,
  useGetSingleWarrantyQuery,
  useCreateWarrantyMutation,
  useUpdateWarrantyMutation,
  useDeleteWarrantyMutation,
} = warrantyApi;
