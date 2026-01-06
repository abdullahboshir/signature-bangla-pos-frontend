import { baseApi } from "../../api/base/baseApi";
import { tagTypes } from "../../tag-types";

export const reportApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getProfitLoss: build.query({
      query: (arg: Record<string, any>) => ({
        url: "/finance/reports/profit-loss",
        method: "GET",
        params: arg,
      }),
      providesTags: [tagTypes.ProfitLossReport],
    }),
    getBalanceSheet: build.query({
      query: (arg: Record<string, any>) => ({
        url: "/finance/reports/balance-sheet",
        method: "GET",
        params: arg,
      }),
      providesTags: [tagTypes.ProfitLossReport],
    }),
  }),
});

export const {
  useGetProfitLossQuery,
  useGetBalanceSheetQuery,
} = reportApi;
