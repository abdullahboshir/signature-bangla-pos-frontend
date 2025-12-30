import { tagTypes } from "../../tag-types";
import { createCrudApi } from "../base/createCrudApi";

const { api: supplierApi, hooks } = createCrudApi({
  resourceName: 'supplier',
  baseUrl: '/super-admin/suppliers',
  tagType: tagTypes.supplier,
});

export const {
  useCreateSupplierMutation,
  useGetSuppliersQuery,
  useGetSupplierQuery,
  useUpdateSupplierMutation,
  useDeleteSupplierMutation,
} = hooks;

export default supplierApi;


