import { tagTypes } from "../../tag-types";
import { createCrudApi } from "../base/createCrudApi";

const { api: customerApi, hooks } = createCrudApi({
  resourceName: 'customer',
  baseUrl: '/super-admin/customers',
  tagType: tagTypes.customer,
});

export const {
  useCreateCustomerMutation,
  useGetCustomersQuery,
  useGetCustomerQuery,
  useUpdateCustomerMutation,
  useDeleteCustomerMutation,
} = hooks;

export default customerApi;

