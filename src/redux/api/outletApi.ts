import { tagTypes } from "../tag-types";
import { baseApi } from "./base/baseApi";

export const outletApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    createOutlet: build.mutation({
      query: (data) => ({
        url: "/super-admin/outlets",
        method: "POST",
        data: data,
      }),
      invalidatesTags: [tagTypes.outlet],
    }),
    getAllOutlets: build.query({
      query: (arg: Record<string, any>) => ({
        url: "/super-admin/outlets",
        method: "GET",
        params: arg,
      }),
      providesTags: [tagTypes.outlet],
      transformResponse: (response: any) => response.data,
    }),
    getOutlet: build.query({
      query: (id: string) => ({
        url: `/super-admin/outlets/${id}`,
        method: "GET",
      }),
      providesTags: (result, error, id) => [{ type: tagTypes.outlet, id }],
      transformResponse: (response: any) => response.data,
    }),
    updateOutlet: build.mutation({
      query: (data) => ({
        url: `/super-admin/outlets/${data.id}`,
        method: "PATCH",
        data: data.body,
      }),
      invalidatesTags: (result, error, arg) => [
        tagTypes.outlet,
        { type: tagTypes.outlet, id: arg.id },
      ],
    }),
    deleteOutlet: build.mutation({
      query: (id) => ({
        url: `/super-admin/outlets/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [tagTypes.outlet],
    }),
  }),
});

export const {
  useCreateOutletMutation,
  useGetAllOutletsQuery,
  useGetOutletQuery,
  useUpdateOutletMutation,
  useDeleteOutletMutation,
} = outletApi;
