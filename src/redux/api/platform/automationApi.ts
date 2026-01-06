import { baseApi } from "../../api/base/baseApi";
import { tagTypes } from "../../tag-types";

export const automationApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getAutomationRules: build.query({
      query: (arg: Record<string, any>) => ({
        url: "/platform/automation/rules",
        method: "GET",
        params: arg,
      }),
      providesTags: ['automation' as any],
    }),
    createAutomationRule: build.mutation({
      query: (data) => ({
        url: "/platform/automation/rules",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ['automation' as any],
    }),
    updateAutomationRule: build.mutation({
      query: ({ id, ...data }) => ({
        url: `/platform/automation/rules/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ['automation' as any],
    }),
    deleteAutomationRule: build.mutation({
      query: (id) => ({
        url: `/platform/automation/rules/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ['automation' as any],
    }),
  }),
});

export const {
  useGetAutomationRulesQuery,
  useCreateAutomationRuleMutation,
  useUpdateAutomationRuleMutation,
  useDeleteAutomationRuleMutation,
} = automationApi;
