import { tagTypes } from "../../tag-types";
import { baseApi } from "../base/baseApi";

export const businessUnitApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getBusinessUnits: build.query({
      query: (params) => ({
        url: "/super-admin/business-unit",
        method: "GET",
        params,
      }),
      transformResponse: (response: any) => {
        // Handle various response structures and ensure array return
        const data = response?.data?.data || response?.data || response;
        return Array.isArray(data) ? data : [];
      },
      providesTags: [tagTypes.businessUnit],
    }),
    getBusinessUnitById: build.query({
      query: (id) => ({
        url: `/super-admin/business-unit/${id}`,
        method: "GET",
      }),
      transformResponse: (response: any) => {
          // Handle nested structure observed in edit page
           // API returns { success: ..., data: { success: ..., data: { branding: ... } } }
           const nestedData = response?.data?.data ? response.data.data : (response?.data || response);
           return nestedData;
      },
      providesTags: [tagTypes.businessUnit],
    }),
    createBusinessUnit: build.mutation({
      query: (data) => ({
        url: "/super-admin/business-unit/create",
        method: "POST",
        contentType: "application/json",
        data,
      }),
      invalidatesTags: [tagTypes.businessUnit, tagTypes.auth],
    }),
    updateBusinessUnit: build.mutation({
      query: (data) => ({
        url: `/super-admin/business-unit/${data.id}`,
        method: "PATCH",
        contentType: "application/json",
        data: data.body,
      }),
      invalidatesTags: [tagTypes.businessUnit, tagTypes.auth],
    }),
    deleteBusinessUnit: build.mutation({
      query: (id) => ({
        url: `/super-admin/business-unit/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [tagTypes.businessUnit, tagTypes.auth],
    }),
    getBusinessUnitDashboardStats: build.query({
      query: ({ businessUnitId, outletId }: { businessUnitId: string; outletId?: string }) => ({
        url: `/super-admin/business-unit/${businessUnitId}/dashboard`,
        method: "GET",
        params: { outletId },
      }),
      providesTags: (result, error, arg) => [{ type: tagTypes.businessUnit, id: arg.businessUnitId }],
      transformResponse: (response: any) => response.data,
    }),
  }),
});

export const {
  useGetBusinessUnitsQuery,
  useGetBusinessUnitByIdQuery,
  useCreateBusinessUnitMutation,
  useUpdateBusinessUnitMutation,
  useDeleteBusinessUnitMutation,
  useGetBusinessUnitDashboardStatsQuery,
} = businessUnitApi;

