import { tagTypes } from "../../tag-types";
import { createCrudApi } from "../base/createCrudApi";

const { api: inventoryApi, hooks } = createCrudApi({
  resourceName: 'inventory',
  baseUrl: '/super-admin/inventory',
  tagType: tagTypes.inventory,
});

// Basic type for Ledger response - refine as needed
interface LedgerResponse {
  data: any[];
  meta?: any;
}

const injectedInventoryApi = inventoryApi.injectEndpoints({
  endpoints: (build) => ({
    getLedger: build.query<LedgerResponse, void | object>({
      query: (params) => ({
        url: '/ledger',
        method: 'GET',
        params,
      }),
      providesTags: [tagTypes.inventory],
    }),
    createAdjustment: build.mutation({
      query: (data) => ({
        url: '/adjustments',
        method: 'POST',
        data,
      }),
      invalidatesTags: [tagTypes.inventory, tagTypes.product],
    }),
  }),
});

export const {
  useCreateInventoryMutation,
  useGetInventorysQuery,
  useGetInventoryQuery,
  useUpdateInventoryMutation,
  useDeleteInventoryMutation,
} = hooks;

export const { useGetLedgerQuery, useCreateAdjustmentMutation } = injectedInventoryApi as any;

export default inventoryApi;


