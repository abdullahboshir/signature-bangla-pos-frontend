import { tagTypes } from "../../tag-types";
import { createCrudApi } from "../base/createCrudApi";

const { api: taxApi, hooks } = createCrudApi({
  resourceName: 'tax',
  baseUrl: '/super-admin/taxes',
  tagType: tagTypes.tax,
});

export const {
  useCreateTaxMutation,
  useGetTaxsQuery,
  useGetTaxQuery,
  useUpdateTaxMutation,
  useDeleteTaxMutation,
} = hooks;

export default taxApi;


