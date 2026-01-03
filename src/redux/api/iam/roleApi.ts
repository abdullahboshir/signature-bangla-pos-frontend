import { tagTypes } from "../../tag-types";
import { baseApi } from "../base/baseApi";

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
      invalidatesTags: [tagTypes.role],
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
            url: "/super-admin/permission",
            method: "GET",
            params,
        }),
        providesTags: [tagTypes.permission],
        transformResponse: (response: any) => response.data?.data || response.data || [],
    }),
    getPermissionResources: build.query({
      query: () => ({
        url: "/super-admin/permission/resources",
        method: "GET",
      }),
      transformResponse: (response: any) => response.data?.data || response.data || [],
    }),

    // Permission Groups
    // Permission Groups
    getPermissionGroups: build.query({
      query: (params) => ({
        url: "/super-admin/permission-groups",
        method: "GET",
        params,
      }),
      providesTags: (result) => 
        result 
            ? [...(result.result || result).map(({ _id }: any) => ({ type: tagTypes.permissionGroup, id: _id })), { type: tagTypes.permissionGroup, id: 'LIST' }]
            : [{ type: tagTypes.permissionGroup, id: 'LIST' }],
      transformResponse: (response: any) => response.data?.data || response.data || {},
    }),
    createPermissionGroup: build.mutation({
      query: (data) => ({
        url: "/super-admin/permission-groups",
        method: "POST",
        data,
      }),
      invalidatesTags: [{ type: tagTypes.permissionGroup, id: 'LIST' }],
    }),
    updatePermissionGroup: build.mutation({
      query: ({ id, ...data }) => ({
        url: `/super-admin/permission-groups/${id}`,
        method: "PATCH",
        data,
      }),
      invalidatesTags: (result, error, arg) => [{ type: tagTypes.permissionGroup, id: arg.id }],
    }),
    deletePermissionGroup: build.mutation({
      query: (id: string) => ({
        url: `/super-admin/permission-groups/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: tagTypes.permissionGroup, id: 'LIST' }],
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
  useGetPermissionResourcesQuery,
  useGetPermissionGroupsQuery,
  useCreatePermissionGroupMutation,
  useUpdatePermissionGroupMutation,
  useDeletePermissionGroupMutation,
} = roleApi;

