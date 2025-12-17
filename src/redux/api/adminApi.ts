import { tagTypes } from "../tag-types";
import { baseApi } from "./base/baseApi";

const adminApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    // User Management
    getUsers: build.query({
      query: () => ({
        url: "/super-admin/users/getUsers",
        method: "GET",
      }),
      transformResponse: (response: any) => response.data,
      providesTags: [tagTypes.admin],
    }),
    getUser: build.query({
      query: (id: string) => ({
        url: `/admin/users/${id}`,
        method: "GET",
      }),
      transformResponse: (response: any) => response.data,
      providesTags: [tagTypes.admin],
    }),
    createUser: build.mutation({
      query: (data: unknown) => ({
        url: "/admin/users",
        method: "POST",
        contentType: "application/json",
        data,
      }),
      invalidatesTags: [tagTypes.admin],
    }),
    updateUser: build.mutation({
      query: (data: { id: string; body: unknown }) => ({
        url: `/admin/users/${data.id}`,
        method: "PATCH",
        contentType: "application/json",
        data: data.body,
      }),
      invalidatesTags: [tagTypes.admin],
    }),
    deleteUser: build.mutation({
      query: (id: string) => ({
        url: `/admin/users/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [tagTypes.admin],
    }),

    // Business Unit Management
    getBusinessUnits: build.query({
      query: () => ({
        url: "/super-admin/business-unit",
        method: "GET",
      }),
      transformResponse: (response: any) => response.data,
      providesTags: [tagTypes.admin],
    }),
    getBusinessUnit: build.query({
      query: (id: string) => ({
        url: `/admin/business-units/${id}`,
        method: "GET",
      }),
      transformResponse: (response: any) => response.data,
      providesTags: [tagTypes.admin],
    }),
    createBusinessUnit: build.mutation({
      query: (data: unknown) => ({
        url: "/admin/business-units",
        method: "POST",
        contentType: "application/json",
        data,
      }),
      invalidatesTags: [tagTypes.admin],
    }),
    updateBusinessUnit: build.mutation({
      query: (data: { id: string; body: unknown }) => ({
        url: `/admin/business-units/${data.id}`,
        method: "PATCH",
        contentType: "application/json",
        data: data.body,
      }),
      invalidatesTags: [tagTypes.admin],
    }),
    deleteBusinessUnit: build.mutation({
      query: (id: string) => ({
        url: `/admin/business-units/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [tagTypes.admin],
    }),
  }),
});

export const {
  useGetUsersQuery,
  useGetUserQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
  useGetBusinessUnitsQuery,
  useGetBusinessUnitQuery,
  useCreateBusinessUnitMutation,
  useUpdateBusinessUnitMutation,
  useDeleteBusinessUnitMutation,
} = adminApi;
