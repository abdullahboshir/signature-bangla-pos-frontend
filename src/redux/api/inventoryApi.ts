import { baseApi } from './base/baseApi';
import { tagTypes } from '../tag-types';

export const inventoryApi = baseApi.injectEndpoints({
    endpoints: (build) => ({
        getStockLevels: build.query({
            query: (params) => ({
                url: '/inventory/stock-levels',
                method: 'GET',
                params,
            }),
            providesTags: [tagTypes.Inventory],
        }),
        getProductStockLevel: build.query({
            query: (id) => ({
                url: `/inventory/stock-levels/${id}`,
                method: 'GET',
            }),
            providesTags: [tagTypes.Inventory],
        }),
        getAdjustments: build.query({
            query: (params) => ({
                url: '/inventory/adjustments',
                method: 'GET',
                params,
            }),
            providesTags: [tagTypes.InventoryAdjustment],
        }),
        createAdjustment: build.mutation({
            query: (data) => ({
                url: '/inventory/adjustments',
                method: 'POST',
                body: data,
            }),
            invalidatesTags: [tagTypes.InventoryAdjustment, tagTypes.Inventory, tagTypes.product],
        }),
        getLedger: build.query({
            query: (params) => ({
                url: '/inventory/ledger',
                method: 'GET',
                params,
            }),
            providesTags: [tagTypes.InventoryLedger],
        }),
    }),
});

export const {
    useGetStockLevelsQuery,
    useGetProductStockLevelQuery,
    useGetAdjustmentsQuery,
    useCreateAdjustmentMutation,
    useGetLedgerQuery,
} = inventoryApi;
