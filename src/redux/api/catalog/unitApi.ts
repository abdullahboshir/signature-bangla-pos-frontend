import { tagTypes } from "../../tag-types";
import { createCrudApi } from "../base/createCrudApi";

const { api: unitApi, hooks } = createCrudApi({
  resourceName: 'unit',
  baseUrl: '/super-admin/units',
  tagType: tagTypes.unit,
});

export const {
  useCreateUnitMutation,
  useGetUnitsQuery,
  useGetUnitQuery,
  useUpdateUnitMutation,
  useDeleteUnitMutation,
} = hooks;

export default unitApi;


