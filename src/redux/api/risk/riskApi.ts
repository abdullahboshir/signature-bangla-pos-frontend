import { baseApi } from "../base/baseApi";
import { tagTypes } from "../../tag-types";

export const riskApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    // Blacklist
    createBlacklistEntry: build.mutation({
      query: (data) => ({
        url: "/super-admin/risk/blacklist",
        method: "POST",
        body: data,
      }),
      invalidatesTags: [tagTypes.blacklist],
    }),
    getAllBlacklistEntries: build.query({
      query: (arg: Record<string, any>) => ({
        url: "/super-admin/risk/blacklist",
        method: "GET",
        params: arg,
      }),
      providesTags: [tagTypes.blacklist],
    }),
    deleteBlacklistEntry: build.mutation({
      query: (id) => ({
        url: `/super-admin/risk/blacklist/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [tagTypes.blacklist],
    }),

    // Fraud Check
    checkFraud: build.mutation({
      query: (data) => ({
        url: "/super-admin/risk/check",
        method: "POST",
        body: data,
      }),
    }),
    
    // Risk Rules
    getAllRiskRules: build.query({
        query: (arg) => ({
            url: "/super-admin/risk/rules",
            method: "GET",
            params: arg
        }),
        providesTags: [tagTypes.riskRule]
    }),
    createRiskRule: build.mutation({
        query: (data) => ({
            url: "/super-admin/risk/rules",
            method: "POST",
            body: data
        }),
        invalidatesTags: [tagTypes.riskRule]
    }),
    deleteRiskRule: build.mutation({
        query: (id) => ({
            url: `/super-admin/risk/rules/${id}`,
            method: "DELETE"
        }),
        invalidatesTags: [tagTypes.riskRule]
    })
  }),
});

export const {
  useCreateBlacklistEntryMutation,
  useGetAllBlacklistEntriesQuery,
  useDeleteBlacklistEntryMutation,
  useCheckFraudMutation,
  useGetAllRiskRulesQuery,
  useCreateRiskRuleMutation,
  useDeleteRiskRuleMutation
} = riskApi;

