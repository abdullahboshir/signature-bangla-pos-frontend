import { tagTypes } from "../../tag-types";
import { createCrudApi } from "../base/createCrudApi";

const { api: inventoryApi, hooks } = createCrudApi({
  resourceName: "inventory",
  baseUrl: "/super-admin/inventory",
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
        url: "/ledger",
        method: "GET",
        params,
      }),
      providesTags: [tagTypes.inventory],
    }),
    createAdjustment: build.mutation({
      query: (data) => ({
        url: "/adjustments",
        method: "POST",
        data,
      }),
      invalidatesTags: [tagTypes.inventory, tagTypes.product],
    }),
    getStockLevels: build.query<any, any>({
      query: (params) => ({
        url: "/stock-levels",
        method: "GET",
        params,
      }),
      transformResponse: (response: any) => response.data,
      providesTags: [tagTypes.inventory],
    }),
    getProductStockLevel: build.query<any, string>({
      query: (productId) => ({
        url: `/product/${productId}`,
        method: "GET",
      }),
      transformResponse: (response: any) => response.data,
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
  useGetLedgerQuery,
  useCreateAdjustmentMutation,
  useGetStockLevelsQuery,
  useGetProductStockLevelQuery,
} = (injectedInventoryApi || hooks) as any;

export default inventoryApi;
