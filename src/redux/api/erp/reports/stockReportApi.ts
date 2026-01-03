import { tagTypes } from "../../../tag-types";
import { createCrudApi } from "../../base/createCrudApi";

const { api: stockReportApi, hooks } = createCrudApi({
  resourceName: 'stock-report',
  baseUrl: '/super-admin/reports/stock',
  tagType: 'StockReport' as any,
});

const extendedStockReportApi = stockReportApi.injectEndpoints({
  endpoints: (build) => ({
    getStockSummary: build.query({
      query: (params) => ({
        url: '/super-admin/reports/stock/summary',
        method: 'GET',
        params,
      }),
      providesTags: ['StockReport' as any],
    }),
  }),
});

export const { useGetStockSummaryQuery } = extendedStockReportApi;
export default stockReportApi;
