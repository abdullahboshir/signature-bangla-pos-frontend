import { tagTypes } from "../../../tag-types";
import { createCrudApi } from "../../base/createCrudApi";

// Reports are usually read-only, but createCrudApi provides a good base. 
// We might need custom endpoints for specific report params.

const { api: salesReportApi, hooks } = createCrudApi({
  resourceName: 'sales-report',
  baseUrl: '/super-admin/reports/sales',
  tagType: 'SalesReport' as any, // Temporary until added to tagTypes
});

export const {
  useGetSalesReportsQuery, // This might fallback to 'get list'
} = hooks;

// Custom endpoint for detailed report with date range
const extendedSalesReportApi = salesReportApi.injectEndpoints({
  endpoints: (build) => ({
    getSalesSummary: build.query({
      query: (params) => ({
        url: '/super-admin/reports/sales/summary',
        method: 'GET',
        params,
      }),
      providesTags: ['SalesReport' as any],
    }),
  }),
});

export const { useGetSalesSummaryQuery } = extendedSalesReportApi;
export default salesReportApi;
