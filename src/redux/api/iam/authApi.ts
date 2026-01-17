import { baseApi } from "../base/baseApi";
import { tagTypes } from "../../tag-types";

const authApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    login: build.mutation({
      query: (data: { email: string; password: string }) => ({
        url: "/auth/login",
        method: "POST",
        contentType: "application/json",
        data,
      }),
      invalidatesTags: [tagTypes.auth],
    }),
    userRegister: build.mutation({
      query: (data: unknown) => ({
        url: "/auth/register",
        method: "POST",
        contentType: "application/json",
        data,
      }),
      invalidatesTags: [tagTypes.auth],
    }),
    logout: build.mutation({
      query: () => ({
        url: "/auth/logout",
        method: "POST",
        contentType: "application/json",
      }),
      invalidatesTags: [tagTypes.auth],
    }),
    refreshToken: build.mutation({
      query: () => ({
        url: "/auth/refresh-token",
        method: "POST",
        withCredentials: true,
      }),
    }),
    getMe: build.query({
      query: (params) => ({
        url: "/auth/me",
        method: "GET",
        params,
      }),
      providesTags: [tagTypes.auth],
      // ApiResponse format: { success, statusCode, message, data, timestamp }
      transformResponse: (response: any) => {
        console.log("GetMe Raw Response:", response);
        const result = response?.data || response;
        console.log("GetMe Transformed Data:", result);
        return result;
      },
    }),
    // Setup Password for new Organization Owners
    setupPassword: build.mutation({
      query: (data: { token: string; password: string }) => ({
        url: "/auth/setup-password",
        method: "POST",
        contentType: "application/json",
        data,
      }),
    }),
    // Resend Setup Invitation
    resendSetupInvitation: build.mutation({
      query: (data: { email: string }) => ({
        url: "/auth/resend-setup-invitation",
        method: "POST",
        contentType: "application/json",
        data,
      }),
    }),
  }),
});

export const {
  useLoginMutation,
  useUserRegisterMutation,
  useLogoutMutation,
  useRefreshTokenMutation,
  useGetMeQuery,
  useSetupPasswordMutation,
  useResendSetupInvitationMutation,
} = authApi;
