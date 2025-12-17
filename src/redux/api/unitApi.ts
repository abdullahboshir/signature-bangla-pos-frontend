
import { tagTypes } from "../tag-types";
import { baseApi } from "./base/baseApi";

const unitApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    createUnit: build.mutation({
      query: (data) => ({
        url: "/super-admin/units",
        method: "POST",
        contentType: "application/json",
        data,
      }),
      transformResponse: (response: any) => response.data,
      invalidatesTags: [tagTypes.unit],
    }),
    getUnits: build.query({
      query: (params) => ({
        url: "/super-admin/units",
        method: "GET",
        params,
      }),
      transformResponse: (response: any) => response.data,
      providesTags: [tagTypes.unit],
    }),
    getUnit: build.query({
      query: (id) => ({
        url: `/super-admin/units/${id}`,
        method: "GET",
      }),
      transformResponse: (response: any) => response.data,
      providesTags: [tagTypes.unit],
    }),
    updateUnit: build.mutation({
      query: (data) => ({
        url: `/super-admin/units/${data.id}`,
        method: "PATCH",
        contentType: "application/json",
        data: data.body,
      }),
      transformResponse: (response: any) => response.data,
      invalidatesTags: [tagTypes.unit],
    }),
    deleteUnit: build.mutation({
      query: (id) => ({
        url: `/super-admin/units/${id}`,
        method: "DELETE",
      }),
      transformResponse: (response: any) => response.data,
      invalidatesTags: [tagTypes.unit],
    }),
  }),
});

export const {
  useCreateUnitMutation,
  useGetUnitsQuery,
  useGetUnitQuery,
  useUpdateUnitMutation,
  useDeleteUnitMutation,
} = unitApi;
