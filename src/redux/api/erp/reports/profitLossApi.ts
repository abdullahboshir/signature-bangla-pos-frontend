import { tagTypes } from "../../../tag-types";
import { createCrudApi } from "../../base/createCrudApi";

const { api: profitLossApi, hooks } = createCrudApi({
  resourceName: 'profit-loss',
  baseUrl: '/super-admin/reports/profit-loss',
  tagType: 'ProfitLossReport' as any,
});

const extendedProfitLossApi = profitLossApi.injectEndpoints({
  endpoints: (build) => ({
    getProfitLossSummary: build.query({
      query: (params) => ({
        url: '/super-admin/reports/profit-loss/summary',
        method: 'GET',
        params,
      }),
      providesTags: ['ProfitLossReport' as any],
    }),
  }),
});

export const { useGetProfitLossSummaryQuery } = extendedProfitLossApi;
export default profitLossApi;
