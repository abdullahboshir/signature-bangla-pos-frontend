import { tagTypes } from "../../tag-types";
import { createCrudApi } from "../base/createCrudApi";

const { api: purchaseApi, hooks } = createCrudApi({
  resourceName: 'purchase',
  baseUrl: '/super-admin/purchases',
  tagType: tagTypes.purchase,
});

export const {
  useCreatePurchaseMutation,
  useGetPurchasesQuery,
  useGetPurchaseQuery,
  useUpdatePurchaseMutation,
  useDeletePurchaseMutation,
} = hooks;

export default purchaseApi;


