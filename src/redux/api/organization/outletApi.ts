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

// Extend with custom endpoints
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
  }),
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


