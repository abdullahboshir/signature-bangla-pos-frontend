import { tagTypes } from "../../tag-types";
import { createCrudApi } from "../base/createCrudApi";

const { api: attributeGroupApi, hooks } = createCrudApi({
  resourceName: 'attributeGroup',
  baseUrl: '/super-admin/attribute-groups',
  tagType: tagTypes.attributeGroup,
});

export const {
  useCreateAttributeGroupMutation,
  useGetAttributeGroupsQuery,
  useGetAttributeGroupQuery,
  useUpdateAttributeGroupMutation,
  useDeleteAttributeGroupMutation,
} = hooks;

export default attributeGroupApi;


