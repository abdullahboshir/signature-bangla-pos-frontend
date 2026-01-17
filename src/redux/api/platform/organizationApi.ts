import { API_ENDPOINTS } from "@/config/api-endpoints";
import { baseApi as apiSlice } from "../base/baseApi";
import { tagTypes } from "@/redux/tag-types";

export const organizationApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllOrganizations: builder.query({
      query: (params) => ({
        url: API_ENDPOINTS.PLATFORM.ORGANIZATIONS,
        method: "GET",
        params,
      }),
      providesTags: [tagTypes.organization],
    }),
    getOrganization: builder.query({
      query: (id) => ({
        url: `${API_ENDPOINTS.PLATFORM.ORGANIZATIONS}/${id}`,
        method: "GET",
      }),
      providesTags: [tagTypes.organization],
    }),
    createOrganization: builder.mutation({
      query: (data) => ({
        url: API_ENDPOINTS.PLATFORM.ORGANIZATIONS,
        method: "POST",
        data: data,
      }),
      invalidatesTags: [tagTypes.organization],
    }),
    updateOrganization: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `${API_ENDPOINTS.PLATFORM.ORGANIZATIONS}/${id}`,
        method: "PUT",
        data: data,
      }),
      invalidatesTags: [tagTypes.organization],
      invalidatesTags: [tagTypes.organization],
    }),
    updateOrganizationTenantConfig: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `${API_ENDPOINTS.PLATFORM.ORGANIZATIONS}/${id}/tenant-config`,
        method: "PATCH",
        data: data,
      }),
      invalidatesTags: [tagTypes.organization],
    }),
    getOrganizationDashboardStats: builder.query({
      query: (companyId: string) => ({
        url: `${API_ENDPOINTS.PLATFORM.ORGANIZATIONS}/${companyId}/dashboard`,
        method: "GET",
      }),
      transformResponse: (response: any) => response.data,
      providesTags: (result, error, arg) => [
        { type: tagTypes.organization, id: arg },
      ],
    }),
  }),
});

export const {
  useGetAllOrganizationsQuery,
  useGetOrganizationQuery,
  useCreateOrganizationMutation,
  useUpdateOrganizationMutation,
  useGetOrganizationDashboardStatsQuery,
  useUpdateOrganizationTenantConfigMutation,
} = organizationApi;
