import { tagTypes } from "../../tag-types";
import { createCrudApi } from "../base/createCrudApi";

const { api: orderApi, hooks } = createCrudApi({
  resourceName: 'order',
  baseUrl: '/super-admin/orders',
  tagType: tagTypes.order,
});

export const {
  useCreateOrderMutation,
  useGetOrdersQuery,
  useGetOrderQuery,
  useUpdateOrderMutation,
  useDeleteOrderMutation,
} = hooks;

export default orderApi;


