import { tagTypes } from "../tag-types";
import { createCrudApi } from "./base/createCrudApi";

const { api: inventoryApi, hooks } = createCrudApi({
  resourceName: 'inventory',
  baseUrl: '/super-admin/inventory',
  tagType: tagTypes.inventory,
});

export const {
  useCreateInventoryMutation,
  useGetInventorysQuery,
  useGetInventoryQuery,
  useUpdateInventoryMutation,
  useDeleteInventoryMutation,
} = hooks;

export default inventoryApi;
