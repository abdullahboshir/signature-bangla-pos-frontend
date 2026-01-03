import { tagTypes } from "../../../tag-types";
import { createCrudApi } from "../../base/createCrudApi";

const { api: purchaseReportApi, hooks } = createCrudApi({
  resourceName: 'purchase-report',
  baseUrl: '/super-admin/reports/purchase',
  tagType: 'PurchaseReport' as any,
});

const extendedPurchaseReportApi = purchaseReportApi.injectEndpoints({
  endpoints: (build) => ({
    getPurchaseSummary: build.query({
      query: (params) => ({
        url: '/super-admin/reports/purchase/summary',
        method: 'GET',
        params,
      }),
      providesTags: ['PurchaseReport' as any],
    }),
  }),
});

export const { useGetPurchaseSummaryQuery } = extendedPurchaseReportApi;
export default purchaseReportApi;
