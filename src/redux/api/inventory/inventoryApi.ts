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
  }),
});

export const {
  useCreateInventoryMutation,
  useGetInventorysQuery,
  useGetInventoryQuery,
  useUpdateInventoryMutation,
  useDeleteInventoryMutation,
} = hooks;

export const { useGetLedgerQuery } = injectedInventoryApi as any;

export default inventoryApi;


