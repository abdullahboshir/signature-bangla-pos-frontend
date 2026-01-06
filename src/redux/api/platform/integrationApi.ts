import { baseApi } from "../../api/base/baseApi";
import { tagTypes } from "../../tag-types";

export const integrationApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getIntegrations: build.query({
      query: (arg: Record<string, any>) => ({
        url: "/platform/integrations",
        method: "GET",
        params: arg,
      }),
      providesTags: [tagTypes.integration],
    }),
    createIntegration: build.mutation({
      query: (data) => ({
        url: "/platform/integrations",
        method: "POST",
        body: data,
      }),
      invalidatesTags: [tagTypes.integration],
    }),
    updateIntegration: build.mutation({
      query: (data) => ({
        url: `/platform/integrations/${data.id}`,
        method: "PATCH",
        body: data.body,
      }),
      invalidatesTags: [tagTypes.integration],
    }),
    deleteIntegration: build.mutation({
      query: (id) => ({
        url: `/platform/integrations/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [tagTypes.integration],
    }),
  }),
});

export const {
  useGetIntegrationsQuery,
  useCreateIntegrationMutation,
  useUpdateIntegrationMutation,
  useDeleteIntegrationMutation,
} = integrationApi;
