import { tagTypes } from "../../tag-types";
import { baseApi } from "../base/baseApi";

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



    // Business Unit Management
    // Business Unit Management - Removed duplicates covered by businessUnitApi
    getBusinessUnit: build.query({
      query: (id: string) => ({
        url: `/admin/business-units/${id}`,
        method: "GET",
      }),
      transformResponse: (response: any) => response.data,
      providesTags: [tagTypes.admin],
    }),

    // Dashboard & Analytics
    getDashboardStats: build.query({
      query: () => ({
        url: "/super-admin/dashboard/stats",
        method: "GET",
      }),
      transformResponse: (response: any) => response.data || response.data?.data,
      providesTags: [tagTypes.admin],
    }),
    getAnalytics: build.query({
      // Mocking response for now as per service behavior
      queryFn: async () => ({ data: { revenue: [], users: [], sales: [] } }),
    }),
  }),
});

export const {
  useGetUsersQuery,
  useGetUserQuery,
  useGetDashboardStatsQuery,
  useGetAnalyticsQuery,
} = adminApi;

