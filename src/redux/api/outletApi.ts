import { tagTypes } from "../tag-types";
import { createCrudApi } from "./base/createCrudApi";

const { api: outletApi, hooks } = createCrudApi({
  resourceName: 'outlet',
  baseUrl: '/super-admin/outlets',
  tagType: tagTypes.outlet,
});

export const {
  useCreateOutletMutation,
  useGetOutletsQuery,
  useGetOutletQuery,
  useUpdateOutletMutation,
  useDeleteOutletMutation,
} = hooks;

export default outletApi;
