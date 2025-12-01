import { tagTypes } from "../tag-types";
import { baseApi } from "./base/baseApi";

const userApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    // Profile
    getAllUsers: build.query({
      query: () => ({
        url: "/super-admin/users/all-users",
        method: "GET",
      }),
      providesTags: [tagTypes.user],
    }),
    getProfile: build.query({
      query: () => ({
        url: "/user/profile",
        method: "GET",
      }),
      providesTags: [tagTypes.auth],
    }),
    updateProfile: build.mutation({
      query: (data: unknown) => ({
        url: "/user/profile",
        method: "PATCH",
        contentType: "application/json",
        data,
      }),
      invalidatesTags: [tagTypes.auth],
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
  useUpdateProfileMutation,
  useChangePasswordMutation,
  useGetSettingsQuery,
  useUpdateSettingsMutation,
} = userApi;

