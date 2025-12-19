import { tagTypes } from "../tag-types";
import { baseApi } from "./base/baseApi";

export const roleApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getRoles: build.query({
      query: (params) => ({
        url: "/super-admin/role",
        method: "GET",
        params,
      }),
      providesTags: [tagTypes.role],
      transformResponse: (response: any) => response.data?.data || response.data || [],
    }),
    getSingleRole: build.query({
      query: (id: string) => ({
        url: `/super-admin/role/${id}`,
        method: "GET",
      }),
      providesTags: (result, error, id) => [{ type: tagTypes.role, id }],
      transformResponse: (response: any) => response.data?.data || response.data,
    }),
    createRole: build.mutation({
      query: (data) => ({
        url: "/super-admin/role",
        method: "POST",
        data,
      }),
      invalidatesTags: [tagTypes.role],
    }),
    updateRole: build.mutation({
      query: ({ id, ...data }) => ({
        url: `/super-admin/role/${id}`,
        method: "PATCH",
        data,
      }),
      invalidatesTags: (result, error, arg) => [{ type: tagTypes.role, id: arg.id }],
    }),
    deleteRole: build.mutation({
      query: (id: string) => ({
        url: `/super-admin/role/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [tagTypes.role],
    }),

    // Permissions
    getPermissions: build.query({
        query: (params) => ({
            url: "/super-admin/permission?limit=1000",
            method: "GET",
            params,
        }),
        providesTags: [tagTypes.permission],
        transformResponse: (response: any) => response.data?.data || response.data || [],
    }),
  }),
});

export const {
  useGetRolesQuery,
  useGetSingleRoleQuery,
  useCreateRoleMutation,
  useUpdateRoleMutation,
  useDeleteRoleMutation,
  useGetPermissionsQuery,
} = roleApi;
