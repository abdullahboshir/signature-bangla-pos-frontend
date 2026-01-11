import { tagTypes } from "../../tag-types";
import { createCrudApi } from "../base/createCrudApi";

const { api: outletApi, hooks } = createCrudApi({
  resourceName: 'outlet',
  baseUrl: '/super-admin/outlets',
  tagType: tagTypes.outlet,
});

export interface OutletStats {
  todaySales?: number;
  salesCount?: number;
  activeRegisters?: number;
  lowStockCount?: number;
  activeStaff?: number;
}

// Extend with custom endpoints and tag overrides
const extendedOutletApi = outletApi.injectEndpoints({
  endpoints: (build) => ({
    getOutletStats: build.query<OutletStats, string>({
      query: (id: string) => ({
        url: `/super-admin/outlets/${id}/stats`,
        method: "GET",
      }),
      providesTags: (result, error, id) => [{ type: tagTypes.outlet as any, id }], 
      transformResponse: (response: any) => response.data?.data || response.data || {},
    }),
    // Override create to also invalidate businessUnit
    createOutlet: build.mutation({
      query: (data) => ({
        url: '/super-admin/outlets',
        method: 'POST',
        contentType: 'application/json',
        data,
      }),
      invalidatesTags: [tagTypes.outlet as any, tagTypes.businessUnit as any],
    }),
    // Override update to also invalidate businessUnit
    updateOutlet: build.mutation({
      query: (data: any) => ({
        url: `/super-admin/outlets/${data.id}`,
        method: 'PATCH',
        contentType: 'application/json',
        data: data.body,
      }),
      invalidatesTags: [tagTypes.outlet as any, tagTypes.businessUnit as any],
    }),
    // Override delete to also invalidate businessUnit
    deleteOutlet: build.mutation({
      query: (id: any) => ({
        url: `/super-admin/outlets/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: [tagTypes.outlet as any, tagTypes.businessUnit as any],
    }),
  }),
  overrideExisting: true,
});

export const {
  useCreateOutletMutation,
  useGetOutletsQuery,
  useGetOutletQuery,
  useUpdateOutletMutation,
  useDeleteOutletMutation,
} = hooks;

export const { useGetOutletStatsQuery } = extendedOutletApi;

export default outletApi;


