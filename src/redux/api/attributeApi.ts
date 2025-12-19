import { tagTypes } from "../tag-types";
import { baseApi } from "./base/baseApi";

export const attributeApi = baseApi.injectEndpoints({
    endpoints: (build) => ({
        // Create Attribute
        createAttribute: build.mutation({
            query: (data) => ({
                url: "/super-admin/attributes/create",
                method: "POST",
                data,
            }),
            invalidatesTags: [tagTypes.attribute],
        }),

        // Get All Attributes
        getAttributes: build.query({
            query: (params) => ({
                url: "/super-admin/attributes",
                method: "GET",
                params,
            }),
            providesTags: [tagTypes.attribute],
            transformResponse: (response: any) => response.data?.data?.result || response.data?.data || response.data?.result || response.data || [],
        }),

        // Get Single Attribute
        getAttribute: build.query({
            query: (id) => ({
                url: `/super-admin/attributes/${id}`,
                method: "GET",
            }),
            providesTags: (result, error, id) => [{ type: tagTypes.attribute, id }],
            transformResponse: (response: any) => response.data?.data || response.data,
        }),

        // Update Attribute
        updateAttribute: build.mutation({
            query: (data) => ({
                url: `/super-admin/attributes/${data.id}`,
                method: "PATCH",
                data: data.body,
            }),
            invalidatesTags: [tagTypes.attribute],
        }),

        // Delete Attribute
        deleteAttribute: build.mutation({
            query: (id) => ({
                url: `/super-admin/attributes/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: [tagTypes.attribute],
        }),
    }),
});

export const {
    useCreateAttributeMutation,
    useGetAttributesQuery,
    useGetAttributeQuery,
    useUpdateAttributeMutation,
    useDeleteAttributeMutation,
} = attributeApi;
