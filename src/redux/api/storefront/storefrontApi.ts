import { baseApi } from "../base/baseApi";
import { tagTypes } from "../../tag-types";

export const storefrontApi = baseApi.injectEndpoints({
    endpoints: (build) => ({
        // Public Endpoints
        getStoreConfig: build.query({
            query: (businessUnitId) => ({
                url: `/public/storefront/${businessUnitId}/config`,
                method: "GET",
            }),
            providesTags: [tagTypes.storefrontConfig],
        }),
        getStorePage: build.query({
            query: ({ businessUnitId, slug }) => ({
                url: `/super-admin/storefront/${businessUnitId}/pages/${slug}`, // Technically public route
                method: "GET",
            }),
            transformResponse: (response: any) => response.data || response,
            providesTags: [tagTypes.storePage],
        }),
        getStoreProducts: build.query({
            query: ({ businessUnitId, params }) => ({
                url: `/super-admin/storefront/${businessUnitId}/products`,
                method: "GET",
                params,
            }),
            transformResponse: (response: any) => response.data || response,
        }),

        // Admin Endpoints
        updateStoreConfig: build.mutation({
            query: ({ businessUnitId, data }) => ({
                url: `/super-admin/storefront/${businessUnitId}/config`,
                method: "PATCH",
                data: data,
            }),
            invalidatesTags: [tagTypes.storefrontConfig],
        }),
        getAllPages: build.query({
            query: (businessUnitId) => ({
                url: `/super-admin/storefront/${businessUnitId}/pages`,
                method: "GET",
            }),
            providesTags: [tagTypes.storePageList],
        }),
        savePage: build.mutation({
            query: ({ businessUnitId, data }) => ({
                url: `/super-admin/storefront/${businessUnitId}/pages`,
                method: "POST",
                data: data,
            }),
            invalidatesTags: [tagTypes.storePage, tagTypes.storePageList],
        }),
        deletePage: build.mutation({
            query: ({ businessUnitId, pageId }) => ({
                url: `/super-admin/storefront/${businessUnitId}/pages/${pageId}`,
                method: "DELETE",
            }),
            invalidatesTags: [tagTypes.storePageList],
        }),
    }),
});

export const {
    useGetStoreConfigQuery,
    useGetStorePageQuery,
    useGetStoreProductsQuery,
    useUpdateStoreConfigMutation,
    useGetAllPagesQuery,
    useSavePageMutation,
    useDeletePageMutation
} = storefrontApi;

