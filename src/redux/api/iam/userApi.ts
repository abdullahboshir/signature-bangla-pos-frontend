import { tagTypes } from "../../tag-types";
import { baseApi } from "../base/baseApi";

const userApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    // Profile
    getAllUsers: build.query({
      query: (params) => ({
        url: "/super-admin/users/all-users",
        method: "GET",
        params,
      }),
      transformResponse: (response: any) => {
        if (Array.isArray(response)) return response;
        if (response?.data?.data && Array.isArray(response.data.data)) return response.data.data;
        if (response?.data && Array.isArray(response.data)) return response.data;
        if (response?.result && Array.isArray(response.result)) return response.result;
        return [];
      },
      providesTags: [tagTypes.user],
    }),
    getSingleUser: build.query({
      query: (id: string) => ({
        url: `/super-admin/users/${id}`,
        method: "GET",
      }),
      providesTags: (result, error, id) => [{ type: tagTypes.user, id }],
    }),
    createUser: build.mutation({
      query: (data) => ({
        url: "/super-admin/users/create",
        method: "POST",
        data,
      }),
      invalidatesTags: [tagTypes.user],
    }),
    updateUser: build.mutation({
      query: ({ id, data }: { id: string; data: any }) => ({
        url: `/super-admin/users/${id}`,
        method: "PATCH",
        data, // data can be FormData or JSON
        headers: data instanceof FormData ? { "Content-Type": "multipart/form-data" } : undefined,
      }),
      invalidatesTags: (result, error, arg) => [
        tagTypes.user, // Invalidate the list
        { type: tagTypes.user, id: arg.id } // Invalidate the specific item
      ],
    }),
    updateProfile: build.mutation({
      query: (data: any) => ({
        url: `/super-admin/users/profile`,
        method: "PATCH",
        data,
        headers: { "Content-Type": "multipart/form-data" },
      }),
      invalidatesTags: [tagTypes.user, tagTypes.auth], // Update auth state too if possible, but mostly user list
    }),
    deleteUser: build.mutation({
      query: (id: string) => ({
        url: `/super-admin/users/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [tagTypes.user],
    }),
    
    // Auth & Profile
    getProfile: build.query({
      query: () => ({
        url: "/auth/me",
        method: "GET",
      }),
      providesTags: [tagTypes.auth],
    }),
    changePassword: build.mutation({
      query: (data: { currentPassword: string; newPassword: string }) => ({
        url: "/user/change-password",
        method: "POST",
        contentType: "application/json",
        data,
      }),
    }),

    // Settings
    getSettings: build.query({
      query: () => ({
        url: "/user/settings",
        method: "GET",
      }),
      providesTags: [tagTypes.auth],
    }),
    updateSettings: build.mutation({
      query: (data: unknown) => ({
        url: "/user/settings",
        method: "PATCH",
        contentType: "application/json",
        data,
      }),
      invalidatesTags: [tagTypes.auth],
    }),
  }),
});

export const {
  useGetProfileQuery,
  useGetAllUsersQuery,
  useGetSingleUserQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
  useUpdateProfileMutation,
  useChangePasswordMutation,
  useGetSettingsQuery,
  useUpdateSettingsMutation,
} = userApi;


